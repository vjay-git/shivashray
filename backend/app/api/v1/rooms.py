from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.schemas.room import RoomResponse, RoomTypeResponse, RoomAvailability
from app.models.room import Room, RoomType
from app.models.booking import Booking, BookingStatus
from app.api.v1.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/types", response_model=List[RoomTypeResponse])
async def get_room_types(db: Session = Depends(get_db)):
    room_types = db.query(RoomType).all()
    return room_types

@router.get("", response_model=List[RoomResponse])
async def get_rooms(
    room_type_id: Optional[int] = Query(None),
    available: Optional[bool] = Query(None),
    check_in: Optional[datetime] = Query(None),
    check_out: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Room).filter(Room.is_active == True)
    
    if room_type_id:
        query = query.filter(Room.room_type_id == room_type_id)
    
    rooms = query.all()
    
    # Filter by availability if dates provided
    if available is not None and check_in and check_out:
        available_rooms = []
        for room in rooms:
            # Check for conflicting bookings
            conflicting_booking = db.query(Booking).filter(
                Booking.room_id == room.id,
                Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]),
                Booking.check_in_date < check_out,
                Booking.check_out_date > check_in
            ).first()
            
            is_available = conflicting_booking is None
            if available and is_available:
                available_rooms.append(room)
            elif not available and not is_available:
                available_rooms.append(room)
        
        rooms = available_rooms
    
    return rooms

@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.get("/{room_id}/availability", response_model=RoomAvailability)
async def check_room_availability(
    room_id: int,
    check_in: datetime = Query(...),
    check_out: datetime = Query(...),
    db: Session = Depends(get_db)
):
    if check_out <= check_in:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
    
    room = db.query(Room).filter(Room.id == room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check for conflicting bookings
    conflicting_booking = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]),
        Booking.check_in_date < check_out,
        Booking.check_out_date > check_in
    ).first()
    
    return RoomAvailability(
        room_id=room_id,
        check_in=check_in,
        check_out=check_out,
        available=conflicting_booking is None
    )

