import { OmniEsgManager } from '../src/services/OmniEsgManager';
import { omniLogger } from '../src/services/omniLogger';

// Mock logger
omniLogger.info = (cat, msg, meta) => console.log(`[INFO] [${cat}] ${msg}`, meta || '');
omniLogger.error = (cat, msg, meta) => console.error(`[ERROR] [${cat}] ${msg}`, meta || '');

async function verifyFinalSweep() {
  console.log('--- Verifying Final Service Sweep ---');

  // OmniEsgManager
  console.log('\n--- Verifying OmniEsgManager ---');

  // Initialize (mocking dependencies implicitly by not calling full init or handling try-catch if it fails due to missing mocks but checking destroy logic)
  // We'll manually register a dummy component to verify basic state
  OmniEsgManager.registerComponent({
    id: 'test-comp',
    type: 'soul',
    mode: 'card',
    label: 'Test Component',
    value: '100',
    confidence: 'high',
    traits: [],
    dataLink: 'ai',
    color: 'purple',
    metadata: {},
    component: null as any,
  });

  if (OmniEsgManager.getAllComponents().length > 0) {
    console.log('State populated: Component registered.');
  }

  // Allow heartbeat to "start" (simulated check)
  // Accessing private method via any if needed, or relying on auto-init if environment simulated.
  // Since we modified startHeartbeat to check `_heartbeatStarted`, we can potentially manually trigger it if we could access it,
  // but `initializeOmniComponents` calls it.

  // Call destroy
  OmniEsgManager.destroy();

  if (OmniEsgManager.getAllComponents().length === 0) {
    console.log('SUCCESS: OmniEsgManager destroyed (components cleared).');
  } else {
    console.error('FAILURE: OmniEsgManager components not cleared.');
  }

  console.log('\n--- Verification Complete ---');
}

verifyFinalSweep().catch(console.error);
