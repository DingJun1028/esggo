import { IComponentCore, ApiResponse } from '@/types/core';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { evidencePersistence } from './EvidencePersistence';

/**
 * 🏛️ Evidence Vault Service (佐證庫服務)
 * --------------------------------------------------
 * [功能] 負責存儲經過 5T 驗證的數位資產
 * [特性] 模擬區塊鏈存證，生成交易雜湊
 */
export class EvidenceVaultService {
  private static instance: EvidenceVaultService;

  private constructor() { }

  public static getInstance(): EvidenceVaultService {
    if (!EvidenceVaultService.instance) {
      EvidenceVaultService.instance = new EvidenceVaultService();
    }
    return EvidenceVaultService.instance;
  }

  /**
   * 保存驗證通過的資產
   */
  public async save(asset: IComponentCore): Promise<ApiResponse<string>> {
    try {
      // 檢查是否已存在 (透過 Persistence 層)
      const existing = await evidencePersistence.get(asset.uuid);
      if (existing) {
        omniLogger.warn(LogCategory.SYSTEM, '[EvidenceVault] 資產已存在', { uuid: asset.uuid });
        return {
          success: false,
          message: 'Asset already exists in vault',
          error: 'DUPLICATE_ASSET',
        };
      }

      // 存入"庫" (Supabase/DB)
      await evidencePersistence.save(asset);

      omniLogger.info(LogCategory.SYSTEM, '[EvidenceVault] 資產已封存', {
        uuid: asset.uuid,
        hash: asset.evidence.hash_lock,
      });

      return {
        success: true,
        data: asset.evidence.hash_lock ?? '',
        message: 'Asset secured in Evidence Vault',
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[EvidenceVault] 存儲失敗', error);
      return {
        success: false,
        message: 'Failed to secure asset in Evidence Vault',
        error: 'STORAGE_ERROR',
      };
    }
  }

  /**
   * 獲取資產
   */
  public async getAsset(uuid: string): Promise<IComponentCore | undefined> {
    return evidencePersistence.get(uuid);
  }

  /**
   * 獲取所有已存證資產
   */
  public async getAllAssets(): Promise<IComponentCore[]> {
    return evidencePersistence.getAll();
  }
}

export const evidenceVault = EvidenceVaultService.getInstance();

