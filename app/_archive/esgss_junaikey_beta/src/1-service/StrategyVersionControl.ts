import { omniLogger, LogCategory } from './omniLogger';

/**
 * 策略版本
 */
export interface StrategyVersion {
  id: string;
  strategyId: string;
  version: number;
  content: any; // 完整的策略內容
  createdBy: 'user' | 'ai';
  createdAt: number;
  changeLog: string;
}

/**
 * 策略版本控制服務
 * 提供版本歷史、回滾、比較功能
 */
class StrategyVersionControlClass {
  private versions = new Map<string, StrategyVersion[]>();
  private readonly STORAGE_KEY = 'strategy_versions';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * 創建新版本
   */
  createVersion(
    strategyId: string,
    content: any,
    changeLog: string = '更新策略',
    createdBy: 'user' | 'ai' = 'user'
  ): StrategyVersion {
    const existing = this.versions.get(strategyId) || [];
    const version: StrategyVersion = {
      id: `${strategyId}-v${existing.length + 1}`,
      strategyId,
      version: existing.length + 1,
      content: JSON.parse(JSON.stringify(content)), // 深拷貝
      createdBy,
      createdAt: Date.now(),
      changeLog,
    };

    existing.push(version);
    this.versions.set(strategyId, existing);
    this.saveToStorage();

    omniLogger.info(LogCategory.SYSTEM, `創建策略版本: ${strategyId} v${version.version}`, {
      changeLog,
    });

    return version;
  }

  /**
   * 獲取版本歷史
   */
  getVersionHistory(strategyId: string): StrategyVersion[] {
    return this.versions.get(strategyId) || [];
  }

  /**
   * 獲取特定版本
   */
  getVersion(strategyId: string, version: number): StrategyVersion | null {
    const history = this.versions.get(strategyId);
    return history?.find(v => v.version === version) || null;
  }

  /**
   * 獲取最新版本
   */
  getLatestVersion(strategyId: string): StrategyVersion | null {
    const history = this.versions.get(strategyId);
    if (!history || history.length === 0) return null;
    return history[history.length - 1] || null;
  }

  /**
   * 回滾到指定版本
   */
  rollback(strategyId: string, targetVersion: number): any | null {
    const target = this.getVersion(strategyId, targetVersion);
    if (!target) {
      omniLogger.warn(LogCategory.SYSTEM, `回滾失敗: 版本 ${targetVersion} 不存在`, { strategyId });
      return null;
    }

    // 創建新版本（標記為回滾）
    this.createVersion(strategyId, target.content, `回滾至版本 ${targetVersion}`, 'user');

    omniLogger.info(LogCategory.SYSTEM, `策略已回滾: ${strategyId} → v${targetVersion}`, {
      from: this.getLatestVersion(strategyId)?.version,
    });

    return target.content;
  }

  /**
   * 比較兩個版本（簡易 diff）
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

    // 簡易對象比較
    const keys1 = new Set(Object.keys(ver1.content));
    const keys2 = new Set(Object.keys(ver2.content));

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    // 檢查新增
    for (const key of keys2) {
      if (!keys1.has(key)) {
        added.push(key);
      } else if (JSON.stringify(ver1.content[key]) !== JSON.stringify(ver2.content[key])) {
        modified.push(key);
      }
    }

    // 檢查移除
    for (const key of keys1) {
      if (!keys2.has(key)) {
        removed.push(key);
      }
    }

    return { added, removed, modified };
  }

  /**
   * 刪除策略的所有版本
   */
  deleteAllVersions(strategyId: string): boolean {
    const deleted = this.versions.delete(strategyId);
    if (deleted) {
      this.saveToStorage();
      omniLogger.info(LogCategory.SYSTEM, `已刪除策略所有版本: ${strategyId}`);
    }
    return deleted;
  }

  /**
   * 獲取統計信息
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
   * 從 localStorage 加載
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.versions = new Map(Object.entries(data));
        omniLogger.info(LogCategory.SYSTEM, '已加載策略版本記錄', this.getStats());
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '加載策略版本失敗', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * 保存到 localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.versions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '保存策略版本失敗', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * 清空所有版本（謹慎使用）
   */
  clearAll(): void {
    this.versions.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    omniLogger.info(LogCategory.SYSTEM, '已清空所有策略版本');
  }
}

// 單例
export const StrategyVersionControl = new StrategyVersionControlClass();
