param(
  [string]$MainPath = ".\backend\main.py"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $MainPath)) { throw "Not found: $MainPath" }

$raw = Get-Content $MainPath -Raw

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$bak = "$MainPath.bak_$ts"
Copy-Item $MainPath $bak -Force
Write-Host "[OK] Backup -> $bak"

# 1) Ensure import exists
$importNeedle = "from routers.auth import router as auth_router"
if ($raw -notmatch [regex]::Escape($importNeedle)) {

  # Insert after other router imports (best-effort anchors)
  $anchors = @(
    "from routers.admin import router as admin_router",
    "from routers.backtest import router as backtest_router",
    "from routers.analysis import router as analysis_router",
    "from routers.system import router as system_router"
  )

  $inserted = $false
  foreach ($a in $anchors) {
    if ($raw -match [regex]::Escape($a)) {
      $raw = $raw -replace ([regex]::Escape($a)), ($a + "`r`n" + $importNeedle)
      $inserted = $true
      break
    }
  }

  if (-not $inserted) {
    # fallback: prepend near top (safe, but less pretty)
    $raw = $importNeedle + "`r`n" + $raw
  }

  Write-Host "[OK] Added import auth_router"
} else {
  Write-Host "[SKIP] Import auth_router already present"
}

# 2) Ensure include_router exists
$includeNeedle = 'app.include_router(auth_router, prefix="/auth", tags=["Auth"])'
if ($raw -notmatch [regex]::Escape($includeNeedle)) {

  # Prefer insert before admin include if present
  if ($raw -match 'app\.include_router\(admin_router') {
    $raw = $raw -replace 'app\.include_router\(admin_router', ($includeNeedle + "`r`n" + 'app.include_router(admin_router')
    Write-Host "[OK] Inserted auth_router include before admin_router"
  }
  else {
    # fallback: append after advisor include if present, else append at end
    if ($raw -match 'app\.include_router\(advisor_router') {
      $raw = $raw -replace '(app\.include_router\(advisor_router[^\r\n]*\))', ('$1' + "`r`n" + $includeNeedle)
      Write-Host "[OK] Inserted auth_router include after advisor_router"
    } else {
      $raw = $raw + "`r`n" + $includeNeedle + "`r`n"
      Write-Host "[OK] Appended auth_router include at EOF"
    }
  }

} else {
  Write-Host "[SKIP] include_router(auth_router...) already present"
}

Set-Content -Path $MainPath -Value $raw -Encoding UTF8
Write-Host "[DONE] Patched $MainPath"
