import json
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func as sqlfunc
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.room import RoomCreate, RoomResponse, RoomTypeCreate, RoomTypeResponse
from app.schemas.booking import BookingResponse, BookingUpdate
from app.schemas.service import ServiceCreate, ServiceResponse
from app.models.room import Room, RoomType, RoomAmenity
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.payment_event import PaymentEvent, PaymentEventType
from app.models.service import Service
from app.api.v1.auth import get_current_admin_user
from app.models.user import User

router = APIRouter()

# ---------------------------------------------------------------------------
# Transition rules (mirrors bookings.py — single source of truth would be a
# shared module; kept here for now to avoid circular import complications)
# ---------------------------------------------------------------------------
VALID_BOOKING_TRANSITIONS: dict[BookingStatus, set[BookingStatus]] = {
    BookingStatus.PENDING:     {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CONFIRMED:   {BookingStatus.CHECKED_IN, BookingStatus.CANCELLED, BookingStatus.NO_SHOW},
    BookingStatus.CHECKED_IN:  {BookingStatus.CHECKED_OUT},
    BookingStatus.CHECKED_OUT: set(),
    BookingStatus.CANCELLED:   set(),
    BookingStatus.NO_SHOW:     set(),
}

VALID_PAYMENT_TRANSITIONS: dict[PaymentStatus, set[PaymentStatus]] = {
    PaymentStatus.PENDING:  {PaymentStatus.PAID},
    PaymentStatus.PAID:     {PaymentStatus.REFUNDED},
    PaymentStatus.REFUNDED: set(),
}


def _room_has_conflict(db: Session, room_id: int, check_in, check_out, exclude_booking_id: int) -> bool:
    """Check for conflicting bookings, excluding the booking being confirmed."""
    return db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.id != exclude_booking_id,
        Booking.status.in_([
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN,
        ]),
        Booking.check_in_date < check_out,
        Booking.check_out_date > check_in,
    ).first() is not None


# ---------------------------------------------------------------------------
# Room management
# ---------------------------------------------------------------------------
@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    room_type = db.query(RoomType).filter(RoomType.id == room_data.room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")

    existing_room = db.query(Room).filter(Room.room_number == room_data.room_number).first()
    if existing_room:
        raise HTTPException(status_code=400, detail="Room number already exists")

    # M-06: store image_urls as valid JSON, not Python repr
    db_room = Room(
        room_number=room_data.room_number,
        room_type_id=room_data.room_type_id,
        floor=room_data.floor,
        description=room_data.description,
        image_urls=json.dumps(room_data.image_urls) if room_data.image_urls else None,
    )

    if room_data.amenity_ids:
        amenities = db.query(RoomAmenity).filter(RoomAmenity.id.in_(room_data.amenity_ids)).all()
        db_room.amenities = amenities

    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


# ---------------------------------------------------------------------------
# Room type management — price updates (PR-08)
# ---------------------------------------------------------------------------
@router.patch("/room-types/{room_type_id}", response_model=RoomTypeResponse)
async def update_room_type(
    room_type_id: int,
    update: RoomTypeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    room_type = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(room_type, field, value)
    db.commit()
    db.refresh(room_type)
    return room_type


# ---------------------------------------------------------------------------
# Booking list — L-04: pagination + status filter
# ---------------------------------------------------------------------------
@router.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings(
    booking_status: Optional[BookingStatus] = Query(default=None, alias="status"),
    payment_status: Optional[PaymentStatus] = Query(default=None),
    check_in_from: Optional[str] = Query(default=None, description="ISO date YYYY-MM-DD"),
    check_in_to: Optional[str] = Query(default=None, description="ISO date YYYY-MM-DD"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    from datetime import date
    q = db.query(Booking)

    if booking_status:
        q = q.filter(Booking.status == booking_status)
    if payment_status:
        q = q.filter(Booking.payment_status == payment_status)
    if check_in_from:
        q = q.filter(Booking.check_in_date >= date.fromisoformat(check_in_from))
    if check_in_to:
        q = q.filter(Booking.check_in_date <= date.fromisoformat(check_in_to))

    return q.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


# ---------------------------------------------------------------------------
# Booking update — C-03, H-07, PAY-02/04/06/07 guards + audit log
# ---------------------------------------------------------------------------
@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking_admin(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # H-07: validate booking status transition
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

        # C-03: re-check availability when confirming a booking
        if booking_update.status == BookingStatus.CONFIRMED:
            if _room_has_conflict(
                db,
                booking.room_id,
                booking.check_in_date,
                booking.check_out_date,
                exclude_booking_id=booking.id,
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Cannot confirm: room has a conflicting booking for these dates",
                )

        # PAY-04: block check-in when payment is still pending
        if booking_update.status == BookingStatus.CHECKED_IN and booking.payment_status == PaymentStatus.PENDING:
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "PAYMENT_PENDING",
                    "message": "Cannot check in: payment has not been confirmed. Mark as paid first.",
                },
            )

        booking.status = booking_update.status

    # PAY-02/05/07: validate payment status transition
    if booking_update.payment_status and booking_update.payment_status != booking.payment_status:
        pay_allowed = VALID_PAYMENT_TRANSITIONS.get(booking.payment_status, set())
        if booking_update.payment_status not in pay_allowed:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Invalid payment transition: {booking.payment_status.value} → "
                    f"{booking_update.payment_status.value}. "
                    f"Allowed: {[s.value for s in pay_allowed] or 'none'}"
                ),
            )

        # PAY-07: refund only allowed after cancellation or checkout
        if booking_update.payment_status == PaymentStatus.REFUNDED:
            if booking.status not in (
                BookingStatus.CANCELLED,
                BookingStatus.CHECKED_OUT,
                BookingStatus.NO_SHOW,
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Refund can only be issued on cancelled, checked-out, or no-show bookings",
                )

        prev_payment_status = booking.payment_status
        booking.payment_status = booking_update.payment_status

        # PAY-06: write payment audit event
        event_type = (
            PaymentEventType.REFUNDED
            if booking_update.payment_status == PaymentStatus.REFUNDED
            else PaymentEventType.CHARGED
        )
        db.add(PaymentEvent(
            booking_id=booking.id,
            event_type=event_type,
            from_status=prev_payment_status.value,
            to_status=booking_update.payment_status.value,
            amount=booking.total_amount,
            reference=booking_update.payment_reference,
            actor_user_id=current_user.id,
        ))

    if booking_update.special_requests is not None:
        booking.special_requests = booking_update.special_requests

    db.commit()
    db.refresh(booking)
    return booking


# ---------------------------------------------------------------------------
# Analytics — PAY-03/09: server-side aggregation, no client-side float sum
# ---------------------------------------------------------------------------
@router.get("/analytics")
async def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    total     = db.query(sqlfunc.count(Booking.id)).scalar() or 0
    confirmed = db.query(sqlfunc.count(Booking.id)).filter(Booking.status == BookingStatus.CONFIRMED).scalar() or 0
    pending   = db.query(sqlfunc.count(Booking.id)).filter(Booking.status == BookingStatus.PENDING).scalar() or 0
    checked_in = db.query(sqlfunc.count(Booking.id)).filter(Booking.status == BookingStatus.CHECKED_IN).scalar() or 0
    revenue_dec = (
        db.query(sqlfunc.coalesce(sqlfunc.sum(Booking.total_amount), 0))
        .filter(Booking.payment_status == PaymentStatus.PAID)
        .scalar()
    )
    return {
        "total": total,
        "confirmed": confirmed,
        "pending": pending,
        "checked_in": checked_in,
        "revenue": float(Decimal(str(revenue_dec))),
    }


# ---------------------------------------------------------------------------
# Service management
# ---------------------------------------------------------------------------
@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    db_service = Service(**service_data.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service
