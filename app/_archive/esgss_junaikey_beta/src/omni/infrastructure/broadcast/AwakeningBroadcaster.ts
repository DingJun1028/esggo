/**
 * Awakening Broadcast System
 *
 * Implements "Enlightening Others" - automatically sharing awakening status and insights across all related components.
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import type {
  UltimateAwakeningState,
  ServiceAwakeningStatus,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

/**
 * Awakening Event Type
 */
export type AwakeningEventType =
  | 'phase-changed'
  | 'service-awakened'
  | 'awakening-completed'
  | 'eternal-anchored'
  | 'awakening-failed'
  | 'genesis-achieved'; // 🌌 Omni-Genesis Event

/**
 * Awakening Event
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
 * Awakening Insight
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
 * Broadcast Subscribers
 */
type BroadcastSubscriber = (event: AwakeningEvent) => void;
type InsightSubscriber = (insight: AwakeningInsight) => void;

/**
 * Awakening Broadcaster
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
      omniLogger.info(LogCategory.SYSTEM, '[BROADCASTER] Awakening Broadcast System Initialized');
    }, 0);
  }

  static getInstance(): AwakeningBroadcaster {
    if (!AwakeningBroadcaster.instance) {
      AwakeningBroadcaster.instance = new AwakeningBroadcaster();
    }
    return AwakeningBroadcaster.instance;
  }

  /**
   * Initialize Protocol Listeners
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
   * Broadcast Event
   */
  broadcast(event: AwakeningEvent): void {
    // Record event history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(0, 100);
    }

    // Notify all subscribers
    this.eventSubscribers.forEach(subscriber => {
      try {
        subscriber(event);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[BROADCASTER] Subscriber Error', { error });
      }
    });

    omniLogger.info(LogCategory.SYSTEM, `[BROADCASTER] Event Broadcasted: ${event.type}`, {
      subscribers: this.eventSubscribers.size,
    });
  }

  /**
   * Share Insight
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

    // Notify insight subscribers
    this.insightSubscribers.forEach(subscriber => {
      try {
        subscriber(fullInsight);
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[BROADCASTER] Insight Subscriber Error', { error });
      }
    });

    omniLogger.info(LogCategory.SYSTEM, `[BROADCASTER] Insight Shared: ${fullInsight.title}`, {
      priority: fullInsight.priority,
    });
  }

  /**
   * Subscribe to Awakening Events
   */
  subscribe(subscriber: BroadcastSubscriber): () => void {
    this.eventSubscribers.add(subscriber);
    omniLogger.info(
      LogCategory.SYSTEM,
      `[Enlightening] New subscriber added (Total: ${this.eventSubscribers.size})`
    );

    // Return unsubscribe function
    return () => {
      this.eventSubscribers.delete(subscriber);
      omniLogger.info(
        LogCategory.SYSTEM,
        `[Enlightening] Subscriber left (Total: ${this.eventSubscribers.size})`
      );
    };
  }

  /**
   * Subscribe to Awakening Insights
   */
  subscribeToInsights(subscriber: InsightSubscriber): () => void {
    this.insightSubscribers.add(subscriber);
    return () => {
      this.insightSubscribers.delete(subscriber);
    };
  }

  /**
   * Get latest insights
   */
  getInsights(limit: number = 10): AwakeningInsight[] {
    return this.insights.slice(0, limit);
  }

  /**
   * Get event history
   */
  getEventHistory(limit: number = 20): AwakeningEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  /**
   * Generate insights based on phase
   */
  private generatePhaseInsights(state: UltimateAwakeningState): void {
    switch (state.phase) {
      case AwakeningPhase.INITIALIZING:
        this.shareInsight({
          category: 'performance',
          title: 'Awakening Initialization Started',
          message:
            'System establishing link to Eternal Palace, preparing to awaken all Omni services',
          priority: 'medium',
          actionable: false,
        });
        break;

      case AwakeningPhase.AWAKENING:
        this.shareInsight({
          category: 'performance',
          title: 'Service Awakening in Progress',
          message: `Awakening ${state.services.size} Omni services, current progress ${state.progress}%`,
          priority: 'high',
          actionable: false,
        });
        break;

      case AwakeningPhase.AWAKENED:
        this.shareInsight({
          category: 'achievement',
          title: 'Awakening Complete!',
          message: 'All services successfully awakened, system reached peak state',
          priority: 'high',
          actionable: false,
        });
        break;

      case AwakeningPhase.ETERNAL:
        this.shareInsight({
          category: 'achievement',
          title: 'Eternal Anchor Success',
          message:
            'Awakening state permanently recorded to Eternal Palace, system entered Immortal State ♾️',
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
   * Clear history
   */
  clear(): void {
    this.insights = [];
    this.eventHistory = [];
    omniLogger.info(LogCategory.SYSTEM, '[BROADCASTER] Broadcast history cleared');
  }

  /**
   * Get broadcast statistics
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

// Export singleton instance
export const awakeningBroadcaster = AwakeningBroadcaster.getInstance();
