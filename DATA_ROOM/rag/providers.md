# RAG & Context Providers

We use real-time data providers to ground specific Copilot insights. No simulated data is used in production.

## 1. Market Data
- **Provider**: CCXT (Unified Exchange API)
- **Exchanges**: Binace (Primary), KuCoin (Fallback).
- **Data Points**: OHLCV, Volume, Order Book Depth.

## 2. News & Sentiment
- **Provider**: CryptoPanic API (or alternative `newsapi.org` via adapter).
- **Fallbacks**: If API Quota exceeded -> Fallback to "Technical Only" analysis mode.

## 3. On-Chain Data (Premium)
- **Provider**: Etherscan / Solscan (configured in `.env`).
- **Usage**: Verifying token contract age and holder distribution for "Degen" signals.
