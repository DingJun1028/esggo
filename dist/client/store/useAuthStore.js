"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
exports.useAuthStore = (0, zustand_1.create)((set) => ({
    user: null,
    error: null,
    isLoading: false,
    companyId: null,
    setUser: (user) => set({ user, isLoading: false }),
    setError: (error) => set({ error }),
    setCompanyId: (companyId) => set({ companyId }),
}));
//# sourceMappingURL=useAuthStore.js.map