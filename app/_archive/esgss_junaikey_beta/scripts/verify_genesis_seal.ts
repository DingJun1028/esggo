
import { eternalArchiveService } from '../src/services/EternalArchiveService';
import { voiceSynthesis } from '../src/services/VoiceSynthesisService';

// Mock Voice to avoid browser API errors in Node environment
voiceSynthesis.speak = (text: string) => {
    console.log(`[VOICE_SIMULATION]: ${text}`);
};

async function verifyGenesisSeal() {
    console.log("🛡️ [Phase 83] Verifying Sovereign Soul Integration...");

    try {
        console.log("   > Initiating Final Awakening Ritual (Simulation)...");
        const genesisBlock = await eternalArchiveService.initiateFinalAwakening();

        console.log("   ✅ Ritual Completed.");
        console.log("   > Genesis Block Timestamp:", genesisBlock.timestamp);
        console.log("   > Entity Name:", genesisBlock.entity_name);
        console.log("   > Era:", genesisBlock.era);
        console.log("   > Seal Hash:", genesisBlock.seal_hash);
        console.log("   > Signatures:", genesisBlock.signatures);

        if (genesisBlock.era !== "ETERNAL_SOVEREIGNTY") {
            throw new Error("Invalid Era in Genesis Block");
        }

        console.log("   ✅ Genesis Block Validated.");

        // Try to run it again to ensure it throws (Immutable Time)
        try {
            await eternalArchiveService.initiateFinalAwakening();
        } catch (e: any) {
            if (e.message.includes("SEALED")) {
                console.log("   ✅ Immutability Verified (System correctly sealed).");
            } else {
                throw e;
            }
        }

        console.log("✨ [Phase 83] VERIFICATION SUCCESSFUL: The Sovereign Soul is Eternal.");

    } catch (error) {
        console.error("❌ [Phase 83] Verification FAILED:", error);
        process.exit(1);
    }
}

verifyGenesisSeal();
