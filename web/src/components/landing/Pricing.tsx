import React from 'react';
import { Check, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-[#0f172a] to-transparent -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Execution <span className="text-brand-400">Plans</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                        Transparent pricing. Professional tooling. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">

                    {/* FREE PLAN */}
                    <div className="glass-card p-10 rounded-3xl border-t border-white/10 hover:border-white/20 transition-all group">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Starter</h3>
                        <div className="text-4xl font-bold mb-6 text-white font-mono">$0<span className="text-base font-normal text-gray-500">/mo</span></div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-emerald-500" /> 2 AI Analyses / day</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-emerald-500" /> BTC, ETH, SOL Only</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-emerald-500" /> 15m Delayed Data</li>
                            <li className="flex items-center gap-3 text-sm text-gray-500"><Shield className="w-4 h-4 text-gray-600" /> Basic Support</li>
                        </ul>

                        <Link to="/register" className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm uppercase tracking-wide block text-center">
                            Start Free
                        </Link>
                    </div>

                    {/* TRADER PLAN - Highlighted Gold/Premium */}
                    <div className="relative transform md:-translate-y-4">
                        {/* Glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-gold-500 to-orange-600 rounded-[26px] blur opacity-30"></div>

                        <div className="relative glass-card bg-[#0f172a] p-10 rounded-3xl border border-gold-500/30">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-gold-500/10 text-gold-400 border border-gold-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <Zap size={10} fill="currentColor" /> Most Popular
                                </span>
                            </div>

                            <h3 className="text-lg font-medium text-gold-400 mb-2">Trader</h3>
                            <div className="text-5xl font-bold mb-6 text-white font-mono tracking-tight">$29<span className="text-base font-normal text-gray-500">/mo</span></div>
                            <p className="text-gray-400 text-sm mb-8 font-light">The standard for active daily traders.</p>

                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="w-4 h-4 text-gold-400" /> 10 AI Analyses / day</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="w-4 h-4 text-gold-400" /> <span className="text-gold-200">Unlimited Backtesting</span></li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="w-4 h-4 text-gold-400" /> Top 25 Assets (XRP, ADA...)</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="w-4 h-4 text-gold-400" /> Real-time Data Feed</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="w-4 h-4 text-gold-400" /> Telegram Alerts Bot</li>
                            </ul>

                            <Link to="/register" className="w-full py-4 rounded-xl bg-gradient-to-r from-white to-gray-200 text-background font-bold hover:to-white transition-all shadow-lg shadow-gold-900/20 text-sm uppercase tracking-wide block text-center">
                                Get Trader Access
                            </Link>
                        </div>
                    </div>

                    {/* PRO PLAN */}
                    <div className="glass-card p-10 rounded-3xl border-t border-purple-500/50 hover:border-purple-500 transition-all group">
                        <h3 className="text-lg font-medium text-purple-400 mb-2">Professional</h3>
                        <div className="text-4xl font-bold mb-6 text-white font-mono">$99<span className="text-base font-normal text-gray-500">/mo</span></div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> 200 AI Analyses / day</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> All 200+ Tickers (AI, DeFi)</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> Priority Gemini Flash</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-purple-500" /> API Access</li>
                        </ul>

                        <Link to="/register" className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm uppercase tracking-wide block text-center">
                            Contact Sales
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};
