import { X, Bot, Shield, Target } from 'lucide-react';
import { AdvisorChat } from '../AdvisorChat';
import { formatPrice, formatRelativeTime } from '../../utils/format';

interface TacticalAnalysisDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    signal: any;
}

export const TacticalAnalysisDrawer: React.FC<TacticalAnalysisDrawerProps> = ({ isOpen, onClose, signal }) => {
    if (!isOpen || !signal) return null;

    // Prep context for the advisor
    const analysisContext = {
        token: signal.token,
        direction: signal.direction.toLowerCase(),
        entry: signal.entry,
        tp: signal.tp || 0,
        sl: signal.sl || 0,
        timeframe: signal.timeframe,
        rogue_mode: true // Enable fun mode
    };

    return (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex justify-end pointer-events-none">
            {/* Backdrop - only clickable part is pointer-events-auto */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <div className="relative w-full max-w-md bg-[#020617]/90 backdrop-blur-2xl border-l border-white/10 h-full shadow-2xl shadow-indigo-500/20 animate-slide-in-right flex flex-col pointer-events-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                                <Bot size={18} />
                            </div>
                            Tactical Analysis
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 pl-1">
                            Deep-dive validation for <span className="text-white font-bold">{signal.token}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/5"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Signal Context Summary */}
                <div className="p-4 bg-black/20 border-b border-white/5 flex flex-col gap-3 text-xs">
                    {/* Key Levels Row - Glass Capsule */}
                    <div className="flex items-center justify-between text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Entry</span>
                            <span className="font-mono font-bold text-white text-sm">{formatPrice(signal.entry)}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold mb-0.5">Target</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">{formatPrice(signal.tp)}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase tracking-widest text-rose-400 font-bold mb-0.5">Stop</span>
                            <span className="font-mono font-bold text-rose-400 text-sm">{formatPrice(signal.sl)}</span>
                        </div>

                        {/* Rationale Snippet */}
                        {signal.rationale && (
                            <div className="text-slate-400 italic leading-relaxed px-1 text-[11px] border-l-2 border-indigo-500/30 pl-2">
                                "{signal.rationale}"
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                            <span>TF: {signal.timeframe}</span>
                            <span>{formatRelativeTime(signal.timestamp)}</span>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <AdvisorChat
                            initialContext={analysisContext}
                            embedded={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
