# API Endpoints Specification

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/audit` | **Yes** | Get Audit Logs |
| GET | `/admin/signals` | **Yes** | List Signals |
| PATCH | `/admin/signals/{signal_id}` | **Yes** | Toggle Signal Visibility |
| GET | `/admin/stats` | **Yes** | Get Admin Stats |
| GET | `/admin/users` | **Yes** | List Users |
| PATCH | `/admin/users/{user_id}/plan` | **Yes** | Update User Plan |
| POST | `/advisor/` | **Yes** | Analyze Advisor |
| POST | `/advisor/chat` | **Yes** | Advisor Chat |
| GET | `/advisor/profile` | **Yes** | Get Advisor Profile |
| PUT | `/advisor/profile` | **Yes** | Update Advisor Profile |
| POST | `/analyze/lite` | No | Analyze Lite |
| POST | `/analyze/pro` | No | Analyze Pro |
| GET | `/auth/me/entitlements` | No | Read My Entitlements |
| POST | `/auth/register` | No | Register User |
| POST | `/auth/token` | No | Login For Access Token |
| GET | `/auth/users/me` | **Yes** | Read Users Me |
| PATCH | `/auth/users/me/password` | **Yes** | Update Password |
| PATCH | `/auth/users/me/plan` | **Yes** | Update My Plan |
| PATCH | `/auth/users/me/telegram` | **Yes** | Update Telegram Id |
| PATCH | `/auth/users/me/timezone` | **Yes** | Update Timezone |
| POST | `/backtest/run` | No | Run Backtest |
| GET | `/backtest/strategies` | No | List Backtestable Strategies |
| GET | `/health` | No | Health Check |
| GET | `/logs/recent` | No | Get Recent Logs |
| GET | `/logs/{mode}/{token}` | No | Get Logs By Token |
| GET | `/market/ohlcv/{token}` | No | Get Market Ohlcv |
| GET | `/market/summary` | No | Market Summary Endpoint |
| POST | `/notify/telegram` | No | Notify Telegram |
| GET | `/ready` | No | Ready Check |
| GET | `/stats/summary` | No | Stats Summary |
| GET | `/strategies/marketplace` | **Yes** | Get Marketplace |
| POST | `/strategies/marketplace/create` | **Yes** | Create Persona |
| DELETE | `/strategies/marketplace/{persona_id}` | **Yes** | Delete Persona |
| GET | `/strategies/marketplace/{persona_id}/history` | **Yes** | Get Persona History |
| PATCH | `/strategies/marketplace/{persona_id}/toggle` | **Yes** | Toggle Strategy |
| GET | `/system/config` | No | Get System Config |
| GET | `/system/health` | No | Health Check |
| POST | `/telegram/webhook` | No | Telegram Webhook |