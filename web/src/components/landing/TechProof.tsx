import React, { useState } from 'react';
import { Code, CheckCircle, Database, Server, Lock, Terminal, Copy } from 'lucide-react';

export const TechProof: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'response' | 'evaluator'>('response');

    return (
        <section id="proof" className="py-32 bg-[#050914] border-t border-white/5 relative overflow-hidden">
            {/* Background Decor - Subtle Glows */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand-900/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Column: Text */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-brand-400 border border-brand-500/20 mb-8 backdrop-blur-sm">
                            <Terminal className="w-3 h-3" />
                            <span className="text-xs font-bold tracking-widest uppercase">Open Architecture</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">
                            Verified by Code. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Backed by Math.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-12 leading-relaxed font-light">
                            We don't hide behind buzzwords. TraderCopilot is built on a transparent Python backend connecting directly to Binance via CCXT.
                            Our evaluation engine is impartial and runs on a rigid 5-minute heartbeat.
                        </p>

                        <div className="space-y-6">
                            <div className="glass-card p-5 rounded-2xl flex gap-5 group hover:bg-white/5 transition-colors">
                                <div className="mt-1 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                                    <Database className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base mb-1">Real-Time Aggregation</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">Primary connection via CCXT (Binance) with intelligent fallbacks. 60s TTL Caching.</p>
                                </div>
                            </div>

                            <div className="glass-card p-5 rounded-2xl flex gap-5 group hover:bg-white/5 transition-colors">
                                <div className="mt-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Lock className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base mb-1">Non-Custodial Architecture</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">No <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white mx-1 font-mono">POST /order</code> endpoints. Your API keys are never required.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Code Window */}
                    <div className="order-1 lg:order-2 relative group w-full max-w-2xl mx-auto lg:mx-0">
                        {/* Dynamic Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-700"></div>

                        <div className="relative bg-[#090e1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 w-full">

                            {/* Window Header */}
                            <div className="bg-[#0f1629] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="flex gap-2 items-center text-xs text-gray-500 font-mono">
                                    <Lock className="w-3 h-3" />
                                    <span>tradercopilot-core</span>
                                </div>
                            </div>

                            {/* Tab Bar */}
                            <div className="flex border-b border-white/5 bg-[#0b1121]">
                                <button
                                    onClick={() => setActiveTab('response')}
                                    className={`px-4 py-2 text-xs font-mono border-r border-white/5 transition-colors ${activeTab === 'response' ? 'text-brand-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    api_response.json
                                </button>
                                <button
                                    onClick={() => setActiveTab('evaluator')}
                                    className={`px-4 py-2 text-xs font-mono border-r border-white/5 transition-colors ${activeTab === 'evaluator' ? 'text-purple-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    evaluator.py
                                </button>
                            </div>

                            {/* Code Content */}
                            <div className="relative group/code">
                                <div className="absolute top-4 right-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* The max-h-[500px] ensures it doesn't get too tall on mobile, overflow-auto handles scroll */}
                                <div className="p-6 overflow-auto max-h-[500px] code-scroll bg-[#090e1a]">
                                    {activeTab === 'response' ? (
                                        <pre className="text-[13px] md:text-sm font-mono leading-relaxed text-slate-300">
                                            <span className="text-gray-600 select-none mr-3">01</span><span className="text-purple-400 font-bold">POST</span> <span className="text-gray-400">/analyze/pro</span>
                                            <span className="text-gray-600 select-none mr-3">02</span>
                                            <span className="text-gray-600 select-none mr-3">03</span><span className="text-gray-500 italic">// 200 OK - 148ms latency</span>
                                            <span className="text-gray-600 select-none mr-3">04</span>{`{`}
                                            <span className="text-gray-600 select-none mr-3">05</span>  <span className="text-brand-400">"ticker"</span>: <span className="text-green-400">"SOL/USDT"</span>,
                                            <span className="text-gray-600 select-none mr-3">06</span>  <span className="text-brand-400">"price"</span>: <span className="text-orange-300">210.45</span>,
                                            <span className="text-gray-600 select-none mr-3">07</span>  <span className="text-brand-400">"signal"</span>: <span className="text-green-400 font-bold">"LONG"</span>,
                                            <span className="text-gray-600 select-none mr-3">08</span>
                                            <span className="text-gray-600 select-none mr-3">09</span>  <span className="text-brand-400">"ai_analysis"</span>: {`{`}
                                            <span className="text-gray-600 select-none mr-3">10</span>    <span className="text-brand-400">"model"</span>: <span className="text-green-400">"deepseek-coder-v2"</span>,
                                            <span className="text-gray-600 select-none mr-3">11</span>    <span className="text-brand-400">"confidence"</span>: <span className="text-orange-300">87.5</span>,
                                            <span className="text-gray-600 select-none mr-3">12</span>    <span className="text-brand-400">"summary"</span>: <span className="text-gray-400">"Smart Money</span>
                                            <span className="text-gray-600 select-none mr-3">13</span>    <span className="text-gray-400">accumulation detected at $208</span>
                                            <span className="text-gray-600 select-none mr-3">14</span>    <span className="text-gray-400">support. Volume profile suggests</span>
                                            <span className="text-gray-600 select-none mr-3">15</span>    <span className="text-gray-400">breakout imminent..."</span>
                                            <span className="text-gray-600 select-none mr-3">16</span>  {`}`},
                                            <span className="text-gray-600 select-none mr-3">17</span>
                                            <span className="text-gray-600 select-none mr-3">18</span>  <span className="text-brand-400">"levels"</span>: {`{`}
                                            <span className="text-gray-600 select-none mr-3">19</span>    <span className="text-brand-400">"entry"</span>: <span className="text-orange-300">210.50</span>,
                                            <span className="text-gray-600 select-none mr-3">20</span>    <span className="text-brand-400">"tp"</span>: <span className="text-orange-300">225.00</span>,
                                            <span className="text-gray-600 select-none mr-3">21</span>    <span className="text-brand-400">"sl"</span>: <span className="text-orange-300">202.00</span>
                                            <span className="text-gray-600 select-none mr-3">22</span>  {`}`}
                                            <span className="text-gray-600 select-none mr-3">23</span>{`}`}
                                        </pre>
                                    ) : (
                                        <pre className="text-[13px] md:text-sm font-mono leading-relaxed text-slate-300">
                                            <span className="text-gray-600 select-none mr-3">01</span><span className="text-purple-400">class</span> <span className="text-yellow-200">SignalEvaluator</span>:
                                            <span className="text-gray-600 select-none mr-3">02</span>  <span className="text-gray-500">"""</span>
                                            <span className="text-gray-600 select-none mr-3">03</span>  <span className="text-gray-500">Impartial judge running every 5 min.</span>
                                            <span className="text-gray-600 select-none mr-3">04</span>  <span className="text-gray-500">Uses PostgreSQL for persistence.</span>
                                            <span className="text-gray-600 select-none mr-3">05</span>  <span className="text-gray-500">"""</span>
                                            <span className="text-gray-600 select-none mr-3">06</span>
                                            <span className="text-gray-600 select-none mr-3">07</span>  <span className="text-purple-400">def</span> <span className="text-blue-400">judge_signal</span>(self, signal, price):
                                            <span className="text-gray-600 select-none mr-3">08</span>
                                            <span className="text-gray-600 select-none mr-3">09</span>      <span className="text-gray-600"># 1. Check Take Profit</span>
                                            <span className="text-gray-600 select-none mr-3">10</span>      <span className="text-purple-400">if</span> price {'>='} signal.tp:
                                            <span className="text-gray-600 select-none mr-3">11</span>          self.db.update(status=<span className="text-green-400">"WIN"</span>)
                                            <span className="text-gray-600 select-none mr-3">12</span>          <span className="text-purple-400">return</span> <span className="text-green-400">"WIN"</span>
                                            <span className="text-gray-600 select-none mr-3">13</span>
                                            <span className="text-gray-600 select-none mr-3">14</span>      <span className="text-gray-600"># 2. Check Stop Loss</span>
                                            <span className="text-gray-600 select-none mr-3">15</span>      <span className="text-purple-400">elif</span> price {'<='} signal.sl:
                                            <span className="text-gray-600 select-none mr-3">16</span>          self.db.update(status=<span className="text-red-400">"LOSS"</span>)
                                            <span className="text-gray-600 select-none mr-3">17</span>          <span className="text-purple-400">return</span> <span className="text-red-400">"LOSS"</span>
                                            <span className="text-gray-600 select-none mr-3">18</span>
                                            <span className="text-gray-600 select-none mr-3">19</span>      <span className="text-gray-600"># 3. Check Timeout (24h)</span>
                                            <span className="text-gray-600 select-none mr-3">20</span>      <span className="text-purple-400">elif</span> signal.age {'>'} hours(24):
                                            <span className="text-gray-600 select-none mr-3">21</span>          <span className="text-purple-400">return</span> <span className="text-orange-300">"TIMEOUT"</span>
                                            <span className="text-gray-600 select-none mr-3">22</span>
                                            <span className="text-gray-600 select-none mr-3">23</span>      <span className="text-purple-400">return</span> <span className="text-blue-400">"OPEN"</span>
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
