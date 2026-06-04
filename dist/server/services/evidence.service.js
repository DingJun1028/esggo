"use strict";
/**
 * Evidence Service
 * 業務邏輯層 - 協調 Repository 與 Integrity 服務
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceService = exports.EvidenceService = void 0;
const evidence_repository_1 = require("../repositories/evidence.repository");
const integrity_service_1 = require("./integrity.service");
const evidence_types_1 = require("../../shared/types/evidence.types");
const api_types_1 = require("../../shared/types/api.types");
class EvidenceService {
    constructor() {
        this.repo = new evidence_repository_1.EvidenceRepository();
    }
    /**
     * 創建並自動封印證據
     */
    async createEvidence(userId, dto) {
        // 1. 基礎驗證可以在這裡或 tRPC Middleware 執行 (Zod)
        // 2. 核心業務：如果 auto_seal 為 true，預先計算雜湊
        if (dto.auto_seal) {
            const { hash } = await integrity_service_1.integrityService.sealContent(dto.content);
            // Repository 會自動處理 hash，這裡可做額外邏輯
        }
        return this.repo.create(userId, dto);
    }
    /**
     * 執行證據完整性校驗
     */
    async verifyIntegrity(id) {
        const evidence = await this.repo.findById(id);
        if (!evidence) {
            throw new Error(api_types_1.ErrorCode.EVIDENCE_NOT_FOUND);
        }
        const result = await integrity_service_1.integrityService.verifyEvidence(evidence);
        // 如果發現被篡改，更新資料庫狀態
        if (!result.is_valid) {
            await this.repo.update(id, { status: evidence_types_1.EvidenceStatus.ARCHIVED }); // 示例：標記異常
        }
        return result;
    }
    /**
     * 獲取使用者證據清單
     */
    async getUserEvidences(userId) {
        return this.repo.findMany({ user_id: userId });
    }
}
exports.EvidenceService = EvidenceService;
exports.evidenceService = new EvidenceService();
//# sourceMappingURL=evidence.service.js.map