import React from 'react';
import { Bot, Twitter, Github, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#020617] border-t border-white/5 py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-500 blur opacity-20 rounded-lg"></div>
                            <div className="relative bg-white/5 border border-white/10 p-2 rounded-lg">
                                <Bot className="h-5 w-5 text-brand-400" />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">TraderCopilot</span>
                    </div>

                    <div className="text-gray-600 text-sm font-medium">
                        © 2025 TraderCopilot Inc. Quantitative Precision.
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-gray-600 hover:text-brand-400 transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="text-gray-600 hover:text-brand-400 transition-colors"><Github size={18} /></a>
                        <a href="#" className="text-gray-600 hover:text-brand-400 transition-colors"><MessageCircle size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
