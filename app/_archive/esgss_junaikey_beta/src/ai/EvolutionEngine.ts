/**
 * 演化引擎 (Evolution Engine)
 *
 * 基於奧秘元件定義報告 V1.2 第三章
 * 實現自我成長機制 (時間衰減 + 頻率追蹤)
 */

import { NCB_CONFIG } from '../types';
import { AIOSKernel, KernelEvent } from './core/AIOSKernel';

interface InteractionMetric {
  component: string;
  event: string;
  frequency: number;
  lastUsed: number;
}

/**
 * 演化引擎服務 (精簡版)
 */
class EvolutionEngineService {
  // Nested map: Component -> Event -> Metric
  private metrics = new Map<string, Map<string, InteractionMetric>>();
  private readonly decayFactor = 0.05; // λ 衰減常數 (報告公式)

  /**
   * 記錄交互 (時間衰減公式)
   *
   * Score_t = Score_{t-1} × e^(-λΔt) + NewInteraction
   */
  track(component: string, event: string): void {
    if (!component || !event) return; // Defensive check

    const now = Date.now();

    // Get or create component map
    let componentMetrics = this.metrics.get(component);
    if (!componentMetrics) {
      componentMetrics = new Map<string, InteractionMetric>();
      this.metrics.set(component, componentMetrics);
    }

    // Get or create metric
    let metric = componentMetrics.get(event);
    if (!metric) {
      metric = {
        component,
        event,
        frequency: 0,
        lastUsed: 0,
      };
    }

    // 時間衰減計算
    const timeDelta = (now - metric.lastUsed) / 1000; // 秒
    metric.frequency = metric.frequency * Math.exp(-this.decayFactor * timeDelta) + 1;
    metric.lastUsed = now;

    componentMetrics.set(event, metric);

    // 異步同步到 NCB (不阻塞主線程)
    this.syncToNCB(metric).catch(err => {
      // 確保錯誤被捕捉，避免未處理的 Promise 拒絕
      if (process.env.NODE_ENV === 'development') {
        console.warn('[EvolutionEngine] Sync failed (handled silently):', err);
      }
    });
  }

  /**
   * 獲取熱度排名 (Top-K)
   */
  getHotActions(component: string, limit = 5): string[] {
    if (!component) return [];

    const componentMetrics = this.metrics.get(component);
    if (!componentMetrics) {
      return [];
    }

    return Array.from(componentMetrics.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map(m => m.event);
  }

  /**
   * 獲取所有指標 (用於監控)
   */
  getAllMetrics(): InteractionMetric[] {
    const allMetrics: InteractionMetric[] = [];
    for (const componentMap of this.metrics.values()) {
      for (const metric of componentMap.values()) {
        allMetrics.push(metric);
      }
    }
    return allMetrics;
  }

  /**
   * 同步到 NoCodeBackend
   */
  private async syncToNCB(metric: InteractionMetric): Promise<void> {
    if (typeof fetch === 'undefined') return; // SSR 保護

    try {
      await fetch(`${NCB_CONFIG.baseUrl}/${NCB_CONFIG.instanceId}/omni_memories`, {
        method: 'POST',
        headers: {
          'xc-auth': NCB_CONFIG.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `evolution:${metric.component}:${metric.event}`,
          data: JSON.stringify({
            frequency: metric.frequency,
            lastUsed: metric.lastUsed,
          }),
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Rethrow to allow caller (track) to handle or log the error
      throw error;
    }
  }
}

export const EvolutionEngine = new EvolutionEngineService();

// Initialize: Subscribe to Kernel
AIOSKernel.subscribe('INTERACTION', (event: KernelEvent) => {
  const { component, event: action } = event.payload;
  EvolutionEngine.track(component, action);
});

// Legacy window integration
if (typeof window !== 'undefined') {
  window.addEventListener('omni-interaction', (event: Event) => {
    const detail = (event as CustomEvent).detail;
    AIOSKernel.dispatch({
      type: 'INTERACTION',
      source: 'DOM_BRIDGE',
      timestamp: Date.now(),
      payload: detail,
    });
  });
}
