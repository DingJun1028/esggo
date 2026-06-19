# Walkthrough: Business Intelligence & Scoping Center (M1-M10)

This walkthrough documents the successful implementation of the **Business
Intelligence & Scoping Center** in ESG GO V1.0. This center functions as a
sovereign-grade reconnaissance hub, transforming raw environmental and
geopolitical data into actionable strategic playbooks.

## 核心亮點 // CORE_HIGHLIGHTS

- **40+ 權威情報源**:
  整合聯合國、智庫、監管機構及全球市場價格端，構建全面的永續情報網。
- **M1-M10 模組化引擎**: 從 M1 訊號雷達到 M10 90 天行動包，實現「訊號 ->
  影響分析 -> 行動交辦」的全鏈路自動化。
- **中東衝突專題研究**:
  以中東地緣政治為案，展示系統如何處理高波動能源市場與供應鏈韌性。
- **高保真動態介面**: 採用 Signal Radar (M1) 與 Impact Matrix (M3)
  動態組件，展現極致專業性。

---

## 實作內容 // IMPLEMENTATION_DETAILS

### 1. 全球情報註冊表 (Source Registry)

已在
[intelligence-sources.ts](file:///c:/Project/esggoV1.0/lib/data/intelligence-sources.ts)
中建立 40 個以上的權威來源：

- **UN/政府間組織**: UN SDGs, UNEP, IEA, World Bank, IMF 等。
- **政策執行端**: EU DG CLIMA (CBAM), U.S. SEC, EPA。
- **市場價格與風險**: EEX (EUA), ICE, Lloyd's, IMO。
- **揭露與標準**: ISSB, CDP, GRI, SBTi, TNFD。

### 2. 智能編排服務 (Intelligence Orchestrator)

[intelligence-orchestrator.ts](file:///c:/Project/esggoV1.0/lib/services/intelligence-orchestrator.ts)
負責處理複雜邏輯：

- **M1 Signal Scrutiny**: 計算訊號的可信度與影響權重。
- **M3 Quantitative Impact**: 將定性訊號轉化為
  Finance、Compliance、Supply、Reputation 四個維度的百分比影響。
- **M10 90-Day Playbook**:
  為「中東衝突」等關鍵信號自動生成包含「盤點庫存」、「對沖合約」、「5T
  存證」在內的具體行動方案。

### 3. 前端視覺化組件

- **Signal Radar (M1)**:
  [signal-radar.tsx](file:///c:/Project/esggoV1.0/components/intelligence/signal-radar.tsx)
  展示動態訊號流。
- **Impact Visualizer (M3)**:
  [impact-visualizer.tsx](file:///c:/Project/esggoV1.0/components/intelligence/impact-visualizer.tsx)
  以四象限矩陣呈現量化影響。
- **Business Intelligence View**:
  [business-intelligence-view.tsx](file:///c:/Project/esggoV1.0/components/views/business-intelligence-view.tsx)
  整合所有模組。

---

## 關鍵流程示範 // SCENARIO_WALKTHROUGH

### 案例：中東衝突能源影響 (ME_CONFLICT_001)

1. **訊號偵測 (M1)**: 系統偵測到能源通路風險 (Confidence: 94%, Impact: High)。
2. **影響量化 (M3)**:
   - 財務影響 (Finance): 65% (油價波動)
   - 供應影響 (Supply): 82% (物流中斷)
3. **行動交辦 (M10)**: 系統產出 **90 天行動方案**：
   - [ ] 盤點中東來源原料庫存 (M6)
   - [ ] 執行能源價格對沖合約之 5T 存證 (M3)
   - [ ] 分散供應鏈至東南亞或拉丁美洲 (M7)
4. **專家建議**: 提出「能源主權」戰略對策。

---

## 驗證狀態 // VERIFICATION

- [x] **40+ URL 註冊**: 已完成。
- [x] **M1-M10 邏輯對接**: 核心編排器已就緒。
- [x] **導航集成**: 側邊欄已加入「商情偵察中心」。
- [x] **UI 一致性**: 符合 Omni Terminal 主權設計標準。

> [!IMPORTANT]
> 本模組已將 ESG GO
> 從純粹的「診斷系統」升級為「主動偵察系統」，為企業提供主權級的戰略預警能力。
