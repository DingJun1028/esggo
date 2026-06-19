import { omniLogger, LogCategory } from './omniLogger.js';

/**
 * Strategy Version
 */
export interface StrategyVersion {
  id: string;
  strategyId: string;
  version: number;
  content: any; // Full strategy content
  createdBy: 'user' | 'ai';
  createdAt: number;
  changeLog: string;
}

/**
 * Strategy Version Control Service
 * Provides version history, rollback, and comparison features
 */
class StrategyVersionControlClass {
  private versions = new Map<string, StrategyVersion[]>();
  private readonly STORAGE_KEY = 'strategy_versions';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Create new version
   */
  createVersion(
    strategyId: string,
    content: any,
    changeLog: string = 'Update strategy',
    createdBy: 'user' | 'ai' = 'user'
  ): StrategyVersion {
    const existing = this.versions.get(strategyId) || [];
    const version: StrategyVersion = {
      id: `${strategyId}-v${existing.length + 1}`,
      strategyId,
      version: existing.length + 1,
      content: JSON.parse(JSON.stringify(content)), // Deep copy
      createdBy,
      createdAt: Date.now(),
      changeLog,
    };

    existing.push(version);
    this.versions.set(strategyId, existing);
    this.saveToStorage();

    omniLogger.info(
      LogCategory.SYSTEM,
      `Created strategy version: ${strategyId} v${version.version}`,
      {
        changeLog,
      }
    );

    return version;
  }

  /**
   * Get version history
   */
  getVersionHistory(strategyId: string): StrategyVersion[] {
    return this.versions.get(strategyId) || [];
  }

  /**
   * Get specific version
   */
  getVersion(strategyId: string, version: number): StrategyVersion | null {
    const history = this.versions.get(strategyId);
    return history?.find(v => v.version === version) || null;
  }

  /**
   * Get latest version
   */
  getLatestVersion(strategyId: string): StrategyVersion | null {
    const history = this.versions.get(strategyId);
    if (!history || history.length === 0) return null;
    return history[history.length - 1] || null;
  }

  /**
   * Rollback to specified version
   */
  rollback(strategyId: string, targetVersion: number): any | null {
    const target = this.getVersion(strategyId, targetVersion);
    if (!target) {
      omniLogger.warn(
        LogCategory.SYSTEM,
        `Rollback failed: Version ${targetVersion} does not exist`,
        { strategyId }
      );
      return null;
    }

    // Create new version (marked as rollback)
    this.createVersion(strategyId, target.content, `Rollback to version ${targetVersion}`, 'user');

    omniLogger.info(LogCategory.SYSTEM, `Strategy rolled back: ${strategyId} → v${targetVersion}`, {
      from: this.getLatestVersion(strategyId)?.version,
    });

    return target.content;
  }

  /**
   * Compare two versions (Simple diff)
   */
  diff(
    strategyId: string,
    v1: number,
    v2: number
  ): {
    added: string[];
    removed: string[];
    modified: string[];
  } {
    const ver1 = this.getVersion(strategyId, v1);
    const ver2 = this.getVersion(strategyId, v2);

    if (!ver1 || !ver2) {
      return { added: [], removed: [], modified: [] };
    }

    // Simple object comparison
    const keys1 = new Set(Object.keys(ver1.content));
    const keys2 = new Set(Object.keys(ver2.content));

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    // Check for additions
    for (const key of keys2) {
      if (!keys1.has(key)) {
        added.push(key);
      } else if (JSON.stringify(ver1.content[key]) !== JSON.stringify(ver2.content[key])) {
        modified.push(key);
      }
    }

    // Check for removals
    for (const key of keys1) {
      if (!keys2.has(key)) {
        removed.push(key);
      }
    }

    return { added, removed, modified };
  }

  /**
   * Delete all versions of a strategy
   */
  deleteAllVersions(strategyId: string): boolean {
    const deleted = this.versions.delete(strategyId);
    if (deleted) {
      this.saveToStorage();
      omniLogger.info(LogCategory.SYSTEM, `Deleted all versions of strategy: ${strategyId}`);
    }
    return deleted;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalStrategies: number;
    totalVersions: number;
    avgVersionsPerStrategy: number;
  } {
    const totalStrategies = this.versions.size;
    const totalVersions = Array.from(this.versions.values()).reduce(
      (sum, versions) => sum + versions.length,
      0
    );
    const avgVersionsPerStrategy = totalStrategies > 0 ? totalVersions / totalStrategies : 0;

    return {
      totalStrategies,
      totalVersions,
      avgVersionsPerStrategy: Math.round(avgVersionsPerStrategy * 10) / 10,
    };
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.versions = new Map(Object.entries(data));
        omniLogger.info(LogCategory.SYSTEM, 'Loaded strategy version records', this.getStats());
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to load strategy versions', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.versions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to save strategy versions', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Clear all versions (Use with caution)
   */
  clearAll(): void {
    this.versions.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    omniLogger.info(LogCategory.SYSTEM, 'All strategy versions cleared');
  }
}

// Singleton
export const StrategyVersionControl = new StrategyVersionControlClass();
