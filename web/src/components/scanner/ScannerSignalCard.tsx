import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, TrendingDown, Target, Zap, ArrowRight, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure this path is correct

export interface ScannerSignalCardProps {
    signal: any;
    onAnalyze: (signal: any) => void;
}

export function ScannerSignalCard({ signal, onAnalyze }: ScannerSignalCardProps) {
    const isLong = signal.direction?.toLowerCase() === 'long';
    const isWin = signal.result?.toUpperCase().includes('WIN');
    const isLoss = signal.result?.toUpperCase().includes('LOSS');

    // Determine status color
    const statusColor = isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400';
    const borderColor = isWin ? 'border-emerald-500/20' : isLoss ? 'border-rose-500/20' : 'border-white/10';
    const bgColor = isWin ? 'bg-emerald-500/5' : isLoss ? 'bg-rose-500/5' : 'bg-[#0f172a]/60';

    return (
        <div className={cn(
            "relative group overflow-hidden rounded-xl border border-white/10 transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10",
            bgColor
        )}>
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

            <div className="p-4 flex flex-col gap-3 relative z-10">
                {/* Header: Token & Time */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border bg-background/50 backdrop-blur-md",
                            isLong ? "border-emerald-500/30 text-emerald-400" : "border-rose-500/30 text-rose-400"
                        )}>
                            {signal.token}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-lg font-bold tracking-tight", isLong ? "text-emerald-400" : "text-rose-400")}>
                                    {signal.direction?.toUpperCase() || 'NEUTRAL'}
                                </span>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-white/10 text-slate-400">
                                    {signal.timeframe}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-0.5">
                                <Clock size={10} />
                                {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                    {/* Confidence or Score */}
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-300 flex items-center justify-end gap-1">
                            <Zap size={12} className="text-gold-400" fill="currentColor" />
                            {signal.confidence || 0}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">CONFIDENCE</div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 bg-black/20 rounded-lg px-2 mt-1">
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase">Entry</div>
                        <div className="text-xs font-mono font-bold text-slate-300">{signal.entry}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase">TP</div>
                        <div className="text-xs font-mono font-bold text-emerald-400">{signal.tp}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase">SL</div>
                        <div className="text-xs font-mono font-bold text-rose-400">{signal.sl}</div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", isWin ? "bg-emerald-500" : isLoss ? "bg-rose-500" : "bg-slate-600")}></span>
                        {signal.source?.replace('Marketplace:', '') || 'System'}
                    </span>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs hover:bg-white/5 hover:text-brand-400 gap-1 pr-1"
                        onClick={() => onAnalyze(signal)}
                    >
                        Analyze <ArrowRight size={12} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
