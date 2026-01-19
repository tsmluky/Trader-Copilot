# Script para levantar TraderCopilot en Local (Backend + Frontend)

Write-Host "🚀 Iniciando TraderCopilot Local Environment..." -ForegroundColor Cyan

# 1. Iniciar Backend (Puerto 8000)
Write-Host "🔹 Lanzando Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; $env:DATABASE_URL='sqlite:///./local_dev.db'; python -m uvicorn main:app --reload --port 8000; Read-Host 'Backend Stopped. Press Enter to exit...'"

# Esperar unos segundos para que el backend arranque
Start-Sleep -Seconds 3

# 2. Iniciar Frontend (Puerto 5173 typically)
Write-Host "🔹 Lanzando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host "✅ Servicios iniciados." -ForegroundColor Green
Write-Host "👉 Backend: http://localhost:8000/docs"
Write-Host "👉 Frontend: http://localhost:5173"
# Script para levantar TraderCopilot en Local (Backend + Frontend)

Write-Host ">>> Iniciando TraderCopilot Local Environment..." -ForegroundColor Cyan

# 1. Iniciar Backend (Puerto 8000)
Write-Host ">>> Lanzando Backend (FastAPI)..." -ForegroundColor Yellow

# Use PSScriptRoot to find the sibling script reliably
$backendScript = Join-Path $PSScriptRoot "run_backend.ps1"
if (-not (Test-Path $backendScript)) {
    Write-Error "Could not find backend script at: $backendScript"
    exit 1
}

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScript

# Esperar unos segundos para que el backend arranque
Start-Sleep -Seconds 3

# 2. Iniciar Frontend (Puerto 4173 Legacy)
Write-Host ">>> Lanzando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host ">>> Servicios iniciados." -ForegroundColor Green
Write-Host "--- Backend: http://localhost:8000/docs"
Write-Host "--- Frontend: http://localhost:4173"
