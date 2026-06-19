/**
 * ESGss Final Fusion - Core Schema Definitions
 *
 * Implements the "Entropy Reduction" philosophy and "4+1 Protocol".
 * Source of Truth: Data_Dictionary_Omni.md
 */

// ==========================================
// 1. Source Taxonomy (The "S-Series")
// ==========================================

export enum SourceTaxonomy {
  /** Primary: Direct sensor/IoT data (Highest Confidence: 99.9%) */
  S1_PRIMARY_SENSOR = 'S1',
  /** System: Internal System Generated (Confidence: 95.0%) */
  S2_SYSTEM_LOG = 'S2',
  /** Verified: Third-party audited reports (Confidence: 90.0%) */
  S3_VERIFIED_AUDIT = 'S3',
  /** Reported: Self-Reported Structured Data (Confidence: 75.0%) */
  S4_SELF_REPORTED = 'S4',
  /** Inferred: NLP-extracted or AI predicted (Confidence: 60.0%) */
  S5_INFERRED_AI = 'S5',
}

// ==========================================
// 2. The Atomic Unit (IComponentCore) - 5T Protocol
// ==========================================

import {
  IComponentCore,
  IEvidenceMap,
  IMeritProfile10,
} from '../0-domain/contracts/IComponentCore.js';
export type { IComponentCore, IEvidenceMap, IMeritProfile10 };

export interface LifecycleHook {
  event: 'created' | 'updated' | 'validated' | 'frozen' | 'anchored' | 'locked' | 'sealed' | 'synced';
  timestamp: number;
  actor: string;
  metadata?: Record<string, unknown>;
}

// ==========================================
// 3. Impact Ledger (The "Good" Accounting)
// ==========================================

export interface IImpactLedger {
  /** Unique Ledger Entry ID */
  ledgerId: string;

  /**
   * Chain of Custody: Direct map to IComponentCore.uuid.
   * Use this to trace back to the source evidence.
   */
  componentUuid: string;

  /** Link to the specific Project or Mission */
  projectId: string;

  /** Social Return on Investment Value */
  sroiValue: number;

  /**
   * GHG Reduction in tCO2e.
   * Positive = Emission, Negative = Removal/Reduction
   */
  carbonDelta: number;

  /** Timestamp of the impact event */
  postedAt: number;

  /** Status of the audit/verification process */
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

// ==========================================
// 4. Talent Passport (The "Soul" Record)
// ==========================================

export interface ITalentPassport {
  /** Link to the System User ID */
  userUuid: string;

  /** Display Name */
  alias: string;

  /**
   * The Radar Chart Data.
   * Normalized 0-100 proficiency scores across 5 axes.
   */
  skillsRadar: {
    strategic: number;
    execution: number;
    innovation: number;
    compliance: number;
    leadership: number;
  };

  /** List of Ledger IDs contributed by this talent */
  impactHistory: string[];

  /**
   * Calculated Integrity Score (0.0 - 1.0).
   * Based on the weighted average of SourceTaxonomy of contributions.
   */
  integrityScore: number;
}

// ==========================================
// 5. The 5T Protocol Logic Gate
// ==========================================

/**
 * 💡 Core Calculation: 5T Protocol Validation
 * --------------------------------------------------
 * [Source Note] Omni Component Core v2.0
 * [Verification Mode] Trustworthy Hash Lock
 *
 * Verifies if a component meets the standard of "Truth".
 */
export function validateCoreIntegrity(data: IComponentCore): boolean {
  const isCalculable = typeof data.evidence !== 'undefined' && data.evidence !== null;

  // Note: In a real runtime, Object.isFrozen() checks strict immutability (Trustworthiness base).
  // Ideally, data comes from a frozen store or is frozen upon retrieval.
  const isTrustworthy = Object.isFrozen(data);

  // Intent is implied by the signer (contextual), here we check structural validity
  return Boolean(data.uuid && isCalculable && isTrustworthy);
}

// ==========================================
// 6. GTX Talent Asset (M3: Talent OS)
// ==========================================

export interface ITalentAsset {
  id: string; // e.g., #JUN-001
  name: string; // e.g., "Lead Architect"
  tags: string[]; // e.g., ["ESG Expert", "Lead Architect"]
  tvi: number; // Total Value Index (Wang Dao Score) e.g., 98.2
  carbonReduction: number; // Cumulative tCO2e contribution e.g., 1250.5
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED'; // e.g., Online Verified
  hash?: string; // Blockchain Anchor Hash
}

// ==========================================
// 7. InfoOne Lifecycle & Matrix (Phase 15/17)
// ==========================================

// ==========================================
// 7. InfoOne Lifecycle & Matrix (Phase 15/17)
// ==========================================

export type InfoOneLifecycleStatus =
  | 'DORMANT'
  | 'INITIALIZING'
  | 'ACTIVE'
  | 'OPTIMIZING'
  | 'TERMINATING'
  | 'SEALED'
  | 'Trustworthy'; // Added Trustworthy to support transitional state check

export interface IActivationMatrix {
  status: InfoOneLifecycleStatus;
  activationTime?: number;
  lastPulse?: number;
  terminationTime?: number;
  syncId?: string;

  // Missing properties fixed
  lastTransition?: number;
  activationCount?: number;
  uptime?: number; // Added uptime
  syncState?: {
    lastSync: number;
    target: string;
    latency: number;
  };
}

export interface ArenaSyncPayload {
  matrixStatus?: InfoOneLifecycleStatus; // Made optional to fit loose shape
  coreUuid?: string;
  action?: string; // Added to fit usage
  componentId?: string; // Added to fit usage
  vfx?: any; // Simplified for loose coupling
  state?: any; // Added to fit usage
  attributes?: any; // Added to fit usage
  timestamp: number;
}

import { PersonalSettings } from './omni/index.js';

// Phase 18: Omni-Crystal Definition
export interface IOmniCrystal {
  id: string; // Unique Crystal ID
  hash: string; // SHA-256 Anchor Hash
  purity: number; // 0.0 - 1.0 (based on Truth Verification)
  formationTime: number;
  generation: number; // Crystal Generation count
  ownerUuid: string;
  personalSettings?: PersonalSettings;
}

// Alias for compatibility
export type ISourceTaxonomy = SourceTaxonomy;
export type { PersonalSettings };
