// lib/omni-hub/websocket.ts
// 萬能中心 — WebSocket 客戶端（VPS 端廣播用）
// 提供 WS client 連接 + 訊息型別定義

import type { RealtimeEvent } from './realtime';

export type WSMessage = RealtimeEvent;

export interface WSClientOptions {
  url: string;
  token?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (msg: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (err: Error) => void;
}

export function createWSClient(options: WSClientOptions) {
  const {
    url,
    token,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  let ws: WebSocket | null = null;
  let attempts = 0;
  let closed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function connect() {
    if (closed) return;
    const fullUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;
    try {
      ws = new WebSocket(fullUrl);
    } catch (err) {
      onError?.(err as Error);
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      attempts = 0;
      onConnect?.();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WSMessage;
        onMessage?.(msg);
      } catch {
        // ignore malformed
      }
    };

    ws.onclose = () => {
      onDisconnect?.();
      if (!closed) scheduleReconnect();
    };

    ws.onerror = () => {
      onError?.(new Error('WebSocket error'));
    };
  }

  function scheduleReconnect() {
    if (closed || attempts >= maxReconnectAttempts) return;
    attempts++;
    reconnectTimer = setTimeout(connect, reconnectInterval * Math.min(attempts, 5));
  }

  function send(msg: WSMessage) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  function close() {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
    ws = null;
  }

  connect();

  return { send, close, getReadyState: () => ws?.readyState ?? WebSocket.CLOSED };
}
