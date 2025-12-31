# Deployment Guide

## Production Build

1.  **Backend**
    -   Ensure `DATABASE_URL` points to a persistent Postgres instance.
    -   Run with a production server (Gunicorn/Uvicorn workers):
        ```bash
        cd backend
        gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
        ```

2.  **Frontend**
    -   Build the static assets:
        ```powershell
        ./scripts/build_web.ps1
        ```
    -   Serve the `web/dist` folder using Nginx, Vercel, or Netlify.

## Environment Variables
See `backend/.env.example` for required keys.
-   `SECRET_KEY`: Must be high-entropy.
-   `DeepSeek_API_KEY`: Required for AI features.
