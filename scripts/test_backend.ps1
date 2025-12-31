$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot/.."

Write-Host "Running Backend Tests..." -ForegroundColor Cyan
Set-Location "$root/backend"

# Ensure DB exists in root for tests
if (-not (Test-Path "$root/dev_local.db")) {
    python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
}

$env:DATABASE_URL="sqlite:///../dev_local.db"
$env:PYTHONPATH="$root/backend"

pytest tests/test_auth_flow_v2.py -v
