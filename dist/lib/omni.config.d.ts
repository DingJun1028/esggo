import { z } from 'zod';
export declare function getOmniAgentAI(): Promise<any>;
export declare const ESGArtifactSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    indicators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    confidence: z.ZodNumber;
    gaps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    content: string;
    confidence: number;
    title: string;
    gaps?: string[] | undefined;
    indicators?: string[] | undefined;
}, {
    content: string;
    confidence: number;
    title: string;
    gaps?: string[] | undefined;
    indicators?: string[] | undefined;
}>;
export declare const omniagentConfig: {
    agentName: string;
    version: string;
    agentZ0Enabled: boolean;
    adkOptions: {
        logLevel: string;
        enable5TSeal: boolean;
        swarmThreshold: number;
    };
    personas: {
        researcher: string;
        auditor: string;
        planner: string;
    };
};
//# sourceMappingURL=omni.config.d.ts.map