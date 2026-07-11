import { useCallback, useEffect, useState } from 'react';

export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Minimal data-fetching hook: keeps loading / data / error state out of the
 * screens so UI components stay presentational. Pass a stable query function
 * (e.g. `gateway.health`) — it is re-run on mount and whenever the function
 * identity changes. `refetch` re-runs it on demand (e.g. pull-to-refresh).
 */
export function useGatewayQuery<T>(queryFn: () => Promise<T>): QueryState<T> {
  const [state, setState] = useState<Omit<QueryState<T>, 'refetch'>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    let alive = true;
    queryFn()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (alive) {
          const message = e instanceof Error ? e.message : String(e);
          setState({ data: null, loading: false, error: message });
        }
      });
    return () => {
      alive = false;
    };
  }, [queryFn]);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return { ...state, refetch: run };
}
