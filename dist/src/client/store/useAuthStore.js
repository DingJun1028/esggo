'use client';
import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    error: null,
    isLoading: false,
    companyId: null,
    setUser: (user) => set({ user, isLoading: false }),
    setError: (error) => set({ error }),
    setCompanyId: (companyId) => set({ companyId }),
}));
//# sourceMappingURL=useAuthStore.js.map