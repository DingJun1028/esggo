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
    traceable: z.ZodBoolean;
    transparent: z.ZodBoolean;
    tangible: z.ZodBoolean;
    trackable: z.ZodBoolean;
    trustworthy: z.ZodBoolean;
}, z.core.$strip>>;
export type I5TGovernance = z.infer<typeof I5TGovernanceSchema>;
export type T5GateState = I5TGovernance;
/** 5T 門徑代碼 (5T Gate Codes) */
export declare const T5StatusSchema: z.ZodEnum<{
    Traceable: "Traceable";
    Transparent: "Transparent";
    Tangible: "Tangible";
    Trackable: "Trackable";
    Trustworthy: "Trustworthy";
}>;
export type T5Status = z.infer<typeof T5StatusSchema>;
/** 證據佐證庫 Schema (觀因循果) */
export declare const IEvidenceSchema: z.ZodObject<{
    originCause: z.ZodString;
    processTrace: z.ZodArray<z.ZodString>;
    finalEffect: z.ZodString;
    tangible_metric: z.ZodOptional<z.ZodString>;
    source_origin: z.ZodOptional<z.ZodString>;
    lifecycle_hooks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    formula_ref: z.ZodOptional<z.ZodString>;
    causality: z.ZodOptional<z.ZodObject<{
        originCause: z.ZodString;
        processTrace: z.ZodArray<z.ZodString>;
        finalEffect: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
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
    uuid: z.ZodString;
    version: z.ZodString;
    timestamp: z.ZodNumber;
    formula: z.ZodString;
    impact_metric: z.ZodString;
    status: z.ZodLiteral<"Trustworthy">;
    hash_lock: z.ZodString;
    evidence: z.ZodArray<z.ZodObject<{
        originCause: z.ZodString;
        processTrace: z.ZodArray<z.ZodString>;
        finalEffect: z.ZodString;
        tangible_metric: z.ZodOptional<z.ZodString>;
        source_origin: z.ZodOptional<z.ZodString>;
        lifecycle_hooks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        formula_ref: z.ZodOptional<z.ZodString>;
        causality: z.ZodOptional<z.ZodObject<{
            originCause: z.ZodString;
            processTrace: z.ZodArray<z.ZodString>;
            finalEffect: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type IComponentCore = z.infer<typeof IComponentCoreSchema>;
/** 萬能修復輸入 (Restoration Input) */
export declare const RestorationInputSchema: z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodObject<{
    metric: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    formula: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type RestorationInput = z.infer<typeof RestorationInputSchema>;
export declare const EternalMemoryType: {
    readonly EPISODIC: "EPISODIC";
    readonly SEMANTIC: "SEMANTIC";
    readonly PROCEDURAL: "PROCEDURAL";
    readonly SPATIAL: "SPATIAL";
    readonly EMOTIONAL: "EMOTIONAL";
    readonly CREATIVE: "CREATIVE";
};
export declare const EternalMemoryTypeSchema: z.ZodEnum<{
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
    type: z.ZodEnum<{
        readonly EPISODIC: "EPISODIC";
        readonly SEMANTIC: "SEMANTIC";
        readonly PROCEDURAL: "PROCEDURAL";
        readonly SPATIAL: "SPATIAL";
        readonly EMOTIONAL: "EMOTIONAL";
        readonly CREATIVE: "CREATIVE";
    }>;
    content: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    timestamp: z.ZodNumber;
    hash_lock: z.ZodString;
    consolidated: z.ZodBoolean;
}, z.core.$strip>;
export type EternalMemory = z.infer<typeof EternalMemorySchema>;
/** 萬能指標 Schema */
export declare const OmniMetricSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    value: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    unit: z.ZodOptional<z.ZodString>;
    trend: z.ZodOptional<z.ZodNumber>;
    trendUp: z.ZodOptional<z.ZodBoolean>;
    gri: z.ZodOptional<z.ZodString>;
    t5Status: z.ZodString;
    verified: z.ZodBoolean;
    hash: z.ZodOptional<z.ZodString>;
    color: z.ZodString;
}, z.core.$strip>;
export type OmniMetric = z.infer<typeof OmniMetricSchema>;
/** 視覺掃描結果 Schema */
export declare const OmniAgentVisionResultSchema: z.ZodObject<{
    extraction: z.ZodString;
    confidence: z.ZodNumber;
    gapAnalysis: z.ZodString;
}, z.core.$strip>;
export type OmniAgentVisionResult = z.infer<typeof OmniAgentVisionResultSchema>;
/** 代理人提取指標 Schema */
export declare const OmniAgentMetricSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    unit: z.ZodString;
    gri: z.ZodString;
}, z.core.$strip>;
export type OmniAgentMetric = z.infer<typeof OmniAgentMetricSchema>;
/** 指標提取結果 Schema */
export declare const OmniAgentMetricExtractionSchema: z.ZodObject<{
    metrics: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
        unit: z.ZodString;
        gri: z.ZodString;
    }, z.core.$strip>>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export type OmniAgentMetricExtraction = z.infer<typeof OmniAgentMetricExtractionSchema>;
/** 蜂群代理人 Schema */
export declare const SwarmAgentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    status: z.ZodEnum<{
        error: "error";
        idle: "idle";
        active: "active";
        processing: "processing";
    }>;
    task: z.ZodOptional<z.ZodString>;
    progress: z.ZodOptional<z.ZodNumber>;
    skills: z.ZodArray<z.ZodString>;
    t5_score: z.ZodNumber;
}, z.core.$strip>;
export type SwarmAgent = z.infer<typeof SwarmAgentSchema>;
/** 代理人對話會話 Schema */
export declare const AgentSessionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    persona: z.ZodEnum<{
        compliance: "compliance";
        harmony: "harmony";
        innovation: "innovation";
        entropy: "entropy";
        junaikey: "junaikey";
    }>;
    created_at: z.ZodNumber;
    memory_count: z.ZodNumber;
}, z.core.$strip>;
export type AgentSession = z.infer<typeof AgentSessionSchema>;
export declare const OmniRequestTypeSchema: z.ZodEnum<{
    query: "query";
    verify: "verify";
    seal: "seal";
    manifest: "manifest";
    remember: "remember";
    analyze: "analyze";
}>;
export type OmniRequestType = z.infer<typeof OmniRequestTypeSchema>;
export declare const OmniResponseStatusSchema: z.ZodEnum<{
    error: "error";
    success: "success";
    sealed: "sealed";
    verified: "verified";
    processing: "processing";
}>;
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
    type: z.ZodEnum<{
        query: "query";
        verify: "verify";
        seal: "seal";
        manifest: "manifest";
        remember: "remember";
        analyze: "analyze";
    }>;
    content: z.ZodString;
    data: z.ZodOptional<z.ZodUnknown>;
    timestamp: z.ZodNumber;
    session_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
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
}, z.core.$strip>;
export type SealRequestPayload = z.infer<typeof SealRequestPayloadSchema>;
/** 校驗請求載荷 Schema */
export declare const VerifyRequestPayloadSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    component: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export type VerifyRequestPayload = z.infer<typeof VerifyRequestPayloadSchema>;
/** 共鳴分析結果 Schema */
export declare const ResonanceResultSchema: z.ZodObject<{
    totalResonance: z.ZodNumber;
    dimensionalResonance: z.ZodObject<{
        GPL: z.ZodNumber;
        Notion: z.ZodNumber;
        AlTable: z.ZodNumber;
        Others: z.ZodNumber;
    }, z.core.$strip>;
    conflicts: z.ZodArray<z.ZodAny>;
    harmonyRecommendations: z.ZodArray<z.ZodAny>;
}, z.core.$strip>;
export type ResonanceResult = z.infer<typeof ResonanceResultSchema>;
//# sourceMappingURL=core.types.d.ts.map