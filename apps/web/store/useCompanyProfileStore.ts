import { create } from 'zustand';
import { loadCompanyProfile, saveCompanyProfile } from '../lib/memory';

interface CompanyProfileState {
    profile: Record<string, any>;
    loading: boolean;
    saved: boolean;
    isInitialized: boolean;

    // Actions
    initData: () => Promise<void>;
    save: (newProfile: Record<string, any>) => Promise<void>;
}

export const useCompanyProfileStore = create<CompanyProfileState>((set, get) => ({
    profile: {
        company_name: '善向永續股份有限公司',
        industry: '科技業',
        employees: 250,
        revenue: 15,
        reporting_year: 2024,
    },
    loading: true,
    saved: false,
    isInitialized: false,

    initData: async () => {
        // 如果已經載入過，就不重複抓取資料
        if (get().isInitialized) return;

        set({ loading: true });
        try {
            const p = await loadCompanyProfile();
            set({ profile: p || get().profile, loading: false, isInitialized: true });
        } catch (error) {
            console.error('[CompanyProfileStore] Failed to load data:', error);
            set({ loading: false, isInitialized: true });
        }
    },

    save: async (newProfile) => {
        set({ profile: newProfile, saved: false });
        await saveCompanyProfile(newProfile);
        set({ saved: true });
        // 2.5 秒後自動消退「已儲存」狀態
        setTimeout(() => set({ saved: false }), 2500);
    }
}));