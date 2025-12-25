# Database Schema

The persistence layer uses SQLAlchemy (ORM) connecting to PostgreSQL (Prod) or SQLite (Dev).

## Entity Relationship Diagram (Textual)

### 1. **Users** (`users`)
- **id** (PK): Integer
- **email** (Unique): String
- **role**: `user` | `admin`
- **plan**: `FREE` | `PRO`
- **telegram_chat_id**: String (For notifications)
- *Relationships*: Has many `Signal` (as owner/trigger), Has one `CopilotProfile`.

### 2. **Signals** (`signals`)
- **id** (PK): Integer
- **token**: String (e.g., ETH)
- **direction**: `long` | `short`
- **timestamp**: DateTime (UTC)
- **source**: String (e.g., `Marketplace:TrendKing`)
- **idempotency_key**: String (Unique, prevents duplicates)
- **strategy_id**: String
- *Relationships*: Has one `SignalEvaluation`.

### 3. **Signal Evaluations** (`signal_evaluations`)
- **id** (PK): Integer
- **signal_id** (FK -> `signals.id`)
- **result**: `WIN` | `LOSS` | `BE`
- **pnl_r**: Float (R-Multiple, e.g., 2.5R)
- **exit_price**: Float

### 4. **Strategy Configs** (`strategy_configs`)
- **id**: Integer
- **strategy_id**: String (Logic ID)
- **persona_id**: String (Instance ID, e.g., `trend_king_sol`)
- **config_json**: JSON (Parameters)
- **enabled**: Boolean

### 5. **Copilot Profiles** (`copilot_profiles`)
- **user_id** (FK -> `users.id`)
- **trader_style**: `SCALPER` | `SWING`
- **risk_tolerance**: `LOW` | `HIGH`

## Idempotency & Deduplication
- **Signals**: Unique constraint on `idempotency_key`. 
  - Key format: `{strategy_id}-{token}-{timeframe}-{candle_timestamp}`.
- **Scheduler**: Hash-based deduplication in `dedupe_cache` (Python memory) for 45 minutes to prevent recurring alerts for the same technical condition.
