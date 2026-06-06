---
uuid: "099afd4c-5366-4d46-9c44-48d115da04fe"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.441Z"
evidence: "docs\wiki\Profile.md"
---
# 企業管理 [Company Profile]
路徑： /profile | 權限： ADMIN, PM | 所屬旅程： I. 初始導入與配置

1. 模組定位 (Core Purpose)
提供企業核心資訊、ESG 策略目標與組織架構管理，是 ESG GO 系統運作的「誠信起點」，確保所有報告數據具備統一的組織邊界與合規基準。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 需在系統初始化時，精確定義企業的願景、使命與財務基石，避免後續碳盤查與影響力評估時缺乏基準數據。
體驗高光時刻 (Aha Moment)： 當 PM 填寫完「願景與使命」後，系統自動在頁面頂部生成一枚「Onboarding 達成」勳章，並告知該資料已成功連結至全域 5T 誠信鏈，感受到組織數位化的莊嚴感。
操作軌跡：
1. 進入企業管理頁，瀏覽當前組織設定狀態。
2. 編輯基本資料（名稱、產業、總部）。
3. 設定企業願景與使命，作為 ESG 報告的靈魂核心。
4. 輸入關鍵財務指標（營業額、資本額），供 carbon intensity 計算使用。
5. 點擊「儲存設定」，執行全域同步。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
**設計系統： InfoOne v8.1.0 (Light Mode Priority)**
桌面版佈局： 採用「Bento 卡片佈局」，分為基本資料、願景使命、財務概況三大區塊。
視覺風格： 極簡淺色系 (`bg-slate-50`)，卡片採用 `bg-white/80` 搭配柔和陰影。
核心元件： `OmniBaseCard` (用於區塊容器), `OmniInput` (具備 Icon 引導), `OmniBadge` (狀態標示)。
行動端適配 (RWD)： 全表單垂直堆疊，確保在行動端亦能流暢填報。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 使用者輸入資料 -> Zod 驗證 -> Firebase DataConnect (PostgreSQL) 寫入 `company_profiles` 表。
5T 實踐點：
*   [T1 真 Truthful - Traceable]：所有變更皆記錄 `user_email` 與 `timestamp`。
*   [T3 美 Tasteful - Tangible]：透過 Omni 元件的微互動讓設定過程「可感知」。
*   [T4 信 Trustful - Trustworthy]：企業關鍵參數（如資本額）變更將觸發全域 Hash 更新。

5. 功能項目解說和使用技術 (Features & Tech Stack)
企業基本資料： 實作 Zod Schema 驗證，確保資料格式正確。
願景使命編輯： 使用具備動態高度調整的 `textarea`。
財務數據連動： 技術使用 `useUpsertCompanyProfile` 進行原子化更新。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 長文字輸入不可撐破卡片，標籤 (Label) 必須始終對齊。
🚨 邏輯紅線： 必填項目（企業名稱）缺失時，必須阻斷提交並彈出 Toast 報警。

7. 矩陣關聯 (Matrix Connection)
上游數據： 無（此為系統 Root 資料源）。
下游影響： 直接影響 `/dashboard` 的強度計算、`/editor` 的報告封面生成。
依賴組件： `OmniBaseCard`, `OmniInput`, `OmniButton`.
