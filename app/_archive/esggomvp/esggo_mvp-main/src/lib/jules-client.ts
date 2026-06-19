import { GnosisError, GnosisErrorCode } from './error-gnosis';
import { omniLogger, LogCategory } from '../core/omniLogger';

const DEFAULT_TIMEOUT = 10000; // 10 seconds for Jules tasks

async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = DEFAULT_TIMEOUT } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Client for Google Jules API (Alpha)
 * Provides programmatic access to Jules capabilities.
 */
export class JulesClient {
    private readonly baseUrl = 'https://jules.googleapis.com/v1alpha';
    private dynamicApiKey: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.dynamicApiKey = localStorage.getItem('JULES_API_KEY');
        }
    }

    public setApiKey(key: string) {
        this.dynamicApiKey = key;
        if (typeof window !== 'undefined') {
            localStorage.setItem('JULES_API_KEY', key);
        }
    }

    public isAvailable(): boolean {
        return !!(this.dynamicApiKey || process.env.NEXT_PUBLIC_JULES_API_KEY);
    }

    private getHeaders() {
        const apiKey = this.dynamicApiKey || process.env.NEXT_PUBLIC_JULES_API_KEY;
        if (!apiKey) {
            omniLogger.error(LogCategory.SYSTEM, 'Jules API Key not found');
            throw new GnosisError(GnosisErrorCode.GNOSIS_AUTH_GATE_CLOSED);
        }
        return {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
        };
    }

    /**
     * Lists available sources connected to Jules.
     */
    public async listSources(): Promise<any> {
        const response = await fetchWithTimeout(`${this.baseUrl}/sources`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to list Jules sources: ${response.statusText}`);
            throw new GnosisError(GnosisErrorCode.GNOSIS_INFRA_STALL);
        }

        return await response.json();
    }

    /**
     * Creates a new session with Jules.
     */
    public async createSession(prompt: string, sourceName: string, automationMode?: string, title?: string): Promise<any> {
        const payload = {
            prompt,
            sourceContext: {
                source: sourceName,
            },
            automationMode,
            title,
        };

        const response = await fetchWithTimeout(`${this.baseUrl}/sessions`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to create Jules session: ${response.statusText}`);
            throw new GnosisError(GnosisErrorCode.GNOSIS_INFRA_STALL);
        }

        return await response.json();
    }

    /**
     * Sends a message to an existing Jules session.
     */
    public async sendMessage(sessionId: string, prompt: string): Promise<void> {
        const payload = { prompt };

        const response = await fetchWithTimeout(`${this.baseUrl}/sessions/${sessionId}:sendMessage`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to send message to Jules session: ${response.statusText}`);
            throw new GnosisError(GnosisErrorCode.GNOSIS_INFRA_STALL);
        }
    }

    /**
     * Lists activities in a session.
     */
    public async listActivities(sessionId: string, pageSize: number = 30): Promise<any> {
        const response = await fetchWithTimeout(`${this.baseUrl}/sessions/${sessionId}/activities?pageSize=${pageSize}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            omniLogger.error(LogCategory.SYSTEM, `Failed to list Jules activities: ${response.statusText}`);
            throw new GnosisError(GnosisErrorCode.GNOSIS_INFRA_STALL);
        }

        return await response.json();
    }
}

export const julesClient = new JulesClient();
