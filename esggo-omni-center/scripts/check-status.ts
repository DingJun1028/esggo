// Check current system status using direct require
const { getOmniCore } = require('@core/omni-core');

async function checkStatus() {
  console.log('=== 檢查系統狀態 ===\n');
  
  try {
    // Get OmniCore instance
    const core = getOmniCore();
    
    // Check if initialized
    console.log(`✅ OmniCore 初始化狀態: ${core.initialized ? '已初始化' : '未初始化'}`);
    
    // Check soul status
    console.log(`\n🔮 靈魂狀態:`);
    console.log(`   名稱: ${core.soul.name}`);
    console.log(`   版本: ${core.soul.version}`);
    console.log(`   當前狀態: ${core.soul.state}`);
    
    // Check key status
    console.log(`\n🔑 元鑰狀態:`);
    console.log(`   名稱: ${core.key.name}`);
    console.log(`   等級: ${core.key.tier}`);
    
    // Check VPS agent
    console.log(`\n🛡️ VPS Agent 狀態:`);
    if (core.vpsAgent) {
      console.log(`   VPS ID: ${core.vpsAgent.signature.uuid}`);
      console.log(`   是否配置: ${core.vpsAgent ? '是' : '否'}`);
    } else {
      console.log(`   VPS Agent: 未配置`);
    }
    
    // Check singularity
    console.log(`\n🌌 萬能奇點狀態:`);
    const singularityObs = await core.singularity.observe();
    console.log(`   觀測結果:`, JSON.stringify(singularityObs, null, 2));
    
    // Summary
    console.log(`\n=== 系統狀態檢查完成 ===\n`);
    
  } catch (error) {
    console.error('❌ 系統狀態檢查失敗:', error);
  }
}

checkStatus();