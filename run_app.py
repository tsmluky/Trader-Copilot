
import os
import sys
import traceback

# 1. Setup Path BEFORE any imports
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")

print(f"[BOOT HANDLER] CWD: {os.getcwd()}", flush=True)
print(f"[BOOT HANDLER] Adding {backend_dir} to sys.path", flush=True)

sys.path.append(backend_dir)
sys.path.append(current_dir)

try:
    import uvicorn
    # Verify we can import main
    from backend import main
    print("[BOOT HANDLER] Successfully imported backend.main", flush=True)
except Exception as e:
    print(f"[BOOT HANDLER] CRITICAL IMPORT ERROR: {e}", flush=True)
    traceback.print_exc()
    sys.exit(1)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"[BOOT HANDLER] Starting Uvicorn on port {port}...", flush=True)
    
    try:
        # Use simple string reference to avoid multiprocessing issues if any,
        # but pure python object is safer for custom execution.
        # We learned that 'backend.main:app' relies on discovery.
        # Since we modified sys.path, 'main:app' might work if we are IN backend dir,
        # or 'backend.main:app' from root.
        
        # Let's use the programmatic interface.
        uvicorn.run(
            "backend.main:app", 
            host="0.0.0.0", 
            port=port, 
            log_level="info",
            reload=False # No reload in production
        )
    except Exception as e:
        print(f"[BOOT HANDLER] CRITICAL RUNTIME ERROR: {e}", flush=True)
        traceback.print_exc()
        sys.exit(1)
