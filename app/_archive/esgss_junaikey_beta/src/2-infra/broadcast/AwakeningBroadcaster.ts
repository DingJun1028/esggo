/**
 * 覺醒廣播系統
 *
 * 實現「覺他」- 將覺醒狀態和洞察自動分享給所有相關組件
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import type {
  UltimateAwakeningState,
  ServiceAwakeningStatus,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import { omniLogger, LogCategory } from '../logging/OmniLogger';

/**
 * 覺醒事件類型
 */
export type AwakeningEventType =
  | 'phase-changed'
  | 'service-awakened'
  | 'awakening-completed'
  | 'eternal-anchored'
  | 'awakening-failed'
  | 'genesis-achieved'; // 🌌 Omni-Genesis Event

/**
 * 覺醒事件
 */
export interface AwakeningEvent {
  type: AwakeningEventType;
  timestamp: string;
  data: {
    phase?: AwakeningPhase;
    serviceName?: string;
    serviceStatus?: ServiceAwakeningStatus;
    state?: UltimateAwakeningState;
    error?: string;
  };
}

/**
 * 覺醒洞察
 */
export interface AwakeningInsight {
  id: string;
  category: 'performance' | 'optimization' | 'alert' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * 廣播訂閱者
 */
type BroadcastSubscriber = (event: AwakeningEvent) => void;
type InsightSubscriber = (insight: AwakeningInsight) => void;

/**
 * 覺醒廣播器
 */
export class AwakeningBroadcaster {
  private static instance: AwakeningBroadcaster;
  private eventSubscribers: Set<BroadcastSubscriber> = new Set();
  private insightSubscribers: Set<InsightSubscriber> = new Set();
  private insights: AwakeningInsight[] = [];
  private eventHistory: AwakeningEvent[] = [];

  private constructor() {
    // Defer protocol connection to avoid Circular Dependency (TDZ)
    setTimeout(() => {
      this.initializeProtocolListeners();
      omniLogger.info(LogCategory.SYSTEM, '[覺他] 覺醒廣播系統已初始化');
    }, 0);
  }

  static getInstance(): AwakeningBroadcaster {
    if (!AwakeningBroadcaster.instance) {
      AwakeningBroadcaster.instance = new AwakeningBroadcaster();
    }
    return AwakeningBroadcaster.instance;
  }

  /**
   * 初始化協定監聽器
   */
  private initializeProtocolListeners(): void {
    const protocol = getUltimateAwakeningProtocol();

    protocol.on('phase-change', state => {
      this.broadcast({
        type: 'phase-changed',
        timestamp: new Date().toISOString(),
        data: { phase: state.phase, state },
      });

      this.generatePhaseInsights(state);
    });

    protocol.on('service-awakening', state => {
      const serviceName = (state as any).serviceName;
      if (serviceName) {
        this.broadcast({
          type: 'service-awakened',
          timestamp: new Date().toISOString(),
          data: { serviceName, state },
        });
      }
    });
  }

  /**
   * 廣播事件
   */
  broadcast(event: AwakeningEvent): void {
    // 記錄事件歷史
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(0, 100);
    }

    // 通知所有訂閱者
    this.eventSubscribers.forEach(subscriber => {
      try {
        subscriber(event);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[覺他] 廣播訂閱者錯誤', { error });
      }
    });

    omniLogger.info(LogCategory.SYSTEM, `[覺他] 已廣播事件: ${event.type}`, {
      subscribers: this.eventSubscribers.size,
    });
  }

  /**
   * 分享洞察
   */
  shareInsight(insight: Omit<AwakeningInsight, 'id' | 'timestamp'>): void {
    const fullInsight: AwakeningInsight = {
      ...insight,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.insights.unshift(fullInsight);
    if (this.insights.length > 50) {
      this.insights = this.insights.slice(0, 50);
    }

    // 通知洞察訂閱者
    this.insightSubscribers.forEach(subscriber => {
      try {
        subscriber(fullInsight);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[覺他] 洞察訂閱者錯誤', { error });
      }
    });

    omniLogger.info(LogCategory.SYSTEM, `[覺他] 已分享洞察: ${fullInsight.title}`, {
      priority: fullInsight.priority,
    });
  }

  /**
   * 訂閱覺醒事件
   */
  subscribe(subscriber: BroadcastSubscriber): () => void {
    this.eventSubscribers.add(subscriber);
    omniLogger.info(
      LogCategory.SYSTEM,
      `[覺他] 新訂閱者已加入 (總計: ${this.eventSubscribers.size})`
    );

    // 返回取消訂閱函數
    return () => {
      this.eventSubscribers.delete(subscriber);
      omniLogger.info(
        LogCategory.SYSTEM,
        `[覺他] 訂閱者已離開 (總計: ${this.eventSubscribers.size})`
      );
    };
  }

  /**
   * 訂閱覺醒洞察
   */
  subscribeToInsights(subscriber: InsightSubscriber): () => void {
    this.insightSubscribers.add(subscriber);
    return () => {
      this.insightSubscribers.delete(subscriber);
    };
  }

  /**
   * 獲取最新洞察
   */
  getInsights(limit: number = 10): AwakeningInsight[] {
    return this.insights.slice(0, limit);
  }

  /**
   * 獲取事件歷史
   */
  getEventHistory(limit: number = 20): AwakeningEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  /**
   * 根據階段生成洞察
   */
  private generatePhaseInsights(state: UltimateAwakeningState): void {
    switch (state.phase) {
      case AwakeningPhase.INITIALIZING:
        this.shareInsight({
          category: 'performance',
          title: '覺醒初始化開始',
          message: '系統正在建立與永恆宮殿的連接，準備喚醒所有 Omni 服務',
          priority: 'medium',
          actionable: false,
        });
        break;

      case AwakeningPhase.AWAKENING:
        this.shareInsight({
          category: 'performance',
          title: '服務覺醒進行中',
          message: `正在喚醒 ${state.services.size} 個 Omni 服務，當前進度 ${state.progress}%`,
          priority: 'high',
          actionable: false,
        });
        break;

      case AwakeningPhase.AWAKENED:
        this.shareInsight({
          category: 'achievement',
          title: '覺醒完成！',
          message: '所有服務已成功覺醒，系統已達到極限狀態',
          priority: 'high',
          actionable: false,
        });
        break;

      case AwakeningPhase.ETERNAL:
        this.shareInsight({
          category: 'achievement',
          title: '永恆錨定成功',
          message: '覺醒狀態已永久記錄至永恆宮殿，系統進入不朽狀態 ♾️',
          priority: 'critical',
          actionable: false,
          metadata: {
            anchor: state.eternalAnchor,
          },
        });
        break;
    }
  }

  /**
   * 清除歷史
   */
  clear(): void {
    this.insights = [];
    this.eventHistory = [];
    omniLogger.info(LogCategory.SYSTEM, '[覺他] 廣播歷史已清除');
  }

  /**
   * 獲取廣播統計
   */
  getStatistics() {
    return {
      eventSubscribers: this.eventSubscribers.size,
      insightSubscribers: this.insightSubscribers.size,
      totalEvents: this.eventHistory.length,
      totalInsights: this.insights.length,
      recentInsightsByPriority: {
        critical: this.insights.filter(i => i.priority === 'critical').length,
        high: this.insights.filter(i => i.priority === 'high').length,
        medium: this.insights.filter(i => i.priority === 'medium').length,
        low: this.insights.filter(i => i.priority === 'low').length,
      },
    };
  }
}

// 導出單例實例
export const awakeningBroadcaster = AwakeningBroadcaster.getInstance();
