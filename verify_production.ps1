<#
.SYNOPSIS
    Verifies the Production Deployment of TraderCopilot on Railway and Vercel.

.DESCRIPTION
    This script performs smoke tests against the deployed Backend and Frontend URLs.
    It checks for:
    1. Backend Health (/health)
    2. Backend Strategies (/strategies/)
    3. Backend Documentation (/docs)
    4. Frontend Reachability (Status 200)

.PARAMETER BackendUrl
    The full URL of the deployed backend (e.g., https://trader-copilot-production.up.railway.app)

.PARAMETER FrontendUrl
    The full URL of the deployed frontend (e.g., https://trader-copilot.vercel.app)

.EXAMPLE
    .\verify_production.ps1 -BackendUrl "https://myapp.railway.app" -FrontendUrl "https://myapp.vercel.app"
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl,

    [Parameter(Mandatory=$true)]
    [string]$FrontendUrl
)

$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param (
        [string]$Url,
        [string]$Description,
        [int[]]$ExpectedStatus = @(200)
    )

    Write-Host -NoNewline "Checking $Description... "
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -ErrorAction Stop
        if ($ExpectedStatus -contains $response.StatusCode) {
            Write-Host "[OK] ($($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[FAIL] Got $($response.StatusCode), Expected $ExpectedStatus" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "[FAIL] Connection Error: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   TRADER COPILOT PRODUCTION VERIFICATION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Backend: $BackendUrl"
Write-Host "Frontend: $FrontendUrl"
Write-Host ""

# 1. Backend Checks
Write-Host "--- Backend Verifications ---" -ForegroundColor Yellow

# Remove trailing slash if present for consistency
$BackendUrl = $BackendUrl.TrimEnd('/')

Test-Endpoint -Url "$BackendUrl/health" -Description "Health Check"
Test-Endpoint -Url "$BackendUrl/strategies/" -Description "Strategies List"
Test-Endpoint -Url "$BackendUrl/docs" -Description "Swagger Documentation"

# 2. Frontend Checks
Write-Host "`n--- Frontend Verifications ---" -ForegroundColor Yellow
$FrontendUrl = $FrontendUrl.TrimEnd('/')

Test-Endpoint -Url "$FrontendUrl" -Description "Frontend Root"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Verification Complete."
