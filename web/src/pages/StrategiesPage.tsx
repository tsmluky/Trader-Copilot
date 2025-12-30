import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Play, TrendingUp, Zap, Shield, Activity, RefreshCw, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Persona {
    id: string;
    name: string;
    symbol: string;
    timeframe: string;
    description: string;
    risk_level: string;
    expected_roi: string;
    win_rate: string;
    frequency: string;
    color: string;
    is_active: boolean;
}

export const StrategiesPage: React.FC = () => {
    const navigate = useNavigate();
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPersonas = async () => {
        setLoading(true);
        try {
            const data = await api.fetchMarketplace();
            setPersonas(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load marketplace");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.togglePersona(id);
            toast.success("Strategy status updated");
            fetchPersonas(); // Refresh UI
        } catch (error) {
            console.error(error);
            toast.error("Failed to toggle strategy");
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    const getColorClass = (color: string) => {
        const map: any = {
            'amber': 'from-amber-500/20 to-orange-600/20 border-amber-500/50 text-amber-500',
            'cyan': 'from-cyan-500/20 to-blue-600/20 border-cyan-500/50 text-cyan-500',
            'slate': 'from-slate-500/20 to-gray-600/20 border-slate-500/50 text-slate-400',
            'indigo': 'from-indigo-500/20 to-violet-600/20 border-indigo-500/50 text-indigo-500',
        };
        return map[color] || map['slate'];
    };

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen">
            {/* Background Texture & Lighting (Identical to Landing) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid opacity-20" />

                {/* Landing Page Style Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 px-2">
                <div className="pl-6 relative">
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-brand-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight drop-shadow-sm">
                        Quant Strategies
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg max-w-2xl font-medium">
                        Deploy autonomous trading agents. Each model runs independently with distinct alpha profiles and risk parameters.
                    </p>
                </div>
                <button
                    onClick={fetchPersonas}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-brand-500/30 group shadow-lg active:scale-95"
                >
                    <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors ${loading ? 'animate-spin text-brand-400' : ''}`} />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 relative z-10">
                {personas.map((persona) => {
                    const theme = getColorClass(persona.color);
                    const activeClass = persona.is_active ? '' : 'opacity-60 grayscale-[0.5]';

                    return (
                        <div
                            key={persona.id}
                            className={`glass-card group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden ${activeClass}`}
                            onClick={() => navigate(`/strategies/${persona.id}`)}
                        >
                            {/* Top Highlight - "Glass Edge" */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Background Glow */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none bg-gradient-to-br ${theme.split(' ')[0]}`} />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className={`text-xl font-black text-white tracking-wide flex items-center gap-2 mb-2`}>
                                        {persona.name}
                                        {!persona.is_active && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700">PAUSED</span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/5 text-slate-300`}>
                                            {persona.symbol ? persona.symbol.replace(/[\[\]"']/g, '') : ''}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                                            {persona.timeframe ? persona.timeframe.replace(/[\[\]"']/g, '') : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleToggle(persona.id, e)}
                                        className={`p-2.5 rounded-xl transition-all shadow-lg ${persona.is_active
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white hover:bg-white/10'}`}
                                        title={persona.is_active ? "Pause Strategy" : "Resume Strategy"}
                                    >
                                        <Power className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-400 text-sm mb-6 h-10 line-clamp-2 relative z-10 leading-relaxed font-medium">
                                {persona.description}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex flex-col items-center justify-center group-hover:border-white/10 transition-colors">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">XP. ROI</span>
                                    <span className={`text-lg font-black ${theme.split(' ')[3]} drop-shadow-sm`}>{persona.expected_roi}</span>
                                </div>
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex flex-col items-center justify-center group-hover:border-white/10 transition-colors">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Win Rate</span>
                                    <span className="text-lg font-black text-white drop-shadow-sm">{persona.win_rate}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-white/5 to-white/10 border border-white/5 hover:border-brand-500/30 group-hover:from-brand-500/10 group-hover:to-indigo-500/10 transition-all flex items-center justify-center gap-2 relative z-10 shadow-lg`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/strategies/${persona.id}`);
                                }}
                            >
                                <span className={persona.is_active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white transition-colors'}>
                                    VIEW MODEL LOGIC
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl text-center max-w-2xl mx-auto relative z-10">
                <p className="text-xs text-slate-500">
                    Past performance is not indicative of future results. All strategies run autonomously based on technical validation.
                    Scalping strategies may be affected by market volatility and spread costs.
                </p>
            </div>
        </div>
    );
};
