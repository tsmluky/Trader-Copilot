import React from 'react';
import { History, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SignalHistory } from '../SignalDetailsModal';

import { formatRelativeTime } from '../../utils/format';

import { useAuth } from '../../context/AuthContext';

interface DashboardHistoryProps {
    signals: any[]; // Using any to be flexible with backend response, but will cast to SignalHistory
    onSignalClick?: (signal: any) => void;
}

export const DashboardHistory: React.FC<DashboardHistoryProps> = ({ signals, onSignalClick }) => {
    const { userProfile } = useAuth();
    const userTimezone = userProfile?.user?.timezone;

    return (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                        <History size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Live Operations Feed</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Real-time execution log</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                            <th className="p-5 font-bold">Time</th>
                            <th className="p-5 font-bold">Agent / Token</th>
                            <th className="p-5 font-bold">Action</th>
                            <th className="p-5 font-bold text-right">Entry</th>
                            <th className="p-5 font-bold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {signals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-500 italic">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-sm font-medium">Scanning markets for high-probability setups...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            signals.map((sig) => (
                                <tr
                                    key={sig.id}
                                    onClick={() => onSignalClick && onSignalClick(sig)}
                                    className="hover:bg-white/[0.02] transition-all duration-200 group border-l-2 border-transparent hover:border-brand-500 cursor-pointer"
                                >
                                    <td className="p-5 text-slate-400 font-mono text-xs whitespace-nowrap group-hover:text-slate-300" title={new Date(sig.timestamp.endsWith('Z') ? sig.timestamp : `${sig.timestamp}Z`).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                        timeZone: userTimezone
                                    })}>
                                        {formatRelativeTime(sig.timestamp)}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-xs font-black text-brand-300 border border-brand-500/20">
                                                {sig.token.substring(0, 3)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors flex items-center gap-2">
                                                    {sig.token}
                                                    {(sig.mode === 'BACKTEST' || sig.source.includes('backtest')) && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700">
                                                            BACKTEST
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono tracking-tight">{sig.source.replace('Marketplace:', '')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wide border ${sig.direction.toLowerCase() === 'long'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                                            }`}>
                                            {sig.direction === 'long' ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                                            {sig.direction}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-mono text-white text-sm font-bold">
                                        {sig.entry}
                                    </td>
                                    <td className="p-5 text-center">
                                        {sig.status && sig.status !== 'OPEN' ? (
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1 ${['WIN', 'TP'].some(s => sig.status.includes(s)) || (sig.pnl && sig.pnl > 0)
                                                ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30'
                                                : 'text-rose-300 bg-rose-500/20 border-rose-500/30'
                                                }`}>
                                                {sig.status} {sig.pnl ? `(${sig.pnl > 0 ? '+' : ''}${sig.pnl}R)` : ''}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 inline-flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                                                Running
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
