/**
 * Integrity Service
 * 核心 5T 完整性驗證服務 - 負責雜湊校驗、篡改檢測與誠信狀態維護
 */

import { 
  Evidence, 
  IntegrityStatus, 
  VerificationResult 
} from '../../shared/types/evidence.types';
import { computeSHA256 } from '../../shared/utils/hash.utils';
import { AuditAction, AuditSeverity } from '../../shared/types/audit.types';

export class IntegrityService {
  /**
   * 驗證證據內容完整性 (T1/T4)
   */
  async verifyEvidence(evidence: Evidence): Promise<VerificationResult> {
    const computedHash = await computeSHA256(evidence.content);
    const hashMatch = computedHash === evidence.content_hash;
    
    // 這裡未來可以擴充：檢查區塊鏈存證 (T5)
    const blockchainVerified = !!evidence.blockchain_tx; 
    
    let status: IntegrityStatus = IntegrityStatus.VALID;
    const tamperDetectedFields: string[] = [];

    if (!hashMatch) {
      status = IntegrityStatus.TAMPERED;
      tamperDetectedFields.push('content');
    }

    return {
      evidence_id: evidence.id,
      is_valid: hashMatch,
      integrity_status: status,
      content_hash_match: hashMatch,
      blockchain_verified: blockchainVerified,
      verified_at: new Date(),
      details: {
        stored_hash: evidence.content_hash,
        computed_hash: computedHash,
        blockchain_tx: evidence.blockchain_tx || undefined,
        tamper_detected_fields: tamperDetectedFields,
      }
    };
  }

  /**
   * 執行 5T 封印刻印 (Seal)
   * 鎖定數據並生成誠信憑證
   */
  async sealContent(content: string): Promise<{ hash: string; timestamp: Date }> {
    const hash = await computeSHA256(content);
    return { hash, timestamp: new Date() };
  }

  /**
   * 計算共鳴算力 Rs (Resonance)
   * 用於評估數據結晶的健康度與 5T 合規深度
   */
  calculateRs(verification: VerificationResult): number {
    const purity = verification.content_hash_match ? 1.0 : 0;
    const trust = verification.blockchain_verified ? 1.0 : 0.8;
    return (purity * trust) / 1.1; // 基礎熵值
  }

  /**
   * 平衡任督二脈能量流
   * Ren (Internal) <-> Du (External)
   */
  async balanceStreams(uuid: string): Promise<void> {
    console.log(`[OmniCore] Balancing Ren/Du streams for Crystal: ${uuid}`);
    // 實作：將即時執行日誌 (Du) 固化為長期記憶 (Ren)
  }
}

export const integrityService = new IntegrityService();
