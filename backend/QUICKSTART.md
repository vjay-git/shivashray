# Quick Start - Backend

## Step-by-Step Instructions

### 1. Install Python Dependencies

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Create .env File

Create a file named `.env` in the `backend` folder with this content:

```env
DATABASE_URL=postgresql://shivashray:shivashray123@localhost:5432/shivashray_hotel
SECRET_KEY=your-secret-key-change-in-production-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Start PostgreSQL Database

**Option A: Using Docker (Easiest)**
```powershell
# From project root directory
docker-compose up -d postgres
```

**Option B: Install PostgreSQL locally**
- Download from https://www.postgresql.org/download/
- Create database and user as shown in RUN.md

### 4. Run Database Migrations

```powershell
# Make sure you're in backend directory with venv activated
alembic upgrade head
```

### 5. Seed Initial Data

```powershell
python scripts/seed_data.py
```

This creates:
- Admin user (admin@shivashrayhotel.com / admin123)
- Room types and rooms
- Hotel services

### 6. Start the Backend Server

```powershell
uvicorn app.main:app --reload
```

The server will start on **http://localhost:8000**

## Verify It Works

1. Open http://localhost:8000/health - should show `{"status": "healthy"}`
2. Open http://localhost:8000/docs - API documentation (Swagger UI)

## Common Issues

**"Module not found"**
- Make sure virtual environment is activated: `venv\Scripts\activate`
- Reinstall: `pip install -r requirements.txt`

**"Database connection error"**
- Check PostgreSQL is running: `docker ps`
- Verify DATABASE_URL in `.env` matches your database

**"Port 8000 already in use"**
- Use different port: `uvicorn app.main:app --reload --port 8001`

