import { IOmniRealtimeService, OmniEvent } from '../lib/realtime/IOmniRealtimeService';
export declare function useOmniRealtime(injectedService?: IOmniRealtimeService): {
    events: OmniEvent[];
    isStreaming: boolean;
    onlineUsers: unknown[];
    emitEvent: (event: Omit<OmniEvent, "id" | "timestamp">) => Promise<void>;
};
//# sourceMappingURL=useOmniRealtime.d.ts.map