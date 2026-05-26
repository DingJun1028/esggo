import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { globalHealingService } from '../../healing/GlobalHealingServer';
import { OmniCardSchema } from '../../../../types/omni-card';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const omnispaceRouter = router({
  // 1. 取得指定卡牌的真理狀態 (Truth State)
  getTruthState: publicProcedure
    .input(z.object({ uuid: z.string().uuid() }))
    .query(async ({ input }) => {
      const eventStore = globalHealingService.getEventStore();
      const truthState = eventStore.rebuildTruthState(input.uuid);
      return truthState;
    }),

  // 2. 觸發 GlobalHealing 進行卡牌狀態調和
  healCard: publicProcedure
    .input(OmniCardSchema)
    .mutation(async ({ input }) => {
      // 呼叫調和引擎進行處理
      const result = await globalHealingService.healCard(input, 'LV2_AUTO_HEAL');
      return result;
    }),

  // 3. 呼叫底層 CLI 進行 ZKP 封印
  sealDocument: publicProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { stdout, stderr } = await execAsync(`node cli/omni.mjs vault seal ${input.documentId}`);
        return { success: true, stdout, stderr };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }),
});
