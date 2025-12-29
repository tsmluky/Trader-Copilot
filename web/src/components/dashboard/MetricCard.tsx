import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon: Icon }) => (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
        {/* Top Highlight - "Glass Edge" */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 group-hover:via-brand-400/50 group-hover:opacity-100 transition-all duration-700" />

        {/* Deep ambient glow (Matches Landing Page 'LITE' card) */}
        <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-all duration-700 group-hover:opacity-20 ${trend >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="relative z-10 flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl border backdrop-blur-md transition-all duration-500 group-hover:scale-110 ${trend >= 0 ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/10 text-rose-400 group-hover:border-rose-500/30'}`}>
                <Icon size={24} strokeWidth={2} />
            </div>
            {trend !== 0 && (
                <div className={`flex items-center text-[10px] font-mono font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${trend > 0 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <div className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase mb-1">{label}</div>
            <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1 drop-shadow-lg">
                {value}
            </div>
        </div>
    </div>
);
