# Carbon Accounting Manager 設計規格書 (Design Spec)

## 1. 服務概觀 (Service Overview)
*   **服務代碼**：ESG-2.2
*   **服務名稱**：碳盤存管理 (Carbon Accounting Manager)
*   **核心目標**：協助企業依據 ISO 14064-1 標準，精確計算、追蹤並管理範疇一、二、三的溫室氣體排放。
*   **5T 實踐**：
    *   **Tangible (可感知)**：排放熱點地圖與即時趨勢圖。
    *   **Traceable (可溯源)**：每筆排放數據必須鏈結至 `EvidenceVault` 中的原始單據（如電費單、加油發票）。
    *   **Trackable (可追蹤)**：紀錄排放係數 (Emission Factors) 的變更歷史。
    *   **Transparent (可驗算)**：公開計算公式 `$E = \sum (ActivityData \times EmissionFactor)$`。
    *   **Trustworthy (不可篡改)**：計算結果執行 Hash 鎖定，轉化為知識資產。

## 2. 視覺風格 (Visual Style)
*   **主題色**：Aqua Cyan (#63a6b0) & Emerald Green (輔助)。
*   **UI 模式**：液態玻璃 (Liquid Glass) / Bento Grid。
*   **關鍵組件**：
    *   `CarbonRadar`：展示範疇分布的雷達圖。
    *   `ActivityDataLog`：5T 驅動的活動數據登錄表。
    *   `EmissionFactorBrain`：AI 驅動的係數建議器。

## 3. 功能模組 (Functional Modules)
*   **M1: 組織邊界設定**：定義納入盤查的實體。
*   **M2: 活動數據管理**：輸入電力、燃油、冷媒等數據，並上傳佐證資料。
*   **M3: 自動化計算引擎**：即時換算為 tCO2e。
*   **M4: 減碳路徑規劃**：模擬未來減碳情境。

## 4. 數據結構 (Data Schema)
```typescript
interface CarbonRecord {
  id: string;
  scope: '1' | '2' | '3';
  category: string; // e.g., Stationary Combustion
  activityValue: number;
  unit: string;
  factorId: string;
  tco2e: number;
  evidenceId?: string; // Link to EvidenceVault
  status: 'Draft' | 'Verified' | 'Trustworthy';
}
```

## 5. 教學引引導 (Onboarding Steps)
1. **認識範疇**：解釋範疇一、二、三的定義。
2. **數據鏈結**：示範如何將電費單轉化為碳排數據。
3. **5T 驗收**：理解為何單據上傳對報告誠信至關重要。
