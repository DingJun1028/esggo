'use client';

/**
 * useAITable — React Hook for AITable Integration
 * ═══════════════════════════════════════════════
 * Client-side hook that communicates with /api/aitable proxy
 */

import { useState, useCallback } from 'react';
import type {
  AITableSpace,
  AITableNode,
  AITableField,
  AITableView,
  AITableRecord,
  AITableRecordsResponse,
} from '@/lib/aitable/client';

interface UseAITableReturn {
  // State
  loading: boolean;
  error: string | null;

  // Read operations
  fetchSpaces: () => Promise<AITableSpace[]>;
  fetchNodes: (spaceId: string) => Promise<AITableNode[]>;
  fetchRecords: (datasheetId: string, opts?: { pageSize?: number; pageNum?: number; viewId?: string }) => Promise<AITableRecordsResponse>;
  fetchFields: (datasheetId: string) => Promise<AITableField[]>;
  fetchViews: (datasheetId: string) => Promise<AITableView[]>;

  // Write operations
  createRecords: (datasheetId: string, records: Array<{ fields: Record<string, unknown> }>) => Promise<AITableRecord[]>;
  updateRecords: (datasheetId: string, records: Array<{ recordId: string; fields: Record<string, unknown> }>) => Promise<AITableRecord[]>;
  deleteRecords: (datasheetId: string, recordIds: string[]) => Promise<void>;
  createDatasheet: (spaceId: string, name: string, fields: Array<{ name: string; type: string }>) => Promise<{ id: string }>;
}

async function apiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL('/api/aitable', window.location.origin);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API call failed');
  return json.data;
}

async function apiPost<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/aitable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API call failed');
  return json.data;
}

export function useAITable(): UseAITableReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSpaces = useCallback(
    () => wrap(() => apiGet<AITableSpace[]>('spaces')),
    [wrap]
  );

  const fetchNodes = useCallback(
    (spaceId: string) => wrap(() => apiGet<AITableNode[]>('nodes', { spaceId })),
    [wrap]
  );

  const fetchRecords = useCallback(
    (datasheetId: string, opts?: { pageSize?: number; pageNum?: number; viewId?: string }) =>
      wrap(() =>
        apiGet<AITableRecordsResponse>('records', {
          datasheetId,
          ...(opts?.pageSize ? { pageSize: String(opts.pageSize) } : {}),
          ...(opts?.pageNum ? { pageNum: String(opts.pageNum) } : {}),
          ...(opts?.viewId ? { viewId: opts.viewId } : {}),
        })
      ),
    [wrap]
  );

  const fetchFields = useCallback(
    (datasheetId: string) => wrap(() => apiGet<AITableField[]>('fields', { datasheetId })),
    [wrap]
  );

  const fetchViews = useCallback(
    (datasheetId: string) => wrap(() => apiGet<AITableView[]>('views', { datasheetId })),
    [wrap]
  );

  const createRecords = useCallback(
    (datasheetId: string, records: Array<{ fields: Record<string, unknown> }>) =>
      wrap(() => apiPost<AITableRecord[]>('createRecords', { datasheetId, records })),
    [wrap]
  );

  const updateRecords = useCallback(
    (datasheetId: string, records: Array<{ recordId: string; fields: Record<string, unknown> }>) =>
      wrap(() => apiPost<AITableRecord[]>('updateRecords', { datasheetId, records })),
    [wrap]
  );

  const deleteRecords = useCallback(
    (datasheetId: string, recordIds: string[]) =>
      wrap(() => apiPost<void>('deleteRecords', { datasheetId, recordIds })),
    [wrap]
  );

  const createDatasheet = useCallback(
    (spaceId: string, name: string, fields: Array<{ name: string; type: string }>) =>
      wrap(() => apiPost<{ id: string }>('createDatasheet', { spaceId, name, fields })),
    [wrap]
  );

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
