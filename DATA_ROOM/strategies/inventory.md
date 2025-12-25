# Strategy Inventory

Path: `backend/strategies/marketplace/`

## 1. Trend King (Source: `marketplace:trend_king`)
- **Philosophy**: Momentum following on breakouts.
- **Indicators**: EMA (20/50), RSI (14), ADX (>25).
- **Entry Rules**: 
  - Price > EMA 20 > EMA 50.
  - RSI between 50 and 70.
  - ADX indicates strong trend.
- **Parameters**: `ema_fast=20`, `ema_slow=50`, `rsi_period=14`.

## 2. Mean Reversion V2 (Source: `marketplace:mean_reversion`)
- **Philosophy**: Fading overextended moves.
- **Indicators**: Bollinger Bands (2.0 std), RSI (>70 or <30).
- **Entry Rules**: 
  - Price touches Upper BB + RSI > 70 -> SHORT.
  - Price touches Lower BB + RSI < 30 -> LONG.
- **Parameters**: `bb_period=20`, `bb_std=2.0`.

## 3. Volume Flow (Source: `marketplace:volume_flow`)
- **Philosophy**: Following smart money volume spikes.
- **Indicators**: OBV, Volume SMA.
- **Entry Rules**: Volume > 2x Average Volume + Price Breakout.

---
**Configuration**: All strategies accept a `parameters` dict in `strategy_configs` to override defaults per token/timeframe.
