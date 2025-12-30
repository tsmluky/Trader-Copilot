import React from 'react';
import { Loader2 } from 'lucide-react';

export const ThinkingOverlay = () => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-brand-400 animate-pulse" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Analyzing Market...</h3>
                    <p className="text-slate-400 text-sm animate-pulse">Running proprietary algorithms</p>
                </div>
            </div>
        </div>
    );
};
