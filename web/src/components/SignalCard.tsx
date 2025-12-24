import React, { useEffect, useState } from 'react';
import { SignalLite, SignalEvaluation } from '../types';
import { api } from '../services/api';
import { formatPrice } from '../utils/format';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCopilot } from '../context/CopilotContext';

interface SignalCardProps {
  signal: SignalLite;
  chartNode?: React.ReactNode;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, chartNode }) => {
  const [evaluation, setEvaluation] = useState<SignalEvaluation | null>(null);
  const [isLoadingEval, setIsLoadingEval] = useState(false);
  const [copied, setCopied] = useState(false);

  const { userProfile, toggleFollow } = useAuth();
  const { setContext } = useCopilot();

  const isLong = signal.direction === 'long';
  const directionColor = isLong ? 'text-emerald-400' : 'text-rose-400';
  const baseBg = isLong ? 'bg-emerald-500/5' : 'bg-rose-500/5';
  const borderColor = isLong ? 'border-emerald-500/20' : 'border-rose-500/20';

  // Check if followed (paper trading)
  const isFollowed =
    userProfile?.portfolio?.followed_signals?.some(
      (s) => s.timestamp === signal.timestamp && s.token === signal.token,
    ) ?? false;

  // Risk/Reward stats
  const risk = Math.abs(signal.entry - signal.sl);
  const reward = Math.abs(signal.tp - signal.entry);
  const rrRatio = risk === 0 ? 0 : Number((reward / risk).toFixed(2));

  // Fetch evaluación de la señal
  useEffect(() => {
    const fetchEval = async () => {
      setIsLoadingEval(true);
      try {
        const result = await api.getSignalEvaluation(signal.token, signal.timestamp);
        setEvaluation(result);
      } catch (e) {
        console.error('Failed to fetch evaluation', e);
      } finally {
        setIsLoadingEval(false);
      }
    };

    if (signal) {
      fetchEval();
    }
  }, [signal]);

  const handleCopy = () => {
    const text = `[LITE] ${signal.token} ${signal.timeframe
      } — ${signal.direction} | Entry ${signal.entry} | TP ${signal.tp} | SL ${signal.sl
      } | Conf ${(signal.confidence * 100).toFixed(0)}%`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border ${borderColor} ${baseBg} p-4 shadow-2xl backdrop-blur-xl animate-fade-in relative overflow-hidden group`}
    >
      {/* Background Gradient Mesh */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10 ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      {/* Header - Compact */}
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">
              {signal.token}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/50 text-slate-400 border border-slate-700 backdrop-blur-md">
                {signal.timeframe}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/50 text-slate-500 border border-slate-700 uppercase tracking-widest backdrop-blur-md">
                {signal.source.replace('Marketplace:', '')}
              </span>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${isLong
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
          >
            {isLong ? (
              <TrendingUp size={12} strokeWidth={3} />
            ) : (
              <TrendingDown size={12} strokeWidth={3} />
            )}
            {signal.direction}
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          {evaluation ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-inner ${evaluation.status === 'WIN'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                } mb-1 backdrop-blur-md`}
            >
              {evaluation.status === 'WIN' ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              <span className="font-bold text-xs">
                {evaluation.pnl_r > 0 ? '+' : ''}{evaluation.pnl_r}R
              </span>
            </div>
          ) : (
            <div className="bg-slate-900 px-2 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span className="text-[9px] font-bold text-slate-300 tracking-wide">
                {isLoadingEval ? 'ANALYZING' : 'ACTIVE'}
              </span>
            </div>
          )}

          <div className="mt-1 flex items-center gap-1 opacity-70">
            <Activity size={9} className="text-slate-500" />
            <span className="text-[9px] text-slate-400 font-mono font-medium">
              CONFIDENCE: <span className="text-white font-bold">{(signal.confidence * 100).toFixed(0)}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Numbers Grid - Ultra Compact */}
      <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center hover:border-slate-600 transition-colors shadow-lg group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Entry</div>
            <div className="font-mono text-sm md:text-base font-black text-white tracking-tight">{formatPrice(signal.entry)}</div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center hover:border-emerald-500/50 transition-colors shadow-lg group relative overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/0 to-emerald-500/10`} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[9px] uppercase tracking-widest text-emerald-500/60 font-bold mb-0.5">Target</div>
            <div className="font-mono text-sm md:text-base font-black text-emerald-400 tracking-tight drop-shadow-sm">{formatPrice(signal.tp)}</div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center hover:border-rose-500/50 transition-colors shadow-lg group relative overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-rose-500/0 to-rose-500/10`} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[9px] uppercase tracking-widest text-rose-500/60 font-bold mb-0.5">Stop</div>
            <div className="font-mono text-sm md:text-base font-black text-rose-400 tracking-tight drop-shadow-sm">{formatPrice(signal.sl)}</div>
          </div>
        </div>
      </div>

      {/* Chart Injection Area (Between Numbers and Rationale) */}
      {chartNode && (
        <div className="mb-3 rounded-lg overflow-hidden border border-slate-800/50 shadow-inner bg-slate-950/30">
          {chartNode}
        </div>
      )}

      {/* Rationale - Compact */}
      <div className="bg-slate-950/30 rounded-lg p-3 border border-slate-800/50 mb-3 shadow-inner relative">
        <div className="absolute top-3 left-0 w-0.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
        <div className="ml-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Lightbulb size={10} className="text-indigo-400" />
              AI Analysis
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            {signal.rationale}
          </p>
        </div>
      </div>

      {/* Footer Actions - Micro Grid */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/50">

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setContext({
                token: signal.token,
                timeframe: signal.timeframe,
                signal: signal,
                message: `Let's discuss this ${signal.token} ${signal.direction} signal. Risk analysis?`
              });
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <Shield size={12} />
            DISCUSS
          </button>

          <button
            onClick={() => toggleFollow(signal)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all border active:scale-[0.98] ${isFollowed
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-slate-800/40 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-500'
              }`}
          >
            {isFollowed ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            {isFollowed ? 'TRACKING' : 'TRACK'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={async () => {
              const icon = isLong ? "🟢" : "🔴";
              const sourceName = signal.source.replace('Marketplace:', '');

              const text = `${icon} ${signal.direction.toUpperCase()}: ${signal.token} / USDT\n\n` +
                `Entry: ${signal.entry}\n` +
                `Target: ${signal.tp}\n` +
                `Stop:   ${signal.sl}\n\n` +
                `⚡ Strategy: ${sourceName} (${signal.timeframe})`;

              try {
                await api.notifyTelegram(text, userProfile?.user?.telegram_chat_id);
                toast.success("Sent to Telegram!");
              } catch (e) {
                console.error("Share failed", e);
                toast.error("Failed to share.");
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-sky-500/5 text-sky-400 border border-sky-500/10 hover:bg-sky-500/10 hover:border-sky-500/20 transition-all"
          >
            <Send size={12} />
            TELEGRAM
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border active:scale-[0.98] ${copied
              ? 'bg-emerald-500 text-white border-emerald-400'
              : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-700 hover:text-white'
              }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        <div className="flex justify-center mt-1">
          <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-600 tracking-wider">
            <Clock size={9} />
            Generated {new Date(signal.timestamp).toLocaleTimeString()}
          </div>
        </div>

      </div>
    </div>
  );
};
