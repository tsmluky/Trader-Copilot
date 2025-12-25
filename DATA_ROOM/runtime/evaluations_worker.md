# Evaluations Worker

(Conceptual / Planned Integration)

To verify the quality of signals, a separate process (or scheduled task) monitors trade outcomes.

## Workflow
1. **Fetch Active Signals**: Query DB for signals older than `duration` (e.g., 4h) but with `result` = NULL.
2. **Fetch Market Data**: Use CCXT/Exchange API to get price history since Signal Timestamp.
3. **Simulate Trade**:
   - Did Price hit SL first? -> **LOSS**
   - Did Price hit TP first? -> **WIN**
   - Did Time expire? -> **BE** (Break Even / Close)
4. **Update DB**: Write `result` and `pnl_r` to `signal_evaluations` table.

## Execution
Currently implemented as an on-demand analysis function or a scheduled function in `scheduler.py` (depending on configuration).
