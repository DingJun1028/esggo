ESG AI Agents ESG AI Agents
路徑： /agents | 權限： PM, ADMIN, USER | 所屬旅程： IV. AI 賦能與撰寫

1. 模組定位 (Core Purpose)
ESG AI Agents 旨在作為企業永續報告的智慧協作夥伴，透過自動化數據分析、內容生成與合規檢查，大幅提升 ESG 報告撰寫的效率與準確性。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 永續專案經理 (PM) 與各部門數據填報者。他們常面臨海量數據的收集、清洗與分析挑戰，難以從中快速提煉出有價值的 ESG 洞察，且擔心數據品質影響報告可信度。
體驗高光時刻 (Aha Moment)： 當 PM 點擊「數據洞察」按鈕，AI Agent 不僅在數秒內生成一份關於「碳排放熱點」的視覺化報告，還自動標註出潛在的數據異常點，並建議優化措施。PM 瞬間感受到「AI 不僅是工具，更是智慧顧問」的巨大價值。
操作軌跡：
1. PM 在「碳排放管理」模組中，點擊右下角的「召喚 Agent」按鈕。
2. 選擇「分析本月異常排放數據」任務，並指定分析範圍。
3. Agent 快速掃描數據，並在介面右側彈出「潛在異常排放源」與「建議查核清單」。
4. PM 根據 Agent 建議，點擊「生成初步報告草稿」，並將其匯出至 SustainWrite 編輯器。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： 採用「主內容區 + 右側 AI Agent 互動面板」的佈局。主內容區展示相關數據或報告，右側面板提供 Agent 的對話介面與任務列表。
核心液態玻璃元件： BrandChatBubble (AI 回應與使用者輸入)、AgentTaskCard (任務列表卡片，顯示進度與狀態)、BrandLoadingSpinner (AI 運算時的視覺回饋)。
行動端適配 (RWD)： < 768px 時，右側 AI Agent 互動面板自動收合為右下角懸浮的「Agent FAB (Floating Action Button)」，點擊後以全螢幕 Modal 形式展開對話介面。主內容區保持單欄佈局。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： AI Agent 從 `esg_data_points`、`report_drafts`、`evidence_vault` 等資料表讀取數據與內容，並將分析結果、建議或生成的草稿寫入 `agent_insights` 或更新 `report_drafts`。
5T 實踐點：
[T3 Trackable 追溯]： AI Agent 的每一次分析、生成或建議，都會在後台記錄其觸發時間、使用者、輸入參數與輸出結果，並可追溯至其所引用的原始數據來源。
[T4 Transparent 透明]： 當 AI Agent 提供數據洞察或內容生成時，會明確標示其分析所依據的數據範圍、模型版本，以及潛在的限制或假設。

5. 功能項目解說和使用技術 (Features & Tech Stack)
自然語言互動介面 (NLI)： 允許使用者透過文字輸入與 AI Agent 進行對話，提出問題或下達任務。技術使用 React Query 進行非同步請求，搭配 WebSocket 或 Server-Sent Events (SSE) 實作即時串流回覆。
ESG 數據分析與洞察生成： AI Agent 能夠自動分析跨模組的 ESG 數據，識別趨勢、異常點，並生成視覺化圖表或文字摘要。技術使用 Python 後端服務 (如 FastAPI) 整合 Pandas 進行數據處理，並調用 D3.js 或 ECharts 進行前端圖表渲染。
跨模組任務協作： AI Agent 可直接將分析結果或生成內容，無縫傳遞至 SustainWrite 編輯器或數據管理模組。技術使用內部 API Gateway 進行服務間通訊，確保數據格式與權限一致性。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 UI 跑版紅線： 當 AI Agent 回覆內容過長時，對話氣泡必須自動換行並保持在可視範圍內，不可溢出面板或遮擋輸入框。AI Agent 的懸浮 FAB 在任何螢幕尺寸下都必須保持在右下角，不可被遮擋。
🚨 邏輯/體驗紅線： AI Agent 回覆的任何數據或建議，必須與系統內部數據保持一致，不可出現「幻覺 (Hallucination)」或與事實不符的內容。若 AI 運算時間超過 10 秒，必須顯示明確的進度指示或提供取消選項，避免使用者感到卡頓。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自全系統數據表與 `/vault` (證據金庫)。
下游影響： 提供內容至 `/editor` 與數據洞察至 `/intelligence`。
依賴組件： BrandChatBubble, AgentTaskCard, BrandLoadingSpinner.