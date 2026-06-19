/**
 * AgentSelfOptimizationService.ts
 *
 * 🤖 AI Agent Self-Optimization Service
 * -----------------------------------------
 * [功能] AI 代理分析自己的日誌效率並自我優化
 *
 * 核心職責:
 * 1. 日誌效率分析
 * 2. 效能指標追蹤
 * 3. 自我優化建議生成
 * 4. 5T Protocol 合規記錄
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { TrustworthyLock } from '@/utils/TrustworthyLock';
import { EventEmitter } from '@/utils/EventEmitter';
import { v4 as uuidv4 } from 'uuid';

/**
 * 代理類型
 */
export type AgentType = 'main' | 'coder' | 'researcher' | 'analyst' | 'orchestrator';

/**
 * 日誌級別
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/**
 * 效能指標
 */
export interface PerformanceMetric {
  metricId: string; // [Traceable 可溯源] 指標唯一識別碼
  agentType: AgentType; // 代理類型
  metricName: string; // 指標名稱
  value: number; // 指標值
  unit: string; // 單位
  timestamp: number; // [Trackable 可追蹤] 時間戳
  threshold: number; // 閾值
  status: 'optimal' | 'warning' | 'critical'; // 狀態
  evidenceHash: string; // [Trustworthy 不可篡改] 證據雜湊
}

/**
 * 日誌分析結果
 */
export interface LogAnalysisResult {
  analysisId: string;
  agentType: AgentType;
  analyzedAt: number;
  timeRange: {
    start: number;
    end: number;
  };
  totalLogs: number;
  logDistribution: Record<LogLevel, number>;
  averageProcessingTime: number; // ms
  errorRate: number; // 0-1
  efficiency: number; // 0-100
  bottlenecks: string[];
  recommendations: OptimizationRecommendation[];
  evidenceHash: string;
}

/**
 * 優化建議
 */
export interface OptimizationRecommendation {
  recommendationId: string;
  type: 'performance' | 'memory' | 'latency' | 'error-handling' | 'caching';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  implementation: string;
  estimatedImprovement: number; // 百分比
}

/**
 * 優化行動記錄
 */
export interface OptimizationAction {
  actionId: string;
  agentType: AgentType;
  recommendationId: string;
  implementedAt: number;
  status: 'pending' | 'implemented' | 'verified' | 'failed';
  actualImprovement?: number;
  evidenceHash: string;
}

/**
 * Agent Self-Optimization Service
 * AI 代理自我優化服務
 */
export class AgentSelfOptimizationService {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private analysisHistory: LogAnalysisResult[] = [];
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private actions: OptimizationAction[] = [];
  private events: EventEmitter = new EventEmitter();
  private analysisInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeMockData();
  }

  /**
   * 初始化模擬數據
   */
  private initializeMockData(): void {
    const agentTypes: AgentType[] = ['main', 'coder', 'researcher', 'analyst', 'orchestrator'];

    agentTypes.forEach(agentType => {
      const metrics = this.generateMockMetrics(agentType);
      this.metrics.set(agentType, metrics);
    });

    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Initialized metrics for ${agentTypes.length} agents`
    );
  }

  /**
   * 生成模擬效能指標
   */
  private generateMockMetrics(agentType: AgentType): PerformanceMetric[] {
    const now = Date.now();
    const metrics: PerformanceMetric[] = [];

    const metricTemplates = [
      { name: 'response_time', unit: 'ms', baseValue: 150, threshold: 500 },
      { name: 'memory_usage', unit: 'MB', baseValue: 256, threshold: 1024 },
      { name: 'cpu_utilization', unit: '%', baseValue: 45, threshold: 80 },
      { name: 'error_count', unit: 'count', baseValue: 2, threshold: 10 },
      { name: 'throughput', unit: 'req/s', baseValue: 100, threshold: 50 },
    ];

    metricTemplates.forEach(template => {
      const value = template.baseValue + Math.random() * template.baseValue * 0.5;
      const status =
        value > template.threshold * 0.9
          ? 'critical'
          : value > template.threshold * 0.7
            ? 'warning'
            : 'optimal';

      const metric: PerformanceMetric = {
        metricId: uuidv4(),
        agentType,
        metricName: template.name,
        value: Math.round(value * 100) / 100,
        unit: template.unit,
        timestamp: now,
        threshold: template.threshold,
        status,
        evidenceHash: '',
      };

      metric.evidenceHash = TrustworthyLock.generateHashSync(
        JSON.stringify({
          metricId: metric.metricId,
          agentType: metric.agentType,
          metricName: metric.metricName,
          value: metric.value,
          timestamp: metric.timestamp,
        })
      );

      metrics.push(metric);
    });

    return metrics;
  }

  /**
   * 分析代理日誌效率
   */
  public async analyzeAgentLogs(agentType: AgentType): Promise<LogAnalysisResult> {
    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Analyzing logs for agent: ${agentType}`
    );

    const now = Date.now();
    const metrics = this.metrics.get(agentType) || [];

    // 模擬日誌分析
    const logDistribution: Record<LogLevel, number> = {
      debug: Math.floor(Math.random() * 100),
      info: Math.floor(Math.random() * 500) + 200,
      warn: Math.floor(Math.random() * 50),
      error: Math.floor(Math.random() * 10),
      critical: Math.floor(Math.random() * 3),
    };

    const totalLogs = Object.values(logDistribution).reduce((a, b) => a + b, 0);
    const errorRate = (logDistribution.error + logDistribution.critical) / totalLogs;

    // 計算效率分數
    const responseTimeMetric = metrics.find(m => m.metricName === 'response_time');
    const throughputMetric = metrics.find(m => m.metricName === 'throughput');

    let efficiency = 100;
    if (responseTimeMetric) {
      efficiency -= (responseTimeMetric.value / responseTimeMetric.threshold) * 30;
    }
    if (throughputMetric) {
      efficiency += (throughputMetric.value / throughputMetric.threshold) * 20;
    }
    efficiency -= errorRate * 100 * 0.5;
    efficiency = Math.max(0, Math.min(100, efficiency));

    // 識別瓶頸
    const bottlenecks: string[] = [];
    metrics.forEach(m => {
      if (m.status === 'critical') {
        bottlenecks.push(
          `${m.metricName} at ${m.value}${m.unit} (threshold: ${m.threshold}${m.unit})`
        );
      }
    });

    // 生成優化建議
    const recommendations = this.generateRecommendations(agentType, metrics, errorRate);

    const result: LogAnalysisResult = {
      analysisId: uuidv4(),
      agentType,
      analyzedAt: now,
      timeRange: {
        start: now - 3600000, // 1 hour ago
        end: now,
      },
      totalLogs,
      logDistribution,
      averageProcessingTime: responseTimeMetric?.value || 0,
      errorRate,
      efficiency: Math.round(efficiency * 100) / 100,
      bottlenecks,
      recommendations,
      evidenceHash: '',
    };

    result.evidenceHash = TrustworthyLock.generateHashSync(JSON.stringify(result));

    this.analysisHistory.push(result);
    this.events.emit('analysisComplete', result);

    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Analysis complete for ${agentType}: efficiency=${efficiency.toFixed(2)}%`
    );

    return result;
  }

  /**
   * 生成優化建議
   */
  private generateRecommendations(
    agentType: AgentType,
    metrics: PerformanceMetric[],
    errorRate: number
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // 檢查回應時間
    const responseTime = metrics.find(m => m.metricName === 'response_time');
    if (responseTime && responseTime.status !== 'optimal') {
      recommendations.push({
        recommendationId: uuidv4(),
        type: 'latency',
        priority: responseTime.status === 'critical' ? 'critical' : 'high',
        description: `回應時間過長 (${responseTime.value}${responseTime.unit})`,
        impact: '影響用戶體驗，可能導致超時錯誤',
        implementation: '考慮添加快取層或優化查詢邏輯',
        estimatedImprovement: 25,
      });
    }

    // 檢查記憶體使用
    const memory = metrics.find(m => m.metricName === 'memory_usage');
    if (memory && memory.status !== 'optimal') {
      recommendations.push({
        recommendationId: uuidv4(),
        type: 'memory',
        priority: memory.status === 'critical' ? 'critical' : 'medium',
        description: `記憶體使用過高 (${memory.value}${memory.unit})`,
        impact: '可能導致系統不穩定或崩潰',
        implementation: '實施記憶體池管理或定期清理快取',
        estimatedImprovement: 30,
      });
    }

    // 檢查錯誤率
    if (errorRate > 0.05) {
      recommendations.push({
        recommendationId: uuidv4(),
        type: 'error-handling',
        priority: 'high',
        description: `錯誤率過高 (${(errorRate * 100).toFixed(2)}%)`,
        impact: '影響服務可靠性和用戶信任',
        implementation: '添加重試機制和更完善的錯誤處理',
        estimatedImprovement: 40,
      });
    }

    // 檢查吞吐量
    const throughput = metrics.find(m => m.metricName === 'throughput');
    if (throughput && throughput.value < throughput.threshold) {
      recommendations.push({
        recommendationId: uuidv4(),
        type: 'performance',
        priority: 'medium',
        description: `吞吐量低於預期 (${throughput.value}${throughput.unit})`,
        impact: '系統處理能力受限',
        implementation: '考慮水平擴展或優化處理邏輯',
        estimatedImprovement: 20,
      });
    }

    // 儲存建議
    recommendations.forEach(r => this.recommendations.set(r.recommendationId, r));

    return recommendations;
  }

  /**
   * 實施優化建議
   */
  public async implementRecommendation(
    recommendationId: string
  ): Promise<OptimizationAction | null> {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) {
      omniLogger.error(
        LogCategory.SYSTEM,
        `[SelfOptimization] Recommendation not found: ${recommendationId}`
      );
      return null;
    }

    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Implementing recommendation: ${recommendation.description}`
    );

    const action: OptimizationAction = {
      actionId: uuidv4(),
      agentType: 'main', // 從建議中獲取
      recommendationId,
      implementedAt: Date.now(),
      status: 'pending',
      evidenceHash: '',
    };

    // 模擬實施過程
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模擬成功實施
    action.status = 'implemented';
    action.actualImprovement = recommendation.estimatedImprovement * (0.8 + Math.random() * 0.4);
    action.evidenceHash = TrustworthyLock.generateHashSync(JSON.stringify(action));

    this.actions.push(action);
    this.events.emit('optimizationImplemented', { recommendation, action });

    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Recommendation implemented: ${recommendationId}`
    );

    return action;
  }

  /**
   * 獲取代理效能摘要
   */
  public getAgentPerformanceSummary(agentType: AgentType): {
    currentMetrics: PerformanceMetric[];
    latestAnalysis?: LogAnalysisResult;
    pendingRecommendations: OptimizationRecommendation[];
  } {
    const currentMetrics = this.metrics.get(agentType) || [];
    const latestAnalysis = [...this.analysisHistory].reverse().find(a => a.agentType === agentType);

    const pendingRecommendations = Array.from(this.recommendations.values()).filter(
      r => !this.actions.some(a => a.recommendationId === r.recommendationId)
    );

    return {
      currentMetrics,
      latestAnalysis,
      pendingRecommendations,
    };
  }

  /**
   * 獲取所有代理的效能概覽
   */
  public getAllAgentsOverview(): Record<
    AgentType,
    {
      efficiency: number;
      status: 'healthy' | 'warning' | 'critical';
      lastAnalyzed: number | null;
    }
  > {
    const agentTypes: AgentType[] = ['main', 'coder', 'researcher', 'analyst', 'orchestrator'];
    const overview: Record<string, any> = {};

    agentTypes.forEach(agentType => {
      const latestAnalysis = [...this.analysisHistory]
        .reverse()
        .find(a => a.agentType === agentType);

      const efficiency = latestAnalysis?.efficiency ?? 85;
      const status = efficiency >= 80 ? 'healthy' : efficiency >= 60 ? 'warning' : 'critical';

      overview[agentType] = {
        efficiency,
        status,
        lastAnalyzed: latestAnalysis?.analyzedAt ?? null,
      };
    });

    return overview;
  }

  /**
   * 啟動自動分析
   */
  public startAutoAnalysis(intervalMs: number = 300000): void {
    // 預設 5 分鐘
    this.analysisInterval = setInterval(async () => {
      const agentTypes: AgentType[] = ['main', 'coder', 'researcher', 'analyst', 'orchestrator'];
      for (const agentType of agentTypes) {
        await this.analyzeAgentLogs(agentType);
      }
    }, intervalMs);

    omniLogger.info(
      LogCategory.SYSTEM,
      `[SelfOptimization] Auto-analysis started with interval ${intervalMs}ms`
    );
  }

  /**
   * 停止自動分析
   */
  public stopAutoAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
      omniLogger.info(LogCategory.SYSTEM, '[SelfOptimization] Auto-analysis stopped');
    }
  }

  /**
   * 更新效能指標
   */
  public updateMetric(agentType: AgentType, metricName: string, value: number): void {
    const metrics = this.metrics.get(agentType) || [];
    const existingIndex = metrics.findIndex(m => m.metricName === metricName);

    if (existingIndex >= 0) {
      const existing = metrics[existingIndex];
      const status =
        value > existing.threshold * 0.9
          ? 'critical'
          : value > existing.threshold * 0.7
            ? 'warning'
            : 'optimal';

      metrics[existingIndex] = {
        ...existing,
        value,
        status,
        timestamp: Date.now(),
      };
    }

    this.metrics.set(agentType, metrics);
  }

  /**
   * 事件監聽
   */
  public onAnalysisComplete(callback: (result: LogAnalysisResult) => void): void {
    this.events.on('analysisComplete', callback);
  }

  public onOptimizationImplemented(
    callback: (data: {
      recommendation: OptimizationRecommendation;
      action: OptimizationAction;
    }) => void
  ): void {
    this.events.on('optimizationImplemented', callback);
  }
}

// 單例實例
export const agentSelfOptimizationService = new AgentSelfOptimizationService();
