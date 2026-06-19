# 商情偵測中心 (Market Intelligence Center) 設計規格書

## 1. 服務概觀 (Service Overview)
*   **核心目標**：整合全球 ESG 法規更新、行業動態與競爭對手情報，提供 AI 驅動的數據摘要與策略洞察。
*   **5T 實踐**：
    *   **Tangible**：熱門關鍵字雲與趨勢警報。
    *   **Traceable**：所有情報均標註來源 URL 與可靠度評等。
    *   **Trackable**：紀錄用戶對情報的關注歷史與標籤分組。
    *   **Transparent**：說明 AI 摘要與情感分析 (Sentiment Analysis) 的背後參數。
    *   **Trustworthy**：重要法規修訂與行業基準數據執行 SHA-256 驗證。

## 2. 功能模組 (Functional Modules)
*   **I1: 全球情報流**：即時抓取 ESG 關鍵新聞與社交媒體動態。
*   **I2: AI 深度摘要**：針對長篇報告或多語系新聞進行精準提純。
*   **I3: 戰略警報 (Sentinel)**：當追蹤的 KPI 或關鍵字出現變動時主動通知。
*   **I4: 競爭對手基準**：對比同行業企業的 ESG 公開表現數據。

## 3. 教學引引導 (Onboarding Steps)
1. **設定關注領域**：定義您的行業分類與關鍵字（如：再生能源、供應鏈合規）。
2. **解讀 AI 摘要**：學習如何透過 AI 快速掌握全球趨勢。
3. **建立追蹤矩陣**：示範如何將商情轉化為企業內部優化策略。

## 4. 數據結構 (Data Schema)
```typescript
interface IntelItem {
  id: string;
  source: string;
  url: string;
  reliability: 'High' | 'Medium' | 'Low';
  tags: string[];
  sentiment: number; // -1 to 1
  aiSummary: string;
  impactScale: number; // 1-10
  timestamp: number;
}
```
