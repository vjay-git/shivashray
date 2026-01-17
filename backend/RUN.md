# How to Run the Backend

## Quick Start

### Step 1: Install Dependencies

```bash
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file (if it exists)
cp .env.example .env

# Or create .env manually with these variables:
```

Minimum required `.env` file:

```env
DATABASE_URL=postgresql://shivashray:shivashray123@localhost:5432/shivashray_hotel
SECRET_KEY=your-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Step 3: Set Up Database

**Option A: Using Docker (Recommended)**

```bash
# From project root
docker-compose up -d postgres

# Wait a few seconds for PostgreSQL to start, then run migrations
cd backend
alembic upgrade head

# Seed initial data
python scripts/seed_data.py
```

**Option B: Using Local PostgreSQL**

1. Install and start PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE shivashray_hotel;
   CREATE USER shivashray WITH PASSWORD 'shivashray123';
   GRANT ALL PRIVILEGES ON DATABASE shivashray_hotel TO shivashray;
   ```
3. Run migrations:
   ```bash
   alembic upgrade head
   python scripts/seed_data.py
   ```

### Step 4: Run the Backend Server

```bash
# Make sure you're in the backend directory and virtual environment is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the shorter command:
```bash
uvicorn app.main:app --reload
```

## Verify It's Working

1. **Health Check**: Open http://localhost:8000/health
   - Should return: `{"status": "healthy"}`

2. **API Root**: Open http://localhost:8000/
   - Should return: `{"message": "Shivashray Hotel API", "version": "1.0.0"}`

3. **API Documentation**: Open http://localhost:8000/docs
   - Swagger UI with all available endpoints

4. **Alternative Docs**: Open http://localhost:8000/redoc
   - ReDoc interface

## Default Admin Credentials

After running `python scripts/seed_data.py`:
- **Email**: admin@shivashrayhotel.com
- **Password**: admin123

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

### Database Connection Error
- Check PostgreSQL is running: `docker ps` (if using Docker)
- Verify DATABASE_URL in `.env` is correct
- Check database credentials

### Module Not Found
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Migration Errors
```bash
# Check current migration status
alembic current

# If needed, reset and reapply
alembic downgrade base
alembic upgrade head
```

## Development Tips

- Use `--reload` flag for auto-reload on code changes
- Check logs in terminal for errors
- Use `/docs` endpoint to test API endpoints interactively
- Database changes require new migrations: `alembic revision --autogenerate -m "description"`

