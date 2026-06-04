export interface ComplianceResult {
    passed: boolean;
    messages: string[];
}
export declare function checkE(data: any): ComplianceResult;
export declare function checkS(data: any): ComplianceResult;
export declare function checkG(data: any): ComplianceResult;
export declare function runComplianceCheck(payload: {
    environmental?: any;
    social?: any;
    governance?: any;
}): {
    e: ComplianceResult;
    s: ComplianceResult;
    g: ComplianceResult;
};
//# sourceMappingURL=compliance.d.ts.map