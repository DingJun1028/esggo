/**
 * 台北語文學院 永續發展報告書 生成腳本
 * 500+ 頁面完整版
 */

import { comprehensive500PagePDFGenerator } from './Comprehensive500PagePDFGeneratorService';
import { taipeiLanguageInstituteReportData } from './TaipeiLanguageInstituteReportData';
import fs from 'fs';
import path from 'path';

async function generateTaipeiLanguageInstituteSustainabilityReport() {
  console.log('🌱 開始生成台北語文學院永續發展報告書...');
  console.log('='.repeat(60));
  
  try {
    // 使用台北語文學院完整數據
    const reportData = taipeiLanguageInstituteReportData;
    
    console.log(`\n📋 報告書資訊：
    組織名稱：${reportData.organizationName}
    產業類別：${reportData.industry}
    報告期間：${reportData.reportingPeriod.start} 至 ${reportData.reportingPeriod.end}
    員工人數：${reportData.employeeCount} 人
    報告書類型：${reportData.reportType.toUpperCase()}
    `);
    
    console.log('📊 環境績效摘要：');
    console.log(`  - 範疇一排放：${reportData.environment.emissions.scope1.total} ${reportData.environment.emissions.scope1.unit}`);
    console.log(`  - 範疇二排放：${reportData.environment.emissions.scope2.total} ${reportData.environment.emissions.scope2.unit}`);
    console.log(`  - 範疇三排放：${reportData.environment.emissions.scope3.reduce((a, b) => a + b.value, 0)} ${reportData.environment.emissions.scope1.unit}`);
    console.log(`  - 再生能源占比：${reportData.environment.energy.renewable.renewablePercent}%`);
    
    console.log('\n👥 社會績效摘要：');
    console.log(`  - 員工總數：${reportData.social.employeeCount} 人`);
    console.log(`  - 新進員工：${reportData.social.employment.newHires.total} 人`);
    console.log(`  - 訓練總時數：${reportData.social.training.totalHours.toLocaleString()} 小時`);
    
    console.log('\n🏛️ 治理結構摘要：');
    console.log(`  - 董事会規模：${reportData.governance.structure.boardSize} 人`);
    console.log(`  - 委員會數量：${reportData.governance.structure.committees.length} 個`);
    
    console.log('\n🔍 TCFD 揭露摘要：');
    console.log(`  - 氣候風險數：${reportData.tcfd.risks.length} 項`);
    console.log(`  - 氣候機會數：${reportData.tcfd.opportunities.length} 項`);
    
    console.log('\n✅ 4T 驗證：');
    console.log(`  - 驗證分數：${reportData.verification.score} 分`);
    console.log(`  - 驗證等級：${reportData.verification.badge}`);
    
    console.log('\n📄 正在生成 500+ 頁面報告書，請稍候...\n');
    
    // 生成 PDF
    const filename = await comprehensive500PagePDFGenerator.generateAndSavePDF(
      reportData,
      `TaipeiLanguageInstitute_SustainabilityReport_2024.pdf`
    );
    
    console.log('='.repeat(60));
    console.log('✅ 報告書生成成功！');
    console.log(`📁 檔案名稱：${filename}`);
    console.log(`📍 檔案位置：${path.resolve(filename)}`);
    console.log('\n報告書結構：');
    console.log('  第 1 頁：封面');
    console.log('  第 2 頁：目錄');
    console.log('  第 3-19 頁：執行摘要');
    console.log('  第 20-108 頁：環境績效');
    console.log('  第 110-218 頁：社會績效');
    console.log('  第 220-318 頁：公司治理');
    console.log('  第 320-393 頁：TCFD 氣候揭露');
    console.log('  第 395-500+ 頁：附錄（GRI/SASB/4T/SDGs）');
    console.log('='.repeat(60));
    
    return filename;
    
  } catch (error) {
    console.error('❌ 報告書生成失敗：', error);
    throw error;
  } finally {
    await comprehensive500PagePDFGenerator.closeBrowser();
  }
}

// 執行生成
generateTaipeiLanguageInstituteSustainabilityReport()
  .then(() => {
    console.log('\n🎉 台北語文學院永續發展報告書生成完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 執行失敗：', error);
    process.exit(1);
  });

export { generateTaipeiLanguageInstituteSustainabilityReport };
