import { User } from 'firebase/auth';
interface AuthState {
    user: User | null;
    error: string | null;
    isLoading: boolean;
    companyId: string | null;
    setUser: (user: User | null) => void;
    setError: (error: string | null) => void;
    setCompanyId: (companyId: string | null) => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
//# sourceMappingURL=useAuthStore.d.ts.map