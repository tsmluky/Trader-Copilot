import urllib.request
import urllib.parse
import sys


def smoke_auth():
    url = "http://127.0.0.1:8000/auth/token"
    data = urllib.parse.urlencode(
        {"username": "admin@tradercopilot.com", "password": "secure_start"}
    ).encode()

    req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                body = response.read().decode()
                # Just print the body so PS can capture it
                print(body)
            else:
                print(f"Error: {response.status}", file=sys.stderr)
                sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}", file=sys.stderr)
        err_body = e.read().decode()
        print(f"Body: {err_body}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Connection Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    smoke_auth()
