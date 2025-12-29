import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon: Icon }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-[#020617]/40 backdrop-blur-md border border-white/5 p-5 shadow-lg transition-all duration-500 hover:border-brand-500/30 hover:shadow-brand-500/10 hover:-translate-y-1">
        {/* Hover Highlight Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Glow Blob */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-30 ${trend >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="relative z-10 flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'} transition-colors group-hover:bg-opacity-20`}>
                <Icon size={22} strokeWidth={2} />
            </div>
            {trend !== 0 && (
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg border ${trend > 0 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">{label}</div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                {value}
            </div>
        </div>
    </div>
);
