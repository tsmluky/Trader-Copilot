import sys
import os
from datetime import timedelta

# Setup paths
current_dir = os.getcwd()
backend_dir = os.path.join(current_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from core.config import load_env_if_needed
load_env_if_needed()

from database import SessionLocal
from models_db import User
from core.security import verify_password, create_access_token

def main():
    session = SessionLocal()
    email = "admin@tradercopilot.com"
    password = "admin123"
    
    try:
        user = session.query(User).filter(User.email == email).first()
        
        if not user:
            print("ERROR: User not found")
            sys.exit(1)

        if not verify_password(password, user.hashed_password):
            print("ERROR: Invalid password")
            sys.exit(1)
            
        access_token = create_access_token(
            data={"sub": user.email},expires_delta=timedelta(minutes=15)
        )
        print(f"Access Token: {access_token}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        session.close()

if __name__ == "__main__":
    main()
