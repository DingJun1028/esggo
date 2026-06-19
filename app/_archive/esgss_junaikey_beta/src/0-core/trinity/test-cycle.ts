import { omni } from './OmniElement';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { OmniCrystal } from './OmniCrystal';
import { InfoNodeAttrs } from './types';

async function runTrinityCycle() {
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] 🔮 Starting Omni Trinity Cycle Verification...');

  // 1. Tagging & Creation (InfoOne)
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] \n--- Step 1: Perception & Tagging (InfoOne) ---');
  const initialAttrs: InfoNodeAttrs = {
    source: 'Sensors-Array-01',
    data: 'Raw Carbon Emission Data: 1200kg',
    confidence: 0.98,
  };

  const infoOne = await omni.createInfoOne('OmniOne', initialAttrs);
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `✅ Created InfoOne: ${infoOne.uid}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   Label: ${infoOne.label}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   TraceID: ${infoOne.traceId}` });

  // 2. Storage Check (OmniCrystal)
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] \n--- Step 2: Storage Verification (OmniCrystal) ---');
  const crystal = OmniCrystal.getInstance();
  const storedNode = await crystal.recall(infoOne.uid);

  if (storedNode) {
    omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `✅ Verified: Node ${storedNode.uid} is crystallized in Eternal Memory.` });
  } else {
    omniLogger.error(LogCategory.SYSTEM, '[test-cycle] Error', { error: `❌ Error: Node ${infoOne.uid} failed to crystallize!` });
    return;
  }

  // 3. Reasoning & Evolution (Three-In-One)
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] \n--- Step 3: Reasoning & Evolution (Evolve) ---');
  // Simulate a reasoning logic: Normalize the data
  const reasoningLogic = async (attrs: InfoNodeAttrs): Promise<InfoNodeAttrs> => {
    omniLogger.info(LogCategory.SYSTEM, '[test-cycle]    🧠 Omni Brain is processing...');
    return {
      processedData: 'Normalized Emission: 1.2 Metric Tons',
      riskScore: 0.45, // Adding a new attribute
      processor: 'OmniReasoningEngine-v1',
    };
  };

  const evolvedNode = await omni.evolve(infoOne, 'OmniOne-Processed', reasoningLogic);

  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `✅ Evolved into New Node: ${evolvedNode.uid}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   New Label: ${evolvedNode.label}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   Derived From: ${evolvedNode.attrs.derivedFrom}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   TraceID Preserved: ${evolvedNode.traceId === infoOne.traceId}` });

  // 4. Lineage Trace
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] \n--- Step 4: Lineage Trace ---');
  const lineage = await crystal.traceLineage(evolvedNode.uid);
  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `✅ Lineage Chain Length: ${lineage.length}` });
  lineage.forEach((node, index) => {
    omniLogger.info(LogCategory.SYSTEM, '[test-cycle] Info', { data: `   [${index}] ${node.label} (${node.uid})` });
  });

  omniLogger.info(LogCategory.SYSTEM, '[test-cycle] \n🔮 Omni Trinity Cycle Verification Complete.');
}

// Check if running directly via ts-node
if (require.main === module) {
  runTrinityCycle().catch(err => omniLogger.error(LogCategory.SYSTEM, '[test-cycle] Error', { error: err }));
}

export { runTrinityCycle };
