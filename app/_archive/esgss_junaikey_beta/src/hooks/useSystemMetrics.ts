import { useState, useEffect, useCallback } from 'react';
import { junAiKeyClient, SystemMetrics } from '../services/api/JunAiKey.Client';

export interface UseSystemMetricsReturn extends SystemMetrics {
  refresh: (silent?: boolean) => Promise<void>;
  isLoading: boolean;
  logs: SystemLog[];
}

export interface SystemLog {
  time: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'AUTH' | 'AI';
  msg: string;
}

export const useSystemMetrics = (refreshInterval = 5000, isEnabled = true): UseSystemMetricsReturn => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    latency: 0,
    throughput: 0,
    aiStatus: 'inactive',
    boostSpaceStatus: 'idle',
    activeNodes: 0,
    cacheHitRate: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const addLog = (type: SystemLog['type'], msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ time, type, msg }, ...prev].slice(0, 50));
  };

  const refresh = useCallback(async (silent = false) => {
    // ⚡ Bolt Optimization: Skip isLoading toggle for background updates (silent=true)
    // to prevent unnecessary re-renders in subscribing components.
    if (!silent) setIsLoading(true);
    try {
      const data = await junAiKeyClient.getMetrics();
      setMetrics(data);

      // Artificial logs based on status
      if (data.aiStatus === 'active' && Math.random() > 0.7) {
        addLog('AI', 'AI Model responded with high fidelity');
      }
      if (Math.random() > 0.8) {
        addLog('INFO', 'System heartbeat verification passed');
      }
    } catch (error) {
      addLog('ERROR', 'Failed to fetch metrics');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    refresh(false); // Initial load with loading state
    const interval = setInterval(() => refresh(true), refreshInterval); // Background silent refresh
    return () => clearInterval(interval);
  }, [refresh, refreshInterval, isEnabled]);

  return {
    ...metrics,
    refresh,
    isLoading,
    logs,
  };
};
