// Simple OmniAgentBus – lightweight in‑process event bus for ESGGO
// Provides publish/subscribe, optional ring‑buffer, and async broadcast hooks.

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

// Configuration – can be overridden via env vars
const MAX_EVENTS = Number(process.env.OMNI_BUS_MAX_EVENTS || '200');
const PERSIST_PATH = path.resolve(
  process.env.HERMES_HOME || path.resolve(__dirname, '../../..'),
  'omni-bus',
  'events.json'
);
// ==== 主類別 ==============================================================
class OmniAgentBus {
  constructor() {
    this.broadcastHooks = new Set();
    this.blackboard = new Map();
    this.lastEventTimestamp = Date.now(); // track last publish
  }

  // ---------- 事件發布 ----------
  publish(event, payload) {
    const ev = {
      uuid: require('uuid').v4(),
      version: '1.0.0',
      timestamp: Date.now(),
      event,
      payload,
    };
    this.lastEventTimestamp = ev.timestamp;
    for (const h of this.broadcastHooks) h(ev);
    return ev;
  }

  // ---------- 取得閒置時間（毫秒） ----------
  idleDuration() {
    return Date.now() - this.lastEventTimestamp;
  }

  // ---------- 黑板寫入 ----------
  writeEntry(entry) {
    this.blackboard.set(entry.uuid, entry);
    this.publish('blackboard:entry', entry);
  }

  // ---------- 自癒 Hook ----------
  registerSelfHealHook() {
    this.broadcastHooks.add(async ev => {
      if (ev.event !== 'system:error' && ev.event !== 'managed:mutation') return;
      const isManaged = ev.event === 'managed:mutation';
      const payload = ev.payload;
      console.debug('[OAB] 觸發自癒 Hook', ev.uuid, isManaged ? '(managed mutation)' : '');

      // 若為 managed mutation，視為輕微錯誤
      const errorInfo = isManaged
        ? { type: 'managed-mutation', target: payload.target, detail: payload.detail }
        : payload;

      const action = {
        uuid: require('uuid').v4(),
        version: '1.0.0',
        timestamp: Date.now(),
        source_origin: 'OAB-selfHeal',
        tags: ['heal'],
        evidence: {},
        payload: this.decideHealing(errorInfo),
      };

      // 寫入黑板
      this.writeEntry({
        uuid: action.uuid,
        version: action.version,
        timestamp: action.timestamp,
        source_origin: action.source_origin,
        tags: action.tags,
        payload: action.payload,
        evidence: action.evidence,
      });

      // 發布 heal 事件讓 OAG 執行
      this.publish('system:heal', action);
    });
  }

  /** 依錯誤類型產生修復指令（簡易範例） */
  decideHealing(err) {
    const { type, target } = err;
    switch (type) {
      case 'http-failure':
        return { action: 'retry', target, detail: { maxAttempts: 3 } };
      case 'fs-corrupt':
        return { action: 'rollback', target, detail: { backup: `${target}.bak` } };
      case 'process-killed':
        return { action: 'restart', target, detail: {} };
      case 'managed-mutation':
        // 輕微錯誤只需要 notify
        return { action: 'notify', target, detail: { message: 'Managed mutation observed' } };
      default:
        return { action: 'notify', target, detail: { message: err.message || 'unknown' } };
    }
  }
}

export const omniBus = new OmniAgentBus();
omniBus.registerSelfHealHook();   // 立即註冊自癒 Hook
  constructor() {
    /** @type {EventEmitter} */
    this.emitter = new EventEmitter();
    /** @type {Array<{event:string,payload:any,ts:number}>} */
    this.events = [];
    /** @type {Set<Function>} */
    this.broadcastHooks = new Set();
    this.autonomyTimer = null;
    this.persistTimer = null;
    this._loadPersisted();
  }

  static getInstance() {
    if (!OmniAgentBus._instance) {
      OmniAgentBus._instance = new OmniAgentBus();
    }
    return OmniAgentBus._instance;
  }

  // ---------- Core API ----------
  publish(event, payload) {
    const ev = { event, payload, ts: Date.now() };
    this.events.push(ev);
    if (this.events.length > MAX_EVENTS) this.events.shift();
    this.emitter.emit(event, payload);
    // async broadcast hooks – fire‑and‑forget, log errors
    for (const hook of this.broadcastHooks) {
      try {
        const res = hook(ev);
        if (res && typeof res.then === 'function') {
          res.catch(err => console.error('[OmniAgentBus] broadcast hook error:', err));
        }
      } catch (err) {
        console.error('[OmniAgentBus] broadcast hook threw:', err);
      }
    }
    console.debug(`[OmniAgentBus] publish ${event}`, payload);
    this._schedulePersist();
  }

  subscribe(event, cb) {
    this.emitter.on(event, cb);
    return () => this.emitter.removeListener(event, cb);
  }

  registerBroadcastHook(hook) { this.broadcastHooks.add(hook); }
  unregisterBroadcastHook(hook) { this.broadcastHooks.delete(hook); }

  getEvents({ limit, event, afterTs } = {}) {
    let filtered = this.events;
    if (event) filtered = filtered.filter(e => e.event === event);
    if (afterTs !== undefined) filtered = filtered.filter(e => e.ts > afterTs);
    if (limit !== undefined) filtered = filtered.slice(-limit);
    return filtered;
  }

  broadcastGlobalNotification(msg, context) {
    this.publish('system:global:sync', { msg, context });
  }

  startAutonomy(intervalMs = 60_000) {
    if (this.autonomyTimer) return;
    this.autonomyTimer = setInterval(() => {
      this.publish('system:autonomy:tick', { ts: Date.now() });
    }, intervalMs);
    console.debug('[OmniAgentBus] autonomy started, intervalMs=', intervalMs);
  }

  stopAutonomy() {
    if (this.autonomyTimer) {
      clearInterval(this.autonomyTimer);
      this.autonomyTimer = null;
      console.debug('[OmniAgentBus] autonomy stopped');
    }
  }

  // ---------- Persistence ----------
  _schedulePersist() {
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null;
      this._persistToDisk();
    }, 500);
  }

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

  _loadPersisted() {
    try {
      if (fs.existsSync(PERSIST_PATH)) {
        const raw = fs.readFileSync(PERSIST_PATH, 'utf-8');
        const loaded = JSON.parse(raw);
        if (Array.isArray(loaded)) this.events = loaded.slice(-MAX_EVENTS);
        console.debug('[OmniAgentBus] loaded', this.events.length, 'events from', PERSIST_PATH);
      }
    } catch (err) {
      console.error('[OmniAgentBus] load error:', err);
    }
  }
}

module.exports = {
  OmniAgentBus,
  omniBus: OmniAgentBus.getInstance()
};

// If this file is executed directly, start Autonomy ticker and keep the process alive
if (require.main === module) {
  omniBus.startAutonomy();
  console.debug('[OmniAgentBus] Autonomy started automatically on direct exec');
  // Keep the process alive (no tty)
  process.stdin.resume();
}

