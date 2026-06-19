import {
  IComponentCore,
  FiveTValidationReport,
  FiveTValidationResult,
  FiveTProtocol,
} from '@/types/core.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { evidenceVault } from './EvidenceVaultService.ts';

/**
 * 💡 5T Omni Sustainable Protocol Validator (4 Yes + 1 No Protocol Root)
 * ==========================================================
 * Strictly executes the "Traceable, Trackable, Transparent, Tangible, Trustworthy" logic gates,
 * ensuring the data chain meets Trustworthy standards.
 *
 * 🏛️ 5T Dimension Check:
 * 🟢 Traceable     -> Check evidence.source_origin
 * 🔵 Trackable     -> Check evidence.lifecycle_hooks
 * 🟠 Transparent   -> Check evidence.logic_formula
 * 🟣 Tangible      -> Check evidence.manifest
 * 🔴 Trustworthy -> Check evidence.trustworthy (Formerly Tamper-proof)
 */
export class FiveTValidator {
  /**
   * Execute Full 5T Validation (Logic Gates)
   * @param component Data component to be validated
   */
  public static validate5T(component: IComponentCore): FiveTValidationReport {
    const results = {
      t1: this.checkTraceability(component),
      t2: this.checkTrackability(component),
      t3: this.checkTransparency(component),
      t4: this.checkTangibility(component),
      t5: this.checkTamperProof(component),
    };

    const trustworthy = Object.values(results).every(r => r.passed);

    return {
      trustworthy,
      results,
      summary: trustworthy
        ? '✅ Data chain complete, meets 5T evidentiary standards (Verified_Trustworthy)'
        : '⚠️ Data failed 5T standards, rejection from evidence vault',
      timestamp: Date.now(),
    };
  }

  /**
   * 🟢 T1: Traceable - Data Origin (Provenance)
   */
  private static checkTraceability(component: IComponentCore): FiveTValidationResult {
    const passed =
      !!component.evidence.traceable?.source_origin &&
      component.evidence.traceable.source_origin.length > 0;

    omniLogger.debug(LogCategory.SYSTEM, '[5T-T1] Checking Traceability', {
      passed,
      origin: component.evidence.traceable?.source_origin,
    });

    return {
      protocol: 'Traceable',
      passed,
      checks: { hasSourceOrigin: passed },
      message: passed ? 'Source Origin Verified' : 'Missing Source Origin',
    };
  }

  /**
   * 🔵 T2: Trackable - Life-cycle Tracking
   */
  private static checkTrackability(component: IComponentCore): FiveTValidationResult {
    const hasId = !!component.uuid;
    const hasHistory =
      Array.isArray(component.evidence.trackable?.lifecycle_hooks) &&
      component.evidence.trackable.lifecycle_hooks.length > 0;

    return {
      protocol: 'Trackable',
      passed: hasId && hasHistory,
      checks: { hasId, haslifecycleHooks: hasHistory },
      message: hasId && hasHistory ? 'ID/Lifecycle Verified' : 'Missing UUID or Lifecycle Hooks',
    };
  }

  /**
   * 🟠 T3: Transparent - Algorithm Transparency (Verification)
   */
  private static checkTransparency(component: IComponentCore): FiveTValidationResult {
    const hasFormula = !!component.evidence.transparent?.formula;

    return {
      protocol: 'Transparent',
      passed: hasFormula,
      checks: { hasFormula },
      message: hasFormula ? 'Logic/Formula Verified' : 'Missing Logic Formula',
    };
  }

  /**
   * 🟣 T4: Tangible - Data Manifestation
   */
  private static checkTangibility(component: IComponentCore): FiveTValidationResult {
    const isCrystallized = !!component.evidence.trustworthy; // Use trustworthy state as crystallization indicator
    const hasMetric = !!component.evidence.tangible?.metric;
    const passed = isCrystallized && hasMetric;

    return {
      protocol: 'Tangible',
      passed,
      checks: {
        isCrystallized,
        hasMetric,
      },
      message: passed ? 'Tangibility Verified' : 'Missing Crystallization or Metric',
    };
  }

  /**
   * 🔴 T5: Tamper-proof - Trustworthy Integrity
   */
  private static checkTamperProof(component: IComponentCore): FiveTValidationResult {
    const hasHashLock =
      !!component.evidence.trustworthy && (component.evidence.trustworthy as any).length > 0;
    const isFrozen = Object.isFrozen(component);

    const passed = hasHashLock;

    return {
      protocol: 'Tamper-proof',
      passed,
      checks: { hasHashLock, isFrozen },
      message: passed ? 'Hash Lock Verified' : 'Missing Hash Lock',
    };
  }

  /**
   * ⛓️ Automated Data Chain Evidence Process (Push to Vault)
   * Only objects that have passed 5T verification and are frozen can enter.
   */
  public static async pushToEvidenceVault(component: IComponentCore): Promise<void> {
    const report = this.validate5T(component);

    // 1. Logic Gate Validation
    if (!report.trustworthy) {
      throw new Error(`[Security Block] Data did not meet 5T standards: ${report.summary}`);
    }

    // 2. Strict Locking Validation (Trustworthiness Final Defense)
    if (!Object.isFrozen(component)) {
      console.warn(`[Vault Warning] Data ${component.uuid} was not frozen. Rejecting deposit.`);
      throw new Error(
        '[Security Block] Data is Unfrozen; deposit rejected. Please ensure Object.freeze() has been executed.'
      );
    }

    // 3. Data Chain Writing (Evidence Vault)
    try {
      await evidenceVault.save(component);
      console.log(`
            ╔════════════════════════════════════════╗
            ║       🛡️ EVIDENCE VAULT SECURED        ║
            ╠════════════════════════════════════════╣
            ║ UUID: ${component.uuid}
            ║ Hash: ${component.evidence.trustworthy?.hash_lock}
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
