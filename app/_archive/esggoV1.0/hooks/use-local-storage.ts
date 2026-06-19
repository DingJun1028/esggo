import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_EVENT = 'local-storage-update';

/**
 * Utility to update localStorage and notify all subscribers in the same tab.
 */
export function setLocalStorageItem(key: string, value: string | null) {
    if (typeof window !== 'undefined') {
        if (value === null) {
            window.localStorage.removeItem(key);
        } else {
            window.localStorage.setItem(key, value);
        }
        // Notify same tab subscribers
        window.dispatchEvent(new Event(STORAGE_EVENT));
    }
}

/**
 * Professional useLocalStorage hook for Next.js 15/React 18.
 * Uses useSyncExternalStore to avoid hydration mismatch and cascading renders.
 */
export function useLocalStorage(key: string, serverFallback: string | null = null): string | null {
    // 1. Subscribe to updates (Cross-tab 'storage' event + Same-tab custom event)
    const subscribe = useCallback((onStoreChange: () => void) => {
        if (typeof window === 'undefined') return () => { };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key || e.key === null) {
                onStoreChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(STORAGE_EVENT, onStoreChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(STORAGE_EVENT, onStoreChange);
        };
    }, [key]);

    // 2. Get current client-side value
    const getSnapshot = useCallback(() => {
        if (typeof window === 'undefined') return serverFallback;
        return window.localStorage.getItem(key);
    }, [key, serverFallback]);

    // 3. Get server-side value (usually fallback)
    const getServerSnapshot = useCallback(() => {
        return serverFallback;
    }, [serverFallback]);

    // 4. Sync with external store
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
