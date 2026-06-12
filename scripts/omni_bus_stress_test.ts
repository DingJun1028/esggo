import axios from 'axios';
import { performance } from 'perf_hooks';

const LOCAL_URL = 'http://localhost:3001/api/vault/indicators';
// 模擬的併發請求數
const CONCURRENCY_LEVEL = 50; 
const REQUESTS_PER_CLIENT = 10;

async function runClient(clientId: number) {
  let successCount = 0;
  let failCount = 0;
  const start = performance.now();

  for (let i = 0; i < REQUESTS_PER_CLIENT; i++) {
    try {
      // 測試 Vault Indicators API 的抗壓能力 (RAG 的基石)
      const res = await axios.post(LOCAL_URL, {
        indicatorIds: ['GRI-305-1', 'GRI-305-2', 'ENV-003', 'SOC-015']
      }, { timeout: 5000 });
      
      if (res.data && res.data.success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (e) {
      failCount++;
    }
  }

  const end = performance.now();
  return { clientId, successCount, failCount, timeMs: end - start };
}

async function runStressTest() {
  console.log(`🚀 [OmniAgentBus Stress Test] 初始化中... 併發數: ${CONCURRENCY_LEVEL}, 總請求: ${CONCURRENCY_LEVEL * REQUESTS_PER_CLIENT}`);
  const start = performance.now();
  
  const promises = [];
  for (let i = 0; i < CONCURRENCY_LEVEL; i++) {
    promises.push(runClient(i));
  }

  const results = await Promise.all(promises);
  const end = performance.now();

  let totalSuccess = 0;
  let totalFail = 0;
  
  results.forEach(r => {
    totalSuccess += r.successCount;
    totalFail += r.failCount;
  });

  console.log('==============================================');
  console.log('📊 [測試結果] OmniAgentBus Matrix 壓力測試');
  console.log('==============================================');
  console.log(`總耗時: ${((end - start) / 1000).toFixed(2)} 秒`);
  console.log(`總成功: ${totalSuccess}`);
  console.log(`總失敗: ${totalFail}`);
  console.log(`吞吐量 (RPS): ${(totalSuccess / ((end - start) / 1000)).toFixed(2)} req/sec`);
  
  if (totalFail > 0) {
    console.error('⚠️ 警告：偵測到失敗請求，需檢查連線池 (Connection Pool) 或 Rate Limit 設定！');
  } else {
    console.log('✅ 完美通關：系統在極端流量下，雙向綁定與 5T 提取依舊保持穩定 (Zero-Friction)。');
  }
}

runStressTest().catch(console.error);
