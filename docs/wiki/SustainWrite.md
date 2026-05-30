SustainWrite Editor SustainWrite Editor
路徑： /editor | 權限： PM, ADMIN | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
SustainWrite 是 ESG GO 的核心撰寫中樞，提供 208 頁報告框架、佐證清單與 AI 合規協作，幫助企業高效率產出符合 GRI/ISSB 標準的可信永續報告。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 在面對 200 多頁的 Word 檔案時，需要不斷在各種 PDF 憑證與法規網頁間頻繁切換，深怕寫錯或漏掉 GRI 指標，導致報告撰寫耗時且章節管理困難。
體驗高光時刻 (Aha Moment)： 當 PM 點擊「AI 擴寫」時，系統不僅在 3 秒內生成合規草稿，還自動在右側抽屜亮起該段落對應的「電費單 PDF 縮圖」。PM 瞬間感受到「不用自己大海撈針」的巨大釋放感，並對內容的結構化、可追溯與可驗證性感到安心。
操作軌跡：
1. 焦慮地從左側導航樹點開尚未完成的 GRI 305 章節。
2. 召喚 AI 助手，請其依據今年度數據生成排放聲明。
3. 檢閱 AI 內容與標註的證據來源，確認無誤後點擊「寫入」。
4. 執行合規掃描，看到全綠燈通過，安心存檔。
5. 完成後進行封印或發佈流程。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左中右三欄佈局」。左側為「章節導航樹」，中央為「所見即所得編輯區」，右側為「AI 顧問 / 佐證文件抽屜」。
核心液態玻璃元件： 使用 BrandFloatingAgent 作為右下角懸浮 AI 助手；編輯區背景採用 glassBg (白/深藍磨砂)；章節導航使用 TreeNav 元件。
行動端適配 (RWD)： < 768px 時，左右兩欄自動隱藏為「漢堡選單」與「懸浮 FAB」，中央編輯區必須 100% 滿版，防止文字擠壓破版。編輯器工具列將自動收合為可滾動的單行選單。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： 編輯內容自動每 30 秒 Autosave 至 Supabase report_drafts 表。佐證文件關聯資訊儲存於 evidence_links 表，並影響 report_status_dashboard 的合規進度 KPI。
5T 實踐點：
[T1 Tangible 具體]： 透過提供結構化的 208 頁報告框架、可視化的合規進度條以及 AI 生成的具體草稿內容，將抽象的 ESG 報告要求轉化為可操作、可衡量的具體任務。
[T2 Traceable 追溯]： 使用者在文字中 @ 標記數據時，自動建立與 evidence_vault 的雙向連結，確保報告內容與原始佐證文件之間的可追溯性。
[T3 Trackable 追蹤]： 每次編輯內容的自動儲存，都會在 report_drafts 表中留下版本紀錄，並可追溯到具體的編輯者與時間戳，確保內容變更可被追蹤與審計。
[T4 Transparent 透明]： AI 生成的每一段文字，旁邊都會生成一個 BrandBadge，標示其推理來源（內部知識庫或外部法規），確保內容來源可追溯且透明。
[T5 Trustworthy 信任]： 透過 AI 合規掃描，自動比對內容與 GRI/ISSB 標準，並標示潛在不合規風險，提升報告內容的整體可信度。

5. 功能項目解說和使用技術 (Features & Tech Stack)
所見即所得編輯 (WYSIWYG)： 支援標題、清單、表格、圖片嵌入與 @ 標記。技術使用 TipTap 或 Lexical 編輯器核心進行客製化，並結合 react-mentions 實現 @ 標記功能。
AI 擴寫與合規掃描： 透過背景串接 AI 進行內容分析、生成與合規性檢測。技術使用 Genkit 搭配 Gemini 2.0 Pro 模型，並以 Server-Sent Events (SSE) 實作打字機串流效果，合規掃描則利用 LangChain 進行 RAG (Retrieval-Augmented Generation) 檢索內部知識庫與法規。
自動儲存防呆機制： 背景靜默儲存使用者編輯內容。技術使用 Supabase Realtime 與 Lodash debounce 控制 API 請求頻率，確保資料不丟失且不頻繁觸發後端。
章節導航與佐證清單管理： 左側樹狀結構導航，右側抽屜式佐證文件列表。技術使用 react-virtualized-tree 實現高效能樹狀導航，佐證清單則透過 react-query 實時從 evidence_vault 獲取數據。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當 AI 一次性生成超過 2000 字時，中央編輯區的 Y 軸滾動條必須正常出現，絕對不可撐破外層 Liquid Glass 卡片容器。編輯器工具列在不同螢幕尺寸下必須保持可見且功能正常，不可出現按鈕重疊或消失。
🚨 邏輯體驗紅線： AI 回傳結果若包含違背 ESG 標準的幻覺字眼，必須被攔截並標示為紅字，同時提供「回報錯誤」選項。若發生斷網，必須平滑切換至「離線暫存模式 (IndexedDB)」，不可彈出令使用者恐慌的 Error 500 白畫面，並在網路恢復時自動同步。