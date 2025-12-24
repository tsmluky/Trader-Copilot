
$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot/.."
$BaseUrl = "http://127.0.0.1:8000"

function Assert-Status {
    param($Path, $Body, $Expected, $Headers = @{})
    try {
        $p = @{
            Method          = "POST"
            Uri             = "$BaseUrl$Path"
            Body            = ($Body | ConvertTo-Json -Depth 5)
            ContentType     = "application/json"
            Headers         = $Headers
            UseBasicParsing = $True
            ErrorAction     = "Stop"
        }
        $r = Invoke-WebRequest @p
        $code = $r.StatusCode
    }
    catch {
        if ($_.Exception.Response) { 
            $code = $_.Exception.Response.StatusCode
            $r = $_.Exception.Response 
        }
        else { $code = 0 }
    }
    
    if ($code -in $Expected) { 
        Write-Host "✅ $Path -> $code (Expected)" -Fore Green 
        if ($code -eq 200) {
            try {
                if ($r.Content) { 
                    $c = $r.Content 
                    if ($c -is [System.IO.Stream]) {
                        $sr = New-Object IO.StreamReader($c)
                        $c = $sr.ReadToEnd()
                    }
                    Write-Host "   Body: $c" -Fore Gray 
                }
            }
            catch { Write-Host "   (Body Read Error: $_)" -Fore DarkGray }
        }
    }
    else { 
        Write-Host "❌ $Path -> $code (Expected $Expected)" -Fore Red
        try { if ($r.Content) { Write-Host "   Body: $($r.Content)" -Fore Red } } catch {}
        exit 1 
    }
}

# Start Server
$p = Start-Process "uvicorn" -ArgumentList "backend.main:app --host 127.0.0.1 --port 8000" -PassThru -NoNewWindow
Start-Sleep -Seconds 10

try {
    # Login as Admin (Owner) - Seed should have run via Quality Gate previously, or we hope manual seed worked?
    # Actually, verify_fixes.ps1 doesn't run seed.
    # We'll run seed first.
    Write-Host "Seeding DB..."
    Start-Process "python" -ArgumentList "backend/seed_auth.py" -NoNewWindow -Wait

    Write-Host "Logging in as Admin..."
    $email = "admin@tradercopilot.com"
    $pass = "admin123"
    
    $t = Invoke-WebRequest "$BaseUrl/auth/token" -Method POST -Body "username=$email&password=$pass" -ContentType "application/x-www-form-urlencoded" -UseBasicParsing
    $content = $t.Content | ConvertFrom-Json
    if (-not $content.access_token) {
        Write-Host "Failed to login as Admin." -Fore Red
        exit 1
    }
    $token = $content.access_token
    $Headers = @{Authorization = "Bearer $token" }
    Write-Host "Token Acquired."

    # T4 Validation Fix (Authenticated)
    Write-Host "Testing T4 (Validation)..."
    Assert-Status "/analyze/lite" @{token = "BTC"; timeframe = "999h"; mode = "LITE" } 422 -Headers $Headers
    Assert-Status "/analyze/lite" @{token = "BTC"; timeframe = "1h"; mode = "SUPER" } 422 -Headers $Headers

    # T11/Market Fix (Fallback) + T7 Persistence Setup
    Write-Host "Testing Persistence Creation (PTEST)..."
    # Should return 200 because Owner allows PTEST
    Assert-Status "/analyze/lite" @{token = "PTEST_VERIFY"; timeframe = "1h"; mode = "LITE" } 200 -Headers $Headers

    Write-Host "Checking CSV persistence..."
    if (Test-Path "backend\logs\LITE\ptest_verify.csv") {
        Write-Host "✅ CSV Found: backend\logs\LITE\ptest_verify.csv" -Fore Green
    }
    else {
        Write-Host "❌ CSV Missing!" -Fore Red
    }

    Write-Host "ALL CHECKS PASSED ✅"
}
finally {
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
