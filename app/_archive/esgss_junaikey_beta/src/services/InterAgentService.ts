/**
 * 🤝 InterAgentService - AI 對接與任務協調服務
 * --------------------------------------------------
 * [功能]
 * - 多 AI 系統對接 (OpenClaw Gateway, OmniAgent, 外部 AI)
 * - 共享任務進度與狀態
 * - AI 間服務發現與調用
 * - 5T 協議保護的通訊
 */

import { EventEmitter } from 'events';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

export type AgentID = string;
export type TaskID = string;

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';

export interface SharedTask {
  taskId: TaskID;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  assignee: AgentID | null;
  dependencies: TaskID[];
  requiredServices: string[];
  createdBy: AgentID;
  createdAt: number;
  updatedAt: number;
  metadata: Record<string, unknown>;
}

export interface AgentCapabilities {
  agentId: AgentID;
  agentName: string;
  services: string[];
  canDelegate: boolean;
  maxConcurrentTasks: number;
}

export interface AgentState {
  agentId: AgentID;
  status: 'idle' | 'busy' | 'offline';
  currentTasks: TaskID[];
  capabilities: AgentCapabilities;
  lastSeen: number;
}

export interface InterAgentMessage {
  id: string;
  from: AgentID;
  to: AgentID;
  type: 'task_request' | 'task_update' | 'service_query' | 'service_response' | 'progress_sync';
  payload: Record<string, unknown>;
  timestamp: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ServiceDiscovery {
  serviceName: string;
  provider: AgentID;
  capabilities: string[];
  endpoint?: string;
}

class InterAgentService extends EventEmitter {
  private agentStates: Map<AgentID, AgentState> = new Map();
  private sharedTasks: Map<TaskID, SharedTask> = new Map();
  private serviceRegistry: Map<string, ServiceDiscovery> = new Map();
  private messageQueue: InterAgentMessage[] = [];
  private gatewayUrl: string = 'ws://localhost:19001/gateway/v1';

  constructor() {
    super();
    this.initializeSystemAgents();
  }

  private initializeSystemAgents() {
    const systemAgents: AgentState[] = [
      {
        agentId: 'omni-agent',
        status: 'idle',
        currentTasks: [],
        capabilities: {
          agentId: 'omni-agent',
          agentName: 'OmniAgent',
          services: ['esg-analysis', 'report-generation', 'task-coordination', 'rag-knowledge'],
          canDelegate: true,
          maxConcurrentTasks: 5,
        },
        lastSeen: Date.now(),
      },
      {
        agentId: 'openclaw-main',
        status: 'idle',
        currentTasks: [],
        capabilities: {
          agentId: 'openclaw-main',
          agentName: 'OpenClaw Main Agent',
          services: ['messaging', 'web-search', 'file-management', 'shell-execution'],
          canDelegate: true,
          maxConcurrentTasks: 3,
        },
        lastSeen: Date.now(),
      },
      {
        agentId: 'openclaw-coder',
        status: 'idle',
        currentTasks: [],
        capabilities: {
          agentId: 'openclaw-coder',
          agentName: 'OpenClaw Coder Agent',
          services: ['code-generation', 'code-review', 'refactoring'],
          canDelegate: false,
          maxConcurrentTasks: 2,
        },
        lastSeen: Date.now(),
      },
      {
        agentId: 'openclaw-researcher',
        status: 'idle',
        currentTasks: [],
        capabilities: {
          agentId: 'openclaw-researcher',
          agentName: 'OpenClaw Researcher Agent',
          services: ['research', 'analysis', 'summarization'],
          canDelegate: false,
          maxConcurrentTasks: 3,
        },
        lastSeen: Date.now(),
      },
    ];

    systemAgents.forEach(agent => {
      this.agentStates.set(agent.agentId, agent);
    });

    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Initialized system agents', {
      count: systemAgents.length,
    });
  }

  async registerAgent(agentId: AgentID, capabilities: AgentCapabilities): Promise<void> {
    const state: AgentState = {
      agentId,
      status: 'idle',
      currentTasks: [],
      capabilities,
      lastSeen: Date.now(),
    };
    this.agentStates.set(agentId, state);

    capabilities.services.forEach(serviceName => {
      this.serviceRegistry.set(serviceName, {
        serviceName,
        provider: agentId,
        capabilities: capabilities.services,
      });
    });

    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Agent registered', {
      agentId,
      services: capabilities.services,
    });

    this.logToSystem('agent_registered', { agentId, capabilities });
  }

  async unregisterAgent(agentId: AgentID): Promise<void> {
    const state = this.agentStates.get(agentId);
    if (!state) return;

    state.capabilities.services.forEach(serviceName => {
      const entry = this.serviceRegistry.get(serviceName);
      if (entry?.provider === agentId) {
        this.serviceRegistry.delete(serviceName);
      }
    });

    this.agentStates.delete(agentId);
    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Agent unregistered', { agentId });
  }

  async createSharedTask(
    task: Omit<SharedTask, 'taskId' | 'createdAt' | 'updatedAt'>
  ): Promise<TaskID> {
    const taskId: TaskID = `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const now = Date.now();

    const sharedTask: SharedTask = {
      ...task,
      taskId,
      createdAt: now,
      updatedAt: now,
    };

    this.sharedTasks.set(taskId, sharedTask);
    await this.broadcastTaskUpdate(taskId, 'created');

    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Shared task created', {
      taskId,
      title: task.title,
      createdBy: task.createdBy,
    });

    return taskId;
  }

  async updateTaskProgress(taskId: TaskID, progress: number, status?: TaskStatus): Promise<void> {
    const task = this.sharedTasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.progress = Math.min(100, Math.max(0, progress));
    if (status) task.status = status;
    task.updatedAt = Date.now();

    await this.broadcastTaskUpdate(taskId, 'updated');
    this.logToSystem('task_progress', { taskId, progress, status: task.status });
  }

  async assignTask(taskId: TaskID, assignee: AgentID): Promise<void> {
    const task = this.sharedTasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);

    const assigneeState = this.agentStates.get(assignee);
    if (!assigneeState) throw new Error(`Agent not found: ${assignee}`);

    if (assigneeState.currentTasks.length >= assigneeState.capabilities.maxConcurrentTasks) {
      throw new Error(`Agent ${assignee} has reached max concurrent tasks`);
    }

    task.assignee = assignee;
    task.updatedAt = Date.now();
    assigneeState.currentTasks.push(taskId);
    assigneeState.status = 'busy';

    await this.broadcastTaskUpdate(taskId, 'assigned');
    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Task assigned', {
      taskId,
      assignee,
    });
  }

  async delegateTask(taskId: TaskID, fromAgent: AgentID, toAgent: AgentID): Promise<void> {
    const task = this.sharedTasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);
    if (task.assignee !== fromAgent) throw new Error(`Task not assigned to ${fromAgent}`);

    const fromState = this.agentStates.get(fromAgent);
    const toState = this.agentStates.get(toAgent);

    if (!fromState || !toState) throw new Error('Agent not found');

    if (!toState.capabilities.canDelegate) {
      throw new Error(`Agent ${toAgent} cannot accept delegated tasks`);
    }

    fromState.currentTasks = fromState.currentTasks.filter(id => id !== taskId);
    if (fromState.currentTasks.length === 0) fromState.status = 'idle';

    task.assignee = toAgent;
    task.updatedAt = Date.now();
    toState.currentTasks.push(taskId);
    toState.status = 'busy';

    await this.broadcastTaskUpdate(taskId, 'delegated');
  }

  async queryServices(serviceNames: string[]): Promise<ServiceDiscovery[]> {
    const results: ServiceDiscovery[] = [];
    for (const name of serviceNames) {
      const service = this.serviceRegistry.get(name);
      if (service) results.push(service);
    }
    return results;
  }

  async discoverAllServices(): Promise<ServiceDiscovery[]> {
    return Array.from(this.serviceRegistry.values());
  }

  async sendMessage(message: InterAgentMessage): Promise<void> {
    message.id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    message.timestamp = Date.now();

    this.messageQueue.push(message);
    this.emit('message', message);

    omniLogger.info(LogCategory.AI, '[InterAgentService] Message sent', {
      from: message.from,
      to: message.to,
      type: message.type,
    });
  }

  async broadcastTaskUpdate(taskId: TaskID, action: string): Promise<void> {
    const task = this.sharedTasks.get(taskId);
    if (!task) return;

    const allAgents = Array.from(this.agentStates.keys());
    for (const agentId of allAgents) {
      if (agentId !== task.createdBy) {
        await this.sendMessage({
          id: '',
          from: 'system',
          to: agentId,
          type: 'task_update',
          payload: { taskId, action, task },
          timestamp: 0,
          priority: 'normal',
        });
      }
    }
  }

  getAgentState(agentId: AgentID): AgentState | undefined {
    return this.agentStates.get(agentId);
  }

  getTask(taskId: TaskID): SharedTask | undefined {
    return this.sharedTasks.get(taskId);
  }

  getAllTasks(): SharedTask[] {
    return Array.from(this.sharedTasks.values());
  }

  getTasksByAgent(agentId: AgentID): SharedTask[] {
    return Array.from(this.sharedTasks.values()).filter(
      task => task.assignee === agentId || task.createdBy === agentId
    );
  }

  getTasksByStatus(status: TaskStatus): SharedTask[] {
    return Array.from(this.sharedTasks.values()).filter(task => task.status === status);
  }

  getAllAgents(): AgentState[] {
    return Array.from(this.agentStates.values());
  }

  getAvailableAgents(): AgentState[] {
    return Array.from(this.agentStates.values()).filter(
      agent =>
        agent.status === 'idle' && agent.currentTasks.length < agent.capabilities.maxConcurrentTasks
    );
  }

  async syncWithOpenClaw(): Promise<void> {
    try {
      const ws = new WebSocket(this.gatewayUrl);

      ws.onopen = () => {
        omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Connected to OpenClaw Gateway');
        ws.send(
          JSON.stringify({
            type: 'chat',
            agentId: 'main',
            message: '/agents list',
          })
        );
      };

      ws.onmessage = async event => {
        try {
          const data = JSON.parse(event.data);
          if (data.agents) {
            for (const agent of data.agents) {
              await this.registerAgent(agent.id, {
                agentId: agent.id,
                agentName: agent.name,
                services: agent.tools || [],
                canDelegate: agent.canDelegate || false,
                maxConcurrentTasks: agent.maxTasks || 3,
              });
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      };

      ws.onerror = error => {
        omniLogger.warn(
          LogCategory.SYSTEM,
          '[InterAgentService] OpenClaw Gateway connection error',
          {
            error,
          }
        );
      };

      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }, 5000);
    } catch (error) {
      omniLogger.warn(
        LogCategory.SYSTEM,
        '[InterAgentService] Failed to connect to OpenClaw Gateway',
        {
          error,
        }
      );
    }
  }

  private logToSystem(action: string, data: Record<string, unknown>): void {
    omniLogger.info(LogCategory.SYSTEM, `[InterAgentService] ${action}`, data);
  }

  setGatewayUrl(url: string): void {
    this.gatewayUrl = url;
    omniLogger.info(LogCategory.SYSTEM, '[InterAgentService] Gateway URL updated', { url });
  }
}

export const interAgentService = new InterAgentService();
export default interAgentService;
