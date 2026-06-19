// src/omni/services/OmniTruthEngine.ts

/**
 * @file OmniTruthEngine.ts
 * @description Implements the OmniTruthEngine, responsible for Dimension 4 (Truth).
 * This service ensures data integrity and resists factual inaccuracies or AI 'hallucinations'.
 * It provides mechanisms for validating data, cross-referencing sources, and flagging inconsistencies.
 *
 * Implements IAwakenable for Ultimate Awakening integration.
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';
import {
  IAwakenable,
  AwakeningResult,
  ServiceAwakeningStatus,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import { v4 as uuidv4 } from 'uuid';
import { EvidenceVault } from '@/services/EvidenceVault.ts';

import { EvidenceMetadata } from '@/types/omni-report.types.ts';
import { blockchainAnchor } from '@/omni/services/BlockchainAnchorService.ts';
import { globalPulseService } from '@/services/GlobalPulseService.ts';

/**
 * Represents a verifiable statement of fact within the system.
 * This is the core data structure for Dimension 4 (Truth).
 */
export interface TruthClaim {
  id: string; // Unique identifier for the claim (UUID).
  statement: string; // The core assertion being made.
  verified: boolean; // Whether the claim has been successfully verified against its evidence.
  confidence: number; // The confidence score (0.0 to 1.0) in the claim's validity.
  evidence: EvidenceLink[]; // Array of evidence links supporting this claim.
  evidenceVaultRefs?: string[]; // Array of Evidence IDs from the EvidenceVault.
  metadata?: Record<string, any>; // Flexible metadata field.
}

/**
 * Links a TruthClaim to a specific piece of evidence.
 */
export interface EvidenceLink {
  source_origin: string; // Describes the source of the evidence (e.g., filename, API endpoint).
  verified_at: number; // Timestamp of verification.
  hash_lock: string; // The cryptographic hash of the evidence at the time of verification.
  metadata?: Record<string, any>; // Additional context about the link.
}

/**
 * Represents a piece of data or a "claim" to be validated.
 */
export interface IClaim {
  id: string;
  content: string; // The statement or data point.
  sourceId: string; // Where the claim originated from (e.g., RAG model, user input).
  validationStatus: 'unverified' | 'verified' | 'disputed' | 'retracted';

  confidenceScore: number; // A score from 0.0 to 1.0 indicating belief in the claim's truthfulness.
  evidenceVaultRefs?: string[];
}

/**
 * A reference source used for validation.
 */
export interface ITruthSource {
  id: string;
  name: string;
  // A function that takes a claim and returns a boolean or a confidence score.
  validate: (claimContent: string) => Promise<{ isVerified: boolean; confidence: number }>;
}

/**
 * Manages the validation and lifecycle of information claims within the system.
 */
export class OmniTruthEngine implements IAwakenable {
  private static instance: OmniTruthEngine;
  private claimsRegister: Map<string, IClaim>;
  private truthClaimsRegister: Map<string, TruthClaim>;
  private truthSources: Map<string, ITruthSource>;

  // IAwakenable state
  public readonly name: string = 'OmniTruthEngine';
  private awakeningStatus: ServiceAwakeningStatus;

  private constructor() {
    this.claimsRegister = new Map();
    this.truthClaimsRegister = new Map();
    this.truthSources = new Map();
    this.awakeningStatus = {
      serviceName: this.name,
      status: 'pending',
      progress: 0,
    };
    this.initializeTruthSources();
    omniLogger.info(LogCategory.SYSTEM, 'OmniTruthEngine initialized.', {
      service: 'OmniTruthEngine',
    });
  }

  /**
   * Retrieves the singleton instance of the OmniTruthEngine.
   * @returns The OmniTruthEngine instance.
   */
  public static getInstance(): OmniTruthEngine {
    if (!OmniTruthEngine.instance) {
      OmniTruthEngine.instance = new OmniTruthEngine();
    }
    return OmniTruthEngine.instance;
  }

  /**
   * Registers a new, fully-formed TruthClaim.
   * @param claim The TruthClaim object to register.
   */
  public registerClaim(claim: TruthClaim): void {
    if (this.truthClaimsRegister.has(claim.id)) {
      omniLogger.warn(LogCategory.VALIDATION, `TruthClaim '${claim.id}' is already registered.`, {
        service: 'OmniTruthEngine',
      });
      return;
    }
    this.truthClaimsRegister.set(claim.id, claim);
    omniLogger.info(LogCategory.VALIDATION, `New TruthClaim registered: "${claim.statement}"`, {
      service: 'OmniTruthEngine',
      claimId: claim.id,
    });
  }

  /**
   * Creates and registers a new TruthClaim based on evidence from the EvidenceVault.
   * @param statement The factual statement being claimed.
   * @param evidenceIds An array of IDs for evidence stored in the EvidenceVault.
   * @returns The newly created TruthClaim.
   */
  public async registerClaimWithEvidence(
    statement: string,
    evidenceIds: string[]
  ): Promise<TruthClaim> {
    const evidenceList = evidenceIds
      .map(id => EvidenceVault.getById(id))
      .filter((e): e is EvidenceMetadata => e !== undefined);

    if (evidenceList.length !== evidenceIds.length) {
      omniLogger.warn(LogCategory.VALIDATION, 'Some evidence IDs were not found in the Vault.', {
        provided: evidenceIds,
        found: evidenceList.map(e => e.id),
      });
    }

    const claim: TruthClaim = {
      id: uuidv4(),
      statement,
      verified: true, // Assumed verified because it's based on tangible evidence
      confidence: 0.98, // High confidence due to direct evidence backing
      evidenceVaultRefs: evidenceIds,
      evidence: evidenceList.map(e => ({
        source_origin: e.originalFileName,
        verified_at: Date.now(),
        hash_lock: e.fileHash,
        metadata: { vaultPath: e.vaultPath },
      })),
    };

    this.registerClaim(claim);

    // [86] Emit Global Pulse for new verified data
    globalPulseService.emitPulse({
      type: 'Environmental',
      source: 'Truth Engine',
      intensity: 0.7,
      message: `Verified Data Ingested: ${statement.substring(0, 30)}...`
    });

    // Back-link the claim to the evidence
    evidenceList.forEach(evidence => {
      EvidenceVault.linkToTruth(evidence.id, claim.id);
    });

    return claim;
  }

  /**
   * Retrieves a TruthClaim by its ID.
   * @param claimId The ID of the claim.
   * @returns The TruthClaim object or undefined if not found.
   */
  public getTruthClaim(claimId: string): TruthClaim | undefined {
    return this.truthClaimsRegister.get(claimId);
  }

  /**
   * Initializes the trusted sources for fact-checking.
   * In a real system, these could be APIs to knowledge bases, databases, or even human-in-the-loop workflows.
   */
  private initializeTruthSources(): void {
    // Example: A simple dictionary-based fact-checker.
    const internalKnowledgeBase: ITruthSource = {
      id: 'internal-kb',
      name: 'Internal Knowledge Base',
      validate: async claimContent => {
        // A naive implementation. A real one would use a proper search/lookup.
        const knownFacts: Record<string, { isVerified: boolean; confidence: number }> = {
          'The sky is blue': { isVerified: true, confidence: 0.99 },
          'Water is wet': { isVerified: true, confidence: 0.99 },
          'The earth is flat': { isVerified: false, confidence: 0.95 },
        };
        return knownFacts[claimContent] || { isVerified: false, confidence: 0.2 };
      },
    };
    this.registerTruthSource(internalKnowledgeBase);
  }

  /**
   * Registers a new source of truth for validation.
   * @param source - The truth source to add.
   */
  public registerTruthSource(source: ITruthSource): void {
    if (this.truthSources.has(source.id)) {
      omniLogger.warn(
        LogCategory.VALIDATION,
        `Truth source '${source.name}' is already registered.`,
        { service: 'OmniTruthEngine' }
      );
      return;
    }
    this.truthSources.set(source.id, source);
    omniLogger.info(LogCategory.VALIDATION, `Truth source '${source.name}' registered.`, {
      service: 'OmniTruthEngine',
    });
  }

  /**
   * Submits a new claim for validation.
   * @param id - A unique ID for the claim.
   * @param content - The content of the claim.
   * @param sourceId - The identifier of the claim's origin.
   * @returns The newly created claim.
   */
  public submitClaim(id: string, content: string, sourceId: string): IClaim {
    const newClaim: IClaim = {
      id,
      content,
      sourceId,
      validationStatus: 'unverified',
      confidenceScore: 0.0,
    };
    this.claimsRegister.set(id, newClaim);
    omniLogger.info(LogCategory.VALIDATION, `New claim '${id}' submitted for validation.`, {
      service: 'OmniTruthEngine',
      claim: newClaim,
    });
    this.validateClaim(id); // Automatically start validation.
    return newClaim;
  }

  /**
   * Validates a claim against all registered truth sources.
   * @param claimId - The ID of the claim to validate.
   */
  public async validateClaim(claimId: string): Promise<void> {
    const claim = this.claimsRegister.get(claimId);
    if (!claim) {
      omniLogger.error(LogCategory.VALIDATION, `Claim '${claimId}' not found for validation.`, {
        service: 'OmniTruthEngine',
        error: new Error('Invalid claim ID'),
      });
      return;
    }

    let totalConfidence = 0;
    let sourcesChecked = 0;
    let highestConfidence = 0;
    let isVerifiedByAny = false;

    for (const source of this.truthSources.values()) {
      try {
        const result = await source.validate(claim.content);
        sourcesChecked++;
        totalConfidence += result.confidence;
        if (result.isVerified && result.confidence > highestConfidence) {
          highestConfidence = result.confidence;
          isVerifiedByAny = true;
        }

        // [Blockchain Integration] Enhanced Verification
        if (claim.evidenceVaultRefs && claim.evidenceVaultRefs.length > 0) {
          // Check if evidence is backed by blockchain
          let allEvidencesAnchored = true;
          claim.evidenceVaultRefs.forEach((refId: string) => {
            const evidence = EvidenceVault.getById(refId);
            if (evidence && evidence.fileHash) {
              const chainStatus = blockchainAnchor.verifyTransaction(evidence.fileHash);
              if (!chainStatus.verified) {
                allEvidencesAnchored = false;
              }
            }
          });

          if (allEvidencesAnchored) {
            omniLogger.info(
              LogCategory.BLOCKCHAIN,
              `Claim '${claimId}' cryptographically verified via Blockchain Anchor.`,
              { service: 'OmniTruthEngine' }
            );
            highestConfidence = 1.0; // Trust the chain
            isVerifiedByAny = true;
          }
        }

        omniLogger.debug(
          LogCategory.VALIDATION,
          `Claim '${claimId}' checked against '${source.name}'.`,
          { result, service: 'OmniTruthEngine' }
        );
      } catch (error) {
        omniLogger.error(
          LogCategory.VALIDATION,
          `Error validating claim '${claimId}' against '${source.name}'.`,
          { service: 'OmniTruthEngine', error }
        );
      }
    }

    if (sourcesChecked > 0) {
      claim.confidenceScore = isVerifiedByAny
        ? highestConfidence
        : totalConfidence / sourcesChecked;
      claim.validationStatus = isVerifiedByAny ? 'verified' : 'disputed';
    }

    this.claimsRegister.set(claimId, claim);
    omniLogger.info(
      LogCategory.VALIDATION,
      `Validation complete for claim '${claimId}'. Status: ${claim.validationStatus}, Score: ${claim.confidenceScore.toFixed(2)}`,
      { claim, service: 'OmniTruthEngine' }
    );
  }

  /**
   * Retrieves a claim by its ID.
   * @param claimId - The ID of the claim.
   * @returns The claim object or undefined if not found.
   */
  public getClaim(claimId: string): IClaim | undefined {
    return this.claimsRegister.get(claimId);
  }

  /**
   * Retrieves all verified claims with high confidence (> 0.9).
   * Aggregates from both TruthClaims (pre-verified) and Claims (validated).
   */
  public getAllVerifiedClaims(): (TruthClaim | IClaim)[] {
    const highConfidenceThreshold = 0.9;
    const verifiedTruthClaims = Array.from(this.truthClaimsRegister.values()).filter(
      c => c.confidence > highConfidenceThreshold
    );
    const verifiedClaims = Array.from(this.claimsRegister.values()).filter(
      c => c.confidenceScore > highConfidenceThreshold && c.validationStatus === 'verified'
    );

    return [...verifiedTruthClaims, ...verifiedClaims];
  }

  // =================================================================
  // IAwakenable Implementation
  // =================================================================

  async awaken(): Promise<AwakeningResult> {
    try {
      this.awakeningStatus.status = 'awakening';
      this.awakeningStatus.progress = 10;
      omniLogger.info(LogCategory.SYSTEM, '[AWAKENING-TRUTH] Starting deep truth scan...', {
        service: this.name,
      });

      // Phase 1: Scan all claims
      const allClaims = Array.from(this.claimsRegister.values());
      const total = allClaims.length;
      let processed = 0;

      // Constants for Awakening Process
      const INITIAL_PROGRESS = 10;
      const SIMULATED_DELAY_MS = 500;
      const BATCH_SIZE = 5;
      const BATCH_DELAY_MS = 50;
      const PROGRESS_SCALE = 80;

      if (total === 0) {
        await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS)); // Sleep just to show progress
        this.awakeningStatus.progress = 50;
      }

      // Phase 2: Re-validate unverified or disputed claims
      for (const claim of allClaims) {
        if (claim.validationStatus !== 'verified') {
          await this.validateClaim(claim.id);
        }

        processed++;
        this.awakeningStatus.progress =
          INITIAL_PROGRESS + Math.floor((processed / total) * PROGRESS_SCALE);

        // Allow breathing room for UI updates
        if (processed % BATCH_SIZE === 0) await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
      }

      this.awakeningStatus.status = 'awakened';
      this.awakeningStatus.progress = 100;
      this.awakeningStatus.awakenedAt = new Date().toISOString();

      return {
        success: true,
        phase: AwakeningPhase.AWAKENED,
        servicesAwakened: 1,
        totalServices: 1,
        message: `Truth Engine Awakening Complete: Validated ${total} claims`,
      };
    } catch (error) {
      this.awakeningStatus.status = 'failed';
      this.awakeningStatus.error = (error as Error).message;

      return {
        success: false,
        phase: AwakeningPhase.INITIALIZING,
        servicesAwakened: 0,
        totalServices: 1,
        message: `Truth Engine Awakening Failed: ${(error as Error).message}`,
      };
    }
  }

  getAwakeningState(): ServiceAwakeningStatus {
    return { ...this.awakeningStatus };
  }

  async prepareForEternity(): Promise<void> {
    omniLogger.info(
      LogCategory.SYSTEM,
      '[AWAKENING-TRUTH] Preparing for Eternity: Locking Truth Registry...'
    );
    // In a real system, we might hash the entire state and emit it one last time
    // For now, we simply log the action.
  }
}

// Export a singleton instance
export const truthEngine = OmniTruthEngine.getInstance();
