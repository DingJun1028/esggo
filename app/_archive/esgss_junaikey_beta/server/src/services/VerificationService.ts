import {
  IImpactAsset,
  ImpactProof,
  IEvidence,
  FiveTProtocol,
  MeridianFlow,
  IMeritProfile10,
} from '../types/core.js';

/**
 * VerificationService (5T Sentinel Protocol)
 * --------------------------------------------------
 * Handles the logic for verifying assets against the 4+1 (5T) Protocol.
 */
export class VerificationService {
  /**
   * Mock database or cache for demo purposes.
   * In production, this would fetch from MongoDB or Blockchain.
   */
  private static mockDatabase: Record<string, ImpactProof> = {};

  /**
   * Verifies an asset by its UUID.
   * If not found in DB, generates a reliable mock proof for demonstration.
   */
  public async verifyAsset(uuid: string): Promise<ImpactProof> {
    // 1. Try to find in mock DB
    if (VerificationService.mockDatabase[uuid]) {
      return VerificationService.mockDatabase[uuid];
    }

    // 2. If not found, generate a deterministic mock proof (for demo continuity)
    // This ensures that the same UUID always returns the same "random" data.
    return this.generateMockProof(uuid);
  }

  private generateMockProof(uuid: string): ImpactProof {
    const timestamp = Date.now();
    const seed = uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return {
      uuid: uuid,
      meridian: seed % 2 === 0 ? 'OUTWARD_DU' : ('INWARD_REN' as MeridianFlow),
      virtues: {
        intelligence: (seed % 3) + 7, // 7-9
        benevolence: ((seed + 1) % 3) + 7,
        integrity: 10, // Always 10 for verified assets
        courage: ((seed + 2) % 4) + 6,
        temperance: ((seed + 3) % 3) + 7,
        harmony: ((seed + 4) % 3) + 7,
      } as IMeritProfile10,
      evidence: {
        source_origin: `ESGss_Sentinel_Grid_${(seed % 5) + 1}`,
        lifecycle_hooks: [
          `TXN-${timestamp}-${uuid.substring(0, 4).toUpperCase()}`,
          'HOOK_CREATED',
          'HOOK_CRYSTALLIZED',
        ],
        logic_formula: 'Impact = (Virtues_Sum * 5T_Integrity) / Complexity_Factor',
        tangible_manifest: {
          is_crystallized: true,
          qr_link: `https://nexus.esg/v/${uuid}`,
          visual_grade: seed % 10 > 7 ? 'SOVEREIGN' : seed % 10 > 4 ? 'PLATINUM' : 'GOLD',
        },
        hash_lock: this.generateHashLock(uuid, timestamp),
      },
      verified_at: timestamp,
    };
  }

  private generateHashLock(uuid: string, timestamp: number): string {
    // Simple mock hash generation
    return `hash_${uuid}_${timestamp}_${Math.random().toString(36).substring(7)}`;
  }
}
