
import sys
import os
from collections import defaultdict

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from fastapi.routing import APIRoute

def detect_collisions():
    routes = defaultdict(list)
    
    # Iterate all routes
    for route in app.routes:
        if isinstance(route, APIRoute):
            for method in route.methods:
                key = (method, route.path_format)
                routes[key].append(route.name)
                
    collisions = []
    for (method, path), names in routes.items():
        if len(names) > 1:
             collisions.append(f"{method} {path} -> {names}")
             
    if collisions:
        print("❌ ROUTE COLLISIONS DETECTED:")
        for c in collisions:
            print(f"  - {c}")
        sys.exit(1)
    else:
        print(" [OK] No Route Collisions Detected.")
        sys.exit(0)

if __name__ == "__main__":
    detect_collisions()
