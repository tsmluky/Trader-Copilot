[CmdletBinding()]
param(
  [string]$BaseUrl = $(if ($env:SMOKE_BASE_URL) { $env:SMOKE_BASE_URL } else { "http://127.0.0.1:8000" }),
  [string]$Token,
  [string]$RunDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function PostJson($url, $headers, $bodyObj) {
  $bodyJson = $bodyObj | ConvertTo-Json -Depth 10
  $resp = Invoke-WebRequest -Method POST -Uri $url -Headers $headers -Body $bodyJson -SkipHttpErrorCheck
  $status = [int]$resp.StatusCode
  return [pscustomobject]@{ status_code=$status; ok=($status -ge 200 -and $status -lt 300); body=$resp.Content }
}

if (-not $RunDir) { $RunDir = $env:SMOKE_RUN_DIR }
if (-not $RunDir) { throw "RunDir missing (pass -RunDir or set SMOKE_RUN_DIR)." }
if (-not (Test-Path $RunDir)) { New-Item -ItemType Directory -Force -Path $RunDir | Out-Null }
if (-not $Token) { throw "Token is missing." }

$started = Get-Date
$outFile = Join-Path $RunDir "advisor.json"

$headers = @{
  Authorization = "Bearer $Token"
  Accept        = "application/json"
  "Content-Type"= "application/json"
}

$endpoints = @("/advisor/chat","/analyze/advisor/chat")

# FIX: backend requires body.messages
$payloads  = @(
  @{
    token="BTC"; timeframe="1h";
    messages=@(@{ role="user"; content="SMOKE ADVISOR" })
  }
)

$attempts = @()
$best = $null

foreach ($ep in $endpoints) {
  foreach ($pl in $payloads) {
    $url = "$BaseUrl$ep"
    $res = PostJson $url $headers $pl

    $attempts += [pscustomobject]@{
      endpoint=$ep; status_code=$res.status_code; ok=$res.ok
      body_snip = $(if ($res.body -and $res.body.Length -gt 800) { $res.body.Substring(0,800) } else { $res.body })
      payload_keys = @($pl.Keys) -join ","
    }

    if ($res.status_code -eq 404 -or $res.status_code -eq 405) { continue }
    if (-not $best) { $best = [pscustomobject]@{ endpoint=$ep; res=$res } }
    if ($res.ok) { break }
  }
  if ($best -and $best.res.ok) { break }
}

$ms = [int]((Get-Date) - $started).TotalMilliseconds

if ($best -and $best.res.ok) {
  $okObj = [pscustomobject]@{
    ok=$true; kind="ADVISOR"; endpoint=$best.endpoint; status_code=$best.res.status_code
    duration_ms=$ms; attempts=$attempts
    response_raw_snippet = $(if ($best.res.body.Length -gt 1200) { $best.res.body.Substring(0,1200) } else { $best.res.body })
  }
  $okObj | ConvertTo-Json -Depth 30 | Set-Content -Encoding UTF8 $outFile
  $okObj | ConvertTo-Json -Depth 30
  exit 0
}

$failObj = [pscustomobject]@{
  ok=$false; kind="ADVISOR"
  endpoint=$(if ($best) { $best.endpoint } else { $null })
  status_code=$(if ($best) { $best.res.status_code } else { $null })
  duration_ms=$ms
  error=$(if ($best) { "Non-2xx response on real endpoint (see attempts)" } else { "No usable endpoint found (only 404/405)" })
  error_body=$(if ($best) { $best.res.body } else { $null })
  attempts=$attempts
}
$failObj | ConvertTo-Json -Depth 30 | Set-Content -Encoding UTF8 $outFile
Write-Error ("[SMOKE-ADVISOR] FAILED. See " + $outFile)
$failObj | ConvertTo-Json -Depth 30
exit 1
