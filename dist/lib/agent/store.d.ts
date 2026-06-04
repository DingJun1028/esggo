import type { AgentTask, AgentExecution, AgentArtifact } from './types';
export declare let GLOBAL_TASKS: AgentTask[];
export declare const GLOBAL_EXECUTIONS: AgentExecution[];
export declare const GLOBAL_ARTIFACTS: AgentArtifact[];
/**
 * Persists task to Data Connect and updates local cache.
 */
export declare function addTask(task: AgentTask): Promise<void>;
/**
 * Updates task in Data Connect and local cache.
 */
export declare function updateTask(taskId: string, patch: Partial<AgentTask>): Promise<void>;
/**
 * Syncs the local cache with the latest Data Connect state.
 */
export declare function syncTasksFromDB(): Promise<void>;
export declare function addExecution(exec: AgentExecution): void;
export declare function updateExecution(execId: string, patch: Partial<AgentExecution>): void;
export declare function addArtifact(art: AgentArtifact): void;
export declare function createArtifactVersion(artId: string, patch: Partial<AgentArtifact>): AgentArtifact | undefined;
export declare function updateArtifact(artId: string, patch: Partial<AgentArtifact>): void;
export declare function getArtifact(artId: string): AgentArtifact | undefined;
export declare function getLatestArtifactByTask(taskId: string): AgentArtifact | undefined;
export declare function getArtifactVersions(taskId: string): AgentArtifact[];
//# sourceMappingURL=store.d.ts.map