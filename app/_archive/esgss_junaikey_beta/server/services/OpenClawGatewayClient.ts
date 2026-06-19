
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { EventEmitter } from 'events';
import crypto from 'crypto';

/**
 * 🏛️ OpenClawGatewayClient
 * 
 * 負責與本地 OpenClaw Gateway (ws://localhost:19001) 通訊。
 * 使用 Node.js 原生 WebSocket (解決 ws 套件在 v24 環境下的崩潰問題)。
 * 遵循 5T 協議中的 Traceable (可溯源) 與 Transparent (可透明)。
 */
export class OpenClawGatewayClient extends EventEmitter {
    private static instance: OpenClawGatewayClient;
    private ws: any = null; // native WebSocket
    private url: string;
    private isConnected: boolean = false;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private requests: Map<string, { resolve: Function, reject: Function, timeout: NodeJS.Timeout }> = new Map();

    private constructor() {
        super();
        this.url = process.env.OPENCLAW_URL || 'ws://localhost:19001';
    }

    static getInstance(): OpenClawGatewayClient {
        if (!OpenClawGatewayClient.instance) {
            OpenClawGatewayClient.instance = new OpenClawGatewayClient();
        }
        return OpenClawGatewayClient.instance;
    }

    /**
     * 初始化連接 (Initialize Connection)
     */
    async connect(): Promise<void> {
        if (this.isConnected) return;

        return new Promise((resolve, reject) => {
            try {
                omniLogger.info(LogCategory.AI, `[OpenClawClient] Connecting to ${this.url}...`);
                this.ws = new (global as any).WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log(`[OpenClawClient] WebSocket opened.`);
                };

                this.ws.onmessage = async (event: any) => {
                    let data = event.data;
                    if (data instanceof Blob) {
                        data = await data.text();
                    } else if (data instanceof ArrayBuffer) {
                        data = new TextDecoder().decode(data);
                    }
                    this.handleMessage(data);
                };

                this.ws.onerror = (error: any) => {
                    console.error('[OpenClawClient] WebSocket error', error);
                    this.handleDisconnect();
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.warn('[OpenClawClient] WebSocket closed');
                    this.handleDisconnect();
                };

                // Handshake timeout
                const handshakeTimeout = setTimeout(() => {
                    if (!this.isConnected) {
                        this.ws?.close();
                        reject(new Error('OpenClaw Handshake timeout'));
                    }
                }, 5000);

                this.once('ready', () => {
                    clearTimeout(handshakeTimeout);
                    resolve();
                });

            } catch (err) {
                this.handleDisconnect();
                reject(err);
            }
        });
    }

    private async sendConnect(nonce?: string) {
        const token = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN;
        const connectParams = {
            minProtocol: 1,
            maxProtocol: 1,
            client: {
                id: 'gateway-client',
                version: '1.0.0',
                platform: process.platform,
                mode: 'user-interface' as any,
            },
            auth: {
                token: process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN
            }
        };

        const requestId = `connect-${Math.random().toString(36).substring(7)}`;
        const reqFrame = {
            type: 'req',
            id: requestId,
            method: 'connect',
            params: connectParams
        };

        omniLogger.info(LogCategory.AI, `[OpenClawClient] Sending connect request (nonce: ${nonce || 'none'})...`);
        const messageStr = JSON.stringify(reqFrame);
        console.log(`[OpenClawClient] Sending Frame: ${messageStr}`);
        this.ws?.send(messageStr);
    }

    private handleMessage(data: any) {
        try {
            if (!data) return;
            const messageStr = data.toString();
            if (!messageStr) return;

            const message = JSON.parse(messageStr);

            // 1. Handle connect.challenge
            if (message.type === 'event' && message.event === 'connect.challenge') {
                const nonce = message.payload?.nonce;
                console.log(`[OpenClawClient] Challenge received: ${nonce}`);
                this.sendConnect(nonce);
                return;
            }

            // 2. Handle Handshake response (HelloOk)
            if (message.type === 'res' && message.payload?.type === 'hello-ok') {
                this.isConnected = true;
                console.log('[OpenClawClient] Handshake successful.');
                this.emit('ready');
                return;
            }

            // 3. Handle broadcast events (Chat updates)
            if (message.type === 'event' && message.event === 'chat') {
                const payload = message.payload;
                const runId = payload.runId;
                const state = payload.state;

                if (state === 'delta') {
                    const text = payload.message?.content?.[0]?.text;
                    if (text) this.emit(`chat:delta:${runId}`, text);
                } else if (state === 'final') {
                    const text = payload.message?.content?.[0]?.text;
                    if (text) {
                        // 🟢 T5-Trustworthy: Generate Hash Lock for final content
                        const hash = crypto.createHash('sha256').update(text).digest('hex');
                        const metadata = {
                            uuid: crypto.randomUUID(),
                            timestamp: Date.now(),
                            hash,
                            protocol: '5T-v1',
                            status: 'Trustworthy'
                        };
                        this.emit(`chat:delta:${runId}`, text, metadata);
                    }
                    this.emit(`chat:end:${runId}`);
                } else if (state === 'error') {
                    this.emit(`chat:error:${runId}`, payload.errorMessage || 'Unknown chat error');
                }
                return;
            }

            // 4. Handle general response
            if (message.type === 'res') {
                const pending = this.requests.get(message.id);
                if (pending) {
                    clearTimeout(pending.timeout);
                    this.requests.delete(message.id);
                    if (message.error) {
                        pending.reject(message.error);
                    } else {
                        // 🟢 T5-Trustworthy: Apply 5T metadata to general responses if applicable
                        if (message.payload?.response) {
                            const text = message.payload.response;
                            const hash = crypto.createHash('sha256').update(text).digest('hex');
                            message.payload._5t = {
                                uuid: crypto.randomUUID(),
                                timestamp: Date.now(),
                                hash,
                                status: 'Trustworthy'
                            };
                        }
                        pending.resolve(message.payload);
                    }
                }
                return;
            }

        } catch (err) {
            console.error('[OpenClawClient] Error in handleMessage:', err);
        }
    }

    private handleDisconnect() {
        this.isConnected = false;
        if (this.reconnectTimer) return;

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect().catch(() => { });
        }, 10000);
    }

    /**
     * 💬 Send Chat Message
     */
    public async chat(prompt: string, modelName: string = 'omnicrew'): Promise<any> {
        if (!this.isConnected) {
            await this.connect();
        }

        const id = `req-${Math.random().toString(36).substring(7)}`;

        // OpenClaw chat.send uses sessionKey and message string
        const frame = {
            type: 'req',
            id,
            method: 'chat.send',
            params: {
                sessionKey: 'omni-priest-session',
                message: prompt,
                idempotencyKey: id
            }
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.requests.delete(id);
                reject(new Error(`OpenClaw request ${id} (${frame.method}) timed out`));
            }, 30000);

            this.requests.set(id, { resolve, reject, timeout });
            this.ws?.send(JSON.stringify(frame));
        });
    }

    /**
     * 串流對話請求 (Stream Chat Request)
     */
    async *streamChat(prompt: string, model: string = 'omnicrew'): AsyncGenerator<string> {
        if (!this.isConnected) await this.connect();

        const requestId = `stream-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const chatReq = {
            type: 'req',
            id: requestId,
            method: 'chat.send',
            params: {
                sessionKey: 'omni-priest-session',
                message: prompt,
                idempotencyKey: requestId
            }
        };

        this.ws?.send(JSON.stringify(chatReq));

        const queue: string[] = [];
        let finished = false;
        let error: string | null = null;

        const onDelta = (text: string) => queue.push(text);
        const onEnd = () => { finished = true; };
        const onError = (msg: string) => { error = msg; finished = true; };

        this.on(`chat:delta:${requestId}`, onDelta);
        this.on(`chat:end:${requestId}`, onEnd);
        this.on(`chat:error:${requestId}`, onError);

        try {
            while (!finished || queue.length > 0) {
                if (error) throw new Error(error);
                if (queue.length > 0) {
                    yield queue.shift()!;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        } finally {
            this.off(`chat:delta:${requestId}`, onDelta);
            this.off(`chat:end:${requestId}`, onEnd);
            this.off(`chat:error:${requestId}`, onError);
        }
    }
}

export default OpenClawGatewayClient.getInstance();
