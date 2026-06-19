/**
 * 🔗 useInterAgent - AI 對接鉤子
 * --------------------------------------------------
 * [功能] React 組件中使用的 AI 對接狀態管理
 */

import { useState, useEffect, useCallback } from 'react';
import {
  interAgentService,
  type AgentState,
  type SharedTask,
  type TaskStatus,
} from '@/services/InterAgentService';

export interface UseInterAgentReturn {
  agents: AgentState[];
  tasks: SharedTask[];
  availableAgents: AgentState[];
  isConnected: boolean;
  createTask: (task: Omit<SharedTask, 'taskId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTaskProgress: (taskId: string, progress: number, status?: TaskStatus) => Promise<void>;
  assignTask: (taskId: string, assignee: string) => Promise<void>;
  refresh: () => void;
}

export const useInterAgent = (): UseInterAgentReturn => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [tasks, setTasks] = useState<SharedTask[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const refresh = useCallback(() => {
    setAgents(interAgentService.getAllAgents());
    setTasks(interAgentService.getAllTasks());
    setIsConnected(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    interAgentService.on('message', handleUpdate);

    return () => {
      interAgentService.off('message', handleUpdate);
    };
  }, [refresh]);

  const createTask = useCallback(
    async (task: Omit<SharedTask, 'taskId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      return await interAgentService.createSharedTask(task);
    },
    []
  );

  const updateTaskProgress = useCallback(
    async (taskId: string, progress: number, status?: TaskStatus): Promise<void> => {
      await interAgentService.updateTaskProgress(taskId, progress, status);
      refresh();
    },
    [refresh]
  );

  const assignTask = useCallback(
    async (taskId: string, assignee: string): Promise<void> => {
      await interAgentService.assignTask(taskId, assignee);
      refresh();
    },
    [refresh]
  );

  const availableAgents = agents.filter(
    agent =>
      agent.status === 'idle' && agent.currentTasks.length < agent.capabilities.maxConcurrentTasks
  );

  return {
    agents,
    tasks,
    availableAgents,
    isConnected,
    createTask,
    updateTaskProgress,
    assignTask,
    refresh,
  };
};

export default useInterAgent;
