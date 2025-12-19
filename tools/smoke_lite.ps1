[CmdletBinding()]
param(
  [string]$BaseUrl = $(if ($env:SMOKE_BASE_URL) { $env:SMOKE_BASE_URL } else { "http://127.0.0.1:8000" }),
  [Parameter(Mandatory=$false)][string]$Token,
  [string]$RunDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $RunDir) { $RunDir = $env:SMOKE_RUN_DIR }
if (-not $RunDir) { throw "RunDir missing (pass -RunDir or set SMOKE_RUN_DIR)." }
New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

$outFile = Join-Path $RunDir "lite.json"
$started = Get-Date

function Write-Out($obj) {
  $obj | ConvertTo-Json -Depth 30 | Set-Content -Encoding UTF8 $outFile
  $obj | ConvertTo-Json -Depth 30
}

try {
  if (-not $Token) { throw "Token is missing." }

  $headers = @{
    Authorization = "Bearer $Token"
    Accept        = "application/json"
    "Content-Type"= "application/json"
  }

  $endpoint = "/advisor/"   # <-- REAL según tu OpenAPI
  $url = "$BaseUrl$endpoint"

  # Probamos dos contratos típicos: message vs messages
  $payloads = @(
    @{ token="BTC"; timeframe="1h"; mode="LITE"; message="SMOKE LITE" },
    @{ token="BTC"; timeframe="1h"; mode="LITE"; messages=@(@{ role="user"; content="SMOKE LITE" }) }
  )

  $attempts = @()
  $best = $null

  foreach ($pl in $payloads) {
    $bodyJson = $pl | ConvertTo-Json -Depth 10
    $resp = Invoke-WebRequest -Method POST -Uri $url -Headers $headers -Body $bodyJson -SkipHttpErrorCheck
    $status = [int]$resp.StatusCode

    $attempts += [pscustomobject]@{
      endpoint = $endpoint
      status_code = $status
      ok = ($status -ge 200 -and $status -lt 300)
      body_snip = $(if ($resp.Content -and $resp.Content.Length -gt 800) { $resp.Content.Substring(0,800) } else { $resp.Content })
      payload_keys = @($pl.Keys) -join ","
    }

    if (-not $best) { $best = [pscustomobject]@{ status_code=$status; body=$resp.Content } }
    if ($status -ge 200 -and $status -lt 300) { $best = [pscustomobject]@{ status_code=$status; body=$resp.Content }; break }
  }

  $ms = [int]((Get-Date) - $started).TotalMilliseconds

  if ($best -and $best.status_code -ge 200 -and $best.status_code -lt 300) {
    Write-Out ([pscustomobject]@{
      ok=$true; kind="LITE"; endpoint=$endpoint; status_code=$best.status_code; duration_ms=$ms
      attempts=$attempts
      response_raw_snippet=$(if ($best.body.Length -gt 1200) { $best.body.Substring(0,1200) } else { $best.body })
    })
    exit 0
  }

  Write-Out ([pscustomobject]@{
    ok=$false; kind="LITE"; endpoint=$endpoint
    status_code=$(if($best){$best.status_code}else{$null})
    duration_ms=$ms
    error="Non-2xx from /advisor/ (inspect attempts + error_body)"
    error_body=$(if($best){$best.body}else{$null})
    attempts=$attempts
  })
  exit 1
}
catch {
  $ms = [int]((Get-Date) - $started).TotalMilliseconds
  Write-Out ([pscustomobject]@{
    ok=$false; kind="LITE"; endpoint="/advisor/"; status_code=$null; duration_ms=$ms
    error=$_.Exception.Message
  })
  exit 1
}
