# verify_routes_and_db.local.ps1
# INJECTS SQLite DATABASE_URL FOR LOCAL TESTING ONLY.
# DO NOT USE THIS SCRIPT FOR PRODUCTION VERIFICATION.
$ErrorActionPreference = "Stop"
Import-Module Microsoft.PowerShell.Utility

Write-Host "Starting Backend..."
$env:PORT = "8026"
$env:DATABASE_URL = "sqlite:///./dev_local.db"
$proc = Start-Process -FilePath "uvicorn" -ArgumentList "backend.main:app --host 127.0.0.1 --port 8026" -PassThru -NoNewWindow -RedirectStandardOutput "startup.log" -RedirectStandardError "startup.err"

Start-Sleep -Seconds 7

# 1. Check Banner
Write-Host "`n[CHECK 1] Startup Banner"
Get-Content "startup.log" | Select-String "DB_DIALECT"

# 2. Check OpenAPI Schema
Write-Host "`n[CHECK 2] OpenAPI Schema"
try {
    $schema = Invoke-RestMethod -Uri "http://127.0.0.1:8026/openapi.json"
    
    # Check official route
    if ($schema.paths."/advisor/chat") { 
        Write-Host "[OK] Official /advisor/chat IS present." 
    }
    else { 
        Write-Host "[FAIL] Official /advisor/chat IS MISSING." 
    }

    # Check hidden route
    if ($schema.paths."/analyze/advisor/chat") { 
        Write-Host "[FAIL] Legacy /analyze/advisor/chat IS present (Should be hidden)." 
    }
    else { 
        Write-Host "[OK] Legacy /analyze/advisor/chat IS HIDDEN (Correct)." 
    }
}
catch {
    Write-Host "[FAIL] Failed to fetch OpenAPI: $_"
}

# 3. Functional Check
Write-Host "`n[CHECK 3] Functional Endpoints"
$payload = @{
    history = @()
    context = @{}
} | ConvertTo-Json -Depth 5

try {
    # Official
    $r1 = Invoke-WebRequest -Uri "http://127.0.0.1:8026/advisor/chat" -Method Post -Body $payload -ContentType "application/json" -ErrorAction SilentlyContinue
    if ($r1.StatusCode -eq 200 -or $r1.StatusCode -eq 503) {
        # 503 is acceptable if Gemini missing, means router hit
        Write-Host "[OK] POST /advisor/chat -> $($r1.StatusCode)"
    }
    else {
        Write-Host "[FAIL] POST /advisor/chat -> $($r1.StatusCode)"
    }
}
catch {
    Write-Host "[FAIL] POST /advisor/chat Failed: $_"
}

try {
    # Legacy
    $r2 = Invoke-WebRequest -Uri "http://127.0.0.1:8026/analyze/advisor/chat" -Method Post -Body $payload -ContentType "application/json" -ErrorAction SilentlyContinue
    if ($r2.StatusCode -eq 200 -or $r2.StatusCode -eq 503) {
        Write-Host "[OK] POST /analyze/advisor/chat -> $($r2.StatusCode)"
    }
    else {
        Write-Host "[FAIL] POST /analyze/advisor/chat -> $($r2.StatusCode)"
    }
}
catch {
    Write-Host "[FAIL] POST /analyze/advisor/chat Failed: $_"
}

Stop-Process -Id $proc.Id -Force
Remove-Item "startup.log"
Remove-Item "startup.err"
