# Developer Quickstart

Get the system running locally in 5 minutes.

## Prerequisites
- Python 3.10+
- Node.js 18+
- SQLite (default) or PostgreSQL

## Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# Edit .env (See .env.example for defaults)
python main.py
```
> Server runs at `http://localhost:8000`

## Frontend
```powershell
cd web
npm install
cp .env.example .env
npm run dev
```
> UI runs at `http://localhost:5173`

## Seeding Demo Data
```powershell
# In backend/ directory
python scripts/seed_data.py
```
*(Creates admin@tradercopilot.com / password)*
