export type AuditStatus = 'pass' | 'warn' | 'fail' | 'skip';
export type AuditCategory = 'visual' | 'interaction' | 'structure' | 'engineering' | 'accessibility' | 'rwd';
export interface AuditRule {
    id: string;
    category: AuditCategory;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    checkFn?: () => AuditStatus;
}
export interface AuditResult {
    ruleId: string;
    status: AuditStatus;
    message?: string;
    timestamp: string;
}
export interface PageAudit {
    pageId: string;
    pageName: string;
    pagePath: string;
    results: AuditResult[];
    score: number;
    lastAuditAt: string;
}
export declare const AUDIT_RULES: AuditRule[];
export declare const PAGE_REGISTRY: Array<{
    id: string;
    name: string;
    path: string;
    template: 'dashboard' | 'list' | 'detail' | 'form' | 'report';
    module: string;
    priority: 'core' | 'high' | 'medium';
}>;
export declare function calculateAuditScore(results: AuditResult[]): number;
export declare function getScoreColor(score: number): string;
export declare function getScoreLabel(score: number): string;
export declare function groupRulesByCategory(rules: AuditRule[]): Record<AuditCategory, AuditRule[]>;
//# sourceMappingURL=governance-audit.d.ts.map