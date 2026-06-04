/**
 * Evidence Repository
 * 資料存取層 - 處理所有與 Evidence 相關的資料庫操作
 */
import type { Evidence, EvidenceID, UserID, EvidenceQueryParams, PaginatedResult, CreateEvidenceDTO, UpdateEvidenceDTO } from '../../shared/types/evidence.types';
export declare class EvidenceRepository {
    /**
     * 創建證據
     */
    create(userId: UserID, data: CreateEvidenceDTO): Promise<Evidence | undefined>;
    /**
     * 根據 ID 查詢證據
     */
    findById(id: EvidenceID): Promise<Evidence | null>;
    /**
     * 查詢證據列表（支援分頁與篩選）
     */
    findMany(params: EvidenceQueryParams): Promise<PaginatedResult<Evidence>>;
    /**
     * 更新證據
     */
    update(id: EvidenceID, data: UpdateEvidenceDTO): Promise<Evidence | undefined>;
    /**
     * 映射資料庫行到 Evidence 型別
     */
    private mapToEvidence;
}
//# sourceMappingURL=evidence.repository.d.ts.map