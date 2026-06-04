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
 * 
 * 元件必須嚴格遵守 5T 協議 (The 5T Protocol)：
 * - Truth (真): Traceable (來源驗證)
 * - Goodness (善): Transparent (算法透明)
 * - Beauty (美): Tangible (UI/UX 可感知)
 * - Trust (信): Trustworthy (密碼學綁定)
 * - Transferful (傳): Trackable (全生命週期追蹤)
 */
export interface OmniComponentHeart {
  omniSignature: string;          // 證明其為萬能體系的原生防偽簽章 (ZKP Hash)
  resonanceState: number;         // 0.0 - 1.0 的共鳴指數
  omniClass: 'OmniMemory' | 'OmniRune' | 'OmniAgent' | 'OmniTag' | 'OmniLibrary' | 'OmniGeneral';
  coreContext: OmniCoreContext;
  fiveTState?: {
    truthTraceable: boolean;
    goodnessTransparent: boolean;
    beautyTangible: boolean;
    trustTrustworthy: boolean;
    transferfulTrackable: boolean;
  };

  // 零知識證明 (Zero-Knowledge Proof) 封印矩陣
  zkpSeal?: {
    commitment: string;      // 佩德森承諾 (Pedersen Commitment) 值: C = (g^m) * (h^r)
    blindingFactor?: string; // 盲化因子 (Blinding Factor)，僅在需要開啟驗證時提供
    sealedAt: number;        // 封印的時間戳記
  };
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
    locaversion: string;
  };
}

export type AtomicFunction<
  TInput extends AtomicFunctionInput,
  TOutput,
  TError = Error
> = (input: TInput) => Promise<AtomicFunctionResult<TOutput, TError>>;

export const AtomicFunctionSchema = z.function()
  .args(
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
  }),
  fiveTState: z.object({
    truthTraceable: z.boolean(),
    goodnessTransparent: z.boolean(),
    beautyTangible: z.boolean(),
    trustTrustworthy: z.boolean(),
    transferfulTrackable: z.boolean()
  }).optional(),
  zkpSeal: z.object({
    commitment: z.string(),
    blindingFactor: z.string().optional(),
    sealedAt: z.number()
  }).optional()
});