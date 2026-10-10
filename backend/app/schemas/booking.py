from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from app.models.booking import BookingStatus, PaymentStatus

class BookingBase(BaseModel):
    room_id: int
    check_in_date: datetime
    check_out_date: datetime
    number_of_guests: int = Field(default=1, ge=1, description="Total guest count (min 1)")
    number_of_adults: Optional[int] = Field(default=None, ge=1, description="Adult count (min 1 when provided)")
    number_of_children: Optional[int] = Field(default=None, ge=0, description="Child count (min 0)")
    guest_name: str = Field(..., min_length=2)
    guest_email: EmailStr
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = Field(default=None, max_length=2000)

class BookingCreate(BookingBase):
    # PR-04: client sends the price it displayed; backend rejects if it drifted > ₹1
    quoted_amount: Optional[Decimal] = Field(default=None, ge=0)

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    special_requests: Optional[str] = None
    payment_reference: Optional[str] = Field(default=None, max_length=200)  # PAY-16: UPI/cash receipt

class BookingResponse(BookingBase):
    id: int
    booking_ref: str
    user_id: Optional[int] = None
    total_amount: float
    tax_amount: float
    tax_rate: float
    currency: str
    status: BookingStatus
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

