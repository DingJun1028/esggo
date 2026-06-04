import { AgentTask, SwarmAgent } from '../lib/agent/types';
import { ISwarmSyncService } from '../lib/swarm/ISwarmSyncService';
/**
 * Custom Hook for real-time (WebSocket) Swarm Agent synchronization.
 */
export declare function useSwarmSync(injectedService?: ISwarmSyncService): {
    tasks: AgentTask[];
    agents: SwarmAgent[];
    loading: boolean;
    error: string | null;
    isConnected: boolean;
    lastSync: string;
    refresh: () => void;
};
//# sourceMappingURL=useSwarmSync.d.ts.map