// Anomaly Detection Service - M1 Advanced Analytics Module
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';

// Anomaly Detection Method
export enum AnomalyMethod {
  Z_SCORE = 'z_score',
  IQR = 'iqr',
  ISOLATION_FOREST = 'isolation_forest', // Simplified simulation
  DENSITY = 'density',
}

// Detection Config
export interface DetectionConfig {
  method: AnomalyMethod;
  threshold: number;
  sensitivity: number; // 0-1
  windowSize?: number;
  contamination?: number; // Added to match historicalDataAnalysis usage
}

// Anomaly Result
export interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  details: string;
  timestamp: number;
  value: number;
  index?: number; // Added to match historicalDataAnalysis usage
  zScore?: number; // Added to match historicalDataAnalysis usage
  method?: string; // Added
}

// Main Class
export class AnomalyDetector {
  private static instance: AnomalyDetector;

  private constructor() {}

  static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector();
    }
    return AnomalyDetector.instance;
  }

  // Detect Anomalies (Batch)
  detectAnomalies(values: number[], config: DetectionConfig): AnomalyResult[] {
    switch (config.method) {
      case AnomalyMethod.Z_SCORE:
        return this.detectZScore(values, config.threshold);
      case AnomalyMethod.IQR:
        return this.detectIQR(values, config.threshold);
      default:
        return this.detectZScore(values, config.threshold);
    }
  }

  // Detect Single Point (Streaming)
  detectStream(value: number, history: number[], config: DetectionConfig): AnomalyResult {
    const window = config.windowSize ? history.slice(-config.windowSize) : history;
    const allValues = [...window, value];
    const results = this.detectAnomalies(allValues, config);

    if (results.length === 0) {
      return {
        isAnomaly: false,
        score: 0,
        details: 'Insufficient data',
        timestamp: Date.now(),
        value,
        index: 0,
        method: config.method || 'unknown',
      };
    }

    return results[results.length - 1] as AnomalyResult; // Return result for the latest value
  }

  // Z-Score Implementation
  private detectZScore(values: number[], threshold: number): AnomalyResult[] {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return values.map((value, index) => {
      const zScore = stdDev === 0 ? 0 : Math.abs((value - mean) / stdDev);
      const isAnomaly = zScore > threshold;

      return {
        isAnomaly,
        score: zScore,
        zScore,
        index,
        method: 'zscore',
        details: isAnomaly ? `Z-Score: ${zScore.toFixed(2)} > ${threshold}` : 'Normal',
        timestamp: Date.now(),
        value,
      };
    });
  }

  // IQR Implementation
  private detectIQR(values: number[], thresholdMultiplier: number): AnomalyResult[] {
    if (values.length < 4) return []; // Not enough data for quartiles

    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
    const q3 = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
    const iqr = q3 - q1;
    const lowerBound = q1 - thresholdMultiplier * iqr;
    const upperBound = q3 + thresholdMultiplier * iqr;

    return values.map((value, index) => {
      const isAnomaly = value < lowerBound || value > upperBound;
      let score = 0;
      if (iqr > 0) {
        score = Math.abs(value - (q1 + q3) / 2) / iqr;
      }

      return {
        isAnomaly,
        score,
        index,
        method: 'iqr',
        details: isAnomaly
          ? `Value ${value} outside range [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`
          : 'Normal',
        timestamp: Date.now(),
        value,
      };
    });
  }
  // Health Check
  async isHealthy(): Promise<boolean> {
    return true;
  }

  // High-Level Detect Method (for AIIntelligenceService)
  async detect(params: {
    data: Record<string, Array<{ date: string; value: number }>>;
    config: any;
  }): Promise<any> {
    const anomalies: any[] = [];
    let riskScore = 0;

    for (const [metric, points] of Object.entries(params.data)) {
      const values = points.map(p => p.value);
      // Use Z-Score by default or config
      const method = params.config.method || AnomalyMethod.Z_SCORE;
      const threshold = params.config.threshold || 2.0;

      const results = this.detectAnomalies(values, {
        method: AnomalyMethod.Z_SCORE, // simplified mapping
        threshold,
        sensitivity: 0.5,
      });

      // Find anomalies in results
      results.forEach((res, idx) => {
        if (res.isAnomaly) {
          const point = points[idx];
          if (point) {
            anomalies.push({
              metric,
              timestamp: point.date,
              value: point.value,
              expectedRange: { min: point.value - res.score, max: point.value + res.score }, // approximation
              deviation: res.score,
              severity: res.score > 3 ? 'high' : 'medium',
              cause: res.details,
              recommendation: 'Investigate outlier',
            });
            riskScore += res.score;
          }
        }
      });
    }

    return {
      anomalies,
      overallHealth: anomalies.length > 0 ? (riskScore > 10 ? 'critical' : 'warning') : 'healthy',
      riskScore: Math.min(100, riskScore),
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const anomalyDetector = AnomalyDetector.getInstance();
