import React from 'react';
import { ArrowRight, Terminal, Activity, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

            {/* Spotlight Effect - Deep Gold & Blue */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-900/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/5 rounded-full blur-[100px] -z-10" />

            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

                    {/* Status Pill - Premium Look */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-gold-500/20 mb-10 group cursor-default hover:border-gold-500/40 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.05)]">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                        </div>
                        <span className="text-xs font-mono font-medium text-gray-300 tracking-widest uppercase">
                            System Online <span className="text-white/10 mx-2">|</span> <span className="text-gold-400">DeepSeek</span> & <span className="text-indigo-400">Gemini</span> Engines
                        </span>
                        <ChevronRight className="w-3 h-3 text-gold-500/50 group-hover:text-gold-400 transition-colors" />
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                        <span className="text-white block drop-shadow-lg">The Quantitative</span>
                        <span className="text-gradient-gold block mt-2 drop-shadow-2xl">Analyst in Your Pocket</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
                        Stop guessing. Execute with professional-grade signals.
                        <br className="hidden md:block" />
                        Backtest strategies, verify performance, and <span className="text-white font-medium border-b border-gold-500/50">automate your edge</span>.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">

                        {/* Primary Button with Gold Shimmer */}
                        <Link to="/register" className="group relative w-full sm:w-auto px-8 py-4 bg-white text-background rounded-full font-bold transition-all shadow-[0_0_25px_rgba(251,191,36,0.15)] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 overflow-hidden flex items-center justify-center ring-1 ring-white/50">
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-gold-200/50 to-transparent z-10" />
                            <div className="relative z-20 flex items-center justify-center gap-3">
                                Launch Radar
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        <a href="#engine" className="w-full sm:w-auto px-8 py-4 glass text-white border border-white/5 hover:border-gold-500/30 rounded-full font-medium transition-all flex items-center justify-center gap-3 group hover:bg-white/5">
                            <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-gold-400 transition-colors" />
                            Watch Demo
                        </a>
                    </div>

                    {/* Metrics Grid - More Elegant */}
                    <div className="mt-24 w-full grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        {[
                            { label: 'Tickers Tracked', value: '200+', color: 'text-white' },
                            { label: 'Success Rate', value: '78.4%', color: 'text-gold-400' },
                            { label: 'Signal Latency', value: '< 60ms', color: 'text-brand-400' },
                            { label: 'Keys Stored', value: 'Zero', color: 'text-white' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-surface/40 p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className={`text-3xl font-bold ${stat.color} mb-2 font-mono tracking-tighter group-hover:scale-105 transition-transform relative z-10`}>{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold relative z-10">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
