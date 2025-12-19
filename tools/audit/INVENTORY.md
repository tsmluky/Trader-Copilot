# TraderCopilot Technical Inventory

## 1. Entry Points
- **Backend Entry**: `backend/main.py`
    - **Command**: `uvicorn main:app --reload` (or similar)
    - **Port**: 8000
    - **Dependencies**: `backend/requirements.txt`
- **Frontend Entry**: `web/package.json`
    - **Dev Command**: `npm run dev` (calls `vite`)
    - **Build Command**: `npm run build` (calls `vite build`)

## 2. API Endpoints (Key Routes)

### Analysis (LITE/PRO)
- **Router**: `backend/routers/analysis.py`
- **LITE Real**: `POST /analyze/lite` (Defined in `routers/analysis.py`, mounted via `main.py` with prefix `/analyze`)
- **PRO Real**: `POST /analyze/pro` (Defined in `routers/analysis.py`, mounted via `main.py` with prefix `/analyze`)

### Advisor & Chat
- **Duplicate Detected**:
    1. **`POST /advisor/chat`**: Defined in `routers/advisor.py`, mounted in `main.py` at line 220 with prefix `/advisor`.
    2. **`POST /analyze/advisor/chat`**: Defined directly in `main.py` at line 694.
- **Recommendation**: Deprecate the direct definition in `main.py` and strictly use the router version (`/advisor/chat`) or alias it properly. The frontend likely uses one of them (needs check, but audit focuses on backend capability).

### Authentication
- **Router**: `backend/routers/auth.py`
- **Token Endpoint**: `POST /auth/token` (OAuth2 spec)
    - **Payload**: `username` (email), `password` (form-urlencoded)
- **Entitlements**: `GET /auth/me/entitlements`
- **Header**: `Authorization: Bearer <access_token>`

## 3. Administrative
- **Admin Creation**: `tools/create_admin.py`
    - **Usage**: `python tools/create_admin.py`
    - **User**: `admin@tradercopilot.com` / `admin`

## 4. Other
- **Health**: `GET /health` (`main.py`)
- **Ready**: `GET /ready` (`main.py`)
