from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in_date = Column(DateTime(timezone=True), nullable=False, index=True)
    check_out_date = Column(DateTime(timezone=True), nullable=False, index=True)
    number_of_guests = Column(Integer, nullable=False, default=1)
    number_of_adults = Column(Integer, nullable=True, default=None)  # Number of adults
    number_of_children = Column(Integer, nullable=True, default=None)  # Number of children
    total_amount = Column(Float, nullable=False)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.PENDING, index=True)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=True)
    special_requests = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User")
    room = relationship("Room", back_populates="bookings")

