import { OmniOneMCPServer } from './src/core/omnione-mcp-server';
import { CelestialLifecycleManager } from './src/core/lifecycle-manager';

async function verifyLifecycle() {
    console.log("🚀 Starting 5T Lifecycle Verification...");

    try {
        // 1. Genesis Forge
        const uuid = await OmniOneMCPServer.forge("Genesis_Commander", {
            type: "ESG_STRATEGY",
            content: "Initial ESG Plan 2026"
        });
        console.log(`✅ Artifact Forged: ${uuid}`);

        const initial = OmniOneMCPServer.getArtifact(uuid);
        console.log(`Initial Version: ${initial._core.version}`);
        console.log(`Hash Lock: ${initial.hash_lock}`);

        // 2. Evolution (Update)
        console.log("\n🔮 Evolving Artifact...");
        const evolutionResult = await OmniOneMCPServer.evolve(
            uuid,
            { content: "Optimized ESG Plan 2026 (v2)" },
            "Strategy_Agent_Alpha",
            "[ISO-14064-2:2026]"
        );

        const evolved = OmniOneMCPServer.getArtifact(uuid);
        console.log(`Evolved Version: ${evolved._core.version}`);
        console.log(`New Hash Lock: ${evolved.hash_lock}`);
        console.log(`Evidence Chain Length: ${evolved._core.evidence.length}`);

        // 3. Immutability Check
        try {
            console.log("\n🛡️ Testing Immutability...");
            evolved.content = "HACKED";
            console.log("❌ Immutability Failed: Object was modified!");
        } catch (e) {
            console.log("✅ Immutability Confirmed: Cannot modify frozen object.");
        }

        // 4. Verification Proof
        if (initial.hash_lock !== evolved.hash_lock) {
            console.log("✅ 5T Protocol Integrity Confirmed: Hash changed after state evolution.");
        } else {
            console.log("❌ 5T Protocol Integrity Failed: Hash did not change!");
        }

        console.log("\n✨ Verification Complete.");
    } catch (error) {
        console.error("❌ Verification Error:", error);
    }
}

verifyLifecycle();
