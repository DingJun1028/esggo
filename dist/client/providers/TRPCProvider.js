"use strict";
/**
 * tRPC Provider (OmniSync Provider)
 * v1.0 | #OmniCore #Hydration
 *
 * Injects QueryClient and tRPC client into the React context.
 */
'use client';
/**
 * tRPC Provider (OmniSync Provider)
 * v1.0 | #OmniCore #Hydration
 *
 * Injects QueryClient and tRPC client into the React context.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCProvider = TRPCProvider;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@trpc/client");
const trpc_1 = require("../utils/trpc");
function TRPCProvider({ children }) {
    const [queryClient] = (0, react_1.useState)(() => new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));
    const [trpcClient] = (0, react_1.useState)(() => trpc_1.trpc.createClient({
        links: [
            (0, client_1.httpBatchLink)({
                url: `${(0, trpc_1.getBaseUrl)()}/api/trpc`,
            }),
        ],
    }));
    return (<trpc_1.trpc.Provider client={trpcClient} queryClient={queryClient}>
      <react_query_1.QueryClientProvider client={queryClient}>
        {children}
      </react_query_1.QueryClientProvider>
    </trpc_1.trpc.Provider>);
}
//# sourceMappingURL=TRPCProvider.js.map