// Test Fruit-Cause Healing (果因修復)
import { getOmniCore } from '@core/omni-core';

async function testEffectCauseHeal() {
  console.log('=== 測試 果因修復 (Effect-Cause Healing) ===\n');
  
  const core = getOmniCore();
  
  // 測試不同症狀
  const symptoms = [
    'CPU 過高',
    '記憶體不足',
    '磁盤空間不足',
    '服務超時無回應',
    '系統錯誤 500',
    '回應速度極慢'
  ];
  
  for (const symptom of symptoms) {
    console.log('\n--- 測試症狀: ' + symptom + ' ---');
    const result = await core.effectCauseHeal(symptom);
    
    console.log('  追溯 ID: ' + result.traceId);
    console.log('  原始症狀: ' + result.effect);
    console.log('  追溯根源: ' + result.rootCause);
    console.log('  修復策略: ' + result.strategy);
    console.log('  修復結果: ' + (result.healed ? '✅ 成功' : '❌ 失敗'));
    console.log('  總耗時: ' + result.totalMs + 'ms');
    
    console.log('  追溯鏈:');
    for (const node of result.chain) {
      console.log('    ' + node.type + ' -> ' + node.description + ' (信心: ' + (node.confidence * 100).toFixed(0) + '%)');
    }
  }
  
  console.log('\n=== 所有果因修復測試完成 ===\n');
}

testEffectCauseHeal();