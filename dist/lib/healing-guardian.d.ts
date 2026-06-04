export interface HealingReport {
    id: string;
    status: 'healthy' | 'healed' | 'critical';
    targetId: string;
    details: string;
    timestamp: string;
    recoveryHash?: string;
}
/**
 * 🩹 HealingGuardian (自主修復引擎)
 * v3.0 | 5T 誠信守護者
 */
export declare class HealingGuardian {
    /**
     * Evaluates incoming webhook payloads for manual tampering and triggers healing if necessary.
     */
    static evaluateSensorPayload(payload: unknown): Promise<void>;
    /**
     * 萬能修復執行協定
     * 由 Agent0 呼叫，強制將數據回溯至真理錨點 (Supabase)
     */
    static executeUniversalHealing(targetId: string, table: string): Promise<HealingReport>;
}
//# sourceMappingURL=healing-guardian.d.ts.map