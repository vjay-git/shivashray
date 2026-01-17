from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.service import ServiceResponse
from app.models.service import Service

router = APIRouter()

@router.get("", response_model=List[ServiceResponse])
async def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).filter(Service.is_active == True).all()
    return services

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id, Service.is_active == True).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

