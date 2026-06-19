// Mock localStorage for Node.js environment
if (typeof global.localStorage === 'undefined') {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

import { OmniCoreEngine } from '../src/omni/infrastructure/core/OmniCoreEngine';
import { esgCardService } from '../src/services/esgCardService';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

async function runVerification() {
  omniLogger.info(LogCategory.SYSTEM, '🚀 Starting OmniCoreEngine Verification');

  const engine = OmniCoreEngine.getInstance();

  // 1. Setup Mock Metadata/Metrics
  const mockContext = {
    input: 'Analyze energy efficiency trends',
    metadata: {
      metrics: [
        {
          id: 'm1',
          category: 'environmental',
          label: 'Electricity Usage',
          value: 450,
          unit: 'kWh',
          risk_threshold: 400,
          confidence: 0.7,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'm2',
          category: 'social',
          label: 'Employee Happiness',
          value: 85,
          unit: '%',
          risk_threshold: 80,
          confidence: 0.95,
          timestamp: new Date().toISOString(),
        },
      ],
    },
  };

  try {
    // 2. Start Engine
    await engine.start();

    // 3. Execute Turn
    omniLogger.info(LogCategory.SYSTEM, '--- Starting SDAL Turn ---');
    const result = await engine.executeTurn(mockContext as any);

    omniLogger.info(LogCategory.SYSTEM, '--- Turn Result Analysis ---');
    console.log('Turn Number:', result.turnNumber);
    console.log('Events Processed:', result.eventsProcessed);
    console.log('Problems Identified:', result.problemsIdentified);
    console.log('Solutions Executed:', result.solutionsExecuted);
    console.log('XP Gained:', result.xpGained);
    console.log('Learnings:', result.learningExtracted);

    // 4. Validate Results
    if (result.problemsIdentified > 0 && result.solutionsExecuted > 0) {
      omniLogger.info(LogCategory.SYSTEM, '✅ SUCCESS: Problems detected and solutions executed.');
    } else {
      omniLogger.warn(LogCategory.SYSTEM, '⚠️ WARNING: No problems or solutions in this turn.');
    }

    if (result.xpGained > 0) {
      omniLogger.info(LogCategory.SYSTEM, '✅ SUCCESS: XP was awarded and memory reinforced.');
    }
  } catch (error) {
    omniLogger.critical(LogCategory.SYSTEM, '❌ Verification FAILED', { error });
    process.exit(1);
  }

  omniLogger.info(LogCategory.SYSTEM, '🏁 Verification Complete');
}

runVerification();
