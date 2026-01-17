# Setup Instructions for Shivashray Hotel Booking System

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Docker and Docker Compose installed
- PostgreSQL (or use Docker)

## Initial Setup

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Seed initial data
python scripts/seed_data.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local if needed (default should work for local dev)

# Run development server
npm run dev
```

### 3. Using Docker (Alternative)

```bash
# From project root
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Seed data
docker-compose exec backend python scripts/seed_data.py
```

## Default Credentials

After seeding data, you can login with:

- **Admin Email**: admin@shivashrayhotel.com
- **Admin Password**: admin123

## Running the Application

1. Start PostgreSQL (if not using Docker)
2. Start backend: `cd backend && uvicorn app.main:app --reload`
3. Start frontend: `cd frontend && npm run dev`

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development Notes

- Backend uses FastAPI with automatic API documentation
- Frontend uses Next.js 14+ with App Router
- Database migrations use Alembic
- Authentication uses JWT tokens

## Troubleshooting

1. **Database connection errors**: Check DATABASE_URL in backend/.env
2. **CORS errors**: Verify CORS_ORIGINS in backend/.env includes frontend URL
3. **Module not found**: Ensure virtual environment is activated and dependencies are installed

