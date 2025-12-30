import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface SignalCardProps {
  signal: any;
  chartNode?: React.ReactNode;
}

export function SignalCard({ signal, chartNode }: SignalCardProps) {
  if (!signal) return null;

  const isLong = signal.direction === 'long';
  const colorClass = isLong ? 'text-emerald-400' : 'text-rose-400';
  const bgClass = isLong ? 'bg-emerald-500/10' : 'bg-rose-500/10';
  const borderClass = isLong ? 'border-emerald-500/20' : 'border-rose-500/20';

  return (
    <div className={`rounded-xl border ${borderClass} ${bgClass} p-6 relative overflow-hidden backdrop-blur-md`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-black text-white tracking-tight">{signal.token}</h3>
            <Badge variant={isLong ? "default" : "destructive"} className="uppercase">
              {signal.direction}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
            <Clock size={14} />
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Confidence</div>
          <div className="text-2xl font-black text-white flex items-center justify-end gap-1">
            <Target size={20} className="text-gold-400" />
            {signal.confidence}%
          </div>
        </div>
      </div>

      {/* Price Targets */}
      <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Entry Zone</div>
          <div className="text-lg font-mono font-bold text-white">{signal.entry}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Take Profit</div>
          <div className="text-lg font-mono font-bold text-emerald-400">{signal.tp}</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Stop Loss</div>
          <div className="text-lg font-mono font-bold text-rose-400">{signal.sl}</div>
        </div>
      </div>

      {/* Chart */}
      {chartNode && (
        <div className="bg-black/40 rounded-xl border border-white/5 p-4 mb-6 h-[250px] relative z-10">
          {chartNode}
        </div>
      )}

      {/* Rationale */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5 relative z-10">
        <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-400" />
          AI Rationale
        </h4>
        <p className="text-slate-400 text-sm leading-relaxed">
          {signal.rationale || "No detailed rationale provided for this signal."}
        </p>
      </div>
    </div>
  );
}
