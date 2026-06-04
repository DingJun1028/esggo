/**
 * OmniAgent Stream Hook
 * ─────────────────────
 * React hook that subscribes to the OmniAgentBus SSE stream.
 * Provides real-time event feed, connection status, and mission tracking.
 *
 * 5T Protocol: T5 Trackable — lifecycle-aware frontend propagation.
 */
export interface StreamEvent {
    id: string;
    event: string;
    payload: Record<string, unknown>;
    timestamp: string;
}
export interface MissionProgress {
    mission: string;
    status: 'running' | 'complete' | 'error';
    startedAt: string;
    completedAt?: string;
    totalProcessed?: number;
    error?: string;
}
export interface UseOmniAgentStreamResult {
    events: StreamEvent[];
    isConnected: boolean;
    connectionError: string | null;
    activeMissions: MissionProgress[];
    lastSeal: StreamEvent | null;
    agentActivity: Map<string, StreamEvent>;
    reconnect: () => void;
    clearEvents: () => void;
}
export declare function useOmniAgentStream(): UseOmniAgentStreamResult;
//# sourceMappingURL=useOmniAgentStream.d.ts.map