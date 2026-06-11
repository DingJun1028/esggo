'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useServices } from '../contexts/ServiceContext';

export interface DashboardStats {
  complianceRate: number;
  carbonEmissions: number;
  griCoverage: number;
  auditCount: number;
}

export interface CarbonTrendRecord {
    month: string;
    emissions: number;
}

export function useDashboardStats(refreshInterval = 60000) {
  const { loggerService } = useServices();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      // Setup read from db.collection('dashboard_stats').doc('current')
      const docRef = doc(db, 'dashboard_stats', 'current');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStats(docSnap.data() as DashboardStats);
      } else {
        // Fallback logic to create initial test data if it doesn't exist
        const defaultStats: DashboardStats = {
          complianceRate: 78,
          carbonEmissions: 1247,
          griCoverage: 67,
          auditCount: 2847
        };
        await setDoc(docRef, defaultStats);
        setStats(defaultStats);
      }
      setError(null);
    } catch (err) {
      loggerService.error('Failed to sync dashboard intelligence', err);
      setError('Failed to sync dashboard intelligence.');
      // Keep old mock fallback just in case
      setStats({
        complianceRate: 78,
        carbonEmissions: 1247,
        griCoverage: 67,
        auditCount: 2847
      });
    } finally {
      setLoading(false);
    }
  }, [loggerService]);

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(t);
  }, [fetchStats, refreshInterval]);

  return { stats, loading, error, refresh: fetchStats };
}
