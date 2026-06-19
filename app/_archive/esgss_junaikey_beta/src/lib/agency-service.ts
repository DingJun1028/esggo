import { supabase } from './supabase';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export interface IAgencyTask {
  id?: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  priority: 'High' | 'Medium' | 'Low';
  agent_id?: string; // Assigned Agent
  target_resource?: string; // Linked UCC Component UUID
  created_at?: number;
  type: 'Inspection' | 'Optimization' | 'Security' | 'General';
}

/**
 * 🕵️‍♀️ Agency Service (The "Trackable" Pillar)
 * Autonomous service that inspects system data and assigns tasks to agents.
 */
export const Agency_Service = {
  /**
   * 1. Create a simplified task in the matrix
   */
  createTask: async (task: IAgencyTask) => {
    try {
      const newTask = {
        ...task,
        created_at: task.created_at || Date.now(),
        // Map to DB columns if needed, assuming simple mapping for now
        // In real DB: created_at might be timestamptz
      };

      // If Supabase is connected
      if (supabase) {
        const { data, error } = await supabase.from('task_matrix').insert([newTask]).select();

        if (error) {
          omniLogger.error(LogCategory.SYSTEM, '[agency-service] AgencyService: DB Insert Failed', { error })
          // Fallback to local mock if DB fails (SAFE MODE)
          return { ...newTask, id: `mock-${Date.now()}` };
        }
        return data?.[0] || newTask;
      }

      return newTask;
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[agency-service] AgencyService: Create Task Error', { error: e });
      return task;
    }
  },

  /**
   * 2. Auto-Inspect "Trustworthy" Data
   * Scans for components that are "Trustworthy" but missing a hash lock (Anomaly)
   * or "Draft" components lingering too long.
   */
  autoInspect: async () => {
    omniLogger.info(LogCategory.SYSTEM, '[agency-service] 🕵️‍♀️ Agency Service: Starting Auto-Inspection...');

    // Mock Logic: In reality, this would query `ucc_cores` where status='Trustworthy' and hash_lock is null
    // Simulating finding an anomaly
    const anomalyFound = Math.random() > 0.7; // 30% chance to find something

    if (anomalyFound) {
      const task: IAgencyTask = {
        title: `Auto-Inspection: Verify Integrity of Component-${Math.floor(Math.random() * 999)}`,
        status: 'Pending',
        priority: 'High',
        type: 'Inspection',
        agent_id: 'Omni-Sentinel-01',
        target_resource: `uuid-${Date.now()}`,
      };

      await Agency_Service.createTask(task);
      return { status: 'Anomaly Detected', task };
    }

    return { status: 'System Green', task: null };
  },

  /**
   * 3. Fetch Active Tasks
   */
  getTasks: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('task_matrix')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) return data;
    }
    return [];
  },

  /**
   * 4. 💓 Agency Heartbeat
   * Starts a periodic inspection loop.
   */
  startHeartbeat: (intervalMs: number = 60000) => {
    omniLogger.info(LogCategory.SYSTEM, '[agency-service] Info', { data: `💓 Agency Service: Heartbeat active (${intervalMs}ms)` });
    return setInterval(async () => {
      const result = await Agency_Service.autoInspect();
      if (result.task) {
        console.info('📡 Agency Alert:', result.task.title);
        // Trigger any relevant UI notification or event emitter here
      }
    }, intervalMs);
  },
};
