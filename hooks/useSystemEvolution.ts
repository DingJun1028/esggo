'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * [Best Practice] System Evolution Hook
 * Monitors the system's own growth suggestions and impact scores.
 */
export function useSystemEvolution() {
  const [growth, setGrowth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGrowth = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/growth');
      if (res.ok) setGrowth(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrowth();
    const t = setInterval(fetchGrowth, 300000); // Analyze every 5 mins
    return () => clearInterval(t);
  }, [fetchGrowth]);

  return { growth, loading, analyze: fetchGrowth };
}
