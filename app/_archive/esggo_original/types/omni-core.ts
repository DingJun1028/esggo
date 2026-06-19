/**
 * ESG GO | 萬能心核系統 - 前端型別錨點
 * v2.0 | Re-anchored to Shared Sanctuary
 */

export * from '../shared/types';

import { ZKPRangeProof } from '../lib/crypto-proof';
import { IComponentCore } from '../shared/types';

// ============================================================
// Legacy & Extended Types (To be metabolized)
// ============================================================

export interface OmniMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendUp?: boolean;
  gri?: string;
  t5Status: string;
  verified: boolean;
  hash?: string;
  color: string;
}

export interface OmniAgentVisionResult {
  extraction: string;
  confidence: number;
  gapAnalysis: string;
}

export interface OmniAgentMetric {
  key: string;
  value: number | string;
  unit: string;
  gri: string;
}

export interface OmniAgentMetricExtraction {
  metrics: OmniAgentMetric[];
  confidence: number;
}

export interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  task?: string;
  progress?: number;
  skills: string[];
  t5_score: number;
}

export interface SealRequestPayload {
  formula: string;
  impact_metric: any;
  metric?: string; // Legacy support
  source?: string; // Legacy support
  policyId?: string; // Legacy support
  source_origin: string;
  metadata?: any;
}

export interface VerifyRequestPayload {
  uuid?: string;
  component?: any; // Legacy support
}

export interface ResonanceResult {
  totalResonance: number;
  dimensionalResonance: {
    GPL: number;
    Notion: number;
    AlTable: number;
    Others: number;
  };
  conflicts: any[];
  harmonyRecommendations: any[];
}
