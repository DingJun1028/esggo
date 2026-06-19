/**
 * 🧪 AI Asset Generation Test
 * --------------------------------------------------
 * Tests if AssetService can successfully generate assets using Gemini.
 */

import { AssetService } from '../src/services/AssetService';

async function testAiGeneration() {
    console.log('🧪 Starting AI Asset Generation Test...');

    try {
        const assets = await AssetService.generateDynamicAssets(1);
        console.log('✅ AI Assets Generated successfully:');
        console.log(JSON.stringify(assets, null, 2));

        if (assets.length > 0 && assets[0].evidence?.trustworthy?.hash_lock) {
            console.log('🟢 5T Compliance verified in AI generated asset.');
        } else {
            console.warn('🟡 AI Asset generated but 5T Compliance is missing or malformed.');
        }
    } catch (err) {
        console.error('❌ AI Generation Test Failed:', err);
        process.exit(1);
    }
}

testAiGeneration();
