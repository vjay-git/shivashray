from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class PaymentEventType(str, enum.Enum):
    CHARGED = "charged"
    REFUNDED = "refunded"


class PaymentEvent(Base):
    __tablename__ = "payment_events"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, index=True)
    event_type = Column(SQLEnum(PaymentEventType), nullable=False)
    from_status = Column(String(20), nullable=True)
    to_status = Column(String(20), nullable=False)
    amount = Column(Numeric(12, 2), nullable=True)
    reference = Column(String, nullable=True)     # UPI txn ID, cash receipt no.
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("Booking")
    actor = relationship("User")
