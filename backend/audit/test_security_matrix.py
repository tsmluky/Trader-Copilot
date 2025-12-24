
import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from core.security import create_access_token
from database import SessionLocal
from models_db import User
# auth_utils might not be in path or accessible directly?
# create_access_token is from core.security.
# get_password_hash is in routers.auth_utils (sometimes) or core.security?
from core.security import get_password_hash

client = TestClient(app)

def test_public_health():
    res = client.get("/health")
    assert res.status_code == 200

def test_protected_routes_no_auth():
    """Verify 401 when no token provided."""
    protected_paths = [
        ("GET", "/auth/users/me"),
        ("POST", "/analyze/lite"),
        ("POST", "/analyze/pro"),
        ("PATCH", "/auth/users/me/plan"),
    ]
    for method, path in protected_paths:
        if method == "GET":
            res = client.get(path)
        elif method == "POST":
            res = client.post(path, json={})
        elif method == "PATCH":
            res = client.patch(path, json={})
            
        assert res.status_code == 401, f"{path} should be protected but got {res.status_code}"

def test_admin_routes_as_user():
    """Verify 403 when user tries to access admin routes."""
    # Create or Get User for Test
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "user@tradercopilot.com").first()
        if not user:
            print("[SETUP] Creating test user...")
            # get_password_hash is imported from core.security at top level
            user = User(
                email="user@tradercopilot.com",
                hashed_password=get_password_hash("password"),
                role="user",
                name="Test User",
                plan="free",
                plan_status="active"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        user_id = user.id
    finally:
        db.close()

    # Create a user token (role=user). Using seeded user to ensure DB existence.
    token = create_access_token({"sub": "user@tradercopilot.com", "role": "user", "id": user_id})
    headers = {"Authorization": f"Bearer {token}"}
    
    admin_paths = [
        ("GET", "/admin/stats"),
        ("GET", "/admin/users"),
    ]
    
    for method, path in admin_paths:
        if method == "GET":
            res = client.get(path, headers=headers)
            
        assert res.status_code == 403, f"{path} should return 403 for normal user but got {res.status_code}"

def test_destructive_endpoints_removed():
    """Verify dangerous endpoints are GONE."""
    res = client.post("/system/reset")
    assert res.status_code == 404, "/system/reset should be removed (404)!"

    # The toggle in main.py logic was: /strategies/marketplace/{id}/toggle
    # We want to ensure the UNPROTECTED one is gone.
    # But now we have the PROTECTED one in routers/strategies.
    # If we call it without auth, it should be 401 (from protected router) OR 404 (if logic completely changed path).
    # Since router is mounted, the path exists but requires auth.
    res = client.patch("/strategies/marketplace/some_id/toggle")
    assert res.status_code == 401, "/strategies/marketplace/{id}/toggle should be 401 (Protected) now."

if __name__ == "__main__":
    # Mini-runner
    try:
        test_public_health()
        print("[PASS] Public Health")
        test_protected_routes_no_auth()
        print("[PASS] Protected Routes (401)")
        test_admin_routes_as_user()
        print("[PASS] Admin RBAC (403)")
        test_destructive_endpoints_removed()
        print("[PASS] Destructive Endpoints Removed (404/401)")
        print("\n [OK] SECURITY MATRIX PASS")
    except AssertionError as e:
        print(f"\n [FAIL] SECURITY FAIL: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n [ERR] ERROR: {e}")
        sys.exit(1)
