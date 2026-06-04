'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create()(persist((set) => ({
    mode: 'system',
    flavor: 'berkeley',
    sidebarTheme: 'dark',
    setMode: (mode) => set({ mode }),
    setFlavor: (flavor) => set({ flavor }),
    setSidebarTheme: (sidebarTheme) => set({ sidebarTheme }),
}), { name: 'esggo-theme-config' }));
//# sourceMappingURL=theme-store.js.map