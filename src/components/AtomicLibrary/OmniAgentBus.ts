export enum OmniEventType {
  TELEMETRY_HASH_GENERATED = 'TELEMETRY_HASH_GENERATED',
  TELEMETRY_DRAFT_SAVED = 'TELEMETRY_DRAFT_SAVED',
  AGENT_SWARM_DISPATCH = 'AGENT_SWARM_DISPATCH',
  AGENT_SWARM_RESPONSE = 'AGENT_SWARM_RESPONSE',
  COMPONENT_REGISTERED = 'COMPONENT_REGISTERED',
  COMPONENT_UNREGISTERED = 'COMPONENT_UNREGISTERED',
}

export interface OmniEventPayload {
  uuid: string;
  componentName: string;
  type: OmniEventType;
  data: any;
  timestamp: number;
}

type OmniEventHandler = (payload: OmniEventPayload) => void;

class OmniAgentBusImpl {
  private handlers: Record<string, OmniEventHandler[]> = {};

  public on(eventType: OmniEventType, handler: OmniEventHandler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
  }

  public off(eventType: OmniEventType, handler: OmniEventHandler) {
    if (!this.handlers[eventType]) return;
    this.handlers[eventType] = this.handlers[eventType].filter((h) => h !== handler);
  }

  public emit(payload: OmniEventPayload) {
    if (this.handlers[payload.type]) {
      this.handlers[payload.type].forEach((handler) => handler(payload));
    }

    // Global wildcard logger for 5T Traceability in dev/audit mode
    if (
      process.env.NODE_ENV !== 'production' ||
      (typeof window !== 'undefined' && (window as any).__OMNI_DEBUG__)
    ) {
      console.log(`[OmniAgentBus] 📡 ${payload.type} from ${payload.componentName}`, payload);
    }
  }
}

// Singleton Instance
export const OmniAgentBus = new OmniAgentBusImpl();
