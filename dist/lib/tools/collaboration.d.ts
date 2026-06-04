import { z } from 'genkit';
/**
 * Tool: Generate a code snippet to solve a problem.
 * Returns a JavaScript function that can be executed safely.
 */
export declare const codeSynthesisTool: import("genkit").ToolAction<z.ZodObject<{
    problem: z.ZodString;
    agentName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    agentName: string;
    problem: string;
}, {
    agentName: string;
    problem: string;
}>, z.ZodTypeAny>;
/**
 * Tool: Negotiate consensus among agents.
 * Takes multiple agent results and returns a consensus decision.
 */
export declare const negotiationTool: import("genkit").ToolAction<z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        agent: z.ZodString;
        result: z.ZodAny;
        success: z.ZodBoolean;
        error: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        agent: string;
        success: boolean;
        error?: string | undefined;
        result?: any;
    }, {
        agent: string;
        success: boolean;
        error?: string | undefined;
        result?: any;
    }>, "many">;
    task: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task: string;
    results: {
        agent: string;
        success: boolean;
        error?: string | undefined;
        result?: any;
    }[];
}, {
    task: string;
    results: {
        agent: string;
        success: boolean;
        error?: string | undefined;
        result?: any;
    }[];
}>, z.ZodTypeAny>;
//# sourceMappingURL=collaboration.d.ts.map