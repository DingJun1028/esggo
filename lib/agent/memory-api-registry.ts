// @ts-nocheck
/**
 * OmniMemory API Registry v2.0
 * 所有資源庫 API 與記憶碎片體系的整合映射
 *
 * 每當有新事件發生時，自動萃取記憶碎片
 */

import {
  extractMemoryShard,
  extractShardFromErrorLog,
  logShardUsage,
} from '@/lib/agent/memory-shards';

// ─── API 事件映射 ──────────────────────────────────────────────────────────
export const API_EVENT_MAP: Record<
  string,
  {
    action: 'extract_shard' | 'extract_error' | 'log_usage';
    sourceType: string;
    priority: 'high' | 'medium' | 'low';
    autoExtract: boolean;
  }
> = {
  // Agent APIs
  '/api/agent': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'high',
    autoExtract: true,
  },
  '/api/agent/tasks': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'medium',
    autoExtract: true,
  },
  '/api/agent/executions': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'high',
    autoExtract: true,
  },
  '/api/agent/vision': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'medium',
    autoExtract: true,
  },

  // AI APIs
  '/api/ai/generate': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'medium',
    autoExtract: true,
  },
  '/api/ai/expand': {
    action: 'extract_shard',
    sourceType: 'conversation',
    priority: 'low',
    autoExtract: false,
  },
  '/api/ai/search': {
    action: 'log_usage',
    sourceType: 'conversation',
    priority: 'low',
    autoExtract: false,
  },

  // ESG APIs
  '/api/esg/crawl': {
    action: 'extract_shard',
    sourceType: 'web_crawl',
    priority: 'high',
    autoExtract: true,
  },
  '/api/omnicore/scrape-esg-web': {
    action: 'extract_shard',
    sourceType: 'web_crawl',
    priority: 'high',
    autoExtract: true,
  },

  // Memory APIs
  '/api/agent/memory-shards': {
    action: 'log_usage',
    sourceType: 'manual',
    priority: 'low',
    autoExtract: false,
  },
  '/api/omni-memory': {
    action: 'log_usage',
    sourceType: 'manual',
    priority: 'low',
    autoExtract: false,
  },

  // Intelligence APIs
  '/api/intelligence': {
    action: 'extract_shard',
    sourceType: 'web_crawl',
    priority: 'high',
    autoExtract: true,
  },
  '/api/omni-agent-api/extract-metrics': {
    action: 'extract_shard',
    sourceType: 'auto_extract',
    priority: 'medium',
    autoExtract: true,
  },

  // Vault APIs
  '/api/vault/seal': {
    action: 'extract_shard',
    sourceType: 'auto_extract',
    priority: 'medium',
    autoExtract: true,
  },
  '/api/vault/verify': {
    action: 'log_usage',
    sourceType: 'auto_extract',
    priority: 'low',
    autoExtract: false,
  },

  // System APIs
  '/api/system/autonomy': {
    action: 'extract_shard',
    sourceType: 'auto_extract',
    priority: 'high',
    autoExtract: true,
  },
  '/api/system/bus-health': {
    action: 'log_usage',
    sourceType: 'auto_extract',
    priority: 'low',
    autoExtract: false,
  },
};

// ─── 自動萃取中介層 ──────────────────────────────────────────────────────────
export async function autoExtractFromAPI(
  apiPath: string,
  requestBody: any,
  responseBody: any,
  statusCode: number
): Promise<void> {
  const mapping = API_EVENT_MAP[apiPath];
  if (!mapping || !mapping.autoExtract) return;

  try {
    // 錯誤回應優先萃取
    if (statusCode >= 400) {
      const errorLog = `API Error ${statusCode}: ${apiPath}\nRequest: ${JSON.stringify(
        requestBody
      ).substring(0, 500)}\nResponse: ${JSON.stringify(responseBody).substring(0, 500)}`;
      await extractShardFromErrorLog(errorLog, `API: ${apiPath}`);
      return;
    }

    // 高優先級事件萃取
    if (mapping.priority === 'high' && mapping.action === 'extract_shard') {
      const conversationLog = `API: ${apiPath}\nAction: ${
        requestBody?.action || 'N/A'
      }\nResult: ${JSON.stringify(responseBody).substring(0, 1000)}`;
      await extractMemoryShard(conversationLog, mapping.sourceType, apiPath);
    }
  } catch (error) {
    console.warn(`[MemoryRegistry] Auto-extract failed for ${apiPath}:`, error);
  }
}

// ─── API 健康檢查 ──────────────────────────────────────────────────────────
export async function checkAllAPIs(): Promise<{
  total: number;
  healthy: number;
  degraded: number;
  failed: number;
  details: Array<{ path: string; status: 'healthy' | 'degraded' | 'failed'; latency?: number }>;
}> {
  const results: Array<{
    path: string;
    status: 'healthy' | 'degraded' | 'failed';
    latency?: number;
  }> = [];
  let healthy = 0,
    degraded = 0,
    failed = 0;

  for (const path of Object.keys(API_EVENT_MAP)) {
    const start = Date.now();
    try {
      const res = await fetch(`http://localhost:3000${path}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      const latency = Date.now() - start;

      if (res.ok) {
        results.push({ path, status: 'healthy', latency });
        healthy++;
      } else if (res.status < 500) {
        results.push({ path, status: 'degraded', latency });
        degraded++;
      } else {
        results.push({ path, status: 'failed', latency });
        failed++;
      }
    } catch {
      results.push({ path, status: 'failed' });
      failed++;
    }
  }

  return { total: results.length, healthy, degraded, failed, details: results };
}
