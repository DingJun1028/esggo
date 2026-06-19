// OmniOrchestrator Service - Autonomous System Orchestration
// Implements Wu-Tong Zi-Tong (無通自通) philosophy through self-regulation
// [Compliance] 4+1 Protocol (Traceable, Trackable, Calculable, Immutable)

import { omniLogger, LogCategory, LogLevel } from '../2-infra/logging/OmniLogger';
import { SystemHealthStatus } from '../types/core';

/**
 * 擴展的服務健康狀態類型 (Extended Service Health Status)
 * 基於統一的 SystemHealthStatus，額外加入 'recovering' 狀態用於自主調節場景
 */
export type OrchestratorHealthStatus = SystemHealthStatus | 'recovering';

/**
 * 服務健康狀態 (Service Health State)
 */
export interface ServiceHealth {
  serviceId: string;
  serviceName: string;
  status: OrchestratorHealthStatus; // 使用擴展的健康狀態類型
  resonanceScore: number; // 0-1, measures harmony with system
  lastHeartbeat: Date;
  metrics: {
    responseTime: number; // ms
    errorRate: number; // 0-1
    throughput: number; // requests/sec
    resourceUsage: number; // 0-1
  };
  autoRegulationHistory: AutoRegulationEvent[];
}

/**
 * 自主調節事件 (Auto-Regulation Event)
 */
export interface AutoRegulationEvent {
  timestamp: Date;
  action: 'scale_up' | 'scale_down' | 'restart' | 'throttle' | 'heal' | 'observe';
  reason: string;
  impact: 'minimal' | 'moderate' | 'significant';
  success: boolean;
}

/**
 * 共鳴信號 (Resonance Signal)
 * Services communicate through resonance rather than direct calls
 */
export interface ResonanceSignal {
  id: string;
  sourceService: string;
  targetService?: string; // undefined for broadcast
  frequency: number; // 0-1, represents urgency/importance
  payload: unknown;
  propagationMode: 'broadcast' | 'targeted' | 'emergent';
  timestamp: Date;
  resonancePattern?: string; // Pattern identifier for matching
}

/**
 * 編排狀態 (Orchestration State)
 */
export interface OmniOrchestrationState {
  services: Map<string, ServiceHealth>;
  globalResonanceLevel: number; // 0-1, overall system harmony
  autoRegulationEnabled: boolean;
  observationMode: boolean; // If true, log actions but don't execute
  lastIntervention: Date | null;
  interventionCount: number;
  autonomousResolutionCount: number;
}

/**
 * 🌀 OmniOrchestrator - 自主系統編排器
 *
 * Implements the Wu-Tong Zi-Tong philosophy:
 * - 無 (Wu): Non-interference, minimal forced actions
 * - 通 (Tong): Omni connectivity through resonance
 * - 自 (Zi): Self-awareness and autonomous regulation
 * - 通 (Tong): Natural circulation without forced direction
 *
 * Core Principles:
 * 1. Observe before acting (觀察優先)
 * 2. Allow natural emergence (允許自然湧現)
 * 3. Facilitate, don't force (促進而非強制)
 * 4. Minimal intervention (最小干預)
 */
export class OmniOrchestrator {
  private state: OmniOrchestrationState;
  private logger = omniLogger;
  private resonanceSignals: ResonanceSignal[] = [];
  private readonly RESONANCE_THRESHOLD = 0.95; // Below this, consider intervention
  private readonly OBSERVATION_PERIOD_MS = 5000; // Wait before acting

  constructor() {
    this.state = {
      services: new Map(),
      globalResonanceLevel: 1.0,
      autoRegulationEnabled: true,
      observationMode: false, // Start in active mode, can be toggled
      lastIntervention: null,
      interventionCount: 0,
      autonomousResolutionCount: 0,
    };
    // Logger initialized via singleton
  }

  /**
   * 註冊服務 (Register Service)
   * Services self-register with the orchestrator
   */
  registerService(serviceId: string, serviceName: string): void {
    const health: ServiceHealth = {
      serviceId,
      serviceName,
      status: 'healthy',
      resonanceScore: 1.0,
      lastHeartbeat: new Date(),
      metrics: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0,
        resourceUsage: 0,
      },
      autoRegulationHistory: [],
    };

    this.state.services.set(serviceId, health);
    this.logger.info('SYSTEM', `Service registered: ${serviceName} (${serviceId})`, {
      serviceId,
      serviceName,
    });
  }

  /**
   * 更新服務健康狀態 (Update Service Health)
   * Services send heartbeats with their current metrics
   */
  updateServiceHealth(serviceId: string, metrics: Partial<ServiceHealth['metrics']>): void {
    const service = this.state.services.get(serviceId);
    if (!service) {
      this.logger.warn('SYSTEM', `Unknown service attempted health update: ${serviceId}`);
      return;
    }

    // Update metrics
    service.metrics = { ...service.metrics, ...metrics };
    service.lastHeartbeat = new Date();

    // Calculate resonance score based on metrics
    service.resonanceScore = this.calculateResonanceScore(service.metrics);

    // Determine status based on resonance
    if (service.resonanceScore > 0.95) {
      service.status = 'healthy';
    } else if (service.resonanceScore > 0.8) {
      service.status = 'warning'; // 降級狀態映射為警告
    } else if (service.resonanceScore > 0.5) {
      service.status = 'critical';
    } else {
      service.status = 'recovering'; // 極低共鳴分數表示正在恢復中
    }

    // Update global resonance level
    this.updateGlobalResonance();

    // Check if autonomous action is needed (Wu-Tong principle: observe first)
    if (this.state.autoRegulationEnabled && service.resonanceScore < this.RESONANCE_THRESHOLD) {
      this.considerAutonomousAction(serviceId);
    }
  }

  /**
   * 計算共鳴分數 (Calculate Resonance Score)
   * Measures how well a service harmonizes with the system
   */
  private calculateResonanceScore(metrics: ServiceHealth['metrics']): number {
    // Lower is better for these metrics
    const responseTimeScore = Math.max(0, 1 - metrics.responseTime / 1000); // Normalize to 1s
    const errorRateScore = 1 - metrics.errorRate;
    const resourceScore = 1 - metrics.resourceUsage;

    // Higher is better
    const throughputScore = Math.min(1, metrics.throughput / 100); // Normalize to 100 req/s

    // Weighted average
    return (
      responseTimeScore * 0.3 + errorRateScore * 0.3 + resourceScore * 0.2 + throughputScore * 0.2
    );
  }

  /**
   * 更新全域共鳴等級 (Update Global Resonance Level)
   */
  private updateGlobalResonance(): void {
    if (this.state.services.size === 0) {
      this.state.globalResonanceLevel = 1.0;
      return;
    }

    const totalResonance = Array.from(this.state.services.values()).reduce(
      (sum, service) => sum + service.resonanceScore,
      0
    );

    this.state.globalResonanceLevel = totalResonance / this.state.services.size;
  }

  /**
   * 考慮自主行動 (Consider Autonomous Action)
   * Implements "Non-Action, Auto-Action" - observe before acting
   */
  private async considerAutonomousAction(serviceId: string): Promise<void> {
    const service = this.state.services.get(serviceId);
    if (!service) return;

    // Wu-Tong Principle: Observe first (觀察優先)
    await this.observeService(serviceId);

    // Check if issue self-resolved during observation
    const updatedService = this.state.services.get(serviceId);
    if (!updatedService || updatedService.resonanceScore >= this.RESONANCE_THRESHOLD) {
      this.state.autonomousResolutionCount++;
      this.logger.info(
        'SYSTEM',
        `Service self-resolved during observation: ${service.serviceName}`,
        {
          serviceId,
          principle: 'Wu-Tong-Zi-Tong',
        }
      );
      return;
    }

    // If still degraded, determine minimal intervention
    const action = this.determineMinimalIntervention(updatedService);

    if (this.state.observationMode) {
      this.logger.info('SYSTEM', `[OBSERVATION MODE] Would execute: ${action.action}`, {
        serviceId,
        action,
        reason: action.reason,
      });
    } else {
      await this.executeAutonomousAction(serviceId, action);
    }
  }

  /**
   * 觀察服務 (Observe Service)
   * Wait and observe before taking action
   */
  private async observeService(serviceId: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.logger.debug('SYSTEM', `Observation period complete for service: ${serviceId}`);
        resolve();
      }, this.OBSERVATION_PERIOD_MS);
    });
  }

  /**
   * 決定最小干預 (Determine Minimal Intervention)
   * Choose the least invasive action that could restore harmony
   */
  private determineMinimalIntervention(
    service: ServiceHealth
  ): Omit<AutoRegulationEvent, 'timestamp' | 'success'> {
    const { metrics, resonanceScore } = service;

    // High error rate -> heal
    if (metrics.errorRate > 0.5) {
      return {
        action: 'heal',
        reason: 'High error rate detected',
        impact: 'moderate',
      };
    }

    // High resource usage -> throttle
    if (metrics.resourceUsage > 0.9) {
      return {
        action: 'throttle',
        reason: 'Resource usage critical',
        impact: 'minimal',
      };
    }

    // Slow response time -> scale up
    if (metrics.responseTime > 500) {
      return {
        action: 'scale_up',
        reason: 'Response time degraded',
        impact: 'moderate',
      };
    }

    // Low throughput -> restart
    if (metrics.throughput < 10 && resonanceScore < 0.7) {
      return {
        action: 'restart',
        reason: 'Low throughput, possible deadlock',
        impact: 'significant',
      };
    }

    // Default: just observe
    return {
      action: 'observe',
      reason: 'Monitoring for natural recovery',
      impact: 'minimal',
    };
  }

  /**
   * 執行自主行動 (Execute Autonomous Action)
   */
  private async executeAutonomousAction(
    serviceId: string,
    action: Omit<AutoRegulationEvent, 'timestamp' | 'success'>
  ): Promise<void> {
    const service = this.state.services.get(serviceId);
    if (!service) return;

    const event: AutoRegulationEvent = {
      ...action,
      timestamp: new Date(),
      success: false,
    };

    try {
      // Simulate action execution (in real implementation, this would call actual service APIs)
      this.logger.info(
        'SYSTEM',
        `Executing autonomous action: ${action.action} for ${service.serviceName}`,
        {
          serviceId,
          action: action.action,
          reason: action.reason,
        }
      );

      // Mark as successful
      event.success = true;
      this.state.interventionCount++;
      this.state.lastIntervention = new Date();

      // Add to history
      service.autoRegulationHistory.push(event);

      // Keep only last 10 events
      if (service.autoRegulationHistory.length > 10) {
        service.autoRegulationHistory.shift();
      }
    } catch (error) {
      this.logger.error('SYSTEM', `Autonomous action failed: ${action.action}`, {
        serviceId,
        error,
      });
    }
  }

  /**
   * 發送共鳴信號 (Send Resonance Signal)
   * Services communicate through resonance signals
   */
  sendResonanceSignal(signal: Omit<ResonanceSignal, 'id' | 'timestamp'>): string {
    const fullSignal: ResonanceSignal = {
      ...signal,
      id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.resonanceSignals.push(fullSignal);

    this.logger.debug('SYSTEM', `Resonance signal sent: ${fullSignal.propagationMode}`, {
      signal: fullSignal,
    });

    // Propagate signal based on mode
    this.propagateSignal(fullSignal);

    return fullSignal.id;
  }

  /**
   * 傳播信號 (Propagate Signal)
   */
  private propagateSignal(signal: ResonanceSignal): void {
    // In a real implementation, this would use event bus or message queue
    // For now, we log the propagation
    this.logger.debug('SYSTEM', `Signal propagated: ${signal.id}`, {
      mode: signal.propagationMode,
      frequency: signal.frequency,
    });
  }

  /**
   * 獲取系統狀態 (Get System State)
   */
  getSystemState(): OmniOrchestrationState {
    return {
      ...this.state,
      services: new Map(this.state.services), // Return a copy
    };
  }

  /**
   * 獲取非行動指標 (Get Non-Action Metrics)
   * Measures how well the system embodies Wu-Tong principles
   */
  getNonActionMetrics() {
    const total = this.state.interventionCount + this.state.autonomousResolutionCount;
    const autonomousRate = total > 0 ? this.state.autonomousResolutionCount / total : 1.0;

    return {
      totalEvents: total,
      interventionCount: this.state.interventionCount,
      autonomousResolutionCount: this.state.autonomousResolutionCount,
      autonomousResolutionRate: autonomousRate,
      globalResonance: this.state.globalResonanceLevel,
      embodiesWuTong: autonomousRate > 0.8 && this.state.globalResonanceLevel > 0.95,
    };
  }

  /**
   * 切換觀察模式 (Toggle Observation Mode)
   */
  toggleObservationMode(enabled: boolean): void {
    this.state.observationMode = enabled;
    this.logger.info('SYSTEM', `Observation mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 切換自動調節 (Toggle Auto-Regulation)
   */
  toggleAutoRegulation(enabled: boolean): void {
    this.state.autoRegulationEnabled = enabled;
    this.logger.info('SYSTEM', `Auto-regulation ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Singleton instance
export const omniOrchestrator = new OmniOrchestrator();
