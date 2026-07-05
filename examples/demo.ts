#!/usr/bin/env npx tsx
/**
 * Smart AI Router - 完整整合示範
 * 執行方式: npx tsx examples/demo.ts
 */

// 簡化版示範（無外部依賴）
async function runDemo() {
  console.log('🚀 Smart AI Router 示範執行中...\n');

  // 1. 模擬模型發現
  console.log('1️⃣ 動態發現免費模型:');
  const mockModels = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'groq', tags: ['chat', 'reasoning'] },
    { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 80B', provider: 'openrouter', tags: ['chat'] },
    { id: 'meta-llama/llama-3.2-90b-vision:free', name: 'Llama Vision 90B', provider: 'openrouter', tags: ['vision'] }
  ];
  console.log(`   找到 ${mockModels.length} 個模型：`);
  mockModels.forEach(m => console.log(`     • ${m.name} (${m.provider})`));
  console.log('');

  // 2. 模擬請求追蹤
  console.log('2️⃣ 執行 AI 請求:');
  const traceId = `trace_${Date.now()}`;
  console.log(`   追蹤 ID: ${traceId}`);
  console.log(`   任務: carbon_calculation`);
  console.log(`   狀態: ✅ 成功（模擬）\n`);

  // 3. 模擬影子測試
  console.log('3️⃣ 影子測試狀態:');
  console.log(`   通道: shadow_test_15percent`);
  console.log(`   流量: 15%`);
  console.log(`   狀態: 📊 資料收集中...\n`);

  // 4. 模擬時間旅行
  console.log('4️⃣ 時間旅行除錯:');
  console.log(`   會話: replay_${traceId}`);
  console.log(`   事件數: 5 筆`);
  console.log(`   狀態: ✅ 完成\n`);

  console.log('🎉 示範完成！');
  console.log('\n💡 提示: 設定 API 金鑰後可執行完整功能');
  console.log('   編輯 .env 檔案，加入 OPENROUTER_API_KEY 或 GROQ_API_KEY');
}

runDemo().catch(console.error);