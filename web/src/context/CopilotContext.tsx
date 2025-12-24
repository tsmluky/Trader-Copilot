import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface CopilotContextPayload {
    token?: string;
    timeframe?: string;
    signal?: any;
    strategyId?: string;
    message?: string; // Initial message
}

export interface CopilotContextType {
    isOpen: boolean;
    openCopilot: () => void;
    closeCopilot: () => void;
    toggleCopilot: () => void;

    activeContext: CopilotContextPayload | null;
    setContext: (ctx: CopilotContextPayload) => void;
    clearContext: () => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const CopilotProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeContext, setActiveContext] = useState<CopilotContextPayload | null>(null);

    const openCopilot = useCallback(() => setIsOpen(true), []);
    const closeCopilot = useCallback(() => setIsOpen(false), []);
    const toggleCopilot = useCallback(() => setIsOpen(prev => !prev), []);

    const setContext = useCallback((ctx: CopilotContextPayload) => {
        setActiveContext(ctx);
        setIsOpen(true); // Auto-open when context is set
    }, []);

    const clearContext = useCallback(() => setActiveContext(null), []);

    return (
        <CopilotContext.Provider value={{
            isOpen,
            openCopilot,
            closeCopilot,
            toggleCopilot,
            activeContext,
            setContext,
            clearContext
        }}>
            {children}
        </CopilotContext.Provider>
    );
};

export const useCopilot = () => {
    const context = useContext(CopilotContext);
    if (!context) {
        throw new Error('useCopilot must be used within a CopilotProvider');
    }
    return context;
};
