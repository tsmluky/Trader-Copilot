# tradercopilot-freshsale/START_DEV.ps1

Write-Host "============================" -ForegroundColor Cyan
Write-Host " STARTING TRADERCOPILOT DEV " -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# 1. Start Backend (Background)
Write-Host "[1/2] Starting Backend (Port 8000)..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "$env:PYTHONPATH='$(Get-Location)\backend'; cd backend; uvicorn main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# 2. Start Frontend (Background)
Write-Host "[2/2] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev" -PassThru

Write-Host "✅ SERVERS STARTED!" -ForegroundColor Green
Write-Host "   -> Backend: http://localhost:8000"
Write-Host "   -> Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Press any key to close this launcher (servers will stay open checking background windows)..."
