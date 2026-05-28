/**
 * tRPC Client Bridge (OmniSync Bridge)
 * v2.0 | #ProperTRPC #EndToEndTypeSafety
 * 
 * Establishing a proper bidirectional bridge between the frontend and backend.
 * Provides full type inference based on the AppRouter definition.
 */

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../server/trpc';

/**
 * tRPC React Hooks
 * Use these hooks in your components for type-safe data fetching.
 * Example: const { data, isLoading } = trpc.evidence.list.useQuery({ user_id: '...' });
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Helper to get the base URL for tRPC calls
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}
