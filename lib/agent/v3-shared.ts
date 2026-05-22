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

export type AgentStatus = z.infer<typeof AgentStatusEnum>;

// Discrete block of agent execution state for real-time streaming
export const AgentStepSchema = z.object({
  id: z.string(),
  agentName: z.string(),
  status: AgentStatusEnum,
  message: z.string(),
  payload: z.any().optional(), // Metadata like code, tool output, or error stack
  timestamp: z.string(),
});

export type AgentStep = z.infer<typeof AgentStepSchema>;

export const TaskInputSchema = z.object({
  prompt: z.string().min(1),
  autoRepair: z.boolean().default(true),
  sessionId: z.string().optional(),
});

export type TaskInput = z.infer<typeof TaskInputSchema>;
