param(
  [string]$BaseUrl = "http://127.0.0.1:8000",
  [string]$User    = "admin@tradercopilot.com",
  [string]$Pass    = "admin123"
)
$ErrorActionPreference = "Stop"

$spec = Invoke-RestMethod "$BaseUrl/openapi.json"
$paths = $spec.paths.PSObject.Properties.Name

# candidatos comunes (ordenados por preferencia)
$candidates = @("/auth/token","/token","/auth/login","/login")
$tokenPath = $candidates | Where-Object { $paths -contains $_ } | Select-Object -First 1
if (-not $tokenPath) {
  throw "No token endpoint found in OpenAPI. Searched: $($candidates -join ', ')"
}

Write-Host "[AUTH] Using token endpoint: $tokenPath"

$tokenBody = "username=$([uri]::EscapeDataString($User))&password=$([uri]::EscapeDataString($Pass))"
$tokenResp = Invoke-RestMethod -Method Post "$BaseUrl$tokenPath" -ContentType "application/x-www-form-urlencoded" -Body $tokenBody

if (-not $tokenResp.access_token) { throw "Token response missing access_token" }

# output only the token (easy to consume)
$tokenResp.access_token
