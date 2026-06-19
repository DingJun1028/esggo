/**
 * 📊 Performance Monitor
 * --------------------------------------------------
 * [核心] 性能監控系統
 * [功能] 追蹤性能指標、識別瓶頸
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    avg_response_time: number;
    total_requests: number;
    error_rate: number;
  };
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private requestCount: number = 0;
  private errorCount: number = 0;

  /**
   * 追蹤指標
   */
  trackMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);

    // 保留最近 1000 條記錄
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  /**
   * 測量執行時間
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.trackMetric(name, duration, 'ms');
      this.requestCount++;

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.trackMetric(name, duration, 'ms');
      this.requestCount++;
      this.errorCount++;

      throw error;
    }
  }

  /**
   * 獲取指標
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || [];
    }

    const allMetrics: PerformanceMetric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }

    return allMetrics.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 獲取統計
   */
  getStats(name: string): {
    avg: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const values = metrics.map(m => m.value);

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }

  /**
   * 獲取性能報告
   */
  getReport(): PerformanceReport {
    const allMetrics = this.getMetrics();
    const avgResponseTime =
      allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + m.value, 0) / allMetrics.length
        : 0;

    return {
      metrics: allMetrics.slice(0, 100), // 最近 100 條
      summary: {
        avg_response_time: avgResponseTime,
        total_requests: this.requestCount,
        error_rate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      },
    };
  }

  /**
   * 識別慢查詢
   */
  getSlowQueries(threshold: number = 1000): PerformanceMetric[] {
    const allMetrics = this.getMetrics();
    return allMetrics.filter(m => m.value > threshold);
  }

  /**
   * 清除舊數據
   */
  cleanup(olderThan: number = 3600000): void {
    const cutoff = Date.now() - olderThan;

    for (const [name, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(m => m.timestamp > cutoff);
      this.metrics.set(name, filtered);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Metrics cleaned', {
      module: 'PerformanceMonitor',
      source_origin: 'PerformanceMonitor',
      trace_id: this.generateTraceId(),
    });
  }

  private generateTraceId(): string {
    return `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// 自動清理舊數據（每小時）
setInterval(() => {
  performanceMonitor.cleanup();
}, 3600000);
