import { useState, useEffect, useCallback } from 'react';
import omniApi, { OmniResponse } from '@/services/api/omni.api';

/**
 * 💡 useOmniData Hook
 * Connects UI components to the Omni Backend with "Liquid Glass" loading states.
 */

interface UseOmniDataOptions<T> {
    initialData?: T;
    autoFetch?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}

interface UseOmniDataResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    setData: (data: T) => void;
}

export function useOmniData<T>(
    endpoint: string,
    options: UseOmniDataOptions<T> = {}
): UseOmniDataResult<T> {
    const {
        initialData = null,
        autoFetch = true,
        onSuccess,
        onError
    } = options;

    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await omniApi.get<T>(endpoint);

            // Handle standard OmniResponse wrapper if present
            // If the backend returns { success: true, data: ... }, extract data
            // If the backend returns raw data, use it directly (fallback)
            const resolvedData = (response as any).data !== undefined ? (response as any).data : response;

            setData(resolvedData);
            if (onSuccess) onSuccess(resolvedData);
        } catch (err: any) {
            console.error(`[useOmniData] Error fetching ${endpoint}:`, err);
            setError(err);
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, onSuccess, onError]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [fetchData, autoFetch]);

    return { data, loading, error, refetch: fetchData, setData };
}
