import { GoogleGenAI, Type } from "@google/genai";

// 初始化 Gemini API (使用環境變數中的 GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIInsightResult {
  title: string;
  category: "S1" | "S2" | "S3" | "S4" | "S5";
  impact_level: 1 | 2 | 3 | 4 | 5;
  decision_ready_insight: string;
  target_entities: string[];
}

/**
 * 💡 AI Insight Pipeline (AI 洞察生成管線)
 * 將生硬的法規條文或企業報告摘要成 90 天內的「行動建議 (Decision-Ready Insight)」
 */
export async function generateDecisionReadyInsight(
  rawText: string,
  sourceUrl: string
): Promise<AIInsightResult> {
  try {
    const prompt = `
      你是一位頂尖的 ESG 策略長與商業偵情分析師。
      請閱讀以下來自 ${sourceUrl} 的原始法規或報告內容，並將其轉化為高階決策者 (CEO/董事會) 需要的「90 天行動建議 (Decision-Ready Insight)」。

      原始內容：
      ${rawText.substring(0, 5000)} // 限制長度以符合 Token 限制

      請嚴格按照以下 JSON 格式回覆：
      {
        "title": "精煉且具威脅/機會感的標題 (不超過 30 字)",
        "category": "必須是 S1, S2, S3, S4, S5 其中之一 (S1:全球治理, S2:揭露框架, S3:全球智庫, S4:資本金融, S5:產業技術)",
        "impact_level": 1 到 5 的整數 (5 代表最高衝擊，需立即行動),
        "decision_ready_insight": "具體的 90 天內行動建議，包含潛在風險、財務衝擊預估及具體對策 (約 100-150 字)",
        "target_entities": ["受影響的部門或供應鏈環節", "例如: 財務部", "採購部"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "情報標題" },
            category: { type: Type.STRING, description: "S1 到 S5 分類" },
            impact_level: { type: Type.INTEGER, description: "衝擊等級 1-5" },
            decision_ready_insight: { type: Type.STRING, description: "90天行動建議" },
            target_entities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "受影響的實體或部門",
            },
          },
          required: ["title", "category", "impact_level", "decision_ready_insight", "target_entities"],
        },
        temperature: 0.2, // 降低隨機性，確保決策建議的嚴謹度
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    const result = JSON.parse(jsonStr) as AIInsightResult;

    // 確保 category 格式正確
    if (!["S1", "S2", "S3", "S4", "S5"].includes(result.category)) {
      result.category = "S1";
    }

    return result;
  } catch (error) {
    console.error("AI Insight Generation Failed:", error);
    // 發生錯誤時的回退機制
    return {
      title: "無法解析的情報來源",
      category: "S3",
      impact_level: 3,
      decision_ready_insight: "系統目前無法自動生成洞察，請人工檢閱原始連結。",
      target_entities: ["Strategy Team"],
    };
  }
}
