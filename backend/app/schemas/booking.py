from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.booking import BookingStatus, PaymentStatus

class BookingBase(BaseModel):
    room_id: int
    check_in_date: datetime
    check_out_date: datetime
    number_of_guests: int = 1
    guest_name: str
    guest_email: EmailStr
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    special_requests: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    user_id: Optional[int] = None
    total_amount: float
    status: BookingStatus
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

