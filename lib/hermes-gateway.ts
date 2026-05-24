/**
 * OmniHermes + ESG Go Gateway Client v0.14.1
 * 整合最新的多模態工具鏈與本地化支持
 */

import type { AgentTask, AgentExecution, AgentArtifact } from './agent/types';

export interface HermesAgentConfig {
  version: string;
  baseUrl: string;
  provider: 'Nous' | 'OpenRouter' | 'NovitaAI' | 'NVIDIA' | 'Xiaomi' | 'Moonshot' | 'OpenAI';
  locale: string;
}

export const CURRENT_HERMES_VERSION = '0.14.0';
export const DEFAULT_HERMES_GATEWAY_URL = 'http://161.118.248.180:8642';

export const hermesTools = [
  { id: 'web_search', category: 'Information', description: 'Deep web research and extraction' },
  { id: 'terminal', category: 'Execution', description: 'Safe sandboxed shell execution' },
  { id: 'video_generate', category: 'Creative', description: 'New v0.14: Unified video generation' },
  { id: 'trajectory_export', category: 'Research', description: 'Export compressed training data' },
  { id: 'mcp_bridge', category: 'System', description: 'Connect to external MCP servers' }
];

const BASE_URL = process.env.NEXT_PUBLIC_HERMES_GATEWAY_URL || DEFAULT_HERMES_GATEWAY_URL;

export async function fetchHermesStatus() {
  try {
    const res = await fetch(`${BASE_URL}/status`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Gateway offline');
    return await res.json();
  } catch (e) {
    console.warn('Hermes Gateway unreachable, falling back to mock status.');
    return {
      status: 'online',
      version: CURRENT_HERMES_VERSION,
      active_workers: 4,
      memory_usage: '2.4 GB',
      last_learning_sync: new Date().toISOString(),
      is_mock: true
    };
  }
}

export async function executeHermesTask(task: AgentTask): Promise<{ execution: AgentExecution; artifact: AgentArtifact }> {
  try {
    const res = await fetch(`${BASE_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    if (!res.ok) throw new Error(`Gateway returned ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`Hermes live execution failed for task ${task.id}:`, e);
    throw new Error('HERMES_GATEWAY_UNREACHABLE');
  }
}

/**
 * [Phase 3] 多模態視覺掃描 (Multi-Modal Vision)
 * 模擬分析上傳的文件或圖片
 */
export async function scanEvidenceWithVision(fileId: string, fileType: string): Promise<{
  extraction: string;
  confidence: number;
  gapAnalysis: string;
}> {
  console.log(`[OmniHermes Vision] Scanning file ${fileId} (${fileType})...`);
  
  // 模擬網路延遲
  await new Promise(r => setTimeout(r, 2500));

  return {
    extraction: "從該單據中識別出：2024年3月電費總計 12,450 元，消耗電力 3,420 kWh。",
    confidence: 0.94,
    gapAnalysis: "數據與報表系統中的 GRI 302-1 指標吻合，建議作為範疇二排放佐證。"
  };
}

/**
 * [Phase 4] 智慧指標提取 (Smart Metric Extraction)
 * 將非結構化憑證轉化為結構化數據點
 */
export async function extractMetricsFromEvidence(fileId: string): Promise<{
  metrics: Array<{ key: string; value: number | string; unit: string; gri: string }>;
  confidence: number;
}> {
  console.log(`[OmniHermes Alchemy] Extracting metrics from artifact ${fileId}...`);
  
  await new Promise(r => setTimeout(r, 1800));

  // In production, this would use multi-modal OCR + LLM analysis
  return {
    metrics: [
      { key: 'electricity_usage', value: 3420, unit: 'kWh', gri: 'GRI 302-1' },
      { key: 'water_consumption', value: 125, unit: 'm3', gri: 'GRI 303-3' }
    ],
    confidence: 0.98
  };
}