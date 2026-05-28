'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'light' | 'dark' | 'system';
export type AppFlavor = 'berkeley' | 'sustainable' | 'minimalist' | 'best-practice';
export type SidebarTheme = 'dark' | 'light' | 'glass';

interface ThemeStore {
  mode: AppMode;
  flavor: AppFlavor;
  sidebarTheme: SidebarTheme;
  setMode: (mode: AppMode) => void;
  setFlavor: (flavor: AppFlavor) => void;
  setSidebarTheme: (theme: SidebarTheme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'system',
      flavor: 'berkeley',
      sidebarTheme: 'dark',
      setMode: (mode) => set({ mode }),
      setFlavor: (flavor) => set({ flavor }),
      setSidebarTheme: (sidebarTheme) => set({ sidebarTheme }),
    }),
    { name: 'esggo-theme-config' }
  )
);