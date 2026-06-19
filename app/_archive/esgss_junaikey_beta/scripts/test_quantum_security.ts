import { GoodwardLogicGate } from '../src/omni/core/GoodwardCore';
import { quantumEncryptionService } from '../src/services/QuantumEncryptionService';
import { omniLogger, LogCategory } from '../src/services/omniLogger';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore';

/**
 * 🧪 Phase 101: Quantum Security Verification Script
 */
async function verifyQuantumSecurity() {
    console.log('--- [Phase 101] Quantum Verification Beginning ---');

    // 1. Setup Mock ESG Asset Data
    const mockAsset: Partial<IComponentCore> = {
        uuid: 'test-quantum-asset-01',
        data: {
            carbon_emissions: 100,
            unit: 'tons',
            period: '2026-Q1'
        },
        evidence: {
            tangible: { metric: 'Carbon_Inventory_v1', visual_grade: 'PLATINUM' },
            traceable: { source_origin: 'iot-sensor-factory-01' },
            trackable: { lifecycle_hooks: [{ event: 'Ingest', timestamp: Date.now(), actor: 'Sentinel' }] },
            transparent: { formula: 'ISO-14064' }
        }
    };

    // 2. Perform Crystallization (Triggers Logic Gate + Quantum Seal)
    console.log('[Step 1] Crystallizing asset with 5T Logic Gate...');
    const result = GoodwardLogicGate.crystallize(mockAsset);

    console.log(`[Status] Asset Status: ${result.status}`);
    console.log(`[Status] SHA-256 Lock: ${result.evidence.trustworthy?.hash_lock}`);
    console.log(`[Status] Quantum Seal: ${result.evidence.trustworthy?.quantumSeal}`);

    // 3. Verify Quantum Seal
    console.log('[Step 2] Verifying Quantum Seal integrity...');
    if (!result.evidence.trustworthy?.quantumSeal) {
        throw new Error('❌ Verification Failed: Quantum Seal missing from trustworthy evidence.');
    }

    const contentString = JSON.stringify({
        tangible: result.evidence.tangible,
        traceable: result.evidence.traceable,
        trackable: result.evidence.trackable,
        transparent: result.evidence.transparent,
        data: result.data,
    });

    const isSealValid = quantumEncryptionService.verifyQuantum(contentString, result.evidence.trustworthy.quantumSeal);

    if (isSealValid) {
        console.log('✅ [Success] Quantum Seal Verified using Lattice-based logic.');
    } else {
        throw new Error('❌ Verification Failed: Quantum Seal validation failed.');
    }

    // 4. Test Tamper Resistance
    console.log('[Step 3] Testing Tamper Resistance (Simulating mutation)...');
    const tamperedContent = contentString + " [COMPROMISED]";
    const isTamperDetected = !quantumEncryptionService.verifyQuantum(tamperedContent, result.evidence.trustworthy.quantumSeal);

    if (isTamperDetected) {
        console.log('✅ [Success] Tamper attempt detected by Quantum Seal.');
    } else {
        throw new Error('❌ Verification Failed: Tamper attempt went undetected!');
    }

    console.log('\n--- [Phase 101] Quantum Verification PASSED ---');
}

verifyQuantumSecurity().catch(err => {
    console.error('FAILED:', err);
    process.exit(1);
});
