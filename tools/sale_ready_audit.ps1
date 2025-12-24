param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$rootFull = (Resolve-Path $Root).Path

Write-Host ""
Write-Host "=== Context ==="
Write-Host "Root: $rootFull"

# --- Structure ---
$hasBackend = Test-Path (Join-Path $rootFull "backend")
$hasWeb     = Test-Path (Join-Path $rootFull "web")

if ($hasBackend -and $hasWeb) {
  Write-Host "[OK]  Estructura base encontrada (backend/, web/)"
} else {
  if (-not $hasBackend) { Write-Host "[FAIL] Falta backend/"; }
  if (-not $hasWeb)     { Write-Host "[FAIL] Falta web/"; }
  throw "Abort: estructura base incompleta."
}

# --- P0: .env present ---
Write-Host ""
Write-Host "=== P0: .env present in sale package ==="

$rootEnv = Join-Path $rootFull ".env"
if (Test-Path $rootEnv) { Write-Host "[FAIL] P0: .env existe en root: $rootEnv" } else { Write-Host "[OK]  No hay .env en root" }

$backendEnv = Join-Path $rootFull "backend\.env"
if (Test-Path $backendEnv) { Write-Host "[FAIL] P0: backend\.env existe: $backendEnv" } else { Write-Host "[OK]  No hay backend\.env" }

$backendEnvExample = Join-Path $rootFull "backend\.env.example"
if (Test-Path $backendEnvExample) { Write-Host "[OK]  backend\.env.example existe" } else { Write-Host "[WARN] backend\.env.example NO existe"; }

# --- Hygiene: heavyweight dirs ---
Write-Host ""
Write-Host "=== Hygiene: heavyweight dirs (should NOT be in sale zip) ==="

$heavyDirs = @(
  "backend\venv",
  "web\node_modules",
  "backend\_SALE_PACKAGE"
)

foreach ($d in $heavyDirs) {
  $p = Join-Path $rootFull $d
  if (Test-Path $p) { Write-Host "[WARN] Existe $d (para venta NO debe ir en el zip). Ruta: $p" }
  else { Write-Host "[OK]  No existe $d" }
}

# --- Hygiene: local DB artifacts ---
Write-Host ""
Write-Host "=== Hygiene: local DB artifacts ==="

$dbFiles = Get-ChildItem -Path $rootFull -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Extension -in @(".db",".sqlite",".sqlite3") -and
    $_.FullName -notmatch '\\backend\\audit\\runs\\' -and
    $_.FullName -notmatch '\\tools\\audit\\runs\\'
  }

if ($dbFiles -and $dbFiles.Count -gt 0) {
  Write-Host "[WARN] Se detectaron DB locales (no deben ir en zip). Count=$($dbFiles.Count)"
  $dbFiles | Select-Object FullName,Length | Format-Table -AutoSize
} else {
  Write-Host "[OK]  No se detectaron .db/.sqlite fuera de audit/runs"
}

# --- Secrets scan ---
Write-Host ""
Write-Host "=== Secrets scan (excluding venv/node_modules/audit runs/binaries) ==="

# Excluded dirs for scanning
$excludeDirRegex = @(
  '\\backend\\venv\\',
  '\\web\\node_modules\\',
  '\\backend\\audit\\runs\\',
  '\\tools\\audit\\runs\\',
  '\\backend\\_SALE_PACKAGE\\',
  '\\_SALE_EXPORT\\',
  '\\docs-legacy\\'
) -join '|'

# Excluded extensions
$excludeExt = @('.png','.jpg','.jpeg','.ico','.map','.zip','.db','.sqlite','.sqlite3','.pyc','.pyd','.dll','.exe')

$files = Get-ChildItem -Path $rootFull -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch $excludeDirRegex -and
    $_.Extension -notin $excludeExt
  }

# Patterns (tighter, fewer false positives)
$patterns = @(
  '\bsk-[A-Za-z0-9]{10,}\b',                                # OpenAI/DeepSeek-like keys
  '\bAIza[0-9A-Za-z\-_]{20,}\b',                             # Google API key style
  '\b\d{6,}:[A-Za-z0-9_-]{20,}\b',                           # Telegram bot token structure
  '(?i)\bbearer\s+[A-Za-z0-9\-_\.]{20,}\b',                  # Bearer tokens
  '\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b'  # JWT
)

$hits = $files | Select-String -Pattern $patterns -ErrorAction SilentlyContinue

if ($hits) {
  Write-Host "[FAIL] P0: posibles secretos reales detectados en archivos del repo (fuera de venv/node_modules)."
  $hits | Select-Object Path, LineNumber | Sort-Object Path, LineNumber | Format-Table -AutoSize
} else {
  Write-Host "[OK]  No se detectaron patrones típicos de secretos."
}

# --- Git status (optional) ---
Write-Host ""
Write-Host "=== Git status (repo cleanliness) ==="
if (Test-Path (Join-Path $rootFull ".git")) {
  $st = & git -C $rootFull status --porcelain
  if ($st) {
    Write-Host "[WARN] Working tree NO está limpio (para venta conviene exportar desde estado controlado)."
    $st | ForEach-Object { Write-Host " $($_)" }
  } else {
    Write-Host "[OK]  Working tree limpio."
  }
} else {
  Write-Host "[WARN] No es un repo git (.git no existe)."
}

# --- Audit scripts presence ---
Write-Host ""
Write-Host "=== Audit scripts presence ==="
$auditScripts = @(
  "backend\audit\inspect_routes.py",
  "backend\audit\detect_route_collisions.py",
  "backend\audit\test_security_matrix.py"
)
foreach ($s in $auditScripts) {
  $p = Join-Path $rootFull $s
  if (Test-Path $p) { Write-Host "[OK]  Existe: $s" }
  else { Write-Host "[WARN] Falta: $s" }
}

Write-Host ""
Write-Host "=== Done ==="
Write-Host "Este script NO modifica nada. Solo reporta estado para sale-ready."
