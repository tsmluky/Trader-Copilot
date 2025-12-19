
import sys
import os
from dotenv import load_dotenv

# Setup paths
current_dir = os.getcwd()
backend_dir = os.path.join(current_dir, 'backend')
sys.path.append(backend_dir)
load_dotenv(os.path.join(backend_dir, '.env'))

from database import SessionLocal
from models_db import User
from core.security import verify_password, get_password_hash

def main():
    session = SessionLocal()
    email = "admin@tradercopilot.com"
    password = "admin"
    
    print(f"Checking user: {email}")
    user = session.query(User).filter(User.email == email).first()
    
    if not user:
        print("❌ User not found in DB!")
        return

    print(f"User found. ID: {user.id}")
    print(f"Stored Hash: {user.hashed_password}")
    
    # Test verify
    is_valid = verify_password(password, user.hashed_password)
    if is_valid:
        print("✅ verify_password('admin', hash) passed.")
    else:
        print("❌ verify_password failed! Hash mismatch.")
        
    # Re-hash check
    new_hash = get_password_hash(password)
    print(f"New Hash of 'admin': {new_hash}")
    print(f"Verify New: {verify_password(password, new_hash)}")

if __name__ == "__main__":
    main()
