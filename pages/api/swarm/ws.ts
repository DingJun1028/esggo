import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

// 關閉 Next.js 預設的 Body Parser，因為這是一個 WebSocket Upgrade 請求
export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // 確保 WebSocket 伺服器只被初始化一次 (Singleton)
    if (!(res.socket as any).server.wss) {
        console.log('[Swarm WS Server] 🌌 正在初始化 OmniAgent 蜂群中樞神經 (WebSocket)...');

        const wss = new WebSocketServer({ noServer: true });
        (res.socket as any).server.wss = wss;

        wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
            console.log(`[Swarm WS Server] 🟢 客戶端已連線 (當前共 ${wss.clients.size} 個觀測節點)`);

            ws.on('message', (message: unknown) => {
                try {
                    const data = JSON.parse((message as any).toString());

                    // 判斷是否為來自 Broadcast Relay API 的特權廣播 (HealingGuardian 意志)
                    if (data._source === 'SYSTEM_BROADCAST_API') {
                        console.log(`[Swarm WS Server] 📡 收到系統意志，向所有觀測節點廣播: ${data.stage}`);

                        // 進行群發 (Broadcast) 給所有前端 Dashboard
                        wss.clients.forEach((client: WebSocket) => {
                            // 排除發送者自身，並且只發送給狀態為 OPEN 的客戶端
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(data));
                            }
                        });
                    }
                } catch (err) {
                    console.error('[Swarm WS Server] ❌ 訊息解析或轉發發生震盪:', err);
                }
            });

            ws.on('close', () => {
                console.log(`[Swarm WS Server] 🔴 客戶端已斷線 (剩餘 ${wss.clients.size} 個觀測節點)`);
            });
        });

        // 綁定 HTTP Upgrade 事件，攔截 Upgrade: websocket
        (res.socket as any).server.on('upgrade', (request: unknown, socket: unknown, head: unknown) => {
            if ((request as any).url?.includes('/api/swarm/ws')) {
                wss.handleUpgrade(request as any, socket, head, (ws: WebSocket) => {
                    wss.emit('connection', ws, request);
                });
            }
        });
    }
    res.end();
}