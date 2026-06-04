/**
 * tRPC Next.js API Handler
 * 為 Next.js App Router 提供端點
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/src/server/trpc';
import { createContext } from '@/src/server/trpc/context';
const handler = (req) => fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
});
export { handler as GET, handler as POST };
//# sourceMappingURL=route.js.map