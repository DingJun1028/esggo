export interface OmniEvent {
    id: string;
    type: 'TRACE' | 'COMPUTE' | 'SEAL' | 'MEMORY';
    payload: string;
    timestamp: string;
    integrity_hash?: string;
    user_email?: string;
}

export interface RealtimeCallbacks {
    onPresenceSync: (users: Record<string, unknown>[]) => void;
    onEventReceived: (event: OmniEvent) => void;
    onStatusChange: (isStreaming: boolean) => void;
}

export interface IOmniRealtimeService {
    connect(user: Record<string, unknown> | null, callbacks: RealtimeCallbacks): void;
    disconnect(): void;
    emitEvent(event: Omit<OmniEvent, 'id' | 'timestamp'>, user: Record<string, unknown> | null): Promise<OmniEvent>;
}