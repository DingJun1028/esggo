# ESG 策略顧問 (Advisory) ESG Strategy Advisory [Advisory]
路徑： /advisory | 權限： PM, CSO, ADMIN | 所屬旅程： II. 策略盤點與分派

1. 模組定位 (Core Purpose)
ESG 策略顧問模組利用 SPIRIT AI 引擎，為企業提供客製化的 ESG 策略建議、風險評估與機會洞察，協助企業制定符合國際標準且具前瞻性的永續發展藍圖。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續長 (CSO) 或高階主管。他們面臨複雜的國際法規、不斷變化的市場趨勢，以及內部資源有限的挑戰，難以快速且精準地制定有效的 ESG 策略。傳統顧問費用高昂且耗時。
體驗高光時刻 (Aha Moment)： 當 CSO 輸入公司基本資訊與目標後，SPIRIT AI 在數秒內生成一份包含「潛在風險」、「關鍵機會」與「行動建議」的精簡報告，並自動標註相關的 GRI/ISSB 指標。CSO 感覺就像擁有了一位 24/7 的頂級永續顧問，且成本極低。
操作軌跡：
1. CSO 進入 Advisory 頁面，選擇「新策略諮詢」。
2. 輸入公司產業、規模、現有 ESG 痛點與期望目標。
3. SPIRIT AI 進行分析，並在互動式介面中呈現初步建議。
4. CSO 可透過對話框進一步提問或要求 AI 深入分析特定議題。
5. 確認建議後，一鍵生成「策略行動計畫草稿」並匯出。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「左側導航/對話歷史，右側互動式洞察儀表板」的雙欄佈局。儀表板包含「風險熱力圖」、「機會象限圖」與「建議卡片流」。
核心液態玻璃元件： BrandChatInterface (AI 對話框)、InsightCard (策略建議卡片，可展開查看詳情)、RiskHeatmap (互動式風險熱力圖)。
行動端適配 (RWD)： < 768px 時，左側導航收合為底部 Tab 或漢堡選單。右側儀表板的圖表自動轉化為「堆疊式建議卡片列表」，確保資訊可讀性，並提供「全螢幕圖表模式」供詳細檢視。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向：
1. 使用者輸入的諮詢請求與公司數據，經由前端傳送至後端 AI 服務。
2. AI 服務整合內部知識庫 (ESG 法規、行業報告) 與外部即時數據 (市場趨勢、新聞)。
3. AI 生成的建議與分析結果，儲存至 `advisory_sessions` 與 `strategy_recommendations` 資料表。
4. 部分關鍵指標與風險評估結果，會同步更新至 `company_profile` 與 `dashboard_kpis`。
5T 實踐點：
[T1 Tangible 具體]： 將抽象的 ESG 挑戰轉化為具體的「可執行行動清單」與「量化風險指標」。
[T2 Traceable 追溯]： AI 生成的每一條建議，都會標註其背後的「數據來源」與「法規依據」，使用者可點擊查看原始文獻。
[T4 Transparent 透明]： AI 在提供建議時，會解釋其「推理過程」與「考量因素」，避免黑箱作業，增加使用者信任。
[T5 Trustworthy 信任]： 系統會定期更新 AI 知識庫，確保其依據的法規與數據是最新且經過驗證的，並對 AI 模型的輸出進行偏差監控。

5. 功能項目解說和使用技術 (Features & Tech Stack)
SPIRIT AI 策略生成引擎： 核心的 AI 決策與內容生成模組。技術使用 `Google Gemini 1.5 Pro` 或 `OpenAI GPT-4o` 搭配 `LangChain` 進行多模態數據整合與推理，並透過 `Vector Database (e.g., Pinecone)` 儲存和檢索內部知識庫。
互動式對話介面： 支援自然語言輸入與 AI 回覆。技術使用 `WebSockets` 實現即時通訊，前端採用 `React Flow` 或客製化 `SVG` 渲染對話流程圖。
風險與機會可視化儀表板： 動態展示 AI 分析結果。技術使用 `D3.js` 或 `ECharts` 進行複雜數據可視化，支援互動式篩選與鑽取。
法規與標準自動對應： AI 建議自動關聯至 GRI、ISSB 等國際標準。技術使用 `NLP (Natural Language Processing)` 進行文本匹配與實體識別，結合 `Elasticsearch` 進行高效檢索。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線：
*   當 AI 回覆內容過長時，對話氣泡必須自動換行並保持在容器內，不可溢出或遮擋其他 UI 元素。
*   儀表板中的圖表在數據量極大時，必須保持流暢的渲染速度，且 Tooltip 提示不可互相遮擋。
🚨 邏輯/體驗紅線：
*   SPIRIT AI 提供的策略建議，必須與使用者輸入的「公司產業」與「目標」高度相關，不可出現通用或無關的內容。
*   AI 回覆中若包含「不確定」或「需要更多資訊」的提示，必須以明確且友善的方式呈現，不可直接給出錯誤或誤導性資訊。
*   系統在處理敏感數據時，必須確保符合隱私規範，且 AI 不得在未經授權的情況下洩露或利用這些數據。
*   AI 建議的生成時間，從使用者發送請求到收到首條建議，必須控制在 5 秒內，以確保即時互動體驗。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自企業諮詢請求與 `/reading-room` 知識庫。
下游影響： 生成策略草案影響 `/materiality` 的權重判斷。
依賴組件： BrandChatInterface, InsightCard, RiskHeatmap.