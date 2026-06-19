'use client';

import { useState, useEffect, useRef } from 'react';
import { dcListSwarmAgentTasks } from '../lib/dataconnect-services';
import { AgentTask, SwarmAgent } from '../lib/agent/types';

/**
 * Custom Hook for real-time (polling) Swarm Agent synchronization.
 */
export function useSwarmSync(intervalMs: number = 3000) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [agents, setAgents] = useState<SwarmAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastSyncRef = useRef<string>(new Date().toISOString());

  const sync = async () => {
    try {
      const remoteTasks = await dcListSwarmAgentTasks();
      
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

      // Derive active agents from tasks or fetch from separate service
      // For now, we simulate agent status based on active tasks
      const derivedAgents: SwarmAgent[] = [
        { 
          id: 'agt-z0', 
          name: 'Z0-Compliance', 
          role: 'Regulatory Auditor', 
          status: mappedTasks.some(t => t.status === 'approved_for_execution') ? 'processing' : 'active', 
          persona: 'compliance', 
          color: '#003262',
          t5_score: 98
        },
        { 
          id: 'agt-h1', 
          name: 'H1-Harmony', 
          role: 'Social Impact Analyst', 
          status: 'active', 
          persona: 'harmony', 
          color: '#10B981',
          t5_score: 94
        },
        { 
          id: 'agt-v4', 
          name: 'V4-Vault', 
          role: 'Security & ZKP Guard', 
          status: 'idle', 
          persona: 'innovation', 
          color: '#8B5CF6',
          t5_score: 99
        },
      ];
      setAgents(derivedAgents);

      lastSyncRef.current = new Date().toISOString();
      setError(null);
    } catch (e: any) {
      console.error('SwarmSync: Failed to poll swarm state', e);
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

  return { tasks, agents, loading, error, lastSync: lastSyncRef.current, refresh: sync };
}
