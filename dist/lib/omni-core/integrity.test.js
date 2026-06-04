"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const integrity_1 = require("./integrity");
vitest_1.vi.mock('../vault-omni.ts', () => ({
    engraveToSingleTable: vitest_1.vi.fn().mockResolvedValue({ success: true }),
    verifyRecord: vitest_1.vi.fn().mockResolvedValue(true),
}));
(0, vitest_1.describe)('OmniCoreIntegrity Module - 5T State Machine Validation', () => {
    (0, vitest_1.it)('should successfully execute the Sacred Seal process (SacredCommand)', async () => {
        const rawData = {
            metric: 'GHG Emissions Scope 1',
            source: 'Energy Bills 2025',
            formula: 'ISO-14064-1:2018',
            hooks: ['initial_entry']
        };
        const crystal = await integrity_1.integrityModule.sacredSeal(rawData);
        // 1. Traceable (可溯源)
        (0, vitest_1.expect)(crystal.uuid).toBeDefined();
        (0, vitest_1.expect)(crystal.evidence[0].originCause).toBe('Energy Bills 2025');
        // 2. Transparent (可透明)
        (0, vitest_1.expect)(crystal.formula).toBe('ISO-14064-1:2018');
        // 3. Tangible (可感知)
        (0, vitest_1.expect)(crystal.impact_metric).toBe('GHG Emissions Scope 1');
        // 4. Trackable (可追蹤)
        (0, vitest_1.expect)(crystal.timestamp).toBeGreaterThan(0);
        (0, vitest_1.expect)(crystal.evidence[0].processTrace).toContain('initial_entry');
        (0, vitest_1.expect)(crystal.evidence[0].processTrace.some((h) => h.startsWith('purified_and_normalized_'))).toBe(true);
        // 5. Trustworthy (不可篡改)
        (0, vitest_1.expect)(crystal.status).toBe('Trustworthy');
        (0, vitest_1.expect)(crystal.hash_lock).toBeDefined();
        // Verify object is frozen
        (0, vitest_1.expect)(Object.isFrozen(crystal)).toBe(true);
        (0, vitest_1.expect)(() => { crystal.impact_metric = 'Modified'; }).toThrow();
    });
    (0, vitest_1.it)('should pass verification for an untampered crystal', async () => {
        const rawData = { metric: 'Energy Use', source: 'Meter A' };
        const crystal = await integrity_1.integrityModule.sacredSeal(rawData);
        const isValid = await integrity_1.integrityModule.verify(crystal);
        (0, vitest_1.expect)(isValid).toBe(true);
    });
    (0, vitest_1.it)('should fail verification if the crystal is tampered with (Entropy Infection)', async () => {
        const rawData = { metric: 'Energy Use', source: 'Meter A' };
        const crystal = await integrity_1.integrityModule.sacredSeal(rawData);
        // Bypass TypeScript and Object.freeze for simulation (in a real scenario, this would be a database data change)
        const tamperedCrystal = {
            ...crystal,
            impact_metric: 'Tainted Data'
        };
        const isValid = await integrity_1.integrityModule.verify(tamperedCrystal);
        (0, vitest_1.expect)(isValid).toBe(false);
    });
});
//# sourceMappingURL=integrity.test.js.map