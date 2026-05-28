/**
 * ESG GO | OmniCore P0 Shared Types & Validators 🌌
 * v3.1 | #OmniCore #Sovereignty #英標繁博 #ZodDriven
 * 
 * 英標為骨 (American English Core)，繁博為魂 (Traditional Chinese Soul)
 * 遵循「4可1不可」狀態機 (The 4+1 State Machine)
 */

import { z } from 'zod';

// ============================================================
// 1. 5T 協議門：數據治理矩陣 (The 5T Protocol)
// ============================================================

/** 5T 門徑狀態 Schema */
export const I5TGovernanceSchema = z.object({
  /** 真 (Truth)：數據源頭可溯源 (Origin-verified) */
  traceable: z.boolean(),
  /** 善 (Goodness)：算法可驗證且透明 (ISO-14064-1) */
  transparent: z.boolean(),
  /** 美 (Beauty)：視覺呈現直觀且具質感 (UI/UX Excellence) */
  tangible: z.boolean(),
  /** 通 (Transferful)：數據路徑可追蹤 (Lifecycle-aware) */
  trackable: z.boolean(),
  /** 信 (Trust)：數據不可篡改 (Hash Locked) */
  trustworthy: z.boolean(),
}).readonly();

export type I5TGovernance = z.infer<typeof I5TGovernanceSchema>;
export type T5GateState = I5TGovernance;

/** 5T 門徑代碼 (5T Gate Codes) */
export const T5StatusSchema = z.enum([
  'Traceable',    // 真
  'Transparent',  // 善
  'Tangible',     // 美
  'Trackable',    // 通
  'Trustworthy',  // 信
]);

export type T5Status = z.infer<typeof T5StatusSchema>;

// ============================================================
// 2. 萬能元件心核 (Omni Component Core)
// ============================================================

/** 證據佐證庫 Schema (觀因循果) */
export const IEvidenceSchema = z.object({
  /** 因：原始觸發條件 (Origin Cause) */
  originCause: z.string(),
  /** 循：流轉路徑 (Process Trace) */
  processTrace: z.array(z.string()),
  /** 果：最終執行結果與狀態 (Final Effect) */
  finalEffect: z.string(),

  // 兼容屬性 (Compatibility Properties)
  tangible_metric: z.string().optional(),
  source_origin: z.string().optional(),
  lifecycle_hooks: z.array(z.string()).optional(),
  formula_ref: z.string().optional(),
  causality: z.object({
    originCause: z.string(),
    processTrace: z.array(z.string()),
    finalEffect: z.string(),
  }).optional(),
});

export type IEvidence = z.infer<typeof IEvidenceSchema>;

/**
 * @interface IRestorationProtocol
 * @description 萬能修復協議 (Omni Restoration Protocol)
 */
export interface IRestorationProtocol {
  /** 鏈式校驗 (Chain Validation) */
  validateChain(uuid: string): Promise<boolean>;
  /** 殘影重組 (Ghost Recomposition) */
  recompose(hashLock: string): Promise<IComponentCore>;
  /** 語義修正 (Semantic Alignment) */
  align(target: IComponentCore): Promise<IComponentCore>;
}

/** 萬能元件心核 Schema */
export const IComponentCoreSchema = z.object({
  /** 萬能永憶主體唯一識別碼 (Immutable UUID) */
  uuid: z.string().uuid(),
  /** 語義化版本控制 (Semantic Version) */
  version: z.string(),
  /** 刻印時間戳 (Genesis Timestamp) */
  timestamp: z.number(),
  
  /** 碳排與影響力計算公式 (Transparent Formula) */
  formula: z.string(),
  /** 具體影響力指標 (Tangible Impact Metric) */
  impact_metric: z.string(),
  /** 唯一的不可狀態 (Trustworthy Status) */
  status: z.literal("Trustworthy"),
  /** 數據真理哈希鎖 (Hash Lock) */
  hash_lock: z.string(),
  
  /** 證據左證庫 (Evidence Vault) */
  evidence: z.array(IEvidenceSchema),
});

export type IComponentCore = z.infer<typeof IComponentCoreSchema>;

/** 萬能修復輸入 (Restoration Input) */
export const RestorationInputSchema = z.record(z.string(), z.unknown()).and(z.object({
  metric: z.string().optional(),
  source: z.string().optional(),
  formula: z.string().optional(),
  trigger: z.string().optional(),
}));

export type RestorationInput = z.infer<typeof RestorationInputSchema>;

// ============================================================
// 3. 永恆記憶與智庫 (Eternal Memory & Think Tank)
// ============================================================

export const EternalMemoryType = {
  EPISODIC: 'EPISODIC',
  SEMANTIC: 'SEMANTIC',
  PROCEDURAL: 'PROCEDURAL',
  SPATIAL: 'SPATIAL',
  EMOTIONAL: 'EMOTIONAL',
  CREATIVE: 'CREATIVE'
} as const;

export const EternalMemoryTypeSchema = z.nativeEnum(EternalMemoryType);
export type EternalMemoryType = z.infer<typeof EternalMemoryTypeSchema>;

/** 永恆記憶實體 Schema */
export const EternalMemorySchema = z.object({
  id: z.string(),
  type: EternalMemoryTypeSchema,
  content: z.string(),
  tags: z.array(z.string()),
  timestamp: z.number(),
  hash_lock: z.string(),
  consolidated: z.boolean(),
});

export type EternalMemory = z.infer<typeof EternalMemorySchema>;

// ============================================================
// 4. 指標與度量 (Metrics & Measures)
// ============================================================

/** 萬能指標 Schema */
export const OmniMetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  trend: z.number().optional(),
  trendUp: z.boolean().optional(),
  gri: z.string().optional(),
  t5Status: z.string(),
  verified: z.boolean(),
  hash: z.string().optional(),
  color: z.string(),
});

export type OmniMetric = z.infer<typeof OmniMetricSchema>;

/** 視覺掃描結果 Schema */
export const OmniAgentVisionResultSchema = z.object({
  extraction: z.string(),
  confidence: z.number(),
  gapAnalysis: z.string(),
});

export type OmniAgentVisionResult = z.infer<typeof OmniAgentVisionResultSchema>;

/** 代理人提取指標 Schema */
export const OmniAgentMetricSchema = z.object({
  key: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string(),
  gri: z.string(),
});

export type OmniAgentMetric = z.infer<typeof OmniAgentMetricSchema>;

/** 指標提取結果 Schema */
export const OmniAgentMetricExtractionSchema = z.object({
  metrics: z.array(OmniAgentMetricSchema),
  confidence: z.number(),
});

export type OmniAgentMetricExtraction = z.infer<typeof OmniAgentMetricExtractionSchema>;

// ============================================================
// 5. 代理人與蜂群 (Agents & Swarm)
// ============================================================

/** 蜂群代理人 Schema */
export const SwarmAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  status: z.enum(['active', 'idle', 'processing', 'error']),
  task: z.string().optional(),
  progress: z.number().optional(),
  skills: z.array(z.string()),
  t5_score: z.number(),
});

export type SwarmAgent = z.infer<typeof SwarmAgentSchema>;

/** 代理人對話會話 Schema */
export const AgentSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  persona: z.enum(['compliance', 'harmony', 'innovation', 'entropy', 'junaikey']),
  created_at: z.number(),
  memory_count: z.number(),
});

export type AgentSession = z.infer<typeof AgentSessionSchema>;

// ============================================================
// 6. API 傳輸協議 (API Transport Protocols)
// ============================================================

export const OmniRequestTypeSchema = z.enum([
  'query',
  'seal',
  'verify',
  'manifest',
  'remember',
  'analyze',
]);

export type OmniRequestType = z.infer<typeof OmniRequestTypeSchema>;

export const OmniResponseStatusSchema = z.enum([
  'success',
  'processing',
  'sealed',
  'verified',
  'error',
]);

export type OmniResponseStatus = z.infer<typeof OmniResponseStatusSchema>;

/** 記憶整合結果結構 */
export interface ConsolidationResult {
  success: boolean;
  summary: string;
  count: number;
  error?: string;
}

/** 萬能 API 請求 Schema */
export const ApiRequestSchema = z.object({
  id: z.string(),
  type: OmniRequestTypeSchema,
  content: z.string(),
  data: z.unknown().optional(),
  timestamp: z.number(),
  session_id: z.string().optional(),
});

export type ApiRequest<T = unknown> = z.infer<typeof ApiRequestSchema> & { data?: T };

/** 封印請求載荷 Schema */
export const SealRequestPayloadSchema = z.object({
  formula: z.string(),
  impact_metric: z.any(),
  metric: z.string().optional(),
  source: z.string().optional(),
  policyId: z.string().optional(),
  source_origin: z.string(),
  metadata: z.any().optional(),
});

export type SealRequestPayload = z.infer<typeof SealRequestPayloadSchema>;

/** 校驗請求載荷 Schema */
export const VerifyRequestPayloadSchema = z.object({
  uuid: z.string().uuid().optional(),
  component: z.any().optional(),
});

export type VerifyRequestPayload = z.infer<typeof VerifyRequestPayloadSchema>;

/** 共鳴分析結果 Schema */
export const ResonanceResultSchema = z.object({
  totalResonance: z.number(),
  dimensionalResonance: z.object({
    GPL: z.number(),
    Notion: z.number(),
    AlTable: z.number(),
    Others: z.number(),
  }),
  conflicts: z.array(z.any()),
  harmonyRecommendations: z.array(z.any()),
});

export type ResonanceResult = z.infer<typeof ResonanceResultSchema>;
