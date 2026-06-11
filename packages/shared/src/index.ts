/**
 * ESGGO Sacred Contract v2.1 - Awakening Edition
 * Shared TypeScript Definitions for Platform, Commander & OmniOne
 */

export type ModelProvider = 'Google' | 'OpenRouter' | 'Mock' | 'Gemma4-Local';

export interface OmniTask {
  id: string;
  taskType: 'report_drafting' | 'reasoning_analysis' | 'compliance_check' | 'test' | 'celestial_alignment';
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  title?: string;
  prompt: string;
  model?: string;
  includeReasoning?: boolean;
}

export interface OmniExecution {
  id: string;
  taskId: string;
  modelProvider: ModelProvider;
  modelName: string;
  status: 'pending' | 'completed' | 'failed' | 'Awakened' | 'Repairing' | 'Calibrating';
  startedAt: string;
  finishedAt?: string;
  reasoningLog?: string;
}

export interface OmniArtifact {
  id: string;
  executionId: string;
  content: string;
  version: number;
}

export interface OmniGatewayResponse {
  execution: OmniExecution;
  artifact: OmniArtifact;
  error?: string;
}

export type ZKPMaskLevel = 'L1' | 'L2' | 'L3';

export interface ZKPProof {
  id: string;
  gate: 'Truth' | 'Goodness' | 'Beauty' | 'Trust' | 'Transfer';
  maskLevel: ZKPMaskLevel;
  proofHash: string;
  isVerified: boolean;
}

export interface OmniAmendmentRequest {
  targetUuid: string;
  reason: string;
  requestedBy: string;
  requestedAt: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ── 💎 Universal Component Core (Heart) ──────────────────

export interface IComponentCore<T = any> {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  readonly formula: string;
  readonly impactMetric: string;
  readonly status: "Pending" | "Verified" | "Trustworthy" | "AwaitingAmendment"; 
  readonly themeId: string;
  
  evidence: {
    origin_id: string;
    origin_hash: string;
    extraction_method: 'OCR' | 'IoT' | 'Manual' | 'AI';
  };

  lifecycle_events: Array<{
    event: string;
    timestamp: number;
    actor: string;
  }>;

  data: T;
  isFrozen: boolean;
  zkpProof?: ZKPProof;
  
  lock(): void; 
}

export interface IWuZuoMiaoDe extends IComponentCore {
  readonly state: "Awakened" | "Repairing" | "Calibrating" | "Stable";
  stream: <T>(data: T) => void;
  governance: {
    seal: (data: any) => Readonly<any>;
    purify: (entropyLevel: number) => void;
  };
}

export interface ESGMetric extends IComponentCore {
  category: 'Environmental' | 'Social' | 'Governance';
  name: string;
  value: number | string;
  unit: string;
  sourceOrigin: string;
}
