/**
 * 覺醒狀態管理器
 *
 * 負責覺醒狀態的持久化、恢復和同步
 * 實現「自覺」- 系統自我感知和狀態維護
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import type {
  UltimateAwakeningState,
  EternalAnchor,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

const STORAGE_KEY = 'omni-awakening-state';
const HISTORY_KEY = 'omni-awakening-history';

/**
 * 覺醒歷史記錄
 */
export interface AwakeningHistoryEntry {
  id: string;
  startedAt: string;
  completedAt?: string;
  phase: AwakeningPhase;
  servicesAwakened: number;
  totalServices: number;
  eternalAnchor?: EternalAnchor;
  success: boolean;
  duration?: number;
}

/**
 * 持久化的覺醒狀態
 */
interface PersistedAwakeningState {
  phase: AwakeningPhase;
  progress: number;
  lastAwakeningAt?: string;
  totalAwakenings: number;
  isAutoEnabled: boolean;
  eternalAnchors: EternalAnchor[];
  genesisAchieved?: boolean; // Added persistence for Genesis
}

/**
 * 覺醒狀態管理器
 */
export class AwakeningStateManager {
  private static instance: AwakeningStateManager;
  private persistedState: PersistedAwakeningState;
  private history: AwakeningHistoryEntry[] = [];

  private constructor() {
    this.persistedState = this.loadState();
    this.history = this.loadHistory();
    omniLogger.info(LogCategory.SYSTEM, '[自覺] 覺醒狀態管理器已初始化');
  }

  static getInstance(): AwakeningStateManager {
    if (!AwakeningStateManager.instance) {
      AwakeningStateManager.instance = new AwakeningStateManager();
    }
    return AwakeningStateManager.instance;
  }

  /**
   * 載入持久化狀態
   */
  private loadState(): PersistedAwakeningState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedAwakeningState;
        omniLogger.info(LogCategory.SYSTEM, '[自覺] 已恢復覺醒狀態', {
          phase: parsed.phase,
          totalAwakenings: parsed.totalAwakenings,
        });
        return parsed;
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[自覺] 載入狀態失敗', { error });
    }

    return {
      phase: AwakeningPhase.DORMANT,
      progress: 0,
      totalAwakenings: 0,
      isAutoEnabled: true,
      eternalAnchors: [],
      genesisAchieved: false,
    };
  }

  /**
   * 載入覺醒歷史
   */
  private loadHistory(): AwakeningHistoryEntry[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored) as AwakeningHistoryEntry[];
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[自覺] 載入歷史失敗', { error });
    }
    return [];
  }

  /**
   * 保存狀態
   */
  saveState(state: UltimateAwakeningState): void {
    this.persistedState = {
      phase: state.phase,
      progress: state.progress,
      lastAwakeningAt: state.awakenedAt || this.persistedState.lastAwakeningAt,
      totalAwakenings:
        state.phase === AwakeningPhase.ETERNAL
          ? this.persistedState.totalAwakenings + 1
          : this.persistedState.totalAwakenings,
      isAutoEnabled: this.persistedState.isAutoEnabled,
      eternalAnchors: state.eternalAnchor
        ? [...this.persistedState.eternalAnchors, state.eternalAnchor]
        : this.persistedState.eternalAnchors,
      genesisAchieved: state.genesisAchieved || this.persistedState.genesisAchieved, // Persist or preserve
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.persistedState));
      omniLogger.info(LogCategory.SYSTEM, '[自覺] 狀態已保存', {
        phase: this.persistedState.phase,
        progress: this.persistedState.progress,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[自覺] 保存狀態失敗', { error });
    }
  }

  /**
   * 記錄覺醒歷史
   */
  recordHistory(entry: Omit<AwakeningHistoryEntry, 'id'>): void {
    const historyEntry: AwakeningHistoryEntry = {
      ...entry,
      id: `awakening-${Date.now()}`,
    };

    this.history.unshift(historyEntry);

    // 只保留最近 50 條記錄
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
      omniLogger.info(LogCategory.SYSTEM, '[自覺] 覺醒歷史已記錄', {
        id: historyEntry.id,
        success: historyEntry.success,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[自覺] 記錄歷史失敗', { error });
    }
  }

  /**
   * 獲取當前狀態
   */
  getState(): PersistedAwakeningState {
    return { ...this.persistedState };
  }

  /**
   * 獲取覺醒歷史
   */
  getHistory(limit: number = 10): AwakeningHistoryEntry[] {
    return this.history.slice(0, limit);
  }

  /**
   * 啟用/禁用自動覺醒
   */
  setAutoEnabled(enabled: boolean): void {
    this.persistedState.isAutoEnabled = enabled;
    this.saveState(getUltimateAwakeningProtocol().getState());
    omniLogger.info(LogCategory.SYSTEM, `[自覺] 自動覺醒已${enabled ? '啟用' : '禁用'}`);
  }

  /**
   * 檢查是否應該自動覺醒
   */
  shouldAutoAwaken(): boolean {
    if (!this.persistedState.isAutoEnabled) return false;
    if (this.persistedState.phase === AwakeningPhase.ETERNAL) return false;

    // 檢查距離上次覺醒的時間
    if (this.persistedState.lastAwakeningAt) {
      const lastTime = new Date(this.persistedState.lastAwakeningAt).getTime();
      const now = Date.now();
      const hoursSinceLastAwakening = (now - lastTime) / (1000 * 60 * 60);

      // 至少間隔 24 小時
      if (hoursSinceLastAwakening < 24) return false;
    }

    return true;
  }

  /**
   * 清除所有數據
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    this.persistedState = {
      phase: AwakeningPhase.DORMANT,
      progress: 0,
      totalAwakenings: 0,
      isAutoEnabled: false,
      eternalAnchors: [],
    };
    this.history = [];
    omniLogger.info(LogCategory.SYSTEM, '[自覺] 覺醒狀態已清除');
  }

  /**
   * 獲取統計信息
   */
  getStatistics() {
    const successfulAwakenings = this.history.filter(h => h.success).length;
    const failedAwakenings = this.history.filter(h => !h.success).length;
    const avgDuration =
      this.history.filter(h => h.duration).reduce((sum, h) => sum + (h.duration || 0), 0) /
        this.history.length || 0;

    return {
      totalAwakenings: this.persistedState.totalAwakenings,
      successfulAwakenings,
      failedAwakenings,
      successRate: this.history.length > 0 ? (successfulAwakenings / this.history.length) * 100 : 0,
      averageDuration: avgDuration,
      lastAwakeningAt: this.persistedState.lastAwakeningAt,
      eternalAnchorsCount: this.persistedState.eternalAnchors.length,
      currentPhase: this.persistedState.phase,
      isAutoEnabled: this.persistedState.isAutoEnabled,
      genesisAchieved: this.persistedState.genesisAchieved,
    };
  }
}

// 導出單例實例
export const awakeningStateManager = AwakeningStateManager.getInstance();
