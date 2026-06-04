import { MCPRouter } from './mcp-router';
import { runComplianceCheck } from './compliance';
export declare function initializeOmniMCP(): Promise<{
    mcp: {
        firebase: (endpoint: string, payload: any) => Promise<any>;
        supabase: (query: string, params: any) => Promise<any>;
        genkit: (flowName: string, data: any) => Promise<{
            result: null;
            stubbed: boolean;
        }>;
        boostSpace: (apiName: string, data: any) => Promise<{
            result: null;
            stubbed: boolean;
        }>;
    };
    MCPRouter: typeof MCPRouter;
    compliance: typeof runComplianceCheck;
    socket: import("socket.io-client").Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
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