import { enhancedOmniBus } from '../src/lib/omni-agent-bus';
import { sampleAgent } from '../src/lib/omni-agent/sample-agent';
import { IBusEvent } from '../src/lib/omni-core/contracts';

async function runTest() {
  console.log('🧪 開始 OmniAgent 事件流測試');

  const topic = 'test.flow';

  // 1. 訂閱 topic，當收到事件時交由 SampleAgent 處理
  const unsubscribe = enhancedOmniBus.subscribe(topic, async (event: IBusEvent) => {
    console.log(`\n📥 [Bus] 收到事件 on topic '${topic}':`, {
      uuid: event.uuid,
      payload: event.payload,
    });
    await sampleAgent.execute(event);
    console.log('✅ SampleAgent 已處理該事件\n');
  });

  // 2. 建立測試事件
  const testEvent: IBusEvent = {
    uuid: 'test-event-001',
    version: '1.0.0',
    timestamp: Date.now(),
    evidence: {},
    source_origin: 'TestHarness',
    topic,
    payload: { action: 'demo', value: 42 },
    lifecycle_path: [
      { stage: 'EMERGED', timestamp: Date.now(), node: 'TestHarness' },
    ],
  };

  // 3. 發布事件到 Bus
  console.log('\n🚀 發布測試事件到 Bus...');
  await enhancedOmniBus.publish(topic, testEvent);

  // 4. 給予處理時間，然後取消訂閱
  setTimeout(() => {
    unsubscribe();
    console.log('🧹 測試結束，訂閱已移除');
  }, 1000);
}

// 執行測試
runTest().catch(err => {
  console.error('❌ 測試失敗:', err);
  process.exit(1);
});