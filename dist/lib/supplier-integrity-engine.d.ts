/**
 * ESG GO | Supplier Integrity Engine (Scope 3 Cascading)
 * Verifies external 5T attestations from supply chain partners.
 * Aligned with Chicony AI Audit & RBA v8.0 Requirements.
 */
export interface SupplierT5Attestation {
    masterSeal: string;
    t1_traceable: {
        hash: string;
    };
    t4_trustworthy: {
        hash: string;
    };
    t5_trackable: {
        chainBlock: {
            hash: string;
        };
    };
}
export type RBAClause = 'LABOR' | 'HEALTH_SAFETY' | 'ENVIRONMENT' | 'ETHICS' | 'MANAGEMENT';
export interface AIAuditMetadata {
    ocrConfidence: number;
    flaggedClauses: RBAClause[];
    suggestSampling: boolean;
    aiAuditTimestamp: number;
}
export interface SupplierVerificationResult {
    supplierId: string;
    isVerified: boolean;
    masterSeal: string;
    integrityMatrix: {
        t1: boolean;
        t2: boolean;
        t3: boolean;
        t4: boolean;
        t5: boolean;
    };
    score: number;
    aiAudit?: AIAuditMetadata;
    rbaScorecard?: Record<RBAClause, number>;
}
export declare class SupplierIntegrityEngine {
    private static instance;
    static getInstance(): SupplierIntegrityEngine;
    /**
     * Verifies an external attestation with AI Audit alignment.
     */
    verifySupplierAttestation(supplierId: string, attestation: SupplierT5Attestation, mockAIResult?: Partial<AIAuditMetadata>): Promise<SupplierVerificationResult>;
    /**
     * Get aggregate supply chain integrity score.
     */
    getAggregateSupplyScore(results: SupplierVerificationResult[]): number;
    /**
     * Risk-Based Sampling Logic: Prioritizes low-confidence or high-risk suppliers.
     */
    getAuditQueue(results: SupplierVerificationResult[]): SupplierVerificationResult[];
}
export declare const supplierIntegrityEngine: SupplierIntegrityEngine;
//# sourceMappingURL=supplier-integrity-engine.d.ts.map