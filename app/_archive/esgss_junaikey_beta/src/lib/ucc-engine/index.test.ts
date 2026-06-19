import { describe, it, expect, beforeEach, vi } from 'vitest';
import { uccEngine } from './index';

describe('UCCEngine Unit Tests', () => {
    const mockEvidence = {
        formula: 'E = MC2',
        impactMetric: { carbon: 100 },
        sourceOrigin: 'Test Labs',
        lifecycleStage: 'draft' as const
    };

    it('should compute hash lock correctly', () => {
        const data = {
            uuid: 'test-uuid',
            timestamp: 123456789,
            formula: 'test-formula',
            impactMetric: { value: 10 }
        };

        // Internal method access for testing
        const hash = (uccEngine as any).computeHashLock(data);
        expect(hash).toBeDefined();
        expect(typeof hash).toBe('string');
    });

    it('should fail verification if data is tampered', async () => {
        // This requires a mock of Supabase if we use the real sealEvidence
        // For unit test, we focus on the logic
        const data = { uuid: 'u', timestamp: 1, formula: 'f', impactMetric: {} };
        const correctHash = (uccEngine as any).computeHashLock(data);

        const tamperedData = { ...data, formula: 'tampered' };
        const tamperedHash = (uccEngine as any).computeHashLock(tamperedData);

        expect(correctHash).not.toBe(tamperedHash);
    });
});
