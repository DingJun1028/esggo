import { create } from 'zustand';

/**
 * OmniAgentBus — 全域之脈 (Global Pulse) / 全通之心 (Omni Heart)
 * 
 * 架構：
 *   UI 事件 → dispatch() → Zustand Store → WebSocket Bridge → Gateway WS
 *                                         ↘ triggerSpontaneousVirtue()
 * 
 * 五大訊號對應「六位一體」智慧中樞：
 *   OBSERVE  → 全知之眼 (感知器)
 *   INTENT   → 全能之核 (指揮器)
 *   MANIFEST → 全息之腦 (顯化器)
 *   SEAL     → 全境之骨 (治理器) — 5T Hash Lock
 *   HEAL     → 全通之心 (自發治理) — OmniJules Karma Protocol
 */

export type OmniSignalType =
  | 'OBSERVE'     // 全知之眼 — Capture event
  | 'INTENT'      // 全能之核 — Issue directive
  | 'MANIFEST'    // 全息之腦 — UI manifestation
  | 'SEAL'        // 全境之骨 — 5T immutable seal
  | 'HEAL';       // 全通之心 — Entropy reduction / self-repair

export interface OmniSignal {
  id: string;
  type: OmniSignalType;
  source: string;
  payload: unknown;
  timestamp: number;
  hash?: string;
}

interface OmniAgentBusState {
  signals: OmniSignal[];
  activeResonance: boolean;
  wsConnected: boolean;
  dispatch: (type: OmniSignalType, source: string, payload: unknown) => void;
  executeCelestialCommand: (intent: string, payload?: unknown) => Promise<{ message: string; artifactUuid: string }>;
  clearSignals: () => void;
  setWsConnected: (v: boolean) => void;
  energyLoadFactor: number; // JES Monitor Load Factor
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
    // Browser-safe simple hash (no Node crypto)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  } catch { return 'no-hash'; }
}

function connectGatewayWS(onConnected: (v: boolean) => void) {
  if (typeof window === 'undefined') return;
  const gatewayUrl = (process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL || 'http://161.118.248.180:8080')
    .replace(/^http/, 'ws');

  try {
    _ws = new WebSocket(gatewayUrl);

    _ws.onopen = () => {
      console.log('[OmniAgentBus] 🔌 Gateway WS connected — 全通之心 activated');
      onConnected(true);
      if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
    };

    _ws.onclose = () => {
      console.warn('[OmniAgentBus] ⚠️  Gateway WS disconnected — scheduling reconnect');
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

// ── Zustand Store ───────────────────────────────────────────────
export const useOmniAgentBus = create<OmniAgentBusState>((set, get) => ({
  signals: [],
  activeResonance: false,
  wsConnected: false,
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

    // Bridge to Gateway WS
    sendToGateway(signal);

    // Trigger self-healing if HEAL signal
    if (type === 'HEAL') {
      triggerSpontaneousVirtue(signal, state.energyLoadFactor);
    }

    return {
      signals: [signal, ...state.signals].slice(0, 50), // Ring buffer: 50 signals
      activeResonance: true,
    };
  }),

  executeCelestialCommand: async (intent: string, payload: unknown = {}) => {
    const { dispatch, energyLoadFactor } = get();
    dispatch('INTENT', 'CelestialCommand', { intent, payload });

    // Adaptive delay based on JES energy load factor
    await new Promise(r => setTimeout(r, 800 * Math.max(0.5, energyLoadFactor)));

    const artifactUuid = `artifact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    dispatch('SEAL', 'CelestialCommand', { intent, artifactUuid, status: 'Sealed in Eternal Memory' });

    return { message: `✨ 天命已顯化：${intent}`, artifactUuid };
  },

  clearSignals: () => set({ signals: [], activeResonance: false }),

  setWsConnected: (v) => set({ wsConnected: v }),
  setEnergyLoadFactor: (factor) => set({ energyLoadFactor: factor }),
  setPulseDismissed: (v) => set({ isPulseDismissed: v }),
}));

// ── Auto-connect WS on module load (client-side only) ──────────
if (typeof window !== 'undefined') {
  const { setWsConnected } = useOmniAgentBus.getState();
  connectGatewayWS(setWsConnected);
}

// ── Adaptive Perception Protocol ────────────────────────────────
export const triggerSpontaneousVirtue = (signal: OmniSignal, loadFactor: number = 1.0) => {
  if (signal.type === 'HEAL') {
    console.log(`[OmniAgentBus] 🌌 全通之心 — 啟動熵減與圓通無礙修復 (Load Factor: ${loadFactor.toFixed(2)})`);
    // Forward to internal /api/omni-jules or external gateway
    if (typeof fetch !== 'undefined' && signal.payload) {
      const endpoint = process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL 
        ? `${process.env.NEXT_PUBLIC_OMNIAGENT_GATEWAY_URL}/omni-jules`
        : '/api/omni-jules';
        
      fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Omni-Token': process.env.NEXT_PUBLIC_GATEWAY_KEY || 'hermes_gold_2026' },
          body: JSON.stringify({ 
            failureReason: String((signal.payload as any)?.reason || 'Auto-heal triggered by OmniAgentBus HEAL signal'), 
            sourceTaskId: signal.id, 
            context: 'OmniAgentBus HEAL event',
            energyLoadFactor: loadFactor 
          }),
        }
      ).catch(() => {}); // Fire-and-forget
    }
  }
};
