import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.ts';
import { omniMasterAgent } from '../adk/agents/OmniMasterAgent.ts';
import { OMNI_DECREE } from '../omni/core/OmniConstitution.ts';

async function verifyEternalConvergence() {
    try {
        omniLogger.info(LogCategory.SYSTEM, '🌌 Verifying Eternal Convergence...');

        // check core status
        if (OMNI_DECREE.status !== 'ACTIVE') {
            throw new Error('Omni Decree is not ACTIVE');
        }

        const response = await omniMasterAgent.executeDirective('Verify System Integrity');

        if (response) {
            omniLogger.info(LogCategory.SYSTEM, '✅ Eternal Convergence Verified!');
            console.log('Verification Success:', JSON.stringify(response, null, 2));
        } else {
            throw new Error('Master Agent returned no response');
        }

    } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, `❌ Convergence Failed: ${error}`);
        process.exit(1);
    }
}

verifyEternalConvergence().catch(err => {
    console.error(err);
    process.exit(1);
});
