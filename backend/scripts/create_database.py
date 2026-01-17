"""Create database if it doesn't exist"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    # Connect to PostgreSQL server (using default 'postgres' database)
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="postgres",
        database="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    # Check if database exists
    cur.execute("SELECT 1 FROM pg_database WHERE datname = 'shivashray_hotel'")
    exists = cur.fetchone()
    
    if not exists:
        cur.execute('CREATE DATABASE shivashray_hotel')
        print("Database 'shivashray_hotel' created successfully!")
    else:
        print("Database 'shivashray_hotel' already exists.")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    create_database()

