# OMNI ESG 萬能永續報告書 - 開發與架構對照書

**版本**: v1.0.0-Universe **建立日期**: 2026-02-28 **設計哲理**:
基於「英碼繁博」準則與 Liquid Glass 4D 動態玻璃質感 UI，對齊 NCB 遠端資料庫與
9式果因引擎。

---

## 📖 核心設計理念 (Core Design Philosophy)

『萬能永續報告書』 (Omni ESG Reports)
不僅僅是靜態的文件，它是活生生的數據載體。我們將 200+
種報告的生成、管理與展示封裝為高內聚、低耦合的 `LiquidGlassContainer` 模組群。

1. **Stitch 模組化 (Stitch Modularization)**：每一份報告對應獨立的 UUID (參見
   `OMNI_UUID_MAPPING.md`) 與前端組件。UI 結構直接對位 Google Stitch `.pen` 原型庫，確保「所見即所得」(WYSIWYG) 且與 Stitch MCP 雙向綁定。
2. **動態渲染與 Stitch 同步 (Dynamic Rendering)**：基於 JSON Schema
   自動生成表單與唯讀展示頁面，結合 Stitch 導出的 Tailwind Token，支援多語系切換 (ko-KR, zh-TW, en-US)。
3. **雲端同源 (Cloud Native Source)**：統一透過 NCB (NoCodeBackend)
   進行資料持久化、狀態追蹤 (Draft/Active/Archived) 與權限控制。
4. **驗證與強固 (Validation & Robustness)**：寫入數據前皆須通過 Omni 9式果因引擎
   (Jules-Karma-Engine) 進行 Schema 檢核與防呆。

---

## � Google Stitch MCP 綁定與美學三大預設版面 (UI/UX Aesthetics & Layouts)

為了處理 200 種報告的視覺多樣性需求，並維持極高的品牌視覺標準，我們將 UI/UX 設計全權交由 **Google Stitch** 進行統一控管。系統預設提煉出 **3 種標準版面 (Preset Layouts)**，所有報告的元件生成皆必須對齊這三大框架：

### 1. Liquid Glass 矩陣版面 (Matrix Grid)
*   **適用場景**：報告中心首頁、總覽儀表板 (Dashboard)、指標彙整。
*   **視覺特徵**：由多個大小不一的 Widget 卡片構成 (Bento Box 風格)。背景採用極深邃的宇宙黑色 (`#050510`)，搭配多層次毛玻璃 (`backdrop-blur-2xl`)、微發光的 1px 半透明邊框 (`border border-white/10`)，以及當滑鼠懸停時如霓虹般的液態光暈。
*   **Stitch Tokens**：`surface-glass-primary`, `border-glass-glow`, `shadow-neon-hover`。

### 2. Zenith 閱讀者版面 (Focused Reader)
*   **適用場景**：長文閱讀、法規條文瀏覽、政策白皮書 (如 GRI 準則條文、ESG 政策宣告)。
*   **視覺特徵**：以內容為主體的單欄或極簡雙欄設計。背景轉為寧靜的深灰藍 (`#0A0F1C`)。排版使用大量的留白 (Negative Space)，並將動態效果降至最低，專注於字體的清晰度 (支援無級距縮放) 與對比度。捲動時具有平滑的水波紋進度條。
*   **Stitch Tokens**：`surface-reading-base`, `text-zenith-primary`, `scrollbar-liquid`。

### 3. Forge 鷹架版面 (Interactive Forge)
*   **適用場景**：表單填寫、數據輸入器 (`DynamicFormEngine`)、資料查核修正區。
*   **視覺特徵**：強調「操作回饋」。採用分離式雙欄 (左側導航與狀態樹，右側為動態表單區)。每個輸入框具備「液態浮動標籤 (Liquid Floating Labels)」。當資料輸入正確時，會有微小的粒子光效回饋；輸入錯誤時，則觸發帶有科技感的琥珀色警告線界。
*   **Stitch Tokens**：`input-glass-base`, `focus-glow-success`, `focus-glow-karma`。

---

## �🏛 系統架構映射 (System Architecture Mapping)

### 目錄結構與路由 (Directory & Routing)

所有的報告模組皆遵循以下結構部署於 Next.js App Router：

```text
src/
├── app/omni/reports/                  # 報告中心主入口 (SRC)
│   ├── page.tsx                       # 200 份報告的總覽樞紐與搜尋介面
│   ├── [reportId]/                    # 動態路由，支援 200+ 種報告
│   │   ├── page.tsx                   # 報告詳細檢視頁
│   │   ├── edit/page.tsx              # 報告編輯/生成器
│   │   └── _components/               # 專屬該報告的特製微型組件
├── components/omni/
│   ├── liquid-glass/                  # 核心視覺層
│   │   ├── LiquidGlassContainer.tsx   # 報告容器
│   │   ├── ReportsGrid.tsx            # 報告展示網格
│   │   └── ReportCard.tsx             # 單一報告入口卡片
│   └── report-forge/                  # 報告生成引擎組件
│       ├── DynamicFormEngine.tsx      # JSON Schema 表單渲染器
│       ├── AIReviewAssistant.tsx      # Dr. Thoth 報告草稿 AI 審閱器
│       └── EvidenceUploader.tsx       # 證據庫憑證上傳器
└── core/                              # 業務邏輯與介接層
    ├── ncb/                           # NCB 資料庫對接
    │   └── report-client.ts           # CRUD 操作
    ├── dtos/                          # 資料傳輸物件
    │   └── report-schema.dto.ts       # 統一格式與 Zod 驗證
    └── utils/
        └── jules-validator.ts         # 果因引擎除錯與校驗
```

---

## ⚡️ 數據流與 NCB 介接 (Data Flow & NCB Integration)

報告狀態機會經歷以下流轉： `Draft (草稿)` -> `Pending Review (待審閱)` ->
`Approved (已核准)` -> `Published (已發布)`

### 核心資料表 (NCB Tables)

1. **`omni_reports_metadata`**: 儲存報告基本資訊 (UUID, 名稱, 狀態, 擁有者,
   建立時間)。
2. **`omni_reports_content`**: 儲存報告本體的 JSON 結構資料 (與模版 Schema
   對應)。
3. **`omni_evidence_vault`**: 儲存佐證資料的 S3/R2 URL 與 SHA-256 簽章。

### API 介面規劃 (API Specifications)

| 動作 (Action)   | API 路由範例 (Next.js Server Actions) | 描述                                         |
| :-------------- | :------------------------------------ | :------------------------------------------- |
| **Fetch All**   | `getAllReports(filter, pagination)`   | 取得各分類下的報告列表 (支援首頁總覽)        |
| **Fetch One**   | `getReportById(reportId)`             | 根據 UUID 提取特定報告的完整內容與 Schema    |
| **Create/Save** | `saveReportDraft(payload)`            | 處發草稿自動儲存機制，呼叫 `jules-validator` |
| **Publish**     | `publishReport(reportId)`             | 通過驗證後，上鏈或封裝 PDF/HTML 版本         |

---

## 🧩 報告生成引擎 (Report Forge) 運作機制

為了解決 200+ 份不同規格報告的開發負擔，我們不採用 Hard-code 每一頁，而是採用
**Schema-Driven UI (資料驅動介面)**。

1. **定義 Schema (Definition)**: 每一份報告在資料庫中都有一份對應的 JSON Schema
   定義其欄位 (環境數據、社會數據、選擇題、文字方塊)。
2. **表單引擎 (Form Engine)**: `DynamicFormEngine.tsx` 讀取
   Schema，自動渲染出具備 Liquid Glass 風格的輸入介面。
3. **驗算 (Calculation)**: 結合 `StandardCalculator`
   (mod-env-calc-0001)，當使用者輸入能耗或排放數據，前端自動帶出碳足跡結果，預覽區即時更新。
4. **零幻覺審閱 (Zero-Hallucination Review)**: 在提交流程前，藉由 AI
   模型與歷史證據庫比對，若出現數據斷層 (如用水量暴漲 500%)，立刻以黃色警告觸發
   Jules 協定。

---

## 🎨 UI 視覺與前端實作規範

- **深空底色 (Deep Space Background)**: 作為背板，襯托玻璃質感。
- **Liquid Glass 屬性 (由 Stitch 統一管理)**:
  - `backdrop-blur-xl`: 強烈毛玻璃效果。
  - `bg-white/5` 到 `bg-white/10` 的漸層：作為卡片底色。
  - `border border-white/10`: 勾勒出清脆的玻璃邊緣。
  - `hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]`: 懸浮時的霓虹光暈。
- **資料可視化**: 報告內的圖表統一採用懸浮 3D 質感，顏色採用各主題專屬漸層
  (水資源採幽藍，碳排放採橘紅警告或綠色達標)。
- **組件映射 (Component Mapping)**: 所有 UI 元件都建議透過 `data-stitch-id` 屬性與 Stitch 上的 ID 進行強綁定，以便後續設計更新能無縫熱切換。

---

## 🚀 階段性實作目標 (Milestones)

- [ ] **Phase 1 (骨架與核心)**: 完成主頁 Dashboard，建立 `ReportsGrid` 與 4
      種基準報告 (碳足跡、GRI、人力結構、董事會效能) 的 Schema。
- [ ] **Phase 2 (NCB 串聯)**: 實現 `DynamicFormEngine` 與 NCB 的雙向綁定
      (讀取與自動儲存)。
- [ ] **Phase 3 (生成與匯出)**: 實作 Report Forge，支援單鍵產出符合標準的查驗級
      PDF / HTML 報告。
- [ ] **Phase 4 (生態擴充)**: 擴增至覆蓋 200 種所有標準，導入 Dr. Thoth (AI)
      審查。

---

_此對照書作為 Omni ESG 開發團隊的核心指南，並應隨時與 `OMNI_UUID_MAPPING.md`
同步更新。_
