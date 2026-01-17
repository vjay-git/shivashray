from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.room import Room
from app.api.v1.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate dates
    if booking_data.check_out_date <= booking_data.check_in_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date"
        )
    
    if booking_data.check_in_date < datetime.now(booking_data.check_in_date.tzinfo):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date cannot be in the past"
        )
    
    # Check room exists and is active
    room = db.query(Room).filter(Room.id == booking_data.room_id, Room.is_active == True).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check availability
    conflicting_booking = db.query(Booking).filter(
        Booking.room_id == booking_data.room_id,
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN]),
        Booking.check_in_date < booking_data.check_out_date,
        Booking.check_out_date > booking_data.check_in_date
    ).first()
    
    if conflicting_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room is not available for the selected dates"
        )
    
    # Calculate total amount
    nights = (booking_data.check_out_date - booking_data.check_in_date).days
    total_amount = room.room_type.base_price * nights
    
    # Create booking
    db_booking = Booking(
        user_id=current_user.id,
        room_id=booking_data.room_id,
        check_in_date=booking_data.check_in_date,
        check_out_date=booking_data.check_out_date,
        number_of_guests=booking_data.number_of_guests,
        total_amount=total_amount,
        status=BookingStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        guest_name=booking_data.guest_name,
        guest_email=booking_data.guest_email,
        guest_phone=booking_data.guest_phone,
        special_requests=booking_data.special_requests
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return db_booking

@router.get("", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).order_by(Booking.created_at.desc()).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Users can only view their own bookings unless admin
    if booking.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    return booking

@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Users can only cancel their own bookings
    if booking.user_id != current_user.id and current_user.role.value != "admin":
        if booking_update.status != BookingStatus.CANCELLED:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
        booking.status = BookingStatus.CANCELLED
    else:
        if booking_update.status:
            booking.status = booking_update.status
        if booking_update.payment_status:
            booking.payment_status = booking_update.payment_status
        if booking_update.special_requests is not None:
            booking.special_requests = booking_update.special_requests
    
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    booking.status = BookingStatus.CANCELLED
    db.commit()
    return None

