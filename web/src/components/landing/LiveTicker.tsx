import React from 'react';
import { TrendingUp, TrendingDown, Clock, Zap, Activity } from 'lucide-react';

const signals = [
    { pair: 'BTC/USDT', type: 'LONG', price: '94,230.50', time: '1m ago', result: '+1.2R', status: 'active' },
    { pair: 'ETH/USDT', type: 'SHORT', price: '3,120.10', time: '5m ago', result: 'OPEN', status: 'pending' },
    { pair: 'SOL/USDT', type: 'LONG', price: '210.45', time: '12m ago', result: '+2.4R', status: 'win' },
    { pair: 'AVAX/USDT', type: 'LONG', price: '45.20', time: '15m ago', result: '-0.5R', status: 'loss' },
    { pair: 'DOGE/USDT', type: 'SHORT', price: '0.1840', time: '22m ago', result: '+1.1R', status: 'win' },
    { pair: 'XRP/USDT', type: 'LONG', price: '1.8200', time: '28m ago', result: 'OPEN', status: 'pending' },
    { pair: 'LINK/USDT', type: 'LONG', price: '18.50', time: '32m ago', result: '+3.0R', status: 'win' },
];

export const LiveTicker: React.FC = () => {
    return (
        <div className="w-full bg-[#050914] border-y border-white/5 py-4 overflow-hidden relative z-30">
            <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur opacity-40 animate-pulse"></div>
                        <Activity className="w-4 h-4 text-emerald-400 relative z-10" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Live Signal Feed</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    <span>Source: Binance</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>Scan: 1h TF</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="text-brand-400">Latency: 45ms</span>
                </div>
            </div>

            <div className="relative flex overflow-x-hidden mask-fade-sides">
                {/* CSS Mask to fade edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050914] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050914] to-transparent z-10"></div>

                <div className="animate-scroll flex gap-4 whitespace-nowrap py-1">
                    {/* Duplicated list for infinite scroll */}
                    {[...signals, ...signals, ...signals].map((signal, idx) => (
                        <div
                            key={`${signal.pair}-${idx}`}
                            className="group inline-flex items-center gap-5 bg-white/[0.02] border border-white/5 rounded-sm px-5 py-3 min-w-[280px] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default"
                        >
                            <div className={`p-2 rounded-full ${signal.type === 'LONG' ? 'bg-emerald-500/5 text-emerald-400' : 'bg-red-500/5 text-red-400'}`}>
                                {signal.type === 'LONG' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-200 text-sm tracking-tight">{signal.pair}</span>
                                    <span className={`text-[9px] px-1.5 py-px rounded-sm font-mono uppercase tracking-wide ${signal.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {signal.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-mono tracking-tighter">${signal.price}</span>
                                    <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                                        {signal.time}
                                    </span>
                                </div>
                            </div>

                            <div className="ml-auto flex flex-col items-end gap-1">
                                {signal.status === 'win' && <span className="text-emerald-400 font-mono text-xs font-bold tracking-tight">WIN {signal.result}</span>}
                                {signal.status === 'loss' && <span className="text-red-400 font-mono text-xs font-bold tracking-tight">STOPPED</span>}
                                {signal.status === 'pending' && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
                                        <span className="text-brand-400 font-mono text-[10px] font-bold tracking-wider">ACTIVE</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
