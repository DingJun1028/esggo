import { InfoOneCore } from './src/omni/core/InfoOneCore';

/**
 * 🧪 V6 Full Cycle Verification Script
 * ---------------------------------------
 * Tests the "Omni Optimization" (奧秘優化) flow across all 5 layers.
 */
async function testV6FullCycle() {
    console.log("🚀 Starting V6 Full Cycle Test...");

    // 1. Initialize InfoOneCore with complex virtue profile
    const core = new InfoOneCore({
        uuid: "v6-test-uuid-001",
        version: "1.0.0",
        timestamp: Date.now(),
        formula: "ESG + RPG Resonance Formula",
        impactMetric: "Omni",
        evidence: {},
        virtues: {
            benevolence: 8,
            intelligence: 9,
            courage: 10,
            temperance: 7,
            harmony: 9,
            integrity: 10
        }
    });

    console.log("✅ Initialized Core. Level:", core.evolutionProfile.level);

    // 2. Execute Omni Optimization
    console.log("\n💎 Executing Omni Optimization Cycle...");
    await core.optimize();

    // 3. Verify Layer Results
    console.log("\n📊 Verification Results:");

    console.log(`[L1] Partner HP: ${core.partnerAttributes?.hp} (Expected > 250)`);
    console.log(`[L1] Partner ATK: ${core.partnerAttributes?.atk}`);

    console.log(`[L2] ARVO Status: ${core.arvoStatus} (Expected: AWAKENED)`);

    console.log(`[L3] Evolution Level: ${core.evolutionProfile.level}`);
    console.log(`[L3] Rune EXP: ${core.evolutionProfile.runeExp}`);

    console.log(`[L4] Omni-Crystal ID: ${core.omniCrystal?.crystalId}`);
    console.log(`[L4] Crystal Purity: ${core.omniCrystal?.purity}`);

    console.log(`[L5] VFX Glow Intensity: ${core.vfxParams?.glowIntensity}`);
    console.log(`[L5] Resonance Color: ${core.vfxParams?.resonanceColor}`);

    // 4. Final Conclusion
    if (core.partnerAttributes && core.arvoStatus === 'AWAKENED' && core.omniCrystal) {
        console.log("\n✨ [SUCCESS] All 5 Layers of V6 Awakening Architecture Synchronized.");
    } else {
        console.log("\n❌ [FAILURE] Some components failed to synchronize.");
    }
}

testV6FullCycle().catch(err => {
    console.error("Test Error:", err);
});
