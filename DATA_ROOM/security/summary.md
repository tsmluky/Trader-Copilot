# Security & Trust Summary

## 1. Authentication
- **Mechanism**: OAuth2 Password Bearer (JWT).
- **Algorithm**: HS256.
- **Expiration**: 30 minutes (access), 24 hours (refresh - planned).
- **Password Hashing**: `bcrypt` (via `passlib`).

## 2. API Security
- **CORS**: Strict allow-list in `main.py` (`origins`). configured via `CORS_ORIGINS` env var.
- **Rate Limiting**:
  - `SlowAPI` middleware integration (planned/active on heavy routes).
  - Default: 100 req/min for authenticated users.

## 3. Secrets Management
- All secrets (DB URL, API Keys, JWT Secret) are loaded from `.env`.
- **No hardcoded secrets** in codebase (CI check passes).

## 4. RBAC (Role Based Access Control)
- **Roles**: `user`, `admin`.
- **Enforcement**: Decorator `@deps.check_role("admin")` on critical endpoints (`/system/*`, `/admin/*`).
