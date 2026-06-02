import { z } from 'zod';

export interface OmniCoreContext {
  requestId: string;
  timestamp: number;
  actor: string;
  environment: 'development' | 'staging' | 'production';
  traceId?: string;
}

export interface AtomicFunctionInput<TContext extends OmniCoreContext = OmniCoreContext> {
  context: TContext;
  payload: unknown;
}

export interface AtomicFunctionResult<TData = unknown, TError = Error> {
  success: boolean;
  data?: TData;
  error?: TError;
  metadata?: {
    executionTime: number;
    version: string;
  };
}

export type AtomicFunction<
  TInput extends AtomicFunctionInput,
  TOutput,
  TError = Error
> = (input: TInput) => Promise<AtomicFunctionResult<TOutput, TError>>;

export const AtomicFunctionSchema = z.function()
  .args(z.object({
    context: z.object({
      requestId: z.string(),
      timestamp: z.number(),
      actor: z.string(),
      environment: z.enum(['development', 'staging', 'production']),
      traceId: z.string().optional()
    }),
    payload: z.unknown()
  }))
  .returns(z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.instanceof(Error).optional(),
    metadata: z.object({
      executionTime: z.number(),
      version: z.string()
    }).optional()
  }));