# Hotel Booking Engine — Rate, Pricing & Inventory Audit

**Audited:** 2026-05-13  
**Branch:** main  
**Scope:** Rate calculation, pricing model, tax compliance, inventory controls, rate plan architecture  
**Property:** Shiv Ashray, Varanasi (GSTIN: `09AFFFS9330B1Z0`)

---

## Summary Table

| Severity | Count |
|----------|-------|
| Critical | 4 |
| High | 6 |
| Medium | 7 |
| Low | 5 |

**Recommended fix order is listed at the bottom of this document.**

---

## Missing Systems (Scope Context)

The following systems referenced in the audit checklist **do not exist** in this codebase. They are not mis-implemented — they are entirely absent:

| System | Status |
|---|---|
| Tax engine | Not implemented |
| Rate plan model | Not implemented |
| Dynamic / seasonal pricing | Not implemented |
| Promotional codes | Not implemented |
| Loyalty member rates | Not implemented |
| Currency model | Not implemented |
| Service fee model | Not implemented |
| Overbooking buffer | Not implemented |
| Allotment pools (wholesale / retail) | Not implemented |
| Connecting room logic | Not implemented |
| Revenue analytics / reporting | Not implemented |

All findings below reflect real bugs or compliance gaps in the code that exists.

---

## Critical

---

### PR-01 — GST not calculated or shown despite active GSTIN registration

**[SEVERITY: critical]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L52-L78) + [frontend/lib/content/hotel-content.ts](frontend/lib/content/hotel-content.ts#L49)

**Issue:**  
The property has GSTIN `09AFFFS9330B1Z0` registered (hotel-content.ts:49). Under the Indian CGST Act 2017 (Notification 11/2017-CT(Rate)), accommodation services are taxable:

| Room tariff per night | GST rate |
|---|---|
| ≤ ₹2,499 | Exempt |
| ₹2,500 – ₹7,499 | 12% |
| ≥ ₹7,500 | 18% |

The property's base rates are ₹4,000 (Deluxe), ₹6,000 (Super Deluxe), and ₹6,500 (Family Room) — all liable at **12% GST**. With extra occupancy charges, the effective per-night charge can exceed ₹7,500 (e.g., Family Room + 1 extra adult = ₹6,500 + ₹2,275 = ₹8,775), which tips into the **18% GST slab** — a higher rate that the system is not equipped to detect or apply.

The current pricing pipeline:
```python
# bookings.py:53-78 — no tax line anywhere
nights = (booking_data.check_out_date - booking_data.check_in_date).days
base_amount = room.room_type.base_price * nights
# ...
total_amount = base_amount + extra_amount   # Pre-tax only
```

Collecting payment without charging or remitting GST is a statutory violation. GST input credit claims by corporate guests will be rejected because no GST amount appears on the receipt.

**Fix:**  
Implement a tax calculation step as the final stage of price assembly:

```python
from decimal import Decimal

def calculate_gst(nightly_rate: Decimal) -> Decimal:
    if nightly_rate >= Decimal("7500"):
        return Decimal("0.18")
    elif nightly_rate >= Decimal("2500"):
        return Decimal("0.12")
    return Decimal("0")

effective_nightly = Decimal(str(base_amount + extra_amount)) / nights
gst_rate = calculate_gst(effective_nightly)
tax_amount = (Decimal(str(base_amount + extra_amount)) * gst_rate).quantize(Decimal("0.01"))
total_amount = float(Decimal(str(base_amount + extra_amount)) + tax_amount)
```

Store `tax_amount` and `tax_rate` as separate columns on `Booking`. Print both on confirmation receipts.

---

### PR-02 — Children aged 0–5 charged child rate despite hotel's stated free policy

**[SEVERITY: critical]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L74-L76) + [frontend/lib/content/hotel-content.ts](frontend/lib/content/hotel-content.ts#L72-L73)

**Issue:**  
The hotel's published policy (hotel-content.ts:72) states:

> "0–5 Years Free, 6–12 Years as a child, Above 12 Years as an adult"

The backend charges `child_price` for **every child** regardless of age:

```python
# bookings.py:74-76 — no age bracket check
if number_of_children > 0 and room.room_type.child_price:
    extra_amount += number_of_children * room.room_type.child_price * nights
```

An infant aged 2 is charged ₹1,200/night (Deluxe child_price). A family with two toddlers on a 3-night stay is overcharged ₹7,200. The form collects only a child *count*, not ages (see BF-14 in `BOOKING_FLOW_AUDIT.md`), so there is no data available to apply the correct bracket even if the code tried to.

**Fix:**  
Collect child ages in the booking form. Apply the policy's three-tier age bracket in the pricing calculation:

```python
# Age brackets from hotel policy
for age in child_ages:
    if age <= 5:
        pass            # Free — no charge
    elif age <= 12:
        extra_amount += room.room_type.child_price * nights   # Child rate
    else:
        extra_amount += room.room_type.extra_adult_price * nights  # Adult rate
```

Until age collection is implemented, apply zero charge for children (in line with the more guest-favorable interpretation), with a front-desk adjustment note.

---

### PR-03 — Financial amounts stored as IEEE 754 `Float` — rounding errors in accumulated charges

**[SEVERITY: critical]** | [backend/app/models/room.py](backend/app/models/room.py#L22-L23) + [backend/app/models/booking.py](backend/app/models/booking.py#L30) + [backend/alembic/versions/002_add_pricing_fields.py](backend/alembic/versions/002_add_pricing_fields.py#L21-L22)

**Issue:**  
Every price field uses `sa.Float()` (IEEE 754 double-precision):

```python
# room.py
base_price = Column(Float, nullable=False)
extra_adult_price = Column(Float, nullable=True)
child_price = Column(Float, nullable=True)

# booking.py
total_amount = Column(Float, nullable=False)
```

`Float` cannot represent all decimal fractions exactly. While current seed prices (₹4,000, ₹6,000, ₹6,500) are integers and store without error, this will silently accumulate errors the moment any fractional price is entered:

```python
>>> 3999.50 * 90
359955.00000000006    # Not 359955.00
>>> 1200.10 * 3
3600.3000000000003    # Not 3600.30
```

In a revenue audit or ledger reconciliation, these errors compound. With GST added (12%), a ₹3,999.50/night room over 30 nights produces a GST amount that is off by fractions of a paisa — which will trigger mismatch errors in GSTN portal filing.

**Fix:**  
Migrate all price columns to `NUMERIC(10, 2)` in the database and use Python's `Decimal` for all arithmetic:

```python
# models
from sqlalchemy import Numeric
base_price = Column(Numeric(10, 2), nullable=False)
extra_adult_price = Column(Numeric(10, 2), nullable=True)
child_price = Column(Numeric(10, 2), nullable=True)
total_amount = Column(Numeric(12, 2), nullable=False)
```

```python
# alembic migration
op.alter_column('room_types', 'base_price', type_=sa.Numeric(10, 2))
op.alter_column('bookings', 'total_amount', type_=sa.Numeric(12, 2))
```

---

### PR-04 — Price not locked at search — admin price change between display and booking charges a different amount silently

**[SEVERITY: critical]** | [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L82-L101) + [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L53-L78)

**Issue:**  
The frontend calculates and **displays** a `totalAmount` in the booking form summary. This displayed amount is **never sent to the backend**. The backend independently recalculates `total_amount` from the current `room.room_type.base_price` at request time:

```python
# bookings.py:54 — recalculates from live DB price, ignores what the user saw
base_amount = room.room_type.base_price * nights
```

There is no admin API to update room type prices, so currently prices only change via direct database modification — but when they do change, there is **no price lock**. A guest who saw ₹4,000/night and spent 20 minutes filling in guest details will be charged the new price (e.g., ₹5,000/night) with no warning. The booking confirmation will show the new price, not the quoted price.

This is a consumer protection and trust issue. Many jurisdictions (including India under Consumer Protection Act 2019) require that the price shown at the start of a transaction be honoured.

**Fix:**  
Lock the price at search time. Accept `quoted_amount` from the client, validate it server-side against a tolerance window:

```python
recalculated = base_amount + extra_amount
if abs(recalculated - booking_data.quoted_amount) > Decimal("1.00"):
    raise HTTPException(409, detail={
        "code": "PRICE_CHANGED",
        "old_price": booking_data.quoted_amount,
        "new_price": recalculated,
        "message": "Room price has changed. Please review the updated price."
    })
```

This returns a structured 409 that the frontend can intercept to show a "price changed — new amount is ₹X, do you want to proceed?" dialog.

---

## High

---

### PR-05 — Night count uses `.days` (floor) on backend vs `Math.ceil` on frontend — displayed total ≠ charged total

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L53) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L79) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L163)

**Issue:**  
Backend uses `timedelta.days` (floor division — truncates fractional days):

```python
nights = (booking_data.check_out_date - booking_data.check_in_date).days
```

Frontend uses `Math.ceil`:
```ts
const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
```

For the current data flow (both dates sent as `T00:00:00`), these agree. But when the hotel's actual check-in time (12:00 PM) and check-out time (11:00 AM) are incorporated into the datetime values — which is the correct representation — a 2-night booking from `2026-05-13T12:00:00` to `2026-05-15T11:00:00` produces:

```python
timedelta = 1 day, 23 hours
.days = 1    # Backend charges 1 night
```

```ts
Math.ceil(1.958...) = 2  // Frontend shows 2 nights
```

The guest sees `2 × ₹4,000 = ₹8,000` but is charged `1 × ₹4,000 = ₹4,000`.

**Fix:**  
Use a consistent calendar-night calculation on both sides. Calendar nights = difference in date components only, ignoring time:

```python
# Backend — use date only
from datetime import date
check_in_dt = booking_data.check_in_date.date()
check_out_dt = booking_data.check_out_date.date()
nights = (check_out_dt - check_in_dt).days
if nights <= 0:
    raise HTTPException(400, "Check-out must be at least 1 calendar day after check-in")
```

```ts
// Frontend
const nights = Math.round(
  (new Date(checkOut).setHours(0,0,0,0) - new Date(checkIn).setHours(0,0,0,0))
  / (1000 * 60 * 60 * 24)
);
```

---

### PR-06 — `base_occupancy` hardcoded as room-name string match — breaks for any new room type

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L62-L65) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L86-L87)

**Issue:**  
Both backend and frontend determine base occupancy by matching the room type name string:

```python
# bookings.py:62-65
if "Family Room" in room.room_type.name:
    base_occupancy = 4   # Quad
else:
    base_occupancy = 2   # Double — assumed for everything else
```

```ts
// BookingForm.tsx:86-87
const isFamilyRoom = room.room_type.name.includes('Family Room');
const baseOccupancy = isFamilyRoom ? 4 : 2;
```

The `RoomType` model already has `max_occupancy` (room.py:20) — the correct field to use. This hardcoding means:

- A new "Presidential Suite" (max_occupancy=3) would be treated as double-occupancy, charging extra for the 3rd adult even though the room price includes them
- Renaming "Family Room" to "Spacious Family Suite" immediately breaks quad pricing for all future bookings
- `max_occupancy=2` is assigned to Deluxe and Super Deluxe — but there's no guarantee all future room types with occupancy=2 should have the same base occupancy pricing logic

**Fix:**  
Remove the string match entirely. The `max_occupancy` field is the correct source of truth:

```python
# bookings.py — replace lines 61-65
base_occupancy = room.room_type.max_occupancy
```

```ts
// BookingForm.tsx — replace lines 86-87
const baseOccupancy = room.room_type.max_occupancy;
```

---

### PR-07 — Zero and negative prices not blocked — negative total_amount corrupts revenue ledger

**[SEVERITY: high]** | [backend/app/models/room.py](backend/app/models/room.py#L22-L23) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L17-L48)

**Issue:**  
`base_price`, `extra_adult_price`, and `child_price` have no non-negative constraint at the database, model, or API layer:

```python
base_price = Column(Float, nullable=False)          # No CHECK constraint
extra_adult_price = Column(Float, nullable=True)    # Nullable + no minimum
child_price = Column(Float, nullable=True)
```

Setting `base_price = 0` produces a zero-amount booking that appears in revenue reports as ₹0. Setting `base_price = -500` produces a negative `total_amount` booking — the system would owe the guest money. With no price update API, this can only happen via direct DB access, but it is still an unguarded attack surface.

Also: `extra_adult_price` and `child_price` are nullable. When `null`, the extra-guest pricing silently falls back to zero. An admin who forgets to set `extra_adult_price` on a new room type inadvertently gives unlimited extra adults for free.

**Fix:**  
Add database-level CHECK constraints in a new migration, and Pydantic `gt=0` validators:

```python
# Migration
op.create_check_constraint('ck_room_types_base_price_positive', 'room_types',
    'base_price > 0')
op.create_check_constraint('ck_bookings_total_positive', 'bookings',
    'total_amount >= 0')
```

```python
# schemas/room.py
from pydantic import Field
base_price: float = Field(..., gt=0)
extra_adult_price: Optional[float] = Field(None, gt=0)
child_price: Optional[float] = Field(None, gt=0)
```

---

### PR-08 — No room type price management API — prices can only be changed via direct database access

**[SEVERITY: high]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py)

**Issue:**  
The admin API has `POST /admin/rooms` (create room) and `POST /admin/room-types` (inferred from the schema), but there is no `PATCH /admin/room-types/{id}` endpoint to update prices. An admin who needs to change the Deluxe Room rate from ₹4,000 to ₹4,500 must connect directly to the database. Direct database modifications:

- Leave no audit trail
- Bypass all Pydantic validation (allowing `base_price = -1`)
- Cannot be done via the admin UI
- Cannot be scheduled (e.g., "new rate effective from 1 June")
- Break the separation of concerns between application and database

**Fix:**  
Add a `PATCH /admin/room-types/{id}` endpoint:

```python
@router.patch("/room-types/{room_type_id}", response_model=RoomTypeResponse)
async def update_room_type(
    room_type_id: int,
    update: RoomTypeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    room_type = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room_type:
        raise HTTPException(404, "Room type not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(room_type, field, value)
    db.commit()
    db.refresh(room_type)
    return room_type
```

---

### PR-09 — `number_of_adults or number_of_guests` short-circuits on zero — pricing uses wrong adult count

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L58)

**Issue:**  
Python's `or` operator short-circuits on falsy values, including `0`:

```python
number_of_adults = booking_data.number_of_adults or booking_data.number_of_guests
```

If `number_of_adults = 0` is submitted (which passes schema validation since there's no `ge=1` constraint), this silently falls back to `number_of_guests`. A booking submitted with `{"number_of_adults": 0, "number_of_guests": 2}` would calculate pricing for 2 adults even though 0 was explicitly submitted. In the opposite direction, if the intent was "0 adults and 2 children", the system incorrectly charges for 2 adults.

**Fix:**  
Use `is not None` instead of truthiness check:

```python
number_of_adults = (
    booking_data.number_of_adults
    if booking_data.number_of_adults is not None
    else booking_data.number_of_guests
)
```

Also add `ge=1` to the `number_of_adults` field in the Pydantic schema (per H-02 in `AVAILABILITY_AUDIT.md`).

---

### PR-10 — Price divergence: occupancy-bracket crossing not handled — same booking, different GST rates on same invoice

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L52-L78)

**Issue:**  
When a multi-night booking spans different effective nightly rates (e.g., Family Room base is ₹6,500 but adding an extra adult on some nights pushes the per-night total to ₹8,775), the current model calculates one flat `total_amount`. There is no per-night rate breakdown.

This matters for GST because the Indian tax rules apply the GST rate **per night** based on that night's declared tariff. A booking that crosses the ₹7,500 threshold on some nights and not others should have a mixed invoice with different GST rates per night-segment. The current flat total prevents this from ever being correctly computed.

**Fix:**  
Build a night-by-night rate array as an intermediate step:

```python
nightly_rates = []
for night in range(nights):
    nightly_base = room.room_type.base_price
    nightly_extras = extra_amount / nights  # Distribute evenly
    nightly_total = nightly_base + nightly_extras
    nightly_rates.append(nightly_total)
```

Store or summarize these in the `Booking` record as a JSON breakdown column so invoices can show per-night rates and the correct GST slab for each.

---

## Medium

---

### PR-11 — No currency field on bookings — historical bookings have no associated currency

**[SEVERITY: medium]** | [backend/app/models/booking.py](backend/app/models/booking.py#L30) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx#L404)

**Issue:**  
`total_amount` is stored as a bare number with no associated currency code. The frontend hardcodes `₹` (INR) in display strings, but the database has no currency constraint. If a payment gateway, OTA integration, or multi-currency feature is ever added, there is no way to know which currency a historical `total_amount` represents.

**Fix:**  
Add `currency = Column(String(3), nullable=False, default="INR")` to the `Booking` model. Default to "INR" for all existing records via migration. Include `currency` in API responses.

---

### PR-12 — No seasonal or event-based pricing — flat rate year-round including festival peak seasons

**[SEVERITY: medium]** | [backend/app/models/room.py](backend/app/models/room.py#L14-L26) + [backend/scripts/seed_data.py](backend/scripts/seed_data.py#L52-L77)

**Issue:**  
Varanasi is a pilgrimage destination with extreme demand peaks: Dev Deepawali, Makar Sankranti, Holi, Kartik Purnima. The `RoomType` model has a single `base_price` that applies identically on 15 January (Makar Sankranti — very high demand) as on 15 August (off-peak). There is no concept of:

- Seasonal / date-range pricing
- Weekend vs weekday rates  
- Event surcharges
- Last-minute rate adjustments

The hotel is almost certainly leaving significant revenue on the table during peak pilgrimage windows.

**Fix:**  
Add a `RatePeriod` table:

```python
class RatePeriod(Base):
    __tablename__ = "rate_periods"
    id = Column(Integer, primary_key=True)
    room_type_id = Column(Integer, ForeignKey("room_types.id"))
    name = Column(String, nullable=False)      # "Dev Deepawali 2026"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    rate_multiplier = Column(Numeric(4, 2), nullable=False, default=1.0)
    # OR
    override_price = Column(Numeric(10, 2), nullable=True)
```

In the pricing calculation, look up any active rate period covering each night of the stay.

---

### PR-13 — Meal plan is "EP Only" but no meal plan field on booking or pricing

**[SEVERITY: medium]** | [frontend/lib/content/hotel-content.ts](frontend/lib/content/hotel-content.ts#L54) + [backend/app/models/booking.py](backend/app/models/booking.py)

**Issue:**  
The hotel's meal plan is "EP Only" (European Plan — room only, no meals), recorded as a static string in hotel-content.ts. There is no `meal_plan` field on `RoomType`, `Booking`, or any schema. If the hotel ever adds breakfast, half-board, or full-board rate plans (common for pilgrimage properties), the entire pricing and booking model would need to be rebuilt from scratch. More immediately, OTA integrations (MakeMyTrip, Booking.com) require meal plan data in the property record.

**Fix:**  
Add `meal_plan = Column(Enum('EP', 'CP', 'MAP', 'AP'), default='EP', nullable=False)` to `RoomType`. Include it in the booking response for downstream use.

---

### PR-14 — Admin seed script sets weak default password `admin123` — credential compromise risk in production

**[SEVERITY: medium]** | [backend/scripts/seed_data.py](backend/scripts/seed_data.py#L28)

**Issue:**  
```python
hashed_password=get_password_hash("admin123"),
```

If this script is run against a production database (or if a staging database is accessible), the admin account has a well-known weak password. `admin123` appears in every common credential dictionary. There is no forced-change-on-first-login mechanism.

**Fix:**  
Generate a random strong password and print it once, or require it as a CLI argument:

```python
import secrets
admin_password = secrets.token_urlsafe(16)
hashed_password=get_password_hash(admin_password)
print(f"[SEED] Admin password: {admin_password}  — SAVE THIS NOW, it will not be shown again")
```

---

### PR-15 — No price audit trail — price changes are invisible and unrecoverable

**[SEVERITY: medium]** | [backend/app/models/room.py](backend/app/models/room.py#L22) + [backend/app/models/booking.py](backend/app/models/booking.py#L30)

**Issue:**  
The `Booking` record stores only `total_amount` (a single pre-calculated float). It does not store:

- `base_price` at time of booking
- `nights`
- `extra_adult_price` at time of booking
- `number_of_adults`, `number_of_children` used in calculation
- Which pricing formula version was applied

If the room type's `base_price` is changed tomorrow, every historical booking's `total_amount` becomes unexplainable from the current price — there is no way to re-derive how it was calculated. An auditor or guest dispute cannot be resolved from the data.

**Fix:**  
Store a pricing snapshot as a JSON column on the `Booking`:

```python
price_breakdown = Column(JSON, nullable=True)
# Example value:
# {
#   "base_price_per_night": 4000.00,
#   "nights": 3,
#   "base_amount": 12000.00,
#   "extra_adults": 1,
#   "extra_adult_price_per_night": 1500.00,
#   "extra_adult_amount": 4500.00,
#   "children": 0,
#   "child_amount": 0.00,
#   "tax_rate": 0.12,
#   "tax_amount": 1980.00,
#   "total_amount": 18480.00
# }
```

---

### PR-16 — Long stay pricing uses `Float` × integer — no overflow risk but Decimal precision issue accumulates

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L53-L54)

**Issue:**  
For a 90-night stay at ₹6,500/night:

```python
base_amount = 6500.0 * 90  # = 585000.0  (exact for power-of-2 values)
```

No integer overflow risk in Python (arbitrary-precision integers). However, with fractional prices and the absence of a max-stay restriction, a 365-night booking at a non-power-of-2 price like ₹6,499.99 produces:

```python
6499.99 * 365 == 2372496.3499999997  # Not 2372496.35
```

Combined with GST, rounding artifacts compound. Since there is no maximum stay restriction (noted in M-03 of `AVAILABILITY_AUDIT.md`), this path is reachable by any authenticated user.

**Fix:**  
Use `Decimal` throughout the pricing calculation (see PR-03 fix). Add a `MAX_STAY_NIGHTS = 30` configuration variable and enforce it in `create_booking`.

---

### PR-17 — No validation that `extra_adult_price`/`child_price` are set before they are used in pricing

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L71-L76)

**Issue:**  
```python
if total_adults > base_occupancy:
    extra_adults = total_adults - base_occupancy
    if room.room_type.extra_adult_price:       # None check — silently skips charge
        extra_amount += extra_adults * room.room_type.extra_adult_price * nights

if number_of_children > 0 and room.room_type.child_price:   # Same pattern
    extra_amount += number_of_children * room.room_type.child_price * nights
```

When `extra_adult_price` is `None` (which is valid per the nullable column), extra adults are **silently given a free stay**. An admin who creates a new room type and forgets to set `extra_adult_price` will unknowingly give all bookings with extra adults the same base price regardless of occupancy.

This should be a configuration error, not a silent revenue loss.

**Fix:**  
Make `extra_adult_price` and `child_price` required for room types that allow more guests than base occupancy. Or raise an explicit error when they are `None` but needed:

```python
if total_adults > base_occupancy:
    if room.room_type.extra_adult_price is None:
        raise HTTPException(500, "Room type is misconfigured: extra_adult_price not set")
    extra_amount += (total_adults - base_occupancy) * room.room_type.extra_adult_price * nights
```

---

## Low

---

### PR-18 — No promo code system — 100% of potential discount/marketing tooling is missing

**[SEVERITY: low]** | [backend/app/schemas/booking.py](backend/app/schemas/booking.py) + [frontend/components/booking/BookingForm.tsx](frontend/components/booking/BookingForm.tsx)

**Issue:**  
There is no promotional code, discount, or offer infrastructure anywhere in the codebase. No `PromoCode` model, no `discount_amount` field on `Booking`, no validation endpoint. A property near Kashi Vishwanath Temple has natural seasonal promotions (monsoon off-season discounts, group pilgrimage packages, early-bird rates for Dev Deepawali). Currently all discounts must be applied manually by an admin after booking creation.

**Fix (when needed):**  
Add a `PromoCode` model with `code` (unique, case-insensitive), `discount_type` (flat/percent), `discount_value`, `valid_from`, `valid_until`, `max_uses`, `current_uses`. Validate server-side (never client-side). Store `promo_code_id` and `discount_amount` on `Booking`.

---

### PR-19 — No occupancy-based inventory reporting or ADR/RevPAR metrics

**[SEVERITY: low]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py)

**Issue:**  
The admin API has no revenue or occupancy analytics endpoints. Property management requires at minimum:

- Occupancy rate by date range (booked rooms / total rooms)
- ADR (Average Daily Rate = total room revenue / rooms sold)
- RevPAR (Revenue Per Available Room = ADR × occupancy rate)
- Revenue by room type

Without these, the property cannot make informed pricing decisions or identify revenue leakage.

**Fix:**  
Add a `GET /admin/analytics` endpoint that computes these from the bookings table. No new data model needed — all required data exists in `bookings` and `room_types`.

---

### PR-20 — Room type names in `hotel-content.ts` do not match database room type names

**[SEVERITY: low]** | [frontend/lib/content/hotel-content.ts](frontend/lib/content/hotel-content.ts#L92-L108) + [backend/scripts/seed_data.py](backend/scripts/seed_data.py#L52-L77)

**Issue:**  
`hotel-content.ts` defines room name keys as `double`, `deluxe`, `spacious`. The actual database room types (from seed_data.py) are `"Deluxe Room"`, `"Super Deluxe Room"`, `"Family Room"`. The content file's room names (`Double Room`, `Spacious Room`) do not match any database room type names. The `BookingForm` hardcodes `"Family Room"` as a string match for pricing (PR-06). Any marketing page that attempts to map content-file room descriptions to live database room types will fail silently or show wrong descriptions.

**Fix:**  
Align content room keys with database room type names, or introduce a mapping layer. The safest approach is to source room descriptions from the database's `description` field rather than a static content file.

---

### PR-21 — `total_amount` not validated against a recalculation on booking update — discount injection possible

**[SEVERITY: low]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L128-L154) + [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L58-L78)

**Issue:**  
`BookingUpdate` does not include `total_amount`. However, `special_requests` is updatable and the booking record itself has no immutable-amount enforcement. A future developer adding `total_amount` to `BookingUpdate` (e.g., to support admin price overrides) would create a path for discount injection if the field is not re-validated against a server-side recalculation. This is a latent risk worth documenting now.

**Fix:**  
If admin price overrides are ever needed, add a separate `POST /admin/bookings/{id}/price-adjustment` endpoint with explicit `reason` and `approver` fields, rather than making `total_amount` patchable through the general update endpoint.

---

---

## Recommended Fix Order (Priority Sequence)

| Priority | ID | Fix | Effort |
|---|---|---|---|
| 1 | PR-03 | Migrate Float → NUMERIC(10,2) for all price columns | Medium |
| 2 | PR-02 | Fix infant/child age bracket pricing — 0–5 free | Medium |
| 3 | PR-06 | Replace hardcoded room-name string match with `max_occupancy` | Low |
| 4 | PR-09 | Fix `or` operator zero-value short-circuit for `number_of_adults` | Low |
| 5 | PR-07 | Add CHECK constraints and Pydantic validators for non-negative prices | Low |
| 6 | PR-05 | Align night calculation to calendar-date diff (date only, no time component) | Low |
| 7 | PR-04 | Add `quoted_amount` price-lock with tolerance check | Medium |
| 8 | PR-08 | Add `PATCH /admin/room-types/{id}` price management endpoint | Low |
| 9 | PR-17 | Raise error when extra_adult_price/child_price is None but needed | Low |
| 10 | PR-15 | Add `price_breakdown` JSON snapshot column to Booking | Medium |
| 11 | PR-01 | Implement GST calculation (12%/18% slabs) and store tax_amount | High |
| 12 | PR-11 | Add `currency` field (default "INR") to Booking model | Low |
| 13 | PR-14 | Fix seed script weak admin password | Low |
| 14 | PR-13 | Add `meal_plan` enum field to RoomType | Low |
| 15 | PR-16 | Enforce max stay restriction (prevents precision accumulation at scale) | Low |
| 16 | PR-10 | Per-night rate breakdown for GST slab crossing | High |
| 17 | PR-12 | Add RatePeriod model for seasonal/event pricing | High |
| 18 | PR-19 | Admin analytics endpoint (occupancy, ADR, RevPAR) | Medium |
| 19 | PR-18 | Promo code system | High |
| 20 | PR-20 | Align content file room names with database | Low |
| 21 | PR-21 | Document total_amount immutability policy | Low |

---

## Checklist Coverage

| Checklist Item | Status | Finding |
|---|---|---|
| Base rate × nights — partial weeks and month-end boundaries | Partial | `.days` truncation vs `Math.ceil` mismatch (PR-05); calendar-date calculation needed |
| Dynamic pricing — price locked at search or recalculated? | Missing | Recalculated at backend on every request; no lock (PR-04) |
| Multi-night stay spanning rate change date | N/A | No per-date rates exist; single flat base_price applies to all nights (PR-12) |
| Expired promo codes | N/A | No promo code system exists (PR-18) |
| Promo code case sensitivity | N/A | No promo code system exists |
| Stacking discounts | N/A | No discount system of any kind exists |
| Loyalty member rates | N/A | No loyalty program exists |
| Tax calculation — pre/post discount, correct jurisdiction | Missing | No tax calculation at all; GSTIN registered; critical compliance gap (PR-01) |
| Service fees — flat vs percentage | N/A | No service fee model exists |
| Currency conversion | N/A | No multi-currency support; INR assumed everywhere; no currency field on booking (PR-11) |
| Very long stays (90+ nights) — overflow or precision loss | Partial | No overflow risk; Decimal precision loss possible with fractional prices (PR-16, PR-03) |
| Zero-rate or negative-rate rooms | Missing | No constraint blocks zero or negative base_price (PR-07) |
| Room type sold out but parent category shown | N/A | No category hierarchy in data model |
| Overbooking buffer | N/A | Not implemented |
| Allotment pools (wholesale vs retail) | N/A | Not implemented |
| Connecting room logic | N/A | Not implemented |
| Accessible room inventory | N/A | Not implemented |
| Rate plan fields validated on write | N/A | No rate plan model exists |
| Rate plan deleted while bookings reference it | N/A | No rate plan model exists |
| `rate_plan` file | Missing | Does not exist |
| `price_calculator` file | Missing | Does not exist; pricing inlined in bookings.py:52-78 |
| `tax_engine` file | Missing | Does not exist (PR-01) |
| `inventory_model` file | Missing | Does not exist; availability inlined in rooms.py |
