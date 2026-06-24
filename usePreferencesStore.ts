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
  syncWithBackend: () => Promise<void>;
}

// Background helper to sync preferences to the API
async function savePreferencesToBackend(
  theme: string,
  language: string,
  sidebarCollapsed: boolean
) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, language, sidebarCollapsed }),
    });
  } catch (e) {
    console.warn('[Preferences] Failed to sync to server database:', e);
  }
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarCollapsed: false,
      language: 'zh-TW',

      setTheme: (theme) => {
        set({ theme });
        savePreferencesToBackend(theme, get().language, get().sidebarCollapsed);
      },

      toggleSidebar: () => {
        const newCollapsed = !get().sidebarCollapsed;
        set({ sidebarCollapsed: newCollapsed });
        savePreferencesToBackend(get().theme, get().language, newCollapsed);
      },

      setLanguage: (language) => {
        set({ language });
        savePreferencesToBackend(get().theme, language, get().sidebarCollapsed);
      },

      syncWithBackend: async () => {
        if (typeof window === 'undefined') return;
        try {
          const res = await fetch('/api/user/preferences');
          if (res.ok) {
            const data = await res.json();
            set({
              theme: data.theme || 'system',
              language: data.language || 'zh-TW',
              sidebarCollapsed: !!data.sidebarCollapsed,
            });
          }
        } catch (e) {
          console.warn('[Preferences] Initial backend fetch failed, using local preferences:', e);
        }
      },
    }),
    {
      name: 'esggo-preferences', // Key in localStorage
    }
  )
);
