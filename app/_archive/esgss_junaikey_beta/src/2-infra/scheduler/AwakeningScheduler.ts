/**
 * 自動覺醒調度器
 *
 * 實現「自覺」的自動化 - 基於條件自動觸發覺醒
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import { awakeningStateManager } from '@infra/state/AwakeningStateManager';
import { awakeningBroadcaster } from '@infra/broadcast/AwakeningBroadcaster';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 覺醒觸發條件
 */
export interface AwakeningTriggerCondition {
  id: string;
  name: string;
  enabled: boolean;
  evaluate: () => Promise<boolean>;
  priority: number;
}

/**
 * 自動覺醒調度器
 */
export class AwakeningScheduler {
  private static instance: AwakeningScheduler;
  private isRunning: boolean = false;
  private checkInterval: number = 60000; // 1 分鐘檢查一次
  private intervalId: NodeJS.Timeout | null = null;
  private triggers: Map<string, AwakeningTriggerCondition> = new Map();

  private constructor() {
    this.registerDefaultTriggers();
    omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 自動覺醒調度器已初始化');
  }

  static getInstance(): AwakeningScheduler {
    if (!AwakeningScheduler.instance) {
      AwakeningScheduler.instance = new AwakeningScheduler();
    }
    return AwakeningScheduler.instance;
  }

  /**
   * 註冊默認觸發條件
   */
  private registerDefaultTriggers(): void {
    // 時間觸發：每24小時
    this.registerTrigger({
      id: 'daily-awakening',
      name: '每日自動覺醒',
      enabled: false,
      priority: 1,
      evaluate: async () => {
        return awakeningStateManager.shouldAutoAwaken();
      },
    });

    // 系統空閒觸發
    this.registerTrigger({
      id: 'idle-awakening',
      name: '系統空閒時覺醒',
      enabled: false,
      priority: 2,
      evaluate: async () => {
        // 檢查用戶是否空閒（可以通過最後交互時間判斷）
        const lastActivity = localStorage.getItem('last-user-activity');
        if (!lastActivity) return false;

        const lastTime = new Date(lastActivity).getTime();
        const now = Date.now();
        const minutesSinceLastActivity = (now - lastTime) / (1000 * 60);

        // 超過 30 分鐘沒有活動
        return minutesSinceLastActivity > 30;
      },
    });

    // 應用啟動觸發
    this.registerTrigger({
      id: 'startup-awakening',
      name: '應用啟動時覺醒',
      enabled: false,
      priority: 3,
      evaluate: async () => {
        const state = awakeningStateManager.getState();
        // 如果之前處於非永恆狀態，則觸發
        return state.phase !== AwakeningPhase.ETERNAL;
      },
    });
  }

  /**
   * 註冊觸發條件
   */
  registerTrigger(trigger: AwakeningTriggerCondition): void {
    this.triggers.set(trigger.id, trigger);
    omniLogger.info(LogCategory.SYSTEM, `[自覺調度] 已註冊觸發條件: ${trigger.name}`);
  }

  /**
   * 啟用/禁用觸發條件
   */
  setTriggerEnabled(id: string, enabled: boolean): void {
    const trigger = this.triggers.get(id);
    if (trigger) {
      trigger.enabled = enabled;
      omniLogger.info(
        LogCategory.SYSTEM,
        `[自覺調度] 觸發條件 ${trigger.name} 已${enabled ? '啟用' : '禁用'}`
      );
    }
  }

  /**
   * 啟動調度器
   */
  start(): void {
    if (this.isRunning) {
      omniLogger.warn(LogCategory.SYSTEM, '[自覺調度] 調度器已在運行中');
      return;
    }

    this.isRunning = true;
    this.scheduleNextCheck();

    omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 調度器已啟動', {
      checkInterval: this.checkInterval,
      triggers: this.triggers.size,
    });

    awakeningBroadcaster.shareInsight({
      category: 'performance',
      title: '自動覺醒調度器已啟動',
      message: `系統將每 ${this.checkInterval / 1000} 秒檢查覺醒條件`,
      priority: 'medium',
      actionable: false,
    });
  }

  /**
   * 停止調度器
   */
  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 調度器已停止');
  }

  /**
   * 調度下一次檢查
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
   * 檢查並執行覺醒
   */
  private async checkAndExecute(): Promise<void> {
    const protocol = getUltimateAwakeningProtocol();
    const currentState = protocol.getState();

    // 如果已經在覺醒中，跳過
    if (
      currentState.phase !== AwakeningPhase.DORMANT &&
      currentState.phase !== AwakeningPhase.ETERNAL
    ) {
      return;
    }

    omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 檢查覺醒條件...');

    // 按優先級排序觸發條件
    const sortedTriggers = Array.from(this.triggers.values())
      .filter(t => t.enabled)
      .sort((a, b) => a.priority - b.priority);

    // 評估條件
    for (const trigger of sortedTriggers) {
      try {
        const shouldTrigger = await trigger.evaluate();

        if (shouldTrigger) {
          omniLogger.info(LogCategory.SYSTEM, `[自覺調度] 觸發條件滿足: ${trigger.name}`);

          // 執行自動覺醒
          await this.executeAutoAwakening(trigger);
          break; // 只執行第一個滿足條件的觸發器
        }
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, `[自覺調度] 評估觸發條件失敗: ${trigger.name}`, {
          error,
        });
      }
    }
  }

  /**
   * 執行自動覺醒
   */
  private async executeAutoAwakening(trigger: AwakeningTriggerCondition): Promise<void> {
    const startTime = Date.now();

    awakeningBroadcaster.shareInsight({
      category: 'performance',
      title: '自動覺醒已觸發',
      message: `由於「${trigger.name}」條件滿足，系統正在自動執行覺醒序列`,
      priority: 'high',
      actionable: false,
    });

    try {
      const protocol = getUltimateAwakeningProtocol();
      const result = await protocol.executeAwakening();

      const duration = Date.now() - startTime;

      if (result.success) {
        omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 自動覺醒完成', {
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
          title: '自動覺醒成功',
          message: `系統已成功自動覺醒，${result.servicesAwakened}/${result.totalServices} 個服務已喚醒`,
          priority: 'critical',
          actionable: false,
          metadata: {
            trigger: trigger.name,
            duration,
          },
        });
      } else {
        omniLogger.error(LogCategory.SYSTEM, '[自覺調度] 自動覺醒失敗', {
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
          title: '自動覺醒失敗',
          message: `覺醒過程中發生錯誤: ${result.message}`,
          priority: 'high',
          actionable: true,
        });
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[自覺調度] 自動覺醒異常', { error });

      awakeningBroadcaster.shareInsight({
        category: 'alert',
        title: '自動覺醒異常',
        message: `覺醒過程中發生未預期的錯誤`,
        priority: 'critical',
        actionable: true,
      });
    }
  }

  /**
   * 手動觸發覺醒
   */
  async triggerManually(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '[自覺調度] 手動觸發覺醒');

    await this.executeAutoAwakening({
      id: 'manual',
      name: '手動觸發',
      enabled: true,
      priority: 0,
      evaluate: async () => true,
    });
  }

  /**
   * 獲取所有觸發條件
   */
  getTriggers(): AwakeningTriggerCondition[] {
    return Array.from(this.triggers.values());
  }

  /**
   * 設置檢查間隔
   */
  setCheckInterval(milliseconds: number): void {
    this.checkInterval = milliseconds;
    omniLogger.info(LogCategory.SYSTEM, `[自覺調度] 檢查間隔已更新為 ${milliseconds}ms`);

    // 如果正在運行，重啟以應用新間隔
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * 獲取調度器狀態
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

// 導出單例實例
export const awakeningScheduler = AwakeningScheduler.getInstance();
