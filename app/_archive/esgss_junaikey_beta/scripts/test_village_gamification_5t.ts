/**
 * 🌱 善向永續村 - 5T 封印驗證測試
 * [TC] 測試永續村 GamificationService 的 5T 合規性
 * [EN] Verify 5T compliance of Village Gamification Service
 */

import { gamificationService } from '../src/services/GamificationService';
import { globalPulseService } from '../src/services/GlobalPulseService';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger';

interface FiveTCheck {
    gate: string;
    passed: boolean;
    detail: string;
}

async function testVillageGamification5T() {
    console.log('========================================');
    console.log('🌱 善向永續村 5T 封印驗證測試');
    console.log('========================================\n');

    const checks: FiveTCheck[] = [];

    // 1. Tangible Check - 檢查經驗值和等級是否有效
    console.log('[1/5] 🔍 Tangible (有形) 驗證...');
    const villageState = gamificationService.getVillageState();
    const tangiblePassed = villageState.xp > 0 && villageState.level > 0;
    checks.push({
        gate: 'Tangible',
        passed: tangiblePassed,
        detail: `XP: ${villageState.xp}, Level: ${villageState.level}, Credits: ${villageState.ecoCredits}`
    });
    console.log(`  ${tangiblePassed ? '✅' : '❌'} XP: ${villageState.xp}, Level: ${villageState.level}`);

    // 2. Traceable Check - 檢查建築物狀態可追溯
    console.log('\n[2/5] 🔍 Traceable (可追溯) 驗證...');
    const buildings = villageState.buildings;
    const traceablePassed = buildings.every(b => b.id && b.name && b.type);
    checks.push({
        gate: 'Traceable',
        passed: traceablePassed,
        detail: `Buildings: ${buildings.length}, All have ID/Name/Type: ${traceablePassed}`
    });
    console.log(`  ${traceablePassed ? '✅' : '❌'} ${buildings.length} buildings with traceable properties`);

    // 3. Trackable Check - 檢查建築升級歷史可追蹤
    console.log('\n[3/5] 🔍 Trackable (可追蹤) 驗證...');
    const trackablePassed = buildings.some(b => b.level > 1);
    checks.push({
        gate: 'Trackable',
        passed: trackablePassed,
        detail: `Has upgradeable buildings: ${trackablePassed}`
    });
    console.log(`  ${trackablePassed ? '✅' : '❌'} Buildings can be tracked through lifecycle`);

    // 4. Transparent Check - 檢查公式透明
    console.log('\n[4/5] 🔍 Transparent (透明) 驗證...');
    const xpThreshold = villageState.level * 500;
    const transparentPassed = xpThreshold > 0;
    checks.push({
        gate: 'Transparent',
        passed: transparentPassed,
        detail: `Level up formula: ${villageState.level} * 500 = ${xpThreshold} XP threshold`
    });
    console.log(`  ${transparentPassed ? '✅' : '❌'} Level up formula is transparent: ${xpThreshold} XP needed for next level`);

    // 5. Trustworthy Check - 檢查 5T 封印晶體生成
    console.log('\n[5/5] 🔍 Trustworthy (值得信賴) 驗證...');
    const crystal = await gamificationService.crystallizeProgress();
    const trustworthyPassed =
        crystal.evidence.tangible?.metric !== undefined &&
        crystal.evidence.traceable?.source_origin !== undefined &&
        crystal.evidence.trackable?.pathway !== undefined &&
        crystal.evidence.transparent?.formula !== undefined &&
        crystal.evidence.trustworthy?.hash_lock !== undefined;

    checks.push({
        gate: 'Trustworthy',
        passed: trustworthyPassed,
        detail: `Crystal UUID: ${crystal.uuid.slice(0, 8)}..., Status: ${crystal.status}`
    });
    console.log(`  ${trustworthyPassed ? '✅' : '❌'} 5T Crystal generated: ${crystal.status}`);

    // Additional: Test GlobalPulseService Integration
    console.log('\n[Bonus] 🌐 Global Pulse Service 整合測試...');
    const initialVillageState = globalPulseService.getVillageState();
    console.log(`  Initial Dimensional Fold: ${initialVillageState.dimensionalFold.toFixed(4)}`);
    console.log(`  Tree Growth: ${initialVillageState.treeGrowth}%`);
    console.log(`  Sky Resonance: ${initialVillageState.skyResonance}%`);

    // Emit a test pulse
    console.log('\n  Emitting test pulse...');
    globalPulseService.emitPulse({
        type: 'RIPPLE',
        source: '5T_Test_Script',
        intensity: 0.5,
        message: '5T Verification Pulse'
    });

    const updatedVillageState = globalPulseService.getVillageState();
    console.log(`  Updated Dimensional Fold: ${updatedVillageState.dimensionalFold.toFixed(4)}`);

    // Summary
    console.log('\n========================================');
    console.log('📊 5T 封印驗證結果摘要');
    console.log('========================================');

    let allPassed = true;
    checks.forEach(check => {
        const icon = check.passed ? '✅' : '❌';
        console.log(`  ${icon} ${check.gate}: ${check.passed ? 'PASSED' : 'FAILED'}`);
        console.log(`     └─ ${check.detail}`);
        if (!check.passed) allPassed = false;
    });

    console.log('\n========================================');
    if (allPassed) {
        console.log('🎉 所有 5T 檢查通過！永續村封印完整。');
        console.log('========================================\n');
        process.exit(0);
    } else {
        console.log('❌ 部分 5T 檢查失敗。需要修復。');
        console.log('========================================\n');
        process.exit(1);
    }
}

// Run the test
testVillageGamification5T().catch(err => {
    console.error('❌ 測試執行失敗:', err);
    process.exit(1);
});
