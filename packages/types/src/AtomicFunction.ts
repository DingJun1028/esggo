import { z } from 'zod';

export interface OmniCoreContext {
  requestId: string;
  timestamp: number;
  actor: string;
  environment: 'development' | 'staging' | 'production';
  traceId?: string;
}

/**
 * 萬能元件心核 (Omni-Component Heart)
 * 所有以「萬能(Omni)」為首的模組/元件，皆共享此核心狀態，確保全系統維度一致、語義共鳴。
 * 這裡，即是「永恆宮殿 (Eternal Palace)」與「記憶聖所 (Sanctuary of Memory)」所在的共同根基位置。
 */
export interface OmniComponentHeart {
  omniSignature: string;          // 證明其為萬能體系的原生防偽簽章 (ZKP Hash)
  resonanceState: number;         // 0.0 - 1.0 的共鳴指數
  omniClass: 'OmniMemory' | 'OmniRune' | 'OmniAgent' | 'OmniTag' | 'OmniLibrary' | 'OmniGeneral';
  coreContext: OmniCoreContext;
}

export interface AtomicFunctionInput<TContext extends OmniCoreContext = OmniCoreContext> {
  context: TContext;
  payload: unknown;
  omniHeart?: OmniComponentHeart; // 可選的萬能心核掛載
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

export const AtomicFunctionSchema = z.function(
  z.tuple([
    z.object({
      context: z.object({
        requestId: z.string(),
        timestamp: z.number(),
        actor: z.string(),
        environment: z.enum(['development', 'staging', 'production']),
        traceId: z.string().optional()
      }),
      payload: z.unknown()
    })
  ])
)
  .returns(
    z.object({
      success: z.boolean(),
      data: z.unknown().optional(),
      error: z.instanceof(Error).optional(),
      metadata: z.object({
        executionTime: z.number(),
        version: z.string()
      }).optional()
    })
  );

// Zod Schema 驗證：萬能元件心核
export const OmniComponentHeartSchema = z.object({
  omniSignature: z.string().regex(/^0x[a-fA-F0-9]+$/, "Must be a valid hex signature"),
  resonanceState: z.number().min(0).max(1),
  omniClass: z.enum(['OmniMemory', 'OmniRune', 'OmniAgent', 'OmniTag', 'OmniLibrary', 'OmniGeneral']),
  coreContext: z.object({
    requestId: z.string(),
    timestamp: z.number(),
    actor: z.string(),
    environment: z.enum(['development', 'staging', 'production']),
    traceId: z.string().optional()
  })
});