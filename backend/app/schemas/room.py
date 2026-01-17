from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RoomTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_occupancy: int
    base_price: float

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomTypeResponse(RoomTypeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RoomAmenityResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    
    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    room_number: str
    room_type_id: int
    floor: Optional[int] = None
    description: Optional[str] = None
    image_urls: Optional[List[str]] = None

class RoomCreate(RoomBase):
    amenity_ids: Optional[List[int]] = None

class RoomResponse(RoomBase):
    id: int
    is_active: bool
    room_type: RoomTypeResponse
    amenities: List[RoomAmenityResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

class RoomAvailability(BaseModel):
    room_id: int
    check_in: datetime
    check_out: datetime
    available: bool

