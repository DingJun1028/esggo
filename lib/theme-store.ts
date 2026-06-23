'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'light' | 'dark' | 'system';
export type AppFlavor = 'berkeley' | 'sustainable' | 'minimalist' | 'best-practice';
export type SidebarTheme = 'dark' | 'light' | 'glass';
export type OmniThemeType = 'v2' | 'omnicore';

interface ThemeStore {
  mode: AppMode;
  flavor: AppFlavor;
  sidebarTheme: SidebarTheme;
  omniTheme: OmniThemeType;
  setMode: (mode: AppMode) => void;
  setFlavor: (flavor: AppFlavor) => void;
  setSidebarTheme: (theme: SidebarTheme) => void;
  setOmniTheme: (theme: OmniThemeType) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'system',
      flavor: 'berkeley',
      sidebarTheme: 'dark',
      omniTheme: 'omnicore',
      setMode: (mode) => set({ mode }),
      setFlavor: (flavor) => set({ flavor }),
      setSidebarTheme: (sidebarTheme) => set({ sidebarTheme }),
      setOmniTheme: (omniTheme) => set({ omniTheme }),
    }),
    { name: 'esggo-theme-config' }
  )
);