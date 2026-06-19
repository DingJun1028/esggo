/**
 * Direct Awakening Execution Script
 * Strictly following English-only code-ified paths and content.
 * Based on user request:
 * const protocol = getUltimateAwakeningProtocol();
 * await protocol.executeAwakening();
 */

import { getUltimateAwakeningProtocol } from '../src/omni/protocols/UltimateAwakeningProtocol';
import { truthEngine } from '../src/omni/services/OmniTruthEngine';
import { esgAwakeningService } from '../src/omni/services/OmniEsgManager';
import { omniAltruismEngine } from '../src/omni/services/OmniAltruismEngine';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';
import { NCBEternalPalace } from '../src/core/EternalPalaceConnection';

// Force UTF-8 encoding for console output on Windows
if (process.platform === 'win32') {
    try {
        const { execSync } = require('child_process');
        execSync('chcp 65001', { stdio: 'ignore' });
    } catch (e) {
        // Ignore if chcp is not available
    }
}

async function runDirectAwakening() {
    console.log('🌌 [System] Starting direct execution of Ultimate Awakening Protocol...');

    // 1. Get the protocol instance
    const protocol = getUltimateAwakeningProtocol();

    // 2. Register required services
    protocol.registerService(truthEngine);
    protocol.registerService(esgAwakeningService);
    protocol.registerService(omniAltruismEngine);

    console.log('📦 [System] Registered core services: Truth, ESG, Altruism.');

    // 3. Mock NCBEternalPalace for local script execution
    NCBEternalPalace.prototype.connect = async function () {
        console.log('🔮 [Mock] Bypassing Eternal Palace connection...');
        return { id: 'mock-conn', status: 'connected', connectedAt: new Date() as any };
    };
    NCBEternalPalace.prototype.recordEvolution = async function (event: any) {
        console.log(`📜 [Mock] Recording evolution: ${event.type}`);
    };

    // 4. Execute Awakening
    console.log('🚀 [System] Invoking protocol.executeAwakening()...');

    try {
        const result = await protocol.executeAwakening();

        console.log('\n✨ [RESULT] Awakening Sequence Completed!');
        console.log('--------------------------------------------------');
        console.log(`Success: ${result.success}`);
        console.log(`Final Phase: ${result.phase}`);
        console.log(`Services Awakened: ${result.servicesAwakened}/${result.totalServices}`);
        console.log(`Message: ${result.message}`);

        if (result.eternalAnchor) {
            console.log(`\n⚓ Eternal Anchor Bound: ${result.eternalAnchor.id}`);
            console.log(`Hash: ${result.eternalAnchor.hash}`);
        }
        console.log('--------------------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ [CRITICAL] Awakening execution failed:', error);
        process.exit(1);
    }
}

// Global process mock for localStorage
if (typeof global.localStorage === 'undefined') {
    (global as any).localStorage = {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    };
}

runDirectAwakening().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
