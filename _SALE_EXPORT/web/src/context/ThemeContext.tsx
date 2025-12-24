import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

export interface ThemeConfig {
    appName: string;
    logoUrl?: string;
    primaryColor?: string;
    supportEmail?: string;
    heroTitle?: string;
    footerText?: string;
}

const DEFAULT_THEME: ThemeConfig = {
    appName: 'TraderCopilot',
    primaryColor: '#10b981', // Emerald
    heroTitle: 'Upgrade your Trading Edge',
    footerText: 'Powered by TraderCopilot Engine'
};

interface ThemeContextType {
    theme: ThemeConfig;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    isLoading: true
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const config = await api.getSystemConfig();
                if (config && config.appName) {
                    setTheme(prev => ({ ...prev, ...config }));

                    // Apply document title
                    document.title = config.appName;

                    // Try to update favicon if logoUrl is provided (Advanced, skipping for safety)
                }
            } catch (err) {
                console.error("Failed to load theme config", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
