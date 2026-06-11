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
}

export interface OmniExecution {
  id: string;
  taskId: string;
  modelProvider: ModelProvider;
  modelName: string;
  status: 'pending' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string;
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
  integrityProof?: string; // ZKP Binders
}
