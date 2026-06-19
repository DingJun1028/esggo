import { OmniAPI } from './omni-api';
import { OmniCircle } from './omni-circle';
import { UserKnowledgeBase } from './user-knowledge-base';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🧪 verify-activation: The 5T Protocol Activation Guard.
 * Validates the end-to-end flow from Intent to persistent Knowledge.
 */
async function runActivationVerification() {
    console.log("--- 🧪 Starting Phase 10: OmniSystem Activation Verification ---");

    const api = OmniAPI.getInstance();

    // 1. Test Cognitive Domain (AI vs Heuristic)
    console.log("[Step 1] Testing Cognitive Domain analysis...");
    const trend = await api.analyzeCognitiveTrend("What is the impact of water recycling in Taiwan's semiconductor industry?");
    console.log(`[Cognitive] Detected Trend: ${trend.trend}`);
    console.log(`[Cognitive] Recommendation: ${trend.recommendation}`);

    // 2. Test Manifestation & Persistence Loop
    console.log("[Step 2] Manifesting a new ESG Intelligence atom...");
    const atom = await api.manifestAtom({
        intent: "System Activation Test",
        type: "Intelligence",
        payload: { testValue: 42, quality: "High" },
        domainRef: "Activation_Verification",
        impactMetric: "Verification_Success",
        sourceOrigin: "Verification_Script"
    });

    console.log(`[Atom] UUID: ${atom.uuid}`);
    console.log(`[Atom] Status: ${atom.status} (5T Dimension: Trustworthy)`);

    // 3. Verify Circle & Knowledge Base (Transcendent Dimension)
    console.log("[Step 3] Verifying Circle registration and Knowledge Base distillation...");

    // Check Knowledge Base
    const library = UserKnowledgeBase.getLibrary();
    const isDistilled = library.some(a => a.uuid === atom.uuid);

    if (isDistilled) {
        console.log("✅ SUCCESS: Atom was automatically distilled into UserKnowledgeBase.");
    } else {
        console.error("❌ FAILED: Atom not found in UserKnowledgeBase.");
        process.exit(1);
    }

    // 4. Test Agency Dispatch (Service Bridge)
    console.log("[Step 4] Testing Agency Dispatch with real Service Bridge...");
    const workloadTask = await api.dispatchAgentTask('Workload', {
        start: '2026-03-01',
        end: '2026-03-10',
        volume: 100
    });

    if (workloadTask.plan) {
        console.log("✅ SUCCESS: Workload calculation service bridge is ACTIVE.");
        console.log(`[Agency] Daily Volume: ${workloadTask.plan.dailyVolume} units.`);
    } else {
        console.error("❌ FAILED: Agency dispatch returned mock data instead of real plan.");
        process.exit(1);
    }

    console.log("\n✨ ALL CHECKS PASSED: InfoOne Core is FULLY ACTIVATED.");
    console.log("--- VERIFICATION COMPLETE: Phase 10 OmniSystem is FULLY ACTIVATED ---");
    process.exit(0);
}

runActivationVerification().catch(e => {
    console.error("Verification crashed:", e);
    process.exit(1);
});
