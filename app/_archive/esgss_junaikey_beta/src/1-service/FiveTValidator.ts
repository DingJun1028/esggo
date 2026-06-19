import {
  IComponentCore,
  FiveTValidationReport,
  FiveTValidationResult,
  FiveTProtocol,
} from '@/types/core';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { evidenceVault } from './EvidenceVaultService';

/**
 * 💡 5T 善向永續協議校驗器 (The 5T Logic Gate)
 * ==========================================================
 * 嚴格執行「四可一不可」邏輯門，確保數據鏈符合 Trustworthy 標準。
 *
 * 🏛️ 5T 維度 Check (依序通過):
 * 1. 🟢 Tangible (可感知)    -> 指標化 (metrics)
 * 2. 🟢 Traceable (可溯源)   -> 來源備註 (source_origin)
 * 3. 🟢 Trackable (可追蹤)   -> 路徑紀錄 (lifecycle_hooks)
 * 4. 🟢 Transparent (可透明驗算) -> 公式公開 (logic_formula)
 * 5. 🔴 Trustworthy (不可篡改) -> 雜湊鎖定 (hash_lock + freeze)
 */
export class FiveTValidator {
  /**
   * 執行完整 5T 邏輯門驗證 (4+1 State Machine)
   * @param component 待驗證的數據組件
   */
  public static validate5T(component: IComponentCore): FiveTValidationReport {
    const results = {
      t1: this.checkTangibility(component),
      t2: this.checkTraceability(component),
      t3: this.checkTrackability(component),
      t4: this.checkTransparency(component),
      t5: this.checkTrustworthiness(component),
    };

    const trustworthy = Object.values(results).every(r => r.passed);

    return {
      trustworthy,
      results,
      summary: trustworthy
        ? '✅ 數據鏈完整，通過 5T 邏輯門 (Verified_Trustworthy)'
        : '⚠️ 數據未通過 5T 邏輯門，拒絕寫入佐證庫',
      timestamp: Date.now(),
    };
  }

  /**
   * 🟢 T1: Tangible - 可感知 (具體指標)
   */
  private static checkTangibility(component: IComponentCore): FiveTValidationResult {
    const evidence = component.evidence;
    const tangible = evidence.tangible || (evidence.manifest as any); // Fallback to legacy manifest
    const metrics = evidence.metrics || (component as any).metrics; // Fallback to core level

    const hasMetrics = !!metrics && Object.keys(metrics).length > 0;

    // 🏛️ Domain Rule: Legion missions must have a 'score' and 'outcome'
    const sourceOrigin = evidence.traceable?.source_origin || evidence.source_origin;
    const isLegionSource = typeof sourceOrigin === 'string' && sourceOrigin.includes('Legion');
    const legionValid = !isLegionSource || (typeof metrics === 'object' && 'score' in metrics);

    const isVisualized = !!tangible && (tangible.is_crystallized || tangible.glow_intensity !== undefined);
    const passed = hasMetrics && isVisualized && legionValid;

    return {
      protocol: 'Tangible',
      passed,
      checks: { hasMetrics, isVisualized, legionValid },
      message: passed
        ? 'Tangibility Verified'
        : 'Missing metrics, visualization, or failed domain rules',
    };
  }

  /**
   * 🟢 T2: Traceable - 可溯源 (原始資料來源)
   */
  private static checkTraceability(component: IComponentCore): FiveTValidationResult {
    const evidence = component.evidence;
    const sourceOrigin = evidence.traceable?.source_origin || evidence.source_origin;
    const passed = !!sourceOrigin && sourceOrigin.length > 0;

    return {
      protocol: 'Traceable',
      passed,
      checks: { hasSourceOrigin: passed },
      message: passed ? 'Source Origin Verified' : 'Missing Source Origin',
    };
  }

  /**
   * 🟢 T3: Trackable - 可追蹤 (流轉路徑紀錄)
   */
  private static checkTrackability(component: IComponentCore): FiveTValidationResult {
    const hasId = !!component.uuid;
    const hasHistory =
      Array.isArray(component.evidence.lifecycle_hooks) &&
      component.evidence.lifecycle_hooks.length > 0;

    const passed = hasId && hasHistory;

    return {
      protocol: 'Trackable',
      passed,
      checks: { hasId, haslifecycleHooks: hasHistory },
      message: passed ? 'Trackability Verified' : 'Missing UUID or Lifecycle Hooks',
    };
  }

  /**
   * 🟢 T4: Transparent - 可透明驗算 (公式公開)
   */
  private static checkTransparency(component: IComponentCore): FiveTValidationResult {
    const evidence = component.evidence;
    const formula = evidence.transparent?.formula || evidence.logic_formula;
    const hasFormula = !!formula;

    // 🔬 Domain Rule: Scientific sources must cite a Standard (ISO, NIST, etc.)
    const sourceOrigin = evidence.traceable?.source_origin || evidence.source_origin;
    const isScientific =
      typeof sourceOrigin === 'string' &&
      (sourceOrigin.includes('Lab') || sourceOrigin.includes('Sensor'));

    const citationValid =
      !isScientific ||
      (typeof formula === 'string' && /ISO|NIST|IEEE|GHG/.test(formula));

    const passed = hasFormula && citationValid;

    return {
      protocol: 'Transparent',
      passed,
      checks: { hasFormula, citationValid },
      message: passed ? 'Transparency Verified' : 'Missing logic formula or standard citation',
    };
  }

  /**
   * 🔴 T5: Trustworthy - 不可篡改 (雜湊鎖定)
   */
  private static checkTrustworthiness(component: IComponentCore): FiveTValidationResult {
    const hasHashLock = !!component.evidence.hash_lock && component.evidence.hash_lock.length > 0;
    const isFrozen = Object.isFrozen(component);
    const statusAligned = component.status === 'Trustworthy';

    const passed = hasHashLock && statusAligned;

    return {
      protocol: 'Trustworthy',
      passed,
      checks: { hasHashLock, isFrozen, statusAligned },
      message: passed ? 'Trustworthiness Secured' : 'Hash lock missing or status mismatch',
    };
  }

  /**
   * ⛓️ 數據鏈自動化存證流程 (Push to Vault)
   * 只有通過 5T 驗證且被凍結的對象才能進入
   */
  public static async pushToEvidenceVault(component: IComponentCore): Promise<void> {
    const report = this.validate5T(component);

    // 1. 邏輯門校驗
    if (!report.trustworthy) {
      throw new Error(`[Security Block] 數據未通過 5T 標準: ${report.summary}`);
    }

    // 2. 嚴格鎖定校驗 (Trustworthiness 最終防線)
    if (!Object.isFrozen(component)) {
      console.warn(`[Vault Warning] Data ${component.uuid} was not frozen. Rejecting deposit.`);
      throw new Error(
        '[Security Block] 數據未凍結 (Unfrozen)，拒絕寫入佐證庫。請確保 Object.freeze() 已執行。'
      );
    }

    // 3. 數據鏈寫入 (Evidence Vault)
    try {
      await evidenceVault.save(component);
      console.log(`
            ╔════════════════════════════════════════╗
            ║       🛡️ EVIDENCE VAULT SECURED        ║
            ╠════════════════════════════════════════╣
            ║ UUID: ${component.uuid}
            ║ Hash: ${component.evidence.hash_lock}
            ║ Status: Verified_Trustworthy
            ║ Timestamp: ${new Date().toISOString()}
            ╚════════════════════════════════════════╝
            `);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to save to Evidence Vault', { error });
      throw error;
    }
  }
}
