---
uuid: "402f6854-f83b-41c5-b2d5-3bdbfb33d1ab"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.483Z"
evidence: "docs\wiki\Compliance-Check.md"
---
# 合規檢查 [Compliance Check]
路徑： `/compliance-check` | 權限： `ESG_OFFICER`, `AUDITOR`, `ADMIN` | 所屬旅程： `IV. AI 賦能與撰寫`

---

## 1. 模組定位 (Core Purpose)
作為報告發佈前的「數位守門人」，利用 AI 全盤掃描報告草稿，自動比對國際準則（GRI, ISSB, SASB）與在地法規，精準識別缺漏、語意模糊或數據矛盾，確保報告具備法律級別的合規誠信。

---

## 2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
- **目標對象與痛點**： 永續管理師 (ESG Manager) 在發佈前極度焦慮，擔心報告內容因人為疏忽導致不合規，進而引發「綠洗 (Greenwashing)」風險或主管機關罰款。
- **體驗高光時刻 (Aha Moment)**： 點擊「全盤掃描」後，系統以「液態玻璃」動畫展示 AI 穿梭於千行數據間，並在幾秒內精確標註出：「第 42 頁關於範疇三排放的描述缺少第三方確信證據，建議補件。」
- **操作軌跡**：
    1. 選擇待檢查報告版本。
    2. 設定合規標準（如：GRI 2021 + 台灣證交所規範）。
    3. 執行「5T 誠信掃描」。
    4. 檢視分層報告（嚴重、警告、建議）。
    5. 一鍵追蹤至 `source_origin` 進行修正。

---

## 3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
- **桌面版佈局**： **Fixed Sovereign Bento (三欄佈局)**。
    - 左欄：合規標準選單與掃描進度（Layer 1）。
    - 中欄：報告預覽與 AI 標註熱點（Layer 2 Hologram）。
    - 右欄：診斷詳情與修正建議卡片（Layer 1 Glass）。
- **核心液態玻璃元件**：
    - `IntegrityPulse`：動態脈衝效果，顯示掃描進行中。
    - `ComplianceHeatmap`：半透明覆蓋層，以紅/黃/綠色塊標註報告合規密集度。
- **行動端適配**： 收合為底部 Sheet，點擊標註點後向上展開診斷卡片。

---

## 4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
- **資料流向**： 讀取 `SustainWrite` 編輯器草稿 -> 調用 `AI-Platform` (Gemini 2.0 Pro) -> 比對 `Library` 法律資料庫 -> 寫入 `ncbdb.compliance_records`。
- **5T 實踐點**：
    - **真 (Traceable)**：每一條合規建議必須鏈接至 `Library` 中的原始法規條文編號。
    - **善 (Transparent)**：開放 AI 推理鏈 (Chain-of-Thought) 查看，解釋為何判定為不合規。
    - **美 (Tangible)**：診斷結果以「全息投影」視覺化展示，非純文字表格。
    - **信 (Trustworthy)**：檢查結果通過 `Hash Lock` 存儲，不可人為抹除「嚴重違規」紀錄。
    - **通 (Trackable)**：修正行為會觸發 Hook，同步更新 `Dashboard` 的合規達成率。

---

## 5. 功能項目解說和使用技術 (Features & Tech Stack)
- **AI 診斷引擎**： 使用 `Genkit` + `Gemini 2.1 Flash` 進行快速語意比對。
- **法規向量索引**： 透過 `Supabase Vector` (pgvector) 對全球 ESG 準則進行 RAG 檢索。
- **即時通知**： 使用 `Supabase Realtime` 同步掃描進度。

---

## 6. 品質達標與驗收紅線 (QA Red Lines)
- 🚨 **UI 跑版紅線**： 掃描標註點在縮放螢幕時必須精準錨定於文字上方，位移超過 2px 即判定為跑版。
- 🚨 **邏輯體驗紅線**： 嚴禁產生「法規幻覺」；若 AI 引用了不存在的條文，系統必須攔截並標記為「待專家介入」。

---

## 7. 矩陣關聯與上游依賴 (Matrix Mapping)
- **上游數據 (Upstream)**：
    - `SustainWrite` (/editor)：提供報告文本內容。
    - `Library` (/library)：提供最新合規準則與法律條文。
- **下游影響 (Downstream)**：
    - `Dashboard` (/dashboard)：更新「企業合規風險指標」。
    - `Vault` (/vault)：合規證明文件歸檔至證據金庫。

---
© 2026 ESGGO 善向永續 | **Visionary Design by JunAiKey**
