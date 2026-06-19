import { useCallback, useEffect, useRef } from 'react';

/**
 * 🛡️ useSafeCallback (安全回調 Hook)
 * 確保回調僅在組件掛載時執行，防止內存洩漏與狀態更新衝突。
 */
export function useSafeCallback<T extends (...args: any[]) => any>(callback: T): T {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useCallback(
        (...args: Parameters<T>) => {
            if (isMounted.current) {
                return callback(...args);
            }
        },
        [callback]
    ) as T;
}
