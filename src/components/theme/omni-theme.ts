/**
 * ESGGO OmniTheme Configuration - v1.1
 * ESGGO Classic 善向永續 經典版
 */

import { ThemeMode, OmniColors } from '@/types/omni-component';

export const omniLightTheme: OmniColors = {
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
};

export const omniDarkTheme: OmniColors = {
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
};

export const themeTransition = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: ThemeMode) => {
  const root = document.documentElement;
  const activeTheme = theme === 'system' ? getSystemTheme() : theme;
  
  root.classList.remove('light', 'dark');
  root.classList.add(activeTheme);
  root.setAttribute('data-theme', activeTheme);
};