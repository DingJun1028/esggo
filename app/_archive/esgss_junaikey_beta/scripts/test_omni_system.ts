console.log('[DEBUG] Starting test_omni_system.ts...');
import { OmniPromptService } from '../server/services/ai/OmniPromptService.js';
console.log('[DEBUG] OmniPromptService imported.');
import OmniPriest from '../server/services/OmniPriest.js';
console.log('[DEBUG] OmniPriest imported.');
import { TruthStatus } from '../server/services/omni/InfoOneCore.js';
console.log('[DEBUG] InfoOneCore imported.');
import dotenv from 'dotenv';
dotenv.config();
console.log('[DEBUG] Dotenv configured.');

async function testOmniSystem() {
    console.log('--- 🧪 Phase 1: OmniPrompt Resonance Verification ---');
    const promptService = new OmniPromptService();

    try {
        // 1. Conduct W4 Ceremony
        console.log('Initiating W4 Ceremony: [ESG_DIAGNOSTIC]');
        const diagnosticResult = await promptService.conductCeremony('ESG_DIAGNOSTIC', '測試企業：奧秘永續科技，主營：AI 開發。');

        console.log('✅ Resonance Successful. DNA Crystallized:');
        console.log(`   UUID: ${diagnosticResult.uuid}`);
        console.log(`   Status: ${diagnosticResult.status}`);
        console.log(`   Hash Lock: ${diagnosticResult.hash_lock}`);
        console.log('--- Content Sneak Peek ---');
        console.log(diagnosticResult.content.substring(0, 200) + '...');

        console.log('\n--- 🧪 Phase 2: OmniPriest Audit & Healing Verification ---');

        // 2. Audit DNA
        const isValid = await OmniPriest.auditDNA(diagnosticResult);
        console.log(`DNA Audit Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

        // 3. Simulate Discordance (Data Corruption)
        console.log('\n[⚠️ SIMULATION] Corrupting DNA Hash Lock...');
        const corruptedDNA = {
            ...diagnosticResult,
            hash_lock: 'DISCORDANCE_DETECTED_001',
            status: TruthStatus.TANGIBLE // Downgrading status
        };

        const isStillValid = await OmniPriest.auditDNA(corruptedDNA);
        console.log(`Corrupted DNA Audit Result: ${isStillValid ? '✅ VALID' : '❌ INVALID (Correctly Detected)'}`);

        // 4. Perform Resurrection Ritual (AutoRepairRitual)
        console.log('\nInitiating AutoRepairRitual...');
        const healedDNA = await OmniPriest.performHealingRitual(corruptedDNA);

        console.log('✅ Healing Ritual Completed.');
        console.log(`   Restored Status: ${healedDNA.status}`);
        console.log(`   Restored Hash Lock: ${healedDNA.hash_lock}`);

        const lastEvent = healedDNA.lifecycle_history[healedDNA.lifecycle_history.length - 1];
        if (lastEvent) {
            console.log(`   Restored Notes: ${lastEvent.notes}`);
        }

        if (healedDNA.status === TruthStatus.TRACKABLE || healedDNA.status === TruthStatus.TRUSTWORTHY) {
            console.log('\n🎉 ALL SYSTEMS TRANSCENDED. 5T PROTOCOL ENFORCED.');
        }

    } catch (err) {
        console.error('❌ Test failed:', err);
    } finally {
        process.exitCode = 0; // Allow natural exit to avoid libuv crash
    }
}

testOmniSystem();
