$ErrorActionPreference = "Stop"

Write-Host "Running Smoke Test..." -ForegroundColor Cyan

# 1. Backend Health
try {
    $res = Invoke-RestMethod -Uri "http://localhost:8080/health" -ErrorAction Stop
    Write-Host "✅ Backend Health: OK ($($res.status))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Health: FAILED" -ForegroundColor Red
    Write-Host "   Is the server running? (Use START_DEV.ps1)"
}

# 2. Frontend Reachability
try {
    $req = Invoke-WebRequest -Uri "http://localhost:5173" -ErrorAction Stop
    if ($req.StatusCode -eq 200) {
        Write-Host "✅ Frontend Reachability: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Reachability: FAILED" -ForegroundColor Red
    Write-Host "   Is the dev server running?"
}
