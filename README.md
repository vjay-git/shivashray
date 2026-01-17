# Shivashray Hotel Booking System

A production-ready hotel booking web application for Shivashray Hotel in Varanasi.

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI with SQLAlchemy
- **Database**: PostgreSQL
- **Deployment**: Docker

## Features

### User Features
- Browse available rooms with filters
- Real-time availability checking
- User authentication and registration
- Booking management (view, cancel bookings)
- Hotel services and amenities display
- Responsive design for all devices

### Admin Features
- Admin dashboard with booking statistics
- Room management
- Booking management (confirm, check-in, check-out, cancel)
- Payment status management
- Revenue tracking

## Project Structure

```
shivashray-hotel/
├── frontend/          # Next.js application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities, API client
│   └── types/        # TypeScript types
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── models/   # Database models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── services/ # Business logic
│   ├── alembic/      # Database migrations
│   └── scripts/      # Utility scripts
└── docker-compose.yml # Local development setup
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your database URL
   alembic upgrade head
   python scripts/seed_data.py
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Default Admin Credentials

- Email: `admin@shivashrayhotel.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Rooms
- `GET /api/v1/rooms` - List rooms (with optional filters)
- `GET /api/v1/rooms/{id}` - Get room details
- `GET /api/v1/rooms/{id}/availability` - Check availability

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - List user bookings
- `GET /api/v1/bookings/{id}` - Get booking details
- `PATCH /api/v1/bookings/{id}` - Update booking
- `DELETE /api/v1/bookings/{id}` - Cancel booking

### Admin
- `GET /api/v1/admin/bookings` - List all bookings
- `PATCH /api/v1/admin/bookings/{id}` - Update booking (admin)
- `POST /api/v1/admin/rooms` - Create room

### Services
- `GET /api/v1/services` - List hotel services

## Development

### Code Quality
- Backend: Black formatter, Flake8 linter
- Frontend: ESLint, Prettier (via Next.js)

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Production Deployment

1. Set environment variables for production
2. Build frontend: `cd frontend && npm run build`
3. Use production ASGI server: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`
4. Set up reverse proxy (nginx)
5. Configure SSL/HTTPS
6. Set up database backups

## License

Proprietary - Shivashray Hotel
