/**
 * ⚡️ ESG GO | Advanced Caching Strategy
 * Implements an SWR-compatible fetcher with built-in telemetry and error tracing.
 */
export declare class FetchError extends Error {
    info: unknown;
    status: number;
    constructor(message: string, info: unknown, status: number);
}
/**
 * Standard fetcher for SWR hooks
 * Usage: const { data } = useSWR('/api/data', fetcher)
 */
export declare function swrFetcher<T>(url: string, init?: RequestInit): Promise<T>;
/**
 * Global SWR Configuration object to be passed to SWRConfig
 */
export declare const swrGlobalConfig: {
    fetcher: typeof swrFetcher;
    revalidateOnFocus: boolean;
    revalidateIfStale: boolean;
    shouldRetryOnError: boolean;
};
//# sourceMappingURL=swr-fetcher.d.ts.map