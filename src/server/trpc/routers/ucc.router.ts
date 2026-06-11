/**
 * UCC tRPC Router
 * 定義萬能元件心核的 API 介面
 */

import { router, publicProcedure } from '../trpc';
import { CreateUCCDTOSchema } from '@/src/shared/types';
import { uccService } from '../../services/ucc.service';

export const uccRouter = router({
  /**
   * 封裝為 UCC 包
   */
  package: publicProcedure
    .input(CreateUCCDTOSchema)
    .mutation(async ({ input }) => {
      return uccService.packageEvidence(input);
    }),
});
