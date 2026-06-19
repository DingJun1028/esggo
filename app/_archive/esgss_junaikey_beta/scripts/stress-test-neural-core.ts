/**
 * Omni-Neural Core - Stress Test Utility
 * 模擬高併發場景，驗證系統在高負載下的穩定性與資源回收效率
 */
import axios from 'axios';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

const BASE_URL = 'http://localhost:3001/api';
const CONCURRENT_USERS = 120;
const REQUESTS_PER_USER = 5;

async function runStressTest() {
  console.log(`\n🚀 [Stress Test] 開始高併發壓力測試...`);
  console.log(
    `🔥 模擬用戶: ${CONCURRENT_USERS} | 總請求數: ${CONCURRENT_USERS * REQUESTS_PER_USER}`
  );

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  const tasks = [];

  for (let i = 0; i < CONCURRENT_USERS; i++) {
    tasks.push(
      (async () => {
        const userId = `stress_user_${i}_${Date.now()}`;
        for (let j = 0; j < REQUESTS_PER_USER; j++) {
          try {
            // 模擬交互請求 (會創建 session)
            const response = await axios.post(`${BASE_URL}/interact`, {
              message: `Stress test message ${j} from ${userId}`,
              userId: userId,
            });
            if (response.status === 200) successCount++;
          } catch (error: any) {
            errorCount++;
            // console.error(`[Error] User ${i} Request ${j} failed`);
          }
        }
      })()
    );
  }

  await Promise.all(tasks);

  const duration = (Date.now() - startTime) / 1000;
  const rps = (successCount + errorCount) / duration;

  console.log(`\n✅ [Stress Test] 測試完成!`);
  console.log(`⏱️  總耗時: ${duration.toFixed(2)}s`);
  console.log(`📊 平均吞吐量 (RPS): ${rps.toFixed(2)}`);
  console.log(`🎊 成功數: ${successCount}`);
  console.log(`❌ 失敗數: ${errorCount}`);
  console.log(`🌡️  成功率: ${((successCount / (successCount + errorCount)) * 100).toFixed(2)}%`);

  if (errorCount === 0 && rps > 50) {
    console.log(`\n🌟 [Verdict] 系統穩定性極佳，通過高併發驗證！`);
  } else {
    console.log(`\n⚠️  [Verdict] 系統在高負載下出現波動，建議進一步優化。`);
  }
}

// 執行測試
runStressTest().catch(err => {
  console.error(`[Stress Test] 啟動失敗:`, err);
});
