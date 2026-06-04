'use client';
/**
 * useOmniTable — React Hook for OmniTable Integration
 * ═══════════════════════════════════════════════
 * Client-side hook that communicates with /api/omni-table proxy
 */
import { useState, useCallback } from 'react';
async function apiGet(action, params = {}) {
    const url = new URL('/api/omni-table', window.location.origin);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'API call failed');
    return json.data;
}
async function apiPost(action, payload) {
    const res = await fetch('/api/omni-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
    });
    const json = await res.json();
    if (!json.success)
        throw new Error(json.error || 'API call failed');
    return json.data;
}
export function useOmniTable() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const wrap = useCallback(async (fn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            return result;
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError('Unknown error');
            }
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const fetchSpaces = useCallback(() => wrap(() => apiGet('spaces')), [wrap]);
    const fetchNodes = useCallback((spaceId) => wrap(() => apiGet('nodes', { spaceId })), [wrap]);
    const fetchRecords = useCallback((datasheetId, opts) => wrap(() => apiGet('records', {
        datasheetId,
        ...(opts?.pageSize ? { pageSize: String(opts.pageSize) } : {}),
        ...(opts?.pageNum ? { pageNum: String(opts.pageNum) } : {}),
        ...(opts?.viewId ? { viewId: opts.viewId } : {}),
    })), [wrap]);
    const fetchFields = useCallback((datasheetId) => wrap(() => apiGet('fields', { datasheetId })), [wrap]);
    const fetchViews = useCallback((datasheetId) => wrap(() => apiGet('views', { datasheetId })), [wrap]);
    const createRecords = useCallback((datasheetId, records) => wrap(() => apiPost('createRecords', { datasheetId, records })), [wrap]);
    const updateRecords = useCallback((datasheetId, records) => wrap(() => apiPost('updateRecords', { datasheetId, records })), [wrap]);
    const deleteRecords = useCallback((datasheetId, recordIds) => wrap(() => apiPost('deleteRecords', { datasheetId, recordIds })), [wrap]);
    const createDatasheet = useCallback((spaceId, name, fields) => wrap(() => apiPost('createDatasheet', { spaceId, name, fields })), [wrap]);
    return {
        loading,
        error,
        fetchSpaces,
        fetchNodes,
        fetchRecords,
        fetchFields,
        fetchViews,
        createRecords,
        updateRecords,
        deleteRecords,
        createDatasheet,
    };
}
//# sourceMappingURL=useOmniTable.js.map