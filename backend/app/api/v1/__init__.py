from fastapi import APIRouter
from app.api.v1 import auth, rooms, bookings, admin, services

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

