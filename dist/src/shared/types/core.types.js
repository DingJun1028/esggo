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
/** 5T 門徑代碼 (5T Gate Codes) */
export const T5StatusSchema = z.enum([
    'Traceable', // 真
    'Transparent', // 善
    'Tangible', // 美
    'Trackable', // 通
    'Trustworthy', // 信
]);
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
/** 萬能修復輸入 (Restoration Input) */
export const RestorationInputSchema = z.record(z.string(), z.unknown()).and(z.object({
    metric: z.string().optional(),
    source: z.string().optional(),
    formula: z.string().optional(),
    trigger: z.string().optional(),
}));
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
};
export const EternalMemoryTypeSchema = z.nativeEnum(EternalMemoryType);
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
/** 視覺掃描結果 Schema */
export const OmniAgentVisionResultSchema = z.object({
    extraction: z.string(),
    confidence: z.number(),
    gapAnalysis: z.string(),
});
/** 代理人提取指標 Schema */
export const OmniAgentMetricSchema = z.object({
    key: z.string(),
    value: z.union([z.number(), z.string()]),
    unit: z.string(),
    gri: z.string(),
});
/** 指標提取結果 Schema */
export const OmniAgentMetricExtractionSchema = z.object({
    metrics: z.array(OmniAgentMetricSchema),
    confidence: z.number(),
});
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
/** 代理人對話會話 Schema */
export const AgentSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    persona: z.enum(['compliance', 'harmony', 'innovation', 'entropy', 'junaikey']),
    created_at: z.number(),
    memory_count: z.number(),
});
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
export const OmniResponseStatusSchema = z.enum([
    'success',
    'processing',
    'sealed',
    'verified',
    'error',
]);
/** 萬能 API 請求 Schema */
export const ApiRequestSchema = z.object({
    id: z.string(),
    type: OmniRequestTypeSchema,
    content: z.string(),
    data: z.unknown().optional(),
    timestamp: z.number(),
    session_id: z.string().optional(),
});
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
/** 校驗請求載荷 Schema */
export const VerifyRequestPayloadSchema = z.object({
    uuid: z.string().uuid().optional(),
    component: z.any().optional(),
});
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
//# sourceMappingURL=core.types.js.map