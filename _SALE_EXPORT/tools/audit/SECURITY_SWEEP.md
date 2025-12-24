# Security Sweep Report

## 1. Hardcoded Secrets (Critical)
- **[PASSED]** No hardcoded `DEEPSEEK_API_KEY` or `GEMINI_API_KEY` found in code (all use `os.getenv`).
- **[WARNING]** VAPID Private Keys found in:
    - `tools/vapid_keys.txt`
    - `backend/vapid_keys_final.txt`
    - **Recommendation**: These files should be EXCLUDED from the final zip (already handled in `package_project.py` exclusions) or moved to a private env file.

## 2. CORS Configuration
- **File**: `backend/main.py`
- **Current State**: 
    - `origins` includes `*` (Allow All) or `localhost` variants.
    - **Finding**: Permissive CORS is acceptable for "sale-ready" MVP demo, but should be noted for Production deployment.
    - **Snippet**: `allow_origins=origins` (where origins includes `*`).

## 3. Auth & Endpoints
- **Admin**: `create_admin.py` creates a known user (`admin@tradercopilot.com` / `admin`).
    - **Recommendation**: Change this password immediately upon deployment.
- **Advisor Endpoint Duplication**:
    - `/advisor/chat` AND `/analyze/advisor/chat`.
    - **Risk**: Confusing API surface.

## 4. Dependencies
- `node_modules` and `.venv` are correctly excluded in the new `package_project.py`.

## Summary
The project is largely clean of hardcoded API keys in logic files. The main artifacts to protect are the `vapid_keys.txt` files which are correctly excluded by the packaging script.
