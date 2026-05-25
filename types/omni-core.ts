'use client';

// ============================================================
// 萬能心核系統 - 雙向 TypeScript 類型定義
// 5T Integrity Protocol + IComponentCore + State Machine
// ============================================================

import { ZKPRangeProof } from '../lib/crypto-proof';

export type OmniRequestType =
  | 'query'
  | 'seal'
  | 'verify'
  | 'manifest'
  | 'remember'
  | 'analyze';

export type OmniResponseStatus =
  | 'success'
  | 'processing'
  | 'sealed'
  | 'verified'
  | 'error';

export type T5Status =
  | 'Tangible'
  | 'Traceable'
  | 'Trackable'
  | 'Transparent'
  | 'Trustworthy';

export type ComponentStatus = 'Trustworthy';

export interface IEvidence {
  tangible_metric: string;
  source_origin: string;
  lifecycle_hooks: string[];
  formula_ref: string;
}

export interface IComponentCore {
  readonly uuid: string;
  readonly timestamp: number;
  readonly version: string;
  readonly evidence: IEvidence;
  readonly status: ComponentStatus;
  readonly hash_lock: string;
  readonly zkp_proof?: ZKPRangeProof; // Added ZKP support
}

export interface T5GateState {
  tangible: boolean;
  traceable: boolean;
  trackable: boolean;
  transparent: boolean;
  trustworthy: boolean;
}

export interface OmniMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendUp?: boolean;
  gri?: string;
  t5Status: T5Status;
  verified: boolean;
  hash?: string;
  color: string;
}

export interface ApiRequest<T = unknown> {
  id: string;
  type: OmniRequestType;
  content: string;
  data?: T;
  timestamp: number;
  session_id?: string;
}

export interface ApiResponse<T = unknown> {
  id: string;
  status: OmniResponseStatus;
  content: string;
  data?: T;
  timestamp: number;
  hash?: string;
  component?: IComponentCore;
}

export interface AgentSession {
  id: string;
  name: string;
  persona: 'compliance' | 'harmony' | 'innovation' | 'entropy';
  created_at: number;
  memory_count: number;
}

// ============================================================
// Hermes Agent Types
// ============================================================

export interface HermesVisionResult {
  extraction: string;
  confidence: number;
  gapAnalysis: string;
}

export interface HermesMetric {
  key: string;
  value: number | string;
  unit: string;
  gri: string;
}

export interface HermesMetricExtraction {
  metrics: HermesMetric[];
  confidence: number;
}

// ============================================================
// API Payload Types
// ============================================================

export interface SealRequestPayload {
  metric: string;
  source: string;
  formula: string;
  policyId?: string;
}

export interface VerifyRequestPayload {
  component: IComponentCore;
}

export interface ZKPVerifyRequestPayload {
  proof: any; // Using any for ZKPRangeProof due to potential complex types in lib/crypto-proof
  blindingFactor: string;
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

export type EternalMemoryType =
  | 'EPISODIC'
  | 'SEMANTIC'
  | 'PROCEDURAL'
  | 'SPATIAL'
  | 'EMOTIONAL'
  | 'CREATIVE';

export interface EternalMemory {
  id: string;
  type: EternalMemoryType;
  content: string;
  tags: string[];
  timestamp: number;
  hash_lock: string;
  consolidated: boolean;
}
