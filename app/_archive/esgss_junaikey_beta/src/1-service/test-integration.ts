import { sovereignLedger } from './SovereignLedger';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { IComponentCore } from '@/types/core';
import { OmniCrystal } from '../0-core/trinity/OmniCrystal';

async function verifyIntegration() {
  omniLogger.info(LogCategory.SYSTEM, '[test-integration] 🔗 Starting Omni-Sovereign Integration Verification...');

  // 1. Construct a Valid 5T Object
  const mockEntry: IComponentCore = {
    uuid: 'sovereign-test-uuid-001',
    version: '1.0.1',
    timestamp: Date.now(),
    formula: 'ISO-14001',
    impactMetric: '100',
    label: 'Operation Green Shield',
    status: 'Trustworthy', // T5: Status Alignment
    lock: () => {
      /* Lock implemented via Object.freeze */
    },
    evidence: {
      tangible: {
        metric: '100',
        visual_grade: 'SOVEREIGN',
        glow_intensity: 100,
      },
      traceable: {
        source_origin: 'Legion-Unit-Alpha',
        verification_links: [],
      },
      trackable: {
        lifecycle_hooks: [
          { event: 'created', timestamp: Date.now(), actor: 'System' },
          { event: 'validated', timestamp: Date.now(), actor: 'Validator' },
        ],
        pathway: ['Test', 'Sovereign'],
      },
      transparent: {
        formula: 'ISO-14001',
        validation_standard: 'Standard',
      },
      trustworthy: {
        hash_lock: 'sha256:e3b0c442...',
        is_frozen: true,
      },
    },
    virtues: {
      intelligence: 10,
      benevolence: 10,
      integrity: 10,
      courage: 10,
      temperance: 10,
      harmony: 10,
    },
  };

  // T5: Must be frozen
  Object.freeze(mockEntry);

  try {
    // 2. Record to Ledger (Triggers 5T -> Omni Crystallization)
    omniLogger.info(LogCategory.SYSTEM, '[test-integration]    📤 Submitting to Sovereign Validator...');
    await sovereignLedger.recordImpact(mockEntry);
    omniLogger.info(LogCategory.SYSTEM, '[test-integration]    ✅ Submission accepted by Sovereign Ledger.');

    // 3. Verify Omni Crystal Storage
    omniLogger.info(LogCategory.SYSTEM, '[test-integration]    🔮 Querying Omni Eternal Memory...');
    const crystal = OmniCrystal.getInstance();

    // Wait a tick for async processing if any (though await should handle it)
    const results = await crystal.recallByLabel('SovereignImpact');

    const found = results.find(n => n.attrs.uuid === mockEntry.uuid);

    if (found) {
      omniLogger.info(LogCategory.SYSTEM, '[test-integration] Info', { data: `   ✅ Integration SUCCESS!` });
      omniLogger.info(LogCategory.SYSTEM, '[test-integration] Info', { data: `      Found Crystallized Element: ${found.uid}` });
      omniLogger.info(LogCategory.SYSTEM, '[test-integration] Info', { data: `      Omni Label: ${found.label}` });
      omniLogger.info(LogCategory.SYSTEM, '[test-integration] Info', { data: `      Trustworthy: ${found.attrs.trustworthy}` });
    } else {
      omniLogger.error(LogCategory.SYSTEM, '[test-integration]    ❌ Integration FAILED: Entry not found in Omni Crystal.');
      console.log(
        '      Current Crystal Contents:',
        results.map(r => r.uid)
      );
    }
  } catch (error) {
    omniLogger.error(LogCategory.SYSTEM, '[test-integration]    ❌ Verification Error:', { error })
  }
}

// Run if main
if (require.main === module) {
  verifyIntegration().catch(e => omniLogger.error(LogCategory.SYSTEM, '[test-integration] Error', { error: e }));
}
