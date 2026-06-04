/**
 * tRPC Provider (OmniSync Provider)
 * v1.0 | #OmniCore #Hydration
 *
 * Injects QueryClient and tRPC client into the React context.
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc, getBaseUrl } from '../utils/trpc';
export function TRPCProvider({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
            }),
        ],
    }));
    return (_jsx(trpc.Provider, { client: trpcClient, queryClient: queryClient, children: _jsx(QueryClientProvider, { client: queryClient, children: children }) }));
}
//# sourceMappingURL=TRPCProvider.js.map