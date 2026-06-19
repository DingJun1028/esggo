
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type StitchThemeMode = 'light' | 'dark' | 'system' | 'void' | 'moon' | 'gold' | 'sentient';
export type StitchThemeResolvedMode = 'light' | 'dark' | 'void' | 'moon' | 'gold' | 'sentient';

interface StitchThemeContextType {
    mode: StitchThemeMode;
    setMode: (mode: StitchThemeMode) => void;
    resolvedMode: StitchThemeResolvedMode;
}

const StitchThemeContext = createContext<StitchThemeContextType | undefined>(undefined);

export const StitchThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<StitchThemeMode>(() => {
        // Try to load from localStorage, default to 'system'
        const saved = localStorage.getItem('stitch-theme-mode');
        return (saved as StitchThemeMode) || 'system';
    });

    const [resolvedMode, setResolvedMode] = useState<StitchThemeResolvedMode>('light');

    useEffect(() => {
        localStorage.setItem('stitch-theme-mode', mode);

        const updateResolvedMode = () => {
            if (mode === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedMode(systemPrefersDark ? 'dark' : 'light');
            } else {
                setResolvedMode(mode as StitchThemeResolvedMode);
            }
        };

        updateResolvedMode();

        if (mode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => updateResolvedMode();
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [mode]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolvedMode);
    }, [resolvedMode]);

    return (
        <StitchThemeContext.Provider value={{ mode, setMode, resolvedMode }}>
            {children}
        </StitchThemeContext.Provider>
    );
};

export const useStitchTheme = () => {
    const context = useContext(StitchThemeContext);
    if (!context) {
        throw new Error('useStitchTheme must be used within a StitchThemeProvider');
    }
    return context;
};
