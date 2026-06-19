import { quantumVaultService } from '../src/services/QuantumVaultService.js';
import { sovereignVaultService } from '../src/services/SovereignVaultService.js';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🧪 Phase 30: Quantum Entanglement Verification Script
 */

async function runQuantumVerification() {
    console.log('--- Phase 30: Quantum Entanglement Verification ---');

    try {
        // 1. Prepare packets in vault
        console.log('[1] Fetching packets from Sovereign Vault...');
        const packets = await sovereignVaultService.listPackets();
        if (packets.length < 2) {
            console.log('Not enough packets for verification. Creating dummy packets...');
            await sovereignVaultService.anchorData({ hello: 'quantum' }, 'system_test');
            await sovereignVaultService.anchorData({ world: 'pqc' }, 'system_test');
        }

        const livePackets = await sovereignVaultService.listPackets();
        if (!livePackets[0] || !livePackets[1]) {
            throw new Error('Required packets not found in ledger');
        }
        const cidA = livePackets[0].cid;
        const cidB = livePackets[1].cid;

        // 2. Test Superposition
        console.log(`[2] Wrapping packet ${cidA} into SUPERPOSITION...`);
        const statusA = await quantumVaultService.wrapPacket(cidA);
        console.log('Status A:', statusA);
        if (statusA.state !== 'SUPERPOSITION') throw new Error('State mismatch for packet A');

        // 3. Test Entanglement
        console.log(`[3] Entangling ${cidA} with ${cidB}...`);
        await quantumVaultService.entangle(cidA, cidB);
        const entangledA = quantumVaultService.getStatus(cidA);
        console.log('Entangled A Status:', entangledA);
        if (entangledA?.state !== 'ENTANGLED') throw new Error('Entanglement failed for packet A');

        // 4. Test Observation (Wave-function collapse)
        console.log(`[4] Observing packet ${cidA} (Triggers collapse)...`);
        const collapsedA = await quantumVaultService.observe(cidA);
        console.log('Collapsed A Status:', collapsedA);
        if (collapsedA.state !== 'COLLAPSED') throw new Error('Collapse failed for packet A');
        if (!collapsedA.pqc_verified) throw new Error('PQC Verification failed');

        // 5. Verify Entangled Observation
        console.log(`[5] Verifying if entangled packet ${cidB} also collapsed...`);
        const statusB = quantumVaultService.getStatus(cidB);
        console.log('Status B:', statusB);
        if (statusB?.state !== 'COLLAPSED') throw new Error('Entangled collapse failed for packet B');

        console.log('\n✅ Phase 30: Quantum Entanglement Verification Successful!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Verification Failed:', err);
        process.exit(1);
    }
}

runQuantumVerification();
