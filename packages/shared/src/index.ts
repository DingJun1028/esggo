/**
 * ESGGO Sacred Contract v1.0
 * Shared TypeScript Definitions for Platform & Commander
 */

export type ModelProvider = 'Google' | 'OpenRouter' | 'Mock';

export interface OmniTask {
  id: string;
  taskType: 'report_drafting' | 'reasoning_analysis' | 'compliance_check' | 'test';
  title?: string;
  prompt: string;
  model?: string; // e.g., 'google/gemma-4-31b-it:free'
  includeReasoning?: boolean; // Enable Deep Reasoning Mode
}

export interface OmniExecution {
  id: string;
  taskId: string;
  modelProvider: ModelProvider;
  modelName: string;
  status: 'pending' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string;
  reasoningLog?: string; // Internal step-by-step logic
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

// ── ESG Domain Types ───────────────────────────────────────

/**
 * 💎 萬能元件心核：5T [4可1不可] 實作規範
 */
export interface IComponentCore {
  readonly uuid: string;           // [真 - Truthful] Traceable (可溯源)
  readonly timestamp: number;      // [通 - Transferful] Trackable (可追蹤)
  readonly formula: string;        // [善 - Thankful] Transparent (可透明)
  readonly impactMetric: string;   // [美 - Tasteful] Tangible (可感知)
  readonly status: "Pending" | "Verified" | "Trustworthy"; // Updated lifecycle status
  
  /** 證據佐證庫 (Evidence Vault) */
  evidence: Record<string, any>;

  /** 🧠 ZK-Privacy Proof (Must be present before final seal) */
  zkpProof?: ZKPProof;
  
  /** 🔒 不可篡改封印 */
  lock(): void; 
}

export interface ESGMetric extends IComponentCore {
  category: 'Environmental' | 'Social' | 'Governance';
  name: string;
  value: number | string;
  unit: string;
  sourceOrigin: string; // [真 - Truthful] Required for Traceability
  integrityProof?: string; 
}


// ── ZK-Privacy Engine Types ───────────────────────────────

export type ZKPMaskLevel = 'L1' | 'L2' | 'L3';

export interface ZKPProof {
  id: string;
  gate: 'Truth' | 'Goodness' | 'Beauty' | 'Trust' | 'Transfer';
  maskLevel: ZKPMaskLevel;
  proofHash: string; // The ZK-Proof certificate
  isVerified: boolean;
}

