
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { stressTestService } from './StressTestService';
import { intelligenceForge } from './IntelligenceForge';

describe('StressTestService', () => {
    beforeEach(() => {
        stressTestService.coolDown();
    });

    afterEach(() => {
        stressTestService.coolDown();
        vi.restoreAllMocks();
    });

    it('should start and stop the stress test', () => {
        expect(stressTestService.getStatus()).toBe(false);
        stressTestService.igniteFoundry(1, 1000); // 1 artifact per second
        expect(stressTestService.getStatus()).toBe(true);
        stressTestService.coolDown();
        expect(stressTestService.getStatus()).toBe(false);
    });

    it('should generate valid artifacts and update metrics', async () => {
        // Use fake timers to control the interval
        vi.useFakeTimers();

        stressTestService.igniteFoundry(5, 100); // 5 artifacts every 100ms
        expect(stressTestService.getStatus()).toBe(true);

        // Fast-forward time
        await vi.advanceTimersByTimeAsync(200);

        const metrics = stressTestService.getMetrics();
        expect(metrics.artifactsGenerated).toBeGreaterThan(0);
        expect(metrics.validArtifacts).toBeGreaterThan(0);
        // We expect mostly valid artifacts from the default generator

        stressTestService.coolDown();
        vi.useRealTimers();
    });

    it('should handle chaos artifacts generation', async () => {
        const artifact = await stressTestService.generateChaosArtifact();
        expect(artifact).toBeDefined();
        expect(artifact.uuid).toBeDefined();
        expect(Object.isFrozen(artifact)).toBe(true);
    });
});
