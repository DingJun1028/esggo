/**
 * OmniAgent + ESG Go Gateway Client v0.14.1
 * 整合最新的多模態工具鏈與本地化支持
 */
import type { AgentTask, AgentExecution, AgentArtifact } from './agent/types';
export interface OmniAgentAgentConfig {
    version: string;
    baseUrl: string;
    provider: 'Nous' | 'OpenRouter' | 'NovitaAI' | 'NVIDIA' | 'Xiaomi' | 'Moonshot' | 'OpenAI';
    locale: string;
}
export declare const CURRENT_OMNIAGENT_VERSION = "0.14.0";
export declare const DEFAULT_OMNIAGENT_GATEWAY_URL = "http://161.118.248.180:8642";
export declare const omniagentTools: {
    id: string;
    category: string;
    description: string;
}[];
export declare function fetchOmniAgentStatus(): Promise<any>;
export declare function executeOmniAgentTask(task: AgentTask): Promise<{
    execution: AgentExecution;
    artifact: AgentArtifact;
}>;
import type { OmniAgentVisionResult, OmniAgentMetricExtraction } from '../src/shared/types';
/**
 * [Phase 13] 多模態視覺掃描 (Multi-Modal Vision) — 實體化
 * 調用 Genkit AI 進行真實憑證分析
 */
export declare function scanEvidenceWithVision(fileId: string, fileType: string): Promise<OmniAgentVisionResult>;
/**
 * [Phase 13] 智慧指標提取 (Smart Metric Extraction) — 實體化
 */
export declare function extractMetricsFromEvidence(fileId: string): Promise<OmniAgentMetricExtraction>;
//# sourceMappingURL=omni-gateway.d.ts.map