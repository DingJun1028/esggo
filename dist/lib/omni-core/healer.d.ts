/**
 * 🩹 HealingGuardian (自主修復與數據鏈路守護者)
 * v1.0 | #AutonomousGovernance #5TIntegrity #SelfHealing
 *
 * 負責自動偵測數據誠信缺角，並主動從實證金庫 (Evidence Vault)
 * 尋找合適實證進行鏈路修復與「信」的重塑。
 */
export interface HealingLogEntry {
    id: string;
    target_gri: string;
    action_taken: string;
    status: string;
    details: Record<string, unknown>;
    created_at: string;
}
export interface HealingResult {
    healedCount: number;
    logs: HealingLogEntry[];
    timestamp: string;
}
export declare class HealingGuardian {
    /**
     * 啟動全域自主修復循環
     * 呼叫資料庫層級之 RPC 進行大規模鏈路修復
     */
    triggerGlobalHealing(companyId?: string): Promise<HealingResult>;
    /**
     * 精準修復 (Targeted Healing)
     * 針對特定的 GRI 指標與實證進行鏈路建立
     */
    targetHealing(griTag: string, evidenceId: string, companyId?: string): Promise<boolean>;
}
export declare const healingGuardian: HealingGuardian;
//# sourceMappingURL=healer.d.ts.map