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
 * - T1 Tangible (具體): 數據可感知、具體化
 * - T2 Traceable (溯源): 來源可追溯、具備憑證
 * - T3 Trackable (追蹤): 軌跡可監測、完整日誌
 * - T4 Transparent (透明): 算法透明、無 AI 幻覺
 * - T5 Trustworthy (信賴): 主權封印、不可篡改
 */
export interface OmniComponentHeart {
  omniSignature: string; // 證明其為萬能體系的原生防偽簽章 (ZKP Hash)
  resonanceState: number; // 0.0 - 1.0 的共鳴指數
  omniClass: 'OmniMemory' | 'OmniRune' | 'OmniAgent' | 'OmniTag' | 'OmniLibrary' | 'OmniGeneral';
  coreContext: OmniCoreContext;
  fiveTState?: {
    tangible: boolean;
    traceable: boolean;
    trackable: boolean;
    transparent: boolean;
    trustworthy: boolean;
  };

  // 零知識證明 (Zero-Knowledge Proof) 封印矩陣
  zkpSeal?: {
    commitment: string; // 佩德森承諾 (Pedersen Commitment) 值: C = (g^m) * (h^r)
    blindingFactor?: string; // 盲化因子 (Blinding Factor)，僅在需要開啟驗證時提供
    sealedAt: number; // 封印的時間戳記
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
    version: string;
  };
}

export type AtomicFunction<TInput extends AtomicFunctionInput, TOutput, TError = Error> = (
  input: TInput
) => Promise<AtomicFunctionResult<TOutput, TError>>;

export const AtomicFunctionSchema = z
  .function(
    z.tuple([
      z.object({
        context: z.object({
          requestId: z.string(),
          timestamp: z.number(),
          actor: z.string(),
          environment: z.enum(['development', 'staging', 'production']),
          traceId: z.string().optional(),
        }),
        payload: z.unknown(),
      }),
    ])
  )
  .returns(
    z.object({
      success: z.boolean(),
      data: z.unknown().optional(),
      error: z.instanceof(Error).optional(),
      metadata: z
        .object({
          executionTime: z.number(),
          version: z.string(),
        })
        .optional(),
    })
  );

// Zod Schema 驗證：萬能元件心核
export const OmniComponentHeartSchema = z.object({
  omniSignature: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Must be a valid hex signature'),
  resonanceState: z.number().min(0).max(1),
  omniClass: z.enum([
    'OmniMemory',
    'OmniRune',
    'OmniAgent',
    'OmniTag',
    'OmniLibrary',
    'OmniGeneral',
  ]),
  coreContext: z.object({
    requestId: z.string(),
    timestamp: z.number(),
    actor: z.string(),
    environment: z.enum(['development', 'staging', 'production']),
    traceId: z.string().optional(),
  }),
  fiveTState: z
    .object({
      tangible: z.boolean(),
      traceable: z.boolean(),
      trackable: z.boolean(),
      transparent: z.boolean(),
      trustworthy: z.boolean(),
    })
    .optional(),
  zkpSeal: z
    .object({
      commitment: z.string(),
      blindingFactor: z.string().optional(),
      sealedAt: z.number(),
    })
    .optional(),
});
