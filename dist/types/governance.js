import { z } from 'zod';
/**
 * 萬能回報格式 (Nexus API 統一回傳結構)
 */
export const NexusResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    metadata: z.object({
        timestamp: z.number(),
        trustScore: z.number().min(0).max(100), // 系統當前信任指數
        transactionId: z.string().uuid(),
    })
});
//# sourceMappingURL=governance.js.map