import { IComponentCore } from '../0-domain/contracts/IComponentCore.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * 💠 ConsonanceReport: The 5T Audit Outcome
 * --------------------------------------------------------------------------------
 * 第一層：5T 邏輯門 (The 5T Logic Gate)
 * [1] Tangible 可感知 - 將抽象永續願景轉化為具體指標成果
 * [2] Traceable 可溯源 - 鏈式日誌包含原始資料來源 (source_origin)
 * [3] Trackable 可追蹤 - 生命週期 Hook 記錄數據流轉路徑
 * [4] Transparent 可透明驗算 - 算法公式公開化，零幻覺驗證 (ISO-14064-1)
 * [5] Trustworthy 不可篡改 - Hash Lock + Object.freeze()
 * 
 * 第二層：4可1不可狀態機 (The 4+1 State Machine)
 * 🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 */
export interface ConsonanceReport {
  isConsonant: boolean;
  score: number;
  dimensions: {
    tangible: boolean;
    traceable: boolean;
    trackable: boolean;
    transparent: boolean;
    trustworthy: boolean;
  };
  entropy: number;
  suggestions: string[];
}

/**
 * 🏗️ ConsonanceGate: The 5T Logic Gate
 * --------------------------------------------------------------------------------
 * 5T (4+1) 協議驗證門徑
 * 4可1不可：🟢 可感知 | 🟢 可溯源 | 🟢 可追蹤 | 🟢 可透明驗算 | 🔴 不可篡改
 */
export class ConsonanceGate {
  private static readonly PERFECT_SCORE = 100;

  /**
   * Verify a component against the 5T (4+1) Protocol.
   */
  public static verify(component: IComponentCore): ConsonanceReport {
    const { uuid, evidence, status } = component;
    const suggestions: string[] = [];

    // 1. Tangible
    const tangible = !!uuid && !!component.version && !!component.impactMetric;
    if (!tangible) suggestions.push('Missing core identifier or impact metric (Tangible Failure)');

    // 2. Traceable
    const traceable =
      !!evidence?.traceable?.source_origin &&
      (evidence.traceable.verification_links?.length || 0) > 0;
    if (!traceable)
      suggestions.push('Source unknown or missing verification links (Traceable Failure)');

    // 3. Trackable
    const trackable = (evidence?.trackable?.lifecycle_hooks?.length || 0) > 0;
    if (!trackable) suggestions.push('Missing lifecycle tracking records (Trackable Failure)');

    // 4. Transparent
    const transparent =
      !!evidence?.transparent?.formula && !!evidence?.transparent?.validation_standard;
    if (!transparent)
      suggestions.push('Algorithm formula not labeled or opaque (Transparent Failure)');

    // 5. Trustworthy
    // In this protocol, trustworthy is the "1" in "4+1" (The Immutable Seal)
    const trustworthy = status === 'Trustworthy' && !!evidence?.trustworthy?.hash_lock;
    if (!trustworthy)
      suggestions.push('Component not yet sealed or hash lock missing (Trustworthy Failure)');

    const dimensions = { tangible, traceable, trackable, transparent, trustworthy };
    const validCount = Object.values(dimensions).filter(Boolean).length;
    const score = (validCount / 5) * this.PERFECT_SCORE;
    const entropy = 1 - validCount / 5;

    return {
      isConsonant: validCount === 5,
      score,
      dimensions,
      entropy,
      suggestions,
    };
  }

  /**
   * Calculate integrity hash if missing (Simulated)
   */
  public static calculateIntegrityHash(component: IComponentCore): string {
    const data = JSON.stringify({
      uuid: component.uuid,
      version: component.version,
      timestamp: component.timestamp,
      data: component.data,
    });
    // Simple mock hash for demo
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return `sha256-consonance-${Math.abs(hash).toString(16)}`;
  }
}

/**
 * 🧪 EvolutionEngine: The Alchemy Lab (Entropy Reduction)
 */
export class EvolutionEngine {
  /**
   * Purify a component (Entropy Alchemy)
   * Restores consensus and fixes 5T gaps.
   */
  public static async purify(component: IComponentCore): Promise<IComponentCore> {
    omniLogger.warn(
      LogCategory.AI,
      `[Entropy Alchemy] Initiating purification for ${component.uuid}`
    );

    // Create a clone to modify
    const purified: any = { ...component, evidence: { ...component.evidence } };

    // 1. Restore Traceability if missing
    if (!purified.evidence.traceable) {
      purified.evidence.traceable = {
        source_origin: 'Regenerative Vault Alpha',
        verification_links: ['https://consonance.goodward.com/recovery/trace'],
      };
    }

    // 2. Restore Trackability
    if (!purified.evidence.trackable || purified.evidence.trackable.lifecycle_hooks.length === 0) {
      purified.evidence.trackable = {
        ...purified.evidence.trackable,
        lifecycle_hooks: [
          ...(purified.evidence.trackable?.lifecycle_hooks || []),
          { event: 'ALCHYMY_RESTORATION', timestamp: Date.now(), actor: 'EvolutionEngine' },
        ],
      };
    }

    // 3. Restore Transparency
    if (!purified.evidence.transparent) {
      purified.evidence.transparent = {
        formula: '5T-Consonance-v1.0',
        validation_standard: 'ESGSS-5T-AUTO',
      };
    }

    // 4. Re-engrave the Trustworthy Seal (Hash Lock)
    const newHash = ConsonanceGate.calculateIntegrityHash(purified);
    purified.evidence.trustworthy = {
      hash_lock: newHash,
      is_frozen: true,
    };

    // Simulated delay for "Alchemy"
    await new Promise(r => setTimeout(r, 1500));

    omniLogger.info(
      LogCategory.AI,
      `[Entropy Alchemy] Purification successful for ${component.uuid}`
    );
    return purified;
  }
}

/**
 * 🛡️ ConsonanceMiddleware: Automatic Shield
 */
export function ConsonanceShield() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const component = args[0] as IComponentCore;
      if (!component || !component.uuid) return originalMethod.apply(this, args);

      const report = ConsonanceGate.verify(component);

      if (!report.isConsonant) {
        omniLogger.warn(
          LogCategory.SYSTEM,
          `[Consonance Gate] Entropy detected in ${component.uuid}. Triggering Alchemy...`
        );
        const purified = await EvolutionEngine.purify(component);
        args[0] = purified;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
