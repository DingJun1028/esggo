
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
    theme: ThemeMode;
    resolvedTheme: 'light' | 'dark' | 'cosmic';
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'cosmic' as per project DNA
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('jak_theme_preference') as ThemeMode;
        return saved || 'cosmic';
    });

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'cosmic'>('cosmic');

    const updateResolvedTheme = useCallback((mode: ThemeMode) => {
        if (mode === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setResolvedTheme(isDark ? 'dark' : 'light');
        } else {
            setResolvedTheme(mode);
        }
    }, []);

    useEffect(() => {
        updateResolvedTheme(theme);
        localStorage.setItem('jak_theme_preference', theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') updateResolvedTheme('system');
        };
        mediaQuery.addEventListener('change', handleChange);
        
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, updateResolvedTheme]);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // 1. Remove old classes
        root.classList.remove('light', 'dark', 'cosmic');
        
        // 2. Set Data Attribute (Main Driver for CSS Variables)
        root.setAttribute('data-theme', resolvedTheme);
        
        // 3. Add Tailwind Class (for dark: modifiers to work)
        // Cosmic also triggers 'dark' modifiers in tailwind config
        if (resolvedTheme === 'dark' || resolvedTheme === 'cosmic') {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }

    }, [resolvedTheme]);

    const setTheme = (mode: ThemeMode) => {
        setThemeState(mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
