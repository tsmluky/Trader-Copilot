# Copilot Profile

Personalization layer stored in `copilot_profiles` table.

## Schema
- **trader_style**: `SCALPER` (prefer lower TFs) | `SWING` (prefer 4h/1d) | `INVESTOR`.
- **risk_tolerance**: `LOW` (tight stops, confirmation) | `HIGH` (breakouts, wider stops).
- **favorite_pairs**: `["ETH", "BTC", "SOL"]`.

## Injection
The profile is converted to a natural language directive injected into the System Prompt:
> "The user is a **SCALPER** with **HIGH** risk tolerance. Prefer setups on 15m/1h timeframes. Suggest tighter stops."
