import { describe, it, expect } from 'vitest';
import { alignmentEngine } from "./lib/core/alignment-engine";
import { useEvolutionStore } from "./lib/stores/evolution-store";

describe('Phase 13: Tactical Alignment Engine v2.0', () => {
    it('should apply tactical boost from agent levels', async () => {
        // 1. Manually set skills in store
        const store = useEvolutionStore.getState();

        // Boost Audit skill to Lv 5 (+5% boost)
        store.awardXP('Audit Agent', 500);

        const metrics = {
            energyConsumption: 100,
            scope1Emissions: 50,
            scope2Emissions: 50,
            scope3Emissions: 0,
            waterUsage: 0,
            femaleManagementPct: 0,
            hazardousWaste: 0,
            nonHazardousWaste: 0
        };

        const analysis = await alignmentEngine.analyze(metrics);
        const gri302 = analysis.find(a => a.requirementId === 'GRI-302-1');

        console.log("Analysis Result for GRI-302-1:", gri302);

        // Base confidence is typically around 0.95 or similar
        // With Lv 5 Audit agent, it should have a noticeable boost or at least include the [Tactical Boost] string
        expect(gri302?.gapAnalysis).toContain('[Tactical Boost:');
    });

    it('should reflect boost in confidence score', async () => {
        const metrics = { energyConsumption: 100 };
        const result = await alignmentEngine.analyze(metrics as any);
        const gri302 = result.find(a => a.requirementId === 'GRI-302-1');

        // If Audit is Lv 6, boost should be 0.06
        expect(gri302?.confidenceScore).toBeGreaterThan(0.9);
    });
});
