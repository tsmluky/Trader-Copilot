import React from 'react';
import { Zap, Brain, Activity, ArrowUpRight, Cpu, Play, BarChart3, Settings } from 'lucide-react';

export const Features: React.FC = () => {
    return (
        <section id="engine" className="py-32 bg-background relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                <div className="mb-20 max-w-3xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-[1px] bg-gold-500"></span>
                        <span className="text-gold-500 font-mono text-xs tracking-widest uppercase">The Core Architecture</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Three Engines. <br /><span className="text-gradient-brand">One Intelligent Copilot.</span></h2>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                        From millisecond technical scans to deep generative analysis. Select your engine, verify performance, and automate execution.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">

                    {/* Card 1: LITE (Large, spans 2 cols) */}
                    <div className="md:col-span-2 glass-card rounded-3xl p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <Zap className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">LITE Scanner</h3>
                                <p className="text-gray-400 text-lg max-w-md">
                                    Instant technical analysis based on RSI, MACD, and EMA crossovers. Zero hallucination, purely math-based signals for high-frequency scalping.
                                </p>
                            </div>

                            <div className="flex items-center gap-6 mt-8">
                                <div className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-sm font-mono text-emerald-400 backdrop-blur-md">
                                    GET /analyze/lite
                                </div>
                                <div className="text-sm text-gray-500 font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Latency: 120ms
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: QUANT (Tall - FOCUS ON BACKTESTING) */}
                    <div className="md:row-span-1 glass-card rounded-3xl p-8 relative overflow-hidden group border-white/5 hover:border-gold-500/30">
                        {/* Gradient for "Golden" feel */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                    <Activity className="w-6 h-6 text-gold-400" />
                                </div>
                                <div className="px-2 py-1 bg-gold-500/10 border border-gold-500/20 rounded text-[10px] font-bold text-gold-400 uppercase tracking-wide">
                                    New Feature
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">Backtest Lab</h3>
                            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                Don't trust blindly. Select a strategy, simulate it on months of historical data, and verify the win-rate.
                            </p>

                            {/* Workflow Visual */}
                            <div className="mt-auto space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">1</div>
                                    <span>Select Algorithm</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white">
                                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/40 text-gold-400"><BarChart3 size={12} /></div>
                                    <span className="font-medium">Run Backtest (Approx 12s)</span>
                                </div>
                                <div className="ml-9 p-3 rounded bg-black/30 border border-white/5 mb-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Net Profit</span>
                                        <span className="text-emerald-400 font-mono">+32.4%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Win Rate</span>
                                        <span className="text-gold-400 font-mono">68%</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 group-hover:text-white transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30"><Play size={10} /></div>
                                    <span>Deploy to Live Monitor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: PRO (Spans all 3 cols) */}
                    <div className="md:col-span-3 glass-card rounded-3xl p-10 relative overflow-hidden group border-brand-500/20 hover:border-brand-500/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.1)]">
                        <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors duration-500"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                                    Flagship Engine
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">PRO Intelligence</h3>
                                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                    Injects real-time market data into DeepSeek Coder V2 & Gemini 1.5 Flash.
                                    Generates comprehensive strategic narrative reports with confidence scores, identifying macro trends often missed by technical indicators.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-white/5 transition-colors">
                                        <Brain className="w-5 h-5 text-brand-400" />
                                        <div className="text-sm">
                                            <div className="text-white font-semibold">DeepSeek V2</div>
                                            <div className="text-gray-500 text-xs">Primary Reasoning</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-white/5 transition-colors">
                                        <Cpu className="w-5 h-5 text-accent-500" />
                                        <div className="text-sm">
                                            <div className="text-white font-semibold">Gemini Flash</div>
                                            <div className="text-gray-500 text-xs">Fast Fallback</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Code Visual */}
                            <div className="flex-1 w-full max-w-lg bg-[#0d1117] rounded-xl border border-white/10 p-4 font-mono text-xs text-gray-400 shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                                <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="text-purple-400">const</span> <span className="text-blue-400">analysis</span> = <span className="text-purple-400">await</span> ai.<span className="text-yellow-400">generate</span>({`{`}</p>
                                    <p className="pl-4"><span className="text-blue-400">context</span>: <span className="text-green-400">"market_structure"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-400">indicators</span>: [<span className="text-green-400">"RSI"</span>, <span className="text-green-400">"OBV"</span>],</p>
                                    <p className="pl-4"><span className="text-blue-400">sentiment</span>: <span className="text-orange-400">0.85</span></p>
                                    <p>{'});'}</p>
                                    <p className="text-gray-500 mt-2">// Output: Bullish Divergence on 4h timeframe detected by DeepSeek.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
