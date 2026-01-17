from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.room import RoomCreate, RoomResponse, RoomTypeCreate, RoomTypeResponse
from app.schemas.booking import BookingResponse, BookingUpdate
from app.schemas.service import ServiceCreate, ServiceResponse
from app.models.room import Room, RoomType, RoomAmenity
from app.models.booking import Booking
from app.models.service import Service
from app.api.v1.auth import get_current_admin_user
from app.models.user import User

router = APIRouter()

# Room Management
@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Verify room type exists
    room_type = db.query(RoomType).filter(RoomType.id == room_data.room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    # Check if room number already exists
    existing_room = db.query(Room).filter(Room.room_number == room_data.room_number).first()
    if existing_room:
        raise HTTPException(status_code=400, detail="Room number already exists")
    
    db_room = Room(
        room_number=room_data.room_number,
        room_type_id=room_data.room_type_id,
        floor=room_data.floor,
        description=room_data.description,
        image_urls=str(room_data.image_urls) if room_data.image_urls else None
    )
    
    if room_data.amenity_ids:
        amenities = db.query(RoomAmenity).filter(RoomAmenity.id.in_(room_data.amenity_ids)).all()
        db_room.amenities = amenities
    
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return bookings

@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking_admin(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking_update.status:
        booking.status = booking_update.status
    if booking_update.payment_status:
        booking.payment_status = booking_update.payment_status
    if booking_update.special_requests is not None:
        booking.special_requests = booking_update.special_requests
    
    db.commit()
    db.refresh(booking)
    return booking

