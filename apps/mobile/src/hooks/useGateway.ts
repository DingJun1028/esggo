import { useCallback, useEffect, useRef, useState } from 'react';

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

  // 用 ref 緩存最新的 queryFn：避免呼叫端傳入 inline arrow 時每次 render 都產生新參照，
  // 導致 run / effect 反覆重跑而造成無限 re-render 與重複請求。
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    let alive = true;
    queryFnRef.current()
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
  }, []);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return { ...state, refetch: run };
}
