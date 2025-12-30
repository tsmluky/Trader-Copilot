import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Crosshair, Lock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

interface ScannerSignalCardProps {
    signal: any;
    onAnalyze: (signal: any) => void;
}

export const ScannerSignalCard: React.FC<ScannerSignalCardProps> = ({ signal, onAnalyze }) => {
    const { userProfile, toggleFollow } = useAuth();
    const [isHovered, setIsHovered] = useState(false);

    // Check if followed
    const isFollowed = userProfile?.portfolio?.followed_signals?.some(
        (s: any) => s.token === signal.token && s.timestamp === signal.timestamp
    );

    const handleToggleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFollow(signal);
    };

    const isLong = signal.direction.toUpperCase() === 'LONG';
    const isWin = signal.status?.includes('WIN') || signal.status?.includes('TP');
    const isLoss = signal.status?.includes('LOSS') || signal.status?.includes('SL');
    const isOpen = signal.status === 'OPEN';

    // Fix Timezone: Ensure timestamp is treated as UTC
    const safeTimestamp = signal.timestamp.endsWith('Z') ? signal.timestamp : `${signal.timestamp}Z`;

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();

        // Handle "Future" times or slight clock skews
        if (diff < 0) return 'Just now';

        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';

        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div
            className={`glass-card rounded-2xl overflow-hidden relative group transition-all duration-300 hover:-translate-y-1
            ${isHovered ? (isLong ? 'hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]' : 'hover:border-rose-500/30 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)]') : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Highlight - "Glass Edge" */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 group-hover:via-white/30 group-hover:opacity-100 transition-all duration-700" />

            {/* Ambient Glow based on Direction */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-all duration-700 group-hover:opacity-20 pointer-events-none 
                ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />

            {/* Locked Overlay */}
            {signal.locked && (
                <div className="absolute inset-0 z-30 bg-[#020617]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Lock size={24} className="text-amber-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1 tracking-tight">Signal Locked</h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-[200px] leading-relaxed">
                        Upgrade your plan to see {signal.timeframe} opportunities like this.
                    </p>
                    <Link to="/pricing" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/25 active:scale-95">
                        Unlock Now
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black border shadow-lg transition-colors
                        ${isLong ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}
                     `}>
                        {signal.token.substring(0, 3)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-bold text-white tracking-tight">{signal.token}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 font-mono">
                                {timeAgo(safeTimestamp)}
                            </span>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                            <span className={`text-[9px] font-bold px-1.5 rounded border uppercase tracking-wider ${['1m', '5m', '15m', '30m'].includes(signal.timeframe) ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                ['1h', '4h'].includes(signal.timeframe) ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                                    'border-purple-500/20 text-purple-400 bg-purple-500/5'
                                }`}>
                                {signal.timeframe}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            {new Date(safeTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`p-5 space-y-5 relative z-10 ${signal.locked ? 'opacity-0' : ''}`}>
                {/* Main Signal Direction - MASSIVE Typography */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isLong ?
                            <TrendingUp size={32} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" /> :
                            <TrendingDown size={32} className="text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                        }
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Direction</span>
                            <span className={`text-3xl font-black tracking-tighter ${isLong ? 'text-emerald-400 text-shadow-glow-emerald' : 'text-rose-400 text-shadow-glow-rose'}`}>
                                {signal.direction.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Entry</div>
                        <div className="text-xl font-bold text-white font-mono">{formatPrice(signal.entry)}</div>
                    </div>
                </div>

                {/* Targets Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Target (TP)</div>
                        <div className="font-mono text-emerald-400 font-bold text-sm tracking-tight drop-shadow-sm">
                            {formatPrice(signal.tp)}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Stop (SL)</div>
                        <div className="font-mono text-rose-400 font-bold text-sm tracking-tight drop-shadow-sm">
                            {formatPrice(signal.sl)}
                        </div>
                    </div>
                </div>

                {/* AI Confidence Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">AI Confidence</span>
                        <span className={`font-mono font-bold ${(signal.confidence || 0) >= 0.8 ? 'text-emerald-400' : (signal.confidence || 0) >= 0.5 ? 'text-yellow-400' : 'text-slate-400'}`}>
                            {Math.round((signal.confidence || 0) * 100)}%
                        </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out ${(signal.confidence || 0) >= 0.8 ? 'bg-emerald-500 text-emerald-500' :
                                (signal.confidence || 0) >= 0.5 ? 'bg-yellow-500 text-yellow-500' : 'bg-slate-500 text-slate-500'
                                }`}
                            style={{ width: `${Math.round((signal.confidence || 0) * 100)}%` }}
                        />
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-2 font-medium opacity-80">
                        {signal.rationale || "Technical anomaly detected matching high-probability fractal patterns."}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${isOpen
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : (isWin ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')
                        }`}>
                        {isOpen && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                        {isOpen ? 'Active' : signal.status}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={handleToggleFollow}
                            className={`p-2 rounded-lg border transition-all ${isFollowed
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                        >
                            {isFollowed ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                        <button
                            onClick={() => onAnalyze(signal)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/5 hover:border-white/20 hover:shadow-lg group/btn"
                        >
                            <Crosshair size={14} className="text-indigo-400 group-hover/btn:rotate-90 transition-transform duration-300" />
                            Analyze
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
