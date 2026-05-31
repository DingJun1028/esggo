# ESG GO 功能頁面 Wiki 撰寫規範 (SaaS 交付與體驗導向) [Wiki Guidelines]

為了確保系統迭代過程中「體驗不降級」、「技術不脫鉤」且「UI 不跑版」，本 Wiki 的每一個子功能頁面，都必須嚴格遵守以下 6 大撰寫結構。
這份文件是產品經理、UI/UX 設計師與前後端工程師的 唯一共識標準 (Single Source of Truth)。

📋 萬用撰寫結構模板 (Template)

[頁面名稱] [英文名稱]
路徑： /path | 權限： [角色] | 所屬旅程： [羅馬數字. 名稱]

1. 模組定位 (Core Purpose)
一句話定義此頁面的商業價值與系統功能。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： [誰] 在 [什麼情況下] 遇到 [什麼困難]。
體驗高光時刻 (Aha Moment)： 讓使用者感到「哇！原來這麼簡單、這麼安心」的瞬間。
操作軌跡： 帶有情境目的之操作步驟 (1, 2, 3...)。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： (例如：左右雙欄、12 欄 Bento Grid)
核心液態玻璃元件： (列出此頁面使用到的特殊原子/分子 UI 元件)
行動端適配 (RWD)： (例如：表格轉卡片、側邊欄收合成底部 Tab)

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： (從哪裡撈資料，存入哪個資料表，是否影響 Dashboard KPI)
5T 實踐點： (詳細說明 T1~T5 在此頁面是如何落實的)

5. 功能項目解說和使用技術 (Features & Tech Stack)
子功能 A： 說明行為 + 使用的具體前端/後端技術或套件 (如：React Hook Form, Supabase Realtime)。
子功能 B： 說明行為 + 使用的技術 (如：D3.js, Web Crypto API)。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： (例如：文字溢出、按鈕被遮擋、Z-index 錯誤)
🚨 邏輯體驗紅線： (例如：斷網未妥善處理、幻覺產生未攔截)

7. 矩陣關聯 (Matrix Connection)
上游數據： (此頁面依賴哪些上游模組或 API 數據源)
下游影響： (此頁面產出的數據或行為會影響哪些下游模組或 Dashboard KPI)
依賴組件： (列出此頁面 Import 的核心原子組件，如 BrandButton, UniversalCard)

