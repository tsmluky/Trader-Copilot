import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Step {
    targetId: string;
    title: string;
    content: string;
    position: 'right' | 'bottom' | 'top';
}

const STEPS: Step[] = [
    {
        targetId: 'nav-overview',
        title: 'Market Command Center',
        content: 'Get a high-level view of the market, active signals, and your portfolio performance in real-time.',
        position: 'right'
    },
    {
        targetId: 'nav-scanner',
        title: 'AI Radar Scanner',
        content: 'Our AI scans thousands of tokens 24/7. Filter by strategy, timeframe, and win-rate to find the best opportunities.',
        position: 'right'
    },
    {
        targetId: 'nav-analysis',
        title: 'AI Market Analyst',
        content: 'Chat with our DeepSeek-powered AI Advisor to get deep insights on any token or market condition.',
        position: 'right'
    },
    {
        targetId: 'nav-strategies',
        title: 'Quant Lab',
        content: 'Manage and configure your automated trading strategies. Enable or disable agents with a single click.',
        position: 'right'
    }
];

export const TutorialOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState<{ top: number; left: number; height: number; width: number } | null>(null);

    // Initial Check
    useEffect(() => {
        const seen = localStorage.getItem('tradercopilot_tutorial_completed');
        if (!seen) {
            // Small delay to ensure render
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    // Update coordinates when step changes
    useEffect(() => {
        if (!isVisible) return;

        const updatePosition = () => {
            const step = STEPS[currentStep];
            const element = document.getElementById(step.targetId);

            if (element) {
                const rect = element.getBoundingClientRect();
                setCoords({
                    top: rect.top,
                    left: rect.left,
                    height: rect.height,
                    width: rect.width
                });
            } else {
                // Skip step if element not found (e.g. dynamic permissions)
                console.warn(`Tutorial target ${step.targetId} not found, skipping.`);
                if (currentStep < STEPS.length - 1) {
                    setCurrentStep(c => c + 1);
                } else {
                    finishTour();
                }
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStep, isVisible]);

    const finishTour = () => {
        localStorage.setItem('tradercopilot_tutorial_completed_v2', 'true');
        setIsVisible(false);
    };

    if (!isVisible || !coords) return null;

    const step = STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Backdrop with hole */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-500 ease-in-out">
                {/* We use a clip-path or just composite layers. 
                    Actually, simpler approach for "Sale Ready" polish without complex clip-path math:
                    Just huge borders around the cutout div.
                */}
            </div>

            {/* Highlighter */}
            <div
                className="absolute transition-all duration-300 ease-in-out border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] rounded-lg pointer-events-none"
                style={{
                    top: coords.top - 4,
                    left: coords.left - 4,
                    width: coords.width + 8,
                    height: coords.height + 8,
                }}
            />

            {/* Tooltip Card */}
            <div
                className="absolute transition-all duration-300 ease-in-out flex flex-col gap-3 p-5 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl max-w-sm"
                style={{
                    top: coords.top,
                    left: coords.left + coords.width + 24, // Position to the right by default
                }}
            >
                {/* Arrow pointing left */}
                <div className="absolute -left-2 top-6 w-4 h-4 bg-[#0f172a] border-l border-b border-slate-700 transform rotate-45"></div>

                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                    <button onClick={finishTour} className="text-slate-400 hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                    {step.content}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-500 font-mono">
                        STEP {currentStep + 1}/{STEPS.length}
                    </span>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(c => c - 1)}
                                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (currentStep < STEPS.length - 1) {
                                    setCurrentStep(c => c + 1);
                                } else {
                                    finishTour();
                                }
                            }}
                            className="flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                        >
                            {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                            {currentStep === STEPS.length - 1 ? <Check size={12} /> : <ChevronRight size={12} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
