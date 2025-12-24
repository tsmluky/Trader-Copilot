param(
  [string]$Root = (Get-Location).Path,
  [string]$OutDir = "_SALE_EXPORT"
)

$ErrorActionPreference = "Stop"

$rootFull = (Resolve-Path $Root).Path
$outFull  = Join-Path $rootFull $OutDir

if (Test-Path $outFull) {
  Write-Host "[INFO] Removing previous export: $outFull"
  Remove-Item -Recurse -Force $outFull
}

New-Item -ItemType Directory -Force -Path $outFull | Out-Null

# Robust copy with exclusions (dev + heavy + secrets + artifacts)
$xd = @(
  ".git",
  "backend\venv",
  "web\node_modules",
  "backend\audit\runs",
  "tools\audit\runs",
  "backend\_SALE_PACKAGE",
  "docs-legacy",
  "_SALE_EXPORT",
  "data"
)

$xf = @(
  ".env",                  # any .env anywhere
  "*.db",
  "*.sqlite",
  "*.sqlite3",
  "*.zip",
  "*.pyc",
  "*.pyd",
  "*.dll",
  "*.exe",
  "*.map"
)

Write-Host "[INFO] Exporting workspace to: $outFull"
Write-Host "[INFO] Excluding dirs:" ($xd -join ", ")
Write-Host "[INFO] Excluding files:" ($xf -join ", ")

# Robocopy returns non-0 for "success with extras", so we handle exit codes.
$robolog = Join-Path $outFull "robocopy_export.log"

$cmd = @(
  "$rootFull", "$outFull",
  "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NP",
  "/R:1", "/W:1",
  "/LOG:$robolog"
)

foreach ($d in $xd) { $cmd += @("/XD", (Join-Path $rootFull $d)) }
foreach ($f in $xf) { $cmd += @("/XF", $f) }

& robocopy @cmd | Out-Null
$rc = $LASTEXITCODE

# Robocopy exit codes 0-7 are success (with variations)
if ($rc -gt 7) { throw "Robocopy failed with exit code: $rc" }

# Sanity: ensure we did not copy any .env
$envLeaks = Get-ChildItem -Path $outFull -Recurse -Force -File -Filter ".env" -ErrorAction SilentlyContinue
if ($envLeaks) {
  Write-Host "[FAIL] .env leaked into export:"
  $envLeaks | Select-Object FullName | Format-Table -AutoSize
  throw "Abort: .env leaked into sale export."
}

Write-Host "[OK] Export created successfully."
Write-Host "[OK] Export path: $outFull"
Write-Host "[OK] Robocopy log: $robolog"
