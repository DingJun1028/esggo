# InfoOne v8.1.0 淺色系 UI 元件庫與編輯器完整設計實作計畫

本計畫旨在將您提供的「InfoOne v8.1.0 - UI 元件庫設計規範」完整實作至目前的系統中，並著重於「淺色系」與「液態玻璃 (Liquid Glass)」的視覺效果，最後將其應用於 Editor 頁面以達成完整設計。

## User Review Required

> [!IMPORTANT]
> - 本次更動將會取代部分舊有的設計 Token 與 `Brand` 前綴元件，全面導入新的 `ui` 元件 (`Button`, `Card`, `Input`, `Badge`)。
> - `app/editor/page.tsx` 將會經歷大幅度的視覺重構，以符合液態玻璃風格與極簡主義的淺色系排版。
> - 現有的 `components/brand` 內的某些特殊元件 (如 `BrandTabs`, `BrandT5Strip` 等) 我們將會以新的設計系統 Token 進行樣式覆蓋，以保持整體風格一致。

## Open Questions

> [!NOTE]
> 1. 您提供的設計規範中有提到 Storybook 設定，目前我們是否需要一併初始化 Storybook 環境？還是先專注於專案內元件與 Editor 的實作即可？(本計畫目前先專注於實作功能元件與頁面)
> 2. `editor/page.tsx` 中目前使用了許多 `Brand*` 元件，我會將可以替換的替換為新的 `ui/*` 元件，其餘則更新其 class 樣式。這樣是否符合您的期望？

## Proposed Changes

---

### Tailwind CSS 設定更新

#### [MODIFY] `tailwind.config.ts`
- 將原本的設定擴充，加入 `InfoOne v8.1.0` 規範中的色彩系統 (primary, glass, status colors)。
- 加入對應的 `backdropBlur`, `spacing` (card, section, page), `borderRadius` (card, button, input) 等設計 Token。

---

### 基礎設施與核心設定

#### [NEW] `lib/utils.ts`
- 建立 `cn` 工具函數，整合 `clsx` 與 `tailwind-merge` 以方便管理 Tailwind class 組合。

#### [NEW] `lib/animations.ts`
- 建立 Framer Motion 的預設動畫變體 (`fadeIn`, `slideIn`, `scaleIn`, `staggerContainer`)，用於液態玻璃介面的轉場動畫。

---

### InfoOne 核心 UI 元件庫建立

#### [NEW] `components/ui/Button.tsx`
- 實作具備 primary, secondary (glass), ghost, danger 變體與載入狀態的按鈕元件。

#### [NEW] `components/ui/Card.tsx`
- 實作具備液態玻璃風格 (`bg-glass`, `backdrop-blur`)、hover 動態與發光效果 (glow) 的卡片元件。

#### [NEW] `components/ui/Input.tsx`
- 實作支援 Icon、錯誤狀態與毛玻璃背景的輸入框元件。

#### [NEW] `components/ui/Badge.tsx`
- 實作對應 5T 狀態與審核狀態 (verified, draft, warning, error) 的標籤元件。

---

### Editor 頁面重構 (淺色系優先 + 完整設計)

#### [MODIFY] `app/editor/page.tsx`
- **佈局重構**：全面套用淺色系背景 (`bg-slate-50/bg-white`)。
- **導覽列與 Header**：套用毛玻璃效果 (`backdrop-blur-xl`, `bg-white/80`)，並將按鈕替換為新的 `Button`。
- **內容撰寫區**：使用 `Card` 包裝 AI 助理與編輯區域，套用 Framer Motion 的 `fadeIn` 與 `staggerContainer` 讓介面更具生命力。
- **數據對齊區**：將原本的 `BrandCard` 替換為新的 `Card`，輸入框替換為 `Input`，並增添 hover 動態效果。

## Verification Plan

### Manual Verification
1. 進入 `/editor` 頁面，確認整體視覺是否呈現極簡淺色系與液態玻璃質感。
2. 檢查各個區塊 (寫作區、數據區) 的轉場動畫是否順暢 (Framer Motion)。
3. 確認 AI 掃描、封印按鈕等操作的載入狀態 (Loading states) 是否正確顯示新的 `Button` 樣式。
4. 確認所有排版與間距是否符合設計 Token 規範 (`p-card`, `rounded-card` 等)。
