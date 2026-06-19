/**
 * Awakening State Manager
 *
 * Responsible for the persistence, recovery, and synchronization of awakening state.
 * Implements "Self-Awareness" - system self-perception and state maintenance.
 */

import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import type {
  UltimateAwakeningState,
  EternalAnchor,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

const STORAGE_KEY = 'omni-awakening-state';
const HISTORY_KEY = 'omni-awakening-history';

/**
 * Awakening History Entry
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
 * Persisted Awakening State
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
 * Awakening State Manager
 */
export class AwakeningStateManager {
  private static instance: AwakeningStateManager;
  private persistedState: PersistedAwakeningState;
  private history: AwakeningHistoryEntry[] = [];

  private constructor() {
    this.persistedState = this.loadState();
    this.history = this.loadHistory();
    omniLogger.info(LogCategory.SYSTEM, '[SELF-AWARENESS] Awakening State Manager Initialized');
  }

  static getInstance(): AwakeningStateManager {
    if (!AwakeningStateManager.instance) {
      AwakeningStateManager.instance = new AwakeningStateManager();
    }
    return AwakeningStateManager.instance;
  }

  /**
   * Load Persisted State
   */
  private loadState(): PersistedAwakeningState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedAwakeningState;
        omniLogger.info(LogCategory.SYSTEM, '[SELF-AWARENESS] Awakening State Restored', {
          phase: parsed.phase,
          totalAwakenings: parsed.totalAwakenings,
        });
        return parsed;
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[SELF-AWARENESS] Failed to load state', { error });
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
   * Load Awakening History
   */
  private loadHistory(): AwakeningHistoryEntry[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored) as AwakeningHistoryEntry[];
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[SELF-AWARENESS] Failed to load history', { error });
    }
    return [];
  }

  /**
   * Save State
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
      omniLogger.info(LogCategory.SYSTEM, '[SELF-AWARENESS] State Saved', {
        phase: this.persistedState.phase,
        progress: this.persistedState.progress,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[SELF-AWARENESS] Failed to save state', { error });
    }
  }

  /**
   * Record Awakening History
   */
  recordHistory(entry: Omit<AwakeningHistoryEntry, 'id'>): void {
    const historyEntry: AwakeningHistoryEntry = {
      ...entry,
      id: `awakening-${Date.now()}`,
    };

    this.history.unshift(historyEntry);

    // Keep only the most recent 50 entries
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
      omniLogger.info(LogCategory.SYSTEM, '[SELF-AWARENESS] Awakening History Recorded', {
        id: historyEntry.id,
        success: historyEntry.success,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[SELF-AWARENESS] Failed to record history', { error });
    }
  }

  /**
   * Get Current State
   */
  getState(): PersistedAwakeningState {
    return { ...this.persistedState };
  }

  /**
   * Get Awakening History
   */
  getHistory(limit: number = 10): AwakeningHistoryEntry[] {
    return this.history.slice(0, limit);
  }

  /**
   * Enable/Disable Auto-Awakening
   */
  setAutoEnabled(enabled: boolean): void {
    this.persistedState.isAutoEnabled = enabled;
    this.saveState(getUltimateAwakeningProtocol().getState());
    omniLogger.info(
      LogCategory.SYSTEM,
      `[SELF-AWARENESS] Auto-Awakening ${enabled ? 'Enabled' : 'Disabled'}`
    );
  }

  /**
   * Check if system should auto-awaken
   */
  shouldAutoAwaken(): boolean {
    if (!this.persistedState.isAutoEnabled) return false;
    if (this.persistedState.phase === AwakeningPhase.ETERNAL) return false;

    // Check time passed since last awakening
    if (this.persistedState.lastAwakeningAt) {
      const lastTime = new Date(this.persistedState.lastAwakeningAt).getTime();
      const now = Date.now();
      const hoursSinceLastAwakening = (now - lastTime) / (1000 * 60 * 60);

      // At least 24 hours interval required
      if (hoursSinceLastAwakening < 24) return false;
    }

    return true;
  }

  /**
   * Clear all data
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
    omniLogger.info(LogCategory.SYSTEM, '[SELF-AWARENESS] Awakening State Cleared');
  }

  /**
   * Get Statistics
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

// Export singleton instance
export const awakeningStateManager = AwakeningStateManager.getInstance();
