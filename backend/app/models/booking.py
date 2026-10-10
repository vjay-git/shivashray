from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
import secrets


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"          # BF-09: guest did not arrive

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    # BF-05: human-readable, non-sequential reference for guest-facing use
    booking_ref = Column(
        String(20),
        unique=True,
        index=True,
        nullable=False,
        default=lambda: f"SHIV-{secrets.token_hex(4).upper()}",
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in_date = Column(DateTime(timezone=True), nullable=False, index=True)
    check_out_date = Column(DateTime(timezone=True), nullable=False, index=True)
    number_of_guests = Column(Integer, nullable=False, default=1)
    number_of_adults = Column(Integer, nullable=True, default=None)  # Number of adults
    number_of_children = Column(Integer, nullable=True, default=None)  # Number of children
    total_amount = Column(Numeric(12, 2), nullable=False)
    tax_amount = Column(Numeric(12, 2), nullable=False, default=0)
    tax_rate = Column(Numeric(5, 4), nullable=False, default=0)
    currency = Column(String(3), nullable=False, default='INR')
    quoted_amount = Column(Numeric(12, 2), nullable=True)
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

