[CmdletBinding()]
param(
  [string]$BaseUrl = $(if ($env:SMOKE_BASE_URL) { $env:SMOKE_BASE_URL } else { "http://127.0.0.1:8000" })
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-RunDir {
  $root = Join-Path $PSScriptRoot "audit\runs"
  if (-not (Test-Path $root)) { New-Item -ItemType Directory -Force -Path $root | Out-Null }
  $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
  $dir = Join-Path $root $stamp
  New-Item -ItemType Directory -Force -Path $dir | Out-Null

  # Helpful pointer for humans
  $last = Join-Path $PSScriptRoot "audit\last_run.txt"
  Set-Content -Encoding UTF8 -NoNewline -Path $last -Value $dir

  return $dir
}

function Get-JsonValue {
  param($Obj, [string]$Key)
  if ($null -eq $Obj) { return $null }
  if ($Obj -is [hashtable]) { return $Obj[$Key] }
  return $Obj.$Key
}

function Get-LastJsonLine {
  param([string[]]$Lines)

  if (-not $Lines) { return $null }

  for ($i = $Lines.Count - 1; $i -ge 0; $i--) {
    $line = [string]$Lines[$i]
    if (-not $line) { continue }
    $t = $line.Trim()
    if ($t -match '^\{.*\}$') {
      return $t
    }
  }
  return $null
}

function Try-ParseJsonFromLines {
  param([string[]]$Lines)

  $jsonLine = Get-LastJsonLine -Lines $Lines
  if (-not $jsonLine) { return $null }

  try { return ($jsonLine | ConvertFrom-Json) } catch { return $null }
}

function Invoke-SmokeStep {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$ScriptPath,
    [Parameter(Mandatory=$true)][string]$RunDir,
    [string]$Token
  )

  $log = Join-Path $RunDir ($Name.ToLower() + ".log")

  $args = @("-NoProfile","-ExecutionPolicy","Bypass","-File",$ScriptPath)
  if ($Token) { $args += @("-Token",$Token) }
  $args += @("-RunDir",$RunDir)

  $output = & pwsh @args 2>&1

  # write log as UTF8 to avoid encoding surprises
  $output | Tee-Object -FilePath $log -Encoding utf8 | Out-Null
  $exit = $LASTEXITCODE

  # Prefer JSON files (lite.json, pro.json, advisor.json) if present
  $jsonPath = Join-Path $RunDir ($Name.ToLower() + ".json")
  $obj = $null
  if (Test-Path $jsonPath) {
    try {
      $obj = (Get-Content -Path $jsonPath -Raw) | ConvertFrom-Json
    } catch {}
  }

  # Fallback: parse last JSON line from output
  if (-not $obj) {
    $obj = Try-ParseJsonFromLines -Lines @($output)
  }

  [pscustomobject]@{
    name      = $Name
    exit_code = $exit
    ok        = $(if ($obj -and (Get-JsonValue $obj "ok") -eq $true) { $true } else { $false })
    log       = $log
    json_file = $(if (Test-Path $jsonPath) { $jsonPath } else { $null })
    json      = $obj
  }
}

Write-Host "=== SMOKE TEST SUITE STARTING ==="

$RunDir = New-RunDir
Write-Host ("Artifacts location: " + $RunDir)
Write-Host ""

# ---------------------------
# STEP 1: AUTH (parse from stdout, not from file)
# ---------------------------
Write-Host "[STEP 1] Authentication"

$authLog = Join-Path $RunDir "auth.log"
$authOut = & pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "smoke_auth.ps1") 2>&1
$authOut | Tee-Object -FilePath $authLog -Encoding utf8 | Out-Null

$auth = Try-ParseJsonFromLines -Lines @($authOut)
if (-not $auth) {
  Write-Error "Auth JSON parse failed (stdout)."
  Write-Error ("Check: " + $authLog)
  throw "Auth failed"
}

$token = Get-JsonValue $auth "token"
if (-not $token) { $token = Get-JsonValue $auth "access_token" }

if (-not $token) {
  Write-Error "Auth did not return token/access_token."
  Write-Error ("Check: " + $authLog)
  throw "Auth failed"
}

Write-Host "Auth OK."
Write-Host ""

# ---------------------------
# STEP 2: LITE
# ---------------------------
Write-Host "[STEP 2] LITE Endpoint"
$lite = Invoke-SmokeStep -Name "LITE" -ScriptPath (Join-Path $PSScriptRoot "smoke_lite.ps1") -RunDir $RunDir -Token $token
if (-not $lite.ok) { Write-Warning "Lite Failed." } else { Write-Host "Lite OK." }
Write-Host ""

# ---------------------------
# STEP 3: PRO
# ---------------------------
Write-Host "[STEP 3] PRO Endpoint"
$pro = Invoke-SmokeStep -Name "PRO" -ScriptPath (Join-Path $PSScriptRoot "smoke_pro.ps1") -RunDir $RunDir -Token $token
if (-not $pro.ok) { Write-Warning "Pro Failed." } else { Write-Host "Pro OK." }
Write-Host ""

# ---------------------------
# STEP 4: ADVISOR
# ---------------------------
Write-Host "[STEP 4] Advisor Endpoint"
$advisor = Invoke-SmokeStep -Name "ADVISOR" -ScriptPath (Join-Path $PSScriptRoot "smoke_advisor.ps1") -RunDir $RunDir -Token $token
if (-not $advisor.ok) { Write-Warning "Advisor Failed." } else { Write-Host "Advisor OK." }
Write-Host ""

Write-Host "=== SUITE FINISHED ==="
Write-Host ("Check " + $RunDir + " for details.")
Write-Host ("Last run pointer: " + (Join-Path $PSScriptRoot "audit\last_run.txt"))



