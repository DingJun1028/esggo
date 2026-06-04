import { z } from 'zod';
export declare const AgentStatusEnum: z.ZodEnum<["PLANNING", "SEARCHING", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL"]>;
export type AgentStatus = z.infer<typeof AgentStatusEnum>;
export declare const AgentStepSchema: z.ZodObject<{
    id: z.ZodString;
    agentName: z.ZodString;
    status: z.ZodEnum<["PLANNING", "SEARCHING", "CODING", "EXECUTING", "RETRYING", "SUCCESS", "ERROR", "AWAITING_APPROVAL"]>;
    message: z.ZodString;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    timestamp: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    status: "ERROR" | "SUCCESS" | "PLANNING" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL" | "SEARCHING";
    id: string;
    timestamp: string;
    agentName: string;
    payload?: Record<string, unknown> | undefined;
}, {
    message: string;
    status: "ERROR" | "SUCCESS" | "PLANNING" | "CODING" | "EXECUTING" | "RETRYING" | "AWAITING_APPROVAL" | "SEARCHING";
    id: string;
    agentName: string;
    timestamp?: string | undefined;
    payload?: Record<string, unknown> | undefined;
}>;
export type AgentStep = z.infer<typeof AgentStepSchema>;
export declare const TaskInputSchema: z.ZodObject<{
    prompt: z.ZodString;
    autoRepair: z.ZodDefault<z.ZodBoolean>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    autoRepair: boolean;
    sessionId?: string | undefined;
}, {
    prompt: string;
    autoRepair?: boolean | undefined;
    sessionId?: string | undefined;
}>;
export type TaskInput = z.infer<typeof TaskInputSchema>;
//# sourceMappingURL=v3-shared.d.ts.map