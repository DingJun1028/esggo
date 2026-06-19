/**
 * 測試奧秘精靈 (Omni-Genie) 服務
 * 驗證 InsightEngineService 與 CrystalSynthesisService
 */

import { insightEngineService } from '../src/services/InsightEngineService';
import { crystalSynthesisService } from '../src/services/CrystalSynthesisService';

async function testOmniGenie() {
    console.log('🧞 測試奧秘精靈服務...\n');

    try {
        // Test 1: 生成主動式任務
        console.log('📋 Test 1: 生成主動式任務建議');
        console.log('─'.repeat(60));
        const tasks = await insightEngineService.generateProactiveTasks();
        console.log(`✅ 成功生成 ${tasks.length} 個任務\n`);

        tasks.slice(0, 3).forEach((task, i) => {
            console.log(`任務 ${i + 1}: ${task.title}`);
            console.log(`  優先級: ${task.priority}`);
            console.log(`  來源: ${task.source}`);
            console.log(`  影響力: ${(task.estimatedImpact * 100).toFixed(1)}%`);
            console.log(`  描述: ${task.description.substring(0, 80)}...`);
            console.log('');
        });

        // Test 2: 分析數據缺口
        console.log('\n🔍 Test 2: 分析數據缺口');
        console.log('─'.repeat(60));
        const gaps = await insightEngineService.analyzeDataGaps();
        console.log(`✅ 識別出 ${gaps.length} 個數據缺口\n`);

        gaps.slice(0, 2).forEach((gap, i) => {
            console.log(`缺口 ${i + 1}: ${gap.category}`);
            console.log(`  嚴重性: ${gap.severity}`);
            console.log(`  建議: ${gap.suggestedAction.substring(0, 60)}...`);
            console.log('');
        });

        // Test 3: 智能自動填充
        console.log('\n💡 Test 3: 智能自動填充建議');
        console.log('─'.repeat(60));
        const suggestions = await crystalSynthesisService.suggestAutoFills();
        console.log(`✅ 生成 ${suggestions.length} 個自動填充建議\n`);

        suggestions.slice(0, 4).forEach((suggestion, i) => {
            console.log(`${i + 1}. ${suggestion}`);
        });

        // Test 4: 奧秘圓通數據整合
        console.log('\n\n🔄 Test 4: 奧秘圓通數據整合');
        console.log('─'.repeat(60));
        const yuantongData = await crystalSynthesisService.synthesizeFromYuantong();
        console.log(`✅ 成功載入奧秘圓通數據`);
        console.log(`  LOG 條目: ${yuantongData.logs.length}`);
        console.log(`  NOTE 條目: ${yuantongData.notes.length}`);
        console.log(`  TODO 條目: ${yuantongData.todos.length}`);
        console.log(`  日曆事件: ${yuantongData.calendar.length}`);

        // Test 5: 本質提煉
        console.log('\n\n✨ Test 5: 本質提煉 (Distill Essence)');
        console.log('─'.repeat(60));
        const essence = await crystalSynthesisService.distillEssence(yuantongData);
        console.log(`✅ 提煉出 ${essence.length} 個核心洞察\n`);
        essence.forEach(e => console.log(e));

        // Test 6: 敘事生成
        console.log('\n\n📝 Test 6: 報告敘事生成');
        console.log('─'.repeat(60));
        const narrative = await crystalSynthesisService.generateNarrative('environment');
        console.log('✅ 環境章節敘事範例：\n');
        console.log(narrative.substring(0, 300) + '...\n');

        // Test 7: 趨勢預測
        console.log('\n🔮 Test 7: ESG 趨勢預測');
        console.log('─'.repeat(60));
        const trends = await insightEngineService.predictTrends();
        console.log(`✅ 預測 ${trends.length} 個重要趨勢\n`);

        trends.slice(0, 2).forEach((trend, i) => {
            console.log(`趨勢 ${i + 1}: ${trend.trend}`);
            console.log(`  信心度: ${(trend.confidence * 100).toFixed(1)}%`);
            console.log(`  時間框架: ${trend.timeframe}`);
            console.log(`  影響: ${trend.implications[0]}`);
            console.log('');
        });

        // Summary
        console.log('\n' + '═'.repeat(60));
        console.log('🎉 所有測試通過！奧秘精靈服務運作正常');
        console.log('═'.repeat(60));
        console.log('\n✅ InsightEngineService: 可生成任務、分析缺口、預測趨勢');
        console.log('✅ CrystalSynthesisService: 可自動填充、整合數據、生成敘事');
        console.log('\n🚀 奧秘精靈已準備就緒，可整合至 UI！');

    } catch (error) {
        console.error('\n❌ 測試失敗:', error);
        process.exit(1);
    }
}

// 執行測試
testOmniGenie().catch(console.error);
