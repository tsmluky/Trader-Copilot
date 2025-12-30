
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export const PricingPage: React.FC = () => {
    const { userProfile, upgradeSubscription } = useAuth();
    const normalizedPlan = (userProfile?.user.subscription_status || 'free').toLowerCase();
    const [processing, setProcessing] = useState<string | null>(null);

    const handleUpgrade = async (planId: string) => {
        if (normalizedPlan === planId) return;

        setProcessing(planId);
        const targetPlan = planId as 'free' | 'trader' | 'pro';

        try {
            await upgradeSubscription(targetPlan);
            toast.success(`Successfully switched to ${planId.toUpperCase()} plan`);
        } catch (error) {
            console.error("Upgrade failed:", error);
            toast.error("Failed to update subscription");
        } finally {
            setProcessing(null);
        }
    };

    const isPlanActive = (planId: string) => normalizedPlan === planId;

    const plans = [
        {
            id: 'free',
            name: 'Explorer',
            price: '$0',
            period: 'forever',
            description: 'Perfect for checking the market occasionally.',
            features: [
                { text: 'Signals: BTC, ETH, SOL Only', included: true },
                { text: '15-minute Delayed Data', included: true, warning: true },
                { text: 'Analyst AI (Read-Only)', included: true },
                { text: 'Timeframes: 4h, Daily', included: true },
                { text: 'Real-time Alerts', included: false },
                { text: 'Advisor Chat', included: false },
                { text: 'Custom Strategies', included: false },
            ],
            cta: 'Downgrade',
        },
        {
            id: 'trader',
            name: 'Trader',
            price: '$20',
            period: '/ month',
            description: 'For active traders who need speed and coverage.',
            highlight: true,
            features: [
                { text: 'Real-Time Signals (Zero Latency)', included: true, highlight: true },
                { text: 'All 150+ Tokens (Alts & Memes)', included: true },
                { text: 'Instant Telegram Alerts', included: true },
                { text: 'All Timeframes (15m+)', included: true },
                { text: 'Analyst AI (20 evals/day)', included: true },
                { text: 'Advisor Chat', included: false },
                { text: 'Custom Strategies', included: false },
            ],
            cta: 'Upgrade to Trader',
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$50',
            period: '/ month',
            description: 'For serious algorithmic traders and automation.',
            features: [
                { text: 'Everything in Trader', included: true },
                { text: 'Unlimited AI Advisor Chat', included: true, highlight: true },
                { text: 'Create Custom Strategies (Lab)', included: true },
                { text: 'Hunter Mode (1m/5m Scalping)', included: true },
                { text: 'Priority Dev Support', included: true },
                { text: 'Multi-Exchange Connection', included: true },
                { text: 'API Access', included: true },
            ],
            cta: 'Upgrade to Pro',
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8 animate-fade-in relative min-h-screen">
            {/* Background Texture & Lighting */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
            </div>

            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 pt-8">
                <h1 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                    Upgrade your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Trading Edge</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                    Select the plan that fits your trading style. Unlock real-time data, AI insights, and automation tools with zero latency.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-start">
                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-1/3 h-full bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                {plans.map((plan) => {
                    const active = isPlanActive(plan.id);
                    const highlighted = plan.highlight && !active;

                    return (
                        <Card
                            key={plan.id}
                            className={cn(
                                "relative transition-all duration-300 hover:-translate-y-2 h-full border-opacity-50",
                                active ? "bg-slate-900/80 border-slate-700 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-100 z-10" :
                                    highlighted ? "bg-[#0B1121]/90 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 z-20 scale-105" :
                                        "bg-[#0B1121]/40 border-slate-800 hover:border-slate-700 hover:bg-[#0B1121]/60"
                            )}
                        >
                            {highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-1 text-xs font-black uppercase tracking-wider shadow-lg">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            {/* Glass Sheen */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-20" />

                            <CardHeader className="pb-8">
                                <CardTitle className={cn("text-xl font-bold", highlighted ? "text-white" : "text-slate-200")}>
                                    {plan.name}
                                </CardTitle>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className={cn("text-5xl font-black tracking-tight", highlighted ? "text-emerald-400 drop-shadow-sm" : "text-white")}>
                                        {plan.price}
                                    </span>
                                    <span className="text-slate-500 text-sm font-bold uppercase">{plan.period}</span>
                                </div>
                                <CardDescription className="text-slate-400 font-medium mt-4">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pb-8">
                                <Separator className="mb-6 bg-white/5" />
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-sm group">
                                        <div className={cn(
                                            "mt-0.5 p-1 rounded-full shrink-0",
                                            feature.included
                                                ? (feature.highlight ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700")
                                                : "text-slate-800"
                                        )}>
                                            {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={14} />}
                                        </div>
                                        <span className={cn(
                                            "leading-relaxed",
                                            !feature.included ? "text-slate-600 line-through decoration-slate-700" :
                                                feature.highlight ? "text-white font-bold" :
                                                    feature.warning ? "text-amber-500/80 font-medium" : "text-slate-300 font-medium"
                                        )}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>

                            <CardFooter>
                                <Button
                                    size="lg"
                                    disabled={active || processing !== null}
                                    onClick={() => handleUpgrade(plan.id)}
                                    className={cn(
                                        "w-full font-black text-sm uppercase tracking-widest h-12 shadow-lg",
                                        active ? "bg-slate-800/50 text-slate-500 border border-slate-700/50" :
                                            highlighted ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-t border-white/20" :
                                                "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                                    )}
                                >
                                    {active ? (
                                        <span className="flex items-center gap-2"><Check size={18} /> Current Plan</span>
                                    ) : processing === plan.id ? (
                                        <span className="flex items-center gap-2">Processing...</span>
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingPage;
