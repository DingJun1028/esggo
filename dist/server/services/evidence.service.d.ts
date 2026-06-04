/**
 * Evidence Service
 * 業務邏輯層 - 協調 Repository 與 Integrity 服務
 */
import { CreateEvidenceDTO, Evidence, EvidenceID, UserID, VerificationResult } from '../../shared/types/evidence.types';
export declare class EvidenceService {
    private repo;
    /**
     * 創建並自動封印證據
     */
    createEvidence(userId: UserID, dto: CreateEvidenceDTO): Promise<Evidence>;
    /**
     * 執行證據完整性校驗
     */
    verifyIntegrity(id: EvidenceID): Promise<VerificationResult>;
    /**
     * 獲取使用者證據清單
     */
    getUserEvidences(userId: UserID): Promise<import("../../shared/types/evidence.types").PaginatedResult<Evidence>>;
}
export declare const evidenceService: EvidenceService;
//# sourceMappingURL=evidence.service.d.ts.map