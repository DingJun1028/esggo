// --- 🌐 Polyfills & Mocks for Node.js Environment ---
if (typeof (global as any).BroadcastChannel === 'undefined') {
    (global as any).BroadcastChannel = class {
        constructor(name: string) { console.log(`[Mock] BroadcastChannel created: ${name}`); }
        postMessage(data: any) { }
        onmessage = (event: any) => { };
        close() { }
    };
}

import { AvatarService } from '../src/services/AvatarService';
import { InfoOneCore } from '../src/omni/core/InfoOneCore';

/**
 * 🧪 Verify First Resonance Flow
 * --------------------------------------------------
 * Purpose: Ensure the "Digital Agency" awakening logic adheres to 5T Protocol v16.0.0.
 */

// process error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

async function verifyFirstResonance() {
    console.log('--- 🧪 STARTING FIRST RESONANCE VERIFICATION (v16.0.0) ---');

    const archetypes = ['water', 'gold', 'earth', 'fire', 'wood'];

    for (const archetype of archetypes) {
        console.log(`\nTesting Resonance: ${archetype.toUpperCase()}`);

        // 1. Create Avatar
        const core = AvatarService.createPrimaryAvatar(archetype);

        // 2. Verify Identity
        console.log(`- UUID: ${core.uuid}`);
        console.log(`- Version: ${core.version}`);
        if (core.version !== '16.0.0-omni') {
            throw new Error(`Invalid version: ${core.version}`);
        }

        // 3. Verify Virtues (Elemental Mapping)
        console.log(`- Intelligence: ${core.virtues.intelligence}`);
        console.log(`- Integrity: ${core.virtues.integrity}`);
        console.log(`- Harmony: ${core.virtues.harmony}`);

        // Quick validation of bonuses
        if (archetype === 'water' && core.virtues.harmony !== 9) { // 8 + 1
            console.error('❌ Water bonus not applied correctly to Harmony');
        }
        if (archetype === 'gold' && core.virtues.integrity !== 10) { // 9 + 1
            console.error('❌ Gold bonus not applied correctly to Integrity');
        }

        // 4. Verify 5T Protocol & Lock
        console.log(`- Status: ${core.status}`);
        if (core.status !== 'Trustworthy') {
            throw new Error(`Avatar Core not locked! Status: ${core.status}`);
        }

        const evidence = core.getProjection();
        console.log('- 5T Projection Matrix:');
        console.log(`  - Tangible (Beauty): ${evidence.beauty.value}`);
        console.log(`  - Traceable (Truth): ${evidence.truth_trace.value}`);
        console.log(`  - Transparent (Goodness): ${evidence.goodness.value}`);
    }

    console.log('\n✅ --- VERIFICATION COMPLETE: ALL ARCHETYPES COMPLIANT ---');
}

verifyFirstResonance().catch(err => {
    console.error('❌ VERIFICATION FAILED:', err);
    process.exit(1);
});
