$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot/.."
Write-Host "Bootstrapping TraderCopilot..." -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location "$root/backend"
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created backend/.env from example" -ForegroundColor Green
}
pip install -r requirements.txt
pip install pytest httpx ruff

# 2. Web Setup
Write-Host "Setting up Web..." -ForegroundColor Yellow
Set-Location "$root/web"
npm ci

Write-Host "✅ Bootstrap Critical Success" -ForegroundColor Green
