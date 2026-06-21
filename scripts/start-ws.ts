// scripts/start-ws.ts
// 獨立 WS server 啟動腳本（掛載在 Next.js standalone server 上）
// 使用方式：在 standalone server.ts 中 import

import { createServer } from 'http';
import { getWSServer } from '../lib/omni-hub/ws-server';

export function attachWSServer(port = 3001) {
  const server = createServer();
  const wss = getWSServer({ path: '/api/hub/ws' });
  wss.attach(server);

  server.listen(port, () => {
    console.log(`[WS] OmniHub WebSocket server on :${port}/api/hub/ws`);
  });

  return server;
}
