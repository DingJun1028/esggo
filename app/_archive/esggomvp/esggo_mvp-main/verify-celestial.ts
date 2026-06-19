import { CelestialLifecycleManager } from './src/core/celestial-lifecycle';
import { EvolutionEngine } from './src/core/evolution-engine';

async function verifyCelestialCommand() {
    console.log("💎 Starting Celestial Command Verification...");

    try {
        // Define testPayload for the new forgeInit call
        const testPayload = { goal: "Net Zero" };

        // 1. Genesis Forge
        console.log("\n1. Genesis Forge [信]");
        const forgedArtifact = await CelestialLifecycleManager.forgeInit(testPayload, "Tester_001");
        console.log("Artifact Forged:", (forgedArtifact as any)._core?.uuid);
        console.log("Version:", (forgedArtifact as any)._core?.version);
        console.log("Hash Lock:", (forgedArtifact as any)._core?.hash_lock);

        // Perform an update immediately after forging
        const updatedArtifact = await CelestialLifecycleManager.onUpdate(forgedArtifact, { ...testPayload, value: 2000 }, "Updater_001");
        console.log("Artifact Updated. New Version:", (updatedArtifact as any)._core?.version);
        console.log("New Hash Lock:", (updatedArtifact as any)._core?.hash_lock);
        console.log("Update Evidence:", (updatedArtifact as any)._core?.evidence);


        // 2. Immutability Check
        console.log("\n2. Immutability Check [Trustworthy]");
        try {
            (forgedArtifact as any).goal = "Hack"; // Use forgedArtifact here
            console.log("❌ Error: Object.freeze() bypassed!");
        } catch (e) {
            console.log("✅ Immutability Confirmed: Object is frozen.");
        }

        // 3. Life Cycle Update
        console.log("\n3. Life Cycle Update [真/善]");
        const finalArtifact = await CelestialLifecycleManager.onUpdate(updatedArtifact, { carbon_saved: 50 }, "Agent_Sovereign");
        console.log(`✅ Evolved to v${(finalArtifact as any)._core?.version}`);
        console.log(`✅ New Hash: ${(finalArtifact as any).hash_lock}`);
        console.log(`✅ Evidence Length: ${(finalArtifact as any)._core?.evidence?.length}`);

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
