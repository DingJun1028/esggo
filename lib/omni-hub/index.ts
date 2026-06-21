// lib/omni-hub/index.ts
// 萬能中心 (OmniHub) — 統一入口

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

export type {
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
};

export { OmniHub } from './hub';
export { SharedMemory } from './memory';
export { FacilityRegistry } from './registry';
export { createWSClient } from './websocket';
export { MemorySearchEngine } from './search';
export {
  realtime,
  emitFacilityStatus,
  emitMemoryUpdate,
  emitTaskUpdate,
  emitAgentMessage,
} from './realtime';
export type { WSMessage } from './websocket';
export type { SearchResult, SearchOptions } from './search';
