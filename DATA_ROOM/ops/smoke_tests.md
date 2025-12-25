# Smoke Tests

Run these commands to verify system health after deployment.

## 1. Backend Health
```bash
curl https://api.tradercopilot.com/health
# Expected: {"status": "ok", "version": "2.1.0"}
```

## 2. Signal Generation (Lite)
```bash
curl -X POST https://api.tradercopilot.com/analyze/lite \
  -H "Content-Type: application/json" \
  -d '{"token": "ETH", "timeframe": "1h", "strategy": "trend_king"}'
```

## 3. Database Check
```bash
# Verify active signals
curl -H "Authorization: Bearer <TOKEN>" https://api.tradercopilot.com/signals/active
```
