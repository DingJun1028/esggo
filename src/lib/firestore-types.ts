// Firestore collection names
export const COLLECTIONS = {
  CONTRACTS: 'contracts',
  AUDIT_LOGS: 'audit_logs',
  EVIDENCE_RECORDS: 'evidence_records',
  SUBSIDIES: 'subsidies',
} as const;

// Contract document interface
export interface Contract {
  id: string;
  contract_code: string;
  counterparty_tax_id: string;
  evidence_bundle_id: string;
  status: 'draft' | 'pending' | 'locked' | 'archived';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  company_id: string;
}

// Audit log interface (Append-only)
export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: Date;
  performed_by: string;
  company_id: string;
  details?: Record<string, unknown>;
}

// Evidence record interface for 5T validation
export interface EvidenceRecord {
  id: string;
  uuid: string;
  version: string;
  timestamp: number;
  evidence_bundle_id: string;
  hash_value: string;
  source_origin: string;
  iso_standard_ref: string;
  lifecycle_path: string[];
  company_id: string;
}

// Subsidy document interface
export interface Subsidy {
  id: string;
  reimbursement_status: 'applied' | 'approved' | 'rejected' | 'paid';
  hash_value: string;
  amount: number;
  company_id: string;
}

// Firestore error types
export type FirestoreError = {
  code: string;
  message: string;
};