'use client';

import { useThemeStore } from '../lib/theme-store';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme(): ThemeContextValue {
  const { mode, setMode } = useThemeStore();
  const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;
  return { mode, resolvedTheme, setMode };
}