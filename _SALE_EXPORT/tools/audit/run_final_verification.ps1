param(
  [string]$BaseUrl = "http://127.0.0.1:8000",
  [string]$User    = "admin@tradercopilot.com",
  [string]$Pass    = "admin123"
)

$ErrorActionPreference = "Stop"

function New-RunDir {
  $root = Join-Path $PSScriptRoot "runs"
  New-Item -ItemType Directory -Force -Path $root | Out-Null
  $stamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
  $dir = Join-Path $root $stamp
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  return $dir
}

function Write-Summary($dir, [string[]]$lines) {
  $path = Join-Path $dir "summary.txt"
  $lines | Set-Content -Encoding UTF8 $path
}

function Has-Prop($obj, [string]$name) {
  return ($obj.PSObject.Properties.Name -contains $name)
}

$runDir = New-RunDir
$summary = @()

# 1) Health
$health = Invoke-RestMethod "$BaseUrl/health"
$health | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 (Join-Path $runDir "health.json")

# 2) Auth token
$tokenBody = "username=$([uri]::EscapeDataString($User))&password=$([uri]::EscapeDataString($Pass))"
$tokenResp = Invoke-RestMethod -Method Post "$BaseUrl/auth/token" -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
if (-not (Has-Prop $tokenResp "access_token")) { throw "Auth token response missing access_token." }
$h = @{ Authorization = "Bearer $($tokenResp.access_token)" }

# 3) Official endpoint (/advisor/chat) expects: {messages, context}
$bodyOfficial = @{
  messages = @(@{ role="user"; content="Smoke test: dame plan breve con invalidación y SL a BE." })
  context  = @{ token="BTC"; timeframe="1h" }
} | ConvertTo-Json -Depth 30

$respOfficial = Invoke-RestMethod -Method Post "$BaseUrl/advisor/chat" -Headers $h -ContentType "application/json" -Body $bodyOfficial
$respOfficial | ConvertTo-Json -Depth 50 | Set-Content -Encoding UTF8 (Join-Path $runDir "advisor_chat_official.json")

if ((Has-Prop $respOfficial "reply") -and (Has-Prop $respOfficial "usage")) {
  $summary += "[PASS] Official Endpoint Responded 200 OK"
} else {
  $summary += "[FAIL] Official endpoint missing keys (expected reply,usage)"
}

# 4) Legacy endpoint (/analyze/advisor/chat) expects: {history, context}
$bodyLegacy = @{
  history = @(@{ role="user"; content="Smoke test legacy: dame plan breve con invalidación y SL a BE." })
  context = @{ token="BTC"; timeframe="1h" }
} | ConvertTo-Json -Depth 30

$respLegacy = Invoke-RestMethod -Method Post "$BaseUrl/analyze/advisor/chat" -Headers $h -ContentType "application/json" -Body $bodyLegacy
$respLegacy | ConvertTo-Json -Depth 50 | Set-Content -Encoding UTF8 (Join-Path $runDir "advisor_chat_legacy.json")

if ((Has-Prop $respLegacy "reply") -and (Has-Prop $respLegacy "usage")) {
  $summary += "[PASS] Legacy Endpoint Responded 200 OK"
} else {
  $summary += "[FAIL] Legacy endpoint missing keys (expected reply,usage)"
}

# 5) OpenAPI visibility
$spec = Invoke-RestMethod "$BaseUrl/openapi.json"
$paths = $spec.paths.PSObject.Properties.Name

if ($paths -contains "/advisor/chat") { $summary += "[PASS] Official route found in OpenAPI." } else { $summary += "[FAIL] Official route NOT found in OpenAPI." }
if ($paths -contains "/analyze/advisor/chat") { $summary += "[FAIL] Legacy route present in OpenAPI (should be hidden)." } else { $summary += "[PASS] Legacy route Hidden in OpenAPI." }

$spec | ConvertTo-Json -Depth 30 | Set-Content -Encoding UTF8 (Join-Path $runDir "openapi_excerpt.json")

Write-Summary $runDir $summary
Write-Host "Artifacts location: $runDir"
Get-Content (Join-Path $runDir "summary.txt")

if ($summary -match "^\[FAIL\]") { exit 1 } else { exit 0 }
