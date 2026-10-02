import { omniOrchestrator } from '../src/core/services/omni-orchestrator';

async function runTest() {
  console.log("=== 啟動 OmniCore 自癒驗證 (Self-Healing Verification) ===");
  
  // Test 1: Normal Execution
  const normalResult = await omniOrchestrator.executeWithSelfHealing(
    'Normal Operation',
    async () => {
      console.log('執行正常邏輯...');
      return 'SUCCESS';
    },
    'FALLBACK'
  );
  console.log(`Test 1 Result: ${normalResult} (Expected: SUCCESS)`);

  console.log('\n----------------------------------------\n');

  // Test 2: Anomaly Execution
  const errorResult = await omniOrchestrator.executeWithSelfHealing(
    'Anomaly Operation',
    async () => {
      console.log('執行模擬錯誤邏輯...');
      throw new Error('模擬的網路超時或幻覺錯誤 (Simulated Network Timeout / Hallucination)');
    },
    'AUTO_HEALED_FALLBACK'
  );
  console.log(`Test 2 Result: ${errorResult} (Expected: AUTO_HEALED_FALLBACK)`);
}

runTest();
