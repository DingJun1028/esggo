
import apiService from './api.js';
import { EventSourcePolyfill } from 'event-source-polyfill';

// Types
export interface AgentSoul {
    id: string;
    name: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    avatarConfig: AvatarConfig;
    metadata: any;
}

export interface AvatarConfig {
    modelUrl?: string;
    voiceId?: string;
    idleAnimations?: string[];
    [key: string]: any;
}

export interface InteractionMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface ChatEvent {
    type: 'text' | 'thought' | 'skill' | 'done' | 'error';
    content?: string;
    data?: any;
}

export class CelestialAPI {
    private baseUrl = '/api/celestial';

    /**
     * Manifest an Agent Soul into the current session.
     * @param agentId UUID of the agent to load
     */
    async manifest(agentId: string): Promise<AgentSoul> {
        const response = await apiService.post(`${this.baseUrl}/manifest`, { agentId });
        return response.data;
    }

    /**
     * Inject knowledge into the Vector Store.
     */
    async learn(content: string, metadata: any = {}): Promise<{ id: string }> {
        const response = await apiService.post(`${this.baseUrl}/learn`, { content, metadata });
        return response.data;
    }

    /**
     * Retrieve relevant context (Debug/Testing).
     */
    async recall(query: string, limit: number = 5): Promise<{ context: string }> {
        const response = await apiService.post(`${this.baseUrl}/recall`, { query, limit });
        return response.data;
    }

    /**
     * Interact with the Agent using Server-Sent Events (SSE) for streaming responses.
     * @param agentId The manifest agent ID
     * @param message User's input message
     * @param history Chat history for context
     * @param onMessage Callback for stream events
     */
    interact(
        agentId: string,
        message: string,
        history: InteractionMessage[],
        onMessage: (event: ChatEvent) => void
    ): () => void {
        // Construct URL with query params
        const params = new URLSearchParams({
            sessionId: 'temp_session', // In a real app, this might come from manifest response
            message, // Note: passing message in query params has length limits; 
            // Real implementation might use POST for initiation + GET for stream or POST with SSE support
        });

        // NOTE: The server implementation currently uses GET /interact for SSE.
        // For large payloads, stick to the POST implementation or `fetch` with `ReadableStream`.
        // Below assumes we adjusted server to accept POST or we keep messages short for GET.
        // Let's assume we stick to the server's POST /interact definition if we updated it,
        // BUT looking at server.ts, it was implemented as `app.get('/api/interact'...)`.
        // Wait, the routes/celestial.ts implemented `router.post('/interact'...)`.
        // The server.ts *also* had a legacy `app.get('/api/interact'...)`.
        // We should use the one in `routes/celestial.ts` which is POST.

        // Using fetch for POST streaming (Modern approach)
        const controller = new AbortController();

        (async () => {
            try {
                const response = await fetch(`${this.baseUrl}/interact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add auth headers if needed, e.g. from local storage
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify({ agentId, message, history }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) throw new Error('No readable stream');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '');
                            try {
                                const event = JSON.parse(dataStr) as ChatEvent;
                                onMessage(event);
                                if (event.type === 'done') {
                                    // Stream finished
                                }
                            } catch (e) {
                                console.warn('Failed to parse SSE chunk', dataStr);
                            }
                        }
                    }
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    onMessage({ type: 'error', content: error.message });
                }
            }
        })();

        return () => controller.abort();
    }
}

export const celestialApi = new CelestialAPI();
