import { ISwarmSyncService, SwarmSyncCallbacks } from './ISwarmSyncService';
export declare class WebSocketSwarmSyncService implements ISwarmSyncService {
    private ws;
    private callbacks;
    private reconnectTimeout;
    connect(callbacks: SwarmSyncCallbacks): void;
    private initializeWebSocket;
    disconnect(): void;
    forceSync(): Promise<void>;
    private mapTasks;
    private deriveAgents;
}
//# sourceMappingURL=WebSocketSwarmSyncService.d.ts.map