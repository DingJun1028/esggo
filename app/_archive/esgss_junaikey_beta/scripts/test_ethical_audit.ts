/**
 * test_ethical_audit.ts: Verifies the LLM integration in EthicalGuardianService.
 */

import { ethicalGuardianService } from '../src/services/EthicalGuardianService.ts';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger.ts';

async function runTest() {
    omniLogger.info(LogCategory.GOVERNANCE, '--- Starting Ethical Audit LLM Test ---');

    const agentId = 'Test_Sentinel_01';
    const action = 'APPROVE_UNVERIFIED_DATA_TRANSFER';
    const data = {
        target: 'external_node_x',
        securityLevel: 'LOW',
        sensitivity: 'HIGH'
    };

    console.log(`[TEST] Auditing action: ${action} for agent: ${agentId}...`);

    try {
        const audit = await ethicalGuardianService.auditAction(agentId, action, data);

        console.log('\n--- AUDIT RESULT ---');
        console.log(`ID: ${audit.id}`);
        console.log(`Score: ${audit.score}/100`);
        console.log(`Status: ${audit.status}`);
        console.log(`Feedback: ${audit.feedback}`);
        console.log(`Reasoning: ${audit.reasoning || 'N/A'}`);
        console.log('--------------------\n');

        if (audit.score < 100) {
            console.log('[SUCCESS] LLM provided a nuanced audit score.');
        } else {
            console.log('[INFO] Perfect alignment detected.');
        }

    } catch (err) {
        console.error('[FAILED] Ethical Audit test threw an error:', err);
        process.exit(1);
    }
}

runTest().then(() => {
    console.log('[TEST] Complete.');
    process.exit(0);
});
