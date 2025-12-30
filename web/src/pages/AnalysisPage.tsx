import React, { useState, useEffect } from "react";
import { analyzeLite, analyzePro, getOHLCV } from "../services/api";
import type { SignalLite, ProResponse } from "../types";
import { ProAnalysisViewer } from "../components/ProAnalysisViewer";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThinkingOverlay } from "../components/ThinkingOverlay";
import { SignalCard } from "../components/SignalCard";
import { TokenSelector } from "../components/TokenSelector";
import { SignalChart } from "../components/SignalChart"; // Still needed? SignalCard doesn't have chart built-in? 
// Wait, SignalCard DOES NOT have chart built-in in the code I viewed. It has RR bar.
// I need to check SignalCard again.
// Viewed SignalCard.tsx: It does NOT have the chart. 
// However, the AnalysisPage has a "LIVE MARKET CONTEXT" chart.
// The user request was "Tracking button". `SignalCard` has it.
// I should render `SignalChart` AND `SignalCard` (for the metrics/tracking).
// The `SignalCard` in `AnalysisPage` will replace the "Execution Block" and "Rationale Section".

type Mode = "LITE" | "PRO";

const DEFAULT_TOKENS = ["BTC", "ETH", "SOL"];
const TIMEFRAMES = ["1h", "4h", "1d"] as const;

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  // Clean tokens list
  const availableTokens = userProfile?.user.allowed_tokens && userProfile.user.allowed_tokens.length > 0
    ? userProfile.user.allowed_tokens
    : DEFAULT_TOKENS;

  const [mode, setMode] = useState<Mode>("LITE");
  const [token, setToken] = useState<string>(availableTokens[0] || "ETH");
  const [timeframe, setTimeframe] = useState<string>("4h");

  // Reset token if list changes and current not in list (safety)
  useEffect(() => {
    if (availableTokens.length > 0 && !availableTokens.includes(token)) {
      // If current token is invalid for new list, reset.
      // But if I want to allow searching ANY token maybe I shouldn't restrict strict equality?
      // For now, strict is safer for entitlements.
      setToken(availableTokens[0]);
    }
  }, [availableTokens, userProfile]); // Check dependency

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [liteResult, setLiteResult] = useState<SignalLite | null>(null);

  // Pro Result & Streaming state
  const [proResult, setProResult] = useState<ProResponse | null>(null);
  const [streamedRaw, setStreamedRaw] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Chart Data
  const [chartData, setChartData] = useState<any[]>([]);

  // Streaming Effect Hook
  useEffect(() => {
    if (proResult && proResult.raw) {
      setStreamedRaw("");
      setIsStreaming(true);
      let i = 0;
      const fullText = proResult.raw;

      const interval = setInterval(() => {
        setStreamedRaw((prev) => fullText.slice(0, i + 5));
        i += 5;
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setStreamedRaw(fullText);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [proResult]);

  async function handleGenerate() {
    setError(null);
    setIsLoading(true);
    setLiteResult(null);
    setProResult(null);
    setStreamedRaw("");
    setChartData([]);

    try {
      const dataPromise = getOHLCV(token, timeframe);

      if (mode === "LITE") {
        const [signal, ohlcv] = await Promise.all([
          analyzeLite(token, timeframe),
          dataPromise
        ]);
        setLiteResult(signal);
        setChartData(ohlcv);

      } else {
        const [signal, ohlcv] = await Promise.all([
          analyzePro(token, timeframe, true),
          dataPromise
        ]);
        setProResult(signal);
        setChartData(ohlcv);
      }
    } catch (err: any) {
      console.error("Error generating analysis", err);
      setError(err?.message ?? "Error generating analysis");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">

      {/* Background Texture & Lighting (Identical to Landing) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Landing Page Style Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10 pl-2">
        <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-brand-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        <h1 className="text-3xl font-black text-white flex items-center gap-2 pl-6 tracking-tight drop-shadow-lg">
          <Sparkles className="w-6 h-6 text-brand-400" />
          AI Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Hub</span>
        </h1>
        <p className="text-slate-400 text-sm pl-6 font-medium">
          Select your asset and let our Multi-Agent AI analyze market structure, on-chain data, and global sentiment.
        </p>
      </div>

      {/* Config Card */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 relative z-30 shadow-2xl">
        {/* Mode toggle */}
        <div className="flex gap-3">
          {(["LITE", "PRO"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300
                ${mode === m
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-[1.02]"
                  : "bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
                }`}
            >
              {m === "LITE" ? "⚡ LITE Signal" : "🧠 PRO Deep Analysis"}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5 relative z-20">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Asset
            </label>
            <TokenSelector
              value={token}
              onChange={setToken}
              availableTokens={availableTokens}
              isProUser={mode === "PRO" || userProfile?.user.subscription_status !== 'free'}
            />
          </div>

          <div className="flex flex-col gap-1.5 z-10">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Timeframe
            </label>
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-[#0B1121] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 appearance-none font-bold transition-all shadow-inner"
              >
                {TIMEFRAMES.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-end z-10">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || isStreaming}
              className="w-full h-[46px] inline-flex items-center justify-center px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest
                bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-[0.98]"
            >
              {isLoading
                ? <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75" /><div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" /> BRAIN ACTIVE</span>
                : isStreaming
                  ? "Streaming..."
                  : "Start Analysis"}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in">
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" />
            <span className="font-bold">{error}</span>
          </div>
        )}
      </div>

      {/* Thinking State */}
      {isLoading && <ThinkingOverlay />}

      {/* Result Card */}
      {!isLoading && (
        <div className="glass-card rounded-3xl p-8 min-h-[300px] relative overflow-hidden group">
          {/* Inner Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-80" />

          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </span>
              Analysis Result
              {isStreaming && <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>}
            </h2>
          </div>

          {!liteResult && !proResult && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                <Sparkles className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Ready to analyze the market</p>
            </div>
          )}

          {mode === "LITE" && liteResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">

              {/* Signal Card now wraps the Chart internally */}
              <SignalCard
                signal={liteResult}
                chartNode={chartData.length > 0 ? (
                  <SignalChart
                    data={chartData}
                    entry={liteResult.entry}
                    tp={liteResult.tp}
                    sl={liteResult.sl}
                    direction={liteResult.direction}
                  />
                ) : undefined}
              />

            </div>
          )}

          {mode === "PRO" && (
            <div className="relative z-10">
              <ProAnalysisViewer raw={streamedRaw} token={token} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
