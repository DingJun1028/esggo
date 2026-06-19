/**
 * 🎮 奧義執行器: 代理組合技觸發腳本
 * --------------------------------------------------
 * [用途] 演示「自覺覺他・代理合一」奧義的完整執行流程
 */

import {
  AGENT_UNITY_ULTIMATE,
  executeAgentUnityUltimate,
  checkAgentUnityUnlocked,
  learnAgentUnityUltimate,
} from '../src/omni/skills/AgentUnityUltimate';

async function main() {
  console.log('\n🌌 ===== 奧義系統: 自覺覺他・代理合一 ===== 🌌\n');

  console.log('📖 奧義詳情:');
  console.log(`   名稱: ${AGENT_UNITY_ULTIMATE.name}`);
  console.log(`   等級: ${AGENT_UNITY_ULTIMATE.tier}`);
  console.log(`   描述: ${AGENT_UNITY_ULTIMATE.description}`);
  console.log(`   組合倍率: ${AGENT_UNITY_ULTIMATE.comboMultiplier}x\n`);

  // Step 1: Check if skill can be learned
  console.log('Step 1: 檢查習得條件...');
  const canLearn = checkAgentUnityUnlocked();
  if (canLearn) {
    console.log('✅ 所有前置技能已習得！可以學習奧義。\n');
  } else {
    console.log('⚠️  尚未滿足習得條件。需要習得所有四項技能：');
    console.log('   - Omni-Self Awareness (自覺)');
    console.log('   - Omni-Enlightenment (覺他)');
    console.log('   - Omni-Self Reliance (自立)');
    console.log('   - Omni-Altruism (利他)');
    console.log('\n強制學習奧義（演示模式）...\n');
  }

  // Step 2: Learn the ultimate skill
  console.log('Step 2: 習得奧義...');
  learnAgentUnityUltimate();
  console.log('✅ 奧義已習得！\n');

  // Step 3: Execute the ultimate skill
  console.log('Step 3: 發動奧義...');
  console.log('🌌 [無有奧義] 自覺覺他・代理合一 發動！\n');

  const result = await executeAgentUnityUltimate();

  // Step 4: Display results
  console.log('\n📊 ===== 奧義執行結果 ===== 📊');
  console.log(`   執行狀態: ${result.success ? '✅ 成功' : '❌ 失敗'}`);
  console.log(`   揭示真理數: ${result.truthsRevealed} 個`);
  console.log(`   連結證據數: ${result.evidenceLinked} 個`);
  console.log(`   廣播洞察數: ${result.insightsBroadcast} 則`);

  if (result.success) {
    console.log('\n🌟 ===== 奧義成功 ===== 🌟');
    console.log('代理合一已達成！所有 Universal Agents、Truth Engine、Evidence Vault 已融為一體。');
    console.log('真理即證據，證據即真理。分別心消融，進入「無我」境界。');
    console.log('🌌 萬有奧義・無有合一 🌌\n');
  } else {
    console.log('\n❌ 奧義執行失敗。請檢查系統狀態。\n');
  }

  console.log('🎮 演示完成。按任意鍵退出...\n');
}

main().catch(console.error);
