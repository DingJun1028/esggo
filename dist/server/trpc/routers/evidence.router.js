"use strict";
/**
 * Evidence tRPC Router
 * 端到端型別安全的 API 實作
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const evidence_service_1 = require("../../services/evidence.service");
const types_1 = require("@/src/shared/types");
exports.evidenceRouter = (0, trpc_1.router)({
    // 1. 查詢證據
    list: trpc_1.publicProcedure
        .input(types_1.EvidenceQueryParamsSchema)
        .query(async ({ input }) => {
        // 這裡 userId 應從 context 取得，input 僅作過濾
        return evidence_service_1.evidenceService.getUserEvidences(input.user_id);
    }),
    // 2. 創建證據
    create: trpc_1.publicProcedure // 暫時使用 public，未來改 protected
        .input(types_1.CreateEvidenceDTOSchema)
        .mutation(async ({ input }) => {
        const mockUserId = 'user_01';
        return evidence_service_1.evidenceService.createEvidence(mockUserId, input);
    }),
    // 3. 執行校驗 (T4)
    verify: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string().uuid() }))
        .mutation(async ({ input }) => {
        return evidence_service_1.evidenceService.verifyIntegrity(input.id);
    }),
});
//# sourceMappingURL=evidence.router.js.map