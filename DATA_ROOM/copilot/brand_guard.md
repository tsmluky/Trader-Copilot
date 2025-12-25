# BrandGuard (Safety Layer)

A heuristics engine that runs *before* and *after* the LLM call to ensure quality and safety.

## Pre-Computation
- **Intent Detection**: Keywords (`analyze`, `signal`, `setup`) trigger "Analysis Mode". Keywords (`help`, `explain`) trigger "Chat Mode".

## Post-Processing (Linter)
1. **Banned Words**: `guarantee`, `100%`, `moon`, `lambo`, `financial advice`.
   - Action: If detected, regenerate response with higher temperature or specific "Safe Mode" instruction.
   - Retry Limit: 1 max retry.
2. **Format Check**:
   - Must contain `**Rationale**:` if providing a setup.
   - Must contain `**Action**:` (Buy/Sell/Wait).

## Auto-Repair
- If JSON response is malformed, the system uses a regex extractor or `json_repair` library to salvage valid fields before falling back to error.
