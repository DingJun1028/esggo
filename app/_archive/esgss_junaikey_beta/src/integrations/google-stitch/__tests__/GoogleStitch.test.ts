import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleStitchClient, GoogleStitchClientFactory } from '../GoogleStitchIntegration';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GoogleStitchClient', () => {
    const config = {
        apiKey: 'test-api-key',
        projectId: 'test-project',
        region: 'us-central1',
        baseUrl: 'https://test-mcp.example.com'
    };

    let client: GoogleStitchClient;

    beforeEach(() => {
        vi.clearAllMocks();
        client = new GoogleStitchClient(config);
    });

    it('should initialize with correct config', () => {
        const activeConfig = client.getConfig();
        expect(activeConfig.apiKey).toBe(config.apiKey);
        expect(activeConfig.projectId).toBe(config.projectId);
        expect(activeConfig.baseUrl).toBe(config.baseUrl);
    });

    it('should build correct URL with baseUrl override', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ status: 'ok' })
        });

        await client.get('/health');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('https://test-mcp.example.com/health'),
            expect.any(Object)
        );
    });

    it('should include required headers in requests', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ status: 'ok' })
        });

        await client.post('/data', { foo: 'bar' });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${config.apiKey}`,
                    'X-Project-ID': config.projectId,
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('should handle request failure correctly', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found',
            json: async () => ({ code: 'NOT_FOUND', message: 'Resource missing' })
        });

        const response = await client.get('/non-existent');

        expect(response.success).toBe(false);
        expect(response.error?.code).toBe('NOT_FOUND');
        expect(response.error?.message).toBe('Resource missing');
    });

    it('should support event listeners', async () => {
        const requestListener = vi.fn();
        client.on('request', requestListener);

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ status: 'ok' })
        });

        await client.get('/test-event');

        expect(requestListener).toHaveBeenCalled();
        expect(requestListener.mock.calls[0][0].type).toBe('request');
    });
});

describe('GoogleStitchClientFactory', () => {
    it('should create new instances correctly', () => {
        const config = { apiKey: 'a', projectId: 'b' };
        const client = GoogleStitchClientFactory.create(config);
        expect(client).toBeInstanceOf(GoogleStitchClient);
    });

    it('should manage a singleton instance', () => {
        const config = { apiKey: 'a', projectId: 'b' };
        GoogleStitchClientFactory.reset();
        const instance1 = GoogleStitchClientFactory.getInstance(config);
        const instance2 = GoogleStitchClientFactory.getInstance();

        expect(instance1).toBe(instance2);
    });
});
