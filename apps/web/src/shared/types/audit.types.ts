import { z } from 'zod';
import type { EvidenceID, UserID } from './evidence.types';

// ============================================
// 審計日誌型別
// ============================================

export enum AuditAction {
  // Evidence actions
  EVIDENCE_CREATE = 'evidence_create',
  EVIDENCE_UPDATE = 'evidence_update',
  EVIDENCE_DELETE = 'evidence_delete',
  EVIDENCE_SEAL = 'evidence_seal',
  EVIDENCE_ANCHOR = 'evidence_anchor',
  EVIDENCE_VERIFY = 'evidence_verify',
  EVIDENCE_VIEW = 'evidence_view',
  EVIDENCE_DOWNLOAD = 'evidence_download',
  EVIDENCE_SHARE = 'evidence_share',
  EVIDENCE_ARCHIVE = 'evidence_archive',
  
  // UCC actions
  UCC_CREATE = 'ucc_create',
  UCC_UPDATE = 'ucc_update',
  UCC_TAG_ADD = 'ucc_tag_add',
  UCC_TAG_REMOVE = 'ucc_tag_remove',
  UCC_RELATION_ADD = 'ucc_relation_add',
  
  // Integrity actions
  INTEGRITY_ALERT = 'integrity_alert',
  INTEGRITY_CHECK = 'integrity_check',
  TAMPER_DETECTED = 'tamper_detected',
  
  // User actions
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_PERMISSION_CHANGE = 'user_permission_change',
}

export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface AuditLog {
  id: string;
  user_id: UserID;
  action: AuditAction;
  severity: AuditSeverity;
  resource_type: 'evidence' | 'ucc' | 'user' | 'system';
  resource_id: string;
  details: AuditDetails;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
  session_id?: string;
}

export interface AuditDetails {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  changes?: ChangeRecord[];
  reason?: string;
  metadata?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export interface ChangeRecord {
  field: string;
  old_value: unknown;
  new_value: unknown;
  changed_at: Date;
}

// ============================================
// 審計查詢參數
// ============================================

export interface AuditQueryParams {
  user_id?: UserID;
  action?: AuditAction | AuditAction[];
  severity?: AuditSeverity | AuditSeverity[];
  resource_type?: string;
  resource_id?: string;
  from_date?: Date;
  to_date?: Date;
  limit?: number;
  offset?: number;
}

// ============================================
// 完整性告警
// ============================================

export enum AlertType {
  HASH_MISMATCH = 'hash_mismatch',
  BLOCKCHAIN_MISMATCH = 'blockchain_mismatch',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_CORRUPTION = 'data_corruption',
}

export enum AlertStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  FALSE_POSITIVE = 'false_positive',
}

export interface IntegrityAlert {
  id: string;
  evidence_id: EvidenceID;
  alert_type: AlertType;
  severity: AuditSeverity;
  status: AlertStatus;
  description: string;
  details: {
    expected_hash?: string;
    actual_hash?: string;
    blockchain_tx?: string;
    detection_method?: string;
    affected_fields?: string[];
  };
  detected_at: Date;
  resolved_at?: Date;
  resolved_by?: UserID;
  resolution_notes?: string;
}

// ============================================
// Zod Schema 驗證器
// ============================================

export const AuditDetailsSchema = z.object({
  before: z.record(z.string(), z.unknown()).optional(),
  after: z.record(z.string(), z.unknown()).optional(),
  changes: z.array(z.object({
    field: z.string(),
    old_value: z.unknown(),
    new_value: z.unknown(),
    changed_at: z.coerce.date(),
  })).optional(),
  reason: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  error: z.object({
    message: z.string(),
    stack: z.string().optional(),
    code: z.string().optional(),
  }).optional(),
});

export const CreateAuditLogDTOSchema = z.object({
  user_id: z.string().uuid(),
  action: z.nativeEnum(AuditAction),
  severity: z.nativeEnum(AuditSeverity).default(AuditSeverity.INFO),
  resource_type: z.enum(['evidence', 'ucc', 'user', 'system']),
  resource_id: z.string(),
  details: AuditDetailsSchema,
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
});

export const AuditQueryParamsSchema = z.object({
  user_id: z.string().uuid().optional(),
  action: z.union([
    z.nativeEnum(AuditAction),
    z.array(z.nativeEnum(AuditAction)),
  ]).optional(),
  severity: z.union([
    z.nativeEnum(AuditSeverity),
    z.array(z.nativeEnum(AuditSeverity)),
  ]).optional(),
  resource_type: z.string().optional(),
  resource_id: z.string().optional(),
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});
