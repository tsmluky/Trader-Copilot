import React from 'react';
import { formatPrice } from '../utils/format';
import { useAuth } from '../context/AuthContext'; // Import context
import { ShareMenu } from './common/ShareMenu';
import { Zap } from 'lucide-react'; // Added Zap

export interface SignalHistory {
    id: string;
    timestamp: string;
    token: string;
    direction: string;
    entry: number;
    tp: number;
    sl: number;
    mode?: string;
    confidence?: number;
    rationale?: string;
    // Optional flat fields from Dashboard LogEntry
    status?: string;
    pnl?: number;
    closed_at?: string;
    exit_price?: number;
    result?: {
        result: string;
        pnl_r: number;
        exit_price: number;
        closed_at: string;
    } | null;
}

interface SignalDetailsModalProps {
    signal: SignalHistory;
    onClose: () => void;
}

export const SignalDetailsModal: React.FC<SignalDetailsModalProps> = ({ signal, onClose }) => {
    const { userProfile } = useAuth(); // Hook
    const userTimezone = userProfile?.user?.timezone;

    if (!signal) return null;

    // Normalize Data (Handle both StrategyDetails nested 'result' and Dashboard flat 'status/pnl')
    const resultStatus = signal.result?.result || signal.status;
    const resultPnL = signal.result?.pnl_r ?? signal.pnl; // Use nullish coalescing for 0 PnL
    const resultClosedAt = signal.result?.closed_at || signal.closed_at;
    // Prefer nested result exit_price, then flat exit_price
    const resultExitPrice = signal.result?.exit_price ?? signal.exit_price;

    // Determine Win/Loss
    const isWin = (resultStatus?.toUpperCase().includes('WIN') || resultStatus?.includes('TP')) || (resultPnL !== undefined && resultPnL > 0);
    const isLoss = (resultStatus?.toUpperCase().includes('LOSS') || resultStatus?.includes('SL')) || (resultPnL !== undefined && resultPnL <= 0);

    const isLong = signal.direction.toUpperCase() === 'LONG';

    // Construct Share Text
    const shareText = `🚨 *SIGNAL ALERT: ${signal.token}*
${isLong ? '🟢 LONG' : '🔴 SHORT'} @ ${formatPrice(signal.entry)}
    
🎯 *TP:* ${formatPrice(signal.tp)}
🛑 *SL:* ${formatPrice(signal.sl)}
    
${signal.rationale ? `💡 _${signal.rationale.substring(0, 150)}${signal.rationale.length > 150 ? '...' : ''}_` : ''}

🚀 Verified by TraderCopilot`;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-black text-white">{signal.token}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${isLong
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {signal.direction.toUpperCase()}
                            </span>
                            {signal.mode === 'BACKTEST' && (
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700">
                                    BACKTEST
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-xs font-mono">
                            {new Date(signal.timestamp.endsWith('Z') ? signal.timestamp : `${signal.timestamp}Z`).toLocaleString(undefined, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                                timeZone: userTimezone
                            })}
                        </p>
                    </div>

                    {/* Right Side: Confidence & Actions */}
                    <div className="flex flex-col items-end gap-2">
                        {signal.confidence && (
                            <div className="flex items-center gap-1.5 mb-1">
                                <Zap size={14} className="text-brand-400 fill-brand-400 animate-pulse" />
                                <span className="text-xl font-black text-white tracking-tighter">
                                    {(signal.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <ShareMenu
                                title={`${signal.token} Signal`}
                                text={shareText}
                            />
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <span className="text-xs text-slate-500 block mb-1">Entry Price</span>
                        <span className="text-white font-mono font-bold">{formatPrice(signal.entry)}</span>
                    </div>
                    <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <span className="text-xs text-rose-500/80 block mb-1">Stop Loss</span>
                        <span className="text-rose-400 font-mono font-bold">{formatPrice(signal.sl)}</span>
                    </div>
                    <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <span className="text-xs text-emerald-500/80 block mb-1">Take Profit</span>
                        <span className="text-emerald-400 font-mono font-bold">{formatPrice(signal.tp)}</span>
                    </div>
                </div>

                {/* Result Section */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Outcome</h4>
                    {(resultStatus && resultStatus !== 'OPEN') ? (
                        <div className={`p-4 rounded-xl border ${isWin
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-rose-500/5 border-rose-500/20'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-lg font-black ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {resultStatus.toUpperCase()}
                                </span>
                                <span className={`text-xl font-black ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {resultPnL && resultPnL > 0 ? '+' : ''}{resultPnL}R
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-mono">
                                <span>Exit Price: {resultExitPrice ? formatPrice(resultExitPrice) : (isLoss ? formatPrice(signal.sl) : formatPrice(signal.tp))}</span>
                                <span>Duration: {(() => {
                                    if (!resultClosedAt) {
                                        // Fallback: If no closed_at but result exists (Legacy/Backtest), use a fixed fallback or just hide it
                                        if (signal.mode === 'BACKTEST') return "1 Candle (Est.)";
                                        // If it's real but missing closed_at, it might be an error, but let's show "Processed"
                                        return "Processed";
                                    }

                                    const start = new Date(signal.timestamp).getTime();
                                    const closed = new Date(resultClosedAt);
                                    const end = closed.getTime();
                                    const diff = end - start;

                                    if (diff < 60000) return "< 1m";

                                    const h = Math.floor(diff / 3600000);
                                    const m = Math.floor((diff % 3600000) / 60000);
                                    const s = Math.floor((diff % 60000) / 1000);

                                    if (h > 0) return `${h}h ${m}m ${s}s`;
                                    if (m > 0) return `${m}m ${s}s`;
                                    return `${s}s`;
                                })()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700 text-center">
                            <span className="text-slate-400 italic text-sm">Signal is currently active or pending evaluation.</span>
                        </div>
                    )}
                </div>


                {/* Rationale Section */}
                {signal.rationale && (
                    <div className="mt-8 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Strategy Rationale</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                            {signal.rationale.length > 200 ? signal.rationale.substring(0, 200) + '...' : signal.rationale}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
