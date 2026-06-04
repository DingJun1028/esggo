/**
 * ESG GO | OmniCore P0 Shared Types & Validators 🌌
 * v3.1 | #OmniCore #Sovereignty #英標繁博 #ZodDriven
 *
 * 英標為骨 (American English Core)，繁博為魂 (Traditional Chinese Soul)
 * 遵循「4可1不可」狀態機 (The 4+1 State Machine)
 */
import { z } from 'zod';
/** 5T 門徑狀態 Schema */
export declare const I5TGovernanceSchema: z.ZodReadonly<z.ZodObject<{
    /** 真 (Truth)：數據源頭可溯源 (Origin-verified) */
    traceable: z.ZodBoolean;
    /** 善 (Goodness)：算法可驗證且透明 (ISO-14064-1) */
    transparent: z.ZodBoolean;
    /** 美 (Beauty)：視覺呈現直觀且具質感 (UI/UX Excellence) */
    tangible: z.ZodBoolean;
    /** 通 (Transferful)：數據路徑可追蹤 (Lifecycle-aware) */
    trackable: z.ZodBoolean;
    /** 信 (Trust)：數據不可篡改 (Hash Locked) */
    trustworthy: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    traceable: boolean;
    transparent: boolean;
    tangible: boolean;
    trackable: boolean;
    trustworthy: boolean;
}, {
    traceable: boolean;
    transparent: boolean;
    tangible: boolean;
    trackable: boolean;
    trustworthy: boolean;
}>>;
export type I5TGovernance = z.infer<typeof I5TGovernanceSchema>;
export type T5GateState = I5TGovernance;
/** 5T 門徑代碼 (5T Gate Codes) */
export declare const T5StatusSchema: z.ZodEnum<["Traceable", "Transparent", "Tangible", "Trackable", "Trustworthy"]>;
export type T5Status = z.infer<typeof T5StatusSchema>;
/** 證據佐證庫 Schema (觀因循果) */
export declare const IEvidenceSchema: z.ZodObject<{
    /** 因：原始觸發條件 (Origin Cause) */
    originCause: z.ZodString;
    /** 循：流轉路徑 (Process Trace) */
    processTrace: z.ZodArray<z.ZodString, "many">;
    /** 果：最終執行結果與狀態 (Final Effect) */
    finalEffect: z.ZodString;
    tangible_metric: z.ZodOptional<z.ZodString>;
    source_origin: z.ZodOptional<z.ZodString>;
    lifecycle_hooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    formula_ref: z.ZodOptional<z.ZodString>;
    causality: z.ZodOptional<z.ZodObject<{
        originCause: z.ZodString;
        processTrace: z.ZodArray<z.ZodString, "many">;
        finalEffect: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
    }, {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
    source_origin?: string | undefined;
    tangible_metric?: string | undefined;
    lifecycle_hooks?: string[] | undefined;
    formula_ref?: string | undefined;
    causality?: {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
    } | undefined;
}, {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
    source_origin?: string | undefined;
    tangible_metric?: string | undefined;
    lifecycle_hooks?: string[] | undefined;
    formula_ref?: string | undefined;
    causality?: {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
    } | undefined;
}>;
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
export declare const IComponentCoreSchema: z.ZodObject<{
    /** 萬能永憶主體唯一識別碼 (Immutable UUID) */
    uuid: z.ZodString;
    /** 語義化版本控制 (Semantic Version) */
    version: z.ZodString;
    /** 刻印時間戳 (Genesis Timestamp) */
    timestamp: z.ZodNumber;
    /** 碳排與影響力計算公式 (Transparent Formula) */
    formula: z.ZodString;
    /** 具體影響力指標 (Tangible Impact Metric) */
    impact_metric: z.ZodString;
    /** 唯一的不可狀態 (Trustworthy Status) */
    status: z.ZodLiteral<"Trustworthy">;
    /** 數據真理哈希鎖 (Hash Lock) */
    hash_lock: z.ZodString;
    /** 證據左證庫 (Evidence Vault) */
    evidence: z.ZodArray<z.ZodObject<{
        /** 因：原始觸發條件 (Origin Cause) */
        originCause: z.ZodString;
        /** 循：流轉路徑 (Process Trace) */
        processTrace: z.ZodArray<z.ZodString, "many">;
        /** 果：最終執行結果與狀態 (Final Effect) */
        finalEffect: z.ZodString;
        tangible_metric: z.ZodOptional<z.ZodString>;
        source_origin: z.ZodOptional<z.ZodString>;
        lifecycle_hooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        formula_ref: z.ZodOptional<z.ZodString>;
        causality: z.ZodOptional<z.ZodObject<{
            originCause: z.ZodString;
            processTrace: z.ZodArray<z.ZodString, "many">;
            finalEffect: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        }, {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
        source_origin?: string | undefined;
        tangible_metric?: string | undefined;
        lifecycle_hooks?: string[] | undefined;
        formula_ref?: string | undefined;
        causality?: {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        } | undefined;
    }, {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
        source_origin?: string | undefined;
        tangible_metric?: string | undefined;
        lifecycle_hooks?: string[] | undefined;
        formula_ref?: string | undefined;
        causality?: {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "Trustworthy";
    timestamp: number;
    uuid: string;
    formula: string;
    impact_metric: string;
    hash_lock: string;
    evidence: {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
        source_origin?: string | undefined;
        tangible_metric?: string | undefined;
        lifecycle_hooks?: string[] | undefined;
        formula_ref?: string | undefined;
        causality?: {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        } | undefined;
    }[];
    version: string;
}, {
    status: "Trustworthy";
    timestamp: number;
    uuid: string;
    formula: string;
    impact_metric: string;
    hash_lock: string;
    evidence: {
        originCause: string;
        processTrace: string[];
        finalEffect: string;
        source_origin?: string | undefined;
        tangible_metric?: string | undefined;
        lifecycle_hooks?: string[] | undefined;
        formula_ref?: string | undefined;
        causality?: {
            originCause: string;
            processTrace: string[];
            finalEffect: string;
        } | undefined;
    }[];
    version: string;
}>;
export type IComponentCore = z.infer<typeof IComponentCoreSchema>;
/** 萬能修復輸入 (Restoration Input) */
export declare const RestorationInputSchema: z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodObject<{
    metric: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    formula: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    formula?: string | undefined;
    metric?: string | undefined;
    source?: string | undefined;
    trigger?: string | undefined;
}, {
    formula?: string | undefined;
    metric?: string | undefined;
    source?: string | undefined;
    trigger?: string | undefined;
}>>;
export type RestorationInput = z.infer<typeof RestorationInputSchema>;
export declare const EternalMemoryType: {
    readonly EPISODIC: "EPISODIC";
    readonly SEMANTIC: "SEMANTIC";
    readonly PROCEDURAL: "PROCEDURAL";
    readonly SPATIAL: "SPATIAL";
    readonly EMOTIONAL: "EMOTIONAL";
    readonly CREATIVE: "CREATIVE";
};
export declare const EternalMemoryTypeSchema: z.ZodNativeEnum<{
    readonly EPISODIC: "EPISODIC";
    readonly SEMANTIC: "SEMANTIC";
    readonly PROCEDURAL: "PROCEDURAL";
    readonly SPATIAL: "SPATIAL";
    readonly EMOTIONAL: "EMOTIONAL";
    readonly CREATIVE: "CREATIVE";
}>;
export type EternalMemoryType = z.infer<typeof EternalMemoryTypeSchema>;
/** 永恆記憶實體 Schema */
export declare const EternalMemorySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodNativeEnum<{
        readonly EPISODIC: "EPISODIC";
        readonly SEMANTIC: "SEMANTIC";
        readonly PROCEDURAL: "PROCEDURAL";
        readonly SPATIAL: "SPATIAL";
        readonly EMOTIONAL: "EMOTIONAL";
        readonly CREATIVE: "CREATIVE";
    }>;
    content: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    timestamp: z.ZodNumber;
    hash_lock: z.ZodString;
    consolidated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "EPISODIC" | "SEMANTIC" | "PROCEDURAL" | "SPATIAL" | "EMOTIONAL" | "CREATIVE";
    content: string;
    id: string;
    timestamp: number;
    hash_lock: string;
    tags: string[];
    consolidated: boolean;
}, {
    type: "EPISODIC" | "SEMANTIC" | "PROCEDURAL" | "SPATIAL" | "EMOTIONAL" | "CREATIVE";
    content: string;
    id: string;
    timestamp: number;
    hash_lock: string;
    tags: string[];
    consolidated: boolean;
}>;
export type EternalMemory = z.infer<typeof EternalMemorySchema>;
/** 萬能指標 Schema */
export declare const OmniMetricSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    unit: z.ZodOptional<z.ZodString>;
    trend: z.ZodOptional<z.ZodNumber>;
    trendUp: z.ZodOptional<z.ZodBoolean>;
    gri: z.ZodOptional<z.ZodString>;
    t5Status: z.ZodString;
    verified: z.ZodBoolean;
    hash: z.ZodOptional<z.ZodString>;
    color: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    id: string;
    color: string;
    label: string;
    t5Status: string;
    verified: boolean;
    hash?: string | undefined;
    unit?: string | undefined;
    trend?: number | undefined;
    trendUp?: boolean | undefined;
    gri?: string | undefined;
}, {
    value: string | number;
    id: string;
    color: string;
    label: string;
    t5Status: string;
    verified: boolean;
    hash?: string | undefined;
    unit?: string | undefined;
    trend?: number | undefined;
    trendUp?: boolean | undefined;
    gri?: string | undefined;
}>;
export type OmniMetric = z.infer<typeof OmniMetricSchema>;
/** 視覺掃描結果 Schema */
export declare const OmniAgentVisionResultSchema: z.ZodObject<{
    extraction: z.ZodString;
    confidence: z.ZodNumber;
    gapAnalysis: z.ZodString;
}, "strip", z.ZodTypeAny, {
    extraction: string;
    confidence: number;
    gapAnalysis: string;
}, {
    extraction: string;
    confidence: number;
    gapAnalysis: string;
}>;
export type OmniAgentVisionResult = z.infer<typeof OmniAgentVisionResultSchema>;
/** 代理人提取指標 Schema */
export declare const OmniAgentMetricSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    unit: z.ZodString;
    gri: z.ZodString;
}, "strip", z.ZodTypeAny, {
    key: string;
    value: string | number;
    unit: string;
    gri: string;
}, {
    key: string;
    value: string | number;
    unit: string;
    gri: string;
}>;
export type OmniAgentMetric = z.infer<typeof OmniAgentMetricSchema>;
/** 指標提取結果 Schema */
export declare const OmniAgentMetricExtractionSchema: z.ZodObject<{
    metrics: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        unit: z.ZodString;
        gri: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value: string | number;
        unit: string;
        gri: string;
    }, {
        key: string;
        value: string | number;
        unit: string;
        gri: string;
    }>, "many">;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    metrics: {
        key: string;
        value: string | number;
        unit: string;
        gri: string;
    }[];
}, {
    confidence: number;
    metrics: {
        key: string;
        value: string | number;
        unit: string;
        gri: string;
    }[];
}>;
export type OmniAgentMetricExtraction = z.infer<typeof OmniAgentMetricExtractionSchema>;
/** 蜂群代理人 Schema */
export declare const SwarmAgentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    status: z.ZodEnum<["active", "idle", "processing", "error"]>;
    task: z.ZodOptional<z.ZodString>;
    progress: z.ZodOptional<z.ZodNumber>;
    skills: z.ZodArray<z.ZodString, "many">;
    t5_score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "error" | "active" | "idle" | "processing";
    id: string;
    name: string;
    role: string;
    skills: string[];
    t5_score: number;
    task?: string | undefined;
    progress?: number | undefined;
}, {
    status: "error" | "active" | "idle" | "processing";
    id: string;
    name: string;
    role: string;
    skills: string[];
    t5_score: number;
    task?: string | undefined;
    progress?: number | undefined;
}>;
export type SwarmAgent = z.infer<typeof SwarmAgentSchema>;
/** 代理人對話會話 Schema */
export declare const AgentSessionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    persona: z.ZodEnum<["compliance", "harmony", "innovation", "entropy", "junaikey"]>;
    created_at: z.ZodNumber;
    memory_count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    created_at: number;
    id: string;
    name: string;
    persona: "compliance" | "harmony" | "innovation" | "entropy" | "junaikey";
    memory_count: number;
}, {
    created_at: number;
    id: string;
    name: string;
    persona: "compliance" | "harmony" | "innovation" | "entropy" | "junaikey";
    memory_count: number;
}>;
export type AgentSession = z.infer<typeof AgentSessionSchema>;
export declare const OmniRequestTypeSchema: z.ZodEnum<["query", "seal", "verify", "manifest", "remember", "analyze"]>;
export type OmniRequestType = z.infer<typeof OmniRequestTypeSchema>;
export declare const OmniResponseStatusSchema: z.ZodEnum<["success", "processing", "sealed", "verified", "error"]>;
export type OmniResponseStatus = z.infer<typeof OmniResponseStatusSchema>;
/** 記憶整合結果結構 */
export interface ConsolidationResult {
    success: boolean;
    summary: string;
    count: number;
    error?: string;
}
/** 萬能 API 請求 Schema */
export declare const ApiRequestSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["query", "seal", "verify", "manifest", "remember", "analyze"]>;
    content: z.ZodString;
    data: z.ZodOptional<z.ZodUnknown>;
    timestamp: z.ZodNumber;
    session_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "query" | "seal" | "verify" | "manifest" | "remember" | "analyze";
    content: string;
    id: string;
    timestamp: number;
    data?: unknown;
    session_id?: string | undefined;
}, {
    type: "query" | "seal" | "verify" | "manifest" | "remember" | "analyze";
    content: string;
    id: string;
    timestamp: number;
    data?: unknown;
    session_id?: string | undefined;
}>;
export type ApiRequest<T = unknown> = z.infer<typeof ApiRequestSchema> & {
    data?: T;
};
/** 封印請求載荷 Schema */
export declare const SealRequestPayloadSchema: z.ZodObject<{
    formula: z.ZodString;
    impact_metric: z.ZodAny;
    metric: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    policyId: z.ZodOptional<z.ZodString>;
    source_origin: z.ZodString;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    formula: string;
    source_origin: string;
    metadata?: any;
    impact_metric?: any;
    metric?: string | undefined;
    source?: string | undefined;
    policyId?: string | undefined;
}, {
    formula: string;
    source_origin: string;
    metadata?: any;
    impact_metric?: any;
    metric?: string | undefined;
    source?: string | undefined;
    policyId?: string | undefined;
}>;
export type SealRequestPayload = z.infer<typeof SealRequestPayloadSchema>;
/** 校驗請求載荷 Schema */
export declare const VerifyRequestPayloadSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    component: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    component?: any;
    uuid?: string | undefined;
}, {
    component?: any;
    uuid?: string | undefined;
}>;
export type VerifyRequestPayload = z.infer<typeof VerifyRequestPayloadSchema>;
/** 共鳴分析結果 Schema */
export declare const ResonanceResultSchema: z.ZodObject<{
    totalResonance: z.ZodNumber;
    dimensionalResonance: z.ZodObject<{
        GPL: z.ZodNumber;
        Notion: z.ZodNumber;
        AlTable: z.ZodNumber;
        Others: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        GPL: number;
        Notion: number;
        AlTable: number;
        Others: number;
    }, {
        GPL: number;
        Notion: number;
        AlTable: number;
        Others: number;
    }>;
    conflicts: z.ZodArray<z.ZodAny, "many">;
    harmonyRecommendations: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    totalResonance: number;
    dimensionalResonance: {
        GPL: number;
        Notion: number;
        AlTable: number;
        Others: number;
    };
    conflicts: any[];
    harmonyRecommendations: any[];
}, {
    totalResonance: number;
    dimensionalResonance: {
        GPL: number;
        Notion: number;
        AlTable: number;
        Others: number;
    };
    conflicts: any[];
    harmonyRecommendations: any[];
}>;
export type ResonanceResult = z.infer<typeof ResonanceResultSchema>;
//# sourceMappingURL=core.types.d.ts.map