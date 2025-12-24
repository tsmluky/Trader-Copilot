import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon: Icon }) => (
    <div className="bg-slate-900/40 border border-slate-800/60 p-4 px-6 rounded-2xl flex items-center gap-5 min-w-[180px] backdrop-blur-md hover:bg-slate-900/60 transition-all duration-300 hover:border-indigo-500/30 group relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${trend >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} group-hover:opacity-30 transition-opacity`} />

        <div className={`p-3 rounded-xl relative z-10 ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <Icon size={24} />
        </div>
        <div className="relative z-10">
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{label}</div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
                {value}
            </div>
            {trend !== 0 && (
                <div className={`text-[10px] font-bold mt-1 inline-flex items-center gap-1 ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    </div>
);
