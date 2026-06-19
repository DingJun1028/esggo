import { InfoOneCore } from '../omni/core/InfoOneCore.js';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🔄 InfoOne Sync Domain Service
 * --------------------------------------------------
 * [TC] 雙向同步領域服務。負責將 InfoOne 狀態同步至前端與外部網路。
 * [EN] Bidirectional Synchronization Domain Service. Syncs InfoOne state to frontend and external networks.
 * 
 * [Features]
 * - WebSocket Simulation (Bidirectional)
 * - Matrix Event Handling (Start/End)
 * - State Replication
 */
export class InfoOneSyncDomain {
    private static instance: InfoOneSyncDomain;
    private subscribers: Map<string, (state: any) => void> = new Map();

    private constructor() { }

    public static getInstance(): InfoOneSyncDomain {
        if (!InfoOneSyncDomain.instance) {
            InfoOneSyncDomain.instance = new InfoOneSyncDomain();
        }
        return InfoOneSyncDomain.instance;
    }

    /**
     * 📡 Broadcast State Update
     * --------------------------------------------------
     * Validates if the agent is ACTIVE before broadcasting.
     */
    public broadcastState(agent: InfoOneCore): void {
        if (agent.status !== 'ACTIVE' && agent.status !== 'OPTIMIZING') {
            console.warn(`[Sync Domain] Broadcast suppressed. Agent ${agent.uuid} is ${agent.status}.`);
            return;
        }

        const payload = {
            uuid: agent.uuid,
            matrixStatus: agent.activationMatrix.status,
            timestamp: Date.now(),
            syncHash: this.generateSyncHash(agent),
        };

        omniLogger.info(LogCategory.SYSTEM, '[InfoOneSyncDomain] Info', { data: `[Sync Domain] Broadcasting State for ${agent.uuid} to ${this.subscribers.size} subscribers.` });

        // Notify all subscribers
        this.subscribers.forEach((callback) => callback(payload));
    }

    /**
     * 👂 Subscribe to Matrix Events
     */
    public subscribe(clientId: string, callback: (state: any) => void): void {
        this.subscribers.set(clientId, callback);
        omniLogger.info(LogCategory.SYSTEM, '[InfoOneSyncDomain] Info', { data: `[Sync Domain] Client ${clientId} subscribed to Matrix Events.` });
    }

    /**
     * 📥 Receive External Signal (e.g., from Frontend)
     */
    public receiveSignal(agent: InfoOneCore, signal: { type: string; payload: any }): void {
        omniLogger.info(LogCategory.SYSTEM, '[InfoOneSyncDomain] Info', { data: `[Sync Domain] Received signal: ${signal.type} for ${agent.uuid}` });

        if (signal.type === 'HEARTBEAT') {
            agent.syncState({
                target: signal.payload.source,
                timestamp: signal.payload.timestamp,
            });
        }
    }

    private generateSyncHash(agent: InfoOneCore): string {
        return `SYNC-${agent.uuid.substring(0, 8)}-${Date.now()}`;
    }
}
