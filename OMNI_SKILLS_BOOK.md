---
uuid: "91d04573-36d7-4922-ae3f-0f63179d1fcb"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.314Z"
evidence: "OMNI_SKILLS_BOOK.md"
---
# 奧義技能全書 (Omni Skills Book)
## 萬能元件庫 (Omni Atomic Component Library) - UI/UX 品牌設計指南

本文件為 **萬能元件庫 (Omni Atomic Component Library)** 的官方設計指南，引導前端開發與 UI/UX 設計遵循系統最高指導原則，確保每一行代碼皆符合「善向永續」的宗旨。

---

## 📜 核心設計哲學

### 1. Liquid Glass (液態玻璃)
系統 UI 遵循 **Liquid Glass** 哲學，將生硬的數據轉化為可感知的流動藝術。透過半透明的玻璃擬物化 (Glassmorphism)、柔和的陰影層次以及平滑的動畫過渡，營造出既具備現代科技感又不失溫度的介面體驗。

### 2. 參照原則 (Reference Principle)
「參照原則」是萬能原子庫的基石，確保每一 UI 組件不再是孤立的視覺元素，而是誠信協議中的一個活躍節點。每一原子組件皆具備誠信鏈接與意圖宣告，確保其行為可被追溯與審計。

---

## 🎨 品牌視覺代幣 (Brand Tokens)

系統核心色彩基於 Berkeley 學院風格：

*   **Primary Color:** `#003262` (Berkeley Blue) - 象徵沉穩、專業與深度信任，為系統的主色調。
*   **Accent Color:** `#FDB515` (California Gold) - 象徵活力、創新與警示，用於強調重要元素與狀態。

---

## ⚛️ 原子級元件 (Atoms)

以下為 `lib/design-system/` 中已實現之核心原子元件：

### 1. `AtomicBadge` (狀態徽章)
*   **功能**: Omni Status Indicator (通用狀態指示器)。
*   **特性**: 支援多種色調 (`neutral`, `info`, `success`, `warning`, `danger`, `accent`) 與尺寸 (`xs`, `sm`, `md`)，並具備可選的 `pulse` 動態效果，常用於標示 5T 協議狀態。

### 2. `AtomicButton` (操作按鈕)
*   **功能**: Omni Atomic Component (通用操作按鈕)。
*   **特性**: 支援三種變體 (`primary`, `secondary`, `ghost`) 與尺寸 (`s`, `m`, `l`)，並整合了 `atomicManager` 實踐參照原則，確保每次點擊行為的意圖可被記錄。

### 3. `AtomicCard` (資料卡片)
*   **功能**: Omni Bento Container (通用便當盒容器)。
*   **特性**: 結合 Liquid Glass 與 Bento Grid 佈局概念。提供 `hoverEffect` (`lift`, `glow`, `none`) 與 `glassIntensity` (`light`, `medium`, `heavy`) 設定，是構築數據看板的基礎容器。

### 4. `AtomicInput` (輸入欄位)
*   **功能**: Omni Atomic Component (通用輸入框)。
*   **特性**: 具備標籤 (`label`) 與錯誤提示 (`error`) 功能，同樣整合 `atomicManager` 實踐參照原則，確保數據輸入的來源可被追溯。

---
*此文檔為動態演進的活紀錄檔，由 OmniAgent 持續更新。*
