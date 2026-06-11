/**
 * ESG GO | Dynamic Policy Engine (T2 Transparent)
 * Validates ESG data against regulatory guardrails and templates.
 * Integrated with Firebase Data Connect for persistent policies.
 */
export interface RegulatoryPolicy {
    id: string;
    standard: 'CSRD' | 'GRI' | 'SASB' | 'TCFD' | 'ISO' | string;
    code: string;
    name: string;
    description: string;
    rules: PolicyRule[];
}
export interface PolicyRule {
    type: 'UNIT_CHECK' | 'RANGE_CHECK' | 'SOURCE_REQUIRED' | 'VARIANCE_LIMIT';
    targetField: string;
    expectedValue?: unknown;
    minValue?: number;
    maxValue?: number;
    varianceThreshold?: number;
}
export interface PolicyValidationResult {
    isValid: boolean;
    score: number;
    violations: string[];
    recommendations: string[];
}
export declare class PolicyEngine {
    private static instance;
    private policies;
    static getInstance(): PolicyEngine;
    /**
     * Syncs policies from the database.
     */
    syncPolicies(): Promise<void>;
    getPolicy(id: string): RegulatoryPolicy | undefined;
    listPolicies(): RegulatoryPolicy[];
    /**
     * Evaluates data against a specific policy.
     */
    validate(policyId: string, data: unknown, history?: unknown[]): PolicyValidationResult;
}
export declare const policyEngine: PolicyEngine;
//# sourceMappingURL=policy-engine.d.ts.map