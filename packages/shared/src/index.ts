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

export interface ESGMetric {
  category: 'Environmental' | 'Social' | 'Governance';
  name: string;
  value: number | string;
  unit: string;
  timestamp: string;
  integrityProof?: string; 
}

/**
 * 💎 萬能元件心核：5T [4可1不可] 實作規範
 * --------------------------------------------------
 * 同義詞：萬能晶體、心核、SSOT 契約、Heart
 */
export interface IComponentCore {
  readonly uuid: string;           // [Traceable 可溯源] 來自萬能永憶主體
  readonly timestamp: number;      // [Trackable 可追蹤] 刻印時間戳
  readonly formula: string;        // [Transparent 可透明] 碳排與影響力計算公式
  readonly impactMetric: string;   // [Tangible 可感知] 具體影響力指標
  readonly status: "Trustworthy";  // [Trustworthy 不可篡改] 唯一的不可狀態
 
  /** 證據佐證庫 (Evidence Vault) */
  evidence: Record<string, any>;

  /** 🔒 不可篡改封印：數據封裝後的終態執行 */
  lock(): void; 
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

