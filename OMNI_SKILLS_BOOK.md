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

## 🧠 第十二章｜名詞定義 (Chapter 12 | Term Definitions)

為確保全系統開發、多端整合與代理蜂群 (Swarm) 的語意絕對一致，以下確立 15 類核心「名詞與技能」標準規範定義：

### 📌 01. 源起鎖定 (Origin Locking)
*   **說明**: 固定來源、版本、時間與上下文，確保全流程可回溯。
*   **5T 實踐**: 保障 [T2 Traceable] 的核心機制，數據從採集起點即被錨定。

### 📌 02. 技能原點 (Skill Origin)
*   **說明**: 從原始內容中提煉出的核心能力起點。
*   **5T 實踐**: 表示技能在未被任何技術債或架構冗餘污染前的最純淨原始定義。

### 📌 03. 意圖解構 (Intent Deconstruction)
*   **說明**: 將雜亂輸入拆解為結構化意圖與風險標記。
*   **5T 實踐**: 自動過濾噪點，提供 [T1 Tangible] 的特徵解構與風險評估。

### 📌 04. 技能萃取 (Skill Extraction)
*   **說明**: 從文本中抽出可重用、可執行的原子技能點。
*   **5T 實踐**: 將非結構化的專業操作流程或法規轉譯為標準的代碼工具。

### 📌 05. 策略編排 (Strategy Orchestration)
*   **說明**: 將意圖轉換為任務樹、優先級與路由方案。
*   **5T 實踐**: 安排執行拓撲，以最低熵、高內聚、低耦合的方式進行調度。

### 📌 06. 跨域執行 (Cross-Domain Execution)
*   **說明**: 整合 API、腳本、自動化流程與多端同步落地。
*   **5T 實踐**: 實現跨前端 (React)、後端 (Express) 與混合雲等多維空間的雙向落地執行。

### 📌 07. 結果回饋 (Result Feedback)
*   **說明**: 將成果、異常與效率指標回寫成優化依據。
*   **5T 實踐**: 把每一輪的產出偏差實時反饋給自愈引擎，優化下一代模型。

### 📌 08. 知識沉澱 (Knowledge Precipitation)
*   **說明**: 將執行結果轉為知識庫、PromptLog 與迭代策略。
*   **5T 實踐**: 保存每次決策脈絡為長期語意記憶，為未來任務提供零知識快速召回。

### 📌 09. 標籤路由 (Tag Routing)
*   **說明**: 依內容屬性將技能點分派到對應模組。
*   **5T 實踐**: 依託 MECE 標籤對接，直接導向特定領域專家 Agent，實現高效路由。

### 📌 10. 羽翼群組 (Wing Group)
*   **說明**: 負責自我導航、任務分派與跨平台執行的代理群。
*   **5T 實踐**: 系統多智能體蜂群（Swarm）代稱，具備自主尋路與自我糾偏能力。

### 📌 11. 神聖契約 (Sacred Contract)
*   **說明**: 負責 API、狀態機與執行協議的核心規範層。
*   **5T 實踐**: 體現 [T5 Trustworthy] 精神，全端 API 共享並受 TypeScript 靜態保護。

### 📌 12. 記憶聖所 (Memory Sanctuary)
*   **說明**: 保存知識庫、版本、上下文與可追溯紀錄的記憶模組。
*   **5T 實踐**: 系統的長期語意/情節/情境智庫，防止代理在執行中產生「意圖漂移」。

### 📌 13. 原罪煉金 (Original Sin Alchemy)
*   **說明**: 對架構進行純化、熵減與冗餘移除的優化機制。
*   **5T 實踐**: 系統自我進化與「全域痊癒」的主動優化程式，專門提純數據、降低代碼熵值。

### 📌 14. 靈魂徽章 (Soul Badge)
*   **說明**: 管理權限、隱私、合規與不可篡改鎖定的安全機制。
*   **5T 實踐**: 負責對敏感或主權數據提供哈希鎖與安全 RLS (行級安全) 機制保障。

### 📌 15. 最優路徑 (Optimal Path)
*   **說明**: 在所有關聯中找出最自然、最完整的整合路徑。
*   **5T 實踐**: 自動分析依賴，計算出最簡潔、耗能最少、無冗餘的跨模組整合路徑。

---
*此文檔為動態演進的活紀錄檔，由 OmniAgent 持續更新。*
