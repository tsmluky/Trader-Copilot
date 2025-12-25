# KPI Calculations

Win Rate and Profitability (R-units) are calculated in `evaluation_worker.py` (or similar background logic) and aggregated for the Dashboard.

## 1. Win Rate
Formula: `(Winning Signals / Total Closed Signals) * 100`
- **Win**: `pnl_r > 0`
- **Loss**: `pnl_r <= 0`

## 2. R-Multiple (PnL)
We standardize performance using "R" (Risk Units) rather than absolute currency, to be account-size agnostic.
- **Risk (R)**: `|Entry - StopLoss|`
- **Profit**: `|Exit - Entry|` (if direction matches) or `-|Exit - Entry|` (if adverse)
- **PnL (R)**: `Profit / Risk`

Example:
- Entry: 100, SL: 90, TP: 120 (Risk = 10)
- Exit: 120 (Profit = 20)
- **Result**: +2.0R

## 3. Active Signals
Signals where `evaluation` is NULL or `status` is PENDING (depending on implementation detail) and timestamp is within valid TTL (e.g., 24h).
