/**
 * Evidence tRPC Router
 * 端到端型別安全的 API 實作
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { evidenceService } from '../../services/evidence.service';
import { CreateEvidenceDTOSchema, EvidenceQueryParamsSchema } from '@/src/shared/types';
export const evidenceRouter = router({
    // 1. 查詢證據
    list: publicProcedure
        .input(EvidenceQueryParamsSchema)
        .query(async ({ input }) => {
        // 這裡 userId 應從 context 取得，input 僅作過濾
        return evidenceService.getUserEvidences(input.user_id);
    }),
    // 2. 創建證據
    create: publicProcedure // 暫時使用 public，未來改 protected
        .input(CreateEvidenceDTOSchema)
        .mutation(async ({ input }) => {
        const mockUserId = 'user_01';
        return evidenceService.createEvidence(mockUserId, input);
    }),
    // 3. 執行校驗 (T4)
    verify: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
        return evidenceService.verifyIntegrity(input.id);
    }),
});
//# sourceMappingURL=evidence.router.js.map