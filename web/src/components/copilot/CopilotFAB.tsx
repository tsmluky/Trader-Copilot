import React from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { useAuth } from '../../context/AuthContext';
import { MessageSquareText, Sparkles } from 'lucide-react';

export const CopilotFAB: React.FC = () => {
    const { toggleCopilot, isOpen, activeContext } = useCopilot();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;
    if (isOpen) return null;

    return (
        <button
            onClick={toggleCopilot}
            title="Open TraderCopilot" // Accessibility
            className="fixed bottom-6 right-6 z-[50] p-3.5 bg-indigo-600 rounded-full shadow-2xl hover:bg-indigo-500 transition-all hover:scale-110 group ring-4 ring-indigo-500/30"
        >
            {activeContext ? (
                <div className="relative">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                </div>
            ) : (
                <MessageSquareText className="w-6 h-6 text-white" />
            )}
        </button>
    )
}
