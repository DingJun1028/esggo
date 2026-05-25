// types/evidence.ts

/**
 * InfoOne v8.1.0 Evidence Vault Types
 */

export interface EvidenceInput {
  formula: string;
  impactMetric: Record<string, any>;
  sourceOrigin: string;
  lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
  metadata?: Record<string, any>;
}

export interface EvidenceOutput {
  uuid: string;
  timestamp: number;
  formula: string;
  impact_metric: Record<string, any>;
  hash_lock: string;
  source_origin: string;
  lifecycle_stage: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: number;
    requestId: string;
  };
}
