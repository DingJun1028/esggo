// lib/omni-hub/types.ts
// 萬能中心 — 核心型別定義

export type AgentStatus = 'registered' | 'idle' | 'running' | 'paused' | 'error' | 'deregistered';

export type AgentRole =
  | 'orchestrator'
  | 'analyst'
  | 'writer'
  | 'auditor'
  | 'researcher'
  | 'calculator'
  | 'coordinator'
  | 'guardian'
  | 'custom';

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  version: string;
}

export interface AgentRegistration {
  id: string;
  name: string;
  displayName: string;
  role: AgentRole;
  description: string;
  status: AgentStatus;
  capabilities: AgentCapability[];
  memoryAccess: ('read' | 'write' | 'admin')[];
  maxConcurrentTasks: number;
  currentTaskCount: number;
  healthScore: number;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  registeredAt: string;
  lastHeartbeat: string;
  metadata: Record<string, unknown>;
}

export type MemoryEntryType =
  | 'task_result'
  | 'insight'
  | 'evidence'
  | 'decision'
  | 'learning'
  | 'context'
  | 'warning'
  | 'custom';
export type MemoryVisibility = 'public' | 'restricted' | 'private' | 'system';

export interface SharedMemoryEntry {
  id: string;
  agentId: string;
  agentName: string;
  type: MemoryEntryType;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  visibility: MemoryVisibility;
  referencedBy: string[];
  version: number;
  hashLock: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  metadata: Record<string, unknown>;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string | 'broadcast';
  type: 'task_request' | 'task_result' | 'memory_share' | 'alert' | 'heartbeat' | 'custom';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  payload: Record<string, unknown>;
  memoryRef: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  status: 'pending' | 'accepted' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  memoryRefs: string[];
  parentTaskId: string | null;
  subtaskIds: string[];
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}

export interface HubStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  errorAgents: number;
  totalMemories: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgHealthScore: number;
  fiveTCompliance: number;
}
