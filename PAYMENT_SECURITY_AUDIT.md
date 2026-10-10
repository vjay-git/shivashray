# Hotel Booking Engine — Payment, Refund & Financial Security Audit

**Audited:** 2026-05-13  
**Branch:** main  
**Scope:** Payment processing, refund flows, financial controls, PCI scope, reconciliation  
**Property:** Shiv Ashray, Varanasi

---

## Summary Table

| Severity | Count |
|----------|-------|
| Critical | 4 |
| High | 5 |
| Medium | 5 |
| Low | 4 |

---

## Foundational Finding: No Payment Gateway Exists

Before the per-issue findings, the most important structural fact:

**This system has no payment processing implementation of any kind.**

`requirements.txt` contains zero payment libraries. There is no Razorpay, Stripe, Cashfree, PayU, CCAvenue, or Paytm integration. No card tokenisation. No charge/capture flow. No webhook handler. No refund API call. 

The entire "payment system" is a manual label on a database row:

```python
# models/booking.py:14-17 — the entirety of the payment model
class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID    = "paid"
    REFUNDED = "refunded"

# bookings.py:91 — all bookings start here
payment_status=PaymentStatus.PENDING,
```

An admin marks a booking `PAID` after receiving cash or a UPI transfer out-of-band. No money movement is tracked by the system. This is not inherently wrong for a small property that collects payment at the desk — **but the codebase has several severe vulnerabilities in even this minimal model**, and the architecture creates critical risks that will compound when a gateway is eventually added.

The checklist items that require a payment gateway (gateway timeouts, 3DS redirects, card tokenisation, webhook HMAC, partial payment, currency mismatch, retry with different card) are marked **N/A — no gateway** and excluded from the findings below. The real findings are in the gaps within the system that actually exists.

---

## Critical

---

### PAY-01 — Guest can self-mark their own booking as PAID and CONFIRMED without paying

**[SEVERITY: critical]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L128-L154)

**Vulnerability:**  
The `PATCH /bookings/{id}` endpoint allows any authenticated user to update their **own** booking's `status` and `payment_status` to any value:

```python
# bookings.py:140-154
if booking.user_id != current_user.id and current_user.role.value != "admin":
    # Non-owner, non-admin: can only cancel
    if booking_update.status != BookingStatus.CANCELLED:
        raise HTTPException(status_code=403, ...)
    booking.status = BookingStatus.CANCELLED
else:
    # Owner OR admin: unrestricted write
    if booking_update.status:
        booking.status = booking_update.status        # ANY status
    if booking_update.payment_status:
        booking.payment_status = booking_update.payment_status  # ANY payment_status
```

A guest can:

1. Create a booking → `status=PENDING, payment_status=PENDING`
2. Send `PATCH /bookings/42` with `{"status": "confirmed", "payment_status": "paid"}`
3. Their booking is now `CONFIRMED` and `PAID` — without the hotel receiving any money

This bypasses the entire payment collection process. The admin dashboard revenue counter will count this booking, inflating reported revenue. The booking will appear valid to any status check.

**Fix:**  
Users must never be able to set `payment_status`. Only admins should control that field. Split the update path explicitly:

```python
# Users may only cancel their own booking
if booking.user_id == current_user.id and current_user.role.value != "admin":
    if booking_update.status == BookingStatus.CANCELLED:
        booking.status = BookingStatus.CANCELLED
    else:
        raise HTTPException(403, "Guests may only cancel their booking")
    # Never touch payment_status
    return booking

# Admins can update status and payment_status with transition validation
if current_user.role.value == "admin":
    # Apply transition guard (see BOOKING_FLOW_AUDIT BF-10)
    if booking_update.status:
        booking.status = booking_update.status
    if booking_update.payment_status:
        booking.payment_status = booking_update.payment_status
```

---

### PAY-02 — Admin can mark REFUNDED on a booking that was never PAID — phantom refund

**[SEVERITY: critical]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72) + [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L307-L312)

**Vulnerability:**  
The admin panel renders a "Mark as Paid" button for every booking regardless of current `payment_status`. The backend applies the update unconditionally:

```python
# admin.py:71-72 — no guard on current payment_status
if booking_update.payment_status:
    booking.payment_status = booking_update.payment_status
```

A `PENDING → REFUNDED` transition is accepted without error. When a payment gateway is integrated later, this state will be read to trigger an actual refund API call. A booking that was never charged will trigger a refund call for the full `total_amount` — the hotel pays the guest money that was never collected.

Additionally, the current admin UI has no "Mark as Refunded" button shown explicitly, but the `payment_status` field is settable via API directly. Any API client (or a future UI addition) can hit this path.

**Fix:**  
Enforce a payment status transition machine server-side:

```python
VALID_PAYMENT_TRANSITIONS = {
    PaymentStatus.PENDING:  {PaymentStatus.PAID},         # Only charge
    PaymentStatus.PAID:     {PaymentStatus.REFUNDED},     # Only refund after paid
    PaymentStatus.REFUNDED: set(),                        # Terminal state
}

current = booking.payment_status
if new_status not in VALID_PAYMENT_TRANSITIONS.get(current, set()):
    raise HTTPException(409, f"Cannot transition payment from {current} to {new_status}")
```

---

### PAY-03 — Revenue figure on admin dashboard counts self-marked and never-validated payments

**[SEVERITY: critical]** | [frontend/app/admin/page.tsx](frontend/app/admin/page.tsx#L41-L43)

**Vulnerability:**  
The dashboard revenue counter trusts `payment_status === 'paid'` as ground truth:

```ts
// admin/page.tsx:41-43
const revenue = response.data
  .filter((b: Booking) => b.payment_status === 'paid')
  .reduce((sum: number, b: Booking) => sum + b.total_amount, 0);
```

Since guests can self-mark their bookings as `PAID` (PAY-01), and since admin can accidentally mark `PAID` before receiving money, this revenue figure has no relationship to actual money received. An admin making business decisions (room pricing, occupancy targets, revenue goals) based on this dashboard is working with fabricated data.

The revenue number is also a JavaScript float reduction over potentially hundreds of records — floating-point addition accumulates rounding error for financial reporting (see PR-03 in `PRICING_REVENUE_AUDIT.md`).

**Fix:**  
- Fix PAY-01 first (remove user write access to `payment_status`)
- Introduce a `payment_ledger` table with one row per actual payment event (charge, void, refund), each with an amount, timestamp, and source. Revenue is computed from the ledger, not from a status flag
- Use integer arithmetic (paise) or `Decimal` for the reduction, never `float` accumulation

---

### PAY-04 — No check-in gate on payment — hotel can admit an unpaid guest with no system alert

**[SEVERITY: critical]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L145-L146)

**Vulnerability:**  
There is no coupling between `payment_status` and `status`. An admin can transition a booking from `CONFIRMED → CHECKED_IN` on a booking with `payment_status=PENDING` — admitting a guest who has not paid. The system provides no warning, no block, and no audit flag for this case.

In a manual-payment model (cash/UPI at desk), this is the primary financial control point: the desk staff must confirm payment before handing over the key. The current system has no mechanism to enforce or even surface this requirement.

**Fix:**  
Add a soft gate in the status transition logic for `CONFIRMED → CHECKED_IN`:

```python
# When transitioning to CHECKED_IN, warn or block if unpaid
if new_status == BookingStatus.CHECKED_IN and booking.payment_status == PaymentStatus.PENDING:
    raise HTTPException(409, detail={
        "code": "PAYMENT_PENDING",
        "message": "Cannot check in: payment has not been confirmed. Mark as paid first."
    })
```

If the hotel sometimes accepts payment after check-in, make this a warning in the UI that requires explicit override acknowledgement, not a silent pass.

---

## High

---

### PAY-05 — Double-refund possible: REFUNDED status can be set repeatedly with no guard

**[SEVERITY: high]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72)

**Vulnerability:**  
Once a `REFUNDED` transition is applied, setting `payment_status=REFUNDED` again via `PATCH /admin/bookings/{id}` is accepted without error. In a manual model this is cosmetically harmless. But:

1. When a payment gateway is integrated and `REFUNDED` status triggers an actual refund API call, this becomes a double-refund bug — the guest is credited twice
2. Any webhook-based refund processor that fires on status change will fire twice
3. There is no idempotency guard anywhere in the update path

**Fix:**  
The transition machine from PAY-02 resolves this: `VALID_PAYMENT_TRANSITIONS[REFUNDED] = set()` makes `REFUNDED` a terminal state that rejects any further transition.

---

### PAY-06 — No payment event audit log — zero forensic trail for disputes and reconciliation

**[SEVERITY: high]** | [backend/app/models/booking.py](backend/app/models/booking.py#L32) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72)

**Vulnerability:**  
The only payment record is `payment_status` (a single enum column) and `updated_at` (a single timestamp). There is no record of:

- Who changed `payment_status` and when
- What it was changed from
- What external reference (UPI transaction ID, cash receipt number) was associated with the payment
- Whether a refund was issued and to which instrument

For a registered GST entity collecting INR payments, this level of record-keeping fails basic accounting standards. In a guest dispute ("I paid but the booking shows pending"), there is no evidence to resolve the claim. In a tax audit, there is no transaction journal.

**Fix:**  
Add a `PaymentEvent` table:

```python
class PaymentEvent(Base):
    __tablename__ = "payment_events"
    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    event_type = Column(Enum("charged", "voided", "refunded", "status_updated"),
                        nullable=False)
    amount = Column(Numeric(12, 2), nullable=True)        # null for status-only changes
    currency = Column(String(3), default="INR")
    reference = Column(String, nullable=True)             # UPI txn ID, cash receipt no.
    actor_user_id = Column(Integer, ForeignKey("users.id"))  # Who made the change
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

Write a `PaymentEvent` row on every `payment_status` change. This table becomes the audit log, the reconciliation source, and the dispute evidence.

---

### PAY-07 — `payment_status=REFUNDED` settable on a booking that is still CONFIRMED or CHECKED_IN

**[SEVERITY: high]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72) + [backend/app/models/booking.py](backend/app/models/booking.py#L32)

**Vulnerability:**  
There is no check that a booking must be `CANCELLED` or `CHECKED_OUT` before a refund is issued. An admin can mark a `CONFIRMED` booking as `REFUNDED` while the guest is still expected to arrive. The room remains blocked by the booking (availability check looks at `CONFIRMED` status), but the system now shows the payment as refunded — inconsistent state that will be invisible until check-in day.

**Fix:**  
Validate the booking status before allowing a refund transition:

```python
if new_payment_status == PaymentStatus.REFUNDED:
    if booking.status not in (BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT, BookingStatus.NO_SHOW):
        raise HTTPException(409, "Refund can only be issued on cancelled or completed bookings")
```

---

### PAY-08 — Cancellation policy advertised as "full refund within 3 days" but no refund is ever triggered

**[SEVERITY: high]** | [frontend/lib/content/hotel-content.ts](frontend/lib/content/hotel-content.ts#L69) + [frontend/components/home/ExclusiveDeals.tsx](frontend/components/home/ExclusiveDeals.tsx#L13) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L156-L171)

**Vulnerability:**  
The marketing site promises "full refund" in multiple places:

- `hotel-content.ts:69`: *"Cancellation must be made at least 3 days prior to check-in date for a full refund"*
- `ExclusiveDeals.tsx:13`: *"Cancel up to 3 days before check-in for a full refund. No questions asked."*
- `terms/page.tsx:164`: Implies charges apply for late cancellation

`DELETE /bookings/{id}` sets `status = CANCELLED` and returns 204. No `payment_status` change. No refund instruction. No calculation of whether the guest is within the free-cancellation window. The guest believes a refund will be issued; the system does nothing.

If the guest paid (in a future gateway integration), they have a legal basis to dispute the charge (Reserve Bank of India chargeback rules; Consumer Protection Act 2019 right to refund). The system cannot defend the dispute because it has no record that the cancellation policy was enforced.

**Fix:**  
At minimum, compute the cancellation window on `DELETE /bookings/{id}` and record the outcome:

```python
FREE_CANCELLATION_HOURS = 72  # 3 days

hours_to_checkin = (booking.check_in_date - datetime.now(tz=timezone.utc)).total_seconds() / 3600
if hours_to_checkin >= FREE_CANCELLATION_HOURS:
    refund_eligibility = "full_refund"
    booking.payment_status = PaymentStatus.REFUNDED  # Or queue for gateway refund
else:
    refund_eligibility = "no_refund"  # Non-refundable window

# Write a PaymentEvent with eligibility and timestamp
```

Return the refund eligibility in the cancellation response so the frontend can display it.

---

### PAY-09 — Admin revenue stat aggregates all bookings but renders only 10 — silent data truncation

**[SEVERITY: high]** | [frontend/app/admin/page.tsx](frontend/app/admin/page.tsx#L38-L44) + [frontend/app/admin/page.tsx](frontend/app/admin/page.tsx#L200)

**Vulnerability:**  
Revenue is correctly calculated over all bookings fetched from the API:

```ts
// admin/page.tsx:41-43 — all records
const revenue = response.data
  .filter((b: Booking) => b.payment_status === 'paid')
  .reduce((sum, b) => sum + b.total_amount, 0);
```

But the bookings table renders only the first 10:

```ts
// admin/page.tsx:200
{bookings.slice(0, 10).map((booking, index) => (
```

The `GET /admin/bookings` endpoint has no pagination (noted in L-04 of `BOOKING_FLOW_AUDIT.md`). As booking volume grows, the single unbounded fetch becomes slower and the page becomes laggy — but revenue will still be computed from the full unsorted dataset. More critically: when pagination is eventually added to the API, the revenue stat will silently drop to being calculated from only the first page of results, giving a massively understated revenue figure with no visible error.

**Fix:**  
Move revenue calculation to the backend as a dedicated `GET /admin/analytics/revenue` endpoint that runs an aggregated `SUM` query. Never compute revenue by fetching all records to the frontend.

---

## Medium

---

### PAY-10 — No server-side amount validation before payment confirmation — client-sent total trusted implicitly

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L52-L78) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L72)

**Vulnerability:**  
When a payment gateway is integrated, the charge amount will need to come from somewhere. If it comes from `booking.total_amount`, and `total_amount` was calculated by the backend during booking creation (which it is — see PR-04 in `PRICING_REVENUE_AUDIT.md`), that is correct. However, there is currently no mechanism that:

- Locks `total_amount` after booking creation (an admin could change it via a hypothetical update endpoint)
- Validates `total_amount` against a freshly recalculated amount before charging
- Prevents `total_amount = 0` from being charged (zero-amount charge accepted by most gateways but bypasses billing)

If any future code path allows `total_amount` to be modified post-creation (e.g., an admin discount applied via PATCH), a charge must re-validate the amount against business rules before executing.

**Fix:**  
Mark `total_amount` as immutable after creation. Add a `price_breakdown` JSON column (see PR-15 in `PRICING_REVENUE_AUDIT.md`) so any gateway charge can be verified against the stored breakdown. Before calling a gateway charge API, always recalculate from the breakdown and compare with `total_amount` within a tolerance.

---

### PAY-11 — Refund IDOR: user can attempt to trigger refund status on another user's booking

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L128-L154)

**Vulnerability:**  
The `PATCH /bookings/{id}` ownership check is: if `booking.user_id != current_user.id AND not admin` → block. This means: if `booking.user_id == current_user.id`, ANY `payment_status` value is accepted. A user cannot update another user's booking payment status. However, PAY-01 showed users can set their own to any value. The IDOR direction (user A affecting user B's financial record) is correctly blocked by the ownership check. 

The remaining risk is subtler: the admin dashboard endpoint `PATCH /admin/bookings/{id}` is protected by `get_current_admin_user`, but the general `PATCH /bookings/{id}` endpoint is not guarded sufficiently (PAY-01). When a payment gateway is added, both paths must be audited for IDOR before any real money movement is wired in.

**Fix:**  
Resolve PAY-01 first. Then ensure only `PATCH /admin/bookings/{id}` can change `payment_status`, and `PATCH /bookings/{id}` never touches financial fields.

---

### PAY-12 — No idempotency for admin payment-status updates — double submission races possible in UI

**[SEVERITY: medium]** | [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L39-L53) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L58-L78)

**Vulnerability:**  
The admin status update button sets `updating = true` while the request is in-flight (line 40) and re-enables on completion (line 52). However, on a slow network, an admin can click "Mark as Paid" and, before the spinner shows, click again — sending two concurrent `PATCH` requests. The backend applies both. Currently this has no visible effect (both set the same enum value). But when a gateway is integrated and `PAID` status triggers a charge capture, two concurrent requests will fire two captures.

**Fix:**  
Add a `useRef` guard identical to BF-16's recommendation in `BOOKING_FLOW_AUDIT.md`. On the backend, add an idempotency check: if `payment_status` is already the target value, return 200 immediately without re-executing any side effects.

---

### PAY-13 — PCI-DSS scope not isolated — no tokenisation plan in place

**[SEVERITY: medium]** | [backend/requirements.txt](backend/requirements.txt) + [frontend/lib/api.ts](frontend/lib/api.ts)

**Vulnerability:**  
There is currently no PCI exposure because no card data passes through the system. However, there is also no architectural plan that keeps it this way when a gateway is added. Common mistakes when integrating a payment gateway without a prior architecture decision:

- Posting card numbers via the custom API (makes the entire backend PCI in-scope)
- Logging request bodies that contain card fields (violates PCI Requirement 3)
- Storing CVV even temporarily in the session or database (prohibited absolutely under PCI DSS)
- Not using the gateway's hosted fields / payment elements (which would isolate the frontend from card data)

If card data ever touches this backend — even for a millisecond in a log line — the entire system is PCI in-scope and requires formal audit.

**Fix:**  
Before integrating any gateway, decide on the tokenisation architecture. For Indian gateways (Razorpay, Cashfree, Paytm):

- Use the gateway's **hosted checkout** or **payment elements** (JavaScript SDK renders the card form inside a gateway-controlled iframe)
- Backend receives only a **payment token / order ID** — never card numbers or CVV
- The backend must never log raw request bodies for any payment-adjacent endpoint
- Add `pii_sanitize()` middleware that strips known sensitive field names from all logs before any gateway integration goes live

---

### PAY-14 — No fraud detection or failed-attempt logging

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py) + [backend/app/api/v1/auth.py](backend/app/api/v1/auth.py)

**Vulnerability:**  
There is no logging of failed booking attempts, repeated booking-then-cancel patterns, or any signal that could indicate fraudulent booking behaviour (e.g., blocking a room repeatedly with PENDING bookings that expire, or creating many bookings with similar PII variations). In a manual-payment model, fraud typically takes the form of room-blocking (squatting on inventory without intent to pay) or false-name bookings.

The auth layer has no rate limiting on login attempts (`/auth/login`). An attacker can brute-force credentials indefinitely.

**Fix:**  
Short term: add a `booking_attempts` counter or use FastAPI's `slowapi` rate-limiter on the booking and login endpoints. Log all booking creations with IP address. Long term: build a `FraudSignal` table that records repeated same-IP bookings, repeated cancellations by the same user, and PII similarity across bookings.

---

## Low

---

### PAY-15 — Terms page mentions financial penalties but booking DELETE API ignores them

**[SEVERITY: low]** | [frontend/app/terms/page.tsx](frontend/app/terms/page.tsx#L164) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L156-L171)

**Vulnerability:**  
The terms page states: *"Cancellations made less than 3 days before check-in may be subject to charges as per your booking terms."* `DELETE /bookings/{id}` sets status to `CANCELLED` with no policy check. There is a contradiction between displayed legal terms and system behaviour. If a guest cancels 1 day before check-in and then disputes a penalty charge later, the system has no record of the cancellation window at the time of cancellation and cannot defend the hotel's position.

**Fix:**  
See PAY-08. Record the cancellation timestamp, check-in date delta, and applicable policy at the moment of cancellation in both the booking record and the `PaymentEvent` log.

---

### PAY-16 — Admin "Mark as Paid" button has no confirmation dialog — one-click financial action

**[SEVERITY: low]** | [frontend/app/admin/bookings/[id]/page.tsx](frontend/app/admin/bookings/%5Bid%5D/page.tsx#L307-L313)

**Vulnerability:**  
The "Mark as Paid" action is a single button click with no confirmation step:

```tsx
<button onClick={() => updateBookingStatus(booking.status, 'paid')} ...>
  Mark as Paid
</button>
```

Once clicked, the payment status is immediately committed. There is no "Are you sure?" dialog, no amount display, no UPI reference field. A desk staff member who accidentally clicks it on the wrong booking creates an incorrect payment record with no undo path (since `PAID → PENDING` is an invalid transition once PAY-02 is fixed).

**Fix:**  
Wrap the action in a confirmation modal that shows the booking reference, guest name, and amount. Add an optional `reference` text field for the UPI/cash receipt number. This also seeds the `PaymentEvent` log (PAY-06) with the external reference.

---

### PAY-17 — Revenue displayed as integer (maximumFractionDigits: 0) — paisa-level amounts hidden

**[SEVERITY: low]** | [frontend/app/admin/page.tsx](frontend/app/admin/page.tsx#L173)

**Vulnerability:**  
```ts
₹{stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
```

The display rounds to whole rupees. If fractional prices exist (once `extra_adult_price` or `child_price` result in sub-rupee amounts after GST), the displayed revenue will be lower than actual. Over many bookings, the visual truncation accumulates. For example, 500 bookings each with a ₹0.50 rounding difference = ₹250 silently dropped from the dashboard display.

**Fix:**  
Display two decimal places for revenue, or use a backend-aggregated `SUM` (which would be in `NUMERIC(12,2)` once PR-03 is applied) and format it with `toFixed(2)`.

---

### PAY-18 — No webhook infrastructure — future gateway integration has no foundation

**[SEVERITY: low]** | [backend/app/main.py](backend/app/main.py)

**Vulnerability:**  
When a payment gateway is integrated, it will need to send webhooks for: payment success, payment failure, refund processed, chargeback initiated, and settlement complete. There is no webhook router, no signature verification middleware, no event queue, and no idempotency store for webhook events. Building this from scratch under the time pressure of a gateway go-live creates the risk of:

- Processing webhooks without signature verification (any HTTP client can fake a payment success)
- Processing the same webhook twice (gateway retries on 5xx responses)
- Not handling out-of-order webhook delivery (refund webhook arriving before payment webhook)

**Fix:**  
Create the webhook infrastructure before the gateway integration, not during it. A minimal skeleton:

```python
# A dedicated router with signature verification middleware
@router.post("/webhooks/payment", include_in_schema=False)
async def payment_webhook(
    request: Request,
    x_gateway_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    body = await request.body()
    if not verify_gateway_hmac(body, x_gateway_signature, settings.GATEWAY_WEBHOOK_SECRET):
        raise HTTPException(400, "Invalid webhook signature")
    
    event = json.loads(body)
    idempotency_key = event["event_id"]
    
    # Check if already processed
    if db.query(WebhookEvent).filter_by(event_id=idempotency_key).first():
        return {"status": "already_processed"}
    
    # Process and record
    db.add(WebhookEvent(event_id=idempotency_key, payload=event, processed_at=func.now()))
    # ... apply state changes ...
    db.commit()
    return {"status": "ok"}
```

---

## Checklist Coverage

| Checklist Item | Status | Finding |
|---|---|---|
| Card charge amount validated server-side | N/A | No gateway; but total_amount recalculation on backend is correct (see PR-04) |
| Booking confirmed but payment fails — room held? | N/A | No gateway; booking is always PENDING on creation regardless |
| Payment gateway timeout — booking left in limbo? | N/A | No gateway |
| 3DS/SCA redirect — booking state on window close? | N/A | No gateway |
| Partial payment — deposit tracked atomically? | N/A | No gateway; no partial payment concept |
| Payment retry with different card — prior charge voided? | N/A | No gateway |
| Currency mismatch | N/A | No gateway; INR only (see PR-11) |
| Refund to cancelled/expired card | N/A | No gateway |
| Idempotency keys on payment API calls | N/A | No gateway; but admin UI has double-click risk (PAY-12) |
| Webhook idempotent on duplicate delivery | N/A | No webhooks; foundation missing (PAY-18) |
| Refund exceeds original charge | Partial | `payment_status=REFUNDED` settable on never-PAID bookings (PAY-02); no amount guard |
| Raw card numbers ever logged | N/A | No card handling; PCI isolation plan missing (PAY-13) |
| PCI-DSS scope isolated (tokenisation) | N/A | No gateway; no tokenisation plan (PAY-13) |
| Payment webhooks verified with HMAC | N/A | No webhooks exist (PAY-18) |
| Booking total recalculated server-side before charge | Partial | Backend recalculates correctly; no price-lock enforcement (see PR-04) |
| Refund IDOR — user A refunds user B's booking | Partial | Cross-user IDOR blocked; own-booking payment manipulation possible (PAY-01, PAY-11) |
| Audit log of every charge/refund/void | Missing | No payment event log at all (PAY-06) |
| Same booking refunded twice | Missing | No terminal state guard; double-refund possible (PAY-05) |
| Failed payment attempts logged | N/A | No gateway; login brute-force also unlogged (PAY-14) |
| `payment_service` file | Missing | Does not exist |
| `refund_handler` file | Missing | Does not exist |
| `webhook_controller` file | Missing | Does not exist |
| `booking_payment_model` file | Partial | `PaymentStatus` enum on `Booking` model only; no separate payment model |
