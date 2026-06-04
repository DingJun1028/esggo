import { z } from 'genkit';
export declare const getEnvDataTool: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const getSocialDataTool: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const getGovDataTool: import("genkit").ToolAction<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
}, {
    category?: string | undefined;
}>, z.ZodTypeAny>;
export declare const getTasksTool: import("genkit").ToolAction<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodTypeAny>;
export declare const getEvidenceVaultTool: import("genkit").ToolAction<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodTypeAny>;
export declare const getReadingRoomTool: import("genkit").ToolAction<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodTypeAny>;
export interface AgentTool {
    name: string;
    description: string;
    execute?: (input: unknown) => Promise<any>;
}
export declare class AgentZ0 {
    name: string;
    role: string;
    memory: Array<{
        task: string;
        result: string;
    }>;
    tools: unknown[];
    constructor(config: {
        name: string;
        role: string;
        tools?: unknown[];
    });
    runTask(taskDescription: string, dataContext?: Record<string, unknown>): Promise<{
        success: boolean;
        agent: string;
        result: string;
        error?: undefined;
    } | {
        success: boolean;
        agent: string;
        error: unknown;
        result?: undefined;
    }>;
    streamTask(taskDescription: string, dataContext?: Record<string, unknown>): AsyncGenerator<string, void, unknown>;
}
export declare const esgResearchAgent: AgentZ0;
export declare const esgAuditAgent: AgentZ0;
export declare function runESGMultiAgentWorkflow(topic: string): Promise<{
    research: {
        success: boolean;
        agent: string;
        result: string;
        error?: undefined;
    } | {
        success: boolean;
        agent: string;
        error: unknown;
        result?: undefined;
    };
    audit: {
        success: boolean;
        agent: string;
        result: string;
        error?: undefined;
    } | {
        success: boolean;
        agent: string;
        error: unknown;
        result?: undefined;
    };
}>;
//# sourceMappingURL=agentz0.d.ts.map