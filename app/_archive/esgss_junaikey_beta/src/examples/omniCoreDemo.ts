/**
 * 奧秘心核完整範例
 * Omnipotent Core Complete Example
 *
 * 展示四元一體系統的完整使用流程
 */

import { createOmniCore } from '../core/omniCore';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

import {
  createEternalMemory,
  EternalMemoryType,
} from '../omni/infrastructure/memory/EternalMemory';
import type {
  OmniCore,
  OmniThinkTank,
  OmniAgent,
  OmniKnowledgeBase,
  OmniSkillRegistry,
  OmniSkill,
  OmniRequestType,
} from '../types/omniCore';

// ============================================================================
// 模擬智庫實作（實際應連接到 Celestial Server）
// ============================================================================

class MockThinkTank implements OmniThinkTank {
  id = 'mock_thinktank';
  name = '模擬智庫';
  knowledgeBases: OmniKnowledgeBase[] = [];
  agents: OmniAgent[] = [];
  skillRegistry: OmniSkillRegistry = {
    register: () => { },
    unregister: () => { },
    get: () => undefined,
    list: () => [],
    listByCategory: () => [],
  };

  async query(query: string) {
    return [
      {
        content: `關於「${query}」的知識...`,
        similarity: 0.95,
        source: 'knowledge_base',
        metadata: {},
      },
    ];
  }

  async reason(input: any) {
    return {
      conclusion: `基於輸入「${input.query}」的推理結論`,
      reasoning: ['步驟1：分析問題', '步驟2：檢索知識', '步驟3：得出結論'],
      confidence: 0.85,
    };
  }

  async learn(knowledge: any) {
    omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `[MockThinkTank] 學習新知識: ${knowledge.content}` });
  }

  async createAgent(config: any) {
    const agent: OmniAgent = {
      id: `agent_${Date.now()}`,
      name: config.name,
      description: config.description,
      systemPrompt: config.systemPrompt,
      baseModel: config.baseModel || 'gemini-1.5-flash',
      temperature: config.temperature || 0.7,
      skills: [],
      tags: { tags: [], add: () => { }, remove: () => { }, find: () => [], findByType: () => [] },
      process: async input => ({
        content: `AI回應: ${input}`,
        tags: [],
      }),
      addSkill: () => { },
      removeSkill: () => { },
    };
    this.agents.push(agent);
    return agent;
  }
}

// ============================================================================
// 完整使用範例
// ============================================================================

async function demonstrateOmniCore() {
  omniLogger.info(LogCategory.SYSTEM, '🌌 奧秘心核完整演示開始...\n');

  // 1. 創建奧秘永憶
  const eternalMemory = createEternalMemory('ESG 奧秘永憶');

  // 2. 創建奧秘心核
  const omniCore: OmniCore = createOmniCore({
    name: 'ESG JunAiKey 奧秘心核',
    version: '1.0.0',
    thinkTank: new MockThinkTank(),
  });

  // 手動添加永憶系統到心核
  (omniCore as any).eternalMemory = eternalMemory;

  // 3. 初始化心核
  await omniCore.initialize();

  omniLogger.info(LogCategory.SYSTEM, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 1: 儲存和檢索記憶 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 📚 場景 1: 儲存和檢索記憶\n');

  // 儲存短期記憶
  await eternalMemory.store('GRI 是全球最廣泛使用的永續報告框架', EternalMemoryType.SHORT_TERM, {
    source: 'user_input',
    topics: ['ESG', 'GRI', '永續報告'],
  });

  // 儲存長期記憶
  await eternalMemory.store('TCFD 建議企業揭露氣候相關財務資訊', EternalMemoryType.LONG_TERM, {
    source: 'knowledge_base',
    topics: ['ESG', 'TCFD', '氣候'],
  });

  // 儲存程序記憶（技能）
  await eternalMemory.store(
    '計算碳排放的步驟：1. 收集活動數據 2. 選擇排放係數 3. 計算排放量',
    EternalMemoryType.PROCEDURAL,
    {
      source: 'skill_learning',
      topics: ['碳排放', '計算方法'],
    }
  );

  // 檢索記憶
  const memories = await eternalMemory.retrieve('ESG 報告框架', {
    limit: 5,
    sortBy: 'relevance',
  });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 檢索到 ${memories.length} 條相關記憶:` });
  memories.forEach((m: any, i: number) => {
    omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   ${i + 1}. [${m.type}] ${m.content.substring(0, 50)}...` });
  });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 2: 處理查詢請求 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 🔍 場景 2: 處理查詢請求\n');

  const queryRequest = {
    id: `req_${Date.now()}`,
    type: 'query' as OmniRequestType,
    content: '什麼是 ESG？',
    timestamp: new Date(),
  };

  const queryResponse = await omniCore.process(queryRequest);
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 查詢回應: ${queryResponse.content}` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   執行時間: ${queryResponse.executionTime}ms` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   生成標籤: ${queryResponse.generatedTags.length} 個` });

  // 將查詢記錄到永憶
  await eternalMemory.store(
    `用戶查詢: ${queryRequest.content}\nAI回應: ${queryResponse.content}`,
    EternalMemoryType.EPISODIC,
    {
      source: 'conversation',
      sessionId: 'demo_session',
      sentiment: 'neutral',
    }
  );

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 3: 推理請求 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 🧠 場景 3: 推理請求\n');

  const reasonRequest = {
    id: `req_${Date.now()}`,
    type: 'reason' as OmniRequestType,
    content: '如何降低企業碳排放？',
    context: {
      context: ['企業有製造工廠', '目前使用燃煤發電'],
    },
    timestamp: new Date(),
  };

  const reasonResponse = await omniCore.process(reasonRequest);
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 推理結論: ${reasonResponse.content}` });
  if (reasonResponse.data) {
    const data = reasonResponse.data as any;
    omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   推理步驟:` });
    data.reasoning?.forEach((step: string, i: number) => {
      omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `      ${i + 1}. ${step}` });
    });
    omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   信心度: ${(data.confidence * 100).toFixed(1)}%` });
  }

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 4: 學習新知識 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 📖 場景 4: 學習新知識\n');

  const learnRequest = {
    id: `req_${Date.now()}`,
    type: 'learn' as OmniRequestType,
    content: 'Scope 3 碳排放包括供應鏈上下游的間接排放',
    context: {
      category: 'carbon_emission',
      importance: 'high',
    },
    timestamp: new Date(),
  };

  const learnResponse = await omniCore.process(learnRequest);
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ ${learnResponse.content}` });

  // 同時儲存到永憶
  await eternalMemory.store(learnRequest.content, EternalMemoryType.SEMANTIC, {
    source: 'learning',
    topics: ['Scope 3', '碳排放', '供應鏈'],
  });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 5: 記憶鞏固 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 🔄 場景 5: 記憶鞏固\n');

  const consolidationResult = await eternalMemory.consolidate();
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 記憶鞏固完成:` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   鞏固記憶數: ${consolidationResult.consolidatedCount}` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   合併記憶數: ${consolidationResult.mergedMemories.length}` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   生成摘要數: ${consolidationResult.summaries.length}` });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 6: 記憶統計 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 📊 場景 6: 記憶統計\n');

  const stats = await eternalMemory.getStatistics();
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 記憶統計:` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   總記憶數: ${stats.total}` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   平均重要性: ${(stats.averageImportance * 100).toFixed(1)}%` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   儲存空間: ${stats.storageUsed.formatted}` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   記憶類型分布:` });
  Object.entries(stats.byType).forEach(([type, count]) => {
    if ((count as number) > 0) {
      omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `      ${type}: ${count}` });
    }
  });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n   最常訪問的記憶:');
  stats.mostAccessed.slice(0, 3).forEach((m: any, i: number) => {
    omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `      ${i + 1}. [訪問${m.accessCount}次] ${m.content.substring(0, 40)}...` });
  });

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 場景 7: 記憶導出 ==========
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 💾 場景 7: 記憶導出\n');

  const exportedData = await eternalMemory.export();
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `✅ 記憶已導出 (${exportedData.length} bytes)` });
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] Info', { data: `   可用於備份或遷移到其他系統\n` });

  // ========== 清理 ==========
  await omniCore.shutdown();

  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 🎉 奧秘心核演示完成！\n');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] 四元一體系統已就緒：');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo]   ✨ 奧秘元件 - 功能執行');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo]   🏷️  奧秘標籤 - 語義標記');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo]   🧠 奧秘智庫 - 知識推理');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo]   💾 奧秘永憶 - 永恆記憶');
  omniLogger.info(LogCategory.SYSTEM, '[omniCoreDemo] \n系統具備完整的學習、記憶、推理和執行能力！🌟\n');
}

// 執行演示
if (require.main === module) {
  demonstrateOmniCore().catch(console.error);
}

export { demonstrateOmniCore };
