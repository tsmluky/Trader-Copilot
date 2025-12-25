# Strategy Registry

The registry controls which strategies are active and how they are configured.

## Mechanism
- **Dynamic Loading**: Strategies are loaded from `backend/strategies/marketplace/` as Python modules.
- **Interface**: Each strategy must implement:
  - `analyze(data: DataFrame, parameters: dict) -> Signal | None`
  - `get_required_indicators() -> list`

## Configuration Storage
Configs are stored in the `strategy_configs` table (or `json` files in `backend/config/` for dev).
- **Structure**:
  ```json
  {
    "strategy_id": "trend_king",
    "enabled": true,
    "pairs": ["BTC/USDT", "ETH/USDT"],
    "timeframes": ["1h", "4h"],
    "params": {
      "rsi_period": 14
    }
  }
  ```
