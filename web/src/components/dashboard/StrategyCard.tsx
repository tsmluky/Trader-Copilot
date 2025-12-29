import React from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, BarChart2 } from 'lucide-react';

interface StrategyCardProps {
    name: string;
    timeframe: string;
    type: string;
    winRate: number;
    pnl: number;
    status: 'active' | 'standby';
    description: string;
    isCustom?: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
    name,
    timeframe,
    type,
    winRate,
    pnl,
    status,
    description,
    isCustom
}) => {
    const isProfitable = pnl > 0;
    const isActive = status === 'active';

    // Clean up text format (remove [" "] brackets and quotes if present)
    const cleanText = (text: string) => text ? text.replace(/[\[\]"']/g, '') : '';

    return (
        <div className={`
            glass-card relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group
            hover:border-gold-500/50 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.2)] hover:-translate-y-1
            bg-slate-900/40 backdrop-blur-xl border border-white/10
        `}>
            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-100 group-hover:via-gold-400/50 transition-all duration-500" />

            {/* Background Glow Effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-${isCustom ? 'brand' : 'emerald'}-500/5 blur-[80px] rounded-full -mr-20 -mt-20 transition-all duration-500 group-hover:opacity-100 opacity-20`} />

            {/* Custom Badge (Corner Position) */}
            {isCustom && (
                <div className="absolute top-0 right-0 mt-4 mr-4 px-2 py-1 bg-brand-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-brand-500/30 z-20 ring-1 ring-white/20">
                    CUSTOM
                </div>
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-3">
                    {/* Status Pill */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shadow-sm backdrop-blur-md
                        ${isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                        }
                    `}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-500'}`} />
                        {status}
                    </div>

                    {/* Title & Meta */}
                    <div>
                        <h3 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gold-300 transition-all leading-tight duration-300 drop-shadow-sm">
                            {name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-2 font-medium">
                            <span className="px-2 py-0.5 bg-white/5 rounded-md text-slate-300 border border-white/10 font-mono">{cleanText(timeframe)}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">{cleanText(type)}</span>
                        </div>
                    </div>
                </div>

                {/* Type Icon */}
                <div className="flex flex-col items-end gap-2">
                    <div className={`p-3 rounded-2xl border transition-all duration-300 shadow-lg ${type === 'Trend'
                        ? 'bg-brand-500/10 border-brand-500/20 text-brand-400 group-hover:bg-brand-500/20 group-hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.4)]'
                        : (type && type.includes('SOL') ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' : 'bg-white/5 border-white/10 text-slate-400 group-hover:border-white/20')
                        }`}>
                        {type === 'Trend' || name.includes('Trend') ? <TrendingUp size={20} strokeWidth={2} /> : <Activity size={20} />}
                    </div>
                </div>
            </div>

            <p className="text-slate-400/90 text-xs mb-6 line-clamp-2 min-h-[3em] leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-[#020617]/30 rounded-xl p-3 border border-white/5 group-hover:border-white/20 transition-all duration-300 overflow-hidden relative group/stat">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <BarChart2 className="w-3 h-3 group-hover/stat:text-brand-400 transition-colors" /> Win Rate
                        </div>
                        <div className={`text-2xl font-black font-mono tracking-tighter ${winRate >= 50 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-slate-200'}`}>
                            {winRate}%
                        </div>
                    </div>
                </div>

                <div className="bg-[#020617]/30 rounded-xl p-3 border border-white/5 group-hover:border-white/20 transition-all duration-300 overflow-hidden relative group/stat">
                    <div className="relative z-10">
                        <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 group-hover/stat:text-gold-400 transition-colors" /> Total PnL
                        </div>
                        <div className={`text-2xl font-black font-mono tracking-tighter ${isProfitable ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : (pnl < 0 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'text-slate-200')}`}>
                            {pnl > 0 ? '+' : ''}{pnl}R
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
