/**
 * Evidence Service
 * 業務邏輯層 - 協調 Repository 與 Integrity 服務
 */

import { EvidenceRepository } from '../repositories/evidence.repository';
import { integrityService } from './integrity.service';
import { 
  CreateEvidenceDTO, 
  Evidence, 
  EvidenceID, 
  UserID, 
  EvidenceStatus,
  VerificationResult
} from '../../shared/types/evidence.types';
import { ErrorCode, createErrorResponse } from '../../shared/types/api.types';

export class EvidenceService {
  private repo = new EvidenceRepository();

  /**
   * 創建並自動封印證據
   */
  async createEvidence(userId: UserID, dto: CreateEvidenceDTO): Promise<Evidence> {
    // 1. 基礎驗證可以在這裡或 tRPC Middleware 執行 (Zod)
    
    // 2. 核心業務：如果 auto_seal 為 true，預先計算雜湊
    if (dto.auto_seal) {
      const { hash } = await integrityService.sealContent(dto.content);
      // Repository 會自動處理 hash，這裡可做額外邏輯
    }

    const result = await this.repo.create(userId, dto);
    if (!result) throw new Error("Failed to create evidence");
    return result;
  }

  /**
   * 執行證據完整性校驗
   */
  async verifyIntegrity(id: EvidenceID): Promise<VerificationResult> {
    const evidence = await this.repo.findById(id);
    if (!evidence) {
      throw new Error(ErrorCode.EVIDENCE_NOT_FOUND);
    }

    const result = await integrityService.verifyEvidence(evidence);

    // 如果發現被篡改，更新資料庫狀態
    if (!result.is_valid) {
      await this.repo.update(id, { status: EvidenceStatus.ARCHIVED }); // 示例：標記異常
    }

    return result;
  }

  /**
   * 獲取使用者證據清單
   */
  async getUserEvidences(userId: UserID) {
    return this.repo.findMany({ user_id: userId });
  }
}

export const evidenceService = new EvidenceService();
