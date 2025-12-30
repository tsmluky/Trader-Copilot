"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // We should use TokenSelector ideally but Input is fine for search
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, Sparkles, Zap, Smartphone, ArrowRight, BrainCircuit, LineChart } from "lucide-react";
import toast from "react-hot-toast";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SignalCard } from "../components/SignalCard";
import { SignalChart } from "../components/SignalChart";
import { ProAnalysisViewer } from "../components/ProAnalysisViewer";
import { ThinkingOverlay } from "@/components/ThinkingOverlay";

export const AnalysisPage = () => {
  const [params] = useSearchParams();
  const { userProfile } = useAuth();

  const [token, setToken] = useState(params.get("token") || "BTC");
  const [timeframe, setTimeframe] = useState("1h");
  const [mode, setMode] = useState<"lite" | "pro">("lite");
  const [isLoading, setIsLoading] = useState(false);

  const [liteResult, setLiteResult] = useState<any>(null);
  const [proResult, setProResult] = useState<any>(null);
  const [ohlcv, setOhlcv] = useState<any[]>([]);

  // Pre-fill from URL
  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
  }, [params]);

  const handleAnalyze = async () => {
    if (!token) return toast.error("Please enter a token symbol");

    setIsLoading(true);
    setLiteResult(null);
    setProResult(null);
    setOhlcv([]);

    try {
      // 1. Fetch Market Data for Chart always
      const candles = await api.getOHLCV(token, timeframe);
      setOhlcv(candles || []);

      // 2. Execute Analysis
      if (mode === 'lite') {
        const res = await api.analyzeLite(token, timeframe);
        setLiteResult(res);
        toast.success(`Analysis complete for ${token}`);
      } else {
        // Check Pro Access
        if (userProfile?.user?.plan === 'free') {
          toast.error("Pro Analysis requires a Premium plan");
          setMode('lite'); // Fallback
          setIsLoading(false);
          return;
        }

        // Stream PRO analysis
        const res = await api.analyzePro(token, timeframe, true);
        setProResult(res);
        toast.success("Deep Dive complete");
      }

    } catch (e) {
      toast.error("Analysis failed. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 animate-fade-in">
      {isLoading && <ThinkingOverlay />}

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-40"></div>
      </div>

      <div className="relative z-10 px-4 pt-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
            Start
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Analysis</span>
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Deploy autonomous agents to scan market structure and sentiment.
          </p>
        </div>

        {/* Controls */}
        <div className="glass-card p-6 rounded-2xl mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

            {/* Token Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</label>
              <div className="relative">
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="pl-10 h-11 bg-black/20 border-white/10 text-lg font-bold text-white placeholder:text-slate-600 focus:border-brand-500/50"
                  placeholder="BTC, ETH, SOL..."
                />
                <div className="absolute left-3 top-3 text-slate-500 font-bold">$</div>
              </div>
            </div>

            {/* Timeframe */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-11 bg-black/20 border-white/10 text-white font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minute (Scalp)</SelectItem>
                  <SelectItem value="15m">15 Minute (Intraday)</SelectItem>
                  <SelectItem value="1h">1 Hour (Swing)</SelectItem>
                  <SelectItem value="4h">4 Hour (Trend)</SelectItem>
                  <SelectItem value="1d">1 Day (Macro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Switch */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                Analysis Depth
                {mode === 'pro' && <Badge variant="secondary" className="h-4 text-[9px] px-1 bg-brand-500/20 text-brand-300 border-brand-500/30">PRO</Badge>}
              </label>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 h-11">
                <button
                  onClick={() => setMode('lite')}
                  className={`flex-1 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'lite' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Zap size={14} className={mode === 'lite' ? 'fill-white' : ''} />
                  LITE
                </button>
                <button
                  onClick={() => setMode('pro')}
                  className={`flex-1 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'pro' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <BrainCircuit size={14} />
                  PRO
                </button>
              </div>
            </div>

            {/* Action */}
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={isLoading || !token}
              className="h-11 w-full font-bold text-md bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing</span>
              ) : (
                <span className="flex items-center gap-2">Run Analysis <ArrowRight size={18} /></span>
              )}
            </Button>
          </div>
        </div>

        {/* Results Area */}
        {mode === 'lite' && liteResult && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <SignalCard
              signal={liteResult}
              chartNode={ohlcv.length > 0 && <SignalChart
                data={ohlcv}
                entry={liteResult.entry}
                tp={liteResult.tp}
                sl={liteResult.sl}
                direction={liteResult.direction}
              />}
            />
          </div>
        )}

        {mode === 'pro' && proResult && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-6">
            <ProAnalysisViewer raw={proResult.raw} token={token} />

            {/* Add Chart for context even in Pro mode if we have data */}
            {ohlcv.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="text-brand-400" size={20} />
                  <h3 className="text-white font-bold">Chart Context</h3>
                </div>
                <div className="h-[300px]">
                  <SignalChart
                    data={ohlcv}
                    entry={0}
                    tp={0}
                    sl={0}
                    direction="long" // Default
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
