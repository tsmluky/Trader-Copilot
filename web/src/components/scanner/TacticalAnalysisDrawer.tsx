import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, Bot, Target, Shield, Clock } from 'lucide-react';
import { SignalCard } from '../SignalCard';

interface TacticalAnalysisDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    signal: any;
}

export function TacticalAnalysisDrawer({ isOpen, onClose, signal }: TacticalAnalysisDrawerProps) {
    if (!signal) return null;

    // Fake specific analysis data for the drawer
    const isLong = signal.direction?.toLowerCase() === 'long';

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] border-l border-white/10 bg-[#020617]/95 backdrop-blur-xl">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                            <Bot className="text-brand-400" size={20} />
                        </div>
                        <div>
                            <SheetTitle className="text-white text-xl font-bold">Tactical Analysis</SheetTitle>
                            <SheetDescription className="text-slate-400">AI Deep Dive & Execution Plan</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Tabs defaultValue="overview" className="h-full">
                    <TabsList className="bg-white/5 border border-white/5 w-full mb-6">
                        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                        <TabsTrigger value="metrics" className="flex-1">Metrics</TabsTrigger>
                        <TabsTrigger value="execution" className="flex-1">Execution</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0">
                        <div className="space-y-6">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Win Probability</div>
                                    <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                                        {(signal.confidence || 0)}%
                                        <Target size={16} />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk Rating</div>
                                    <div className="text-2xl font-black text-gold-400 flex items-center gap-2">
                                        Low
                                        <Shield size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Signal Card Review */}
                            <SignalCard signal={signal} />

                            <div className="px-1">
                                <h4 className="text-sm font-bold text-white mb-2">Market Context</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {signal.rationale || "The AI detected a strong momentum breakout pattern aligned with higher timeframe trends. Volume analysis confirms institutional participation at the entry zone."}
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="metrics" className="mt-0">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Risk/Reward</div>
                                    <div className="text-white font-bold text-xl">1:{(Math.abs((signal.tp - signal.entry) / (signal.entry - signal.sl))).toFixed(1) || "1.5"}</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Leverage Rec.</div>
                                    <div className="text-white font-bold text-xl">5x - 10x</div>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <h4 className="text-sm font-bold text-white mb-3">AI Factor Analysis</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Trend Alignment</span>
                                        <span className="text-emerald-400 font-bold">Strong</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Volume Profile</span>
                                        <span className="text-emerald-400 font-bold">Accumulation</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Volatility</span>
                                        <span className="text-amber-400 font-bold">Moderate</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Sentiment</span>
                                        <span className="text-emerald-400 font-bold">Bullish</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="execution" className="mt-0">
                        <div className="p-8 border border-dashed border-white/10 rounded-xl bg-white/[0.02] text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                                <Bot size={32} className="text-brand-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Execution Engine</h3>
                            <Badge variant="outline" className="border-brand-500/30 text-brand-400 bg-brand-500/10">COMING SOON</Badge>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                Automated trade execution directly from the terminal is currently in beta testing with select partners.
                            </p>
                            <Button disabled className="w-full bg-slate-800 text-slate-500 border border-slate-700 mt-4 opacity-50 cursor-not-allowed uppercase tracking-wider font-bold">
                                Awaiting Module
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-[#020617]/90 backdrop-blur-md">
                    <Button size="lg" className="w-full font-bold text-md gap-2" onClick={() => {
                        window.open(`https://www.tradingview.com/chart?symbol=BINANCE:${signal.token}USDT`, '_blank');
                    }}>
                        Open in TradingView <ArrowRight size={16} />
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    )
}
