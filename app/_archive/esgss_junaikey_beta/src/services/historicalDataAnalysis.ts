// Historical Data Analysis Service - M1 core data management module
import { DataOperationResult, dataManager } from './dataManager.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

import { AnalysisType as GlobalAnalysisType } from '../types.js';

// Analysis types
export enum DataAnalysisType {
  TREND = 'trend',
  SEASONAL = 'seasonal',
  CORRELATION = 'correlation',
  DISTRIBUTION = 'distribution',
  OUTLIER = 'outlier',
  PREDICTION = 'prediction',
  COMPARISON = 'comparison',
  AGGREGATION = 'aggregation',
  STATISTICAL = 'statistical',
}

// Time granularity
export enum DataTimeGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export const ANALYSIS_CONSTANTS = {
  MIN_DATA_POINTS: 3,
  MIN_DATA_POINTS_OUTLIER: 10,
  Z_SCORE_THRESHOLD: 3,
  IQR_THRESHOLD: 1.5,
  DEFAULT_CONTAMINATION: 0.1,
  DEFAULT_FORECAST_POINTS: 10,
  DEFAULT_ANALYSIS_DAYS: 30,
};

// Statistical metrics
export interface StatisticalMetrics {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: [number, number, number]; // Q1, Q2, Q3
  skewness: number;
  kurtosis: number;
}

// Trend analysis results
export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  slope: number;
  rSquared: number;
  confidence: number;
  seasonality: boolean;
  seasonalPattern?: number[];
  forecast: Array<{ timestamp: number; value: number; confidence: number }>;
}

// Correlation analysis results
export interface CorrelationAnalysis {
  coefficient: number;
  strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
  significance: 'significant' | 'not_significant';
  pValue: number;
  direction: 'positive' | 'negative' | 'none';
}

// Outlier detection results
export interface OutlierDetection {
  outliers: Array<{
    index: number;
    value: number;
    timestamp: number;
    zScore: number;
    method: string;
  }>;
  threshold: number;
  method: 'zscore' | 'iqr' | 'isolation_forest' | 'local_outlier_factor';
  contamination: number; // Expected outlier ratio
}

// Prediction model
export interface PredictionModel {
  id: string;
  name: string;
  type: 'linear' | 'polynomial' | 'exponential' | 'arima' | 'neural_network';
  parameters: Record<string, any>;
  accuracy: number;
  trainedAt: number;
  trainingDataSize: number;
}

// Analysis task
export interface AnalysisTask {
  id: string;
  type: DataAnalysisType;
  dataSource: string;
  field: string;
  timeRange: {
    start: number;
    end: number;
  };
  granularity: DataTimeGranularity;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

// Analysis configuration
export interface AnalysisConfig {
  id: string;
  name: string;
  type: DataAnalysisType;
  dataSource: string;
  field: string;
  parameters: Record<string, any>;
  schedule?: {
    enabled: boolean;
    interval: number; // Minutes
    lastRun?: number;
  };
  notifications: {
    onComplete: boolean;
    onError: boolean;
    recipients: string[];
  };
}

// Historical Data Analysis Service Main Class
export class HistoricalDataAnalysis {
  private static instance: HistoricalDataAnalysis;
  private analysisTasks: Map<string, AnalysisTask> = new Map();
  private analysisConfigs: Map<string, AnalysisConfig> = new Map();
  private predictionModels: Map<string, PredictionModel> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  private analysisIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeDefaultConfigs();
  }

  static getInstance(): HistoricalDataAnalysis {
    if (!HistoricalDataAnalysis.instance) {
      HistoricalDataAnalysis.instance = new HistoricalDataAnalysis();
    }
    return HistoricalDataAnalysis.instance;
  }

  // Execute statistical analysis
  async performStatisticalAnalysis(
    dataSource: string,
    field: string,
    timeRange?: { start: number; end: number }
  ): Promise<DataOperationResult<StatisticalMetrics>> {
    const startTime = Date.now();

    try {
      // Query historical data
      const queryResult = await dataManager.query(dataSource, {
        filter: timeRange
          ? {
              timestamp: { $gte: timeRange.start, $lte: timeRange.end },
            }
          : undefined,
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for analysis',
          metadata: {
            operation: 'statistical_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const values = queryResult.data
        .map((item: any) => item[field])
        .filter(val => typeof val === 'number' && !isNaN(val));

      if (values.length === 0) {
        return {
          success: false,
          error: 'No valid numeric data found for analysis',
          metadata: {
            operation: 'statistical_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const metrics = this.calculateStatisticalMetrics(values);

      return {
        success: true,
        data: metrics,
        metadata: {
          operation: 'statistical_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: values.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Statistical analysis failed',
        metadata: {
          operation: 'statistical_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // Execute trend analysis
  async performTrendAnalysis(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    options: {
      granularity?: DataTimeGranularity;
      forecastPoints?: number;
      includeSeasonality?: boolean;
    } = {}
  ): Promise<DataOperationResult<TrendAnalysis>> {
    const startTime = Date.now();
    const {
      granularity = DataTimeGranularity.DAY,
      forecastPoints = ANALYSIS_CONSTANTS.DEFAULT_FORECAST_POINTS,
      includeSeasonality = true,
    } = options;

    try {
      // Get time-series data
      const timeSeriesData = await this.getTimeSeriesData(
        dataSource,
        field,
        timeRange,
        granularity
      );

      if (timeSeriesData.length < ANALYSIS_CONSTANTS.MIN_DATA_POINTS) {
        return {
          success: false,
          error: 'Insufficient data points for trend analysis',
          metadata: {
            operation: 'trend_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const trend = this.analyzeTrend(timeSeriesData, forecastPoints, includeSeasonality);

      return {
        success: true,
        data: trend,
        metadata: {
          operation: 'trend_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: timeSeriesData.length,
          forecastPoints,
        } as any,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Trend analysis failed',
        metadata: {
          operation: 'trend_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // Execute correlation analysis
  async performCorrelationAnalysis(
    dataSource: string,
    field1: string,
    field2: string,
    timeRange?: { start: number; end: number }
  ): Promise<DataOperationResult<CorrelationAnalysis>> {
    const startTime = Date.now();

    try {
      const queryResult = await dataManager.query(dataSource, {
        filter: timeRange
          ? {
              timestamp: { $gte: timeRange.start, $lte: timeRange.end },
            }
          : undefined,
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for correlation analysis',
          metadata: {
            operation: 'correlation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const data = queryResult.data;
      const values1 = data
        .map((item: any) => item[field1])
        .filter(val => typeof val === 'number' && !isNaN(val));
      const values2 = data
        .map((item: any) => item[field2])
        .filter(val => typeof val === 'number' && !isNaN(val));

      const minLength = Math.min(values1.length, values2.length);
      if (minLength < ANALYSIS_CONSTANTS.MIN_DATA_POINTS) {
        return {
          success: false,
          error: 'Insufficient data points for correlation analysis',
          metadata: {
            operation: 'correlation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const correlation = this.calculateCorrelation(
        values1.slice(0, minLength),
        values2.slice(0, minLength)
      );

      return {
        success: true,
        data: correlation,
        metadata: {
          operation: 'correlation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: minLength,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Correlation analysis failed',
        metadata: {
          operation: 'correlation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // Outlier detection
  async detectOutliers(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    method: 'zscore' | 'iqr' | 'isolation_forest' | 'local_outlier_factor' = 'zscore',
    options: { threshold?: number; contamination?: number } = {}
  ): Promise<DataOperationResult<OutlierDetection>> {
    const startTime = Date.now();
    const {
      threshold = method === 'zscore'
        ? ANALYSIS_CONSTANTS.Z_SCORE_THRESHOLD
        : ANALYSIS_CONSTANTS.IQR_THRESHOLD,
      contamination = ANALYSIS_CONSTANTS.DEFAULT_CONTAMINATION,
    } = options;

    try {
      const queryResult = await dataManager.query(dataSource, {
        filter: {
          timestamp: { $gte: timeRange.start, $lte: timeRange.end },
        },
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for outlier detection',
          metadata: {
            operation: 'outlier_detection',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const data = queryResult.data;
      const values = data
        .map((item: any) => item[field])
        .filter(val => typeof val === 'number' && !isNaN(val));

      if (values.length < ANALYSIS_CONSTANTS.MIN_DATA_POINTS_OUTLIER) {
        return {
          success: false,
          error: 'Insufficient data points for outlier detection',
          metadata: {
            operation: 'outlier_detection',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const outliers = this.detectOutliersInData(values, method, threshold, contamination);

      // Map outliers back to original data
      const outlierResults = outliers.map(outlier => ({
        index: outlier.index,
        value: outlier.value,
        timestamp:
          (data[outlier.index] as any).timestamp ||
          (data[outlier.index] as any).createdAt ||
          Date.now(),
        zScore: outlier.zScore,
        method,
      }));

      const result: OutlierDetection = {
        outliers: outlierResults,
        threshold,
        method,
        contamination,
      };

      return {
        success: true,
        data: result,
        metadata: {
          operation: 'outlier_detection',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: values.length,
          outliersDetected: outlierResults.length,
        } as any,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Outlier detection failed',
        metadata: {
          operation: 'outlier_detection',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // Data aggregation analysis
  async performAggregationAnalysis(
    dataSource: string,
    field: string,
    groupBy: string,
    timeRange?: { start: number; end: number },
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' = 'avg'
  ): Promise<DataOperationResult<Record<string, number>>> {
    const startTime = Date.now();

    try {
      const queryResult = await dataManager.query(dataSource, {
        filter: timeRange
          ? {
              timestamp: { $gte: timeRange.start, $lte: timeRange.end },
            }
          : undefined,
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for aggregation analysis',
          metadata: {
            operation: 'aggregation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime,
          },
        };
      }

      const data = queryResult.data;
      const groupedData = data.reduce(
        (acc, item) => {
          const key = (item as any)[groupBy];
          const value = (item as any)[field];

          if (!acc[key]) {
            acc[key] = [];
          }

          if (typeof value === 'number' && !isNaN(value)) {
            acc[key].push(value);
          }

          return acc;
        },
        {} as Record<string, number[]>
      );

      const aggregated: Record<string, number> = {};

      for (const [key, rawValues] of Object.entries(groupedData)) {
        const values = rawValues as number[];
        if (values.length === 0) continue;

        switch (aggregation) {
          case 'sum':
            aggregated[key] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            aggregated[key] = values.reduce((a, b) => a + b, 0) / values.length;
            break;
          case 'count':
            aggregated[key] = values.length;
            break;
          case 'min':
            aggregated[key] = Math.min(...values);
            break;
          case 'max':
            aggregated[key] = Math.max(...values);
            break;
        }
      }

      return {
        success: true,
        data: aggregated,
        metadata: {
          operation: 'aggregation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
          groupsCount: Object.keys(aggregated).length,
          aggregationType: aggregation,
        } as any,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Aggregation analysis failed',
        metadata: {
          operation: 'aggregation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // Create analysis configuration
  createAnalysisConfig(config: Omit<AnalysisConfig, 'id'>): AnalysisConfig {
    const analysisConfig: AnalysisConfig = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...config,
    };

    this.analysisConfigs.set(analysisConfig.id, analysisConfig);

    if (config.schedule?.enabled) {
      this.scheduleAnalysisConfig(analysisConfig.id);
    }

    return analysisConfig;
  }

  // Execute scheduled analysis
  private scheduleAnalysisConfig(configId: string): void {
    const config = this.analysisConfigs.get(configId);
    if (!config || !config.schedule?.enabled) return;

    const intervalMs = config.schedule.interval * 60 * 1000;
    const intervalId = setInterval(() => {
      this.executeAnalysisConfig(configId);
    }, intervalMs);

    this.analysisIntervals.set(configId, intervalId);
  }

  // Execute analysis configuration
  async executeAnalysisConfig(configId: string): Promise<DataOperationResult<any>> {
    const config = this.analysisConfigs.get(configId);
    if (!config) {
      return {
        success: false,
        error: 'Analysis configuration not found',
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: Date.now(),
          duration: 0,
        },
      };
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: AnalysisTask = {
      id: taskId,
      type: config.type,
      dataSource: config.dataSource,
      field: config.field,
      timeRange: {
        start: Date.now() - ANALYSIS_CONSTANTS.DEFAULT_ANALYSIS_DAYS * 24 * 60 * 60 * 1000,
        end: Date.now(),
      }, // Past 30 days
      granularity: DataTimeGranularity.DAY,
      status: 'running',
      progress: 0,
      createdAt: Date.now(),
    };

    this.analysisTasks.set(taskId, task);

    try {
      let result: any;

      switch (config.type) {
        case DataAnalysisType.TREND:
          const trendResult = await this.performTrendAnalysis(
            config.dataSource,
            config.field,
            task.timeRange,
            config.parameters
          );
          result = trendResult.success ? trendResult.data : null;
          break;

        case DataAnalysisType.STATISTICAL:
          const statResult = await this.performStatisticalAnalysis(
            config.dataSource,
            config.field,
            task.timeRange
          );
          result = statResult.success ? statResult.data : null;
          break;

        case DataAnalysisType.OUTLIER:
          const outlierResult = await this.detectOutliers(
            config.dataSource,
            config.field,
            task.timeRange,
            config.parameters.method || 'zscore',
            config.parameters
          );
          result = outlierResult.success ? outlierResult.data : null;
          break;

        default:
          throw new Error(`Unsupported analysis type: ${config.type}`);
      }

      task.status = 'completed';
      task.progress = 100;
      task.completedAt = Date.now();
      task.result = result;

      this.analysisTasks.set(taskId, task);

      if (config.notifications.onComplete) {
        this.notifySubscribers('analysis_completed', {
          configId,
          taskId,
          result,
          config: config.name,
        });
      }

      return {
        success: true,
        data: result,
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: task.createdAt,
          duration: task.completedAt - task.createdAt,
          taskId,
        },
      };
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Analysis failed';
      task.completedAt = Date.now();
      this.analysisTasks.set(taskId, task);

      if (config.notifications.onError) {
        this.notifySubscribers('analysis_failed', {
          configId,
          taskId,
          error: task.error,
          config: config.name,
        });
      }

      return {
        success: false,
        error: task.error,
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: task.createdAt,
          duration: task.completedAt - task.createdAt,
          taskId,
        },
      };
    }
  }

  // Get analysis report
  generateAnalysisReport(taskId: string): string {
    const task = this.analysisTasks.get(taskId);
    if (!task || !task.result) {
      return 'Analysis task not found or incomplete';
    }

    let report = `# Historical Data Analysis Report\n\n`;
    report += `**Task ID**: ${task.id}\n`;
    report += `**Analysis Type**: ${task.type}\n`;
    report += `**Data Source**: ${task.dataSource}\n`;
    report += `**Field**: ${task.field}\n`;
    report += `**Time Range**: ${new Date(task.timeRange.start).toLocaleString()} - ${new Date(task.timeRange.end).toLocaleString()}\n`;
    report += `**Completion Time**: ${new Date(task.completedAt || Date.now()).toLocaleString()}\n\n`;

    // Generate specific report content based on analysis type
    switch (task.type) {
      case DataAnalysisType.TREND:
        const trend = task.result as TrendAnalysis;
        report += `## Trend Analysis Results\n\n`;
        report += `**Trend Direction**: ${trend.direction}\n`;
        report += `**Slope**: ${trend.slope.toFixed(4)}\n`;
        report += `**Coefficient of Determination (R²)**: ${(trend.rSquared * 100).toFixed(2)}%\n`;
        report += `**Confidence**: ${(trend.confidence * 100).toFixed(2)}%\n`;
        report += `**Seasonality**: ${trend.seasonality ? 'Yes' : 'No'}\n`;
        break;

      case DataAnalysisType.STATISTICAL:
        const stats = task.result as StatisticalMetrics;
        report += `## Statistical Analysis Results\n\n`;
        report += `**Data Points Count**: ${stats.count}\n`;
        report += `**Mean**: ${stats.mean.toFixed(4)}\n`;
        report += `**Median**: ${stats.median.toFixed(4)}\n`;
        report += `**Standard Deviation**: ${stats.standardDeviation.toFixed(4)}\n`;
        report += `**Minimum**: ${stats.min}\n`;
        report += `**Maximum**: ${stats.max}\n`;
        break;

      case DataAnalysisType.OUTLIER:
        const outliers = task.result as OutlierDetection;
        report += `## Outlier Detection Results\n\n`;
        report += `**Detection Method**: ${outliers.method}\n`;
        report += `**Threshold**: ${outliers.threshold}\n`;
        report += `**Outliers Detected**: ${outliers.outliers.length} units\n`;
        if (outliers.outliers.length > 0) {
          report += `\n### Outlier Details\n\n`;
          outliers.outliers.slice(0, 10).forEach((outlier, index) => {
            report += `${index + 1}. Value: ${outlier.value}, Z-Score: ${outlier.zScore.toFixed(2)}, Time: ${new Date(outlier.timestamp).toLocaleString()}\n`;
          });
          if (outliers.outliers.length > 10) {
            report += `\n...and ${outliers.outliers.length - 10} more outliers\n`;
          }
        }
        break;
    }

    return report;
  }

  // Event subscription
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  // Private method implementation

  private calculateStatisticalMetrics(values: number[]): StatisticalMetrics {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const median =
      n % 2 === 0
        ? ((sorted[n / 2 - 1] ?? 0) + (sorted[n / 2] ?? 0)) / 2
        : sorted[Math.floor(n / 2)];

    // Calculate mode
    const frequency: Record<number, number> = {};
    sorted.forEach(val => (frequency[val] = (frequency[val] || 0) + 1));
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);

    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);

    const q1Index = Math.floor(n / 4);
    const q3Index = Math.floor((3 * n) / 4);
    const quartiles: [number, number, number] = [
      sorted[q1Index] ?? 0,
      median ?? 0,
      sorted[q3Index] ?? 0,
    ];

    const min = sorted[0] ?? 0;
    const max = sorted[sorted.length - 1] ?? 0;
    const range = max - min;
    const q1Value = sorted[q1Index] ?? 0;
    const q3Value = sorted[q3Index] ?? 0;

    // Calculate skewness and kurtosis (simplified implementation)
    const skewness =
      sorted.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n || 0;
    const kurtosis =
      (sorted.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n ||
        0) - 3;

    return {
      count: n,
      sum,
      mean,
      median: median ?? 0,
      mode,
      standardDeviation: standardDeviation || 0,
      variance: variance || 0,
      min,
      max,
      range,
      quartiles: [q1Value, median ?? 0, q3Value],
      skewness,
      kurtosis,
    };
  }

  private async getTimeSeriesData(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    granularity: DataTimeGranularity
  ): Promise<Array<{ timestamp: number; value: number }>> {
    const queryResult = await dataManager.query(dataSource, {
      filter: {
        timestamp: { $gte: timeRange.start, $lte: timeRange.end },
      },
      sort: { timestamp: 'asc' },
    });

    if (!queryResult.success || !queryResult.data) {
      return [];
    }

    // Aggregate data by time granularity
    const groupedData = queryResult.data.reduce(
      (acc, item) => {
        const timestamp = (item as any).timestamp || (item as any).createdAt || 0;
        const value = (item as any)[field];

        if (typeof value !== 'number' || isNaN(value)) return acc;

        const groupKey = this.getTimeGroupKey(timestamp, granularity);

        if (!acc[groupKey]) {
          acc[groupKey] = { sum: 0, count: 0, timestamp: groupKey };
        }

        acc[groupKey].sum += value;
        acc[groupKey].count += 1;

        return acc;
      },
      {} as Record<string, { sum: number; count: number; timestamp: number }>
    );

    return Object.values(groupedData)
      .map((group: any) => ({
        timestamp: group.timestamp,
        value: group.sum / group.count, // Average value
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private getTimeGroupKey(timestamp: number, granularity: DataTimeGranularity): number {
    const date = new Date(timestamp);

    switch (granularity) {
      case DataTimeGranularity.HOUR:
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours()
        ).getTime();
      case DataTimeGranularity.DAY:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      case DataTimeGranularity.WEEK:
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate()
        ).getTime();
      case DataTimeGranularity.MONTH:
        return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      case DataTimeGranularity.QUARTER:
        const quarter = Math.floor(date.getMonth() / 3);
        return new Date(date.getFullYear(), quarter * 3, 1).getTime();
      case DataTimeGranularity.YEAR:
        return new Date(date.getFullYear(), 0, 1).getTime();
      default:
        return timestamp;
    }
  }

  private analyzeTrend(
    data: Array<{ timestamp: number; value: number }>,
    forecastPoints: number,
    includeSeasonality: boolean
  ): TrendAnalysis {
    const n = data.length;
    const xValues = data.map((_, i) => i);
    const yValues = data.map(d => d.value);

    // Simple linear regression
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * (yValues[i] ?? 0), 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate coefficient of determination R²
    const yMean = sumY / n;
    const ssRes = yValues.reduce((sum, y, i) => {
      const predicted = slope * (xValues[i] ?? 0) + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const rSquared = 1 - ssRes / ssTot;

    // Determine trend direction
    let direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    const absSlope = Math.abs(slope);
    const volatility = this.calculateVolatility(yValues);

    if (absSlope < 0.01) {
      direction = 'stable';
    } else if (absSlope > volatility * 2) {
      direction = slope > 0 ? 'increasing' : 'decreasing';
    } else {
      direction = 'volatile';
    }

    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= forecastPoints; i++) {
      const x = n + i - 1;
      const predicted = slope * x + intercept;
      const confidence = Math.max(0.1, 1 - i * 0.1); // Simplified confidence calculation
      forecast.push({
        timestamp:
          (data[n - 1]?.timestamp ?? 0) +
          i * ((data[1]?.timestamp ?? 0) - (data[0]?.timestamp ?? 0)),
        value: predicted,
        confidence,
      });
    }

    // Detect seasonality (simplified implementation)
    const seasonality = this.detectSeasonality(yValues);

    return {
      direction,
      slope,
      rSquared: Math.max(0, Math.min(1, rSquared)),
      confidence: Math.max(0, Math.min(1, rSquared)),
      seasonality,
      seasonalPattern: seasonality ? this.extractSeasonalPattern(yValues, 7) : undefined,
      forecast,
    };
  }

  private calculateVolatility(values: number[]): number {
    const returns = [];
    for (let i = 1; i < values.length; i++) {
      returns.push(((values[i] ?? 0) - (values[i - 1] ?? 0)) / (values[i - 1] ?? 1));
    }
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private detectSeasonality(values: number[], minPeriod = 3, maxPeriod = 12): boolean {
    if (values.length < maxPeriod * 2) return false;

    for (let period = minPeriod; period <= Math.min(maxPeriod, values.length / 2); period++) {
      const correlations = [];
      for (let lag = 1; lag <= 3; lag++) {
        if (values.length >= period * lag + period) {
          const correlation = this.calculateCorrelation(
            values.slice(0, period),
            values.slice(period * lag, period * lag + period)
          );
          correlations.push(Math.abs(correlation.coefficient));
        }
      }

      const avgCorrelation = correlations.reduce((a, b) => a + b, 0) / correlations.length;
      if (avgCorrelation > 0.7) {
        // Strong correlation indicates seasonality
        return true;
      }
    }

    return false;
  }

  private extractSeasonalPattern(values: number[], period: number): number[] {
    const pattern = new Array(period).fill(0);
    const counts = new Array(period).fill(0);

    values.forEach((value, index) => {
      const pos = index % period;
      pattern[pos] += value;
      counts[pos]++;
    });

    return pattern.map((sum, i) => sum / counts[i]);
  }

  private calculateCorrelation(x: number[], y: number[]): CorrelationAnalysis {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, val, i) => sum + val * (y[i] ?? 0), 0);
    const sumXX = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    const coefficient = denominator === 0 ? 0 : numerator / denominator;

    // Determine correlation strength
    let strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
    const absCoeff = Math.abs(coefficient);
    if (absCoeff < 0.2) strength = 'very_weak';
    else if (absCoeff < 0.4) strength = 'weak';
    else if (absCoeff < 0.6) strength = 'moderate';
    else if (absCoeff < 0.8) strength = 'strong';
    else strength = 'very_strong';

    // Simplified significance test (p-value approximation)
    const tStatistic =
      Math.abs(coefficient) * Math.sqrt((n - 2) / (1 - coefficient * coefficient)) || 0;
    const pValue = this.approximatePValue(tStatistic, n - 2);

    let direction: 'positive' | 'negative' | 'none';
    if (coefficient > 0.1) direction = 'positive';
    else if (coefficient < -0.1) direction = 'negative';
    else direction = 'none';

    return {
      coefficient,
      strength,
      significance: pValue < 0.05 ? 'significant' : 'not_significant',
      pValue,
      direction,
    };
  }

  private approximatePValue(t: number, df: number): number {
    // Simplified t-distribution p-value approximation
    const absT = Math.abs(t);
    if (absT > 4) return 0.0001;
    if (absT > 3) return 0.001;
    if (absT > 2) return 0.01;
    if (absT > 1.5) return 0.05;
    return 0.1;
  }

  private detectOutliersInData(
    values: number[],
    method: 'zscore' | 'iqr' | 'isolation_forest' | 'local_outlier_factor',
    threshold: number,
    contamination: number
  ): Array<{ index: number; value: number; zScore: number }> {
    const outliers: Array<{ index: number; value: number; zScore: number }> = [];

    switch (method) {
      case 'zscore':
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(
          values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
        );

        values.forEach((value, index) => {
          const zScore = Math.abs((value - mean) / stdDev);
          if (zScore > threshold) {
            outliers.push({ index, value, zScore });
          }
        });
        break;

      case 'iqr':
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
        const q3 = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
        const iqr = q3 - q1;
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;

        values.forEach((value, index) => {
          if (value < lowerBound || value > upperBound) {
            const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
            const zScore = (value - median) / (iqr / 1.349); // Approximate conversion to Z-score
            outliers.push({ index, value, zScore });
          }
        });
        break;

      // Other methods can be added as needed
      default:
        // Default to Z-score method
        return this.detectOutliersInData(values, 'zscore', threshold, contamination);
    }

    return outliers;
  }

  private initializeDefaultConfigs(): void {
    // Initialize default analysis configurations
    const defaultConfigs: Omit<AnalysisConfig, 'id'>[] = [
      {
        name: 'Carbon Emission Trend Analysis',
        type: DataAnalysisType.TREND,
        dataSource: 'carbon_emissions',
        field: 'scope1',
        parameters: {
          granularity: DataTimeGranularity.MONTH,
          forecastPoints: 6,
          includeSeasonality: true,
        },
        schedule: {
          enabled: true,
          interval: 1440, // Daily
        },
        notifications: {
          onComplete: true,
          onError: true,
          recipients: ['admin@company.com'],
        },
      },
      {
        name: 'Employee Satisfaction Statistical Analysis',
        type: DataAnalysisType.STATISTICAL,
        dataSource: 'social_impact',
        field: 'employeeSatisfaction',
        parameters: {},
        schedule: {
          enabled: true,
          interval: 10080, // Weekly
        },
        notifications: {
          onComplete: true,
          onError: false,
          recipients: ['hr@company.com'],
        },
      },
      {
        name: 'Financial Metric Anomaly Detection',
        type: DataAnalysisType.OUTLIER,
        dataSource: 'financial_data',
        field: 'revenue',
        parameters: {
          method: 'zscore',
          threshold: 2.5,
        },
        schedule: {
          enabled: true,
          interval: 1440, // Daily
        },
        notifications: {
          onComplete: false,
          onError: true,
          recipients: ['finance@company.com'],
        },
      },
    ];

    defaultConfigs.forEach(config => {
      this.createAnalysisConfig(config);
    });
  }

  private notifySubscribers(event: string, data: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          omniLogger.error(LogCategory.SYSTEM, '[historicalDataAnalysis] Event subscriber callback failed:', { error })
        }
      });
    }
  }

  // Cleanup resources
  destroy(): void {
    this.analysisIntervals.forEach(interval => clearInterval(interval));
    this.analysisIntervals.clear();
    this.analysisTasks.clear();
    this.analysisConfigs.clear();
    this.predictionModels.clear();
    this.subscribers.clear();
  }
}

// Export singleton instance
export const historicalDataAnalysis = HistoricalDataAnalysis.getInstance();
