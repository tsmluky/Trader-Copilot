<#
.SYNOPSIS
    Verifies TraderCopilot local API integrity and Authorization flow.

.DESCRIPTION
    Runs a battery of tests against the running TraderCopilot backend (default port 8000).
    Checks:
    - /health, /ready status
    - OpenAPI spec presence
    - Auth token generation
    - Protected endpoint access (Lite/Pro)
    - 401/403 verification
    - 422 Diagnostics

.EXAMPLE
    .\tools\tests\verify_api_local.ps1
    (Requires SMOKE_ADMIN_USER and SMOKE_ADMIN_PASSWORD in environment)
#>

$ErrorActionPreference = "Stop"

# === Config ===
# 0. Load .env if missing (Auto-Configuration)
if (-not $env:SMOKE_ADMIN_USER -and (Test-Path "backend\.env")) {
    Write-Host "Auto-loading credentials from backend\.env..." -ForegroundColor Yellow
    Get-Content "backend\.env" | Where-Object { $_ -match "^SMOKE_ADMIN_USER=(.+)" } | ForEach-Object { $env:SMOKE_ADMIN_USER = $matches[1].Trim() }
    Get-Content "backend\.env" | Where-Object { $_ -match "^SMOKE_ADMIN_PASSWORD=(.+)" } | ForEach-Object { $env:SMOKE_ADMIN_PASSWORD = $matches[1].Trim() }
}

$BaseUrl = "http://127.0.0.1:8000"
$AdminUser = $env:SMOKE_ADMIN_USER
$AdminPass = $env:SMOKE_ADMIN_PASSWORD

if (-not $AdminUser -or -not $AdminPass) {
    Write-Host "❌ Error: Missing credentials." -ForegroundColor Red
    Write-Host "Please set SMOKE_ADMIN_USER and SMOKE_ADMIN_PASSWORD environment variables." -ForegroundColor Gray
    exit 1
}

# === Helpers ===
function Assert-Request {
    param (
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$Display = "",
        [int[]]$ExpectedStatus = @(200),
        [bool]$SkipAuth = $false,
        [string]$ContentType = "application/json"
    )

    if (-not $Display) { $Display = "$Method $Path" }
    Write-Host "Testing: $Display ... " -NoNewline

    $params = @{
        Uri         = "$BaseUrl$Path"
        Method      = $Method
        Headers     = $Headers
        ContentType = $ContentType
        ErrorAction = "Stop"
    }

    if ($Body) { 
        if ($Body -is [hashtable] -and $ContentType -eq "application/json") {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        else {
            $params.Body = $Body
        }
    }

    $resp = $null
    $code = 0
    $content = ""

    try {
        $resp = Invoke-WebRequest @params -UseBasicParsing
        $code = [int]$resp.StatusCode
        $content = $resp.Content
    }
    catch {
        # Handle PS 5.1 / WebException behavior
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            
            # Read error stream
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
        }
        else {
            # Network/Other error
            Write-Host "❌ CRASH: $($_.Exception.Message)" -ForegroundColor Red
            return $null
        }
    }

    # Verify Status Code
    if ($code -in $ExpectedStatus) {
        Write-Host "✅ OK ($code)" -ForegroundColor Green
        try {
            if ($content) { return ($content | ConvertFrom-Json) }
            return $content
        }
        catch {
            return $content
        }
    }
    else {
        Write-Host "❌ FAIL (Expected $ExpectedStatus, got $code)" -ForegroundColor Red
        
        # Diagnostic for 422
        if ($code -eq 422) {
            Write-Host "`n[422 DIAGNOSTIC] Validation Error Details:" -ForegroundColor Yellow
            Write-Host $content -ForegroundColor Gray
        }
        else {
            Write-Host "`nResponse Body:" -ForegroundColor DarkGray
            Write-Host $content
        }
    }
    return $null
}

Write-Host "`n=== TRADERCOPILOT API VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Target: $BaseUrl"
Write-Host "User:   $AdminUser"

# 1. Health & Ready
Assert-Request -Method "GET" -Path "/health" -Display "Health Check" | Out-Null
Assert-Request -Method "GET" -Path "/ready"  -Display "Readiness Check" | Out-Null

# 2. OpenAPI Spec
$global:OpenApiSpec = Assert-Request -Method "GET" -Path "/openapi.json" -Display "OpenAPI Spec Fetch"
if ($global:OpenApiSpec) {
    # Verify Endpoints exist in Spec
    $paths = $global:OpenApiSpec.paths | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
    
    if ("/analyze/lite" -in $paths) { Write-Host "  Spec contains /analyze/lite: ✅" -ForegroundColor Green } 
    else { Write-Host "  Spec contains /analyze/lite: ❌" -ForegroundColor Red }

    if ("/analyze/pro" -in $paths) { Write-Host "  Spec contains /analyze/pro:  ✅" -ForegroundColor Green } 
    else { Write-Host "  Spec contains /analyze/pro:  ❌" -ForegroundColor Red }
}

# 3. Security (Unauthenticated Access)
Write-Host "`n--- Security Tests ---" -ForegroundColor Cyan
# Expect 401 or 403, NEVER 404
Assert-Request -Method "POST" -Path "/analyze/lite" -ExpectedStatus @(401, 403) -Display "Unauth Lite Access" | Out-Null

# 4. Auth Flow
Write-Host "`n--- Authentication flow ---" -ForegroundColor Cyan

# 4a. Register Admin (Idempotent check for testing)
# Since runs are ephemeral, ensure user exists
# NOTE: API expects Query Params for this helper endpoint, not JSON
$regParams = "email=$([uri]::EscapeDataString($AdminUser))&password=$([uri]::EscapeDataString($AdminPass))&name=SmokeAdmin"
Assert-Request -Method "POST" -Path "/auth/register?$regParams" -ExpectedStatus @(200, 400) -Display "Ensure Admin Exists (Register)" | Out-Null

$tokenBody = @{
    username = $AdminUser
    password = $AdminPass
}
# IMPORTANT: OAuth2 expects application/x-www-form-urlencoded
$tokenResp = Assert-Request -Method "POST" -Path "/auth/token" -Body $tokenBody -ContentType "application/x-www-form-urlencoded" -Display "Get Access Token"

$token = $null
if ($tokenResp -and $tokenResp.access_token) {
    $token = $tokenResp.access_token
    Write-Host "  Token received: $( $token.Substring(0, 10) )..." -ForegroundColor Gray
}
else {
    Write-Host "⚠️ Cannot proceed with authenticated tests (No Token)" -ForegroundColor Yellow
    exit 1
}

$authHeaders = @{
    "Authorization" = "Bearer $token"
}

# 5. Protected Endpoint Access
Write-Host "`n--- Protected Endpoint Tests ---" -ForegroundColor Cyan

$litePayload = @{
    token     = "BTC"
    timeframe = "1h"
    mode      = "LITE"
    message   = "Verify API Script"
}
Assert-Request -Method "POST" -Path "/analyze/lite" -Headers $authHeaders -Body $litePayload -Display "Analyze Lite (Auth)" | Out-Null

$proPayload = @{
    token     = "ETH"
    timeframe = "4h"
    mode      = "PRO"
    message   = "Verify API Script Pro"
}
Assert-Request -Method "POST" -Path "/analyze/pro" -Headers $authHeaders -Body $proPayload -Display "Analyze Pro (Auth)" | Out-Null

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
