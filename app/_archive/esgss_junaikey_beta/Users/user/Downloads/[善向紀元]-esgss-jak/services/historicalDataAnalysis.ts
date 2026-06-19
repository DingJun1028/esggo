// 歷史數據分析服務 - M1核心數據管理模組
import { DataOperationResult, dataManager } from './dataManager';

// 分析類型
export enum AnalysisType {
  TREND = 'trend',
  SEASONAL = 'seasonal',
  CORRELATION = 'correlation',
  DISTRIBUTION = 'distribution',
  OUTLIER = 'outlier',
  PREDICTION = 'prediction',
  COMPARISON = 'comparison',
  AGGREGATION = 'aggregation'
}

// 時間粒度
export enum TimeGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

// 統計指標
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

// 趨勢分析結果
export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  slope: number;
  rSquared: number;
  confidence: number;
  seasonality: boolean;
  seasonalPattern?: number[];
  forecast: Array<{ timestamp: number; value: number; confidence: number }>;
}

// 相關性分析結果
export interface CorrelationAnalysis {
  coefficient: number;
  strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
  significance: number;
  pValue: number;
  direction: 'positive' | 'negative' | 'none';
}

// 異常檢測結果
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
  contamination: number; // 預期異常比例
}

// 預測模型
export interface PredictionModel {
  id: string;
  name: string;
  type: 'linear' | 'polynomial' | 'exponential' | 'arima' | 'neural_network';
  parameters: Record<string, any>;
  accuracy: number;
  trainedAt: number;
  trainingDataSize: number;
}

// 分析任務
export interface AnalysisTask {
  id: string;
  type: AnalysisType;
  dataSource: string;
  field: string;
  timeRange: {
    start: number;
    end: number;
  };
  granularity: TimeGranularity;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

// 分析配置
export interface AnalysisConfig {
  id: string;
  name: string;
  type: AnalysisType;
  dataSource: string;
  field: string;
  parameters: Record<string, any>;
  schedule?: {
    enabled: boolean;
    interval: number; // 分鐘
    lastRun?: number;
  };
  notifications: {
    onComplete: boolean;
    onError: boolean;
    recipients: string[];
  };
}

// 歷史數據分析服務主類
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

  // 執行統計分析
  async performStatisticalAnalysis(
    dataSource: string,
    field: string,
    timeRange?: { start: number; end: number }
  ): Promise<DataOperationResult<StatisticalMetrics>> {
    const startTime = Date.now();

    try {
      // 查詢歷史數據
      const queryResult = await dataManager.query(dataSource, {
        filter: timeRange ? {
          timestamp: { $gte: timeRange.start, $lte: timeRange.end }
        } : undefined
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for analysis',
          metadata: {
            operation: 'statistical_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const values = queryResult.data
        .map(item => item[field])
        .filter(val => typeof val === 'number' && !isNaN(val));

      if (values.length === 0) {
        return {
          success: false,
          error: 'No valid numeric data found for analysis',
          metadata: {
            operation: 'statistical_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
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
          dataPoints: values.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Statistical analysis failed',
        metadata: {
          operation: 'statistical_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 執行趨勢分析
  async performTrendAnalysis(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    options: {
      granularity?: TimeGranularity;
      forecastPoints?: number;
      includeSeasonality?: boolean;
    } = {}
  ): Promise<DataOperationResult<TrendAnalysis>> {
    const startTime = Date.now();
    const { granularity = TimeGranularity.DAY, forecastPoints = 10, includeSeasonality = true } = options;

    try {
      // 獲取時間序列數據
      const timeSeriesData = await this.getTimeSeriesData(dataSource, field, timeRange, granularity);

      if (timeSeriesData.length < 3) {
        return {
          success: false,
          error: 'Insufficient data points for trend analysis',
          metadata: {
            operation: 'trend_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
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
          forecastPoints
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Trend analysis failed',
        metadata: {
          operation: 'trend_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 執行相關性分析
  async performCorrelationAnalysis(
    dataSource: string,
    field1: string,
    field2: string,
    timeRange?: { start: number; end: number }
  ): Promise<DataOperationResult<CorrelationAnalysis>> {
    const startTime = Date.now();

    try {
      const queryResult = await dataManager.query(dataSource, {
        filter: timeRange ? {
          timestamp: { $gte: timeRange.start, $lte: timeRange.end }
        } : undefined
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for correlation analysis',
          metadata: {
            operation: 'correlation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const data = queryResult.data;
      const values1 = data.map(item => item[field1]).filter(val => typeof val === 'number' && !isNaN(val));
      const values2 = data.map(item => item[field2]).filter(val => typeof val === 'number' && !isNaN(val));

      const minLength = Math.min(values1.length, values2.length);
      if (minLength < 3) {
        return {
          success: false,
          error: 'Insufficient data points for correlation analysis',
          metadata: {
            operation: 'correlation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const correlation = this.calculateCorrelation(values1.slice(0, minLength), values2.slice(0, minLength));

      return {
        success: true,
        data: correlation,
        metadata: {
          operation: 'correlation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: minLength
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Correlation analysis failed',
        metadata: {
          operation: 'correlation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 異常檢測
  async detectOutliers(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    method: 'zscore' | 'iqr' | 'isolation_forest' | 'local_outlier_factor' = 'zscore',
    options: { threshold?: number; contamination?: number } = {}
  ): Promise<DataOperationResult<OutlierDetection>> {
    const startTime = Date.now();
    const { threshold = method === 'zscore' ? 3 : 1.5, contamination = 0.1 } = options;

    try {
      const queryResult = await dataManager.query(dataSource, {
        filter: {
          timestamp: { $gte: timeRange.start, $lte: timeRange.end }
        }
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for outlier detection',
          metadata: {
            operation: 'outlier_detection',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const data = queryResult.data;
      const values = data.map(item => item[field]).filter(val => typeof val === 'number' && !isNaN(val));

      if (values.length < 10) {
        return {
          success: false,
          error: 'Insufficient data points for outlier detection',
          metadata: {
            operation: 'outlier_detection',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const outliers = this.detectOutliersInData(values, method, threshold, contamination);

      // 將異常點映射回原始數據
      const outlierResults = outliers.map(outlier => ({
        index: outlier.index,
        value: outlier.value,
        timestamp: data[outlier.index].timestamp,
        zScore: outlier.zScore,
        method
      }));

      const result: OutlierDetection = {
        outliers: outlierResults,
        threshold,
        method,
        contamination
      };

      return {
        success: true,
        data: result,
        metadata: {
          operation: 'outlier_detection',
          timestamp: startTime,
          duration: Date.now() - startTime,
          dataPoints: values.length,
          outliersDetected: outlierResults.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Outlier detection failed',
        metadata: {
          operation: 'outlier_detection',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 數據聚合分析
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
        filter: timeRange ? {
          timestamp: { $gte: timeRange.start, $lte: timeRange.end }
        } : undefined
      });

      if (!queryResult.success || !queryResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve data for aggregation analysis',
          metadata: {
            operation: 'aggregation_analysis',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const data = queryResult.data;
      const groupedData = data.reduce((acc, item) => {
        const key = item[groupBy];
        const value = item[field];

        if (!acc[key]) {
          acc[key] = [];
        }

        if (typeof value === 'number' && !isNaN(value)) {
          acc[key].push(value);
        }

        return acc;
      }, {} as Record<string, number[]>);

      const aggregated: Record<string, number> = {};

      for (const [key, values] of Object.entries(groupedData)) {
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
          aggregationType: aggregation
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Aggregation analysis failed',
        metadata: {
          operation: 'aggregation_analysis',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 創建分析配置
  createAnalysisConfig(config: Omit<AnalysisConfig, 'id'>): AnalysisConfig {
    const analysisConfig: AnalysisConfig = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...config
    };

    this.analysisConfigs.set(analysisConfig.id, analysisConfig);

    if (config.schedule?.enabled) {
      this.scheduleAnalysisConfig(analysisConfig.id);
    }

    return analysisConfig;
  }

  // 執行定時分析
  private scheduleAnalysisConfig(configId: string): void {
    const config = this.analysisConfigs.get(configId);
    if (!config || !config.schedule?.enabled) return;

    const intervalMs = config.schedule.interval * 60 * 1000;
    const intervalId = setInterval(() => {
      this.executeAnalysisConfig(configId);
    }, intervalMs);

    this.analysisIntervals.set(configId, intervalId);
  }

  // 執行分析配置
  async executeAnalysisConfig(configId: string): Promise<DataOperationResult<any>> {
    const config = this.analysisConfigs.get(configId);
    if (!config) {
      return {
        success: false,
        error: 'Analysis configuration not found',
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: Date.now(),
          duration: 0
        }
      };
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: AnalysisTask = {
      id: taskId,
      type: config.type,
      dataSource: config.dataSource,
      field: config.field,
      timeRange: { start: Date.now() - (30 * 24 * 60 * 60 * 1000), end: Date.now() }, // 過去30天
      granularity: TimeGranularity.DAY,
      status: 'running',
      progress: 0,
      createdAt: Date.now()
    };

    this.analysisTasks.set(taskId, task);

    try {
      let result: any;

      switch (config.type) {
        case AnalysisType.TREND:
          const trendResult = await this.performTrendAnalysis(
            config.dataSource,
            config.field,
            task.timeRange,
            config.parameters
          );
          result = trendResult.success ? trendResult.data : null;
          break;

        case AnalysisType.STATISTICAL:
          const statResult = await this.performStatisticalAnalysis(
            config.dataSource,
            config.field,
            task.timeRange
          );
          result = statResult.success ? statResult.data : null;
          break;

        case AnalysisType.OUTLIER:
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
          config: config.name
        });
      }

      return {
        success: true,
        data: result,
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: task.createdAt,
          duration: task.completedAt - task.createdAt,
          taskId
        }
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
          config: config.name
        });
      }

      return {
        success: false,
        error: task.error,
        metadata: {
          operation: 'execute_analysis_config',
          timestamp: task.createdAt,
          duration: task.completedAt - task.createdAt,
          taskId
        }
      };
    }
  }

  // 獲取分析報告
  generateAnalysisReport(taskId: string): string {
    const task = this.analysisTasks.get(taskId);
    if (!task || !task.result) {
      return 'Analysis task not found or incomplete';
    }

    let report = `# 歷史數據分析報告\n\n`;
    report += `**任務ID**: ${task.id}\n`;
    report += `**分析類型**: ${task.type}\n`;
    report += `**數據來源**: ${task.dataSource}\n`;
    report += `**字段**: ${task.field}\n`;
    report += `**時間範圍**: ${new Date(task.timeRange.start).toLocaleString()} - ${new Date(task.timeRange.end).toLocaleString()}\n`;
    report += `**完成時間**: ${new Date(task.completedAt || Date.now()).toLocaleString()}\n\n`;

    // 根據分析類型生成具體報告內容
    switch (task.type) {
      case AnalysisType.TREND:
        const trend = task.result as TrendAnalysis;
        report += `## 趨勢分析結果\n\n`;
        report += `**趨勢方向**: ${trend.direction}\n`;
        report += `**斜率**: ${trend.slope.toFixed(4)}\n`;
        report += `**決定係數 (R²)**: ${(trend.rSquared * 100).toFixed(2)}%\n`;
        report += `**信心度**: ${(trend.confidence * 100).toFixed(2)}%\n`;
        report += `**季節性**: ${trend.seasonality ? '是' : '否'}\n`;
        break;

      case AnalysisType.STATISTICAL:
        const stats = task.result as StatisticalMetrics;
        report += `## 統計分析結果\n\n`;
        report += `**數據點數量**: ${stats.count}\n`;
        report += `**平均值**: ${stats.mean.toFixed(4)}\n`;
        report += `**中位數**: ${stats.median.toFixed(4)}\n`;
        report += `**標準差**: ${stats.standardDeviation.toFixed(4)}\n`;
        report += `**最小值**: ${stats.min}\n`;
        report += `**最大值**: ${stats.max}\n`;
        break;

      case AnalysisType.OUTLIER:
        const outliers = task.result as OutlierDetection;
        report += `## 異常檢測結果\n\n`;
        report += `**檢測方法**: ${outliers.method}\n`;
        report += `**閾值**: ${outliers.threshold}\n`;
        report += `**檢測到的異常點**: ${outliers.outliers.length} 個\n`;
        if (outliers.outliers.length > 0) {
          report += `\n### 異常點詳情\n\n`;
          outliers.outliers.slice(0, 10).forEach((outlier, index) => {
            report += `${index + 1}. 值: ${outlier.value}, Z-Score: ${outlier.zScore.toFixed(2)}, 時間: ${new Date(outlier.timestamp).toLocaleString()}\n`;
          });
          if (outliers.outliers.length > 10) {
            report += `\n...還有 ${outliers.outliers.length - 10} 個異常點\n`;
          }
        }
        break;
    }

    return report;
  }

  // 事件訂閱
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

  // 私有方法實現

  private calculateStatisticalMetrics(values: number[]): StatisticalMetrics {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

    // 計算眾數
    const frequency: Record<number, number> = {};
    sorted.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);

    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);

    const q1Index = Math.floor(n / 4);
    const q3Index = Math.floor(3 * n / 4);
    const quartiles: [number, number, number] = [
      sorted[q1Index],
      median,
      sorted[q3Index]
    ];

    // 計算偏度和峰度（簡化實現）
    const skewness = sorted.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    const kurtosis = sorted.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;

    return {
      count: n,
      sum,
      mean,
      median,
      mode,
      standardDeviation,
      variance,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
      quartiles,
      skewness,
      kurtosis
    };
  }

  private async getTimeSeriesData(
    dataSource: string,
    field: string,
    timeRange: { start: number; end: number },
    granularity: TimeGranularity
  ): Promise<Array<{ timestamp: number; value: number }>> {
    const queryResult = await dataManager.query(dataSource, {
      filter: {
        timestamp: { $gte: timeRange.start, $lte: timeRange.end }
      },
      sort: { timestamp: 'asc' }
    });

    if (!queryResult.success || !queryResult.data) {
      return [];
    }

    // 按時間粒度聚合數據
    const groupedData = queryResult.data.reduce((acc, item) => {
      const timestamp = item.timestamp;
      const value = item[field];

      if (typeof value !== 'number' || isNaN(value)) return acc;

      const groupKey = this.getTimeGroupKey(timestamp, granularity);

      if (!acc[groupKey]) {
        acc[groupKey] = { sum: 0, count: 0, timestamp: groupKey };
      }

      acc[groupKey].sum += value;
      acc[groupKey].count += 1;

      return acc;
    }, {} as Record<string, { sum: number; count: number; timestamp: number }>);

    return Object.values(groupedData)
      .map(group => ({
        timestamp: group.timestamp,
        value: group.sum / group.count // 平均值
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private getTimeGroupKey(timestamp: number, granularity: TimeGranularity): number {
    const date = new Date(timestamp);

    switch (granularity) {
      case TimeGranularity.HOUR:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
      case TimeGranularity.DAY:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      case TimeGranularity.WEEK:
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).getTime();
      case TimeGranularity.MONTH:
        return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      case TimeGranularity.QUARTER:
        const quarter = Math.floor(date.getMonth() / 3);
        return new Date(date.getFullYear(), quarter * 3, 1).getTime();
      case TimeGranularity.YEAR:
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

    // 簡單線性回歸
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 計算決定係數 R²
    const yMean = sumY / n;
    const ssRes = yValues.reduce((sum, y, i) => {
      const predicted = slope * xValues[i] + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0);
    const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    // 判斷趨勢方向
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

    // 生成預測
    const forecast = [];
    for (let i = 1; i <= forecastPoints; i++) {
      const x = n + i - 1;
      const predicted = slope * x + intercept;
      const confidence = Math.max(0.1, 1 - (i * 0.1)); // 簡化的信心度計算
      forecast.push({
        timestamp: data[n - 1].timestamp + (i * (data[1].timestamp - data[0].timestamp)),
        value: predicted,
        confidence
      });
    }

    // 檢測季節性（簡化實現）
    const seasonality = this.detectSeasonality(yValues);

    return {
      direction,
      slope,
      rSquared: Math.max(0, Math.min(1, rSquared)),
      confidence: Math.max(0, Math.min(1, rSquared)),
      seasonality,
      seasonalPattern: seasonality ? this.extractSeasonalPattern(yValues, 7) : undefined,
      forecast
    };
  }

  private calculateVolatility(values: number[]): number {
    const returns = [];
    for (let i = 1; i < values.length; i++) {
      returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
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
      if (avgCorrelation > 0.7) { // 強相關表示季節性
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
    const sumXY = x.slice(0, n).reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    const coefficient = denominator === 0 ? 0 : numerator / denominator;

    // 判斷相關強度
    let strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
    const absCoeff = Math.abs(coefficient);
    if (absCoeff < 0.2) strength = 'very_weak';
    else if (absCoeff < 0.4) strength = 'weak';
    else if (absCoeff < 0.6) strength = 'moderate';
    else if (absCoeff < 0.8) strength = 'strong';
    else strength = 'very_strong';

    // 簡化的顯著性檢定 (p-value 近似)
    const tStatistic = Math.abs(coefficient) * Math.sqrt((n - 2) / (1 - coefficient * coefficient));
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
      direction
    };
  }

  private approximatePValue(t: number, df: number): number {
    // 簡化的t分佈p-value近似
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
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;

        values.forEach((value, index) => {
          if (value < lowerBound || value > upperBound) {
            const median = sorted[Math.floor(sorted.length / 2)];
            const zScore = (value - median) / (iqr / 1.349); // 近似轉換為Z-score
            outliers.push({ index, value, zScore });
          }
        });
        break;

      // 其他方法的實現可以根據需要添加
      default:
        // 默認使用Z-score方法
        return this.detectOutliersInData(values, 'zscore', threshold, contamination);
    }

    return outliers;
  }

  private initializeDefaultConfigs(): void {
    // 初始化默認分析配置
    const defaultConfigs: Omit<AnalysisConfig, 'id'>[] = [
      {
        name: '碳排放趨勢分析',
        type: AnalysisType.TREND,
        dataSource: 'carbon_emissions',
        field: 'scope1',
        parameters: {
          granularity: TimeGranularity.MONTH,
          forecastPoints: 6,
          includeSeasonality: true
        },
        schedule: {
          enabled: true,
          interval: 1440 // 每天
        },
        notifications: {
          onComplete: true,
          onError: true,
          recipients: ['admin@company.com']
        }
      },
      {
        name: '員工滿意度統計分析',
        type: AnalysisType.STATISTICAL,
        dataSource: 'social_impact',
        field: 'employeeSatisfaction',
        parameters: {},
        schedule: {
          enabled: true,
          interval: 10080 // 每週
        },
        notifications: {
          onComplete: true,
          onError: false,
          recipients: ['hr@company.com']
        }
      },
      {
        name: '財務指標異常檢測',
        type: AnalysisType.OUTLIER,
        dataSource: 'financial_data',
        field: 'revenue',
        parameters: {
          method: 'zscore',
          threshold: 2.5
        },
        schedule: {
          enabled: true,
          interval: 1440 // 每天
        },
        notifications: {
          onComplete: false,
          onError: true,
          recipients: ['finance@company.com']
        }
      }
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
          console.error('事件訂閱者回調失敗:', error);
        }
      });
    }
  }

  // 清理資源
  destroy(): void {
    this.analysisIntervals.forEach(interval => clearInterval(interval));
    this.analysisIntervals.clear();
    this.analysisTasks.clear();
    this.analysisConfigs.clear();
    this.predictionModels.clear();
    this.subscribers.clear();
  }
}

// 導出單例實例
export const historicalDataAnalysis = HistoricalDataAnalysis.getInstance();