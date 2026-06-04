import { z } from 'zod';
// Omni-Sovereign Agent V3: Shared Telemetry & Transport Schemas
export const AgentStatusEnum = z.enum([
    'PLANNING',
    'SEARCHING',
    'CODING',
    'EXECUTING',
    'RETRYING',
    'SUCCESS',
    'ERROR',
    'AWAITING_APPROVAL'
]);
// Discrete block of agent execution state for real-time streaming
export const AgentStepSchema = z.object({
    id: z.string(),
    agentName: z.string(),
    status: AgentStatusEnum,
    message: z.string(),
    payload: z.record(z.string(), z.unknown()).optional(),
    timestamp: z.string().datetime({ offset: true }).default(() => new Date().toISOString()),
});
export const TaskInputSchema = z.object({
    prompt: z.string().min(1),
    autoRepair: z.boolean().default(true),
    sessionId: z.string().optional(),
});
//# sourceMappingURL=v3-shared.js.map