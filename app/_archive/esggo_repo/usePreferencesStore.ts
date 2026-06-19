import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    language: 'zh-TW' | 'en-US';

    // Actions
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleSidebar: () => void;
    setLanguage: (lang: 'zh-TW' | 'en-US') => void;
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            theme: 'system',
            sidebarCollapsed: false,
            language: 'zh-TW',
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'esggo-preferences', // 這是存入 localStorage 的 Key
            // storage: createJSONStorage(() => sessionStorage), // 如果想改用 sessionStorage 可以加這行
        }
    )
);