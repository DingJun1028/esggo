import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OmniCache } from './redis-cache';

describe('OmniCache Redis Stream (Recommendation 3)', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        process.env.UPSTASH_REDIS_REST_URL = 'https://mock-upstash.com';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token';
    });

    it('should push data to a Redis Stream via XADD', async () => {
        const mockResponse = { result: '123456789-0' };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const payload = { type: 'Intelligence', value: 42 };
        const streamId = await OmniCache.pushToStream(OmniCache.STREAMS.MANIFESTATIONS, payload);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/xadd/omni%3Astream%3Amanifestations/*/data/%7B%22type%22%3A%22Intelligence%22%2C%22value%22%3A42%7D/timestamp/'),
            expect.any(Object)
        );
        expect(streamId).toBe('123456789-0');
    });

    it('should fallback gracefully if Upstash fails', async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error',
        });

        const streamId = await OmniCache.pushToStream('test-stream', { foo: 'bar' });
        expect(streamId).toBeNull();
    });
});
