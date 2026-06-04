/**
 * OmniAgentBus — Event Bus for Multi-Agent Coordination
 * Stub implementation: replace with real event bus (e.g. Redis pub/sub) for production
 */
class OmniAgentBus {
    constructor() {
        this.listeners = new Map();
    }
    on(event, handler) {
        const existing = this.listeners.get(event) || [];
        this.listeners.set(event, [...existing, handler]);
    }
    off(event, handler) {
        const existing = this.listeners.get(event) || [];
        this.listeners.set(event, existing.filter(h => h !== handler));
    }
    emit(event, payload) {
        const handlers = this.listeners.get(event) || [];
        handlers.forEach(h => h(payload));
    }
    once(event, handler) {
        const wrapper = (payload) => {
            handler(payload);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}
export const omniAgentBus = new OmniAgentBus();
export default omniAgentBus;
//# sourceMappingURL=omni-agent-bus.js.map