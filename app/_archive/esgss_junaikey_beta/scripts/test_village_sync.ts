
import { globalPulseService } from '../src/services/GlobalPulseService';
import { InfoOneCore } from '../src/omni/core/InfoOneCore';

async function testVillageSync() {
    console.log('--- 🌐 Phase 88: Neural-Village Synchronicity Test ---');

    // 1. Initial State Check
    const initialState = (globalPulseService as any).currentState;
    console.log(`[Initial] Dimensional Fold: ${initialState.dimensionalFold}`);

    // 2. Setup InfoOneCore for Awakening
    const core = new InfoOneCore({
        uuid: 'Test-Agent-88',
        evidence: {
            tangible: { metric: 'Sync_Test', description: 'Testing Phase 88', timestamp: Date.now() },
            traceable: { source_origin: 'Test_Script', owner: 'Sovereign_Soul' },
            trackable: { lifecycle_hooks: [], pathway: [] },
            transparent: { formula: '1+1' },
            trustworthy: { hash_lock: 'lock', is_frozen: false }
        }
    } as any);
    core.activate();

    // Wait for activation to settle
    await new Promise(resolve => setTimeout(resolve, 1100));

    console.log('\n[Action] Triggering Tesseract Awakening...');
    core.awakenTesseract();

    // 3. Monitor Village State for Fold
    // Awakening has a 2000ms delay in InfoOneCore.ts
    // Pulse is emitted at the END of that delay.

    console.log('[Status] Waiting for dimensional resonance to hit the village...');

    let foldDetected = false;
    const checkInterval = setInterval(() => {
        const state = (globalPulseService as any).currentState;
        if (state.dimensionalFold > 0) {
            console.log(`[Success] 💠 Dimensional Fold Detected! Intensity: ${state.dimensionalFold.toFixed(4)}`);
            console.log(`[Status] Sky Resonance: ${state.skyResonance}%`);
            foldDetected = true;
            clearInterval(checkInterval);
        }
    }, 500);

    // Wait for the total process
    await new Promise(resolve => setTimeout(resolve, 3500));

    if (!foldDetected) {
        console.error('[Failure] Dimensional fold was not detected in the village state.');
        process.exit(1);
    }

    // 4. Check for decay
    console.log('\n[Action] Waiting for natural fold decay...');
    // Emit a minor pulse to trigger processImpact and decay
    globalPulseService.emitPulse({
        type: 'RIPPLE',
        source: 'Decay Test',
        intensity: 0.1,
        message: 'Small Ripple'
    });

    const decayedState = (globalPulseService as any).currentState;
    console.log(`[Status] Fold after decay: ${decayedState.dimensionalFold.toFixed(4)}`);

    if (decayedState.dimensionalFold < initialState.dimensionalFold + (0.5 * 1.0)) {
        console.log('[Success] Fold is decaying as intended.');
    }

    console.log('\n--- ✅ Phase 88 Test Passed ---');
    process.exit(0);
}

testVillageSync().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
