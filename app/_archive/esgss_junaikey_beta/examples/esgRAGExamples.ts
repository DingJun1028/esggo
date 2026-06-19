/**
 * ESG RAG 整合示例
 * 展示如何在實際應用中使用 ESG RAG 系統
 */

import { esgRAG, ESGKnowledgeBase } from '../celestial-server/src/services/esgRAG';
import { omniClient as omniCore } from '../src/api/omniClient';

// ============================================================================
// 示例 1: 基礎 ESG 知識檢索
// ============================================================================

export async function demonstrateBasicRetrieval() {
  console.log('--- 示例 1: 基礎 ESG 知識檢索 ---');

  const query = '什麼是範疇三溫室氣體排放？';
  console.log(`查詢: ${query}`);

  try {
    const results = await esgRAG.retrieve(query, {
      topK: 3,
      threshold: 0.7,
      includeMetadata: true,
    });

    console.log(`找到 ${results.length} 條相關知識:`);
    results.forEach((item, index) => {
      console.log(
        `\n[${index + 1}] 來源: ${item.source} (相似度: ${(item.similarity * 100).toFixed(1)}%)`
      );
      console.log(`內容: ${item.content.substring(0, 100)}...`);
    });
  } catch (error) {
    console.error('檢索失敗:', error);
  }
}

// ============================================================================
// 示例 2: AI 增強回答生成 (Advanced RAG)
// ============================================================================

export async function demonstrateAugmentedGeneration() {
  console.log('\n--- 示例 2: AI 增強回答生成 ---');

  const question = '企業應如何開始導入 TCFD 架構？';
  console.log(`問題: ${question}`);

  try {
    // 1. 檢索相關上下文
    const retrievalResults = await esgRAG.retrieve(question, {
      topK: 5,
    });

    // 2. 建構增強提示詞 (Prompt Engineering)
    const context = retrievalResults.map(r => r.content).join('\n\n');

    // ... Prompt construction logic remains same ...

    console.log('生成的回答 (模擬):');
    console.log('根據 TCFD 建議，企業導入應遵循以下四個核心要素：');
    console.log('1. 治理 (Governance): 建立董事會對氣候風險的監督機制。');
    console.log('2. 策略 (Strategy): 識別氣候變遷對業務的短期與長期影響。');
    console.log('3. 風險管理 (Risk Management): 將氣候風險納入整體風險管理流程。');
    console.log('4. 指標與目標 (Metrics & Targets): 設定減碳目標並追蹤進度。');

    console.log('\n參考來源:');
    retrievalResults.forEach(r => {
      console.log(`- ${r.source}`);
    });
  } catch (error) {
    console.error('生成失敗:', error);
  }
}

// ============================================================================
// 示例 3: 知識庫數據注入
// ============================================================================

export async function demonstrateDataIngestion() {
  console.log('\n--- 示例 3: 知識庫數據注入 ---');

  const newDoc = {
    content: `
            GRI (全球報告倡議組織) 發布了 2024 年通用準則更新。
            主要變更包括：
            1. 強化了對人權盡職調查的揭露要求。
            2. 更新了生物多樣性標準 (GRI 304)。
            3. 強制要求揭露氣候相關轉型計畫。
        `,
    source: 'GRI Official Website',
    metadata: {
      id: 'doc_gri_2024_update',
      title: 'GRI 準則 2024 更新摘要',
      author: 'GRI Standards Board',
      date: '2024-01-15',
      tags: ['GRI', 'Reporting', 'Compliance'],
    },
  };

  try {
    // Using ingest directly as an example, or could use batchIngest
    const chunkId = await esgRAG.ingest(
      ESGKnowledgeBase.GRI_STANDARDS,
      newDoc.content,
      newDoc.source,
      newDoc.metadata
    );

    console.log(`成功注入文檔, Chunk ID: ${chunkId}`);
  } catch (error) {
    console.error('注入失敗:', error);
  }
}
