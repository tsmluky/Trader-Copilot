Set-Location "$env:USERPROFILE\Desktop\TraderCopilot"
$ErrorActionPreference = "Stop"

Write-Host "[SMOKE-ADVISOR] Testing Advisor Chat..."

# Auth
$tokenBody = "username=admin@tradercopilot.com&password=admin123"
$tokenResp = Invoke-RestMethod -Method Post "http://127.0.0.1:8000/auth/token" -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
if (-not $tokenResp.access_token) { throw "Token is required." }
$h = @{ Authorization = "Bearer $($tokenResp.access_token)" }

# Official body (messages/context)
$body = @{
  messages = @(@{ role="user"; content="Smoke: dame plan breve con invalidación, TP parciales y SL a BE." })
  context  = @{ token="BTC"; timeframe="1h" }
} | ConvertTo-Json -Depth 30

$r = Invoke-RestMethod -Method Post "http://127.0.0.1:8000/advisor/chat" -Headers $h -ContentType "application/json" -Body $body
$r | ConvertTo-Json -Depth 50
