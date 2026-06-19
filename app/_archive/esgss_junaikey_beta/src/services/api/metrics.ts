/**
 * metrics.ts
 * Performance Monitoring System
 *
 * Provides API performance metrics collection and analysis
 */

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  endpoint: string;
  requestCount: number;
  successCount: number;
  failureCount: number;
  totalDuration: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  successRate: number;
}

/**
 * Request Record
 */
interface RequestRecord {
  timestamp: number;
  duration: number;
  success: boolean;
}

/**
 * Performance Metrics Collector
 */
export class MetricsCollector {
  private records: Map<string, RequestRecord[]> = new Map();
  private readonly maxRecordsPerEndpoint: number = 1000;

  /**
   * Record Request
   */
  recordRequest(endpoint: string, duration: number, success: boolean): void {
    if (!this.records.has(endpoint)) {
      this.records.set(endpoint, []);
    }

    const records = this.records.get(endpoint)!;
    records.push({
      timestamp: Date.now(),
      duration,
      success,
    });

    // Limit record count
    if (records.length > this.maxRecordsPerEndpoint) {
      records.shift();
    }
  }

  /**
   * Get endpoint metrics
   */
  getMetrics(endpoint: string): PerformanceMetrics | null {
    const records = this.records.get(endpoint);
    if (!records || records.length === 0) {
      return null;
    }

    const durations = records.map(r => r.duration).sort((a, b) => a - b);
    const successCount = records.filter(r => r.success).length;
    const failureCount = records.length - successCount;

    return {
      endpoint,
      requestCount: records.length,
      successCount,
      failureCount,
      totalDuration: durations.reduce((sum, d) => sum + d, 0),
      avgResponseTime: this.calculateAverage(durations),
      minResponseTime: durations[0] || 0,
      maxResponseTime: durations[durations.length - 1] || 0,
      p50ResponseTime: this.calculatePercentile(durations, 50),
      p95ResponseTime: this.calculatePercentile(durations, 95),
      p99ResponseTime: this.calculatePercentile(durations, 99),
      errorRate: (failureCount / records.length) * 100,
      successRate: (successCount / records.length) * 100,
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, PerformanceMetrics> {
    const allMetrics: Record<string, PerformanceMetrics> = {};

    for (const endpoint of this.records.keys()) {
      const metrics = this.getMetrics(endpoint);
      if (metrics) {
        allMetrics[endpoint] = metrics;
      }
    }

    return allMetrics;
  }

  /**
   * Reset metrics
   */
  reset(endpoint?: string): void {
    if (endpoint) {
      this.records.delete(endpoint);
    } else {
      this.records.clear();
    }
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalRequests: number;
    totalSuccesses: number;
    totalFailures: number;
    overallErrorRate: number;
    avgResponseTime: number;
  } {
    let totalRequests = 0;
    let totalSuccesses = 0;
    let totalFailures = 0;
    let totalDuration = 0;

    for (const records of this.records.values()) {
      totalRequests += records.length;
      totalSuccesses += records.filter(r => r.success).length;
      totalDuration += records.reduce((sum, r) => sum + r.duration, 0);
    }

    totalFailures = totalRequests - totalSuccesses;

    return {
      totalRequests,
      totalSuccesses,
      totalFailures,
      overallErrorRate: totalRequests > 0 ? (totalFailures / totalRequests) * 100 : 0,
      avgResponseTime: totalRequests > 0 ? totalDuration / totalRequests : 0,
    };
  }

  /**
   * Calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
    const value = sortedValues[Math.max(0, index)];
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Cleanup old records
   */
  cleanupOldRecords(maxAgeMs: number = 3600000): void {
    const now = Date.now();

    for (const [endpoint, records] of this.records.entries()) {
      const filtered = records.filter(r => now - r.timestamp < maxAgeMs);

      if (filtered.length === 0) {
        this.records.delete(endpoint);
      } else {
        this.records.set(endpoint, filtered);
      }
    }
  }
}

/**
 * Global metrics collector instance
 */
export const metricsCollector = new MetricsCollector();
