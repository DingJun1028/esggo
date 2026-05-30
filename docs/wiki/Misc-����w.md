[品牌原子元件庫] [Brand Atomic Component Library]
路徑： /design-system/components | 權限： UI/UX Designer, Frontend Engineer, PM | 所屬旅程： VI. 系統基礎建設與設計治理

1. 模組定位 (Core Purpose)
本頁面作為 ESG GO 系統所有可重用 UI 元件的唯一真實來源 (Single Source of Truth)，旨在確保視覺一致性、加速開發流程，並將 5T 誠信協議深度嵌入每個用戶互動中，以維護平台學術精準度與治理可信感。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： UI/UX 設計師、前端工程師、產品經理。設計師在設計新功能時，需要確保設計稿與開發實作一致；工程師在開發或維護頁面時，常因缺乏統一規範而重複造輪子或面臨 UI 跑版問題；PM 則需要快速理解系統的視覺語言與交互邏輯。
體驗高光時刻 (Aha Moment)： 當工程師在開發新功能時，發現所有需要的 UI 元素都已在元件庫中定義好，並且附帶清晰的用法範例和代碼片段，只需複製貼上即可實現符合品牌規範的 UI，瞬間感受到「開發效率倍增，再也不用擔心 UI 跑版」的安心感。
操作軌跡：
1.  設計師在 Figma 中設計新頁面時，直接從 ESG GO Design System Library 拖曳預定義的元件，確保設計與開發同步。
2.  前端工程師在實作新功能時，瀏覽此 Wiki 頁面，找到對應的元件，查看其 Props、State 與使用範例。
3.  工程師將元件導入專案，並根據業務邏輯配置其屬性，快速組裝頁面。
4.  PM 在審閱新功能時，能一眼辨識出元件是否符合品牌規範，確保一致的用戶體驗與品牌形象。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側導航樹 (Component Categories) + 右側內容展示區 (Component Showcase)」的雙欄佈局。內容展示區為響應式網格，每個元件獨立卡片展示，包含元件預覽、屬性表、使用範例與代碼片段。
核心液態玻璃元件： 此元件庫本身即是 ESG GO 系統的「原子、分子、生物級」元件的集合。其設計哲學為 Liquid Glass (液態玻璃擬態)，強調輕盈、通透、現代感，並透過微交互傳達數據的流動性與可信度。
行動端適配 (RWD)： < 768px 時，左側導航樹自動收合為頂部「漢堡選單」。右側內容展示區的元件卡片自動調整為單欄堆疊佈局，確保在小螢幕上仍能清晰閱讀元件說明與代碼範例。元件預覽圖會自動縮放以適應螢幕寬度。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 元件本身不直接處理業務資料流，而是作為資料的「呈現層」與「交互層」。它們接收來自上層應用邏輯的 Props (資料與回調函數)，並透過事件觸發將用戶交互回傳。與 5T 相關的元件（如 BrandStatusDot, BrandT5Strip, VaultOmniTable）會接收特定的 5T 狀態數據作為 Props，並根據這些數據進行視覺化呈現。
5T 實踐點：
*   **[T1 Tangible 具體]**：BrandStatusDot 將抽象的 5T 協議狀態具體化為可視的顏色與圖標。BrandKpiCard 將複雜的計算公式與數據來源清晰呈現。
*   **[T2 Traceable 追溯]**：BrandBadge 標示 GRI/ISO 標準，提供可追溯的規範依據。VaultOmniTable 整合 SHA-256 驗算，確保文件來源可追溯。
*   **[T3 Trackable 追蹤]**：BrandT5Strip 以進度條形式追蹤單筆數據的 5T 完整度。BrandButton 的「5T 封印動畫」暗示操作的不可逆與可追蹤性。
*   **[T4 Transparent 透明]**：BrandKpiCard 明確揭示數據來源與計算公式，提升透明度。HermesFloatingAgent 的 AI 互動會標示其知識來源。
*   **[T5 Trustworthy 信任]**：VaultOmniTable 透過 ZKP 標識與 SHA-256 驗算，從底層確保數據與文件的不可篡改性與可信度。BrandButton 的封印動畫也強化了操作的信任感。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **原子級元件 (Atoms):**
    *   **BrandStatusDot:** 用於顯示 5T 協議狀態（T1-T5）。行為：根據傳入的 `status` prop (e.g., 'T1_complete', 'T2_pending') 渲染不同顏色與 Tooltip。技術：React Functional Component, Tailwind CSS for styling, Headless UI (Popover) for Tooltip。
    *   **BrandBadge:** 標準化 GRI 指標與 ISO 標準標籤。行為：接收 `label` 與 `type` prop，渲染對應的標籤樣式。技術：React Functional Component, CSS Modules。
    *   **BrandButton:** 具備 5T 封印動畫效果的高級操作按鈕。行為：點擊時觸發動畫，並在動畫結束後執行 `onClick` 回調。技術：React Functional Component, Framer Motion for animation, Styled Components for dynamic styling。
    *   **BrandAvatar:** 顯示 AI 代理（SPIRIT Personas）的身份識別。行為：接收 `personaId` 或 `imageUrl` prop，顯示對應的頭像。技術：React Functional Component, Next/Image for optimized image loading。
*   **分子級元件 (Molecules):**
    *   **BrandKpiCard:** 整合計算公式、數據來源與 5T 狀態的關鍵指標卡片。行為：展示 KPI 數值、趨勢圖、數據來源連結與 BrandStatusDot。技術：React Functional Component, Recharts for mini-charts, Context API for data fetching status。
    *   **BrandT5Strip:** 橫向顯示單筆數據之 5T 完整度進度條。行為：接收 `t5Progress` prop (e.g., {T1: true, T2: false, ...})，渲染進度條與各 T 狀態的 BrandStatusDot。技術：React Functional Component, CSS Flexbox, Lodash for progress calculation。
    *   **BrandSearchBar:** 具備 GRI 自動補全與智慧過濾功能的搜尋欄。行為：用戶輸入時提供即時搜尋建議，並可根據預設篩選條件過濾結果。技術：React Hook Form, TanStack Query for debounced API calls, Algolia or custom fuzzy search algorithm。
*   **生物級元件 (Organisms):**
    *   **VaultOmniTable:** 萬能聖碑記錄表格，整合即時 SHA-256 驗算與 ZKP 標識。行為：展示文件列表，支持排序、篩選，並在每行顯示文件的 SHA-256 Hash 與 ZKP 狀態。技術：TanStack Table, Web Crypto API (for client-side hash display), Supabase Realtime for status updates。
    *   **HermesFloatingAgent:** 全域懸浮 AI 助手，支援語音與視覺掃描輸入。行為：懸浮於頁面右下角，點擊展開對話框，支持文字、語音輸入與圖片上傳進行 AI 互動。技術：React Portal, Web Speech API, WebRTC (for camera input), Genkit/Gemini API for AI backend。
    *   **StandardPage:** 預設的 12 欄 Bento Grid 佈局頁面框架。行為：提供統一的頁面結構，包含 Header, Sidebar, Main Content Area，並基於 12 欄網格系統進行佈局。技術：React Layout Component, Tailwind CSS Grid System, CSS Variables for theme management。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線：
*   所有元件在不同斷點 (Desktop, Tablet, Mobile) 下，其內部文字、圖標、按鈕必須保持正確的間距與對齊，不可出現文字溢出、重疊或元件被截斷的情況。
*   BrandButton 的 5T 封印動畫必須流暢，不可出現卡頓或動畫跳幀，且在動畫過程中按鈕狀態必須正確鎖定。
*   VaultOmniTable 在數據量大時，表格滾動條必須正常出現，且表頭固定，不可出現內容與表頭錯位或表格撐破容器的情況。
🚨 邏輯/體驗紅線：
*   BrandStatusDot 必須準確反映其所關聯數據的 5T 狀態，不可出現狀態顯示錯誤或延遲更新。
*   BrandSearchBar 的自動補全功能必須在 300ms 內響應，且建議結果必須與 GRI/ISO 標準高度相關，不可出現無關或錯誤的建議。
*   HermesFloatingAgent 在斷網情況下，必須提供明確的離線提示，並暫存用戶輸入，在網路恢復後自動同步，不可出現無響應或數據丟失。
*   所有元件必須符合 WCAG 2.1 AA 級無障礙標準，例如鍵盤導航、語義化 HTML 標籤、足夠的顏色對比度。