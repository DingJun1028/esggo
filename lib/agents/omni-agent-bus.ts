/**
 * OmniAgentBus: High-Speed Event & Message Bus
 * v3.0.0 | High-Resonance Intent Field
 */
export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {
    console.log('[OmniAgent Bus] Initialized - Intent resonance field established.');
  }

  static getInstance() {
    if (!OmniAgentBus.instance) OmniAgentBus.instance = new OmniAgentBus();
    return OmniAgentBus.instance;
  }

  /**
   * Publish an event to the bus.
   * If in a server environment, this also propagates to the Global Intent Layer.
   */
  async publish(event: string, payload: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const eventId = Math.random().toString(36).substring(7);
    
    console.log(`[OmniAgent Bus] 📡 [${timestamp}] [${event}] -> ${JSON.stringify(payload).substring(0, 100)}...`);
    
    // 1. Local Propagation (In-memory listeners)
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(payload));

    // 2. Global Propagation (Bridge to NCBDB/Supabase or SSE Hub)
    try {
      // Check if we are in a server environment
      if (typeof process !== 'undefined' && process.env && process.env.NCBDB_API_TOKEN) {
        const { ncbClient } = await import('../ncbdb');
        await ncbClient.upsertRecord('omni_event_bus', {
          event_type: event,
          payload: JSON.stringify(payload),
          timestamp,
          event_id: eventId,
          source: 'OmniCommander'
        }).catch(err => console.warn('[OmniAgent Bus] Failed to sync to NCBDB:', err));
      }
    } catch (e) {
      // Fail silently
    }
  }

  subscribe(event: string, callback: (payload: Record<string, unknown>) => void) {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, [...callbacks, callback]);
    return () => {
      const updated = (this.listeners.get(event) || []).filter(cb => cb !== callback);
      this.listeners.set(event, updated);
    };
  }
}

export const omniAgentBus = OmniAgentBus.getInstance();
