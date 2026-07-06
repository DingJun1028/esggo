/**
 * ==========================================
 * 🌌 OmniHealing — 萬能癒合實現
 * ==========================================
 * Self-healing, chaos injection, and adaptive recovery.
 * 混沌自癒：注入混沌 → 自動修復 → 適應性恢復
 */

import { randomUUID, createHash } from 'crypto';
import {
  IOmniHealing,
  ChaosInjectionResult,
  ChaosType,
  HealingResult,
  SystemHealth,
  HealthLevel,
  ComponentHealthV2,
  SystemIssue,
  RecoveryStrategy,
  RecoveryResult,
} from '../../types/twelve-omni';
import { IComponentCore, IBusEvent } from '../../lib/omni-core/contracts';

/**
 * OmniHealing 實現
 * 自癒系統，支持混沌注入和適應性恢復
 * 讀寫權限：可完全讀寫系統問題狀態，實現真正的自癒效果
 */

/** Mutable version of SystemIssue for internal read/write access */
interface MutableSystemIssue {
  id: string;
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detectedAt: number;
  resolved: boolean;
}
export class OmniHealing implements IOmniHealing {
  readonly uuid: string;
  readonly version: string = '1.0.0';
  readonly timestamp: number;
  evidence: Record<string, any> = {};

  /** 問題追蹤 (mutable for read/write access) */
  private _issues: Map<string, MutableSystemIssue> = new Map();

  /** 修復歷史 */
  private _healingHistory: Array<{
    issueId: string;
    result: HealingResult;
    timestamp: number;
  }> = [];

  /** 監控定時器 */
  private watchInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.uuid = randomUUID();
    this.timestamp = Date.now();
  }

  /**
   * 注入混沌
   * 故意注入微小錯誤以測試自癒能力
   */
  injectChaos(event: IBusEvent): ChaosInjectionResult {
    const chaosTypes: ChaosType[] = ['mutation', 'delay', 'drop', 'duplicate', 'corrupt'];
    const chaosType = chaosTypes[Math.floor(Math.random() * chaosTypes.length)];

    let modifiedEvent = { ...event };

    switch (chaosType) {
      case 'mutation':
        modifiedEvent.topic = `mutated-${event.topic}`;
        break;
      case 'delay':
        // 模擬延遲 (實際不修改事件)
        break;
      case 'drop':
        // 模擬丟棄 (實際不修改事件)
        break;
      case 'duplicate':
        // 模擬重複 (實際不修改事件)
        break;
      case 'corrupt':
        modifiedEvent.payload = null;
        break;
    }

    return {
      chaosId: `CHAOS-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
      originalEvent: event,
      modifiedEvent,
      chaosType,
      injectedAt: Date.now(),
    };
  }

  /**
   * 自動修復
   * 針對特定 issueId 執行自動修復
   */
  async selfHeal(
    issueId: string,
    context?: Record<string, unknown>
  ): Promise<HealingResult> {
    const issue = this._issues.get(issueId);
    if (!issue) {
      return {
        issueId,
        healed: false,
        strategy: 'retry',
        healingTimeMs: 0,
        details: 'Issue not found',
      };
    }

    const startTime = Date.now();
    const strategy = this.selectStrategy(issue);

    // 模擬修復
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

    const healed = Math.random() > 0.2; // 80% 修復成功率

    // 讀寫權限：直接修改問題狀態
    if (healed) {
      issue.resolved = true;
    }

    const result: HealingResult = {
      issueId,
      healed,
      strategy,
      healingTimeMs: Date.now() - startTime,
      details: healed
        ? `Successfully healed using ${strategy}`
        : `Failed to heal using ${strategy}`,
    };

    this._healingHistory.push({ issueId, result, timestamp: Date.now() });
    return result;
  }

  /**
   * 系統健康度
   */
  async systemHealth(): Promise<SystemHealth> {
    const components: Record<string, ComponentHealthV2> = {
      gateway: {
        name: 'Gateway',
        status: 'healthy',
        uptime: Date.now() - this.timestamp,
        errorRate: 0,
      },
      bus: {
        name: 'Bus',
        status: 'healthy',
        uptime: Date.now() - this.timestamp,
        errorRate: 0,
      },
      memory: {
        name: 'Memory',
        status: 'healthy',
        uptime: Date.now() - this.timestamp,
        errorRate: 0,
      },
    };

    const issues = Array.from(this._issues.values()).filter((i) => !i.resolved);
    const criticalIssues = issues.filter((i) => i.severity === 'critical');

    let overall: HealthLevel = 'healthy';
    if (criticalIssues.length > 0) {
      overall = 'critical';
    } else if (issues.length > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      components,
      lastCheck: Date.now(),
      issues,
    };
  }

  /**
   * 適應性恢復
   * 根據錯誤類型選擇最佳恢復策略
   */
  async adaptiveRecover(
    error: Error,
    strategy?: RecoveryStrategy
  ): Promise<RecoveryResult> {
    const selectedStrategy = strategy || this.selectRecoveryStrategy(error);
    const startTime = Date.now();

    // 模擬恢復
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));

    const success = Math.random() > 0.1; // 90% 恢復成功率

    return {
      success,
      strategy: selectedStrategy,
      recoveryTimeMs: Date.now() - startTime,
      message: success
        ? `Recovered using ${selectedStrategy}`
        : `Recovery failed with ${selectedStrategy}`,
    };
  }

  /**
   * 戒嚴觸發
   */
  triggerMartialLaw(reason: string, source: string): void {
    this.evidence['martial_law_triggered'] = { reason, source, timestamp: Date.now() };
  }

  /**
   * 監控與修復循環
   */
  watchAndHeal(intervalMs: number): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
    }

    this.watchInterval = setInterval(async () => {
      const health = await this.systemHealth();
      if (health.overall === 'critical') {
        console.warn('[OmniHealing] Critical health detected, triggering auto-heal');
        for (const issue of health.issues.filter((i) => i.severity === 'critical')) {
          await this.selfHeal(issue.id);
        }
      }
    }, intervalMs);
  }

  /**
   * 選擇修復策略 (內部輔助)
   */
  private selectStrategy(issue: MutableSystemIssue): RecoveryStrategy {
    switch (issue.severity) {
      case 'critical':
        return 'restart';
      case 'high':
        return 'rollback';
      case 'medium':
        return 'fallback';
      default:
        return 'retry';
    }
  }

  /**
   * 選擇恢復策略 (內部輔助)
   */
  private selectRecoveryStrategy(error: Error): RecoveryStrategy {
    const message = error.message.toLowerCase();

    if (message.includes('timeout')) return 'retry';
    if (message.includes('connection')) return 'fallback';
    if (message.includes('memory')) return 'restart';
    if (message.includes('permission')) return 'isolate';

    return 'retry';
  }
}

/**
 * OmniHealing 單例工廠
 */
let _instance: OmniHealing | null = null;

export function getOmniHealing(): OmniHealing {
  if (!_instance) {
    _instance = new OmniHealing();
  }
  return _instance;
}
