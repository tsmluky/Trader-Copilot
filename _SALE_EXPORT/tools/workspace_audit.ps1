param(
  [switch]$RunTests
)

function Write-Section($title) {
  Write-Host ""
  Write-Host "=== $title ==="
}

$Root = (Resolve-Path ".").Path
$RunDir = Join-Path $Root "tools\audit\runs"
New-Item -ItemType Directory -Force -Path $RunDir | Out-Null
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$OutFile = Join-Path $RunDir ("workspace_audit_{0}.txt" -f $Stamp)

Start-Transcript -Path $OutFile -Force | Out-Null

Write-Section "Context"
"Root: $Root"

# --- Base structure ---
Write-Section "Base Structure"
$hasBackend = Test-Path (Join-Path $Root "backend")
$hasWeb = Test-Path (Join-Path $Root "web")
if (-not ($hasBackend -and $hasWeb)) { throw "[FAIL] Missing backend/ or web/ folder." }
"[OK] backend/ and web/ present."

# --- Hygiene checks (workspace vs sale) ---
Write-Section "Hygiene (workspace presence)"
$envRoot = Test-Path (Join-Path $Root ".env")
$envBackend = Test-Path (Join-Path $Root "backend\.env")
"Root .env present: $envRoot"
"Backend .env present: $envBackend (OK for local dev; NOT OK for sale zip)"

$venv = Join-Path $Root "backend\venv"
$nm = Join-Path $Root "web\node_modules"
$sp = Join-Path $Root "backend\_SALE_PACKAGE"
if (Test-Path $venv) { "[WARN] backend\venv exists (exclude from sale zip)." }
if (Test-Path $nm) { "[WARN] web\node_modules exists (exclude from sale zip)." }
if (Test-Path $sp) { "[WARN] backend\_SALE_PACKAGE exists (should be deleted/excluded; causes recursive contamination)." }

# --- Local DB artifacts ---
Write-Section "Local DB Artifacts (*.db)"
$dbs = Get-ChildItem -Path $Root -Recurse -File -Force -Filter *.db |
  Where-Object {
    $_.FullName -notmatch '\\backend\\venv\\' -and
    $_.FullName -notmatch '\\web\\node_modules\\'
  }
if ($dbs.Count -gt 0) {
  "[WARN] Found local DB files: Count=$($dbs.Count)"
  $dbs | Select-Object FullName,Length | Format-Table -AutoSize
} else {
  "[OK] No .db files found outside venv/node_modules."
}

# --- Secrets scan (exclude heavy dirs, exclude staging) ---
Write-Section "Secrets Scan (workspace-safe)"
$excludeRx = '\\backend\\venv\\|\\web\\node_modules\\|\\backend\\audit\\runs\\|\\backend\\_SALE_PACKAGE\\'
$files = Get-ChildItem -Path $Root -Recurse -File -Force |
  Where-Object {
    $_.FullName -notmatch $excludeRx -and
    $_.Extension -notin @('.png','.jpg','.ico','.map','.zip','.db','.pyc','.pyd','.dll','.exe')
  }

$patterns = @(
  'sk-[A-Za-z0-9]{10,}',
  '(?i)deepseek[_-]?api[_-]?key\s*=\s*.+',
  '(?i)gemini[_-]?api[_-]?key\s*=\s*.+',
  '(?i)telegram[_-]?bot[_-]?token\s*=\s*.+',
  '(?i)\bsecret[_-]?key\b\s*=\s*.+',
  '(?i)bearer\s+[A-Za-z0-9\-_\.]{20,}'
)

$hitsRaw = $files | Select-String -Pattern $patterns -ErrorAction SilentlyContinue

# allowlist placeholders (do NOT fail on examples)
$allowRx = '(?i)CHANGE_ME|YOUR_|your_|example|PLACEHOLDER|dummy|xxxxxxxx|<.*?>'
$hits = @()
foreach ($h in $hitsRaw) {
  $path = $h.Path
  $line = $h.Line
  if ($path -match '\.env\.example$') { continue }
  if ($line -match $allowRx) { continue }
  $hits += $h
}

if ($hits.Count -gt 0) {
  "[FAIL] Potential real secrets found:"
  $hits | Select-Object Path,LineNumber,Line | Format-Table -AutoSize
} else {
  "[OK] No real secrets detected (placeholders ignored; venv/node_modules/_SALE_PACKAGE excluded)."
}

# --- Git status summary ---
Write-Section "Git Status"
try {
  $gs = git status --porcelain
  if ($gs) {
    "[WARN] Working tree not clean. Count=$($gs.Count)"
    $gs
  } else {
    "[OK] Working tree clean."
  }
} catch {
  "[WARN] git not available or not a repo here."
}

# --- Optional: run backend audit tests ---
if ($RunTests) {
  Write-Section "Backend Audit Tests"
  $backendDir = Join-Path $Root "backend"
  if (-not (Test-Path $backendDir)) { throw "backend/ missing" }

  Push-Location $backendDir
  try {
    if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
      throw "venv not found at backend\venv. Create it or run tests without -RunTests."
    }

    # Activate venv in this process
    . .\venv\Scripts\Activate.ps1

    # Ensure dev test deps exist (httpx required by starlette testclient; pytest optional)
    python -m pip install -q httpx pytest | Out-Null

    python .\audit\inspect_routes.py
    python .\audit\detect_route_collisions.py
    python .\audit\test_security_matrix.py

    "[OK] Backend audit tests executed."
  } finally {
    Pop-Location
  }
}

Write-Section "Done"
"Report saved to: $OutFile"

Stop-Transcript | Out-Null
