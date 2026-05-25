'use client';

import { useState, useEffect, useRef } from 'react';
import { dcListSwarmAgentTasks } from '../lib/dataconnect-services';
import { AgentTask } from '../lib/agent/types';

/**
 * Custom Hook for real-time (polling) Swarm Agent Task synchronization.
 * Connects directly to the Data Connect service layer.
 */
export function useSwarmSync(intervalMs: number = 3000) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastSyncRef = useRef<string>(new Date().toISOString());

  const sync = async () => {
    try {
      const remoteTasks = await dcListSwarmAgentTasks();
      
      // Map schema type to AgentTask interface
      const mappedTasks: AgentTask[] = remoteTasks.map(t => ({
        id: t.id,
        title: t.title,
        taskType: t.taskType as any,
        status: t.status as any,
        skillKey: t.skillKey || undefined,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        tenantId: 'default',
        actorId: 'system',
        inputRefIds: [],
        policyDecisionId: 'none',
        requiresHumanReview: false
      }));

      setTasks(mappedTasks);
      lastSyncRef.current = new Date().toISOString();
      setError(null);
    } catch (e: any) {
      console.error('SwarmSync: Failed to poll tasks', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sync();
    const interval = setInterval(sync, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { tasks, loading, error, lastSync: lastSyncRef.current, refresh: sync };
}
