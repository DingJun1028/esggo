'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface DarkThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

export function DarkThemeProvider({ children, defaultTheme = 'dark' }: DarkThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('esg-sonar-theme') as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'esg-sonar-dark' : 'esg-sonar-light');
            localStorage.setItem('esg-sonar-theme', theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a DarkThemeProvider');
    }
    return context;
}

// 主題 CSS 變數
export const themeVariables = {
    dark: {
        '--esg-bg': '#050C14',
        '--esg-surface': '#0d1a26',
        '--esg-surface-2': '#112233',
        '--esg-primary': '#63a6b0',
        '--esg-primary-muted': 'rgba(99, 166, 176, 0.15)',
        '--esg-accent': '#FFD700',
        '--esg-glass-bg': 'rgba(13, 26, 38, 0.85)',
        '--esg-glass-border': 'rgba(99, 166, 176, 0.3)',
        '--esg-text-main': '#F8FAFC',
        '--esg-text-sub': '#CBD5E1',
        '--esg-text-muted': '#64748b',
        '--esg-card-bg': '#0d1a26',
        '--esg-card-bg-2': '#112233',
        '--esg-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        '--esg-success': '#10B981',
        '--esg-warning': '#F59E0B',
        '--esg-error': '#EF4444',
        '--esg-info': '#3B82F6',
    },
    light: {
        '--esg-bg': '#F8FAFC',
        '--esg-surface': '#FFFFFF',
        '--esg-surface-2': '#F1F5F9',
        '--esg-primary': '#0d7380',
        '--esg-primary-muted': 'rgba(13, 115, 128, 0.1)',
        '--esg-accent': '#D97706',
        '--esg-glass-bg': 'rgba(255, 255, 255, 0.85)',
        '--esg-glass-border': 'rgba(13, 115, 128, 0.2)',
        '--esg-text-main': '#0F172A',
        '--esg-text-sub': '#475569',
        '--esg-text-muted': '#94A3B8',
        '--esg-card-bg': '#FFFFFF',
        '--esg-card-bg-2': '#F8FAFC',
        '--esg-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        '--esg-success': '#059669',
        '--esg-warning': '#D97706',
        '--esg-error': '#DC2626',
        '--esg-info': '#2563EB',
    }
};