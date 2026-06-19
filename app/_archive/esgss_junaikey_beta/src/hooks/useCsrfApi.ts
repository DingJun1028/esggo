import { useState, useCallback } from 'react';
import {
    apiPost,
    apiPut,
    apiDelete,
    apiPatch,
    fetchCsrfToken,
    clearCsrfToken
} from '../services/api/csrfService';

/**
 * React Hook for CSRF-Protected API Calls
 * Provides convenient methods for making secure API requests
 * 
 * @example
 * const { post, isLoading, error } = useCsrfApi();
 * await post('/api/market/crawl', { query: 'Tesla ESG' });
 */
export function useCsrfApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const post = useCallback(async <T = any>(url: string, data: any): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiPost<T>(url, data);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const put = useCallback(async <T = any>(url: string, data: any): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiPut<T>(url, data);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const del = useCallback(async <T = any>(url: string): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiDelete<T>(url);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const patch = useCallback(async <T = any>(url: string, data: any): Promise<T | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiPatch<T>(url, data);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            await fetchCsrfToken();
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
        }
    }, []);

    const clearToken = useCallback(() => {
        clearCsrfToken();
    }, []);

    return {
        post,
        put,
        delete: del,
        patch,
        refreshToken,
        clearToken,
        isLoading,
        error,
    };
}
