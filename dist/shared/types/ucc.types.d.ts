import { z } from 'zod';
import type { EvidenceID, ContentHash } from './evidence.types';
/**
 * OmniInfoCrystal: 三位一體結晶結構
 * 系統數據的終極存在形態
 */
export interface OmniInfoCrystal {
    /** 微觀 (Seed): 數據 DNA */
    core: OmniInfoCore;
    /** 中觀 (Body): 功能邏輯 */
    node: OmniInfoNode;
    /** 宏觀 (Light): 表現光環 */
    aura: OmniInfoAura;
    /** 共鳴算力 (Resonance) */
    rs: number;
    version: string;
}
export interface OmniInfoCore {
    uuid: string;
    source_origin: string;
    hash_lock: string;
    timestamp: number;
    protocol: 'T1' | 'T5';
}
export interface OmniInfoNode {
    logic_hash: string;
    calculations: Record<string, any>;
    self_healing_status: 'stable' | 'repairing' | 'synced';
    protocol: 'T2' | 'T4';
}
export interface OmniInfoAura {
    visual_state: 'liquid_glass' | 'frosted' | 'hologram';
    entropy: number;
    resonance_color: string;
    protocol: 'T3';
}
/**
 * 標籤層（Tag Layer）
 * 用於分類與檢索
 */
export interface UCCTag {
    id: string;
    name: string;
    category: TagCategory;
    color?: string;
    icon?: string;
    parent_tag_id?: string;
    metadata?: Record<string, unknown>;
    created_at: Date;
}
export declare enum TagCategory {
    ENTITY = "entity",// 實體（人、事、物）
    ATTRIBUTE = "attribute",// 屬性
    RELATION = "relation",// 關係
    TEMPORAL = "temporal",// 時間
    SPATIAL = "spatial",// 空間
    CONCEPT = "concept",// 概念
    CUSTOM = "custom"
}
/**
 * 智庫層（Think Tank Layer）
 * 用於知識圖譜與關聯
 */
export interface UCCThinkTank {
    id: string;
    evidence_id: EvidenceID;
    entity_type: EntityType;
    entity_name: string;
    attributes: UCCAttribute[];
    relations: UCCRelation[];
    knowledge_graph_node_id?: string;
    confidence_score: number;
    extracted_at: Date;
    updated_at: Date;
}
export declare enum EntityType {
    PERSON = "person",
    ORGANIZATION = "organization",
    LOCATION = "location",
    EVENT = "event",
    OBJECT = "object",
    DOCUMENT = "document",
    CONCEPT = "concept"
}
export interface UCCAttribute {
    key: string;
    value: unknown;
    type: AttributeType;
    confidence: number;
    source?: string;
}
export declare enum AttributeType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    DATE = "date",
    ARRAY = "array",
    OBJECT = "object"
}
export interface UCCRelation {
    from_entity_id: string;
    to_entity_id: string;
    relation_type: RelationType;
    weight: number;
    bidirectional: boolean;
    metadata?: Record<string, unknown>;
}
export declare enum RelationType {
    ASSOCIATED_WITH = "associated_with",
    PART_OF = "part_of",
    CREATED_BY = "created_by",
    RELATED_TO = "related_to",
    DEPENDS_ON = "depends_on",
    REFERENCES = "references",
    DERIVED_FROM = "derived_from"
}
/**
 * 元素層（Element Layer）
 * 用於具體證據內容
 */
export interface UCCElement {
    id: string;
    evidence_id: EvidenceID;
    element_type: ElementType;
    content: string | object;
    content_hash: ContentHash;
    position?: ElementPosition;
    extracted_text?: string;
    ocr_result?: OCRResult;
    analysis?: ElementAnalysis;
    created_at: Date;
}
export declare enum ElementType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    DOCUMENT = "document",
    STRUCTURED_DATA = "structured_data",
    BINARY = "binary"
}
export interface ElementPosition {
    page?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    timestamp?: number;
}
export interface OCRResult {
    text: string;
    confidence: number;
    language: string;
    blocks: OCRBlock[];
}
export interface OCRBlock {
    text: string;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    confidence: number;
}
export interface ElementAnalysis {
    sentiment?: SentimentResult;
    keywords?: KeywordResult[];
    entities?: EntityRecognitionResult[];
    summary?: string;
    language?: string;
    metadata?: Record<string, unknown>;
}
export interface SentimentResult {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
}
export interface KeywordResult {
    keyword: string;
    relevance: number;
    frequency: number;
}
export interface EntityRecognitionResult {
    text: string;
    type: EntityType;
    confidence: number;
    start_pos: number;
    end_pos: number;
}
export interface UCCPackage {
    evidence: {
        id: EvidenceID;
        tag: string;
        content_hash: ContentHash;
    };
    tags: UCCTag[];
    think_tank: UCCThinkTank;
    elements: UCCElement[];
    created_at: Date;
    version: string;
}
export interface CreateUCCDTO {
    evidence_id: EvidenceID;
    tags?: string[];
    auto_extract?: boolean;
    analyze_content?: boolean;
    ocr_enabled?: boolean;
}
export interface SealInput {
    formula: string;
    impactMetric: Record<string, any>;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, any>;
}
export interface UpdateUCCDTO {
    tags?: {
        add?: string[];
        remove?: string[];
    };
    think_tank?: {
        entity_name?: string;
        attributes?: UCCAttribute[];
        relations?: UCCRelation[];
    };
}
export interface UCCQueryParams {
    evidence_id?: EvidenceID;
    tag_names?: string[];
    entity_type?: EntityType;
    relation_type?: RelationType;
    has_analysis?: boolean;
    created_after?: Date;
    limit?: number;
    offset?: number;
}
export declare const UCCTagSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<typeof TagCategory>;
    color: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    parent_tag_id: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const UCCAttributeSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodUnknown;
    type: z.ZodEnum<typeof AttributeType>;
    confidence: z.ZodNumber;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UCCRelationSchema: z.ZodObject<{
    from_entity_id: z.ZodString;
    to_entity_id: z.ZodString;
    relation_type: z.ZodEnum<typeof RelationType>;
    weight: z.ZodNumber;
    bidirectional: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const CreateUCCDTOSchema: z.ZodObject<{
    evidence_id: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    auto_extract: z.ZodDefault<z.ZodBoolean>;
    analyze_content: z.ZodDefault<z.ZodBoolean>;
    ocr_enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const UpdateUCCDTOSchema: z.ZodObject<{
    tags: z.ZodOptional<z.ZodObject<{
        add: z.ZodOptional<z.ZodArray<z.ZodString>>;
        remove: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    think_tank: z.ZodOptional<z.ZodObject<{
        entity_name: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodUnknown;
            type: z.ZodEnum<typeof AttributeType>;
            confidence: z.ZodNumber;
            source: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        relations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            from_entity_id: z.ZodString;
            to_entity_id: z.ZodString;
            relation_type: z.ZodEnum<typeof RelationType>;
            weight: z.ZodNumber;
            bidirectional: z.ZodDefault<z.ZodBoolean>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare function isUCCPackage(value: unknown): value is UCCPackage;
//# sourceMappingURL=ucc.types.d.ts.map