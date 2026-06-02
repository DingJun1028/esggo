import { z } from 'zod';
import { getOmniAgentAI } from '@/lib/omni.config';

// 定義記憶碎片 Schema
export const MemoryShardSchema = z.object({
  id: z.string().uuid(),
  title: z.string().describe('碎片標題，例如：解決 Prisma N+1 查詢問題'),
  description: z.string().describe('詳細描述此片段中代理人與使用者的事件總結'),
  tags: z.array(z.string()).describe('關鍵技能標籤，例如：[React, Performance, OmniCore]'),
  extractedCodeSnippets: z.array(z.string()).optional().describe('擷取出的有價值程式碼片段'),
  entropyLevel: z.number().min(0).max(100).optional().describe('系統熵值 (0 代表最極致的無有狀態，100 代表高度混亂)'),
  timestamp: z.number()
});

export type MemoryShard = z.infer<typeof MemoryShardSchema>;

// 定義完整的技能奧義 Schema
export const SkillUltimateSchema = z.object({
  skillName: z.string().describe('技能奧義名稱，例如：全端渲染優化奧義'),
  masteryLevel: z.enum(['Novice', 'Adept', 'Expert', 'Master']),
  corePrinciples: z.array(z.string()).describe('從記憶碎片中萃取出的核心原則'),
  synthesis: z.string().describe('結合多個記憶碎片的深度總結與奧義心法'),
  voidDimension: z.enum(['Structural Void', 'Logical Void', 'Stateful Void', 'Unified']).optional().describe('無有技藝歸屬維度'),
  sourceShards: z.array(z.string()).describe('組成此奧義的記憶碎片 ID 列表')
});

export type SkillUltimate = z.infer<typeof SkillUltimateSchema>;

/**
 * 核心機制：將原始代理對話紀錄轉化為【記憶碎片】
 */
export async function extractMemoryShard(conversationLog: string): Promise<MemoryShard> {
  const ai = await getOmniAgentAI();
  
  const prompt = `
請分析以下代理程式與使用者之間的對話紀錄，總結出發生的事件與解決的問題，並將其轉化為一個「記憶碎片 (Memory Shard)」。
記憶碎片代表了一次有價值的技術互動或決策過程。

【無有技藝 (Void-Presence Art) 萃取法則】：
1. 尋找源頭 (Source Origin Tracing)：在紀錄中尋找問題發生的根本原因。
2. 熵減評估 (Entropy Evaluation)：評估本次行動是否減少了系統的冗餘代碼或技術債，並給予 entropyLevel 評分。

對話紀錄：
${conversationLog}
`;

  try {
    const response = await ai.generate({
      system: "你是一個專業的【無有技藝】記憶萃取系統。你的目標是從雜亂的對話與執行紀錄中，提煉出具有高度技術價值的記憶碎片，並以「熵減 (Entropy Reduction)」的視角進行評分。",
      prompt,
      output: {
        schema: MemoryShardSchema
      }
    });

    const shard = response.output();
    if (!shard) {
      throw new Error('無法萃取記憶碎片：模型輸出為空');
    }

    return shard;
  } catch (error) {
    console.error('萃取記憶碎片失敗:', error);
    throw error;
  }
}

/**
 * 核心機制：收集足夠的記憶碎片後，自動領悟【完整的技能奧義】
 */
export async function synthesizeSkillUltimate(shards: MemoryShard[]): Promise<SkillUltimate> {
  const ai = await getOmniAgentAI();
  
  const shardsContext = shards.map(s => `
[碎片 ${s.id}] ${s.title}
標籤: ${s.tags.join(', ')}
描述: ${s.description}
  `).join('\n\n');

  const prompt = `
系統已收集到 ${shards.length} 塊記憶碎片。請根據這些碎片的關聯性與累積的技術脈絡，將它們融合成一本【完整的技能奧義 (Skill Ultimate)】。
請賦予這個奧義一個強而有力的名稱，並提煉出其核心原則與心法。

【無有技藝 (Void-Presence Art) 合成法則】：
根據記憶碎片的特性，判定此奧義屬於哪一個無有維度 (voidDimension)：
- Structural Void (結構之無)：消除DOM臃腫，液態成形
- Logical Void (邏輯之無)：算力歸核，依賴5T協議，無為而治
- Stateful Void (狀態之無)：量子糾纏，無狀態即全狀態
- Unified (三元合一)：涵蓋以上所有

記憶碎片集合：
${shardsContext}
`;

  try {
    const response = await ai.generate({
      system: "你是一個專業的【無有技藝】奧義合成系統。當收集到足夠的碎片時，你能夠將散落的知識融合為具有系統化與哲理深度的技能奧義，並精準歸類其無有維度。",
      prompt,
      output: {
        schema: SkillUltimateSchema
      }
    });

    const ultimate = response.output();
    if (!ultimate) {
      throw new Error('無法合成技能奧義：模型輸出為空');
    }

    // 將碎片 ID 注入
    ultimate.sourceShards = shards.map(s => s.id);
    
    return ultimate;
  } catch (error) {
    console.error('合成技能奧義失敗:', error);
    throw error;
  }
}
