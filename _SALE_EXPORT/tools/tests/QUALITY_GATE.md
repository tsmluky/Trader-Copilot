# TraderCopilot Sale-Ready Quality Gate

## Overview
This Quality Gate strictly enforces "Sale-Ready" criteria for the TraderCopilot backend. It verifies:
- API Contracts & Schema Validation
- Authentication & RBAC
- Operational Resilience (Restart survival)
- Data Integrity (Coherence between DB and CSV logs)
- Hygiene (No tracebacks or critical errors)
- Performance (Latency baselines)

## Running the Gate
```powershell
.\tools\tests\quality_gate.ps1
```

## Success Criteria (Zero-Tolerance)
1. **Exit Code 0**: Any failure aborts the release.
2. **Clean Logs**: No `Traceback`, `OperationalError`, or `Exception` in logs.
3. **Persistence**: A signal created in Phase 1 MUST be retrievable in Phase 2.
4. **Validation**: Invalid inputs MUST return 422 (never 500).
5. **RBAC**: Admin endpoints MUST block non-admin users (403).

## Failure Troubleshooting table
| Error | Likely Cause | Fix |
|---|---|---|
| `Got 500/502` | Server Crash | Check `server_phase1.log` for Tracebacks (e.g. `NameError`). |
| `Got 422 (Expected 200)` | Schema Mismatch | Ensure request body matches strict `LiteReq` (remove extra fields). |
| `Got 403 (Expected 200)` | Entitlements | Ensure User is OWNER (run `seed_auth.py`). |
| `CSV Missing` | Logic Crash | `analyze_lite` crashed before logging. Check `market_data_api.py`. |
