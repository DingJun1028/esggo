import { MCPRouter } from './mcp-router';
import { runComplianceCheck } from './compliance';
export declare function initializeOmniMCP(): Promise<{
    mcp: {
        firebase: (endpoint: string, payload: any) => Promise<any>;
        supabase: (query: string, params: any) => Promise<any>;
        genkit: (flowName: string, data: any) => Promise<any>;
        boostSpace: (apiName: string, data: any) => Promise<any>;
    };
    MCPRouter: typeof MCPRouter;
    compliance: typeof runComplianceCheck;
    socket: any;
    isAuthorized: () => boolean;
}>;
export declare function executeMCPService(service: string, action: string, payload: any): Promise<{
    result: any;
    compliance: {
        e: import("./compliance").ComplianceResult;
        s: import("./compliance").ComplianceResult;
        g: import("./compliance").ComplianceResult;
    };
}>;
//# sourceMappingURL=omnimcp-entry.d.ts.map