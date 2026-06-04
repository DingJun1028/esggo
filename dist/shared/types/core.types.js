"use strict";
/**
 * ESG GO | OmniCore P0 Shared Types & Validators 🌌
 * v3.1 | #OmniCore #Sovereignty #英標繁博 #ZodDriven
 *
 * 英標為骨 (American English Core)，繁博為魂 (Traditional Chinese Soul)
 * 遵循「4可1不可」狀態機 (The 4+1 State Machine)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResonanceResultSchema = exports.VerifyRequestPayloadSchema = exports.SealRequestPayloadSchema = exports.ApiRequestSchema = exports.OmniResponseStatusSchema = exports.OmniRequestTypeSchema = exports.AgentSessionSchema = exports.SwarmAgentSchema = exports.OmniAgentMetricExtractionSchema = exports.OmniAgentMetricSchema = exports.OmniAgentVisionResultSchema = exports.OmniMetricSchema = exports.EternalMemorySchema = exports.EternalMemoryTypeSchema = exports.EternalMemoryType = exports.RestorationInputSchema = exports.IComponentCoreSchema = exports.IEvidenceSchema = exports.T5StatusSchema = exports.I5TGovernanceSchema = void 0;
const zod_1 = require("zod");
// ============================================================
// 1. 5T 協議門：數據治理矩陣 (The 5T Protocol)
// ============================================================
/** 5T 門徑狀態 Schema */
exports.I5TGovernanceSchema = zod_1.z.object({
    /** 真 (Truth)：數據源頭可溯源 (Origin-verified) */
    traceable: zod_1.z.boolean(),
    /** 善 (Goodness)：算法可驗證且透明 (ISO-14064-1) */
    transparent: zod_1.z.boolean(),
    /** 美 (Beauty)：視覺呈現直觀且具質感 (UI/UX Excellence) */
    tangible: zod_1.z.boolean(),
    /** 通 (Transferful)：數據路徑可追蹤 (Lifecycle-aware) */
    trackable: zod_1.z.boolean(),
    /** 信 (Trust)：數據不可篡改 (Hash Locked) */
    trustworthy: zod_1.z.boolean(),
}).readonly();
/** 5T 門徑代碼 (5T Gate Codes) */
exports.T5StatusSchema = zod_1.z.enum([
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
exports.IEvidenceSchema = zod_1.z.object({
    /** 因：原始觸發條件 (Origin Cause) */
    originCause: zod_1.z.string(),
    /** 循：流轉路徑 (Process Trace) */
    processTrace: zod_1.z.array(zod_1.z.string()),
    /** 果：最終執行結果與狀態 (Final Effect) */
    finalEffect: zod_1.z.string(),
    // 兼容屬性 (Compatibility Properties)
    tangible_metric: zod_1.z.string().optional(),
    source_origin: zod_1.z.string().optional(),
    lifecycle_hooks: zod_1.z.array(zod_1.z.string()).optional(),
    formula_ref: zod_1.z.string().optional(),
    causality: zod_1.z.object({
        originCause: zod_1.z.string(),
        processTrace: zod_1.z.array(zod_1.z.string()),
        finalEffect: zod_1.z.string(),
    }).optional(),
});
/** 萬能元件心核 Schema */
exports.IComponentCoreSchema = zod_1.z.object({
    /** 萬能永憶主體唯一識別碼 (Immutable UUID) */
    uuid: zod_1.z.string().uuid(),
    /** 語義化版本控制 (Semantic Version) */
    version: zod_1.z.string(),
    /** 刻印時間戳 (Genesis Timestamp) */
    timestamp: zod_1.z.number(),
    /** 碳排與影響力計算公式 (Transparent Formula) */
    formula: zod_1.z.string(),
    /** 具體影響力指標 (Tangible Impact Metric) */
    impact_metric: zod_1.z.string(),
    /** 唯一的不可狀態 (Trustworthy Status) */
    status: zod_1.z.literal("Trustworthy"),
    /** 數據真理哈希鎖 (Hash Lock) */
    hash_lock: zod_1.z.string(),
    /** 證據左證庫 (Evidence Vault) */
    evidence: zod_1.z.array(exports.IEvidenceSchema),
});
/** 萬能修復輸入 (Restoration Input) */
exports.RestorationInputSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).and(zod_1.z.object({
    metric: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    formula: zod_1.z.string().optional(),
    trigger: zod_1.z.string().optional(),
}));
// ============================================================
// 3. 永恆記憶與智庫 (Eternal Memory & Think Tank)
// ============================================================
exports.EternalMemoryType = {
    EPISODIC: 'EPISODIC',
    SEMANTIC: 'SEMANTIC',
    PROCEDURAL: 'PROCEDURAL',
    SPATIAL: 'SPATIAL',
    EMOTIONAL: 'EMOTIONAL',
    CREATIVE: 'CREATIVE'
};
exports.EternalMemoryTypeSchema = zod_1.z.nativeEnum(exports.EternalMemoryType);
/** 永恆記憶實體 Schema */
exports.EternalMemorySchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: exports.EternalMemoryTypeSchema,
    content: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    timestamp: zod_1.z.number(),
    hash_lock: zod_1.z.string(),
    consolidated: zod_1.z.boolean(),
});
// ============================================================
// 4. 指標與度量 (Metrics & Measures)
// ============================================================
/** 萬能指標 Schema */
exports.OmniMetricSchema = zod_1.z.object({
    id: zod_1.z.string(),
    label: zod_1.z.string(),
    value: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    unit: zod_1.z.string().optional(),
    trend: zod_1.z.number().optional(),
    trendUp: zod_1.z.boolean().optional(),
    gri: zod_1.z.string().optional(),
    t5Status: zod_1.z.string(),
    verified: zod_1.z.boolean(),
    hash: zod_1.z.string().optional(),
    color: zod_1.z.string(),
});
/** 視覺掃描結果 Schema */
exports.OmniAgentVisionResultSchema = zod_1.z.object({
    extraction: zod_1.z.string(),
    confidence: zod_1.z.number(),
    gapAnalysis: zod_1.z.string(),
});
/** 代理人提取指標 Schema */
exports.OmniAgentMetricSchema = zod_1.z.object({
    key: zod_1.z.string(),
    value: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    unit: zod_1.z.string(),
    gri: zod_1.z.string(),
});
/** 指標提取結果 Schema */
exports.OmniAgentMetricExtractionSchema = zod_1.z.object({
    metrics: zod_1.z.array(exports.OmniAgentMetricSchema),
    confidence: zod_1.z.number(),
});
// ============================================================
// 5. 代理人與蜂群 (Agents & Swarm)
// ============================================================
/** 蜂群代理人 Schema */
exports.SwarmAgentSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    role: zod_1.z.string(),
    status: zod_1.z.enum(['active', 'idle', 'processing', 'error']),
    task: zod_1.z.string().optional(),
    progress: zod_1.z.number().optional(),
    skills: zod_1.z.array(zod_1.z.string()),
    t5_score: zod_1.z.number(),
});
/** 代理人對話會話 Schema */
exports.AgentSessionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    persona: zod_1.z.enum(['compliance', 'harmony', 'innovation', 'entropy', 'junaikey']),
    created_at: zod_1.z.number(),
    memory_count: zod_1.z.number(),
});
// ============================================================
// 6. API 傳輸協議 (API Transport Protocols)
// ============================================================
exports.OmniRequestTypeSchema = zod_1.z.enum([
    'query',
    'seal',
    'verify',
    'manifest',
    'remember',
    'analyze',
]);
exports.OmniResponseStatusSchema = zod_1.z.enum([
    'success',
    'processing',
    'sealed',
    'verified',
    'error',
]);
/** 萬能 API 請求 Schema */
exports.ApiRequestSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: exports.OmniRequestTypeSchema,
    content: zod_1.z.string(),
    data: zod_1.z.unknown().optional(),
    timestamp: zod_1.z.number(),
    session_id: zod_1.z.string().optional(),
});
/** 封印請求載荷 Schema */
exports.SealRequestPayloadSchema = zod_1.z.object({
    formula: zod_1.z.string(),
    impact_metric: zod_1.z.any(),
    metric: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    policyId: zod_1.z.string().optional(),
    source_origin: zod_1.z.string(),
    metadata: zod_1.z.any().optional(),
});
/** 校驗請求載荷 Schema */
exports.VerifyRequestPayloadSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid().optional(),
    component: zod_1.z.any().optional(),
});
/** 共鳴分析結果 Schema */
exports.ResonanceResultSchema = zod_1.z.object({
    totalResonance: zod_1.z.number(),
    dimensionalResonance: zod_1.z.object({
        GPL: zod_1.z.number(),
        Notion: zod_1.z.number(),
        AlTable: zod_1.z.number(),
        Others: zod_1.z.number(),
    }),
    conflicts: zod_1.z.array(zod_1.z.any()),
    harmonyRecommendations: zod_1.z.array(zod_1.z.any()),
});
//# sourceMappingURL=core.types.js.map