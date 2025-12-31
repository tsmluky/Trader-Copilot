$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot/.."

Write-Host "Building Web Frontend..." -ForegroundColor Cyan
Set-Location "$root/web"

npm run build
Write-Host "✅ Web Build Successful" -ForegroundColor Green
