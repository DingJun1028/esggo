/**
 * Auto-Awakening Scheduler
 *
 * Automating "Self-Awareness" - triggers awakening sequences automatically based on defined conditions.
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import { awakeningStateManager } from '@/omni/infrastructure/state/AwakeningStateManager.ts';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

/**
 * Awakening Trigger Condition
 */
export interface AwakeningTriggerCondition {
  id: string;
  name: string;
  enabled: boolean;
  evaluate: () => Promise<boolean>;
  priority: number;
}

/**
 * Auto-Awakening Scheduler
 */
export class AwakeningScheduler {
  private static instance: AwakeningScheduler;
  private isRunning: boolean = false;
  private checkInterval: number = 60000; // Check once every minute
  private intervalId: NodeJS.Timeout | null = null;
  private triggers: Map<string, AwakeningTriggerCondition> = new Map();

  private constructor() {
    this.registerDefaultTriggers();
    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Awakening Scheduler Initialized');
  }

  static getInstance(): AwakeningScheduler {
    if (!AwakeningScheduler.instance) {
      AwakeningScheduler.instance = new AwakeningScheduler();
    }
    return AwakeningScheduler.instance;
  }

  /**
   * Register Default Trigger Conditions
   */
  private registerDefaultTriggers(): void {
    // Time-based trigger: Every 24 hours
    this.registerTrigger({
      id: 'daily-awakening',
      name: 'Daily Auto-Awakening',
      enabled: false,
      priority: 1,
      evaluate: async () => {
        return awakeningStateManager.shouldAutoAwaken();
      },
    });

    // Idle trigger
    this.registerTrigger({
      id: 'idle-awakening',
      name: 'Awaken during system idle',
      enabled: false,
      priority: 2,
      evaluate: async () => {
        // Check if user is idle (determined by last interaction time)
        const lastActivity = localStorage.getItem('last-user-activity');
        if (!lastActivity) return false;

        const lastTime = new Date(lastActivity).getTime();
        const now = Date.now();
        const minutesSinceLastActivity = (now - lastTime) / (1000 * 60);

        // Idle for more than 30 minutes
        return minutesSinceLastActivity > 30;
      },
    });

    // Startup Trigger
    this.registerTrigger({
      id: 'startup-awakening',
      name: 'Startup Awakening',
      enabled: false,
      priority: 3,
      evaluate: async () => {
        const state = awakeningStateManager.getState();
        // Trigger if not in Eternal State
        return state.phase !== AwakeningPhase.ETERNAL;
      },
    });
  }

  /**
   * Register Trigger Condition
   */
  registerTrigger(trigger: AwakeningTriggerCondition): void {
    this.triggers.set(trigger.id, trigger);
    omniLogger.info(
      LogCategory.SYSTEM,
      `[SCHEDULER] Registered trigger condition: ${trigger.name}`
    );
  }

  /**
   * Enable/Disable Trigger Condition
   */
  setTriggerEnabled(id: string, enabled: boolean): void {
    const trigger = this.triggers.get(id);
    if (trigger) {
      trigger.enabled = enabled;
      omniLogger.info(
        LogCategory.SYSTEM,
        `[SCHEDULER] Trigger condition ${trigger.name} has been ${enabled ? 'enabled' : 'disabled'}`
      );
    }
  }

  /**
   * Start Scheduler
   */
  start(): void {
    if (this.isRunning) {
      omniLogger.warn(LogCategory.SYSTEM, '[SCHEDULER] Scheduler is already running');
      return;
    }

    this.isRunning = true;
    this.scheduleNextCheck();

    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Scheduler started', {
      checkInterval: this.checkInterval,
      triggers: this.triggers.size,
    });

    awakeningBroadcaster.shareInsight({
      category: 'performance',
      title: 'Auto-Awakening Scheduler Started',
      message: `System will check awakening conditions every ${this.checkInterval / 1000} seconds`,
      priority: 'medium',
      actionable: false,
    });
  }

  /**
   * Stop Scheduler
   */
  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Scheduler stopped');
  }

  /**
   * Schedule next check
   */
  private scheduleNextCheck(): void {
    this.intervalId = setTimeout(async () => {
      await this.checkAndExecute();
      if (this.isRunning) {
        this.scheduleNextCheck();
      }
    }, this.checkInterval);
  }

  /**
   * Check and execute awakening
   */
  private async checkAndExecute(): Promise<void> {
    const protocol = getUltimateAwakeningProtocol();
    const currentState = protocol.getState();

    if (
      currentState.phase !== AwakeningPhase.DORMANT &&
      currentState.phase !== AwakeningPhase.ETERNAL
    ) {
      return;
    }

    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Checking awakening conditions...');

    // Sort trigger conditions by priority
    const sortedTriggers = Array.from(this.triggers.values())
      .filter(t => t.enabled)
      .sort((a, b) => a.priority - b.priority);

    // Evaluate conditions
    for (const trigger of sortedTriggers) {
      try {
        const shouldTrigger = await trigger.evaluate();

        if (shouldTrigger) {
          omniLogger.info(
            LogCategory.SYSTEM,
            `[SCHEDULER] Trigger condition satisfied: ${trigger.name}`
          );

          // Execute auto-awakening
          await this.executeAutoAwakening(trigger);
          break; // only execute the first satisfied trigger
        }
      } catch (error) {
        omniLogger.error(
          LogCategory.SYSTEM,
          `[SCHEDULER] Failed to evaluate trigger condition: ${trigger.name}`,
          {
            error,
          }
        );
      }
    }
  }

  /**
   * Execute auto-awakening
   */
  private async executeAutoAwakening(trigger: AwakeningTriggerCondition): Promise<void> {
    const startTime = Date.now();

    awakeningBroadcaster.shareInsight({
      category: 'performance',
      title: 'Auto-Awakening Triggered',
      message: `System is automatically executing awakening sequence due to "${trigger.name}" condition`,
      priority: 'high',
      actionable: false,
    });

    try {
      const protocol = getUltimateAwakeningProtocol();
      const result = await protocol.executeAwakening();

      const duration = Date.now() - startTime;

      if (result.success) {
        omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Auto-Awakening Complete', {
          trigger: trigger.name,
          duration,
          servicesAwakened: result.servicesAwakened,
        });

        awakeningStateManager.recordHistory({
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          phase: result.phase,
          servicesAwakened: result.servicesAwakened,
          totalServices: result.totalServices,
          eternalAnchor: result.eternalAnchor,
          success: true,
          duration,
        });

        awakeningBroadcaster.shareInsight({
          category: 'achievement',
          title: 'Auto-Awakening Successful',
          message: `System successfully auto-awakened, ${result.servicesAwakened}/${result.totalServices} services awakened`,
          priority: 'critical',
          actionable: false,
          metadata: {
            trigger: trigger.name,
            duration,
          },
        });
      } else {
        omniLogger.error(LogCategory.SYSTEM, '[SCHEDULER] Auto-awakening failed', {
          trigger: trigger.name,
          errors: result.errors,
        });

        awakeningStateManager.recordHistory({
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          phase: result.phase,
          servicesAwakened: result.servicesAwakened,
          totalServices: result.totalServices,
          success: false,
          duration: Date.now() - startTime,
        });

        awakeningBroadcaster.shareInsight({
          category: 'alert',
          title: 'Auto-Awakening Failed',
          message: `Error occurred during awakening: ${result.message}`,
          priority: 'high',
          actionable: true,
        });
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[SCHEDULER] Auto-awakening anomaly', { error });

      awakeningBroadcaster.shareInsight({
        category: 'alert',
        title: 'Auto-Awakening Anomaly',
        message: `Unexpected error occurred during awakening process`,
        priority: 'critical',
        actionable: true,
      });
    }
  }

  /**
   * Manually trigger awakening
   */
  async triggerManually(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Manually triggering awakening');

    await this.executeAutoAwakening({
      id: 'manual',
      name: 'Manual Trigger',
      enabled: true,
      priority: 0,
      evaluate: async () => true,
    });
  }

  /**
   * Get all trigger conditions
   */
  getTriggers(): AwakeningTriggerCondition[] {
    return Array.from(this.triggers.values());
  }

  /**
   * Set check interval
   */
  setCheckInterval(milliseconds: number): void {
    this.checkInterval = milliseconds;
    omniLogger.info(LogCategory.SYSTEM, `[SCHEDULER] Check interval updated to ${milliseconds}ms`);

    // If running, restart to apply new interval
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      totalTriggers: this.triggers.size,
      enabledTriggers: Array.from(this.triggers.values()).filter(t => t.enabled).length,
      triggers: this.getTriggers().map(t => ({
        id: t.id,
        name: t.name,
        enabled: t.enabled,
        priority: t.priority,
      })),
    };
  }
}

// Export singleton instance
export const awakeningScheduler = AwakeningScheduler.getInstance();
