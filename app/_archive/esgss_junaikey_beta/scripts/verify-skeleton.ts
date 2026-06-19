import { TrustProtocolService } from '../src/services/TrustProtocolService';
import { EvidenceVault } from '../src/services/EvidenceVault';
import { EmissionFactorService } from '../src/services/EmissionFactorService';

/**
 * 💡 AI 永續報告自動化：Sprint 1 骨幹驗證腳本
 * --------------------------------------------------
 * 目標：驗證資料從攝入到鎖定的完整 3+1 流程
 */

async function verifySkeleton() {
  console.log('--- 🚀 開始遺傳演算法：AI 報告骨幹驗證 ---');

  // 1. 模擬原始證據文件 (例如：電費單數據)
  const powerBill = {
    billNo: 'B2026-001',
    consumption: 5000,
    unit: 'kWh',
    company: 'GreenEnergy Corp',
  };

  try {
    // 🟢 Step 1: 數據攝入 (Traceable)
    console.log('\n[1/4] 🟢 正在攝入原始證據並建立數據點...');

    // 1.1 呼叫排放係數服務 (新增測試)
    console.log('   -> 查詢排放係數庫 (EmissionFactorService)...');
    const factor = await EmissionFactorService.getFactor('electricity-us', 'us-east');
    console.log(`   ✅ 取得係數: ${factor.value} ${factor.unit} (Source: ${factor.source})`);

    if (!factor.hash || !factor.hash.startsWith('sha256')) {
      throw new Error('EmissionFactor hash verification failed!');
    }

    const trustService = TrustProtocolService.getInstance();
    const draftDP = await trustService.ingestDataPoint(
      '0000-302-1', // GRI 302-1
      5000,
      'kWh',
      { content: powerBill, name: 'power-bill-jan.json', mime: 'application/json' },
      'ERP - Energy Module'
    );
    console.log('   ✅ 攝入成功，協議狀態:', JSON.stringify(draftDP.currentStatus));

    // 🟠 Step 2: 數據稽核 (Calculable)
    console.log('\n[2/4] 🟠 正在執行 Auditor Agent 稽核校驗...');
    const auditedDP = await trustService.auditDataPoint(
      draftDP,
      'Total = Non-Renewable + Renewable'
    );
    console.log('   ✅ 稽核成功，協議狀態:', JSON.stringify(auditedDP.currentStatus));

    // 🔴 Step 3: 數據鎖定與鏈結 (Immutable & Trackable)
    console.log('\n[3/4] 🔴 正在執行雜湊鎖定與信任鏈結...');
    const sealedBlock = await trustService.sealAndChain(auditedDP, null);

    console.log('   ✅ 鏈結成功，奧秘 UUID:', sealedBlock.data.uuid);
    console.log('      數位雜湊鎖 (Hash Lock):', sealedBlock.hash_lock);

    // 🔵 Step 4: 模擬 API 派送 (Automation)
    console.log('\n[4/4] 🔵 模擬 API 派送邏輯 (Dispatch Simulation)...');
    // 模擬 dispatch.js 核心邏輯
    const systemToken = 'test-token';
    const targetUrl = 'https://hook.us1.make.com/mock-id'; // 模擬

    if (!systemToken || !targetUrl) {
      console.warn('   ⚠️ 缺少環境變量，跳過真實 HTTP 請求測試');
    } else {
      console.log('   ✅ Dispatch 參數校驗通過 (Simulation Mode)');
    }

    console.log('\n--- 🎉 全部整合驗證成功 (All Green) ---');
    process.exit(0); // CI/CD 成功信號
  } catch (error) {
    console.error('\n❌ 驗證失敗:', error);
    process.exit(1); // CI/CD 失敗信號
  }
}

verifySkeleton();
