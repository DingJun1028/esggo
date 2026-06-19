import type { ApiRequest, ApiResponse } from '../../shared/types';
import { OmniRequestType } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🛰️ OmniCoreClient (萬能心核客戶端)
 * Handles bi-directional communication with Celestial Server.
 */
export class OmniCoreClient {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3001') {
        this.baseUrl = baseUrl;
    }

    private async request<T = unknown>(req: Partial<ApiRequest>): Promise<ApiResponse<T>> {
        const fullRequest: ApiRequest = {
            id: req.id || uuidv4(),
            type: req.type || OmniRequestType.QUERY,
            content: req.content || "",
            data: req.data,
            metadata: req.metadata
        };

        const response = await fetch(`${this.baseUrl}/api/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fullRequest)
        });

        if (!response.ok) {
            throw new Error(`OmniCore Request Failed: ${response.statusText}`);
        }

        return response.json();
    }

    /** 🧠 Manifest an AI Agent */
    async manifestAgent(name: string, systemPrompt: string): Promise<ApiResponse> {
        return this.request({
            type: OmniRequestType.MANIFEST_AGENT,
            content: `Creating agent: ${name}`,
            data: { name, systemPrompt }
        });
    }

    /** 💬 Process a Query */
    async process(content: string, type: OmniRequestType = OmniRequestType.QUERY): Promise<ApiResponse> {
        return this.request({
            type,
            content
        });
    }

    /** 🏛️ Store a Memory */
    async storeMemory(content: string, memoryType: string): Promise<ApiResponse> {
        return this.request({
            type: OmniRequestType.STORE_MEMORY,
            content,
            data: { memoryType }
        });
    }
}

export const omniClient = new OmniCoreClient();
