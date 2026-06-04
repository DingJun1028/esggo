import { AgentTask, SwarmAgent } from '../agent/types';
export interface SwarmSyncCallbacks {
    onTasksUpdated: (tasks: AgentTask[]) => void;
    onAgentsUpdated: (agents: SwarmAgent[]) => void;
    onError: (error: string) => void;
    onStatusChange: (isConnected: boolean) => void;
}
export interface ISwarmSyncService {
    connect(callbacks: SwarmSyncCallbacks): void;
    disconnect(): void;
    forceSync(): Promise<void>;
}
//# sourceMappingURL=ISwarmSyncService.d.ts.map