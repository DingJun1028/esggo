'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, OmniThemeContextValue } from '@/types/omni-component';
import { applyTheme, getSystemTheme } from './omni-theme';

const OmniThemeContext = createContext<OmniThemeContextValue | undefined>(undefined);

export function OmniThemeProvider({ 
  children,
  defaultTheme = 'system'
}: { 
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(theme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('omni-theme', newTheme);
    } catch {
      // Handle SSR or storage disabled
    }
  };

  const value = {
    theme,
    setTheme,
    isMobile,
    colors: theme === 'dark' ? {
      background: {
        primary: '#020617',
        secondary: '#0A0F1E',
        tertiary: '#1E293B',
        elevated: 'rgba(30, 41, 59, 0.85)',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        muted: '#64748B',
        disabled: '#475569',
        inverse: '#020617',
      },
      brand: {
        primary: '#FDB515',
        accent: '#3B7EA1',
        secondary: '#B9D9EB',
      },
      status: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#06B6D4',
      },
      surface: {
        glass: 'rgba(30, 41, 59, 0.7)',
        border: '#334155',
        divider: '#1E293B',
      },
    } : {
      background: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        tertiary: '#F1F5F9',
        elevated: 'rgba(255, 255, 255, 0.85)',
        overlay: 'rgba(0, 50, 98, 0.3)',
      },
      text: {
        primary: '#0F172A',
        secondary: '#334155',
        muted: '#64748B',
        disabled: '#94A3B8',
        inverse: '#FFFFFF',
      },
      brand: {
        primary: '#003262',
        accent: '#FDB515',
        secondary: '#3B7EA1',
      },
      status: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#06B6D4',
      },
      surface: {
        glass: 'rgba(255, 255, 255, 0.7)',
        border: '#E2E8F0',
        divider: '#F1F5F9',
      },
    },
  };

  return (
    <OmniThemeContext.Provider value={value}>
      {children}
    </OmniThemeContext.Provider>
  );
}

export const useOmniTheme = () => {
  const context = useContext(OmniThemeContext);
  if (!context) {
    throw new Error('useOmniTheme must be used within OmniThemeProvider');
  }
  return context;
};