import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon: Icon }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-5 shadow-2xl transition-all duration-300 hover:border-brand-500/50 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-1">
        {/* Top Highlight - "Glass Edge" */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:via-brand-400/50 group-hover:opacity-100 transition-all duration-500" />

        {/* Deep ambient glow */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-20 transition-all duration-500 group-hover:opacity-30 ${trend >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="relative z-10 flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]'} transition-transform group-hover:scale-110 duration-300 group-hover:rotate-3`}>
                <Icon size={22} strokeWidth={2.5} />
            </div>
            {trend !== 0 && (
                <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${trend > 0 ? 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10' : 'text-rose-300 border-rose-500/20 bg-rose-500/10'}`}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-1 group-hover:text-brand-200 transition-colors">{label}</div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1 drop-shadow-md">
                {value}
            </div>
        </div>
    </div>
);
