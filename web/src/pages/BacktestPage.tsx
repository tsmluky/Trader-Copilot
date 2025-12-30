import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, TrendingDown, Clock, Info, Save, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { API_BASE_URL } from '../constants';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThinkingOverlay } from '../components/ThinkingOverlay';

export const BacktestPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        token: 'SOL',
        timeframe: '1h',
        days: 30,
        strategy: 'rsi_divergence',
        capital: 1000
    });

    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState('');

    // Persona Modal State
    const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
    const [personaName, setPersonaName] = useState('');
    const [personaDesc, setPersonaDesc] = useState('');
    const navigate = useNavigate();

    const runBacktest = async () => {
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch(`${API_BASE_URL}/backtest/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategy_id: params.strategy,
                    token: params.token,
                    timeframe: params.timeframe,
                    days: Number(params.days),
                    initial_capital: Number(params.capital)
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }

            const data = await res.json();
            setResults(data);
            toast.success("Backtest simulation complete!");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error executing backtest");
            toast.error("Backtest failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePersona = async () => {
        if (!results) return;

        const toastId = toast.loading('Creating Agent...');
        try {
            await api.createPersona({
                name: personaName,
                description: personaDesc,
                symbol: params.token.toUpperCase(),
                timeframe: params.timeframe,
                strategy_id: params.strategy,
                risk_level: (results.metrics.max_drawdown || 0) < -10 ? "High" : "Medium",
                expected_roi: `${(results.metrics.roi_pct || 0).toFixed(0)}%`,
                win_rate: `${(results.metrics.win_rate || 0).toFixed(0)}%`,
                frequency: "Day Trader"
            });

            toast.success('Agent Launched!', { id: toastId });
            setIsPersonaModalOpen(false);
            navigate('/strategies');

        } catch (err: any) {
            toast.error('Failed to create agent: ' + err.message, { id: toastId });
        }
    };

    // ... (chartData logic)
    const chartData = results?.curve || [];

    // ... (CustomTooltip)
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#020617]/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-slate-400 text-xs mb-1 font-mono">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} style={{ color: p.color }} className="text-sm font-mono font-bold">
                            {p.name}: ${Number(p.value).toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative min-h-screen pb-20 animate-fade-in text-slate-100">
            {loading && <ThinkingOverlay />}

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
            </div>

            <div className="relative z-10 px-6 pt-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-brand-500/20 text-brand-300 bg-brand-500/10">BETA LABS</Badge>
                    </div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                        Strategy
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Simulator</span>
                    </h1>
                    <p className="text-slate-400 text-lg mt-2 max-w-2xl">
                        Validate algorithmic theses against historical market data before deploying capital.
                    </p>
                </div>

                {/* Controls */}
                <Card className="border-white/10 bg-[#0f172a]/40 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strategy Logic</label>
                                <Select value={params.strategy} onValueChange={(val) => setParams({ ...params, strategy: val })}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rsi_divergence">RSI Divergence AI</SelectItem>
                                        <SelectItem value="ma_cross">Trend MA Cross</SelectItem>
                                        <SelectItem value="bb_mean_reversion">Bollinger Mean Rev</SelectItem>
                                        <SelectItem value="donchian">Donchian Breakout</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</label>
                                <Select value={params.token} onValueChange={(val) => setParams({ ...params, token: val })}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'ADA'].map(t => (
                                            <SelectItem key={t} value={t}>{t} / USDT</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timeframe</label>
                                <Select value={params.timeframe} onValueChange={(val) => setParams({ ...params, timeframe: val })}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15m">15 Minutes (Scalp)</SelectItem>
                                        <SelectItem value="1h">1 Hour (Intraday)</SelectItem>
                                        <SelectItem value="4h">4 Hours (Swing)</SelectItem>
                                        <SelectItem value="1d">1 Day (Position)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">History Depth</label>
                                <Select value={String(params.days)} onValueChange={(val) => setParams({ ...params, days: Number(val) })}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 Days (Fast)</SelectItem>
                                        <SelectItem value="30">30 Days (Standard)</SelectItem>
                                        <SelectItem value="90">90 Days (Deep)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                size="lg"
                                onClick={runBacktest}
                                disabled={loading}
                                className="w-full font-bold text-md bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex gap-2"
                            >
                                {loading ? <RotateCcw className="animate-spin" size={18} /> : <Play size={18} />}
                                Run Simulation
                            </Button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-sm flex items-center gap-2">
                                <Info size={16} /> {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results View */}
                {results && results.metrics && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Summary Banner */}
                        <div className={`relative overflow-hidden p-6 rounded-2xl border ${results.metrics.total_pnl > results.metrics.buy_hold_pnl ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                            {/* Ambient glow inside card */}
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 ${results.metrics.total_pnl > results.metrics.buy_hold_pnl ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${results.metrics.total_pnl > results.metrics.buy_hold_pnl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {results.metrics.total_pnl > results.metrics.buy_hold_pnl ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl text-white mb-1">
                                            {results.metrics.total_pnl > results.metrics.buy_hold_pnl ? 'Strategy Alpha Generated' : 'Strategy Underperformed'}
                                        </h3>
                                        <p className="text-slate-400">
                                            Your strategy beat Buy & Hold by <span className={`font-mono font-bold ${results.metrics.total_pnl > results.metrics.buy_hold_pnl ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                ${(results.metrics.total_pnl - results.metrics.buy_hold_pnl).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Net Profit</div>
                                        <div className={`text-4xl font-black tracking-tight ${results.metrics.total_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {results.metrics.total_pnl >= 0 ? '+' : ''}{results.metrics.total_pnl} <span className="text-lg text-slate-500 font-medium">USD</span>
                                        </div>
                                    </div>

                                    {results.metrics.total_pnl > 0 && (
                                        <Button
                                            onClick={() => setIsPersonaModalOpen(true)}
                                            className="h-12 px-6 bg-[#0f172a] border border-white/10 hover:bg-white/5 hover:border-brand-500/50 text-white font-bold transition-all shadow-lg hidden md:flex"
                                        >
                                            <Save size={18} className="mr-2 text-brand-400" />
                                            Save Agent
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Win Rate', value: `${results.metrics.win_rate}%`, sub: `${results.metrics.total_trades} Trades` },
                                { label: 'Buy & Hold', value: `$${results.metrics.buy_hold_pnl}`, sub: 'Benchmark' },
                                { label: 'Best Trade', value: `+$${results.metrics.best_trade}`, sub: 'Single Win', color: 'text-emerald-400' },
                                { label: 'Max Drawdown', value: `${results.metrics.max_drawdown}%`, sub: 'Peak Risk', color: 'text-rose-400' },
                            ].map((stat, i) => (
                                <Card key={i} className="border-white/5 bg-[#0f172a]/40">
                                    <div className="p-4">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div>
                                        <div className={`text-2xl font-bold font-mono ${stat.color || 'text-white'}`}>{stat.value}</div>
                                        <div className="text-[10px] text-slate-600 mt-1 font-medium">{stat.sub}</div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Chart */}
                        <Card className="border-white/5 bg-[#0f172a]/60 backdrop-blur-sm p-6 h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="text-brand-400" size={20} /> Equity Curve
                                </h3>
                                <div className="flex gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                                        <span className="text-slate-300 font-bold">Strategy</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-slate-600"></span>
                                        <span className="text-slate-500">Buy & Hold</span>
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#475569"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={60}
                                        tickFormatter={(val) => {
                                            if (val.includes(' ')) return val.split(' ')[1].substring(0, 5); // Just time if intraday
                                            return val;
                                        }}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="strategy_equity"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorStrategy)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="buy_hold_equity"
                                        stroke="#475569"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Trades Table */}
                        <Card className="border-white/5 bg-[#0f172a]/40 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="font-bold text-white">Execution Log</h3>
                                <Badge variant="outline" className="border-white/10 text-slate-500">Last 50 Trades</Badge>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-white/5 text-slate-200">
                                        <tr>
                                            <th className="p-3 w-16">#</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3">Entry</th>
                                            <th className="p-3">Exit</th>
                                            <th className="p-3">Signal</th>
                                            <th className="p-3 text-right">PnL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[...results.trades].reverse().map((t: any) => (
                                            <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-3 font-mono text-xs text-slate-600">#{t.id}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${t.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-xs text-white">
                                                    ${t.entry}<br />
                                                    <span className="text-slate-600">{t.entry_time.split(' ')[1]}</span>
                                                </td>
                                                <td className="p-3 font-mono text-xs text-white">
                                                    ${t.exit}<br />
                                                    <span className="text-slate-600">{t.exit_time.split(' ')[1]}</span>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-slate-400 font-normal text-[10px]">
                                                        {t.reason}
                                                    </Badge>
                                                </td>
                                                <td className={`p-3 text-right font-mono font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {t.pnl >= 0 ? '+' : ''}{t.pnl}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Persona Modal */}
            {isPersonaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-white/10 bg-[#020617] shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">🧬</span> Create Agent
                            </CardTitle>
                            <CardDescription>Deploy this strategy as an autonomous agent.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Agent Name</label>
                                <Input
                                    value={personaName}
                                    onChange={(e) => setPersonaName(e.target.value)}
                                    placeholder="e.g. Solana Trend Hunter"
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea
                                    value={personaDesc}
                                    onChange={(e) => setPersonaDesc(e.target.value)}
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Strategy behavior..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">ROI Estimate</span>
                                    <span className="text-emerald-400 font-mono">+{results?.metrics?.roi_pct != null ? Number(results.metrics.roi_pct).toFixed(2) : '0.00'}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Win Rate</span>
                                    <span className="text-brand-400 font-mono">{results?.metrics?.win_rate != null ? Number(results.metrics.win_rate).toFixed(1) : '0.0'}%</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" className="flex-1" onClick={() => setIsPersonaModalOpen(false)}>Cancel</Button>
                                <Button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold" onClick={handleCreatePersona}>Launch 🚀</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default BacktestPage;
