---
uuid: "44885294-a3b7-4bc3-aab5-595db9cd5fa8"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.503Z"
evidence: "docs\specs\UIUX-Governance-And-Component-API-v1.0.md"
---
# ESG GO UIUX 防崩壞治理與元件 API 規格書 (Consolidated v1.0)

本文件整合了以下五份核心防崩壞與設計治理規範，為 ESG GO 系統提供最高標準的 UIUX 與 Frontend 架構指導：
1. **ESG GO 平台品牌風格元素規格書 v1.0**
2. **ESG GO UIUX 防崩壞治理規範 v1.0**
3. **ESG GO 頁面模板與元件驗收清單 v1.0**
4. **ESG GO Design Token 規格表 v1.0**
5. **ESG GO UI Component API 規格書 v1.0**

## 核心設計哲學
* **Liquid Glass** (液態玻璃)
* **Bento Grid** (便當盒網格)
* **Berkeley Academic Precision** (柏克萊學術精準)
* 核心協議：**5T Integrity Protocol** (Tangible, Traceable, Trackable, Transparent, Trustworthy)

## 1. 視覺與 Token 架構 (Design Tokens)
所有 UI 必須透過 Design Tokens 構建，嚴禁頁面層級硬編碼顏色、間距、尺寸。
* **色彩系統 (Berkeley Academic)**:
  * Primary: `#003262` (Berkeley Blue)
  * Accent: `#FDB515` (California Gold)
  * Secondary: `#3B7EA1` (Founders Rock)
* **5T 語義色**:
  * T1 (Tangible): `#10B981` (Green)
  * T2 (Traceable): `#3B7EA1` (Blue)
  * T3 (Trackable): `#8B5CF6` (Purple)
  * T4 (Transparent): `#F59E0B` (Amber)
  * T5 (Trustworthy): `#003262` (Dark Blue)
* **排版 (Typography)**: Inter (Heading), Noto Sans TC (Body), JetBrains Mono (Data/Hash). 嚴格遵守 Type Scale，限制字級數量。
* **間距 (Spacing)**: 8px 基準網格系統 (4, 8, 12, 16, 24, 32, 48, 64px)。

## 2. 頁面模板治理 (Page Templates)
所有頁面必須套用以下標準模板之一，不可自由拼接：
1. **Dashboard 模板**: 總覽、指標、警示、快捷入口。(5秒內理解狀態)
2. **List 模板**: 清單、篩選、搜尋、分頁。(表格欄位依任務優先級排序)
3. **Detail 模板**: 單筆資料詳情、狀態標籤、證據/附件區塊固定。(狀態必須明顯)
4. **Form 模板**: 建立/編輯表單、區塊分段、驗證提示。(必填明確、錯誤即時回饋)
5. **Report 模板**: 報表、長文、匯出分享。(結構穩定、圖表含解釋)

## 3. UI Component API 規格
元件必須具備一致的 Props API，優先表達語意，不暴露自由 styling props。
* **Base Components**: Button, Input, Textarea, Select, Checkbox, Radio, Badge, Alert, Toast, Modal, Tabs, Card, Table, EmptyState, Skeleton, Tooltip.
  * *例如 Button*: `variant` 僅限 `primary`, `secondary`, `danger`, `ghost`. 不可自訂顏色。
* **Composite Components**: StatusBadge (統一狀態顯示), SearchFilterBar, AuditTimeline, EvidenceList, MetricCard, SectionHeader, FormSection.
  * *例如 StatusBadge*: `status` 必須來自 shared-types，統一映射語意。

## 4. UIUX 防崩壞與驗收標準
* **狀態完整性**: 元件必須定義 default, hover, focus, disabled, loading, error, empty 狀態。
* **觸控與無障礙 (WCAG AA)**: 觸控目標 ≥ 44px，對比度合規，支援鍵盤導航與 ARIA 標籤。
* **禁止上線條件**:
  * 沒有 loading / error / empty 狀態處理。
  * 主 CTA 不明確或發生衝突。
  * 同語意元件在不同模組使用不同樣式 (如：不同綠色表示完成)。
  * 危險操作沒有二次確認保護。
  * 前端代碼出現大量 style 覆寫 (硬編碼)。

## 5. 全端雙向 TypeScript 落地
設計系統必須與 TypeScript 型別深度綁定，透過 Monorepo 架構下的 `@esg-go/shared-types` 與 `@esg-go/ui` 實現：
* 元件 props 必須接受 enum / union type。
* 狀態標籤 (如 `RecordLifecycleStatus`) 前後端共用。
* API 回傳的狀態字串直接驅動 StatusBadge，不允許前端自行判斷顏色。
