import { IComponentCore } from '@/types/core';
import { FiveTValidator } from './FiveTValidator';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { BehaviorSubject } from 'rxjs';
import { omni } from '../0-core/trinity';

/**
 * 📊 Sovereign Impact Ledger (主權大愛帳本)
 * --------------------------------------------------
 * [核心功能]
 * 1. 統一管理所有經過 5T 驗證的影響力數據。
 * 2. 提供即時異步數據流 (RxJS BehaviorSubject) 供 UI 訂閱。
 * 3. 確保數據在進入帳本前已達成 "Trustworthy" 狀態。
 * 4. [Omni-Integrated]: 自動結晶化至奧秘永憶 (Omni Eternal Memory)。
 */
export interface ImpactSummary {
  totalPoints: number;
  totalMissions: number;
  verifiedTrustworthyCount: number;
}

export class SovereignLedger {
  private static instance: SovereignLedger;
  private entries: IComponentCore[] = [];
  private ledgerSubject = new BehaviorSubject<IComponentCore[]>([]);

  private constructor() { }

  public static getInstance(): SovereignLedger {
    if (!SovereignLedger.instance) {
      SovereignLedger.instance = new SovereignLedger();
    }
    return SovereignLedger.instance;
  }

  /**
   * 🖋️ 記錄影響力數據 (5T 門禁 + Omni 結晶化)
   */
  public async recordImpact(entry: IComponentCore): Promise<void> {
    try {
      // 1. 執行 5T 邏輯門校驗
      const report = FiveTValidator.validate5T(entry);
      if (!report.trustworthy) {
        omniLogger.error(LogCategory.SECURITY, `[Ledger_Security_Block] 5T Validation Failed for ${entry.uuid}`, {
          results: report.results,
          summary: report.summary
        });
        throw new Error(`[Ledger_Security_Block] 數據未通過 5T 校驗: ${report.summary}`);
      }

      // 2. [Omni Core Integration] 奧秘元素結晶化 (Info-One)
      // 將 5T 驗證通過的數據，正式轉化為 Omni 體系中的「奧秘元素」
      await omni.createInfoOne('SovereignImpact', {
        ...entry,
        trustworthy: true,
        validationReport: report,
        crystallizedAt: new Date().toISOString(),
      });

      // 3. 存入內部大帳本 (供 UI 即時訂閱)
      this.entries.push(entry);
      this.ledgerSubject.next([...this.entries]);

      omniLogger.info(LogCategory.SOVEREIGN, `⚖️ Sovereign Audit: Impact Captured - ${entry.uuid}`, {
        traceable: entry.evidence?.traceable,
        trustworthy: entry.evidence?.trustworthy,
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '主權帳本寫入失敗', { error });
      throw error;
    }
  }

  /**
   * 獲取當前帳本快照
   */
  public getLedger(): IComponentCore[] {
    return [...this.entries];
  }

  /**
   * 獲取帳本數據流 (用於 UI 即時同步)
   */
  public getLedgerObservable() {
    return this.ledgerSubject.asObservable();
  }

  /**
   * 📊 獲取影響力彙總數據
   */
  public getImpactSummary(): ImpactSummary {
    return {
      totalPoints:
        this.entries.reduce((sum, e) => sum + (e.virtues ? e.virtues.integrity : 0), 0) * 100,
      totalMissions: this.entries.filter(e =>
        e.evidence.traceable?.source_origin?.includes('Legion')
      ).length,
      verifiedTrustworthyCount: this.entries.filter(e => e.status === 'Trustworthy').length,
    };
  }
}

export const sovereignLedger = SovereignLedger.getInstance();
