'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * [Best Practice] System Evolution Hook
 * Monitors the system's own growth suggestions and impact scores.
 * Now supports global state syncing for oX Deep Integration.
 */
export function useSystemEvolution() {
  const [growth, setGrowth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchGrowth = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/growth');
      if (res.ok) setGrowth(await res.json());
      
      const local = localStorage.getItem('omniagent_ox_evolution');
      if (local) setLastUpdate(JSON.parse(local).timestamp);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitEvolution = useCallback(async (title: string, impact: number) => {
    const update = { title, impact, timestamp: new Date().toISOString() };
    localStorage.setItem('omniagent_ox_evolution', JSON.stringify(update));
    setLastUpdate(update.timestamp);
    // Real API call to update system topology would go here
    return update;
  }, []);

  useEffect(() => {
    fetchGrowth();
    const t = setInterval(fetchGrowth, 300000); 
    return () => clearInterval(t);
  }, [fetchGrowth]);

  return { growth, loading, lastUpdate, analyze: fetchGrowth, submitEvolution };
}
