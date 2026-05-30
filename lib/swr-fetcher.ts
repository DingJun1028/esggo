/**
 * ⚡️ ESG GO | Advanced Caching Strategy
 * Implements an SWR-compatible fetcher with built-in telemetry and error tracing.
 */

export class FetchError extends Error {
  info: unknown;
  status: number;
  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

/**
 * Standard fetcher for SWR hooks
 * Usage: const { data } = useSWR('/api/data', fetcher)
 */
export async function swrFetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const start = performance.now();
  
  try {
    const res = await fetch(url, init);
    
    // Telemetry: Log request duration
    const duration = performance.now() - start;
    if (duration > 1000) {
      console.warn(`[Performance] Slow request to ${url} took ${duration.toFixed(0)}ms`);
      // TODO: Send to Sentry or Vercel Analytics
    }

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      let info;
      try {
        info = await res.json();
      } catch (e) {
        info = await res.text();
      }
      throw new FetchError('An error occurred while fetching the data.', info, res.status);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`[SWR Fetcher Error] ${url}:`, error);
    // TODO: Sentry.captureException(error)
    throw error;
  }
}

/**
 * Global SWR Configuration object to be passed to SWRConfig
 */
export const swrGlobalConfig = {
  fetcher: swrFetcher,
  revalidateOnFocus: false, // Don't spam API on window focus
  revalidateIfStale: true,
  shouldRetryOnError: false, // Prevent cascading retries on fatal errors
};
