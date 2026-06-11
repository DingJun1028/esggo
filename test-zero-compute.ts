import { sustainWriteZeroCompute } from './lib/agents/sustain-scribe-zero-compute';
import * as fs from 'fs';

async function runTest() {
  console.log('🚀 [Test] Starting Zero-Compute Engine Integration Test...');
  
  const task = {
    companyId: "TAIWAN-SEMI-TEST",
    reportYear: "2026",
    evidencePayload: {
      // 測試章節 1：齊全單據 + 隱私遮蔽 (測試 5T 全開、ZKP、FSC)
      "ch-environment": {
        "總用電量 (度)": 5000000,
        "範疇一排放量 (tCO2e)": 1200,
        "isConfidential": true
      },
      // 測試章節 2：缺漏單據 (測試 5T 等待中、待補件模組、PDPA)
      "ch-social": {
        "女性主管比例 (%)": 35
        // 刻意缺漏 "員工教育訓練平均時數 (小時)"
      }
    }
  };

  try {
    console.log('⚙️ [Test] Triggering Zero-Compute Scribe Execute...');
    const result = await sustainWriteZeroCompute.generateFullReport(task);
    
    console.log('✅ [Test] Engine execution completed successfully.');
    console.log(`📊 [Test] Generated Output Length: ${result.document.length} characters.`);
    
    const outputPath = './test-output.md';
    fs.writeFileSync(outputPath, result.document);
    console.log(`💾 [Test] Full report written to ${outputPath}. You can preview it.`);
    
  } catch (error) {
    console.error('❌ [Test] Engine execution failed:', error);
  }
}

runTest();
