import { OmniOne } from './omni-one';
import { OmniBase } from './OmniBase';
import { UserKnowledgeBase } from './user-knowledge-base';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🧪 verify-reinforcement: The 5T Optimization Guard.
 * Validates Inheritance, Bridging, Integration, Deep-Breadth, and Sustainability.
 */
async function runReinforcementVerification() {
    console.log("--- 🧪 Starting Phase 11: Universal Optimization & Reinforcement Verification ---");

    // 1. Heritage & Succession (傳承迭代)
    console.log("[Step 1] Testing Inheritance & Succession...");
    const rootSeed = {
        intent: "Optimization Root",
        type: "Intelligence" as const,
        payload: { value: "Genesis Node" },
        domainRef: "REINFORCEMENT_TEST"
    };
    const root = await OmniOne.manifest(rootSeed);
    await UserKnowledgeBase.distill(root);

    const childSeed = {
        intent: "Optimization Child",
        type: "Intelligence" as const,
        payload: { value: "Successor Node" },
        domainRef: "REINFORCEMENT_TEST",
        parentAtom: root.uuid
    };
    const child = await OmniOne.manifest(childSeed);

    if (child.heritage && child.heritage.parentUuid === root.uuid) {
        console.log("✅ SUCCESS: Inheritance/Succession verified.");
        console.log(`[Succession] Lineage: ${child.heritage.lineage.join(' -> ')}`);
        console.log(`[Succession] Version: ${child.heritage.version}`);
    } else {
        console.error("❌ FAILED: Inheritance link broken.");
        process.exit(1);
    }

    // 2. Causal Bridging (承上啟下)
    console.log("[Step 2] Testing Causal Bridging...");
    if (child.bridge && child.bridge.pastLink === root.uuid) {
        console.log("✅ SUCCESS: Causal Bridging verified.");
        console.log(`[Bridge] Entropy: ${child.bridge.causalEntropy?.toFixed(4)}`);
    } else {
        console.error("❌ FAILED: Causal Bridge missing.");
        process.exit(1);
    }

    // 3. Seamless Integration (無縫接軌)
    console.log("[Step 3] Testing Seamless Integration...");
    const integrationSeed = {
        intent: "External Data Sync",
        type: "Intelligence" as const,
        payload: { externalId: "EXT-99" },
        domainRef: "REINFORCEMENT_TEST",
        sourceOrigin: "ESG_GO_EXT_PLATFORM"
    };
    const integrated = await OmniOne.manifest(integrationSeed);

    if (integrated.integration?.sourcePlatform === "ESG_GO_EXT_PLATFORM") {
        console.log("✅ SUCCESS: Seamless Integration (Domain Mapping) verified.");
    } else {
        console.error("❌ FAILED: Integration adapter not applied.");
        process.exit(1);
    }

    // 4. Sustainability & Longevity (永續發展)
    console.log("[Step 4] Testing Sustainability Engine...");
    if (integrated.sustainability && integrated.sustainability.longevityScore > 0) {
        console.log("✅ SUCCESS: Sustainability scoring active.");
        console.log(`[Sustainability] Longevity Score: ${integrated.sustainability.longevityScore}`);
        console.log(`[Sustainability] Impact Horizon: ${integrated.sustainability.impactHorizon}`);
    } else {
        console.error("❌ FAILED: Sustainability engine inactive.");
        process.exit(1);
    }

    // 5. Deep-Breadth Audit (深貫廣通)
    console.log("[Step 5] Testing Deep-Breadth Scanner...");
    const auditRes = await OmniBase.scanDeep(child);
    if (auditRes.health > 0) {
        console.log("✅ SUCCESS: Deep-Breadth Audit complete.");
        auditRes.auditLog.forEach(log => console.log(`  - ${log}`));
    } else {
        console.error("❌ FAILED: Deep audit returned zero health.");
        process.exit(1);
    }

    console.log("\n✨ ALL OPTIMIZATIONS PASSED: InfoOne is now REINFORCED & SUSTAINABLE.");
    console.log("--- VERIFICATION COMPLETE: Phase 11 Universal Optimization ---");
    process.exit(0);
}

runReinforcementVerification().catch(e => {
    console.error("Reinforcement verification crashed:", e);
    process.exit(1);
});
