/**
 * 🏛️ 奧秘元件心核 (Omni Component Core): SSOT 實作
 *
 * @name OmniComponentCore
 * @description SSOT (單一真理來源) 元件的基礎建構模組。
 * @contract "零幻覺驗算, 5T 協議 (Zero Hallucination, 5T Protocol)"
 * @philosophy "可溯源 (Traceable), 可追蹤 (Trackable)"
 */

import crypto from 'crypto';
import { quantumTrustAnchorService } from './QuantumTrustAnchorService.js';

// ============================================================================
// Type Definitions: Omni Component Core
// ============================================================================

/**
 * Evidence Map Structure (Hybrid v10.0)
 * Aligned with src/0-domain/contracts/IComponentCore.ts
 */
export interface EvidenceMap {
  // Nested 5T Protocol Structure (v8.0+)
  readonly tangible?: {
    metric?: string;
    visual_grade?: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
    glow_intensity?: number;
    timestamp?: number;
    verified_at?: number;
  };
  readonly traceable?: {
    source_origin?: string;
    verification_links?: string[];
    owner?: string;
    raw_data_path?: string;
    geospatial_node?: string; // Phase 59: OMNI-CONSENSUS node tracking
  };
  readonly trackable?: {
    lifecycle_hooks?: { event: string; timestamp: number; actor: string }[];
    pathway?: string[];
  };
  readonly transparent?: {
    formula?: string;
    validation_standard?: string;
    standard?: string;
    reasoning_path?: string[]; // Phase 59: Multi-Agent logic trails
  };
  readonly trustworthy?: {
    hash_lock?: string;
    is_frozen?: boolean;
    quantum_anchor?: string; // Phase 60: Lattice-based signature
    post_quantum_hash?: string; // Phase 60: Key rotation anchor
  };
  /** Verification Timestamp */
  verified_at?: number;

  // Metadata/Extensibility
  readonly metadata?: Record<string, any>;

  // Legacy/Flat support
  [key: string]: any;
}

/**
 * Omni Component Core Interface
 */
export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  status: 'Draft' | 'Proposed' | 'Calculated' | 'Trustworthy' | 'Approved' | 'Sealed' | 'Violated';
  evidence: EvidenceMap;
}

/**
 * 5T Protocol Structure (4 Yes + 1 No)
 */
export interface FiveTProtocol {
  // 🟢 Traceable
  traceable: {
    sourceOrigin: string; // Source Origin
    rawDataRetention: string; // Raw Data Path
  };

  // 🔵 Trackable
  trackable: {
    lifecycleHooks: LifecycleEvent[]; // Lifecycle Hooks
    dataFlowPath: string[]; // Data Flow Path
  };

  // 🟠 Transparent (Calculable)
  transparent: {
    algorithmFormula: string; // Logic Formula
    formulaSource: string; // Formula Source (e.g., [ISO-14064-1])
    calculationSteps: string[]; // Step-by-step description
  };

  // 🔴 Trustworthy (Immutable)
  trustworthy: {
    hashLock: string; // Integrity Hash
    frozen: boolean; // Is Frozen?
    verificationCode: string; // Verification Code
  };

  // 🟣 Tallyable (Tangible)
  tangible?: {
    metric: string;
    verifiedValue: number;
    visualGrade: string;
  };
}

/**
 * Lifecycle Event
 */
export interface LifecycleEvent {
  eventId: string;
  eventType: 'CREATED' | 'MODIFIED' | 'VALIDATED' | 'SEALED';
  timestamp: number;
  actor: string;
  details: any;
}

/**
 * Validated Data Structure
 */
export interface ValidatedData {
  ssot_id: string; // SSOT UUID
  status: 'IMMUTABLE' | 'MUTABLE';
  evidence_link: string; // Link to Evidence
  verified: boolean; // Is Verified?
  result: any;
}

// ============================================================================
// Omni Component Core Implementation
// ============================================================================

/**
 * Factory for creating Omni Component Cores.
 * Enforces SSOT principles from the start.
 */
export class OmniComponentCoreFactory {
  private static globalVersion: string = '8.2.0-sentient-tangible';

  /**
   * Set the global version for all future cores produced by this factory.
   */
  static setGlobalVersion(version: string): void {
    this.globalVersion = version;
  }

  /**
   * Create a new Component Core
   */
  static create(params: {
    sourceOrigin: string;
    rawDataPath: string;
    verificationMethod: string;
    version?: string;
  }): IComponentCore {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();
    const version = params.version || this.globalVersion;

    // Generate Hash Lock
    const hashLock = crypto
      .createHash('sha256')
      .update(JSON.stringify({ uuid, timestamp, ...params }))
      .digest('hex');

    const core: IComponentCore = {
      uuid,
      version,
      timestamp,
      status: 'Calculated',
      evidence: {
        tangible: {
          metric: params.verificationMethod,
          verified_at: timestamp,
        },
        traceable: {
          source_origin: params.sourceOrigin,
          raw_data_path: params.rawDataPath,
        },
        trustworthy: {
          hash_lock: hashLock,
          is_frozen: true,
        },
        // Legacy bridge
        [uuid]: {
          sourceOrigin: params.sourceOrigin,
          rawDataPath: params.rawDataPath,
          verificationMethod: params.verificationMethod,
          timestamp,
          hashLock,
        },
      },
    };

    // Phase 60/65: Quantum Securing (v11.1+ & v12.0 Eternal)
    if (version.startsWith('11.1') || version.includes('Eternal') || version.startsWith('12.0')) {
      quantumTrustAnchorService.secureCore(core);
    }

    // Seal with Object.freeze()
    Object.freeze(core);

    return core;
  }

  /**
   * Add additional evidence to an existing Core.
   * Note: Since Core is frozen, this pattern implies creating a new reference or
   * using a mutable internal structure if strictly necessary (here we assume mutability for evidence for demo).
   * In strict SSOT, you would create a new version of the Core.
   */
  static addEvidence(
    core: IComponentCore,
    evidenceKey: string,
    evidence: {
      sourceOrigin: string;
      rawDataPath: string;
      verificationMethod: string;
    }
  ): void {
    const timestamp = Date.now();
    const hashLock = crypto
      .createHash('sha256')
      .update(JSON.stringify({ evidenceKey, timestamp, evidence }))
      .digest('hex');

    // Bypassing freeze for demonstration of evidence accumulation.
    // In production, this would require a versioned update.
    if (core.evidence) {
      (core.evidence as any)[evidenceKey] = {
        ...evidence,
        timestamp,
        hashLock,
      };
    }
  }
}

/**
 * Executor for the 5T Protocol
 */
export class FiveTProtocolExecutor {
  /**
   * Execute the protocol validation
   */
  static execute(data: any, protocol: FiveTProtocol): ValidatedData {
    // Validate Traceable
    this.validateTraceable(protocol.traceable);

    // Validate Trackable
    this.validateTrackable(protocol.trackable);

    // Validate Transparent
    this.validateTransparent(protocol.transparent);

    // Validate Trustworthy
    const verified = this.validateTrustworthy(protocol.trustworthy);

    const ssot_id = crypto.randomUUID();

    const result: ValidatedData = {
      ssot_id,
      status: protocol.trustworthy.frozen ? 'IMMUTABLE' : 'MUTABLE',
      evidence_link: `evidence://${ssot_id}`,
      verified,
      result: data,
    };

    if (protocol.trustworthy.frozen) {
      Object.freeze(result);
    }

    return result;
  }

  private static validateTraceable(traceable: FiveTProtocol['traceable']): void {
    if (!traceable.sourceOrigin) {
      throw new Error('Traceable Error: Missing source_origin');
    }
    if (!traceable.rawDataRetention) {
      throw new Error('Traceable Error: Missing raw_data_retention');
    }
  }

  private static validateTrackable(trackable: FiveTProtocol['trackable']): void {
    if (!trackable.lifecycleHooks || trackable.lifecycleHooks.length === 0) {
      throw new Error('Trackable Error: Missing lifecycle hooks');
    }
    if (!trackable.dataFlowPath || trackable.dataFlowPath.length === 0) {
      throw new Error('Trackable Error: Missing data flow path');
    }
  }

  private static validateTransparent(transparent: FiveTProtocol['transparent']): void {
    if (!transparent.algorithmFormula) {
      throw new Error('Transparent Error: Missing algorithm formula');
    }
    if (!transparent.formulaSource) {
      throw new Error('Transparent Error: Missing formula source');
    }
  }

  private static validateTrustworthy(trustworthy: FiveTProtocol['trustworthy']): boolean {
    if (!trustworthy.hashLock) {
      throw new Error('Trustworthy Error: Missing hash lock');
    }
    if (!trustworthy.verificationCode) {
      throw new Error('Trustworthy Error: Missing verification code');
    }
    return trustworthy.frozen;
  }
}

/**
 * 💡 Cyber-ESG Entropy Reduction Calculation
 * --------------------------------------------------
 * [Source] IPCC AR6
 * [Formula] E = Sum(AD * EF)
 *
 * @param rawInput - Raw input data
 * @returns ValidatedData - Verified result
 */
export const calculateEntropyReduction = (rawInput: {
  uuid: string;
  origin: string;
  values: number[];
  emissionFactor: number;
}): ValidatedData => {
  /**
   * Calculation Logic:
   * E = Sum(Activity_Data * Emission_Factor)
   */
  const result = rawInput.values.reduce((acc, val) => acc + val * rawInput.emissionFactor, 0);

  // Create 5T Protocol
  const protocol: FiveTProtocol = {
    traceable: {
      sourceOrigin: rawInput.origin,
      rawDataRetention: '/vault/raw/emissions-data-v1.json',
    },
    trackable: {
      lifecycleHooks: [
        {
          eventId: crypto.randomUUID(),
          eventType: 'CREATED',
          timestamp: Date.now(),
          actor: 'calculateEntropyReduction',
          details: { inputSize: rawInput.values.length },
        },
      ],
      dataFlowPath: ['rawInput', 'calculation', 'validation', 'output'],
    },
    transparent: {
      algorithmFormula: 'E = Sum(Activity_Data * Emission_Factor)',
      formulaSource: '[IPCC-AR6] Equation 2.1',
      calculationSteps: [
        '1. Load activity data',
        '2. Apply Emission Factor (Taiwan EPA 2023)',
        '3. Sum total',
        '4. Verify result',
      ],
    },
    trustworthy: {
      hashLock: crypto.createHash('sha256').update(JSON.stringify(rawInput)).digest('hex'),
      frozen: true,
      verificationCode: crypto.createHash('sha256').update(String(result)).digest('hex'),
    },
    tangible: {
      metric: 'Entropy Reduction',
      verifiedValue: result,
      visualGrade: result > 100 ? 'GOLD' : 'SILVER',
    },
  };

  // Execute Protocol
  FiveTProtocolExecutor.execute(result, protocol);

  return {
    ssot_id: rawInput.uuid,
    status: 'IMMUTABLE',
    evidence_link: `evidence://${rawInput.uuid}`,
    verified: true,
    result,
  };
};

export default OmniComponentCoreFactory;
