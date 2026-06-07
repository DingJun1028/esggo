---
uuid: "f4062d07-1599-4885-a9c2-e512e8bc13d5"
version: "8.5.1"
timestamp: "2026-06-07T14:59:43.000Z"
evidence: "docs\wiki\Library.md"
---
# ESG Knowledge Hub ESG Knowledge Hub [Library]
路徑： /library | 權限： ALL_USERS | 所屬旅程： I. 基礎知識與合規準備

1. 模組定位 (Core Purpose)
ESG Knowledge Hub 是企業永續報告的「智慧型法規與知識庫」，整合全球主流 ESG 框架（GRI, SASB, TCFD, ISSB）與在地法規，提供一站式查詢、學習與應用平台，確保企業報告的合規性與前瞻性。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理、合規專員、各部門資料填報者。他們在撰寫報告、回答稽核問題或理解特定 ESG 指標要求時，常面臨資訊散亂、版本更新頻繁、難以快速找到最新且準確合規指引的困境。
體驗高光時刻 (Aha Moment)： 當專案經理在搜尋框輸入「GRI 305 排放量計算」時，系統不僅即時呈現 GRI 官方指引，還自動在右側抽屜亮出公司內部針對該指標的「最佳實踐範本」與「常用數據來源」。專案經理瞬間感受到「所有需要的資訊都在這裡，而且還幫我整理好了公司內部指引，太省事了！」的巨大便利性。
操作軌跡：
1. 永續專案經理需要了解最新 ISSB S2 氣候相關揭露要求。
2. 在頂部搜尋框輸入「ISSB S2 氣候」。
3. 系統即時顯示相關的法規條文、官方指引文件、以及 ESG GO 平台內部的實踐範例。
4. 點擊進入某個指引頁面，發現關鍵詞已被高亮，並有相關的內部數據連結，快速掌握核心要點。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側篩選導航 + 中央內容列表 + 右側詳情/關聯資訊抽屜」的三欄佈局。頂部為全寬搜尋列。
核心液態玻璃元件： BrandSearchBar (具備自動建議功能)、BrandFilterPanel (可收合式篩選器)、BrandDocCard (文件列表卡片)、BrandMarkdownViewer (內容渲染器)。
行動端適配 (RWD)： < 768px 時，左側篩選導航收合為「底部彈出式篩選面板 (Bottom Sheet)」，右側詳情抽屜自動隱藏，中央內容列表轉化為「堆疊式卡片列表 (Stacked Cards)」，搜尋列保持頂部滿版。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 知識文章內容（Markdown、PDF 連結、元數據）儲存於 `knowledge_articles` 資料表。搜尋查詢透過全文檢索引擎處理。使用者瀏覽行為記錄於 `user_activity_logs`。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的法規條文與指引，透過結構化的 Markdown 內容、圖表與範例，具體化為易於理解和應用的知識點。
[T2 Traceable 追溯]： 每一份知識文件都標註其來源（如：GRI 官方網站、ISSB 最終準則），並記錄其發布日期與版本號，確保資訊的可追溯性。
[T3 Trackable 追蹤]： 系統記錄使用者對特定知識文章的瀏覽次數與停留時間，提供熱門議題分析，並在文章更新時通知相關使用者。
[T4 Transparent 透明]： 清楚標示每篇文章的「資訊來源」與「更新日期」，讓使用者對內容的權威性與時效性一目瞭然。
[T5 Trustworthy 信任]： 關鍵法規文件（如 PDF）可與「證據金庫」連結，確保其內容的不可篡改性與真實性。

5. 功能項目解說和使用技術 (Features & Tech Stack)
智慧搜尋與篩選： 支援關鍵字搜尋、模糊匹配、多維度篩選（依框架、議題、發布日期）。技術使用 Elasticsearch 或 Supabase Full-Text Search (FTS) 進行內容索引與檢索；前端使用 React-Select 或 Ant Design Select 實作篩選器。
多格式內容呈現： 支援 Markdown 渲染、PDF 嵌入預覽、外部連結跳轉。技術使用 React-Markdown 或 MDX for Markdown；React-PDF for PDF 預覽；iframe for 外部內容嵌入。
版本控制與更新通知： 記錄每篇文章的修改歷史，並在重要更新時自動通知訂閱者。技術使用 Supabase 的 `article_versions` 資料表進行 Git-like 版本管理；Supabase Realtime 或專用通知服務實現即時通知。
內部連結與交叉引用： 允許文章內部互相連結，或連結至平台其他模組（如：SustainWrite 編輯器中的特定章節）。技術使用客製化 Markdown 渲染器進行連結解析；Supabase Foreign Key relationships 確保資料完整性。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 搜尋結果列表在不同螢幕尺寸下，卡片或列表項的標題與摘要文字必須正確截斷並顯示省略號 (text-overflow: ellipsis)，配合 Tooltip 檢視完整內容，不可溢出容器或導致佈局錯亂。PDF 嵌入預覽時，若檔案過大或網路不佳，必須顯示友善的載入動畫或錯誤提示，不可出現空白或破損的預覽框。
🚨 邏輯/體驗紅線： 搜尋結果必須在 500ms 內返回，且相關性排序必須合理。若搜尋無結果，必須提供「建議關鍵字」或「聯繫客服」的引導。任何法規文件若被標記為「已過期」或「已廢止」，必須在搜尋結果中明確標示，並優先顯示最新版本，避免使用者誤用舊資訊。斷網情況下，已瀏覽過的內容應嘗試從瀏覽器快取中載入，並顯示「離線模式」提示，而非直接顯示錯誤頁面。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自國際標準組織 (GRI, ISSB) 與政府公報。
下游影響： 提供法規依據給 `/compliance-check` 與 `/editor` 的寫入建議。
依賴組件： BrandSearchBar, BrandFilterPanel, BrandDocCard, BrandMarkdownViewer.
