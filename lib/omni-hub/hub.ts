// lib/omni-hub/hub.ts
// 萬能中心核心 — 單例模式

import type {
  AgentRegistration,
  AgentStatus,
  AgentRole,
  AgentCapability,
  SharedMemoryEntry,
  MemoryEntryType,
  MemoryVisibility,
  AgentMessage,
  AgentTask,
  HubStats,
} from './types';
import { SharedMemory } from './memory';
import { FacilityRegistry } from './registry';
import { realtime } from './realtime';
import { searchEngine } from './search';

class OmniHubClass {
  private static instance: OmniHubClass;
  readonly memory: SharedMemory;
  readonly registry: FacilityRegistry;
  private messageQueue: AgentMessage[] = [];
  private taskQueue: AgentTask[] = [];
  private initialized = false;

  private constructor() {
    this.memory = new SharedMemory();
    this.registry = new FacilityRegistry();
  }

  static getInstance(): OmniHubClass {
    if (!OmniHubClass.instance) {
      OmniHubClass.instance = new OmniHubClass();
    }
    return OmniHubClass.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    await this.memory.init();
    await this.registry.init();
    this.initialized = true;
    console.log('[OmniHub] 萬能中心已啟動');
  }

  // ── 設施管理 ──

  async registerFacility(facility: AgentRegistration): Promise<void> {
    await this.registry.register(facility);
    await this.memory.write({
      agentId: 'system',
      agentName: 'OmniHub',
      type: 'decision' as const,
      title: `設施註冊: ${facility.displayName}`,
      content: JSON.stringify(facility),
      summary: `新設施「${facility.displayName}」已註冊，角色: ${facility.role}`,
      tags: ['registration', facility.role],
      visibility: 'public' as const,
      referencedBy: [],
      hashLock: null,
      expiresAt: null,
      metadata: {},
    });
  }

  async updateFacilityStatus(id: string, status: AgentStatus): Promise<void> {
    await this.registry.updateStatus(id, status);
    const facility = this.registry.get(id);
    realtime.emit('facility_status', {
      facilityId: id,
      status,
      lastHeartbeat: facility?.lastHeartbeat || new Date().toISOString(),
    });
  }

  async deregisterFacility(id: string): Promise<void> {
    await this.registry.deregister(id);
  }

  getFacility(id: string): AgentRegistration | undefined {
    return this.registry.get(id);
  }

  getAllFacilities(): AgentRegistration[] {
    return this.registry.getAll();
  }

  getFacilitiesByRole(role: string): AgentRegistration[] {
    return this.registry.getByRole(role as AgentRole);
  }

  // ── 記憶管理 ──

  async shareMemory(
    entry: Omit<SharedMemoryEntry, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<SharedMemoryEntry> {
    const newEntry = await this.memory.write(entry);
    realtime.emit('memory_update', {
      memoryId: newEntry.id,
      agentId: newEntry.agentId,
      title: newEntry.title,
      type: newEntry.type,
    });
    return newEntry;
  }

  async getSharedMemories(filter?: {
    agentId?: string;
    type?: string;
    visibility?: string;
  }): Promise<SharedMemoryEntry[]> {
    return this.memory.query(filter);
  }

  async getMemoryById(id: string): Promise<SharedMemoryEntry | undefined> {
    return this.memory.getById(id);
  }

  // ── 任務管理 ──

  async createTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'status'>): Promise<AgentTask> {
    const newTask: AgentTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.taskQueue.push(newTask);
    realtime.emit('task_update', {
      taskId: newTask.id,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
      title: newTask.title,
    });
    return newTask;
  }

  async assignTask(taskId: string, agentId: string): Promise<void> {
    const task = this.taskQueue.find((t) => t.id === taskId);
    if (task) {
      task.assignedTo = agentId;
      task.status = 'accepted';
      task.startedAt = new Date().toISOString();
    }
  }

  async completeTask(taskId: string, output: Record<string, unknown>): Promise<void> {
    const task = this.taskQueue.find((t) => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.output = output;
      task.completedAt = new Date().toISOString();
      realtime.emit('task_update', {
        taskId: task.id,
        status: 'completed',
        assignedTo: task.assignedTo,
        title: task.title,
        output,
      });
    }
  }

  getTasks(filter?: { status?: string; assignedTo?: string }): AgentTask[] {
    if (!filter) return [...this.taskQueue];
    return this.taskQueue.filter((t) => {
      if (filter.status && t.status !== filter.status) return false;
      if (filter.assignedTo && t.assignedTo !== filter.assignedTo) return false;
      return true;
    });
  }

  // ── 訊息管理 ──

  async sendMessage(msg: Omit<AgentMessage, 'id' | 'createdAt'>): Promise<void> {
    const message: AgentMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    this.messageQueue.push(message);
    // 只保留最近 1000 條訊息
    if (this.messageQueue.length > 1000) {
      this.messageQueue = this.messageQueue.slice(-1000);
    }
    realtime.emit('agent_message', {
      fromAgentId: message.fromAgentId,
      toAgentId: message.toAgentId,
      messageType: message.type,
      priority: message.priority,
    });
  }

  getMessages(filter?: {
    fromAgentId?: string;
    toAgentId?: string;
    type?: string;
  }): AgentMessage[] {
    if (!filter) return [...this.messageQueue];
    return this.messageQueue.filter((m) => {
      if (filter.fromAgentId && m.fromAgentId !== filter.fromAgentId) return false;
      if (filter.toAgentId && m.toAgentId !== filter.toAgentId && m.toAgentId !== 'broadcast')
        return false;
      if (filter.type && m.type !== filter.type) return false;
      return true;
    });
  }

  // ── 統計 ──

  getStats(): HubStats {
    const facilities = this.registry.getAll();
    const activeFacilities = facilities.filter(
      (f) => f.status === 'running' || f.status === 'idle'
    );
    const memories = this.memory.getAll();
    const tasks = this.taskQueue;

    return {
      totalAgents: facilities.length,
      activeAgents: activeFacilities.filter((f) => f.status === 'running').length,
      idleAgents: activeFacilities.filter((f) => f.status === 'idle').length,
      errorAgents: facilities.filter((f) => f.status === 'error').length,
      totalMemories: memories.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      pendingTasks: tasks.filter((t) => t.status === 'pending').length,
      avgHealthScore:
        facilities.length > 0
          ? Math.round(facilities.reduce((sum, f) => sum + f.healthScore, 0) / facilities.length)
          : 0,
      fiveTCompliance: this.calculateFiveTCompliance(facilities),
    };
  }

  private calculateFiveTCompliance(facilities: AgentRegistration[]): number {
    if (facilities.length === 0) return 100;
    const totalChecks = facilities.length * 5;
    const passedChecks = facilities.reduce((sum, f) => {
      return sum + f.fiveTStatus.filter(Boolean).length;
    }, 0);
    return Math.round((passedChecks / totalChecks) * 100);
  }

  // ── 心跳 ──

  async heartbeat(agentId: string): Promise<void> {
    await this.registry.updateHeartbeat(agentId);
  }
}

export const OmniHub = OmniHubClass.getInstance();
