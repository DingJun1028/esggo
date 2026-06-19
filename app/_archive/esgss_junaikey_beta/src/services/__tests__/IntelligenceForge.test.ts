import { describe, it, expect } from 'vitest';
import { intelligenceForge } from '../IntelligenceForge';

describe('IntelligenceForge (R_s Generator)', () => {

    // Test the formula: R_s = (impact * relevance) / 1.05
    // Rounded to 2 decimal places
    describe('calculateRs (Resonance Score)', () => {
        it('should calculate Resonance Score (R_s) correctly for standard inputs', async () => {
            // Formula: (10 * 10) / 1.05 = 95.238... -> 95.24
            const artifact = await intelligenceForge.forgeEvidence('test-site', 'content', 10, 10);
            expect(artifact.resonance_rs).toBe(95.24);
        });

        it('should handle zero impact', async () => {
            const artifact = await intelligenceForge.forgeEvidence('test-site', 'content', 0, 10);
            expect(artifact.resonance_rs).toBe(0);
        });

        it('should handle zero relevance', async () => {
            const artifact = await intelligenceForge.forgeEvidence('test-site', 'content', 10, 0);
            expect(artifact.resonance_rs).toBe(0);
        });

        it('should calculate high impact scenario', async () => {
            // (100 * 100) / 1.05 = 9523.809... -> 9523.81
            const artifact = await intelligenceForge.forgeEvidence('test-site', 'content', 100, 100);
            expect(artifact.resonance_rs).toBe(9523.81);
        });
    });

    // Verify 5T Protocol Compliance
    describe('5T Protocol Compliance', () => {

        it('should encompass Traceable properties (Source Origin)', async () => {
            const source = 'https://example.com/esg-report';
            const artifact = await intelligenceForge.forgeEvidence(source, 'raw content', 5, 5);
            expect(artifact.source_origin).toBe(source);
        });

        it('should encompass Trackable properties (Timestamp & Evidence)', async () => {
            const artifact = await intelligenceForge.forgeEvidence('test', 'content', 5, 5);
            expect(artifact.timestamp).toBeDefined();
            expect(typeof artifact.timestamp).toBe('number');
            expect(Array.isArray(artifact.evidence)).toBe(true);
            expect(artifact.evidence.length).toBeGreaterThan(0);
            expect(artifact.evidence[0]).toContain('Crawler_Log');
        });

        it('should encompass Transparent properties (Essence Extraction)', async () => {
            const rawSnippet = 'Scope 3 emissions have reduced by 15% due to new policy.';
            const artifact = await intelligenceForge.forgeEvidence('test', rawSnippet, 5, 5);
            expect(artifact.essence).toBeDefined();
            // Assuming default essence extraction logic for now (mocked in service)
            expect(artifact.essence.event).toBe('Policy Update');
            expect(artifact.essence.raw_snippet).toContain('Scope 3 emissions');
        });

        it('should encompass Trustworthy properties (Immutability/Sealed)', async () => {
            const artifact = await intelligenceForge.forgeEvidence('test', 'content', 5, 5);

            // Check if object is frozen
            expect(Object.isFrozen(artifact)).toBe(true);

            // Attempting to modify should fail (in strict mode) or be ignored
            try {
                // @ts-ignore
                artifact.resonance_rs = 9999;
            } catch (e) {
                // Expected error in strict mode
            }
            expect(artifact.resonance_rs).not.toBe(9999);
            expect(artifact.status).toBe('Sealed');
        });
    });

    it('should generate a valid deterministic-like UUID', async () => {
        const artifact = await intelligenceForge.forgeEvidence('test', 'content', 5, 5);
        expect(artifact.uuid).toMatch(/^ESGss-[a-f0-9]{8}$/);
    });
});
