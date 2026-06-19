import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * OmniStore: Omni Persistence Layer
 * Centralizes data storage for the entire Omni-System.
 * Replaces ad-hoc localStorage usage and mock stubs.
 */

export const OmniNamespace = {
  AGENT: 'omni_agent',
  MISSION: 'omni_mission',
  ECONOMY: 'omni_economy',
  RUNE: 'omni_rune',
  PARTNER: 'omni_partner',
  SYSTEM: 'omni_system',
  ASSET: 'omni_asset',
} as const;

export interface StoreResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class OmniStoreService {
  private inMemoryStore: Map<string, any> = new Map();
  private hasStorage: boolean;

  constructor() {
    this.hasStorage = typeof localStorage !== 'undefined';
    if (this.hasStorage) {
      omniLogger.info(LogCategory.SYSTEM, 'OmniStore initialized with LocalStorage backend');
    } else {
      omniLogger.warn(
        LogCategory.SYSTEM,
        'OmniStore initialized with Memory backend (No Persistence)'
      );
    }
  }

  /**
   * Save data to a specific namespace
   */
  setItem<T>(namespace: string, key: string, value: T): StoreResult<void> {
    const fullKey = `${namespace}:${key}`;
    try {
      if (this.hasStorage) {
        localStorage.setItem(fullKey, JSON.stringify(value));
      } else {
        this.inMemoryStore.set(fullKey, value);
      }
      return { success: true };
    } catch (e: any) {
      omniLogger.error(LogCategory.SYSTEM, `OmniStore Save Failed [${fullKey}]`, {
        error: e.message,
      });
      return { success: false, error: e.message };
    }
  }

  /**
   * Retrieve data from a specific namespace
   */
  getItem<T>(namespace: string, key: string): StoreResult<T> {
    const fullKey = `${namespace}:${key}`;
    try {
      let data: T | null = null;
      if (this.hasStorage) {
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          data = JSON.parse(stored) as T;
        }
      } else {
        data = this.inMemoryStore.get(fullKey) as T;
      }

      if (data === null || data === undefined) {
        return { success: false, error: 'Not Found' };
      }

      return { success: true, data };
    } catch (e: any) {
      omniLogger.error(LogCategory.SYSTEM, `OmniStore Load Failed [${fullKey}]`, {
        error: e.message,
      });
      return { success: false, error: e.message };
    }
  }

  /**
   *  Remove specific item
   */
  removeItem(namespace: string, key: string): void {
    const fullKey = `${namespace}:${key}`;
    if (this.hasStorage) {
      localStorage.removeItem(fullKey);
    } else {
      this.inMemoryStore.delete(fullKey);
    }
  }

  /**
   * Clear an entire namespace
   */
  clearNamespace(namespace: string): void {
    const prefix = `${namespace}:`;

    if (this.hasStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } else {
      const keysToRemove: string[] = [];
      for (const key of this.inMemoryStore.keys()) {
        if (key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => this.inMemoryStore.delete(k));
    }
    omniLogger.info(LogCategory.SYSTEM, `OmniStore Namespace Cleared: ${namespace}`);
  }

  /**
   * List all keys in a namespace
   */
  listKeys(namespace: string): string[] {
    const prefix = `${namespace}:`;
    const keys: string[] = [];

    if (this.hasStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.replace(prefix, ''));
        }
      }
    } else {
      for (const key of this.inMemoryStore.keys()) {
        if (key.startsWith(prefix)) {
          keys.push(key.replace(prefix, ''));
        }
      }
    }
    return keys;
  }

  /**
   * Create a backup of all stored data
   */
  createBackup(): string {
    const backup: Record<string, any> = {};

    if (this.hasStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('omni_')) {
          backup[key] = localStorage.getItem(key);
        }
      }
    } else {
      for (const [key, value] of this.inMemoryStore.entries()) {
        if (key.startsWith('omni_')) {
          backup[key] = JSON.stringify(value);
        }
      }
    }
    return JSON.stringify(backup);
  }

  /**
   * Restore from backup string
   */
  restoreBackup(backupJson: string): boolean {
    try {
      const backup = JSON.parse(backupJson);
      for (const [key, value] of Object.entries(backup)) {
        if (this.hasStorage) {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        } else {
          if (typeof value === 'string') {
            this.inMemoryStore.set(key, JSON.parse(value));
          }
        }
      }
      omniLogger.info(LogCategory.SYSTEM, 'OmniStore Restored from Backup');
      return true;
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, 'OmniStore Restore Failed', { error: e });
      return false;
    }
  }

  // Lifecycle management
  destroy() {
    // No persistent connections to close, but we can clear memory
    this.inMemoryStore.clear();
    omniLogger.info(LogCategory.SYSTEM, 'OmniStore Service Destroyed');
  }
}

export const OmniStore = new OmniStoreService();
