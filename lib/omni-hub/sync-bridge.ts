// lib/omni-hub/sync-bridge.ts
// 萬能中心 — 多機同步橋接
// 本機啟動後自動連到 VPS WS server，收到遠端事件時注入本地 realtime bus

import { createWSClient, type WSClientOptions } from './websocket';
import { realtime } from './realtime';

let wsClient: ReturnType<typeof createWSClient> | null = null;

export function initSyncBridge(wsUrl: string, token?: string) {
  if (wsClient) return wsClient;

  const options: WSClientOptions = {
    url: wsUrl,
    token,
    onMessage: (msg) => {
      // 收到遠端事件 → 注入本地 realtime bus
      realtime.emit(msg.type, msg.payload);
    },
    onConnect: () => {
      console.log('[SyncBridge] Connected to VPS WS server');
    },
    onDisconnect: () => {
      console.log('[SyncBridge] Disconnected from VPS');
    },
    onError: (err) => {
      console.error('[SyncBridge] Error:', err.message);
    },
  };

  wsClient = createWSClient(options);
  return wsClient;
}

export function getSyncBridge() {
  return wsClient;
}
