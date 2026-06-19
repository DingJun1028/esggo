// MOCK: LocalStorage for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import { truthEngine, OmniTruthEngine } from '../src/omni/services/OmniTruthEngine';
import { esgAwakeningService } from '../src/omni/services/OmniEsgManager';
import { omniAltruismEngine } from '../src/omni/services/OmniAltruismEngine';

import { getUltimateAwakeningProtocol } from '../src/omni/protocols/UltimateAwakeningProtocol';
import { awakeningBroadcaster } from '../src/omni/infrastructure/broadcast/AwakeningBroadcaster';
import { awakeningScheduler } from '../src/omni/infrastructure/scheduler/AwakeningScheduler';
import { awakeningStateManager } from '../src/omni/infrastructure/state/AwakeningStateManager';

// Mock Logger to avoid file system or complex logging deps if needed,
// but we'll try to use the real one if it doesn't crash.
// If it crashes, we might need to mock OmniLogger.

async function verifyAwakeningAutomation() {
  console.log('🚀 VERIFICATION START: Automated Awakening Cycle');
  console.log('----------------------------------------------');

  // 1. Setup Truth Engine
  console.log('[Setup] Initializing Truth Engine...');
  const claim = truthEngine.submitClaim('claim-1', 'The sky is blue', 'user-input');
  console.log(`[Truth] Submitted claim: ${claim.content} (Status: ${claim.validationStatus})`);

  // 2. Setup Protocol
  console.log('[Setup] initializing Protocol...');
  const protocol = getUltimateAwakeningProtocol();
  protocol.registerService(truthEngine); // Ensure it's registered
  protocol.registerService(esgAwakeningService); // Ensure ESG is registered
  protocol.registerService(omniAltruismEngine); // Ensure Altruism is registered

  // MOCK: Patch Eternal Palace to avoid network calls
  console.log('[Setup] Mocking Eternal Palace connection...');
  const palace = (protocol as any).eternalPalace;
  if (palace) {
    palace.connect = async () => {
      console.log('[MockPalace] Connected successfully.');
      return { id: 'mock', status: 'connected' };
    };
    palace.recordEvolution = async (event: any) => {
      console.log('[MockPalace] Recorded evolution:', event.type);
    };
  }

  // 3. Setup Listeners (Enlightening Others)
  console.log('[Setup] Subscribing to Broadcaster (Simulation of UI)...');
  awakeningBroadcaster.subscribe(event => {
    console.log(`[Broadcast 📡] Event: ${event.type}`, event.data);
  });
  awakeningBroadcaster.subscribeToInsights(insight => {
    console.log(`[Insight 💡] [${insight.priority}] ${insight.title}: ${insight.message}`);
  });

  // 4. Trigger Automation (Self-Awareness)
  console.log('\n[Action] 🟢 Manually triggering Awakening Scheduler...');

  // Force enable auto-awakening for test
  awakeningStateManager.setAutoEnabled(true);

  // Manually trigger the "manual" check which always passes
  await awakeningScheduler.triggerManually();

  // 5. Verification
  console.log('\n[Verification] Checking post-awakening state...');
  const history = awakeningStateManager.getHistory(1);
  if (history.length > 0) {
    const entry = history[0];
    // servicesAwakened should be at least 2 now (TruthEngine + OmniEsgManager)
    console.log(
      `[History] Latest Entry: Success=${entry.success}, Services=${entry.servicesAwakened}`
    );

    // start of automated truth scan verification
    const updatedClaim = truthEngine.getClaim('claim-1');
    console.log(`[Truth] Claim status after awakening: ${updatedClaim?.validationStatus}`);

    // The mock protocol might report services differently if we rely on IAwakening adapter counts
    // But since we registered them natively, the totalServices in the history entry should reflect that.

    if (
      entry.success &&
      updatedClaim?.validationStatus === 'verified' &&
      entry.servicesAwakened >= 3
    ) {
      console.log(
        '✅ VERIFICATION PASSED: Automation cycle completed successfully with Self-Reliance & Altruism.'
      );
    } else {
      // Fallback for partial success debugging
      if (entry.servicesAwakened < 3) {
        console.error(
          '❌ VERIFICATION FAILED: Not all services awakened (Expected >= 3, got ' +
            entry.servicesAwakened +
            ')'
        );
      } else {
        console.error('❌ VERIFICATION FAILED: Check logs.');
      }
    }
  } else {
    console.error('❌ VERIFICATION FAILED: No history recorded.');
  }
}

// Run
verifyAwakeningAutomation().catch(err => {
  console.error('Verification crashed:', err);
});
