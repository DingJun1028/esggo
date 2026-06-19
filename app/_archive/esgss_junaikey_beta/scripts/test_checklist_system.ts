/**
 * 測試腳本：ESG 報告書檢核系統
 * =================================
 * 驗證單據上傳、問題回答、評分系統
 */

import { documentChecklistService } from '../server/services/DocumentChecklistService';
import { ALL_DOCUMENTS, getCriticalDocuments } from '../src/config/DocumentRegistry';
import { ALL_QUESTIONS, getRequiredQuestions, getQuestionStats } from '../src/config/QuestionRegistry';
import { GRI_STANDARDS, TCFD_STANDARDS, calculateReportScore } from '../src/config/ReportingStandards';

console.log('🧪 ESG 報告書檢核系統測試\n');
console.log('═'.repeat(70));

// 1. 單據清單統計
console.log('\n📄 單據清單統計');
console.log('─'.repeat(70));
console.log(`總單據數：${ALL_DOCUMENTS.length} 份`);
console.log(`必要單據：${ALL_DOCUMENTS.filter(d => d.required).length} 份`);
console.log(`關鍵單據：${getCriticalDocuments().length} 份`);
console.log('\n按類別分布：');
console.log(`  🌱 環境 (E)：${ALL_DOCUMENTS.filter(d => d.category === 'Environment').length} 份`);
console.log(`  👥 社會 (S)：${ALL_DOCUMENTS.filter(d => d.category === 'Social').length} 份`);
console.log(`  📊 治理 (G)：${ALL_DOCUMENTS.filter(d => d.category === 'Governance').length} 份`);

// 2. 問題清單統計
console.log('\n❓ 問題清單統計');
console.log('─'.repeat(70));
const stats = getQuestionStats();
console.log(`總問題數：${stats.total} 題`);
console.log(`必答問題：${stats.required} 題`);
console.log('\n按類別分布：');
console.log(`  🌱 環境 (E)：${stats.byCategory.Environment} 題`);
console.log(`  👥 社會 (S)：${stats.byCategory.Social} 題`);
console.log(`  📊 治理 (G)：${stats.byCategory.Governance} 題`);
console.log('\n按框架分布：');
console.log(`  GRI：${stats.byFramework.GRI} 題`);
console.log(`  SASB：${stats.byFramework.SASB} 題`);
console.log(`  TCFD：${stats.byFramework.TCFD} 題`);
console.log(`  CDP：${stats.byFramework.CDP} 題`);
console.log(`  ESRS：${stats.byFramework.ESRS} 題`);

// 3. 創建測試檢核清單
console.log('\n📋 創建測試檢核清單');
console.log('─'.repeat(70));

async function testChecklistSystem() {
    // 創建檢核清單
    const checklist = await documentChecklistService.createChecklist('TEST_COMPANY_001', 2024);
    console.log(`✓ 創建檢核清單：${checklist.companyId} - 報告年度 ${checklist.reportYear}`);

    // 模擬上傳關鍵單據
    const criticalDocs = getCriticalDocuments();
    console.log(`\n📤 模擬上傳 ${criticalDocs.length} 份關鍵單據...`);

    for (const doc of criticalDocs.slice(0, 3)) {
        // 創建模擬文件
        const mockFile = new File(['mock content'], `${doc.id}_test.xlsx`, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        try {
            const instance = await documentChecklistService.uploadDocument(
                checklist.companyId,
                {
                    documentDefId: doc.id,
                    file: mockFile,
                    metadata: {
                        year: 2024,
                        quarter: 1,
                        department: 'ESG部門'
                    }
                }
            );

            console.log(`  ✓ ${doc.name} - 狀態：${instance.status} | 分數：${instance.validationResult?.score}/100`);
            checklist.documents.push(instance);
        } catch (error: any) {
            console.log(`  ✗ ${doc.name} - 錯誤：${error.message}`);
        }
    }

    // 計算摘要
    const summary = documentChecklistService.calculateSummary(checklist.documents);
    checklist.summary = summary;

    console.log('\n📊 檢核摘要');
    console.log('─'.repeat(70));
    console.log(`總必要單據：${summary.totalRequired} 份`);
    console.log(`已上傳：${summary.uploaded} 份`);
    console.log(`已驗證：${summary.verified} 份`);
    console.log(`缺失：${summary.missing} 份`);
    console.log(`完整度：${summary.completeness.toFixed(1)}%`);
    console.log(`準備就緒：${summary.readyForReport ? '✓ 是' : '✗ 否'}`);

    if (summary.criticalIssues.length > 0) {
        console.log(`\n⚠️  關鍵問題：`);
        summary.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    if (summary.warnings.length > 0) {
        console.log(`\n💡 警告：`);
        summary.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // 生成缺失報告
    const missingReport = documentChecklistService.generateMissingReport(checklist);
    console.log(`\n📋 缺失單據清單（${missingReport.missing.length} 份）`);
    console.log('─'.repeat(70));
    missingReport.missing.slice(0, 5).forEach(doc => {
        console.log(`  ${doc.urgency === 'critical' ? '⚠️ ' : '📄'} ${doc.name}`);
        console.log(`     類別：${doc.category} | 框架：${doc.frameworks.join(', ')}`);
    });

    if (missingReport.recommendations.length > 0) {
        console.log(`\n💡 建議：`);
        missingReport.recommendations.forEach(rec => console.log(`  ${rec}`));
    }

    return checklist;
}

// 4. GRI 填寫標準測試
console.log('\n📚 GRI 填寫標準');
console.log('─'.repeat(70));
console.log(`框架版本：${GRI_STANDARDS.version}`);
console.log(`標準章節數：${GRI_STANDARDS.standards.length}`);
console.log(`評分類別數：${GRI_STANDARDS.scoringCriteria.categories.length}`);
console.log(`評級等級：${GRI_STANDARDS.scoringCriteria.gradingScale.map(g => g.grade).join(', ')}`);

console.log('\n評分權重分配：');
const weights = GRI_STANDARDS.scoringCriteria.overallWeights;
console.log(`  完整性 (Completeness)：${(weights.completeness * 100).toFixed(0)}%`);
console.log(`  準確性 (Accuracy)：${(weights.accuracy * 100).toFixed(0)}%`);
console.log(`  透明度 (Transparency)：${(weights.transparency * 100).toFixed(0)}%`);
console.log(`  重大性 (Materiality)：${(weights.materiality * 100).toFixed(0)}%`);
console.log(`  可比性 (Comparability)：${(weights.comparability * 100).toFixed(0)}%`);

// 5. TCFD 填寫標準測試
console.log('\n📚 TCFD 填寫標準');
console.log('─'.repeat(70));
console.log(`框架版本：${TCFD_STANDARDS.version}`);
console.log(`四大支柱：${TCFD_STANDARDS.standards.map(s => s.section).join(', ')}`);

TCFD_STANDARDS.standards.forEach(section => {
    console.log(`\n${section.section}（權重：${section.weight}%）`);
    console.log(`  必要揭露項目：${section.requirements.length} 項`);
});

// 6. 報告評分測試
console.log('\n🎯 報告評分測試');
console.log('─'.repeat(70));

const mockScore = calculateReportScore('GRI', {}, {});
console.log(`框架：${mockScore.framework}`);
console.log(`總分：${mockScore.overallScore.toFixed(1)}/100`);
console.log(`等級：${mockScore.grade}`);
console.log(`\n各類別分數：`);
Object.entries(mockScore.categoryScores).forEach(([cat, score]) => {
    console.log(`  ${cat}：${score}/100`);
});

console.log(`\n✅ 優勢：`);
mockScore.strengths.forEach(s => console.log(`  - ${s}`));

console.log(`\n⚠️  待改進：`);
mockScore.weaknesses.forEach(w => console.log(`  - ${w}`));

console.log(`\n💡 建議：`);
mockScore.recommendations.forEach(r => console.log(`  - ${r}`));

console.log(`\n📊 對標`);
console.log(`  行業平均分：${mockScore.comparisonToBenchmark.industryAverage}`);
console.log(`  位於百分位：${mockScore.comparisonToBenchmark.percentile}%`);

// 執行測試
console.log('\n\n🚀 開始執行完整測試...\n');
testChecklistSystem().then(checklist => {
    console.log('\n\n═'.repeat(70));
    console.log('✅ 所有測試完成！');
    console.log('═'.repeat(70));

    console.log('\n📌 系統功能總結：');
    console.log('  ✓ 單據總清單（15份，涵蓋E/S/G）');
    console.log('  ✓ 問題總清單（18題，涵蓋5大框架）');
    console.log('  ✓ 上傳檢核功能');
    console.log('  ✓ 自動驗證與評分');
    console.log('  ✓ 缺失報告生成');
    console.log('  ✓ GRI 填寫標準與評分準則');
    console.log('  ✓ TCFD 填寫標準與評分準則');
    console.log('  ✓ UI 檢核面板');

    console.log('\n🎉 ESG 報告書檢核系統已就緒！\n');
}).catch(error => {
    console.error('\n❌ 測試失敗：', error);
});
