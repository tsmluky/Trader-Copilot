Write-Host "🛑 Stopping all Python and Uvicorn processes..." -ForegroundColor Yellow

# Stop Python
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Python processes stopped." -ForegroundColor Green

# Stop Uvicorn
Get-Process uvicorn -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Uvicorn processes stopped." -ForegroundColor Green

# Release Port 8000
$port = 8000
$p = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($p) {
    Write-Host "⚠️ Port $port still occupied by PID $($p.OwningProcess). Killing..." -ForegroundColor Red
    Stop-Process -Id $p.OwningProcess -Force
    Write-Host "✅ Port $port released." -ForegroundColor Green
} else {
    Write-Host "✅ Port $port is free." -ForegroundColor Green
}

Write-Host "🧹 Cleanup complete." -ForegroundColor Cyan
