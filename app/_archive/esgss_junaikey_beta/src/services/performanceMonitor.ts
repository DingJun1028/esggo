/**
 * 📊 Performance Monitor
 * --------------------------------------------------
 * [Core] Performance Monitoring System
 * [Function] Track performance metrics, identify bottlenecks
 */

import { omniLogger } from './omniLogger.js';

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
   * Track metric
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

    // Keep recent 1000 records
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  /**
   * Measure execution time
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
   * Get metrics
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
   * Get stats
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
   * Get performance report
   */
  getReport(): PerformanceReport {
    const allMetrics = this.getMetrics();
    const avgResponseTime =
      allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + m.value, 0) / allMetrics.length
        : 0;

    return {
      metrics: allMetrics.slice(0, 100), // Recent 100 entries
      summary: {
        avg_response_time: avgResponseTime,
        total_requests: this.requestCount,
        error_rate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      },
    };
  }

  /**
   * Identify slow queries
   */
  getSlowQueries(threshold: number = 1000): PerformanceMetric[] {
    const allMetrics = this.getMetrics();
    return allMetrics.filter(m => m.value > threshold);
  }

  /**
   * Cleanup old data
   */
  cleanup(olderThan: number = 3600000): void {
    const cutoff = Date.now() - olderThan;

    for (const [name, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(m => m.timestamp > cutoff);
      this.metrics.set(name, filtered);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Performance', 'Metrics cleaned', {
      source_origin: 'PerformanceMonitor',
      trace_id: this.generateTraceId(),
    });
  }

  private generateTraceId(): string {
    return `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-cleanup old data (every hour)
setInterval(() => {
  performanceMonitor.cleanup();
}, 3600000);
