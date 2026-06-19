import { CelestialLifecycleManager } from './src/core/celestial-lifecycle';
import { EvolutionEngine } from './src/core/evolution-engine';

async function verifyCelestialCommand() {
    console.log("💎 Starting Celestial Command Verification...");

    try {
        // 1. Genesis Forge
        console.log("\n1. Genesis Forge [信]");
        let artifact = CelestialLifecycleManager.forgeInit({ goal: "Net Zero" }, "Thoth_Scribe");
        console.log(`✅ Artifact Forged: ${artifact._core.uuid}`);
        console.log(`✅ Version: ${artifact._core.version}`);
        console.log(`✅ Hash Lock: ${artifact.hash_lock}`);

        // 2. Immutability Check
        console.log("\n2. Immutability Check [Trustworthy]");
        try {
            (artifact as any).goal = "Hack";
            console.log("❌ Error: Object.freeze() bypassed!");
        } catch (e) {
            console.log("✅ Immutability Confirmed: Object is frozen.");
        }

        // 3. Life Cycle Update
        console.log("\n3. Life Cycle Update [真/善]");
        artifact = await CelestialLifecycleManager.onUpdate(artifact, { carbon_saved: 50 }, "Agent_Sovereign");
        console.log(`✅ Evolved to v${artifact._core.version}`);
        console.log(`✅ New Hash: ${artifact.hash_lock}`);
        console.log(`✅ Evidence Length: ${artifact._core.evidence.length}`);

        // 4. Entropy Audit
        console.log("\n4. Entropy Audit [通/感]");
        const entropy = (EvolutionEngine as any).auditEntropy("Verification_Module", 85);
        console.log(`✅ Audit Result: ${entropy}%`);

        console.log("\n💎 Celestial Command Integration Confirmed.");
    } catch (error) {
        console.error("❌ Verification Error:", error);
    }
}

verifyCelestialCommand();
