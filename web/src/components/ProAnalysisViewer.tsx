import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ProAnalysisViewerProps {
  raw: string;
  token: string;
}

export function ProAnalysisViewer({ raw, token }: ProAnalysisViewerProps) {
  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Deep Strategy Review
            <span className="px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] text-brand-300 font-mono uppercase">PRO Agent</span>
          </h3>
          <p className="text-slate-400 text-sm">Multi-factor analysis for {token}</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 font-light leading-relaxed prose-headings:font-bold prose-headings:text-white prose-strong:text-brand-400 prose-li:marker:text-slate-500">
        {raw ? (
          <ReactMarkdown>{raw}</ReactMarkdown>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 opacity-50">
            <Sparkles size={48} className="mb-4 text-slate-600" />
            <p>Waiting for analysis stream...</p>
          </div>
        )}
      </div>
    </div>
  )
}
