"use strict";
/**
 * tRPC Client Bridge (OmniSync Bridge)
 * v2.0 | #ProperTRPC #EndToEndTypeSafety
 *
 * Establishing a proper bidirectional bridge between the frontend and backend.
 * Provides full type inference based on the AppRouter definition.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpc = void 0;
exports.getBaseUrl = getBaseUrl;
const react_query_1 = require("@trpc/react-query");
/**
 * tRPC React Hooks
 * Use these hooks in your components for type-safe data fetching.
 * Example: const { data, isLoading } = trpc.evidence.list.useQuery({ user_id: '...' });
 */
exports.trpc = (0, react_query_1.createTRPCReact)();
/**
 * Helper to get the base URL for tRPC calls
 */
function getBaseUrl() {
    if (typeof window !== 'undefined')
        return ''; // browser should use relative url
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}
//# sourceMappingURL=trpc.js.map