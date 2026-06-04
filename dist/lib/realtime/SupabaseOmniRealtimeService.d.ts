import { IOmniRealtimeService, OmniEvent, RealtimeCallbacks } from './IOmniRealtimeService';
export declare class SupabaseOmniRealtimeService implements IOmniRealtimeService {
    private channel;
    private isConnected;
    connect(user: Record<string, any> | null, callbacks: RealtimeCallbacks): void;
    disconnect(): void;
    emitEvent(event: Omit<OmniEvent, 'id' | 'timestamp'>, user: Record<string, any> | null): Promise<OmniEvent>;
}
export declare const omniRealtime: SupabaseOmniRealtimeService;
//# sourceMappingURL=SupabaseOmniRealtimeService.d.ts.map