import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Activity,
    Lock,
    Mail,
    User,
    ArrowRight,
    Loader2,
    TrendingUp,
    ShieldCheck,
    Zap,
    BarChart2,
    Cpu,
    CheckCircle2,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!name.trim()) return "Full Name is required.";
        if (!email.includes('@')) return "Please enter a valid email.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name);
            // On success, redirect to login with a query param or just simple redirect
            // You could also auto-login, but requirement says redirect to login.
            navigate('/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 overflow-x-hidden font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen opacity-40"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen opacity-30"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-4rem)] gap-12 lg:gap-24">

                {/* Left: Value Proposition (Hero) - Identical to Login for consistency */}
                <div className="hidden lg:block flex-1 space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Join the Institution
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        Unlock <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pro-Grade</span> <br />
                        Analytics.
                    </h1>

                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                        Create your TraderCopilot account to access real-time signals, AI-driven market analysis, and automated strategies.
                    </p>

                    <div className="pt-4 flex items-center gap-6 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span>Free Tier Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span>No Credit Card</span>
                        </div>
                    </div>
                </div>

                {/* Right: Register Card */}
                <div className="w-full max-w-md animate-fade-in-up delay-100 mx-auto">

                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>

                        <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-800/80 p-8 shadow-2xl">

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">New Account</h2>
                                    <p className="text-slate-400 text-xs mt-1">Start your journey today</p>
                                </div>
                                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/50">
                                    <User className="text-indigo-400" size={24} />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="John Trader"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="user@enterprise.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="Min. 8 characters"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
                                            placeholder="Repeat password"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium flex items-center gap-2">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-4 group/btn"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" /></>}
                                </button>

                                <div className="text-center pt-2">
                                    <Link to="/login" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                                        Already have an account? <span className="font-bold text-slate-300">Sign In</span>
                                    </Link>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>

            </div>

            {/* Footer / Status Bar */}
            <div className="fixed bottom-0 w-full border-t border-slate-800/50 bg-[#020617]/80 backdrop-blur-md py-2 px-6 flex justify-between items-center text-[10px] uppercase font-bold text-slate-600 tracking-wider z-20">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-default">
                        <ShieldCheck size={12} /> Encrypted Connection
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={12} /> System Status: <span className="text-emerald-500">Online</span>
                </div>
            </div>

        </div>
    );
};
