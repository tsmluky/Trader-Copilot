# Scheduler Architecture

The scheduler is the heartbeat of TraderCopilot, responsible for 24/7 market scanning and signal generation.

## Entry Point
- **File**: `backend/scheduler.py`
- **Execution**: Runs as a background task initiated on FastAPI startup (`@app.on_event("startup")` -> `start_scheduler()`).
- **Loop**: Uses `asyncio` loop with `asyncio.sleep(60)` to tick every minute.

## Guards & Safety Mechanisms

### 1. Coherence Guard ("Anti-Chop")
- **Purpose**: Prevents conflicting signals (e.g., LONG then SHORT) for the same token within a short window, which usually indicates a choppy market.
- **Rule**: If a signal for Token X is generated, any *opposing* signal for Token X is blocked for **30 minutes**.
- **Implementation**: In-memory dictionary `self.token_coherence` stores `{token: (direction, timestamp)}`.

### 2. Deduplication Engine
- **Purpose**: Prevents spamming the user with the same signal if the strategy triggers repeatedly on the same candle.
- **Rule**: Duplicate signals (Same Strategy + Same Token + Same Direction) are suppressed for **45 minutes**.
- **Implementation**: `self.dedupe_cache` stores hash of signal params.

## Concurrency
- The scheduler runs in a single-process worker (in current deployment).
- **Multi-Worker Scaling**: To scale horizontally, we would migrate `dedupe_cache` and `token_coherence` to Redis. Currently, they are in-memory for simplicity and speed (Sale-Ready architecture).

## Reliability
- **Exception Handling**: The main loop is wrapped in a broad `try/except` block to ensure the scheduler *never* crashes the application, even if a strategy module raises an error.
- **Error Logging**: All failures are logged to `backend.log`.
