
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

interface MCPMessage {
    jsonrpc: '2.0';
    id?: number | string;
    method?: string;
    params?: any;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export class CrewAIClient {
    private eventSource: EventSource | null = null;
    private postEndpoint: string | null = null;
    private isConnected: boolean = false;
    private pendingRequests: Map<string | number, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();
    private messageId: number = 0;

    constructor(private baseUrl: string = '/api/crewai') { }

    /**
     * Connect to the MCP Server via SSE
     */
    async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            const sseUrl = `${this.baseUrl}/sse`;
            omniLogger.info(LogCategory.SYSTEM, 'Connecting to CrewAI MCP...', { url: sseUrl });

            this.eventSource = new EventSource(sseUrl);

            return new Promise((resolve, reject) => {
                if (!this.eventSource) return reject('Failed to create EventSource');

                this.eventSource.onopen = () => {
                    omniLogger.info(LogCategory.SYSTEM, 'CrewAI MCP Connected (SSE open)');
                };

                this.eventSource.onerror = (err) => {
                    // If we are not connected yet, reject. If already connected, it might be a temporary retry.
                    if (!this.isConnected) {
                        omniLogger.error(LogCategory.SYSTEM, 'CrewAI MCP Connection Error', { error: err });
                        reject(err);
                    }
                };

                this.eventSource.addEventListener('endpoint', (event: MessageEvent) => {
                    this.postEndpoint = new URL(event.data, this.baseUrl).toString();
                    this.isConnected = true;
                    omniLogger.info(LogCategory.SYSTEM, 'CrewAI MCP Endpoint Received', { endpoint: this.postEndpoint });
                    resolve();
                });

                this.eventSource.onmessage = (event: MessageEvent) => {
                    try {
                        const message: MCPMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (e) {
                        omniLogger.error(LogCategory.SYSTEM, 'Failed to parse MCP message', { data: event.data });
                    }
                };
            });
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'CrewAI MCP Connection Failed', { error });
            throw error;
        }
    }

    /**
     * Handle incoming JSON-RPC messages
     */
    private handleMessage(message: MCPMessage): void {
        if (message.id !== undefined && this.pendingRequests.has(message.id)) {
            const { resolve, reject } = this.pendingRequests.get(message.id)!;
            this.pendingRequests.delete(message.id);

            if (message.error) {
                reject(new Error(message.error.message));
            } else {
                resolve(message.result);
            }
        } else {
            // Notification or request from server (not handled in this simple client yet)
            omniLogger.warn(LogCategory.SYSTEM, 'Received unhandled MCP message', { message });
        }
    }

    /**
     * Call a tool on the MCP server
     */
    async callTool(name: string, args: Record<string, any>, timeoutMs: number = 300000): Promise<any> {
        if (!this.isConnected || !this.postEndpoint) {
            try {
                await this.connect();
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, 'CrewAI Client: Failed to connect before tool call', { error });
                throw new Error('CrewAI Service Unavailable: Please ensure the backend server is running.');
            }
        }

        if (!this.postEndpoint) {
            throw new Error('MCP Post Endpoint not initialized');
        }

        const id = this.messageId++;
        const request: MCPMessage = {
            jsonrpc: '2.0',
            id,
            method: 'tools/call',
            params: {
                name,
                arguments: args
            }
        };

        return new Promise(async (resolve, reject) => {
            // Set timeout
            const timeoutId = setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error(`CrewAI Tool Call Timeout: '${name}' took longer than ${timeoutMs}ms.`));
                }
            }, timeoutMs);

            this.pendingRequests.set(id, {
                resolve: (val) => { clearTimeout(timeoutId); resolve(val); },
                reject: (err) => { clearTimeout(timeoutId); reject(err); }
            });

            try {
                const response = await fetch(this.postEndpoint!, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                });

                if (!response.ok) {
                    this.pendingRequests.delete(id);
                    clearTimeout(timeoutId);
                    reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
                }
            } catch (err) {
                this.pendingRequests.delete(id);
                clearTimeout(timeoutId);
                omniLogger.error(LogCategory.SYSTEM, 'CrewAI Client: Network Error during Tool Call', { error: err });
                reject(new Error('CrewAI Network Error: Failed to send request to backend.'));
            }
        });
    }

    /**
     * Generate ESG Report Wrapper
     */
    async generateReport(organizationId: string, frameworks: string[]): Promise<string> {
        // The tool defined in python is 'generate_esg_report'
        // It returns a string (the report)
        const result = await this.callTool('generate_esg_report', {
            organization_id: organizationId,
            frameworks
        });

        // fastmcp tools return the result directly in the 'content' usually, 
        // but let's see how python FastMCP wraps it. 
        // Usually it returns { content: [{ type: 'text', text: '...' }] } for CallToolResult

        if (result && result.content && Array.isArray(result.content)) {
            return result.content.map((c: any) => c.text).join('\n');
        }

        return String(result);
    }
}

export const crewAiClient = new CrewAIClient();
