export interface ApiErrorShape {
  message: string;
  details?: unknown;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface OkResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = unknown> = OkResponse<T> | { success: false; error: ApiErrorShape };

export interface AuditRecordInput {
  tenant_id: string;
  event_type: string;
  payload: unknown;
  source_origin?: string;
  last_modified_by?: string;
  timestamp?: number;
}

export interface AuditRecord extends AuditRecordInput {
  id: string;
  timestamp: number;
}

export interface VaultEvidenceInput {
  reportId: string;
  fileName: string;
  fileUrl: string;
  hashLock: string;
  companyId?: string;
  module?: string;
}

export interface VaultEvidence extends VaultEvidenceInput {
  id?: string;
  uploadedAt?: string;
  createdAt?: string;
}

export interface NoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface Note extends NoteInput {
  id: string;
  updatedAt: number;
}

export interface SealedEvidence {
  evidence_id: string;
  hash_lock: string;
  seal_tx_hash?: string;
  verified: boolean;
}
