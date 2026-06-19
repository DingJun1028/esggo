# 永續報告中心 (Sustainability Report Center) 設計規格書

## 1. 服務概觀 (Service Overview)
*   **核心目標**：提供企業一站式的 ESG 報告管理平台，從數據蒐集、AI 撰寫、法規對齊到不可篡改的發布。
*   **5T 實踐**：
    *   **Tangible**：可供下載的 PDF 報告與互動式網頁報告。
    *   **Traceable**：報告中的每一組數據（碳排、工傷率）均可導回數據來源與憑證。
    *   **Trackable**：紀錄報告修訂歷程與簽核流程。
    *   **Transparent**：揭露報告所使用的計算方法學（如 GRI Content Index）。
    *   **Trustworthy**：最終報告執行 SHA-256 簽名，鎖定於系統中。

## 2. 功能模組 (Functional Modules)
*   **R1: 報告儀表板**：顯示待辦事項、數據填報完成率、目標準度。
*   **R2: 智能撰寫器**：利用 JunAiKey (Gemini) 根據已填報數據自動生成符合 GRI 標準的章節草案。
*   **R3: 框架管理器**：支援 GRI, SASB, TCFD 切換，自動檢查指標覆蓋率。
*   **R4: 簽核與發布**：多級審核機制，發布後自動生成「誠信 Hash」。

## 3. 教學引引導 (Onboarding Steps)
1. **建立專案**：設定報告年度與遵循標準。
2. **數據鏈結**：將 `CarbonAccounting` 等服務數據引入報告。
3. **AI 生成**：示範如何使用 AI 輔助撰寫與校對。
4. **誠信發布**：理解「鎖定」報告對於外部審核的重要性。

## 4. 數據結構 (Data Schema)
```typescript
interface SustainabilityReport {
  id: string;
  year: number;
  standard: 'GRI' | 'SASB' | 'TCFD'[];
  status: 'Draft' | 'Review' | 'Published' | 'Trustworthy';
  sections: ReportSection[];
  metricsSummary: any;
  hashSignature?: string;
}
```
