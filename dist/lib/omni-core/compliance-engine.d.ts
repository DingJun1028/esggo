/**
 * GRI Compliance Matrix Engine
 * Bridge between static GRI standards and dynamic system state (Evidence, Tasks, Seals).
 */
export interface GRIComplianceNode {
    code: string;
    title: string;
    titleZh: string;
    category: string;
    completeness: number;
    status: 'completed' | 'in_progress' | 'pending' | 'na';
    hasEvidence: boolean;
    isSealed: boolean;
    tasksCount: number;
    gapAnalysis?: string;
}
export declare class ComplianceEngine {
    /**
     * Calculates the full GRI Compliance Matrix by cross-referencing Standards with Evidence Vault and Task Center.
     */
    static calculateGRIMatrix(companyId: string): Promise<GRIComplianceNode[]>;
    private static mapCategory;
}
//# sourceMappingURL=compliance-engine.d.ts.map