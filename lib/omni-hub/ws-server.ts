// lib/omni-hub/ws-server.ts
// 萬能中心 — WebSocket Server（VPS 端）
// 讓多台 server 能即時廣播訊息

import type { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { RealtimeEvent } from './realtime';

interface WSServerOptions {
  port?: number;
  path?: string;
  onConnect?: (ws: WebSocket) => void;
  onMessage?: (ws: WebSocket, data: string) => void;
}

class OmniHubWSServer {
  private wss: WebSocketServer | null = null;
  private clients: WebSocket[] = [];

  constructor(private options: WSServerOptions = {}) {}

  attach(server: HttpServer): void {
    const path = this.options.path || '/api/hub/ws';
    this.wss = new WebSocketServer({ server, path });

    this.wss.on('connection', (ws) => {
      this.clients.push(ws);
      console.log(`[WSServer] Client connected (${this.clients.length} total)`);
      this.options.onConnect?.(ws);

      ws.on('message', (data) => {
        this.options.onMessage?.(ws, data.toString());
        // 廣播給所有其他 client
        this.broadcast(data.toString(), ws);
      });

      ws.on('close', () => {
        const idx = this.clients.indexOf(ws);
        if (idx !== -1) this.clients.splice(idx, 1);
        console.log(`[WSServer] Client disconnected (${this.clients.length} total)`);
      });

      ws.on('error', () => {
        const idx = this.clients.indexOf(ws);
        if (idx !== -1) this.clients.splice(idx, 1);
      });

      // 歡迎訊息
      ws.send(JSON.stringify({
        type: 'ws_connected',
        payload: { clients: this.clients.length, timestamp: Date.now() },
      }));
    });

    console.log(`[WSServer] WebSocket server attached at ${path}`);
  }

  broadcast(message: string, exclude?: WebSocket): void {
    for (const client of this.clients) {
      if (client === exclude) continue;
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  broadcastEvent(event: RealtimeEvent): void {
    this.broadcast(JSON.stringify(event));
  }

  get clientCount(): number {
    return this.clients.length;
  }

  close(): void {
    for (const client of this.clients) {
      client.terminate();
    }
    this.clients = [];
    this.wss?.close();
    this.wss = null;
  }
}

// 單例
let instance: OmniHubWSServer | null = null;

export function getWSServer(options?: WSServerOptions): OmniHubWSServer {
  if (!instance) {
    instance = new OmniHubWSServer(options);
  }
  return instance;
}
