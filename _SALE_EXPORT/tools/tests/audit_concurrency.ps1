$ErrorActionPreference = "Stop"

# 0. Load .env if missing (Auto-Configuration)
if (-not $env:SMOKE_ADMIN_USER -and (Test-Path "backend\.env")) {
    Write-Host "Auto-loading credentials from backend\.env..." -ForegroundColor Yellow
    Get-Content "backend\.env" | Where-Object { $_ -match "^SMOKE_ADMIN_USER=(.+)" } | ForEach-Object { $env:SMOKE_ADMIN_USER = $matches[1].Trim() }
    Get-Content "backend\.env" | Where-Object { $_ -match "^SMOKE_ADMIN_PASSWORD=(.+)" } | ForEach-Object { $env:SMOKE_ADMIN_PASSWORD = $matches[1].Trim() }
}

$base = "http://127.0.0.1:8000"
$adminUser = $env:SMOKE_ADMIN_USER
$adminPass = $env:SMOKE_ADMIN_PASSWORD

if (-not $adminUser -or -not $adminPass) {
    Write-Host "Please set SMOKE_ADMIN_USER and SMOKE_ADMIN_PASSWORD env vars." -ForegroundColor Red
    exit 1
}

Write-Host "=== CONCURRENCY AUDIT (Linear for Compatibility) ===" -ForegroundColor Cyan
Write-Host "Target: $base"
Write-Host "User:   $adminUser"

# 1. Get Token
Write-Host "1. Authenticating..." -NoNewline
try {
    $tok_resp = Invoke-RestMethod "$base/auth/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body @{username = $adminUser; password = $adminPass } -UseBasicParsing
    $tok = $tok_resp.access_token
    Write-Host " ✅ OK" -ForegroundColor Green
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    Write-Host $_
    exit 1
}

$h = @{Authorization = "Bearer $tok" }

# 2. Sequential Requests (PS 5.1 Compatible)
$count = 5
Write-Host "2. sending $count sequential 'Analyze Lite' requests..."

1..$count | ForEach-Object {
    $i = $_
    $payload = @{
        token     = "BTC"
        timeframe = "1h"
        mode      = "LITE"
        extra     = @{test_id = "conc_$i" }
    } | ConvertTo-Json -Depth 2
    
    Write-Host "  [$i] Sending..." -NoNewline
    
    try {
        # Using UseBasicParsing and standard ErrorAction
        $resp = Invoke-WebRequest "$base/analyze/lite" -Method POST -Headers $h -ContentType "application/json" -Body $payload -UseBasicParsing -ErrorAction Stop
        
        $code = [int]$resp.StatusCode
        if ($code -eq 200) {
            Write-Host " ✅ 200 OK" -ForegroundColor Green
        }
        else {
            Write-Host " ❌ $code" -ForegroundColor Red
        }
    }
    catch {
        # Handle 4xx/5xx in PS 5.1
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            Write-Host " ❌ $code (HTTP Error)" -ForegroundColor Red
        }
        else {
            Write-Host " ❌ EXCEPTION: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "=== DONE ===" -ForegroundColor Cyan
