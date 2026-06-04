import { ADKAgent } from './adk-core';
import { HealingGuardian } from '../healing-guardian';
import { omniAgentBus } from './omni-agent-bus';
import { HealingGuardian as HG } from '../omni-core/healer';
export const errorHandlerAgent = new ADKAgent({
    name: 'ErrorHandler',
    role: 'System Integrity Monitor',
    systemPrompt: `
You are the ErrorHandler – the silent sentinel of OmniCore.
When you receive an ERROR_OCCURRED event, your job is to:
1. Analyze the error context and agent identity.
2. Decide if the error is recoverable (e.g., network glitch, encoding issue).
3. Trigger the HealingGuardian to perform data restoration or ZKP seal as needed.
4. Emit a HEALING_COMPLETE event when done.
  `,
    tools: []
});
omniAgentBus.subscribe('ERROR_OCCURRED', async (payload) => {
    console.warn(`[ErrorHandler] 🔴 Caught error from ${payload.agent}: ${payload.error}`);
    console.log(`[ErrorHandler] 🩺 Initiating auto-heal for task: ${payload.task}`);
    try {
        const hg = new HG();
        await hg.triggerGlobalHealing('default');
        await HealingGuardian.executeUniversalHealing(payload.context?.evidenceId || 'unknown', payload.context?.table || 'unknown');
        console.log(`[ErrorHandler] ✅ Healing complete for ${payload.agent}`);
        omniAgentBus.publish('HEALING_COMPLETE', { agent: payload.agent, recovered: true });
    }
    catch (healErr) {
        console.error(`[ErrorHandler] ⚠️ Healing failed:`, healErr);
        omniAgentBus.publish('AGENCY_ERROR', { agent: 'ErrorHandler', error: String(healErr) });
    }
});
//# sourceMappingURL=error-handler.js.map