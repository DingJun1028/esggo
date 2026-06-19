import { IComponentCore, ApiResponse } from '@/types/core.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

/**
 * 🏛️ Evidence Vault Service
 * --------------------------------------------------
 * [Function] Responsible for storing digital assets validated by the 5T protocol.
 * [Features] Simulates blockchain evidence storage, generates transaction hashes.
 */
export class EvidenceVaultService {
  private static instance: EvidenceVaultService;
  private vault: Map<string, IComponentCore> = new Map();

  private constructor() {}

  public static getInstance(): EvidenceVaultService {
    if (!EvidenceVaultService.instance) {
      EvidenceVaultService.instance = new EvidenceVaultService();
    }
    return EvidenceVaultService.instance;
  }

  /**
   * Save a validated asset
   */
  public async save(asset: IComponentCore): Promise<ApiResponse<string>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (this.vault.has(asset.uuid)) {
      omniLogger.warn(LogCategory.SYSTEM, '[EvidenceVault] Asset already exists', {
        uuid: asset.uuid,
      });
      return {
        success: false,
        message: 'Asset already exists in vault',
        error: 'DUPLICATE_ASSET',
      };
    }

    // Store in vault
    this.vault.set(asset.uuid, asset);

    omniLogger.info(LogCategory.SYSTEM, '[EvidenceVault] Asset archived', {
      uuid: asset.uuid,
      hash: asset.evidence.hash_lock,
    });

    return {
      success: true,
      data: asset.evidence.hash_lock,
      message: 'Asset secured in Evidence Vault',
    };
  }

  /**
   * Retrieve an asset
   */
  public getAsset(uuid: string): IComponentCore | undefined {
    return this.vault.get(uuid);
  }

  /**
   * Retrieve all archived assets
   */
  public getAllAssets(): IComponentCore[] {
    return Array.from(this.vault.values());
  }
}

export const evidenceVault = EvidenceVaultService.getInstance();
