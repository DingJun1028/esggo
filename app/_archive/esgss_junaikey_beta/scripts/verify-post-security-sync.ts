/**
 * Phase 66: Post-Security Synchronization Verification
 * --------------------------------------------------
 * Verifies that Yuantong Flows are signed with Post-Quantum Cryptography (PQC).
 */

import { yuantongOrchestrationService } from '../src/services/YuantongOrchestrationService.js';
import { quantumEncryptionService } from '../server/services/QuantumEncryptionService.js';
import { omniLogger, LogCategory } from '../server/services/omni/infrastructure/logging/OmniLogger.js';

async function runPostSecuritySyncVerification() {
    omniLogger.info(LogCategory.SYSTEM, '🔐 STARTING POST-SECURITY SYNCHRONIZATION VERIFICATION (Phase 66)...');

    console.log('\n🏗️  1. Orchestrating Quantum-Signed Flow...');

    // Simulate a flow
    const flow = await yuantongOrchestrationService.orchestrateFlow('YUANTONG', {
        action: 'VERIFY_PQC_INTEGRATION',
        isStrategic: true,
        data: 'Quantum-Secure Payload'
    });

    console.log(`- Flow ID: ${flow.id}`);
    console.log(`- Signature: ${flow.signature ? flow.signature.substring(0, 20) + '...' : 'MISSING'}`);
    console.log(`- Public Key: ${flow.publicKey ? flow.publicKey.substring(0, 20) + '...' : 'MISSING'}`);

    if (!flow.signature || !flow.publicKey) {
        console.error('❌ Flow missing PQC signature or public key.');
        process.exit(1);
    }

    console.log('\n🏗️  2. Verifying Post-Quantum Signature...');
    const signatureData = `${flow.id}:${flow.timestamp}:${JSON.stringify(flow.dataPayload)}`;

    // Attempt verification using the helper service
    const isValid = quantumEncryptionService.verify5TProtocol(
        signatureData,
        flow.signature,
        flow.publicKey
    );

    console.log(`- Verification Result: ${isValid ? 'VALID' : 'INVALID'}`);

    if (isValid) {
        console.log('✅ Post-Security Synchronization Successful.');
    } else {
        console.error('❌ PQC Signature Verification Failed.');
        process.exit(1);
    }

    console.log('\n================================================');
    console.log('🔐 QUANTUM YUANTONG VERIFIED');
    console.log('Status: ABSOLUTE SOVEREIGN TRUST');
    console.log('================================================');
}

runPostSecuritySyncVerification().catch(err => {
    console.error('❌ Verification Failed:', err);
    process.exit(1);
});
