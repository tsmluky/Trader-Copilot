param(
  [string]$Root = (Get-Location).Path,
  [string]$OutDir = "_SALE_EXPORT"
)

$ErrorActionPreference = "Stop"

$rootFull = (Resolve-Path $Root).Path

Write-Host "=== SALE READY PIPELINE ==="
Write-Host "Root: $rootFull"
Write-Host "OutDir: $OutDir"

# 1) Build export limpio
& (Join-Path $rootFull "tools\build_sale_export.ps1") -Root $rootFull -OutDir $OutDir

# 2) Audit sobre export
Push-Location (Join-Path $rootFull $OutDir)
try {
  & (Join-Path $rootFull "tools\sale_ready_audit.ps1")
} finally {
  Pop-Location
}

# 3) Zip export
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$zipName = "TraderCopilot_SaleReady_EXPORT_{0}.zip" -f $ts
$zipPath = Join-Path $rootFull $zipName

if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

Compress-Archive -Path (Join-Path $rootFull "$OutDir\*") -DestinationPath $zipPath -Force
Write-Host "[OK] ZIP generado: $zipName"

# 4) Quick zip content scan (no extract)
"== ZIP suspicious entries check =="
try {
  tar -tf $zipPath | Select-String -Pattern '(^|/)\.env($|/)|(^|/)venv/|(^|/)node_modules/|\.db$|\.sqlite$|\.sqlite3$' -AllMatches
  if ($LASTEXITCODE -ne 0) { "OK: tar returned non-0 (non-blocking)"; }
} catch {
  "WARN: tar check skipped/failure (non-blocking): $($_.Exception.Message)"
}

# 5) SHA256
$hash = Get-FileHash -Algorithm SHA256 $zipPath
$hashLine = "{0}  {1}" -f $hash.Hash.ToLower(), $zipName
$shaFile = Join-Path $rootFull "sha256sums.txt"
Add-Content -Path $shaFile -Value $hashLine

Write-Host "[OK] SHA256:"
Write-Host $hashLine
Write-Host "[OK] sha256sums.txt actualizado: $shaFile"

Write-Host "=== DONE ==="
Write-Host "ZIP: $zipPath"
