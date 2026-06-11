/**
 * ESGGO Sacred Contract v1.1
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

export interface IOmniTheme {
  readonly id: string;
  readonly name: string;
  readonly type: 'LiquidGlass' | 'SolidState' | 'Amber';
  readonly tokens: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
    readonly surface: string;
  };
}

/**
 * 💎 萬能元件心核：5T [4可1不可] 實作規範
 * --------------------------------------------------
 * Governing Authority: UCC (Universal Component Center)
 */
export interface IComponentCore {
  readonly uuid: string;           // [真 - Truthful] Traceable (可溯源)
  readonly version: number;        // [通 - Transferful] Versioning
  readonly timestamp: number;      // [通 - Transferful] Trackable
  readonly formula: string;        // [善 - Thankful] Transparent
  readonly impactMetric: string;   // [美 - Tasteful] Tangible
  readonly status: "Pending" | "Verified" | "Trustworthy" | "AwaitingAmendment"; 
  readonly themeId: string;        // [美 - Tasteful] Governing UI Theme
  
  /** 證據佐證庫 (Evidence Vault) */
  evidence: Record<string, any>;

  /** 🧠 ZK-Privacy Proof */
  zkpProof?: ZKPProof;

  /** 🔗 Amendment Link */
  parentUuid?: string;
  amendmentReason?: string;
  
  /** 🔒 不可篡改封印 */
  lock(): void; 
}

export interface OmniAmendmentRequest {
  targetUuid: string;
  reason: string;
  requestedBy: string;
  requestedAt: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ESGMetric extends IComponentCore {
  category: 'Environmental' | 'Social' | 'Governance';
  name: string;
  value: number | string;
  unit: string;
  sourceOrigin: string; // [真 - Truthful] Traceable
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
