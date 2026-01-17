"""
Seed script to populate initial data for Shivashray Hotel
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import User, Room, RoomType, RoomAmenity, Service
from app.core.security import get_password_hash
from app.models.user import UserRole

def seed_data():
    db: Session = SessionLocal()
    
    try:
        # Create admin user
        admin_email = "admin@shivashrayhotel.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                phone="+91-9876543210",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            print("Created admin user")
        
        # Create room amenities
        amenities_data = [
            {"name": "WiFi", "icon": "wifi"},
            {"name": "Air Conditioning", "icon": "ac"},
            {"name": "TV", "icon": "tv"},
            {"name": "Mini Bar", "icon": "minibar"},
            {"name": "Room Service", "icon": "room-service"},
            {"name": "Balcony", "icon": "balcony"},
            {"name": "River View", "icon": "view"},
        ]
        
        for amenity_data in amenities_data:
            existing = db.query(RoomAmenity).filter(RoomAmenity.name == amenity_data["name"]).first()
            if not existing:
                amenity = RoomAmenity(**amenity_data)
                db.add(amenity)
        print("Created room amenities")
        
        # Create room types
        room_types_data = [
            {
                "name": "Standard",
                "description": "Comfortable standard room with essential amenities",
                "max_occupancy": 2,
                "base_price": 2000.0
            },
            {
                "name": "Deluxe",
                "description": "Spacious deluxe room with premium amenities",
                "max_occupancy": 3,
                "base_price": 3500.0
            },
            {
                "name": "Suite",
                "description": "Luxurious suite with separate living area",
                "max_occupancy": 4,
                "base_price": 5500.0
            },
        ]
        
        room_types = {}
        for rt_data in room_types_data:
            existing = db.query(RoomType).filter(RoomType.name == rt_data["name"]).first()
            if not existing:
                room_type = RoomType(**rt_data)
                db.add(room_type)
                db.flush()
                room_types[rt_data["name"]] = room_type
            else:
                room_types[rt_data["name"]] = existing
        print("Created room types")
        
        # Create rooms
        rooms_data = [
            {"number": "101", "type": "Standard", "floor": 1, "amenities": ["WiFi", "AC", "TV"]},
            {"number": "102", "type": "Standard", "floor": 1, "amenities": ["WiFi", "AC", "TV"]},
            {"number": "103", "type": "Standard", "floor": 1, "amenities": ["WiFi", "AC", "TV"]},
            {"number": "201", "type": "Deluxe", "floor": 2, "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Balcony"]},
            {"number": "202", "type": "Deluxe", "floor": 2, "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Balcony"]},
            {"number": "301", "type": "Suite", "floor": 3, "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "River View"]},
            {"number": "302", "type": "Suite", "floor": 3, "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "River View"]},
        ]
        
        for room_data in rooms_data:
            existing = db.query(Room).filter(Room.room_number == room_data["number"]).first()
            if not existing:
                room = Room(
                    room_number=room_data["number"],
                    room_type_id=room_types[room_data["type"]].id,
                    floor=room_data["floor"],
                    description=f"Room {room_data['number']} - {room_data['type']}",
                    image_urls=None
                )
                # Add amenities
                amenity_names = room_data["amenities"]
                amenities = db.query(RoomAmenity).filter(RoomAmenity.name.in_(amenity_names)).all()
                room.amenities = amenities
                db.add(room)
        print("Created rooms")
        
        # Create services
        services_data = [
            {"name": "Restaurant", "description": "Multi-cuisine restaurant serving delicious meals", "icon": "restaurant"},
            {"name": "Spa & Wellness", "description": "Relaxing spa treatments and wellness services", "icon": "spa"},
            {"name": "Concierge", "description": "24/7 concierge service for your convenience", "icon": "concierge"},
            {"name": "Laundry", "description": "Professional laundry and dry cleaning services", "icon": "laundry"},
            {"name": "Airport Transfer", "description": "Complimentary airport pickup and drop", "icon": "transfer"},
            {"name": "Tour Booking", "description": "Assistance with local tour and travel bookings", "icon": "tour"},
        ]
        
        for service_data in services_data:
            existing = db.query(Service).filter(Service.name == service_data["name"]).first()
            if not existing:
                service = Service(**service_data)
                db.add(service)
        print("Created services")
        
        db.commit()
        print("\nSeed data created successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"\nError seeding data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

