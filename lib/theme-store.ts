'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarTheme = 'light' | 'dark' | 'glass';

interface ThemeStore {
  sidebarTheme: SidebarTheme;
  setSidebarTheme: (theme: SidebarTheme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      sidebarTheme: 'light',
      setSidebarTheme: (theme) => set({ sidebarTheme: theme }),
    }),
    { name: 'esggo-theme' }
  )
);