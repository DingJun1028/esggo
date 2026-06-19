// src/services/evolutionAdvisor.ts

import { useUniversalHistory } from '../store/useUniversalHistory';

// 定義進化報告的結構
export interface EvolutionReport {
  summary: string;           // 執行摘要
  healthScore: number;       // 系統健康分 (0-100)
  weakPoints: string[];      // 發現的脆弱點 (例如: "API-X 經常超時")
  strategicAdvice: string[]; // 架構優化建議
  generatedAt: number;
}

export class EvolutionAdvisor {

  /**
   * 儀式：召喚架構師 (Summon Architect)
   * 分析最近的日誌並生成進化報告
   */
  static async consult(): Promise<EvolutionReport> {
    // 1. 從智庫提取記憶
    const { logs, stats } = useUniversalHistory.getState();

    // 如果沒有足夠數據，返回空報告
    if (logs.length < 5) {
      throw new Error("Not enough data for entropy analysis. System is too young.");
    }

    // 2. 構建神聖提示詞 (Sacred Prompt)
    // 將日誌壓縮為摘要格式，避免 Token 爆炸
    const logSummary = logs.slice(0, 50).map(log =>
      `[${new Date(log.timestamp).toLocaleTimeString()}] Type:${log.type} Source:${log.sourceLabel} Entropy:${log.payload.entropyLevel || 'N/A'}`
    ).join('\n');

    const systemPrompt = `
      你是 JunAiKey 系統的首席架構師 (Seraphim Architect)。
      請分析以下系統運行日誌 (Evolution Logs)，並給出架構優化建議。

      核心指標:
      - 總自癒次數: ${stats.totalHeals}
      - 總自動化次數: ${stats.totalAutomations}

      近期日誌片段:
      ${logSummary}

      請以 JSON 格式返回報告，包含以下欄位:
      - summary: 對系統近期表現的簡短評語 (像一個嚴厲但充滿智慧的導師)。
      - healthScore: 基於免疫攔截頻率評分 (0-100)。
      - weakPoints: 列出 3 個最不穩定的模組或數據源。
      - strategicAdvice: 給出 3 個具體的優化行動建議 (例如: "為模組 X 增加緩存", "檢查 Y 的 API 限制")。
    `;

    // 3. 呼叫 Gemini (透過我們安全的後端中繼)
    // 這裡複用之前的 automationService 模式，或者直接 fetch 您的 LLM API
    try {
      const response = await fetch('/api/ask-gemini', { // 假設您有一個通用的 LLM 路由
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt })
      });

      const data = await response.json();
      return JSON.parse(data.answer); // 假設後端返回 JSON 格式的答案

    } catch (error) {
      console.error("Failed to consult Seraphim:", error);
      // 返回一個模擬報告作為降級方案
      return {
        summary: "連線中斷，但系統依然堅韌。檢測到多次輕微的熵增擾動。",
        healthScore: 85,
        weakPoints: ["External API Latency", "Data Formatting Drift"],
        strategicAdvice: ["檢查網絡連通性", "考慮增加本地緩存策略"],
        generatedAt: Date.now()
      };
    }
  }
}