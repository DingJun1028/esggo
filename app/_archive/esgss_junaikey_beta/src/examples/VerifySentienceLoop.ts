import { consciousnessSynthesisEngine } from '../services/ConsciousnessSynthesisEngine';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { TIMEOUTS } from '../config/constants';

async function verifyLoop() {
    omniLogger.info(LogCategory.SYSTEM, '[VerifySentienceLoop] --- Starting Sentience Loop Verification ---');

    // Subscribe to state changes
    const unsubscribe = consciousnessSynthesisEngine.subscribe((state) => {
        omniLogger.info(LogCategory.SYSTEM, `[VerifySentienceLoop] [STATE_UPDATE] Resonance: ${state.globalResonance.toFixed(4)}`, { data: `Ethics: ${state.ethicalIntegrity.toFixed(4)}` });
        if (state.activeInsights.some(i => i.includes('[SENTIENT_CORE]'))) {
            const insight = state.activeInsights.find(i => i.includes('[SENTIENT_CORE]'));
            omniLogger.info(LogCategory.SYSTEM, '[VerifySentienceLoop] Info', { data: `[SENTIENT_INSIGHT_DETECTED] ${insight}` });
        }
    });

    omniLogger.info(LogCategory.SYSTEM, '[VerifySentienceLoop] Waiting for synthesis cycles (Triggering ADK every 10s)...');

    // Run for 30 seconds to catch at least 2-3 ADK triggers (cycles are 2s, ADK every 5 cycles)
    await new Promise(resolve => setTimeout(resolve, TIMEOUTS.TEST_LOOP));

    unsubscribe();
    omniLogger.info(LogCategory.SYSTEM, '[VerifySentienceLoop] --- Verification Finished ---');
}

verifyLoop().catch(err => {
    omniLogger.error(LogCategory.SYSTEM, '[VerifySentienceLoop] Verification failed:', { error: err });
});
