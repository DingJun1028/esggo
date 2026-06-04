/**
 * OmniAgentBus — Event Bus for Multi-Agent Coordination
 * Stub implementation: replace with real event bus (e.g. Redis pub/sub) for production
 */

type EventHandler = (payload: unknown) => void;

class OmniAgentBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, [...existing, handler]);
  }

  off(event: string, handler: EventHandler) {
    const existing = this.listeners.get(event) || [];
    this.listeners.set(event, existing.filter(h => h !== handler));
  }

  emit(event: string, payload?: unknown) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(h => h(payload));
  }

  once(event: string, handler: EventHandler) {
    const wrapper: EventHandler = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

export const omniAgentBus = new OmniAgentBus();
export default omniAgentBus;
