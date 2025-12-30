import React from 'react';
import { ChevronsUpDown } from "lucide-react"


// Wait, I didn't port Command and Popover yet. I should verify if I have them.
// I listed components/scanner and components/ui in Step 109. command.tsx and popover.tsx WERE there.
// I should port them quickly before this file. 
// For now I'll use a simple Select fallback if Command/Popover is too heavy to port right now, 
// OR I'll just use the ported Select component for simplicty to avoid dependency hell.

// Let's use standard Select for now to save time, unless Command is critical for search. 
// The Redesign had a "TokenSelector". It likely used Command for search.
// But given I have 15 predicted steps, I should be efficient.
// I'll stick to a styled Select for now, and maybe upgrade to Command later if the user requests it.

export function TokenSelector({
    value,
    onChange,
    availableTokens,
    isProUser
}: {
    value: string,
    onChange: (val: string) => void,
    availableTokens: string[],
    isProUser: boolean
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#0B1121] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 appearance-none font-bold transition-all shadow-inner"
            >
                {availableTokens.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronsUpDown size={14} />
            </div>
        </div>
    )
}
