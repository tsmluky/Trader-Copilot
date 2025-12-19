[CmdletBinding()]
param(
  [string]$BaseUrl = $(if ($env:SMOKE_BASE_URL) { $env:SMOKE_BASE_URL } else { "http://127.0.0.1:8000" })
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-HttpErrorBody {
  param([System.Exception]$Ex)
  try {
    $resp = $Ex.Response
    if (-not $resp) { return $null }
    $stream = $resp.GetResponseStream()
    if (-not $stream) { return $null }
    $reader = New-Object System.IO.StreamReader($stream)
    return $reader.ReadToEnd()
  } catch { return $null }
}

function Get-JsonValue {
  param($Obj, [string]$Key)
  if ($null -eq $Obj) { return $null }
  if ($Obj -is [hashtable]) { return $Obj[$Key] }
  return $Obj.$Key
}

function Try-ParseJson {
  param([string]$Text)
  if (-not $Text) { return $null }
  try { return ($Text | ConvertFrom-Json) } catch { return $null }
}

$started = Get-Date
$user = $env:SMOKE_ADMIN_USER
$pass = $env:SMOKE_ADMIN_PASSWORD
if (-not $user -or -not $pass) { throw "Missing SMOKE_ADMIN_USER / SMOKE_ADMIN_PASSWORD" }

$endpoints = @("/auth/token", "/auth/auth/token")

$errors = @()

foreach ($ep in $endpoints) {
  $url = "$BaseUrl$ep"

  # Attempt 1: x-www-form-urlencoded (OAuth2PasswordRequestForm style)
  try {
    $form = @{
      username = $user
      password = $pass
      grant_type = ""
      scope = ""
      client_id = ""
      client_secret = ""
    }
    $resp = Invoke-WebRequest -Method POST -Uri $url -ContentType "application/x-www-form-urlencoded" -Body $form
    $raw  = $resp.Content
    $obj  = Try-ParseJson $raw
    $tok  = Get-JsonValue $obj "access_token"
    if (-not $tok) { $tok = Get-JsonValue $obj "token" }

    if ($tok) {
      $ms = [int]((Get-Date) - $started).TotalMilliseconds
      @{ ok=$true; endpoint_used=$ep; status_code=[int]$resp.StatusCode; duration_ms=$ms; token=$tok } | ConvertTo-Json -Compress
      exit 0
    } else {
      $errors += "[$ep][form] No token fields in response."
    }
  } catch {
    $status = $null; try { $status = [int]$_.Exception.Response.StatusCode } catch {}
    $errors += "[$ep][form] $($status) $($_.Exception.Message) :: $(Get-HttpErrorBody -Ex $_.Exception)"
  }

  # Attempt 2: JSON body
  try {
    $body = @{ username=$user; password=$pass } | ConvertTo-Json -Depth 5
    $resp = Invoke-WebRequest -Method POST -Uri $url -ContentType "application/json" -Body $body
    $raw  = $resp.Content
    $obj  = Try-ParseJson $raw
    $tok  = Get-JsonValue $obj "access_token"
    if (-not $tok) { $tok = Get-JsonValue $obj "token" }

    if ($tok) {
      $ms = [int]((Get-Date) - $started).TotalMilliseconds
      @{ ok=$true; endpoint_used=$ep; status_code=[int]$resp.StatusCode; duration_ms=$ms; token=$tok } | ConvertTo-Json -Compress
      exit 0
    } else {
      $errors += "[$ep][json] No token fields in response."
    }
  } catch {
    $status = $null; try { $status = [int]$_.Exception.Response.StatusCode } catch {}
    $errors += "[$ep][json] $($status) $($_.Exception.Message) :: $(Get-HttpErrorBody -Ex $_.Exception)"
  }
}

$ms = [int]((Get-Date) - $started).TotalMilliseconds
@{ ok=$false; duration_ms=$ms; error="Auth failed for all candidates"; details=$errors } | ConvertTo-Json -Compress
exit 1
