import requests
import json

URL = "http://127.0.0.1:8000/auth/register"
PAYLOAD = {
    "email": "debug_test@example.com",
    "password": "password123",
    "name": "Debug User"
}

try:
    print(f"Sending POST to {URL} with payload: {PAYLOAD}")
    response = requests.post(URL, json=PAYLOAD)
    print(f"Status Code: {response.status_code}")
    try:
        print("Response Body:")
        print(json.dumps(response.json(), indent=2))
    except:
        print("Raw Response:", response.text)
except Exception as e:
    print(f"Connection Failed: {e}")
