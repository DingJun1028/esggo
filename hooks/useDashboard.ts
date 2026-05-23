'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, DashboardStats } from '../lib/db';

/**
 * [Best Practice] Unified Dashboard Hook
 * Encapsulates fetching logic, loading states, and auto-refresh intervals.
 */
export function useDashboardStats(refreshInterval = 60000) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to sync dashboard intelligence.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(t);
  }, [fetchStats, refreshInterval]);

  return { stats, loading, error, refresh: fetchStats };
}
