/**
 * ESG GO | SaaS Management Hook
 * Handles subscription tiers, usage limits, and enterprise features.
 */
export type SaaSPlan = 'free' | 'professional' | 'enterprise';
interface SaaSContextType {
    plan: SaaSPlan;
    usage: {
        aiWords: number;
        aiLimit: number;
        sealedDocs: number;
        vaultLimit: number;
    };
    isExpiringSoon: boolean;
    upgradePlan: () => void;
}
export declare function SaaSProvider({ children }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare const useSaaS: () => SaaSContextType;
export {};
//# sourceMappingURL=useSaaS.d.ts.map