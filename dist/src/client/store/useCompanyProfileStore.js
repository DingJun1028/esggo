'use client';
import { create } from 'zustand';
export const useCompanyProfileStore = create((set) => ({
    profile: {
        company_name: '善向永續股份有限公司',
        industry: '科技業',
        employees: 250,
        revenue: 15,
        reporting_year: 2024,
    },
    loading: false,
    saved: false,
    save: async (profile) => {
        set({ profile, saved: false });
        // In real implementation, this would save to DB
        await new Promise(r => setTimeout(r, 800));
        set({ saved: true });
        setTimeout(() => set({ saved: false }), 2500);
    },
    initData: () => set({ loading: false }),
}));
//# sourceMappingURL=useCompanyProfileStore.js.map