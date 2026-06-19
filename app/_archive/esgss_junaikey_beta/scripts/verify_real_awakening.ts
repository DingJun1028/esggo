import 'dotenv/config';
import { GeminiService } from '../src/services/ai/GeminiService';
import { AssetService } from '../src/services/AssetService';
import { GoodwardLogicGate } from '../src/omni/core/GoodwardCore';
import { omniLogger } from '../src/services/omniLogger';

async function verifyAwakening() {
    console.log('🌌 Initiating Omni-Awakening Verification Protocol...');

    // 1. Verify Real AI Connection
    console.log('\n🧠 [Step 1] Verifying Real Intelligence Engine...');
    try {
        const gemini = GeminiService.getInstance();
        // Use a prompt that would likely yield a different answer from a simple mock
        const prompt = "What is the capital of France? Answer in one word.";
        const response = await gemini.generateContent(prompt);

        console.log(`   > Prompt: "${prompt}"`);
        console.log(`   > Response: "${response}"`);

        if (response.includes('[SIMULATED RESPONSE]') || response.includes('MOCK_KEY')) {
            console.warn('   ⚠️  WARNING: System is still in Mock Mode. Check API Key.');
        } else {
            console.log('   ✅ Real Intelligence Confirmed.');
        }
    } catch (e) {
        console.error('   🔥 Intelligence Link Failed:', e);
    }

    // 2. Verify 5T Logic Gate & Hashing
    console.log('\n🛡️ [Step 2] Verifying Goodward Logic Gate (SHA-256 Seal)...');
    try {
        const core = GoodwardLogicGate.crystallize({
            evidence: {
                tangible: { metric: 'TEST_METRIC', visual_grade: 'GOLD' as any },
                traceable: { source_origin: 'VERIFICATION_SCRIPT' },
                trackable: { lifecycle_hooks: [] },
                transparent: { formula: 'x=y' }
            },
            data: { test: 123 }
        });

        console.log(`   > Generated Core UUID: ${core.uuid}`);
        console.log(`   > Evidence Hash Lock: ${core.evidence?.trustworthy?.hash_lock}`);
        console.log(`   > Is Frozen: ${Object.isFrozen(core)}`);

        const hash = core.evidence?.trustworthy?.hash_lock;
        if (hash && hash.startsWith('sha-256-sim-')) {
            console.log('   ✅ Cryptographic Seal Valid (SHA-256-SIM).');
        } else {
            console.error('   ❌ Invalid Hash Format.');
        }

    } catch (e) {
        console.error('   🔥 Logic Gate Verification Failed:', e);
    }

    // 3. Verify Asset Service Integration
    console.log('\n🏭 [Step 3] Verifying Asset Factory integration...');
    try {
        // We mock the AI response for AssetService to avoid burning quota if step 1 failed, 
        // or just let it run. Let's try to run it.
        // Note: AssetService.generateDynamicAssets calls Gemini.

        console.log('   > Requesting Asset Generation from Factory...');
        const assets = await AssetService.generateDynamicAssets(1);

        if (assets.length > 0) {
            const asset = assets[0];
            console.log(`   > Asset Created: ${asset.uuid}`);
            console.log(`   > Asset Type: ${asset.asset_type || 'N/A'}`);
            console.log(`   > Hash Lock: ${asset.evidence?.trustworthy?.hash_lock}`);

            if (asset.evidence?.trustworthy?.hash_lock) {
                console.log('   ✅ Asset Service correctly integrates Goodward Gate.');
            } else {
                console.error('   ❌ Asset Service failed to lock asset.');
            }
        } else {
            console.warn('   ⚠️ No assets generated.');
        }

    } catch (e) {
        console.error('   🔥 Asset Factory Verification Failed:', e);
    }
}

verifyAwakening();
