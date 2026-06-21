// lib/omni-agent-hub/types.ts
// 萬能代理中心 — 核心型別定義

/** 代理狀態 */
export type AgentStatus = 'registered' | 'idle' | 'running' | 'paused' | 'error' | 'deregistered';

/** 代理角色 */
export type AgentRole =
  | 'orchestrator' // 總指揮
  | 'analyst' // 分析師
  | 'writer' // 撰寫者
  | 'auditor' // 稽核員
  | 'researcher' // 研究員
  | 'calculator' // 計算者
  | 'coordinator' // 協調者
  | 'guardian' // 守護者
  | 'custom'; // 自訂

/** 代理能力 */
export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  version: string;
}

/** 代理註冊資訊 */
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
  healthScore: number; // 0-100
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  registeredAt: string;
  lastHeartbeat: string;
  metadata: Record<string, unknown>;
}

/** 共享記憶條目 */
export interface SharedMemoryEntry {
  id: string;
  agentId: string; // 建立者
  agentName: string;
  type: MemoryEntryType;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  visibility: MemoryVisibility;
  referencedBy: string[]; // 引用此記憶的代理 IDs
  version: number;
  hashLock: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  metadata: Record<string, unknown>;
}

/** 記憶類型 */
export type MemoryEntryType =
  | 'task_result' // 任務結果
  | 'insight' // 洞察
  | 'evidence' // 證據
  | 'decision' // 決策
  | 'learning' // 學習
  | 'context' // 上下文
  | 'warning' // 警告
  | 'custom'; // 自訂

/** 記憶可見性 */
export type MemoryVisibility =
  | 'public' // 所有代理可讀
  | 'restricted' // 指定代理可讀
  | 'private' // 僅建立者可讀
  | 'system'; // 系統級

/** 代理間訊息 */
export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string | 'broadcast';
  type: 'task_request' | 'task_result' | 'memory_share' | 'alert' | 'heartbeat' | 'custom';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  payload: Record<string, unknown>;
  memoryRef: string | null; // 關聯的共享記憶 ID
  createdAt: string;
  expiresAt: string | null;
}

/** 代理任務 */
export interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedBy: string; // 分派者代理 ID
  assignedTo: string; // 執行者代理 ID
  status: 'pending' | 'accepted' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  memoryRefs: string[]; // 關聯的共享記憶 IDs
  parentTaskId: string | null;
  subtaskIds: string[];
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}

/** 代理中心統計 */
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
