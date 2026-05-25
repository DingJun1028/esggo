import type { AgentTask, AgentExecution, AgentArtifact } from './types';
import { dcUpsertSwarmAgentTask, dcListSwarmAgentTasks } from '../dataconnect-services';

// Note: Global in-memory lists are now fallback/cache-only.
// Real persistence is now handled via Firebase Data Connect.

export let GLOBAL_TASKS: AgentTask[] = [];
export const GLOBAL_EXECUTIONS: AgentExecution[] = [];
export const GLOBAL_ARTIFACTS: AgentArtifact[] = [];

/**
 * Persists task to Data Connect and updates local cache.
 */
export async function addTask(task: AgentTask) {
  try {
    await dcUpsertSwarmAgentTask({
      id: task.id,
      title: task.title,
      taskType: task.taskType,
      status: task.status,
      skillKey: task.skillKey,
      progress: 0
    });
    GLOBAL_TASKS.unshift(task);
  } catch (e) {
    console.warn('AgentStore: Failed to persist task, using in-memory only.', e);
    GLOBAL_TASKS.unshift(task);
  }
}

/**
 * Updates task in Data Connect and local cache.
 */
export async function updateTask(taskId: string, patch: Partial<AgentTask>) {
  const idx = GLOBAL_TASKS.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    const updated = { ...GLOBAL_TASKS[idx], ...patch, updatedAt: new Date().toISOString() };
    GLOBAL_TASKS[idx] = updated;

    try {
      await dcUpsertSwarmAgentTask({
        id: taskId,
        title: updated.title,
        taskType: updated.taskType,
        status: updated.status,
        skillKey: updated.skillKey,
        progress: 0 // Default or extract from patch if added to AgentTask type
      });
    } catch (e) {
      console.error('AgentStore: Update persistence failed', e);
    }
  }
}

/**
 * Syncs the local cache with the latest Data Connect state.
 */
export async function syncTasksFromDB() {
  const remoteTasks = await dcListSwarmAgentTasks();
  // Map schema type to AgentTask interface
  GLOBAL_TASKS = remoteTasks.map(t => ({
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
}

// --- Executions & Artifacts (Remaining In-Memory for now) ---

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

export function createArtifactVersion(artId: string, patch: Partial<AgentArtifact>): AgentArtifact | undefined {
  const original = getArtifact(artId);
  if (!original) return undefined;

  const newVersion: AgentArtifact = {
    ...original,
    ...patch,
    id: `${original.taskId}_v${original.version + 1}_${Math.random().toString(36).slice(2, 6)}`,
    version: original.version + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  GLOBAL_ARTIFACTS.unshift(newVersion);
  return newVersion;
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

export function getLatestArtifactByTask(taskId: string): AgentArtifact | undefined {
  return GLOBAL_ARTIFACTS
    .filter(a => a.taskId === taskId)
    .sort((a, b) => b.version - a.version)[0];
}

export function getArtifactVersions(taskId: string): AgentArtifact[] {
  return GLOBAL_ARTIFACTS
    .filter(a => a.taskId === taskId)
    .sort((a, b) => b.version - a.version);
}
