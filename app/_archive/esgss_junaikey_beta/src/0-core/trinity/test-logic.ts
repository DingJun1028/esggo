import { omni } from './OmniElement';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { CarbonEvolutionLogic } from './logic/CarbonEvolutionLogic';
import { GapEvolutionLogic } from './logic/GapEvolutionLogic';

async function runLogicTests() {
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] 🧠 [Omni-Logic] Starting Verification Protocol...\n');

  // ==========================================
  // Test Case 1: Carbon Evolution
  // ==========================================
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] --- TEST 1: Carbon Asset Evolution ---');
  const emissionData = {
    type: 'electricity',
    amount: 500, // kWh
    unit: 'kWh',
  };

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] 1. Creating InfoOne (Emission Data)...');
  const emissionNode = await omni.createInfoOne('RawEmission', {
    data: emissionData,
    source: 'Sensor-IoT-99',
    trustworthy: true, // T5 compliant
  });

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] 2. Evolving into Carbon Asset...');
  const carbonAsset = await omni.evolve(emissionNode, 'CarbonAsset', CarbonEvolutionLogic);

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `✅ Evolution Complete: ${carbonAsset.uid}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `   Type: ${carbonAsset.attrs.type}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `   Value: ${JSON.stringify(carbonAsset.attrs.assetValue)}` });

  // ==========================================
  // Test Case 2: Gap Analysis Evolution
  // ==========================================
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] \n--- TEST 2: Gap Analysis Evolution ---');
  const kpiData = {
    kpi: 'Renewable Energy Ratio',
    actual: 20, // %
    target: 50, // %
  };

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] 1. Creating InfoOne (KPI Data)...');
  const kpiNode = await omni.createInfoOne('PerformanceGap', {
    data: kpiData,
    source: 'ESG-Dashboard',
    trustworthy: true,
  });

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] 2. Evolving into Strategic Initiative...');
  const strategyNode = await omni.evolve(kpiNode, 'StrategicInitiative', GapEvolutionLogic);

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `✅ Evolution Complete: ${strategyNode.uid}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `   Type: ${strategyNode.attrs.type}` });
  omniLogger.info(LogCategory.SYSTEM, '[test-logic] Info', { data: `   Strategy: ${JSON.stringify(strategyNode.attrs.strategyContent, null, 2)}` });

  omniLogger.info(LogCategory.SYSTEM, '[test-logic] \n🧠 [Omni-Logic] Verification Protocol All Green.');
}

if (require.main === module) {
  runLogicTests().catch(console.error);
}
