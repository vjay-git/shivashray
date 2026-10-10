from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.room import RoomResponse, RoomTypeResponse, RoomAvailability
from app.models.room import Room, RoomType
from app.models.booking import Booking, BookingStatus
from app.utils.date_validation import validate_date_range
from datetime import datetime

router = APIRouter()


# ---------------------------------------------------------------------------
# Room types
# ---------------------------------------------------------------------------
@router.get("/types", response_model=List[RoomTypeResponse])
async def get_room_types(db: Session = Depends(get_db)):
    return db.query(RoomType).all()


# ---------------------------------------------------------------------------
# List rooms with optional availability filter
# H-03: replaced per-room N+1 loop with a single NOT-IN subquery
# H-04/H-05/H-06: date range validated via shared utility
# L-01: skip/limit pagination
# ---------------------------------------------------------------------------
@router.get("", response_model=List[RoomResponse])
async def get_rooms(
    room_type_id: Optional[int] = Query(None),
    available: Optional[bool] = Query(None),
    check_in: Optional[datetime] = Query(None),
    check_out: Optional[datetime] = Query(None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(Room).filter(Room.is_active == True)

    if room_type_id:
        query = query.filter(Room.room_type_id == room_type_id)

    # Apply availability filter only when both dates and the flag are provided
    if available is not None and check_in is not None and check_out is not None:
        # H-04 / H-05 / H-06: validate dates before touching the DB
        validate_date_range(check_in, check_out)

        # H-03: single subquery — no more per-room loop
        # C-01: PENDING bookings now block availability
        booked_room_ids = (
            db.query(Booking.room_id)
            .filter(
                Booking.status.in_([
                    BookingStatus.PENDING,
                    BookingStatus.CONFIRMED,
                    BookingStatus.CHECKED_IN,
                ]),
                Booking.check_in_date < check_out,
                Booking.check_out_date > check_in,
            )
            .subquery()
        )

        if available:
            query = query.filter(Room.id.notin_(booked_room_ids))
        else:
            query = query.filter(Room.id.in_(booked_room_ids))

    return query.offset(skip).limit(limit).all()


# ---------------------------------------------------------------------------
# Single room
# ---------------------------------------------------------------------------
@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


# ---------------------------------------------------------------------------
# Availability check for a single room
# H-04 / H-05 / H-06: date range validated via shared utility
# C-01: PENDING bookings block availability
# ---------------------------------------------------------------------------
@router.get("/{room_id}/availability", response_model=RoomAvailability)
async def check_room_availability(
    room_id: int,
    check_in: datetime = Query(...),
    check_out: datetime = Query(...),
    db: Session = Depends(get_db),
):
    validate_date_range(check_in, check_out)

    room = db.query(Room).filter(Room.id == room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    conflicting = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status.in_([
            BookingStatus.PENDING,       # C-01
            BookingStatus.CONFIRMED,
            BookingStatus.CHECKED_IN,
        ]),
        Booking.check_in_date < check_out,
        Booking.check_out_date > check_in,
    ).first()

    return RoomAvailability(
        room_id=room_id,
        check_in=check_in,
        check_out=check_out,
        available=conflicting is None,
    )
