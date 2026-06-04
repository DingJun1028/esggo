/**
 * OmniAgentBus — Event Bus for Multi-Agent Coordination
 * Stub implementation: replace with real event bus (e.g. Redis pub/sub) for production
 */
type EventHandler = (payload: unknown) => void;
declare class OmniAgentBus {
    private listeners;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    emit(event: string, payload?: unknown): void;
    once(event: string, handler: EventHandler): void;
}
export declare const omniAgentBus: OmniAgentBus;
export default omniAgentBus;
//# sourceMappingURL=omni-agent-bus.d.ts.map