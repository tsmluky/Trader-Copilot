import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Zap, TrendingUp, TrendingDown, Radio, Radar } from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { toast } from 'react-hot-toast';
import { ScannerSignalCard } from '../components/scanner/ScannerSignalCard';
import { TacticalAnalysisDrawer } from '../components/scanner/TacticalAnalysisDrawer';

// Reusing StatusBadge logic inside cards

export const ScannerPage: React.FC = () => {
    const navigate = useNavigate();
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Tactical Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedSignal, setSelectedSignal] = useState<any>(null);

    const { userProfile } = useAuth(); // Auth Context for plan details

    const getDurationMs = (tf: string) => {
        if (tf.includes('m')) return parseInt(tf) * 60 * 1000;
        if (tf.includes('h')) return parseInt(tf) * 60 * 60 * 1000;
        if (tf.includes('d')) return parseInt(tf) * 24 * 60 * 60 * 1000;
        return 60 * 60 * 1000; // Default 1h
    };

    const fetchSignals = async () => {
        try {
            // Increased limit to avoid missing signals in active markets
            // Use api.get to ensure Authentication header is sent
            const rawSignalsResponse = await api.get('/logs/recent?limit=200');

            if (rawSignalsResponse) {
                let rawSignals = rawSignalsResponse;
                const userPlan = userProfile?.user.subscription_status || 'free';

                // --- MEMBERSHIP LOCKING LOGIC ---
                // Reuse plan variable if it was already defined or use local
                const plan = userPlan;

                rawSignals = rawSignals.map((s: any) => {
                    let locked = false;

                    if (plan === 'free') {
                        // Rookie: BTC, ETH, SOL only + 4h/Daily
                        const allowedTokens = ['BTC', 'ETH', 'SOL'];
                        const isAllowedToken = allowedTokens.includes(s.token.toUpperCase());
                        const isAllowedTf = s.timeframe.includes('4h') || s.timeframe.includes('1d');

                        if (!isAllowedToken || !isAllowedTf) {
                            locked = true;
                        }
                    } else if (plan === 'trader') {
                        // Trader: Lock scalping signals (1m, 5m)
                        if (['1m', '5m'].includes(s.timeframe)) {
                            locked = true;
                        }
                    }
                    return { ...s, locked };
                })
                    .filter((s: any) => {
                        // Filter out manual analysis (LITE) - Show only Marketplace Strategies
                        // Only signals with source starting with "Marketplace:" or explicit strategies
                        return s.source && s.source.startsWith("Marketplace:");
                    });

                // Deduplicate & Filter
                const uniqueMap = new Map();
                const now = Date.now();

                rawSignals.forEach((sig: any) => {
                    // 1. Freshness Check (Relaxed to 12h or 4x duration to prevent timezone persistence issues)
                    const sigTime = new Date(sig.timestamp).getTime();
                    const age = now - sigTime;
                    const duration = getDurationMs(sig.timeframe || '1h');

                    // Allow signals up to 24h old in the list, but mark them as stale visually if needed
                    // (Scanner is "Live", but we don't want them to disappear instantly if clock drifts)
                    if (age > Math.max(duration * 4, 24 * 60 * 60 * 1000)) return;

                    // 2. Uniqueness Check
                    const key = `${sig.token}-${sig.timeframe}`;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, sig);
                    }
                });

                setSignals(Array.from(uniqueMap.values()));
            }
        } catch (error) {
            console.error("Error fetching signals:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSignals();
        const interval = setInterval(fetchSignals, 15000); // 15s refresh
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        const toastId = toast.loading("Scanning markets..."); // Import toast required

        // Force-scan top assets
        const watchlist = ['BTC', 'ETH', 'SOL', 'DOT'];
        let successCount = 0;

        try {
            // Trigger scans sequentially
            for (const token of watchlist) {
                try {
                    // Fire both timeframes
                    await api.analyzeLite(token, '15m');
                    await api.analyzeLite(token, '1h');
                    successCount++;
                } catch (innerErr) {
                    console.warn(`Scan failed for ${token}`, innerErr);
                }
            }
            if (successCount > 0) {
                toast.success(`Scan complete. Updated ${successCount} assets.`, { id: toastId });
            } else {
                toast.error("Scan failed. Check connection or quota.", { id: toastId });
            }
        } catch (e) {
            console.error("Scan trigger failed", e);
            toast.error("System Error during scan", { id: toastId });
        }
        await fetchSignals();
    };

    const handleAnalyze = (signal: any) => {
        setSelectedSignal(signal);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6 pb-12 relative animate-fade-in">
            {/* Background Texture & Lighting (Identical to Landing) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid opacity-20" />

                {/* Landing Page Style Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
            </div>

            {/* Header / Control Tower */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 px-2">
                <div>
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-brand-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 pl-6 tracking-tight drop-shadow-lg">
                        Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Radar</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 pl-6 flex items-center gap-3 font-medium">
                        Real-time anomaly detection stream.
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            System Live
                        </span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className={`p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-brand-500/30 transition-all active:scale-95 shadow-lg group`}
                    >
                        <RefreshCw size={20} className={`group-hover:text-brand-400 transition-colors ${refreshing ? 'animate-spin text-brand-400' : ''}`} />
                    </button>
                    {/* Launch Manual Analysis Button - Moved here for better UX */}
                    <button
                        onClick={() => navigate('/analysis')}
                        className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Zap size={18} className="fill-white/20" />
                        Smart Analysis
                    </button>
                </div>
            </div>

            {/* Radar Feed - Grid Layout */}
            {loading ? (
                <div className="flex items-center justify-center p-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            ) : signals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <Radar className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-300 mb-2">System Scanning...</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        No high-probability anomalies detected in the active timeframe. The autonomous fleet is filtering for quality over quantity.
                    </p>
                    <button
                        onClick={() => navigate('/analysis')}
                        className="px-6 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-all font-semibold text-sm flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Launch Manual Analysis
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {signals.map((signal) => (
                        <ScannerSignalCard
                            key={signal.id}
                            signal={signal}
                            onAnalyze={handleAnalyze}
                        />
                    ))}
                </div>
            )}

            {/* Tactical Drawer */}
            <TacticalAnalysisDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                signal={selectedSignal}
            />
        </div>
    );
};
