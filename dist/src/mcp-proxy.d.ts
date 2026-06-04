export declare const mcp: {
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
//# sourceMappingURL=mcp-proxy.d.ts.map