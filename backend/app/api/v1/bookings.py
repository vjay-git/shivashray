from decimal import Decimal, ROUND_HALF_UP
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.room import Room
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.utils.date_validation import validate_date_range


# ---------------------------------------------------------------------------
# PR-01: GST slabs under Indian CGST Act 2017 (per-night effective rate)
# ≤ ₹2,499 → 0%; ₹2,500 – ₹7,499 → 12%; ≥ ₹7,500 → 18%
# ---------------------------------------------------------------------------
def _gst_rate(effective_nightly_rate: Decimal) -> Decimal:
    if effective_nightly_rate >= Decimal("7500"):
        return Decimal("0.18")
    if effective_nightly_rate >= Decimal("2500"):
        return Decimal("0.12")
    return Decimal("0.00")

router = APIRouter()

# ---------------------------------------------------------------------------
# Allowed booking-status transitions (H-07)
# ---------------------------------------------------------------------------
VALID_BOOKING_TRANSITIONS: dict[BookingStatus, set[BookingStatus]] = {
    BookingStatus.PENDING:     {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CONFIRMED:   {BookingStatus.CHECKED_IN, BookingStatus.CANCELLED, BookingStatus.NO_SHOW},
    BookingStatus.CHECKED_IN:  {BookingStatus.CHECKED_OUT},
    BookingStatus.CHECKED_OUT: set(),
    BookingStatus.CANCELLED:   set(),
    BookingStatus.NO_SHOW:     set(),
}


def _check_room_conflict(db: Session, room_id: int, check_in, check_out, exclude_booking_id: int = None) -> bool:
    """
    Return True if there is a conflicting booking for the room.
    Includes PENDING bookings so they block inventory (C-01).
    Optionally excludes one booking ID (used during re-confirmation checks).
    """
    q = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status.in_([
            BookingStatus.PENDING,       # C-01: PENDING now blocks
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN,
        ]),
        Booking.check_in_date < check_out,
        Booking.check_out_date > check_in,
    )
    if exclude_booking_id is not None:
        q = q.filter(Booking.id != exclude_booking_id)
    return q.first() is not None


# ---------------------------------------------------------------------------
# Create booking
# ---------------------------------------------------------------------------
@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # H-04 / H-05 / H-06: unified date validation (past, reversed, 365-day window)
    validate_date_range(booking_data.check_in_date, booking_data.check_out_date)

    # C-02: Lock the room row before checking availability so no concurrent
    # request can sneak in between the SELECT and the INSERT.
    room = (
        db.query(Room)
        .filter(Room.id == booking_data.room_id, Room.is_active == True)
        .with_for_update()
        .first()
    )
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # H-01: enforce max occupancy
    number_of_adults   = booking_data.number_of_adults   if booking_data.number_of_adults   is not None else booking_data.number_of_guests
    number_of_children = booking_data.number_of_children if booking_data.number_of_children is not None else 0
    total_guests = number_of_adults + number_of_children
    if total_guests > room.room_type.max_occupancy:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guest count {total_guests} exceeds room capacity of {room.room_type.max_occupancy}",
        )

    # C-01 / C-02: availability check inside the row lock
    if _check_room_conflict(db, booking_data.room_id, booking_data.check_in_date, booking_data.check_out_date):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room is not available for the selected dates",
        )

    # Calculate pre-tax amount using Decimal arithmetic (PR-03)
    from app.utils.date_validation import to_utc
    nights = Decimal(
        (to_utc(booking_data.check_out_date).date() - to_utc(booking_data.check_in_date).date()).days
    )

    base_price = Decimal(str(room.room_type.base_price))
    base_amount = base_price * nights

    # M-02: use max_occupancy, not hardcoded room-type name
    base_occupancy = room.room_type.max_occupancy
    extra_amount = Decimal("0")

    if number_of_adults > base_occupancy:
        extra_adults = number_of_adults - base_occupancy
        if room.room_type.extra_adult_price:
            extra_amount += Decimal(str(room.room_type.extra_adult_price)) * extra_adults * nights

    # PR-02: children are zero-charge (interim policy — no age bands yet)

    pretax_amount = base_amount + extra_amount

    # PR-01: GST — slab determined by effective nightly rate
    effective_nightly = (pretax_amount / nights).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    tax_rate = _gst_rate(effective_nightly)
    tax_amount = (pretax_amount * tax_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    total_amount = pretax_amount + tax_amount

    # PR-04: reject if displayed price drifted by more than ₹1
    if booking_data.quoted_amount is not None:
        if abs(total_amount - booking_data.quoted_amount) > Decimal("1.00"):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "PRICE_CHANGED",
                    "old_price": float(booking_data.quoted_amount),
                    "new_price": float(total_amount),
                },
            )

    db_booking = Booking(
        user_id=current_user.id,
        room_id=booking_data.room_id,
        check_in_date=booking_data.check_in_date,
        check_out_date=booking_data.check_out_date,
        number_of_guests=booking_data.number_of_guests,
        number_of_adults=number_of_adults,
        number_of_children=number_of_children,
        total_amount=total_amount,
        tax_amount=tax_amount,
        tax_rate=tax_rate,
        currency='INR',
        quoted_amount=booking_data.quoted_amount,
        status=BookingStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        guest_name=booking_data.guest_name,
        guest_email=booking_data.guest_email,
        guest_phone=booking_data.guest_phone,
        special_requests=booking_data.special_requests,
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


# ---------------------------------------------------------------------------
# List own bookings
# ---------------------------------------------------------------------------
@router.get("", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


# ---------------------------------------------------------------------------
# Get single booking
# ---------------------------------------------------------------------------
@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    # Return 404 in both missing and forbidden cases to prevent enumeration (BF-20)
    if not booking or (
        booking.user_id != current_user.id and current_user.role.value != "admin"
    ):
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


# ---------------------------------------------------------------------------
# Update booking (guest: cancel only; admin: status + payment_status)
# ---------------------------------------------------------------------------
@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking or (
        booking.user_id != current_user.id and current_user.role.value != "admin"
    ):
        raise HTTPException(status_code=404, detail="Booking not found")

    if current_user.role.value != "admin":
        # Guests may only cancel — and only their own booking
        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
        if booking_update.status != BookingStatus.CANCELLED:
            raise HTTPException(status_code=403, detail="Guests may only cancel their booking")
        # L-03: block cancelling a booking that is already in progress / done
        if booking.status in (BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT):
            raise HTTPException(
                status_code=409,
                detail="Cannot cancel a booking that is already checked in or completed",
            )
        booking.status = BookingStatus.CANCELLED
    else:
        # H-07: enforce transition rules for admin status changes
        if booking_update.status and booking_update.status != booking.status:
            allowed = VALID_BOOKING_TRANSITIONS.get(booking.status, set())
            if booking_update.status not in allowed:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        f"Invalid status transition: {booking.status.value} → "
                        f"{booking_update.status.value}. "
                        f"Allowed: {[s.value for s in allowed] or 'none'}"
                    ),
                )
            booking.status = booking_update.status

        if booking_update.payment_status:
            booking.payment_status = booking_update.payment_status

        if booking_update.special_requests is not None:
            booking.special_requests = booking_update.special_requests

    db.commit()
    db.refresh(booking)
    return booking


# ---------------------------------------------------------------------------
# Cancel booking (DELETE)
# ---------------------------------------------------------------------------
@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking or (
        booking.user_id != current_user.id and current_user.role.value != "admin"
    ):
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=409, detail="Booking is already cancelled")

    # L-03: prevent cancelling a booking that is already checked in or completed
    if booking.status in (BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT):
        raise HTTPException(
            status_code=409,
            detail="Cannot cancel a booking that is already checked in or completed",
        )

    booking.status = BookingStatus.CANCELLED
    db.commit()
    return None
