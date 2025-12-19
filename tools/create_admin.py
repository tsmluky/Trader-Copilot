import sys
import os
from dotenv import load_dotenv

# 1. Setup paths and env BEFORE imports
current_dir = os.getcwd() # Assumption: running from root
backend_dir = os.path.join(current_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

# Load environment variables (STRICT)
env_path = os.path.join(backend_dir, '.env')
if os.path.exists(env_path):
    print(f"[TOOL] Loading env from: {env_path}")
    load_dotenv(env_path, override=True)
else:
    print(f"[TOOL] ⚠️ .env not found at {env_path}. Using system env or defaults.")

print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")

# 2. Imports
from database import engine, Base, SessionLocal
from models_db import User
from core.security import get_password_hash
from sqlalchemy import select, text

def main():
    print("Connecting to database (SYNC)...")
    
    # Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables validated.")
    except Exception as e:
        print(f"Error creating tables: {e}")
        return

    session = SessionLocal()
    try:
        email = "admin@tradercopilot.com"
        
        # Check if exists
        user = session.query(User).filter(User.email == email).first()
        
        admin_pass = os.getenv("ADMIN_PASSWORD", "admin")
        if admin_pass == "admin":
            print("⚠️ USING DEFAULT PASSWORD 'admin'. Set ADMIN_PASSWORD in env for production!")
            
        if user:
            print(f"User {email} already exists. Resetting password...")
            user.hashed_password = get_password_hash(admin_pass)
            session.commit()
            print("Password updated.")
        else:
            print(f"Creating user {email}...")
            new_user = User(
                email=email,
                hashed_password=get_password_hash(admin_pass),
                name="Systems Admin",
                role="admin",
                plan="pro" # Give PRO access by default for verification
            )
            session.add(new_user)
            session.commit()
            print("User created successfully.")
            
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    main()
