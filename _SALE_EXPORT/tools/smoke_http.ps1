param(
  [Parameter(Mandatory=$true)][string]$BaseUrl
)

$urls = @(
  "$BaseUrl/health",
  "$BaseUrl/docs",
  "$BaseUrl/openapi.json"
)

foreach ($u in $urls) {
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 20
    Write-Host ("OK  {0}  -> {1}" -f $r.StatusCode, $u)
  } catch {
    Write-Host ("FAIL      -> {0}" -f $u)
  }
}
