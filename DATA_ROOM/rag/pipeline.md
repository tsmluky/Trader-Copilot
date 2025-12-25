# RAG Pipeline

The Retrieval-Augmented Generation pipeline ensures the LLM has fresh context.

## Workflow

1. **User Query**: "Analyze ETH for me."
2. **Context Fetch (Parallel)**:
   - `fetch_ohlcv("ETH/USDT", "4h")` -> Returns CSV-like string of last 20 candles.
   - `fetch_news("ETH")` -> Returns top 3 headlines from last 24h.
   - `fetch_profile(user_id)` -> Returns "Risk Averse / Swing Trader".
3. **Compression & Ranking**:
   - News items are ranked by "Hotness" (votes/velocity).
   - Only top 3 are kept to fit context window.
   - Technical indicators (RSI, ADX) are pre-calculated in Python and injected as scalars to save tokens.
4. **Prompt Injection**:
   - The System Prompt receives the strict JSON/Markdown context block.
   - "You are a professional trader. Here is the market state: [CONTEXT]..."
5. **Generation**:
   - LLM generates response based *only* on provided context.
