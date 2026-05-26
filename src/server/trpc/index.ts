import { router } from './trpc';
import { evidenceRouter } from './routers/evidence.router';
import { uccRouter } from './routers/ucc.router';
import { omnispaceRouter } from './routers/omnispace.router';

export const appRouter = router({
  evidence: evidenceRouter,
  ucc: uccRouter,
  omnispace: omnispaceRouter,
});

export type AppRouter = typeof appRouter;
