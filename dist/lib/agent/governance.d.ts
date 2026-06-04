import type { AgentTaskType } from './types';
export type GovernanceRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type GovernanceBoundaryType = 'data' | 'process' | 'trust' | 'role';
export type PolicyDecisionType = 'allow' | 'allow_with_review' | 'deny';
export type AuditAction = 'task_created' | 'execution_started' | 'execution_completed' | 'review_requested' | 'review_approved' | 'review_rejected' | 'artifact_promoted' | 'hashlock_requested' | 'hashlock_applied' | 'policy_denied';
export interface PolicyDecisionRecord {
    id: string;
    taskType: AgentTaskType;
    actorId: string;
    decision: PolicyDecisionType;
    allowedDataScopes: string[];
    maskedFields: string[];
    requiresHumanReview: boolean;
    reasonCodes: string[];
    createdAt: string;
}
export interface GovernanceAuditLog {
    id: string;
    executionId: string;
    artifactId?: string;
    actorId: string;
    action: AuditAction;
    status: 'success' | 'failure';
    metadata: Record<string, string | number | boolean | null>;
    createdAt: string;
}
export interface RiskItem {
    id: string;
    title: string;
    description: string;
    riskLevel: GovernanceRiskLevel;
    controls: string[];
    category: string;
}
export interface BoundaryRule {
    id: string;
    boundaryType: GovernanceBoundaryType;
    title: string;
    rules: string[];
}
export interface ArchitectureLayer {
    id: string;
    name: string;
    nameEn: string;
    color: string;
    bgColor: string;
    components: string[];
    description: string;
    omniagentCanAccess: boolean;
    accessType?: 'direct' | 'via_adapter' | 'none';
}
export declare const RISK_REGISTRY: readonly RiskItem[];
export declare const BOUNDARY_RULES: readonly BoundaryRule[];
export declare const ARCHITECTURE_LAYERS: readonly ArchitectureLayer[];
export type PhaseStatus = 'current' | 'planned' | 'future';
export interface PhasePlanItem {
    phase: string;
    title: string;
    status: PhaseStatus;
    color: string;
    items: string[];
    description: string;
}
export declare const PHASE_PLAN: readonly PhasePlanItem[];
export declare function getRiskColor(level: GovernanceRiskLevel): {
    text: string;
    bg: string;
    border: string;
};
export declare function getBoundaryColor(type: GovernanceBoundaryType): {
    text: string;
    bg: string;
};
//# sourceMappingURL=governance.d.ts.map