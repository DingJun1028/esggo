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
  protocol: 'T1' | 'T5'; // Traceable, Trustworthy
}

export interface OmniInfoNode {
  logic_hash: string;
  calculations: Record<string, unknown>;
  self_healing_status: 'stable' | 'repairing' | 'synced';
  protocol: 'T2' | 'T4'; // Transparent, Trackable
}

export interface OmniInfoAura {
  visual_state: 'liquid_glass' | 'frosted' | 'hologram';
  entropy: number;
  resonance_color: string; // Reflects Rs
  protocol: 'T3'; // Tangible (Beauty)
}

// ============================================
// UCC (Omni Component Core) Alignment
// ============================================
// ... (rest of the file)

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

export enum TagCategory {
  ENTITY = 'entity',           // 實體（人、事、物）
  ATTRIBUTE = 'attribute',     // 屬性
  RELATION = 'relation',       // 關係
  TEMPORAL = 'temporal',       // 時間
  SPATIAL = 'spatial',         // 空間
  CONCEPT = 'concept',         // 概念
  CUSTOM = 'custom',           // 自定義
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
  confidence_score: number; // 0-1
  extracted_at: Date;
  updated_at: Date;
}

export enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  LOCATION = 'location',
  EVENT = 'event',
  OBJECT = 'object',
  DOCUMENT = 'document',
  CONCEPT = 'concept',
}

export interface UCCAttribute {
  key: string;
  value: unknown;
  type: AttributeType;
  confidence: number;
  source?: string;
}

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ARRAY = 'array',
  OBJECT = 'object',
}

export interface UCCRelation {
  from_entity_id: string;
  to_entity_id: string;
  relation_type: RelationType;
  weight: number; // 關係強度 0-1
  bidirectional: boolean;
  metadata?: Record<string, unknown>;
}

export enum RelationType {
  ASSOCIATED_WITH = 'associated_with',
  PART_OF = 'part_of',
  CREATED_BY = 'created_by',
  RELATED_TO = 'related_to',
  DEPENDS_ON = 'depends_on',
  REFERENCES = 'references',
  DERIVED_FROM = 'derived_from',
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

export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STRUCTURED_DATA = 'structured_data',
  BINARY = 'binary',
}

export interface ElementPosition {
  page?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  timestamp?: number; // for video/audio
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
  score: number; // -1 (negative) to 1 (positive)
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

// ============================================
// UCC 整合介面
// ============================================

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

// ============================================
// UCC 建立請求 DTO
// ============================================

export interface CreateUCCDTO {
  evidence_id: EvidenceID;
  tags?: string[]; // tag names
  auto_extract?: boolean; // 自動提取實體與關係
  analyze_content?: boolean; // 自動分析內容
  ocr_enabled?: boolean; // 啟用 OCR
}

export interface SealInput {
  formula: string;
  impactMetric: Record<string, unknown>;
  sourceOrigin: string;
  lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
  metadata?: Record<string, unknown>;
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

// ============================================
// UCC 查詢參數
// ============================================

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

// ============================================
// Zod Schema 驗證器
// ============================================

export const UCCTagSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.nativeEnum(TagCategory),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
  parent_tag_id: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const UCCAttributeSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  type: z.nativeEnum(AttributeType),
  confidence: z.number().min(0).max(1),
  source: z.string().optional(),
});

export const UCCRelationSchema = z.object({
  from_entity_id: z.string().uuid(),
  to_entity_id: z.string().uuid(),
  relation_type: z.nativeEnum(RelationType),
  weight: z.number().min(0).max(1),
  bidirectional: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const CreateUCCDTOSchema = z.object({
  evidence_id: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  auto_extract: z.boolean().default(true),
  analyze_content: z.boolean().default(true),
  ocr_enabled: z.boolean().default(false),
});

export const UpdateUCCDTOSchema = z.object({
  tags: z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional(),
  }).optional(),
  think_tank: z.object({
    entity_name: z.string().optional(),
    attributes: z.array(UCCAttributeSchema).optional(),
    relations: z.array(UCCRelationSchema).optional(),
  }).optional(),
});

// ============================================
// 型別守衛
// ============================================

export function isUCCPackage(value: unknown): value is UCCPackage {
  if (typeof value !== 'object' || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.evidence === 'object' &&
    Array.isArray(obj.tags) &&
    typeof obj.think_tank === 'object' &&
    Array.isArray(obj.elements)
  );
}
