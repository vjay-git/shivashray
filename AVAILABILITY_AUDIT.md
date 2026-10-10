# Hotel Booking Engine — Search & Availability Audit

**Audited:** 2026-05-13  
**Branch:** main  
**Scope:** Search, availability, date validation, caching, concurrency

---

## Summary Table

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 7 |
| Medium | 6 |
| Low | 4 |

---

## Critical

---

### C-01 — Double-booking via PENDING status not blocking availability

**[SEVERITY: critical]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L39-L44) & [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py#L39-L44)

**Description:**  
The conflict query filters only `CONFIRMED` and `CHECKED_IN` statuses. A newly created booking enters `PENDING` state and is invisible to all subsequent availability checks. Two users searching simultaneously will both see the room as available, both pass the conflict check, and both successfully create `PENDING` bookings for the same room on the same dates.

```python
# bookings.py:41 — PENDING is excluded, so it never blocks
Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]),
```

**Suggested Fix:**  
Include `PENDING` in the conflict check, or implement a short-lived inventory hold (e.g., 10-minute lock) when a booking enters `PENDING`. If PENDING should remain non-blocking for draft purposes, set a TTL and expire stale PENDING records automatically.

```python
Booking.status.in_([
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CHECKED_IN
]),
```

---

### C-02 — No atomic availability check + insert (TOCTOU race condition)

**[SEVERITY: critical]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L39-L100)

**Description:**  
The availability check (lines 39–44) and the booking `INSERT` (line 98) are two separate, non-atomic operations. Under concurrent load, two requests can both pass the `SELECT` check before either has committed its `INSERT`. PostgreSQL autocommit + SQLAlchemy's default isolation does not prevent this. The result is two confirmed bookings for the last room.

```python
# Step 1: check — passes for both concurrent requests
conflicting_booking = db.query(Booking).filter(...).first()   # line 39

# Step 2: insert — both succeed before either commits
db.add(db_booking)   # line 98
db.commit()          # line 99
```

**Suggested Fix:**  
Use `SELECT FOR UPDATE` (pessimistic locking) on the room row to serialize access, or switch to a database-level unique partial index that rejects overlapping date ranges. For PostgreSQL, the `tsrange` exclusion constraint is the canonical solution.

```python
# Pessimistic lock on the room row
room = db.query(Room).filter(
    Room.id == booking_data.room_id
).with_for_update().first()
```

---

### C-03 — No availability re-check at booking confirmation

**[SEVERITY: critical]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L70) & [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L145-L146)

**Description:**  
When an admin (or user) updates a booking status from `PENDING` → `CONFIRMED`, no availability check is performed. An admin can confirm two overlapping `PENDING` bookings for the same room, creating a confirmed double-booking. Combined with C-01 and C-02, this creates three independent paths to double-booking.

```python
# admin.py:69 — status flip with no conflict check
if booking_update.status:
    booking.status = booking_update.status   # No re-check performed
```

**Suggested Fix:**  
Add a conflict check inside any endpoint that transitions a booking to `CONFIRMED`. Extract the availability query into a shared utility function and call it before committing the status change.

---

## High

---

### H-01 — Guest count not validated against room max occupancy

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L52-L76)

**Description:**  
`RoomType.max_occupancy` exists in the model (room.py:20) but is never checked during booking creation. A guest can book a room with `number_of_adults=20` for a room with `max_occupancy=2`. Extra pricing is calculated, but the booking is accepted regardless of how far it exceeds capacity.

**Suggested Fix:**
```python
total_guests = number_of_adults + number_of_children
if total_guests > room.room_type.max_occupancy:
    raise HTTPException(
        status_code=400,
        detail=f"Guest count {total_guests} exceeds room capacity {room.room_type.max_occupancy}"
    )
```

---

### H-02 — Zero or negative guest count accepted

**[SEVERITY: high]** | [backend/app/schemas/booking.py](backend/app/schemas/booking.py#L10-L12)

**Description:**  
The Pydantic schema sets `number_of_guests: int = 1` (a default, not a minimum). Nothing prevents a client from sending `number_of_guests: 0` or `number_of_adults: -1`. A zero-guest booking creates a record with a valid `total_amount` (base price × nights) and no validation error.

```python
number_of_guests: int = 1             # default only — 0 is accepted
number_of_adults: Optional[int] = None  # None OR any integer, including negative
number_of_children: Optional[int] = None
```

**Suggested Fix:**
```python
from pydantic import Field

number_of_guests: int = Field(default=1, ge=1)
number_of_adults: Optional[int] = Field(default=None, ge=1)
number_of_children: Optional[int] = Field(default=None, ge=0)
```

---

### H-03 — Search endpoint performs N+1 queries (no pagination)

**[SEVERITY: high]** | [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py#L36-L52)

**Description:**  
The `GET /rooms` availability filter loops over every room and issues a separate `SELECT` per room to find conflicting bookings. For a 50-room property this is 50 queries; for 500+ rooms it becomes a full table scan pattern that will time out under load. There is also no `LIMIT`/`OFFSET` pagination, so the endpoint always returns the full room list.

```python
for room in rooms:                            # O(n) rooms
    conflicting_booking = db.query(Booking)   # 1 query per room
        .filter(...).first()
```

**Suggested Fix:**  
Replace the loop with a single subquery or NOT EXISTS clause, and add `skip`/`limit` parameters:

```python
booked_room_ids = db.query(Booking.room_id).filter(
    Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]),
    Booking.check_in_date < check_out,
    Booking.check_out_date > check_in
).subquery()

query = query.filter(Room.id.notin_(booked_room_ids))
```

---

### H-04 — Search endpoint does not validate date range

**[SEVERITY: high]** | [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py#L19-L54)

**Description:**  
The `GET /rooms` search endpoint accepts `check_in` and `check_out` query parameters with no validation. The following inputs are silently handled or ignored:
- `check_in == check_out` (same-day, zero-night stay) — returns empty list without error
- `check_out < check_in` (reversed dates) — availability filter uses reversed logic, silently returns wrong results
- `check_in` in the past — past-date searches are accepted with no warning
- No maximum booking window — `check_in` 10 years in the future is accepted

The `check_room_availability` endpoint validates `check_out <= check_in` (rooms.py:70) but `get_rooms` does not.

**Suggested Fix:**  
Add a shared date validation utility and call it at the start of both the search and availability endpoints:

```python
def validate_date_range(check_in: datetime, check_out: datetime) -> None:
    now = datetime.now(tz=timezone.utc)
    if check_in < now.replace(tzinfo=check_in.tzinfo):
        raise HTTPException(400, "Check-in date cannot be in the past")
    if check_out <= check_in:
        raise HTTPException(400, "Check-out must be after check-in")
    if (check_out - check_in).days < 1:
        raise HTTPException(400, "Minimum stay is 1 night")
    if (check_in - now).days > 365:
        raise HTTPException(400, "Bookings cannot be made more than 365 days in advance")
```

---

### H-05 — No maximum booking window enforced

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L27-L31) & [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py#L63-L90)

**Description:**  
There is no upper bound on how far in the future a booking or availability search can be placed. A client can submit `check_in_date` 5 years in the future and the booking will be accepted. This opens the door to inventory squatting, future pricing errors, and unintended system behavior as the property's calendar is not managed that far out.

**Suggested Fix:**  
Enforce a configurable `MAX_BOOKING_WINDOW_DAYS` (e.g., 365) in the shared validation utility described in H-04.

---

### H-06 — Timezone comparison is fragile and inconsistent

**[SEVERITY: high]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L27)

**Description:**  
The "not in past" check uses the timezone from the incoming request date:

```python
datetime.now(booking_data.check_in_date.tzinfo)
```

If `check_in_date` is submitted as a naive datetime (no `tzinfo`), this becomes `datetime.now(None)`, returning a naive local-server datetime. If the hotel is in a different timezone from the server, a guest in UTC+14 can book a "past" date in the server's timezone, or a "future" date that is already past at the hotel. The model stores `DateTime(timezone=True)` (booking.py:25) but no UTC normalization is applied at the API layer before comparisons.

**Suggested Fix:**  
Normalize all incoming datetimes to UTC at the API boundary before any comparison:

```python
from datetime import timezone

def to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

check_in_utc = to_utc(booking_data.check_in_date)
if check_in_utc < datetime.now(timezone.utc):
    raise HTTPException(400, "Check-in date cannot be in the past")
```

---

### H-07 — Admin can set arbitrary status transitions

**[SEVERITY: high]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L69-L70)

**Description:**  
The admin booking update endpoint accepts any `BookingStatus` value and writes it directly with no transition validation. This allows illegal transitions such as `CHECKED_OUT → PENDING`, `CANCELLED → CONFIRMED`, or `CHECKED_IN → PENDING`. These corrupt the booking lifecycle and can interfere with availability calculations or revenue reporting.

**Suggested Fix:**  
Define an allowed transition map and validate before committing:

```python
VALID_TRANSITIONS = {
    BookingStatus.PENDING: {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CONFIRMED: {BookingStatus.CHECKED_IN, BookingStatus.CANCELLED},
    BookingStatus.CHECKED_IN: {BookingStatus.CHECKED_OUT},
    BookingStatus.CHECKED_OUT: set(),
    BookingStatus.CANCELLED: set(),
}
```

---

## Medium

---

### M-01 — No caching layer — every search hits the database

**[SEVERITY: medium]** | [backend/app/core/database.py](backend/app/core/database.py) & [backend/requirements.txt](backend/requirements.txt)

**Description:**  
There is no caching implementation in the project (no Redis, Memcached, or in-process cache). Every call to `GET /rooms`, `GET /rooms/{id}/availability`, and room type queries executes live SQL. Room type data and amenity lists are effectively static but are re-fetched on every request. Combined with the N+1 pattern in H-03, high concurrency will saturate the database connection pool (pool_size=10, max_overflow=20).

**Suggested Fix:**  
Add `redis` + `fastapi-cache2` to requirements. Cache room type listings and per-room availability with a short TTL (e.g., 60 seconds for availability, 5 minutes for static room data). Always invalidate the cache on booking create/update.

---

### M-02 — Hardcoded room type name string in pricing logic

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L62-L65)

**Description:**  
Base occupancy is determined by a string match on the room type name:

```python
if "Family Room" in room.room_type.name:
    base_occupancy = 4
else:
    base_occupancy = 2
```

This will silently use the wrong base occupancy for any room type whose name doesn't contain "Family Room" (e.g., "Suite", "Presidential Suite", "Connecting Room"). The `RoomType` model already has `max_occupancy` but it is not used here. A name change by an admin breaks pricing.

**Suggested Fix:**  
Remove the string match. Derive base occupancy directly from the model:

```python
base_occupancy = room.room_type.max_occupancy
```

---

### M-03 — No minimum or maximum stay restrictions

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L52-L53)

**Description:**  
The system calculates nights but enforces no minimum or maximum stay. Properties commonly require a 2–3 night minimum on weekends or during peak seasons. There is no schema concept for these restrictions, and no enforcement at search or booking time.

**Suggested Fix:**  
Add `min_stay_nights` and `max_stay_nights` fields to `RoomType` (or a separate `RoomRestriction` table for date-specific rules). Enforce them in `create_booking` after the nights calculation:

```python
if nights < room.room_type.min_stay_nights:
    raise HTTPException(400, f"Minimum stay is {room.room_type.min_stay_nights} nights")
```

---

### M-04 — No stop-sell or closed-on-arrival/departure concept

**[SEVERITY: medium]** | [backend/app/models/room.py](backend/app/models/room.py) & [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py)

**Description:**  
The data model has no concept of:
- **Stop-sell dates** — dates on which a room or room type should not be bookable regardless of physical availability
- **Closed-on-arrival (COA)** — guests cannot check in on specific dates
- **Closed-on-departure (COD)** — guests cannot check out on specific dates

These are standard PMS (Property Management System) controls, especially for maintenance blocks, events, or revenue management. The only mechanism today is setting `is_active = False` on the entire room, which is too coarse.

**Suggested Fix:**  
Add a `RoomBlock` model:

```python
class RoomBlock(Base):
    __tablename__ = "room_blocks"
    room_id = Column(Integer, ForeignKey("rooms.id"))
    date = Column(Date, nullable=False)
    block_type = Column(Enum("stop_sell", "closed_arrival", "closed_departure"))
```

Incorporate block checks in the availability query.

---

### M-05 — PENDING bookings accumulate with no expiry

**[SEVERITY: medium]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L81-L100)

**Description:**  
Every new booking starts as `PENDING`. There is no TTL, scheduled job, or expiry mechanism to transition stale `PENDING` bookings to `CANCELLED`. If a user abandons a booking before payment, the `PENDING` record persists indefinitely. When C-01 is fixed (PENDING blocks availability), this becomes a denial-of-service vector — abandoned bookings permanently block inventory.

**Suggested Fix:**  
Add a `pending_expires_at` column to `Booking`. Run a background job (Celery beat, APScheduler, or a cron-triggered endpoint) that cancels `PENDING` bookings past their expiry time.

---

### M-06 — `image_urls` stored as Python string repr, not JSON

**[SEVERITY: medium]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L38) & [backend/app/models/room.py](backend/app/models/room.py#L46)

**Description:**  
The room creation endpoint serializes `image_urls` using Python's `str()`:

```python
image_urls=str(room_data.image_urls) if room_data.image_urls else None
```

`str(["url1", "url2"])` produces `"['url1', 'url2']"` — Python list syntax, not valid JSON. Parsing this on the client or in any JSON-aware tool will fail. The model comment says "JSON array" but the storage format is not JSON.

**Suggested Fix:**  
Use `json.dumps`:

```python
import json
image_urls=json.dumps(room_data.image_urls) if room_data.image_urls else None
```

Or migrate the column to `JSON` type in SQLAlchemy:

```python
image_urls = Column(JSON, nullable=True)
```

---

## Low

---

### L-01 — `GET /rooms` returns full list with no pagination

**[SEVERITY: low]** | [backend/app/api/v1/rooms.py](backend/app/api/v1/rooms.py#L19-L54)

**Description:**  
The rooms list endpoint has no `skip`/`limit` parameters. For a small property this is acceptable, but if room inventory grows or the endpoint is used for a city-level aggregator, the entire dataset is returned in a single response. Combined with H-03 (N+1 queries), this compounds the performance impact.

**Suggested Fix:**  
Add optional `skip: int = 0` and `limit: int = 100` query parameters and apply them to the SQLAlchemy query before executing.

---

### L-02 — No audit trail for booking status changes

**[SEVERITY: low]** | [backend/app/models/booking.py](backend/app/models/booking.py#L38)

**Description:**  
`updated_at` is the only change tracking mechanism. There is no log of who changed a booking status, from what state, to what state, or when. For a hotel booking system, this is a significant operational gap — disputes, refund requests, and revenue audits all require a reliable status history.

**Suggested Fix:**  
Add a `BookingStatusHistory` model with `booking_id`, `from_status`, `to_status`, `changed_by` (user_id), and `changed_at`. Write a record on every status transition.

---

### L-03 — User can cancel an already-checked-in or checked-out booking

**[SEVERITY: low]** | [backend/app/api/v1/bookings.py](backend/app/api/v1/bookings.py#L156-L171)

**Description:**  
The `DELETE /bookings/{id}` endpoint sets `status = CANCELLED` unconditionally, with no check on the current status. A user (or admin) can cancel a `CHECKED_IN` or `CHECKED_OUT` booking, corrupting occupancy reports and triggering incorrect refund flows.

**Suggested Fix:**  
Check the current status before allowing cancellation:

```python
if booking.status in (BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT):
    raise HTTPException(400, "Cannot cancel a booking that is already checked in or completed")
```

---

### L-04 — `GET /admin/bookings` has no filtering or pagination

**[SEVERITY: low]** | [backend/app/api/v1/admin.py](backend/app/api/v1/admin.py#L50-L56)

**Description:**  
The admin bookings list fetches all bookings from the database with no date filter, status filter, or pagination. As booking volume grows, this endpoint will return increasingly large payloads and slow queries. There is also no index on `created_at` despite the `ORDER BY created_at DESC`.

**Suggested Fix:**  
Add `status`, `check_in_from`, `check_in_to`, `skip`, and `limit` query parameters. Add a database index on `bookings.created_at`.

---

## Checklist Coverage

| Checklist Item | Status | Finding |
|---|---|---|
| check-in = check-out (same day) | Partial | Blocked at booking create (L21), not at search or availability check endpoint for GET /rooms |
| check-in in the past | Partial | Blocked at booking create (L27) with fragile tz logic (H-06), not at search |
| check-in > 365 days in future | Missing | No max booking window anywhere (H-05) |
| check-out before check-in | Partial | Blocked at booking create and `/availability`, not at `GET /rooms` search (H-04) |
| 0 adults, 0 children | Missing | No `ge=1` constraint on guest count fields (H-02) |
| Guest count exceeds capacity | Missing | `max_occupancy` exists in model but never enforced (H-01) |
| Multi-room search performance | Missing | N+1 query per room, no pagination (H-03) |
| 500+ properties pagination | Missing | No LIMIT/OFFSET on GET /rooms (L-01) |
| Search near midnight | Not applicable | Dates are datetime objects; no special midnight handling needed if UTC normalized |
| Timezone edge cases | Missing | Fragile `tzinfo` forwarding, no UTC normalization (H-06) |
| Sold-out dates real-time vs cached | N/A | No cache exists — always live DB (M-01) |
| Cache TTL for availability | Missing | No caching at all (M-01) |
| Re-check at confirmation | Missing | No re-check when PENDING → CONFIRMED (C-03) |
| Concurrency: last room double-booking | Missing | No lock, TOCTOU race (C-02) |
| Minimum stay restrictions | Missing | No min stay concept (M-03) |
| Maximum stay restrictions | Missing | No max stay concept (M-03) |
| Closed-on-arrival / closed-on-departure | Missing | No block model (M-04) |
| Stop-sell dates | Missing | No stop-sell concept (M-04) |
