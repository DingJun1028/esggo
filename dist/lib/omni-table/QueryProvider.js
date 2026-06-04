'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
export default function OmniTableQueryProvider({ children }) {
    const [client] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30000, // 30s cache — respects OmniTable QPS limits
                gcTime: 5 * 60000, // 5min garbage collection
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    }));
    return _jsx(QueryClientProvider, { client: client, children: children });
}
//# sourceMappingURL=QueryProvider.js.map