/**
 * Google ADK - Exemplar Report Agent 測試腳本
 * ============================================
 * 生成完整的千頁ESG報告
 */

import { exemplarReportAgent } from '../src/adk/agents/ExemplarReportAgent';
import type { ReportConfig } from '../src/adk/types/AdkReportTypes';

async function main() {
    // 配置報告參數
    const config: ReportConfig = {
        companyName: 'Exemplar Corporation',
        year: 2024,
        industry: 'Technology',
        targetPages: 1000,
        frameworks: ['GRI', 'SASB', 'TCFD', 'CDP', 'ESRS'],
        style: 'formal'
    };

    console.log('\n🚀 Starting Exemplar Report Agent...\n');

    try {
        // 執行報告生成
        const report = await exemplarReportAgent.generateReport(config);

        // 顯示結果摘要
        console.log('\n📊 Report Summary:');
        console.log('─'.repeat(70));
        console.log(`Title: ${report.metadata.title}`);
        console.log(`Company: ${report.metadata.company}`);
        console.log(`Year: ${report.metadata.year}`);
        console.log(`Generated At: ${new Date(report.metadata.generatedAt).toLocaleString('zh-TW')}`);
        console.log('');
        console.log('Frameworks:');
        report.metadata.frameworks.forEach(f => console.log(`  - ${f}`));
        console.log('');
        console.log(`Total Pages: ${report.assembly.pageCount}`);
        console.log(`File Size: ${(report.assembly.fileSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Output File: ${report.assembly.reportPath}`);
        console.log('');
        console.log('Quality Scores:');
        console.log(`  Overall: ${report.quality.overall}/100`);
        console.log(`  Data Quality: ${report.quality.dataQuality.overall}/100`);
        console.log(`  Compliance: ${report.quality.complianceScore}/100`);
        console.log(`  Narrative: ${report.quality.narrativeQuality}/100`);
        console.log(`  Completeness: ${report.quality.completeness}/100`);
        console.log('─'.repeat(70));
        console.log('');
        console.log('✅ Success! Check the report at:');
        console.log(`   ${report.assembly.reportPath}`);
        console.log('');

    } catch (error) {
        console.error('\n❌ Error generating report:');
        console.error(error);
        process.exit(1);
    }
}

// 執行
main();
