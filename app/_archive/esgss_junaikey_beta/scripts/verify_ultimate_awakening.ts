
import { InfoOneCore } from '../src/omni/core/InfoOneCore.ts';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore.ts';

// Polyfill BroadcastChannel for Node.js environment if missing
if (typeof globalThis.BroadcastChannel === 'undefined') {
    (globalThis as any).BroadcastChannel = class MockBroadcastChannel {
        name: string;
        onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
        constructor(name: string) {
            this.name = name;
        }
        postMessage(message: any): void { }
        close(): void { }
        addEventListener(): void { }
        removeEventListener(): void { }
        dispatchEvent(): boolean { return true; }
    };
}

async function verifyUltimateAwakening() {
    console.log('🌟 Starting Ultimate Eternal Awakening Verification...');

    try {
        // 1. Initialize InfoOneCore with valid 5T Evidence
        const core = new InfoOneCore({
            uuid: 'UUID-ETERNAL-TEST-001',
            version: '1.0.0-ETERNAL',
            timestamp: Date.now(),


            evidence: {
                tangible: { metric: 'Entropy Reduced: 99.9%' },
                traceable: { source_origin: 'GENESIS_TEST_SCRIPT' },
                trackable: {
                    lifecycle_hooks: [
                        { event: 'HOOK_INIT', timestamp: Date.now(), actor: 'GENESIS_SCRIPT' },
                        { event: 'HOOK_AWAKEN', timestamp: Date.now(), actor: 'GENESIS_SCRIPT' }
                    ]
                },
                transparent: { formula: 'E = mc^2 + Love' }, // Valid 5T
            }
        });

        console.log(`[1] Core Initialized. Status: ${core.status}`);

        // 2. Activate the Core (Requirement for Awakening)
        core.activate();
        console.log(`[2] Core Activated (Initiating). Status: ${core.status}`);

        // Wait for activation (simulated 1000ms + buffer)
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`[2.1] Core Status after wait: ${core.status}`);

        if (core.status !== 'ACTIVE') {
            throw new Error(`Core failed to activate. Current status: ${core.status}`);
        }

        // 3. Trigger Ultimate Awakening
        console.log('[3] Triggering awakenUltimateEternalOmniCircle...');
        try {
            await core.awakenUltimateEternalOmniCircle();
        } catch (err: any) {
            if (err.message && (err.message.includes('API') || err.message.includes('Supabase'))) {
                console.warn('⚠️ API Error occurred (Expected in test env):', err.message);
                console.log('Proceeding to verify core state...');
            } else {
                // If it's a different error, rethrow
                throw err;
            }
        }

        // 4. Verification
        console.log(`[4] Awakening Complete. Verifying State...`);
        console.log(`    Current Status: ${core.status}`);

        // 4.1 Check Status
        if ((core.status as string) !== 'Trustworthy') {
            console.error('❌ FAILED: Status is not Trustworthy. Current:', core.status);
        } else {
            console.log('✅ PASS: Status is Trustworthy.');
        }

        // 4.2 Check Freeze (Immutability)
        const isFrozen = Object.isFrozen(core);
        if (!isFrozen) {
            console.error('❌ FAILED: Core object is not frozen.');
        } else {
            console.log('✅ PASS: Core object is frozen (Absolute Territory Established).');
        }

        // 4.3 Check Hash Lock
        // We need to access the evidence safely, as it might be typed as IEvidenceMap
        const trustedEvidence = (core.evidence as any).trustworthy;
        if (trustedEvidence && trustedEvidence.hash_lock && trustedEvidence.territory_type === 'ABSOLUTE') {
            console.log(`✅ PASS: Eternal Palace Erected. Hash: ${trustedEvidence.hash_lock}`);
        } else {
            console.error('❌ FAILED: Eternal Palace evidence missing or incorrect.');
            console.log('Evidence:', JSON.stringify(core.evidence, null, 2));
        }

        console.log('🌟 Verification Sequence Completed.');

    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
    }
}

verifyUltimateAwakening();
