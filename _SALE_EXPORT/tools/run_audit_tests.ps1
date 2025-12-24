param(
  [string]$BackendDir = ".\backend"
)

$ErrorActionPreference = "Stop"

function Ok($t) { Write-Host "[OK]  $t" -ForegroundColor Green }
function Warn($t) { Write-Host "[WARN] $t" -ForegroundColor Yellow }
function Fail($t) { Write-Host "[FAIL] $t" -ForegroundColor Red }

if (-not (Test-Path $BackendDir)) { Fail "No existe $BackendDir"; exit 1 }

Push-Location $BackendDir

# venv
if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
  Ok "Creando venv..."
  python -m venv venv
} else {
  Ok "venv ya existe"
}

. .\venv\Scripts\Activate.ps1
Ok "venv activado"

# deps runtime
if (Test-Path ".\requirements.txt") {
  Ok "Instalando requirements.txt (si falta algo)..."
  pip install -r .\requirements.txt
} else {
  Warn "No existe requirements.txt en backend/"
}

# deps de auditoría (mínimas para TestClient)
Ok "Instalando deps de auditoría: pytest + httpx"
pip install pytest httpx

# correr scripts audit (sin necesitar server levantado)
if (Test-Path ".\audit\inspect_routes.py") {
  Ok "inspect_routes.py"
  python .\audit\inspect_routes.py
} else { Warn "Falta audit\inspect_routes.py" }

if (Test-Path ".\audit\detect_route_collisions.py") {
  Ok "detect_route_collisions.py"
  python .\audit\detect_route_collisions.py
} else { Warn "Falta audit\detect_route_collisions.py" }

if (Test-Path ".\audit\test_security_matrix.py") {
  Ok "test_security_matrix.py"
  python .\audit\test_security_matrix.py
} else { Warn "Falta audit\test_security_matrix.py" }

Pop-Location
Ok "Done"
