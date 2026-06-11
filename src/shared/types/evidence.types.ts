/**
 * 證據核心型別定義
 * 前後端共享，確保型別一致性
 */

import { z } from 'zod';

// ============================================
// 基礎型別定義
// ============================================

export type EvidenceID = string & { readonly __brand: 'EvidenceID' };
export type UserID = string & { readonly __brand: 'UserID' };
export type ContentHash = string & { readonly __brand: 'ContentHash' };
export type BlockchainTxHash = string & { readonly __brand: 'BlockchainTxHash' };

// ============================================
// 證據狀態枚舉
// ============================================

export enum EvidenceStatus {
  DRAFT = 'draft',
  SEALED = 'sealed',
  ANCHORED = 'anchored',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
}

export enum IntegrityStatus {
  VALID = 'valid',
  TAMPERED = 'tampered',
  UNVERIFIED = 'unverified',
  VERIFICATION_FAILED = 'verification_failed',
}

// ============================================
// 證據介面定義
// ============================================

export interface Evidence {
  id: EvidenceID;
  user_id: UserID;
  tag: string;
  content: string;
  content_type: string;
  content_hash: ContentHash;
  metadata?: EvidenceMetadata;
  status: EvidenceStatus;
  integrity_status: IntegrityStatus;
  blockchain_tx?: BlockchainTxHash;
  created_at: Date;
  updated_at: Date;
  sealed_at?: Date;
  expires_at?: Date;
  archived_at?: Date;
}

export interface EvidenceMetadata {
  file_size?: number;
  file_name?: string;
  mime_type?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for audio/video
  location?: {
    latitude: number;
    longitude: number;
  };
  device_info?: {
    user_agent: string;
    ip_address?: string;
  };
  custom_fields?: Record<string, unknown>;
}

// ============================================
// 創建證據請求 DTO
// ============================================

export interface CreateEvidenceDTO {
  tag: string;
  content: string;
  content_type: string;
  metadata?: EvidenceMetadata;
  expires_in_days?: number;
  auto_seal?: boolean;
}

export interface UpdateEvidenceDTO {
  tag?: string;
  metadata?: Partial<EvidenceMetadata>;
  status?: EvidenceStatus;
}

// ============================================
// 驗證結果型別
// ============================================

export interface VerificationResult {
  evidence_id: EvidenceID;
  is_valid: boolean;
  integrity_status: IntegrityStatus;
  content_hash_match: boolean;
  blockchain_verified: boolean;
  verified_at: Date;
  details: {
    stored_hash: ContentHash;
    computed_hash: ContentHash;
    blockchain_tx?: BlockchainTxHash;
    blockchain_timestamp?: Date;
    tamper_detected_fields?: string[];
  };
}

// ============================================
// 查詢參數型別
// ============================================

export interface EvidenceQueryParams {
  user_id?: UserID;
  status?: EvidenceStatus | EvidenceStatus[];
  integrity_status?: IntegrityStatus;
  created_after?: Date;
  created_before?: Date;
  tag_contains?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'updated_at' | 'tag';
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// ============================================
// Zod Schema 驗證器（前後端共用）
// ============================================

export const EvidenceMetadataSchema = z.object({
  file_size: z.number().optional(),
  file_name: z.string().optional(),
  mime_type: z.string().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  duration: z.number().optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  device_info: z.object({
    user_agent: z.string(),
    ip_address: z.string().optional(),
  }).optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

export const CreateEvidenceDTOSchema = z.object({
  tag: z.string().min(1).max(200),
  content: z.string().min(1).max(10 * 1024 * 1024), // 10MB 限制
  content_type: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
  metadata: EvidenceMetadataSchema.optional(),
  expires_in_days: z.number().min(1).max(3650).optional(),
  auto_seal: z.boolean().default(false),
});

export const UpdateEvidenceDTOSchema = z.object({
  tag: z.string().min(1).max(200).optional(),
  metadata: EvidenceMetadataSchema.partial().optional(),
  status: z.nativeEnum(EvidenceStatus).optional(),
});

export const EvidenceQueryParamsSchema = z.object({
  user_id: z.string().uuid().optional(),
  status: z.union([
    z.nativeEnum(EvidenceStatus),
    z.array(z.nativeEnum(EvidenceStatus)),
  ]).optional(),
  integrity_status: z.nativeEnum(IntegrityStatus).optional(),
  created_after: z.coerce.date().optional(),
  created_before: z.coerce.date().optional(),
  tag_contains: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort_by: z.enum(['created_at', 'updated_at', 'tag']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// 型別守衛（Type Guards）
// ============================================

export function isEvidenceID(value: unknown): value is EvidenceID {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function isValidContentHash(value: unknown): value is ContentHash {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
}

export function isEvidence(value: unknown): value is Evidence {
  if (typeof value !== 'object' || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.user_id === 'string' &&
    typeof obj.tag === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.content_hash === 'string' &&
    Object.values(EvidenceStatus).includes(obj.status as EvidenceStatus)
  );
}
