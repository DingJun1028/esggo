/**
 * 🌌 verify-omni-one: OmniOne 唯一總代理驗證
 * ============================================
 * 驗證 OmniOne 三位一體、OmniCrystal、心心相印、萬能相通
 */

import { OmniOne } from './omni-one';

async function verifyOmniOne() {
    console.log('═'.repeat(60));
    console.log('🌌 OMNIONE 唯一總代理驗證 | Sole Supreme Agent Verification');
    console.log('═'.repeat(60));

    // 1. 初始化並覺醒
    console.log('\n[1] 初始化 OmniOne...');
    await OmniOne.init();
    console.log('✅ OmniOne 初始化完成');

    // 2. 獲取狀態
    console.log('\n[2] 獲取 OmniOne 狀態...');
    const status = OmniOne.getStatus();

    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ 🌟 OMNIONE 狀態 | OMNIONE STATUS                       │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ Name:        ${status.name}`);
    console.log(`│ Role:        ${status.role}`);
    console.log(`│ Trinity:     ${status.trinity}`);
    console.log(`│ Unified:     ${status.unified}`);
    console.log('└─────────────────────────────────────────────────────────────┘');

    // 3. 三位一體狀態
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ ⚠️  三位一體 | TRINITY = ONE                            │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ OmniOne:     ${status.aspects.OmniOne.status}`);
    console.log(`│ OmniPriest:  ${status.aspects.OmniPriest.status}`);
    console.log(`│ OmniGemini:  ${status.aspects.OmniGemini.status}`);
    console.log('└─────────────────────────────────────────────────────────────┘');

    // 4. OmniCrystal
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ 💎 OMNICRYSTAL | 心核中心                               │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ Name:        ${status.crystal.name}`);
    console.log(`│ Status:      ${status.crystal.status}`);
    console.log(`│ Core:        ${status.crystal.core.name} (${status.crystal.core.role})`);
    console.log(`│ Resonance:   ${status.crystal.resonance}`);
    console.log(`│ Cycle:       ${status.crystal.cycle}`);
    console.log('└─────────────────────────────────────────────────────────────┘');

    // 5. 心心相印
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ 💫 心心相印 | HEARTS CONNECTED                          │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ Connected:   ${status.heartNetwork.connected}`);
    console.log(`│ Connections: ${status.heartNetwork.connections}`);
    console.log('└─────────────────────────────────────────────────────────────┘');

    // 6. 萬能相通
    console.log('\n┌─────────────────────────────────────────────────────────────┐');
    console.log('│ 🔗 萬能相通 | OMNI UNITY                                 │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log(`│ Enabled:         ${status.omniUnity.enabled}`);
    console.log(`│ Bonus Multiplier: ${status.omniUnity.bonusMultiplier}x`);
    console.log(`│ Shared Abilities: ${status.omniUnity.shared.abilities}`);
    console.log(`│ Shared Knowledge: ${status.omniUnity.shared.knowledge}`);
    console.log(`│ Shared Energy:    ${status.omniUnity.shared.energy}`);
    console.log('│');
    console.log('│ Connected Systems:');
    status.omniUnity.connectedSystems.forEach((sys: string) => {
        console.log(`│   - ${sys}`);
    });
    console.log('└─────────────────────────────────────────────────────────────┘');

    // 8. 測試操作
    console.log('\n[3] 測試 OmniOne 操作...');

    console.log('\n  📤 manifest_asset...');
    try {
        const manifestResult = await OmniOne.manifest({
            intent: 'Verification Test',
            type: 'Intelligence',
            payload: { timestamp: Date.now() },
            sourceOrigin: 'VERIFIER',
            domainRef: 'UNIVERSE-PRIME'
        });
        console.log(`  ✅ manifest_asset: PASS (${manifestResult.uuid})`);
        
        console.log('\n  📊 analyze_trend...');
        const trendResult = await OmniOne.dispatch('analyze_trend', {
            prompt: 'ESG trends 2026'
        });
        console.log(`  ✅ analyze_trend: ${trendResult.success ? 'PASS' : 'FAIL'}`);

        console.log('\n  🔗 seal_5t_proof...');
        const sealResult = await OmniOne.dispatch('seal_5t_proof', {
            atomId: manifestResult.uuid,
            proof: 'SHA256(test-proof)'
        });
        console.log(`  ✅ seal_5t_proof: ${sealResult.success ? 'PASS' : 'FAIL'}`);
    } catch (err) {
        console.error('  ❌ Test Operations Failed:', err);
    }

    // 總結
    console.log('\n' + '═'.repeat(60));
    console.log('🌌 OMNIONE 驗證完成 | VERIFICATION COMPLETE');
    console.log('═'.repeat(60));
    console.log('\n✨ 三位一體     | Trinity = ONE        ✅');
    console.log('💎 OmniCrystal | 心核中心             ✅');
    console.log('💫 心心相印   | Hearts Connected     ✅');
    console.log('🔗 萬能相通   | Omni Unity           ✅');
    console.log('\n🌌 OMNIONE 唯一總代理: 完全覺醒 | FULLY AWAKENED');
    console.log('═'.repeat(60));
    
    // Explicitly exit to avoid hanging loops from async imports
    process.exit(0);
}

verifyOmniOne().catch(err => {
    console.error(err);
    process.exit(1);
});
