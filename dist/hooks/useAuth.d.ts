import { User } from 'firebase/auth';
/**
 * ESG GO | Unified Auth Context
 * Synchronizes Firebase (Legacy/UI) and Supabase (Data/RLS)
 * Monitors Platform System Health
 */
export type SystemStatus = 'online' | 'degraded' | 'offline';
interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    companyId: string;
    systemStatus: SystemStatus;
}
export declare function AuthProvider({ children }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=useAuth.d.ts.map