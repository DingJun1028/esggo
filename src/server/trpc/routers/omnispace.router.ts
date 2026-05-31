/**
 * OmniSpace tRPC Router
 * 定義萬能空間核心 API：真理狀態查詢、卡牌自癒調和、ZKP 封印作業
 */

import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { OmniCardSchema } from '@/src/shared/types';
import { omniSpaceService } from '../../services/omnispace.service';

export const omnispaceRouter = router({
  // 1. 取得指定卡牌的真理狀態 (Truth State)
  getTruthState: publicProcedure
    .input(z.object({ uuid: z.string().uuid() }))
    .query(async ({ input }) => {
      return omniSpaceService.getTruthState(input.uuid);
    }),

  // 2. 觸發 GlobalHealing 進行卡牌狀態調和
  healCard: publicProcedure
    .input(OmniCardSchema)
    .mutation(async ({ input }) => {
      return omniSpaceService.healCard(input);
    }),

  // 3. 呼叫底層 CLI 進行 ZKP 封印
  sealDocument: publicProcedure
    .input(z.object({ documentId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return omniSpaceService.sealDocument(input.documentId);
    }),
});
