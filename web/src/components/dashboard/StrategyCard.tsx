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
            glass-card rounded-3xl p-6 relative overflow-hidden group
            hover:border-gold-500/30
        `}>
            {/* Gradient Overlay for Depth (Matches Feature Card) */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Background Glow Effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-${isCustom ? 'brand' : 'emerald'}-500/5 blur-[80px] rounded-full -mr-20 -mt-20 transition-all duration-700 group-hover:bg-${isCustom ? 'brand' : 'emerald'}-500/10 opacity-60`} />

            {/* Custom Badge */}
            {isCustom && (
                <div className="absolute top-0 right-0 mt-4 mr-4 px-2 py-1 bg-brand-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-brand-500/30 z-20 ring-1 ring-white/20">
                    Custom
                </div>
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-3">
                    {/* Status Pill */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shadow-sm backdrop-blur-md
                        ${isActive
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                        }
                    `}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {status}
                    </div>

                    {/* Title & Meta */}
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors duration-300 leading-tight">
                            {name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-2 font-medium">
                            <span className="px-2 py-0.5 bg-black/20 rounded-md text-slate-400 border border-white/5 font-mono">{cleanText(timeframe)}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">{cleanText(type)}</span>
                        </div>
                    </div>
                </div>

                {/* Type Icon */}
                <div className="flex flex-col items-end gap-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${type === 'Trend'
                        ? 'bg-brand-500/10 border-brand-500/20 text-brand-400 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                        : (type && type.includes('SOL') ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' : 'bg-white/5 border-white/10 text-slate-400')
                        }`}>
                        {type === 'Trend' || name.includes('Trend') ? <TrendingUp size={20} strokeWidth={2} /> : <Activity size={20} />}
                    </div>
                </div>
            </div>

            <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[3em] leading-relaxed font-light">
                {description}
            </p>

            {/* Stats Grid - MATCHING Landing Page 'Backtest Lab' Style */}
            <div className="space-y-2 relative z-10 bg-black/20 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Win Rate</span>
                    <span className={`font-mono font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-slate-200'}`}>{winRate}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Total PnL</span>
                    <span className={`font-mono font-bold ${isProfitable ? 'text-gold-400' : (pnl < 0 ? 'text-rose-400' : 'text-slate-200')}`}>
                        {pnl > 0 ? '+' : ''}{pnl}R
                    </span>
                </div>
            </div>
        </div>
    );
};
