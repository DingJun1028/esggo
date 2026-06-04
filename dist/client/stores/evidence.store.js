"use strict";
/**
 * Evidence Store (Zustand)
 * 前端狀態管理層 - 封裝對 tRPC 的調用與 5T 狀態維護
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvidenceStore = void 0;
const zustand_1 = require("zustand");
exports.useEvidenceStore = (0, zustand_1.create)((set, _get) => ({
    evidences: [],
    isLoading: false,
    error: null,
    fetchEvidences: async (params) => {
        set({ isLoading: true, error: null });
        try {
            // 這裡模擬對 tRPC 的調用
            const response = await fetch('/api/trpc/evidence.list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params || {}),
            });
            const json = await response.json();
            if (json.success) {
                set({ evidences: json.data.data, isLoading: false });
            }
        }
        catch (e) {
            set({ error: e.message, isLoading: false });
        }
    },
    addEvidence: async (dto) => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/trpc/evidence.create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            const json = await response.json();
            if (json.success) {
                const newEv = json.data;
                set(state => ({
                    evidences: [newEv, ...state.evidences],
                    isLoading: false
                }));
                return newEv;
            }
        }
        catch (e) {
            set({ error: e.message, isLoading: false });
        }
        return null;
    },
    verifyEvidence: async (id) => {
        try {
            const response = await fetch('/api/trpc/evidence.verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const json = await response.json();
            return json.data;
        }
        catch (e) {
            console.error('Verification failed', e);
            return null;
        }
    }
}));
//# sourceMappingURL=evidence.store.js.map