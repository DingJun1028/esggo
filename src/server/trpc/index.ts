import { router } from './trpc';
import { evidenceRouter } from './routers/evidence.router';
import { uccRouter } from './routers/ucc.router';

export const appRouter = router({
  evidence: evidenceRouter,
  ucc: uccRouter,
});

export type AppRouter = typeof appRouter;
