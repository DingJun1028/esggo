/*
 * OmniAgentBus – lightweight in‑process event bus for the ESGGO ecosystem.
 *
 * Features (v2):
 *   • Bounded event ring buffer (default 200 events) – old events are dropped.
 *   • Async‑friendly broadcast hooks (e.g. SSE, WebSocket) – errors are logged, never crash the bus.
 *   • Persistent storage – events are saved to a JSON file under the Hermes profile folder and
 *     re‑loaded on process start, so a restart does not lose recent events.
 *   • Query API – getEvents({limit, event, afterTs}) to retrieve recent events.
 *   • Autonomy ticker – startAutonomy(interval) emits a `system:autonomy:tick` event on a interval.
 *   • Simple subscribe/unsubscribe API returning a cancel function.
 *   • Global notification shortcut – broadcastGlobalNotification(msg, context).
 *
 * Usage example (any Hermes task or external script):
 *   const { omniBus } = require('./lib/agents/omni-agent-bus');
 *   omniBus.subscribe('my:event', payload => console.log('got', payload));
 *   omniBus.publish('my:event', { foo: 'bar' });
 *   // register an async SSE hook
 *   omniBus.registerBroadcastHook(async ev => await sendSse(ev));
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

/** Maximum number of events kept in memory – can be overridden with env var */
const MAX_EVENTS = Number(process.env.OMNI_BUS_MAX_EVENTS || '200');
/** File where the ring buffer is persisted – resolved relative to HERMES_HOME */
const PERSIST_PATH = path.resolve(
  process.env.HERMES_HOME || path.resolve(__dirname, '../../..'),
  'omni-bus',
  'events.json'
);

/** Simple envelope for each event */
function makeEvent(event, payload) {
  return { event, payload, ts: Date.now() };
}

class OmniAgentBus {
  constructor() {
    /** @type {EventEmitter} */
    this.emitter = new EventEmitter();
    /** @type {Array<Object>} */
    this.events = [];
    /** @type {Set<Function>} */
    this.broadcastHooks = new Set();
    this.autonomyTimer = null;
    this.persistTimer = null;
    this._loadPersisted();
  }

  /** Singleton accessor */
  static getInstance() {
    if (!OmniAgentBus._instance) {
      OmniAgentBus._instance = new OmniAgentBus();
    }
    return OmniAgentBus._instance;
  }

  /** Publish an event – sync listeners are called immediately, async hooks are fire‑and‑forget. */
  publish(event, payload) {
    const ev = makeEvent(event, payload);
    // keep ring buffer bounded
    this.events.push(ev);
    if (this.events.length > MAX_EVENTS) this.events.shift();

    // sync listeners
    this.emitter.emit(event, payload);

    // async broadcast hooks – catch errors individually
    for (const hook of this.broadcastHooks) {
      try {
        const result = hook(ev);
        if (result && typeof result.then === 'function') {
          result.catch(err => console.error('[OmniAgentBus] broadcast hook error:', err));
        }
      } catch (err) {
        console.error('[OmniAgentBus] broadcast hook threw:', err);
      }
    }

    // debug output (useful in dev, harmless in prod)
    console.debug(`[OmniAgentBus] publish ${event}`, payload);
    this._schedulePersist();
  }

  /** Subscribe to an event – returns a function to unsubscribe. */
  subscribe(event, callback) {
    this.emitter.on(event, callback);
    return () => this.emitter.removeListener(event, callback);
  }

  /** Register a broadcast hook (e.g. SSE push). Hook may be sync or async. */
  registerBroadcastHook(hook) {
    this.broadcastHooks.add(hook);
  }

  /** Unregister a previously registered broadcast hook. */
  unregisterBroadcastHook(hook) {
    this.broadcastHooks.delete(hook);
  }

  /** Retrieve recent events with optional filters. */
  getEvents({ limit, event, afterTs } = {}) {
    let filtered = this.events;
    if (event) filtered = filtered.filter(e => e.event === event);
    if (afterTs !== undefined) filtered = filtered.filter(e => e.ts > afterTs);
    if (limit !== undefined) filtered = filtered.slice(-limit);
    return filtered;
  }

  /** Convenience shortcut for a global sync notification. */
  broadcastGlobalNotification(msg, context) {
    this.publish('system:global:sync', { msg, context });
  }

  /** Start autonomy ticking – emits `system:autonomy:tick` at the given interval (ms). */
  startAutonomy(intervalMs = 60_000) {
    if (this.autonomyTimer) return; // already running
    this.autonomyTimer = setInterval(() => {
      this.publish('system:autonomy:tick', { ts: Date.now() });
    }, intervalMs);
    console.debug('[OmniAgentBus] autonomy started, intervalMs=', intervalMs);
  }

  /** Stop the autonomy ticker. */
  stopAutonomy() {
    if (this.autonomyTimer) {
      clearInterval(this.autonomyTimer);
      this.autonomyTimer = null;
      console.debug('[OmniAgentBus] autonomy stopped');
    }
  }

  /** --------------------------------------------------- */
  /** Schedule a persist to disk – debounce to avoid excessive I/O. */
  _schedulePersist() {
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null;
      this._persistToDisk();
    }, 500); // 0.5 s debounce
  }

  /** Write the current ring buffer to JSON file. */
  _persistToDisk() {
    try {
      const dir = path.dirname(PERSIST_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(PERSIST_PATH, JSON.stringify(this.events, null, 2), 'utf-8');
      console.debug('[OmniAgentBus] persisted', this.events.length, 'events to', PERSIST_PATH);
    } catch (err) {
      console.error('[OmniAgentBus] persist error:', err);
    }
  }

  /** Load persisted events on startup – only the most recent MAX_EVENTS are kept. */
  _loadPersisted() {
    try {
      if (fs.existsSync(PERSIST_PATH)) {
        const raw = fs.readFileSync(PERSIST_PATH, 'utf-8');
        const loaded = JSON.parse(raw);
        if (Array.isArray(loaded)) {
          this.events = loaded.slice(-MAX_EVENTS);
          console.debug('[OmniAgentBus] loaded', this.events.length, 'events from', PERSIST_PATH);
        }
      }
    } catch (err) {
      console.error('[OmniAgentBus] load error:', err);
    }
  }
}

// Export a ready‑to‑use singleton for convenience
module.exports = {
  OmniAgentBus,
  omniBus: OmniAgentBus.getInstance()
};
