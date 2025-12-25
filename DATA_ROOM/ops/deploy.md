# Deployment Guide

The system is cloud-agnostic and container-ready.

## 1. Railway (Recommended)
- **Repo Connection**: Connect GitHub repo.
- **Services**:
  1. `backend`: Python buildpack (`pip install -r backend/requirements.txt`, `python backend/main.py`).
  2. `web`: Node.js buildpack (`npm install`, `npm run build`, `npm run preview` or serve static).
  3. `database`: PostgreSQL plugin.

## 2. Docker
**Dockerfile** (Backend):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## 3. Environment Variables
Ensure all variables from `DATA_ROOM/.env.example` are set in the cloud provider's dashboard.
