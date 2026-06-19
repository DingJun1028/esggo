/**
 * test_unified_advancement.ts
 * ----------------------------
 * 奧秘晉級系統 - 測試腳本
 * 
 * 核心理念：永續經營，質量保證
 */

import { unifiedAdvancementService } from '../services/UnifiedAdvancementService.js';

const TEST_USER_ID = 'test-user-' + Date.now();

async function runTests() {
  console.log('🧪 開始運行奧秘晉級系統測試...\n');

  // 測試 1: 創建新用戶
  console.log('📝 測試 1: 創建新用戶');
  try {
    const progress1 = await unifiedAdvancementService.getUserProgress(TEST_USER_ID);
    console.log(`✅ 用戶創建成功: ${progress1.combinedTitle} (Lv.${progress1.combinedLevel})`);
    console.log(`   XP: ${progress1.combinedXP}`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 2: 添加經驗值
  console.log('\n📝 測試 2: 添加經驗值');
  try {
    const progress2 = await unifiedAdvancementService.addExperience(TEST_USER_ID, 100, 'report');
    console.log(`✅ 經驗值添加成功`);
    console.log(`   等級: ${progress2.combinedLevel}, XP: ${progress2.combinedXP}`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 3: 添加更多經驗值
  console.log('\n📝 測試 3: 繼續添加經驗值');
  try {
    const progress3 = await unifiedAdvancementService.addExperience(TEST_USER_ID, 150, 'market');
    console.log(`✅ 商情經驗值添加成功`);
    console.log(`   等級: ${progress3.combinedLevel}, XP: ${progress3.combinedXP}`);
    console.log(`   報告書進度: ${progress3.reportProgress.title} (Lv.${progress3.reportProgress.level})`);
    console.log(`   商情進度: ${progress3.marketProgress.title} (Lv.${progress3.marketProgress.level})`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 4: 跨服務學習
  console.log('\n📝 測試 4: 跨服務學習');
  try {
    const progress4 = await unifiedAdvancementService.completeCrossServiceLearning(
      TEST_USER_ID,
      'src-01',
      'mic-01-01'
    );
    console.log(`✅ 跨服務學習完成`);
    console.log(`   等級: ${progress4.combinedLevel}, XP: ${progress4.combinedXP}`);
    const newBadge = progress4.unifiedBadges[progress4.unifiedBadges.length - 1];
    if (newBadge) {
      console.log(`   🏅 獲得新徽章: ${newBadge.name}`);
    }
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 5: 智能推薦
  console.log('\n📝 測試 5: 獲取智能推薦');
  try {
    const recommendations = await unifiedAdvancementService.getSmartRecommendations(TEST_USER_ID);
    console.log(`✅ 智能推薦獲取成功`);
    console.log(`   推薦數量: ${recommendations.length}`);
    if (recommendations.length > 0) {
      console.log(`   最佳推薦: ${recommendations[0].title}`);
      console.log(`   原因: ${recommendations[0].reason}`);
    }
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 6: 學習路徑
  console.log('\n📝 測試 6: 獲取學習路徑');
  try {
    const paths = await unifiedAdvancementService.getLearningPath(TEST_USER_ID);
    console.log(`✅ 學習路徑獲取成功`);
    console.log(`   路徑數量: ${paths.length}`);
    if (paths.length > 0) {
      console.log(`   推薦路徑: ${paths[0].name}`);
      console.log(`   總 XP: ${paths[0].totalXP}`);
      console.log(`   預估時間: ${paths[0].totalTime} 分鐘`);
    }
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 7: 傳承點數
  console.log('\n📝 測試 7: 添加傳承點數');
  try {
    const progress7 = await unifiedAdvancementService.addLegacyPoints(TEST_USER_ID, 50, '測試獎勵');
    console.log(`✅ 傳承點數添加成功`);
    console.log(`   傳承點數: ${progress7.legacyPoints}`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 8: 活動日誌
  console.log('\n📝 測試 8: 獲取活動日誌');
  try {
    const activities = await unifiedAdvancementService.getUserActivities(TEST_USER_ID);
    console.log(`✅ 活動日誌獲取成功`);
    console.log(`   活動數量: ${activities.length}`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 9: 排行榜
  console.log('\n📝 測試 9: 獲取排行榜');
  try {
    const leaderboard = await unifiedAdvancementService.getLeaderboard(5);
    console.log(`✅ 排行榜獲取成功`);
    console.log(`   前 5 名用戶:`);
    leaderboard.forEach((user: any) => {
      console.log(`   ${user.rank}. ${user.title} (Lv.${user.level}) - ${user.xp} XP`);
    });
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 10: AI 分析
  console.log('\n📝 測試 10: AI 智能分析');
  try {
    const analysis = await unifiedAdvancementService.analyzeProgressWithAI(TEST_USER_ID);
    console.log(`✅ AI 分析完成`);
    console.log(`   分析結果: ${analysis.substring(0, 200)}...`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  // 測試 11: 最終用戶進度
  console.log('\n📝 測試 11: 最終用戶進度');
  try {
    const finalProgress = await unifiedAdvancementService.getUserProgress(TEST_USER_ID);
    console.log(`✅ 最終進度:`);
    console.log(`   統一等級: ${finalProgress.combinedLevel} - ${finalProgress.combinedTitle}`);
    console.log(`   統一 XP: ${finalProgress.combinedXP}`);
    console.log(`   報告書等級: ${finalProgress.reportProgress.level} - ${finalProgress.reportProgress.title}`);
    console.log(`   商情等級: ${finalProgress.marketProgress.level} - ${finalProgress.marketProgress.title}`);
    console.log(`   傳承點數: ${finalProgress.legacyPoints}`);
    console.log(`   徽章數量: ${finalProgress.unifiedBadges.length}`);
    console.log(`   統計: 報告書 ${finalProgress.statistics.totalReportsCreated}, 分析 ${finalProgress.statistics.totalAnalyses}`);
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }

  console.log('\n🎉 所有測試完成！');
}

// 運行測試
runTests().catch(console.error);
