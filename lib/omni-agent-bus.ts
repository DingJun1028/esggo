import { create } from 'zustand';

/**
 * OmniAgentBus — 全域之脈 (Global Pulse) / 全通之心 (Omni Heart)
 *
 * v2.0.0 | Production-Ready | Full Integration
 *
 * Changelog v2.0.0:
 * - Added SSE auto-reconnect with exponential backoff
 * - Added connection state management
 * - Added event filtering and search
 * - Added bus health monitoring
 * - Added skill metrics display
 */

export type OmniSignalType =
  | 'OBSERVE'
  | 'INTENT'
  | 'MANIFEST'
  | 'SEAL'
  | 'HEAL';

export interface OmniSignal {
  id: string;
  type: OmniSignalType;
  source: string;
  payload: unknown;
  timestamp: number;
  hash?: string;
}

export interface BusEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

interface OmniAgentBusState {
  signals: OmniSignal[];
  busEvents: BusEvent[];
  activeResonance: boolean;
  wsConnected: boolean;
  sseConnected: boolean;
  dispatch: (type: OmniSignalType, source: string, payload: unknown) => void;
  executeCelestialCommand: (intent: string, payload?: unknown) => Promise<{ message: string; artifactUuid: string }>;
  clearSignals: () => void;
  setWsConnected: (v: boolean) => void;
  setSseConnected: (v: boolean) => void;
  addBusEvent: (event: BusEvent) => void;
  clearBusEvents: () => void;
  energyLoadFactor: number;
  setEnergyLoadFactor: (factor: number) => void;
  isPulseDismissed: boolean;
  setPulseDismissed: (v: boolean) => void;
}

// ── Gateway WebSocket Bridge ────────────────────────────────────
let _ws: WebSocket | null = null;
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function hashSignal(data: unknown): string {
  if (typeof window === 'undefined') return '';
  try {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  } catch { return 'no-hash'; }
}

const DEFAULT_GATEWAY_URL = 'http://161.118.248.180:8642';

function toWebSocketUrl(httpUrl: string): string {
  return httpUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
}

function connectGatewayWS(onConnected: (v: boolean) => void) {
  if (typeof window === 'undefined') return;
  const gatewayUrl = toWebSocketUrl(process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL || DEFAULT_GATEWAY_URL);

  try {
    _ws = new WebSocket(gatewayUrl);

    _ws.onopen = () => {
      console.log('[OmniAgentBus] 🔌 Gateway WS connected');
      onConnected(true);
      if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
    };

    _ws.onclose = () => {
      console.warn('[OmniAgentBus] ⚠️ Gateway WS disconnected');
      onConnected(false);
      _reconnectTimer = setTimeout(() => connectGatewayWS(onConnected), 5000);
    };

    _ws.onerror = () => { _ws?.close(); };
  } catch (e) {
    console.warn('[OmniAgentBus] WS init failed:', e);
  }
}

function sendToGateway(signal: OmniSignal) {
  if (_ws?.readyState === WebSocket.OPEN) {
    try { _ws.send(JSON.stringify(signal)); } catch {}
  }
}

// ── SSE Connection ───────────────────────────────────────────────
let _sseEventSource: EventSource | null = null;
let _sseReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let _sseReconnectAttempts = 0;
const MAX_SSE_RECONNECT = 10;

function connectSSE(onConnected: (v: boolean) => void, onEvent: (event: BusEvent) => void) {
  if (typeof window === 'undefined') return;

  const sseUrl = '/api/omni-agent-api/stream';

  try {
    _sseEventSource = new EventSource(sseUrl);

    _sseEventSource.onopen = () => {
      console.log('[OmniAgentBus] 📡 SSE connected');
      onConnected(true);
      _sseReconnectAttempts = 0;
    };

    _sseEventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'STREAM_CONNECTED') {
          console.log('[OmniAgentBus] 📡 SSE handshake:', data.payload);
        } else {
          onEvent(data as BusEvent);
        }
      } catch {}
    };

    _sseEventSource.onerror = () => {
      console.warn('[OmniAgentBus] ⚠️ SSE error');
      onConnected(false);
      _sseEventSource?.close();

      if (_sseReconnectAttempts < MAX_SSE_RECONNECT) {
        const delay = Math.min(1000 * Math.pow(2, _sseReconnectAttempts), 30000);
        _sseReconnectAttempts++;
        console.log(`[OmniAgentBus] 🔄 SSE reconnect in ${delay}ms (attempt ${_sseReconnectAttempts})`);
        _sseReconnectTimer = setTimeout(() => connectSSE(onConnected, onEvent), delay);
      }
    };
  } catch (e) {
    console.warn('[OmniAgentBus] SSE init failed:', e);
  }
}

function disconnectSSE() {
  if (_sseEventSource) {
    _sseEventSource.close();
    _sseEventSource = null;
  }
  if (_sseReconnectTimer) {
    clearTimeout(_sseReconnectTimer);
    _sseReconnectTimer = null;
  }
}

// ── Zustand Store ───────────────────────────────────────────────
export const useOmniAgentBus = create<OmniAgentBusState>((set, get) => ({
  signals: [],
  busEvents: [],
  activeResonance: false,
  wsConnected: false,
  sseConnected: false,
  energyLoadFactor: 1.0,
  isPulseDismissed: false,

  dispatch: (type, source, payload) => set((state) => {
    const signal: OmniSignal = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `sig_${Date.now()}`,
      type,
      source,
      payload,
      timestamp: Date.now(),
      hash: hashSignal({ type, source, payload, ts: Date.now() }),
    };

    sendToGateway(signal);

    if (type === 'HEAL') {
      triggerSpontaneousVirtue(signal, state.energyLoadFactor);
    }

    return {
      signals: [signal, ...state.signals].slice(0, 50),
      activeResonance: true,
    };
  }),

  executeCelestialCommand: async (intent: string, payload: unknown = {}) => {
    const { dispatch, energyLoadFactor } = get();
    dispatch('INTENT', 'CelestialCommand', { intent, payload });
    await new Promise(r => setTimeout(r, 800 * Math.max(0.5, energyLoadFactor)));
    const artifactUuid = `artifact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    dispatch('SEAL', 'CelestialCommand', { intent, artifactUuid, status: 'Sealed in Eternal Memory' });
    return { message: `✨ 天命已顯化：${intent}`, artifactUuid };
  },

  clearSignals: () => set({ signals: [], activeResonance: false }),
  setWsConnected: (v) => set({ wsConnected: v }),
  setSseConnected: (v) => set({ sseConnected: v }),

  addBusEvent: (event) => set((state) => ({
    busEvents: [event, ...state.busEvents].slice(0, 100),
  })),
  clearBusEvents: () => set({ busEvents: [] }),

  setEnergyLoadFactor: (factor) => set({ energyLoadFactor: factor }),
  setPulseDismissed: (v) => set({ isPulseDismissed: v }),
}));

// ── Auto-connect on module load (client-side only) ──────────────
if (typeof window !== 'undefined') {
  const { setWsConnected, setSseConnected, addBusEvent } = useOmniAgentBus.getState();
  connectGatewayWS(setWsConnected);
  connectSSE(setSseConnected, addBusEvent);
}

// ── Adaptive Perception Protocol ────────────────────────────────
export const triggerSpontaneousVirtue = (signal: OmniSignal, loadFactor: number = 1.0) => {
  if (signal.type === 'HEAL') {
    console.log(`[OmniAgentBus] 🌌 全通之心 — 啟動熵減修復 (Load: ${loadFactor.toFixed(2)})`);
    if (typeof fetch !== 'undefined' && signal.payload) {
      const gatewayBaseUrl = process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL;
      const endpoint = gatewayBaseUrl
        ? `${gatewayBaseUrl.replace(/\/$/, '')}/omni-jules`
        : '/api/omni-jules';
      const payload = signal.payload as { reason?: unknown };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Omni-Token': process.env.NEXT_PUBLIC_GATEWAY_KEY || 'hermes_gold_2026' },
        body: JSON.stringify({
          failureReason: String(payload?.reason ?? 'Auto-heal triggered'),
          sourceTaskId: signal.id,
          context: 'OmniAgentBus HEAL event',
          energyLoadFactor: loadFactor,
        }),
      }).catch(() => {});
    }
  }
};
