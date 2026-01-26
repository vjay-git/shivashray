from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# Association table for room amenities
room_amenity_association = Table(
    "room_amenity_association",
    Base.metadata,
    Column("room_id", Integer, ForeignKey("rooms.id")),
    Column("amenity_id", Integer, ForeignKey("room_amenities.id")),
)

class RoomType(Base):
    __tablename__ = "room_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)  # e.g., "Deluxe Room", "Super Deluxe Room"
    description = Column(Text, nullable=True)
    max_occupancy = Column(Integer, nullable=False, default=2)
    base_price = Column(Float, nullable=False)  # Base price for double occupancy (Deluxe/Super Deluxe) or quad (Family)
    extra_adult_price = Column(Float, nullable=True)  # Price per night for extra adult
    child_price = Column(Float, nullable=True)  # Price per night for child
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    rooms = relationship("Room", back_populates="room_type")

class RoomAmenity(Base):
    __tablename__ = "room_amenities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)  # e.g., "WiFi", "AC", "TV"
    icon = Column(String, nullable=True)
    
    rooms = relationship("Room", secondary=room_amenity_association, back_populates="amenities")

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, nullable=False, index=True)
    room_type_id = Column(Integer, ForeignKey("room_types.id"), nullable=False)
    floor = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    image_urls = Column(String, nullable=True)  # JSON array of image URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    room_type = relationship("RoomType", back_populates="rooms")
    amenities = relationship("RoomAmenity", secondary=room_amenity_association, back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")

