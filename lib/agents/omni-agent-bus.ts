/**
 * OmniAgentBus: High-Speed Event & Message Bus
 * v4.0.0 | High-Resonance Intent Field + SSE Bridge
 *
 * 5T Protocol Gate: T5 Trackable — lifecycle-aware event propagation.
 * Now includes a pluggable SSE broadcast hook for real-time frontend observability.
 */

export type BusBroadcastHook = (event: string, payload: Record<string, unknown>) => void;

export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private listeners: Map<string, Function[]> = new Map();
  private broadcastHooks: BusBroadcastHook[] = [];

  private constructor() {
    console.log('[OmniAgent Bus] Initialized - Intent resonance field established.');
  }

  static getInstance() {
    if (!OmniAgentBus.instance) OmniAgentBus.instance = new OmniAgentBus();
    return OmniAgentBus.instance;
  }

  /**
   * Register a broadcast hook (e.g., SSE pushBusEvent).
   * All future publish() calls will also invoke this hook.
   */
  registerBroadcastHook(hook: BusBroadcastHook) {
    if (!this.broadcastHooks.includes(hook)) {
      this.broadcastHooks.push(hook);
      console.log(`[OmniAgent Bus] 🔗 Broadcast hook registered (total: ${this.broadcastHooks.length})`);
    }
  }

  /**
   * Unregister a previously registered broadcast hook.
   */
  unregisterBroadcastHook(hook: BusBroadcastHook) {
    this.broadcastHooks = this.broadcastHooks.filter(h => h !== hook);
  }

  /**
   * Publish an event to the bus.
   * Propagates to: 1) Local listeners, 2) SSE broadcast hooks, 3) NCBDB persistence.
   */
  async publish(event: string, payload: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const eventId = Math.random().toString(36).substring(7);
    
    console.log(`[OmniAgent Bus] 📡 [${timestamp}] [${event}] -> ${JSON.stringify(payload).substring(0, 100)}...`);
    
    // 1. Local Propagation (In-memory listeners)
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(payload));

    // 2. SSE Bridge Propagation (Push to all registered broadcast hooks)
    for (const hook of this.broadcastHooks) {
      try {
        hook(event, { ...payload, _busEventId: eventId, _busTimestamp: timestamp });
      } catch (e) {
        console.warn('[OmniAgent Bus] Broadcast hook error:', e);
      }
    }

    // 3. Global Propagation (Bridge to NCBDB/Supabase)
    try {
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

  /**
   * Get current hook count (for diagnostics).
   */
  get hookCount(): number {
    return this.broadcastHooks.length;
  }
}

export const omniAgentBus = OmniAgentBus.getInstance();
