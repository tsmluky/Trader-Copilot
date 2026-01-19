import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareMenuProps {
    title: string;
    text: string; // The content to share
    className?: string;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({ title, text, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Signa/Analysis copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            toast.error('Failed to copy');
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all duration-200 flex items-center gap-2 group ${className}`}
            title="Copy to Clipboard"
        >
            {copied ? (
                <>
                    <Check size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Copied</span>
                </>
            ) : (
                <>
                    <Copy size={16} className="text-slate-400 group-hover:text-brand-400 transition-colors" />
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">Copy</span>
                </>
            )}
        </button>
    );
};
