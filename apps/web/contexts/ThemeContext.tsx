'use client';

import React, { createContext, useEffect, useContext } from 'react';
import { useThemeStore, AppMode, AppFlavor } from '../lib/theme-store';

interface ThemeContextType {
  mode: AppMode;
  flavor: AppFlavor;
  setMode: (mode: AppMode) => void;
  setFlavor: (flavor: AppFlavor) => void;
  resolvedTheme: 'light' | 'dark'; // The actual computed theme (if system, it resolves to light or dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, flavor, setMode, setFlavor } = useThemeStore();
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Determine the actual light/dark theme
    const getSystemTheme = () => 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const actualTheme = mode === 'system' ? getSystemTheme() : mode;
    setResolvedTheme(actualTheme);

    // Apply dark mode class
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove any existing flavor classes
    root.classList.remove(
      'theme-berkeley', 
      'theme-sustainable', 
      'theme-minimalist', 
      'theme-best-practice'
    );
    // Add the selected flavor class
    root.classList.add(`theme-${flavor}`);

    // Listen for system theme changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        if (newTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, flavor]);

  return (
    <ThemeContext.Provider value={{ mode, flavor, setMode, setFlavor, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
