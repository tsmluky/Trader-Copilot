import requests
import sys

BASE_URL = "http://localhost:8000"

def test_auth():
    print(">>> Testing Auth Flow...")
    
    # 1. Register (or ensure user exists)
    email = "test_auth_v2@tradercopilot.com"
    password = "password123"
    
    try:
        reg_resp = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "name": "Auth Tester"
        })
        print(f"Register: {reg_resp.status_code}")
    except Exception as e:
        print(f"Register failed (maybe already exists): {e}")

    # 2. Login (Get Token)
    # OAuth2 expects form-data: username, password
    login_data = {
        "username": email,
        "password": password
    }
    
    login_resp = requests.post(f"{BASE_URL}/auth/token", data=login_data)
    if login_resp.status_code != 200:
        print(f"Login Failed: {login_resp.text}")
        sys.exit(1)
        
    token = login_resp.json()["access_token"]
    print(f"Login Success! Token: {token[:10]}...")
    
    # 3. Access Protected Endpoint (Advisor Profile)
    headers = {"Authorization": f"Bearer {token}"}
    profile_resp = requests.get(f"{BASE_URL}/advisor/profile", headers=headers)
    
    if profile_resp.status_code == 200:
        print("Advisor Profile Access: SUCCESS")
    else:
        print(f"Advisor Profile Access FAILED: {profile_resp.status_code} {profile_resp.text}")
        sys.exit(1)
        
    # 4. Access Advisor Chat
    chat_payload = {
        "messages": [{"role": "user", "content": "Hola Advisor, prueba de auth"}]
    }
    chat_resp = requests.post(f"{BASE_URL}/advisor/chat", json=chat_payload, headers=headers)
    print(f"Advisor Chat Response: {chat_resp.status_code}")
    if chat_resp.status_code in [200, 503]: # 503 is expected if AI service is offline but Auth passed
        print("Advisor Chat Auth: SUCCESS")
    else:
        print(f"Advisor Chat Auth FAILED: {chat_resp.status_code} {chat_resp.text}")

if __name__ == "__main__":
    test_auth()
