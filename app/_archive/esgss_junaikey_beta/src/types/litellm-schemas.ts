/**
 * 🔐 LiteLLM Schemas - Zod Validation Schemas
 * --------------------------------------------------
 * [核心] 使用 Zod 進行運行時類型驗證
 * [功能] 確保 API 回應的類型安全性
 */

import { z } from 'zod';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// ============================================================================
// Chat Message Schemas
// ============================================================================

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string(),
  name: z.string().optional(),
  tool_call_id: z.string().optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ============================================================================
// Completion Schemas
// ============================================================================

export const CompletionOptionsSchema = z.object({
  model: z.string().optional(),
  messages: z.array(ChatMessageSchema),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().optional(),
  responseFormat: z
    .object({
      type: z.enum(['text', 'json_object']),
    })
    .optional(),
});

export type CompletionOptions = z.infer<typeof CompletionOptionsSchema>;

export const UsageSchema = z.object({
  promptTokens: z.number(),
  completionTokens: z.number(),
  totalTokens: z.number(),
});

export const CompletionResultSchema = z.object({
  content: z.string(),
  model: z.string(),
  usage: UsageSchema,
  finishReason: z.string(),
  toolCalls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal('function'),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      })
    )
    .optional(),
});

export type CompletionResult = z.infer<typeof CompletionResultSchema>;

// ============================================================================
// MCP Schemas
// ============================================================================

export const MCPServerConfigSchema = z.object({
  serverLabel: z.string(),
  serverUrl: z.string(),
  description: z.string().optional(),
  transport: z.enum(['http', 'stdio']).optional(),
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
});

export type MCPServerConfig = z.infer<typeof MCPServerConfigSchema>;

export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.unknown()),
});

export type MCPTool = z.infer<typeof MCPToolSchema>;

// ============================================================================
// A2A Protocol Schemas
// ============================================================================

export const A2AMessagePartSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('text'),
    text: z.string(),
  }),
  z.object({
    kind: z.literal('file'),
    file: z.object({
      name: z.string(),
      mimeType: z.string(),
      bytes: z.string(),
    }),
  }),
  z.object({
    kind: z.literal('tool_call'),
    toolCall: z.object({
      id: z.string(),
      name: z.string(),
      arguments: z.record(z.unknown()),
    }),
  }),
  z.object({
    kind: z.literal('tool_result'),
    toolResult: z.object({
      id: z.string(),
      name: z.string(),
      result: z.unknown(),
      error: z.string().optional(),
    }),
  }),
]);

export type A2AMessagePart = z.infer<typeof A2AMessagePartSchema>;

export const A2AMessageSchema = z.object({
  role: z.enum(['user', 'agent']),
  parts: z.array(A2AMessagePartSchema),
  messageId: z.string(),
});

export type A2AMessage = z.infer<typeof A2AMessageSchema>;

export const A2AAgentCardSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  version: z.string(),
  capabilities: z.array(z.string()),
  provider: z
    .object({
      name: z.string(),
      url: z.string().url().optional(),
    })
    .optional(),
});

export type A2AAgentCard = z.infer<typeof A2AAgentCardSchema>;

export const A2AResponseSchema = z.object({
  id: z.string(),
  result: z
    .object({
      message: A2AMessageSchema,
    })
    .optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
      data: z.unknown().optional(),
    })
    .optional(),
});

export type A2AResponse = z.infer<typeof A2AResponseSchema>;

// ============================================================================
// ESG-Specific Schemas
// ============================================================================

export const ESGScoresSchema = z.object({
  environmental: z.number().min(0).max(100),
  social: z.number().min(0).max(100),
  governance: z.number().min(0).max(100),
  overall: z.number().min(0).max(100).optional(),
});

export type ESGScores = z.infer<typeof ESGScoresSchema>;

export const CarbonMetricsSchema = z.object({
  scope1: z.number().nonnegative(),
  scope2: z.number().nonnegative(),
  scope3: z.number().nonnegative().optional(),
  unit: z.enum(['tCO2e', 'kgCO2e', 'MtCO2e']).default('tCO2e'),
  year: z.number().int().min(2000).max(2100),
  verified: z.boolean().default(false),
  itr: z.number().min(1).max(5).optional(), // Implied Temperature Rise
});

export type CarbonMetrics = z.infer<typeof CarbonMetricsSchema>;

export const ESGAnalysisRequestSchema = z.object({
  companyId: z.string(),
  analysisType: z.enum(['carbon', 'social', 'governance', 'comprehensive']),
  reportingStandard: z.enum(['GRI', 'SASB', 'TCFD', 'CDP', 'ISSB']).optional(),
  year: z.number().int().optional(),
  data: z.record(z.unknown()).optional(),
});

export type ESGAnalysisRequest = z.infer<typeof ESGAnalysisRequestSchema>;

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Safe parse with error logging
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T | null {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  omniLogger.warn(
    LogCategory.VALIDATION,
    `Zod validation failed${context ? ` for ${context}` : ''}`,
    { issues: result.error.issues }
  );
  return null;
}

/**
 * Parse with error throwing
 */
export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = `Validation failed${context ? ` for ${context}` : ''}: ${error.issues.map(i => i.message).join(', ')}`;
      throw new Error(message);
    }
    throw error;
  }
}
