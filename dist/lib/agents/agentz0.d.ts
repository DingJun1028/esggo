import { z } from 'genkit';
export declare const agentZ0InputSchema: z.ZodObject<{
    query: z.ZodString;
    context: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    query: string;
    context?: any;
}, {
    query: string;
    context?: any;
}>;
export declare const agentZ0Flow: import("genkit").Action<z.ZodObject<{
    query: z.ZodString;
    context: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    query: string;
    context?: any;
}, {
    query: string;
    context?: any;
}>, z.ZodString, z.ZodTypeAny>;
//# sourceMappingURL=agentz0.d.ts.map