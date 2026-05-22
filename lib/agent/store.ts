import type { AgentTask, AgentExecution, AgentArtifact } from './types';

// In-memory store for dev/prototype purposes.
// Note: This will reset when the Next.js dev server restarts.

export const GLOBAL_TASKS: AgentTask[] = [];
export const GLOBAL_EXECUTIONS: AgentExecution[] = [];
export const GLOBAL_ARTIFACTS: AgentArtifact[] = [];

export function addTask(task: AgentTask) {
  GLOBAL_TASKS.unshift(task);
}

export function updateTask(taskId: string, patch: Partial<AgentTask>) {
  const idx = GLOBAL_TASKS.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    GLOBAL_TASKS[idx] = { ...GLOBAL_TASKS[idx], ...patch, updatedAt: new Date().toISOString() };
  }
}

export function addExecution(exec: AgentExecution) {
  GLOBAL_EXECUTIONS.unshift(exec);
}

export function updateExecution(execId: string, patch: Partial<AgentExecution>) {
  const idx = GLOBAL_EXECUTIONS.findIndex(e => e.id === execId);
  if (idx !== -1) {
    GLOBAL_EXECUTIONS[idx] = { ...GLOBAL_EXECUTIONS[idx], ...patch, updatedAt: new Date().toISOString() };
  }
}

export function addArtifact(art: AgentArtifact) {
  GLOBAL_ARTIFACTS.unshift(art);
}

export function updateArtifact(artId: string, patch: Partial<AgentArtifact>) {
  const idx = GLOBAL_ARTIFACTS.findIndex(a => a.id === artId);
  if (idx !== -1) {
    GLOBAL_ARTIFACTS[idx] = { ...GLOBAL_ARTIFACTS[idx], ...patch, updatedAt: new Date().toISOString() };
  }
}

export function getArtifact(artId: string): AgentArtifact | undefined {
  return GLOBAL_ARTIFACTS.find(a => a.id === artId);
}
