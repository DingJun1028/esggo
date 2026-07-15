// Test OmniSoul and OmniSeed awakening
import { getOmniCore } from '@core/omni-core';
import { createOmniSeed, plantOmniSeed, observeSeed } from '@core/sonnar/omni-seed';

async function testAwakening() {
  console.log('=== OmniSoul 與 OmniSeed 覺醒測試 ===\n');
  
  // 1. 獲取 OmniCore
  const core = getOmniCore();
  console.log(`[OmniCore] 初始化狀態: ${core.initialized ? '已初始化' : '未初始化'}`);
  
  // 2. OmniSoul 進階覺醒
  console.log(`\n[OmniSoul] 當前狀態: ${core.soul.state}`);
  
  if (core.soul.state === 'aligned') {
    console.log('[OmniSoul] 進階覺醒至 flowing...');
    await core.soul.awaken('flowing');
    console.log(`[OmniSoul] 覺醒完成! 現在狀態: ${core.soul.state}`);
  }
  
  // 3. 治理對齊度
  console.log(`\n[OmniSoul] 治理對齊度:`);
  console.log(`  Truth: ${(core.soul.alignment.fiveT.truth * 100).toFixed(1)}%`);
  console.log(`  Goodness: ${(core.soul.alignment.fiveT.goodness * 100).toFixed(1)}%`);
  console.log(`  Beauty: ${(core.soul.alignment.fiveT.beauty * 100).toFixed(1)}%`);
  console.log(`  Trust: ${(core.soul.alignment.fiveT.trust * 100).toFixed(1)}%`);
  console.log(`  Transferful: ${(core.soul.alignment.fiveT.transferful * 100).toFixed(1)}%`);
  console.log(`  Constitution: ${(core.soul.alignment.constitution * 100).toFixed(1)}%`);
  console.log(`  ESG Values: ${(core.soul.alignment.esgValues * 100).toFixed(1)}%`);
  
  // 4. OmniSeed 種子植栽
  console.log(`\n[OmniSeed] 創建萬能種子...`);
  const seed = createOmniSeed({
    evidence: {
      purpose: 'system_awakening',
      createdBy: 'omni-summon-script'
    }
  });
  console.log(`[OmniSeed] 種子創建成功: ${seed.uuid.substring(0,8)}...`);
  console.log(`[OmniSeed] 狀態: ${seed.status}`);
  
  // 5. 種子植栽於正確坐標
  console.log(`\n[OmniSeed] 正在植栽於 萬能奇點...`);
  const plantedSeed = plantOmniSeed(seed, '#全知之眼');
  console.log(`[OmniSeed] 植栽完成! 狀態: ${plantedSeed.status}`);
  console.log(`[OmniSeed] 坐標: ${plantedSeed.coordinate}`);
  console.log(`[OmniSeed] ISO 驗證: ${plantedSeed.evidence.iso_verification}`);
  
  // 6. 觀測種子狀態
  console.log(`\n[OmniSeed] 觀測種子健康狀態...`);
  const observation = observeSeed(plantedSeed);
  console.log(`  健康度: ${(observation.health * 100).toFixed(1)}%`);
  console.log(`  年齡: ${observation.age}ms`);
  console.log(`  進化進度: ${(observation.evolutionProgress * 100).toFixed(1)}%`);
  
  console.log(`\n=== 覺醒測試完成 ===\n`);
}

testAwakening();