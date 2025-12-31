# Development Guide

## Quick Start (Fresh Clone)

1.  **Bootstrap Environment**
    ```powershell
    ./scripts/bootstrap.ps1
    ```
    This installs Python/Node dependencies and sets up `.env`.

2.  **Start Application**
    ```powershell
    ./START_DEV.ps1
    ```
    - Backend: http://localhost:8000
    - Frontend: http://localhost:5173

## Scripts (`/scripts`)

-   `bootstrap.ps1`: Installs dependencies and robustly sets up environment.
-   `test_backend.ps1`: Runs Pytest suite for API/Auth.
-   `build_web.ps1`: Compiles the React frontend for production.
-   `kill_all.ps1`: Force stops all backend processes.

## Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for system map.
