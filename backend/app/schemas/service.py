from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

