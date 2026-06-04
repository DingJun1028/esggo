"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompanyProfileStore = void 0;
const zustand_1 = require("zustand");
exports.useCompanyProfileStore = (0, zustand_1.create)((set) => ({
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