# 🏛️ 萬能元件中心 (Omni Component Center)

**版本**: v3.1.0 (Matrix Completion Pass) · **密級**: ESGGO 系統核心標準 · **狀態**:
TRANSCENDENT & MATRIX_COMPLETION_PASS

> 本文件為 ESGGO 系統中所有「功能項目」與「萬能設施」的單一真理來源 (Single
> Source of Truth)。在此註冊之所有元件，皆受「16
> 維度萬能元件終始矩陣」的嚴格監督。 V3.0
> 版本實現了**全域、全端、全態、全貌**的集成考量，將前端 UI、後端資料庫、AI
> 代理蜂群、網路異常降解與全域權限深度縫合，達成真正的「萬能圓通」。

---

## 🌌 元件治理總則 (Governance Directives)

1. **強制註冊制**：任何具備獨立語義的 UI 實體或邏輯核心，必須在此造冊登記。
2. **5T 原生綁定**：Traceable (溯源), Trackable (追蹤), Transparent (透明),
   Tangible (感知), Trustworthy (不可篡改)。
3. **體驗至上法則**：明確顧客旅程定位，落實「上善若水」的頂級 UI/UX 體驗。
4. **全端集成考量**：任何元件不得被視為孤立的前端代碼，必須交代其資料脈絡、權限治理與蜂群代理的協同關係。
5. **全態優雅降解**：在網路異常、權限不足或系統崩潰時，必須保證體驗不中斷的防禦機制。

---

## 📊 萬能元件終極矩陣 (16-Dimensional Hyper Matrix)

### 1. 有機體設施 (Organisms)

#### 1.1 聖殿核心 (Sanctuary Core)

系統六大中樞的視覺化承載載體，接收即時遙測，反映系統全境健康度。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                                 |
| :--------------------- | :------------------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `OmniConcentricSanctuary`                                                                   |
| **02. 實體層級**       | 有機體 (Organism)                                                                           |
| **03. 起源 (Genesis)** | 終結靜態硬編碼，實現雙向開發與實時遙測的生命體。                                            |
| **04. 顧客旅程**       | **【監控維護期】** 提供高階主管對全局狀態的 1 秒內極速概覽。                                |
| **05. UI/UX 設計**     | **【液態玻璃與賽博龐克】** 懸浮提示框 (Tooltip) 隱藏非必要資訊以降低認知負荷。              |
| **06. 全端資料脈絡**   | `OmniNexus API` (後端) -> `useOmniTelemetry` (SWR 輪詢) -> `UI 狀態驅動渲染`。              |
| **07. 代理蜂群協同**   | `OmniCore` 決策狀態流轉；`Jules` 負責技術債警告觸發時的深度修復。                           |
| **08. 全態異常降解**   | API 斷線時，渲染停止並進入紅色 `[CRITICAL] Hexa-Core disconnected` 安全模式，避免畫面崩潰。 |
| **09. 全域權限治理**   | 依賴 `System_Admin` 或 `Omni_Commander` JWT 令牌，無權限者將被中介層阻擋。                  |
| **10. 系統整合相依**   | Next.js App Router, SWR, Lucide-React, Tailwind CSS 動效引擎。                              |
| **11. 可溯源 (5T)**    | `src/components/organisms/OmniConcentricSanctuary.tsx`                                      |
| **12. 可追蹤 (5T)**    | 透過 `useOmniTelemetry` 以 3.5s 週期進行狀態追蹤與重新計算。                                |
| **13. 可驗算 (5T)**    | 旋轉週期與合規率算式公開透明。                                                              |
| **14. 可感知 (5T)**    | 六層光環與脈衝特效，極大化視覺感知。                                                        |
| **15. 不可篡改 (5T)**  | 唯讀 API 數據，前端無法主動篡改核心健康指標。                                               |
| **16. 終態 (End)**     | `ONENESS` 晶體進入 `TRANSCENDENCE` 狀態並產生實體脈衝。                                     |

#### 1.2 真理鏈視覺器 (Truth Chain Visualizer)

呈現邏輯節點關聯性，是 5T 協議中的視覺核心。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                             |
| :--------------------- | :---------------------------------------------------------------------- |
| **01. 元件名稱**       | `TruthChainVisualizer`                                                  |
| **02. 實體層級**       | 有機體 (Organism)                                                       |
| **03. 起源 (Genesis)** | 使零知識證明與溯源鏈具備視覺證據效力。                                  |
| **04. 顧客旅程**       | **【稽核與信任期】** 讓稽核員肉眼驗證 ESG 數據的不可竄改性。            |
| **05. UI/UX 設計**     | **【拓樸導向與空間感】** 發光節點搭配 Framer Motion 彈性進場動畫。      |
| **06. 全端資料脈絡**   | `PostgreSQL (esg_atoms)` -> `Graph Engine` -> 組件渲染 `graph` 結構。   |
| **07. 代理蜂群協同**   | `Sequential Thinking` 代理提供邏輯推演，產出節點資料。                  |
| **08. 全態異常降解**   | 若無資料傳入，優雅顯示 `No Truth Chain Data Available` 的毛玻璃佔位符。 |
| **09. 全域權限治理**   | 遵循 Supabase RLS，僅驗證通過的使用者可讀取特定 `Evidence` 節點。       |
| **10. 系統整合相依**   | Framer Motion, Lucide-React 向量圖示庫。                                |
| **11. 可溯源 (5T)**    | `src/components/AtomicLibrary/organisms/TruthChainVisualizer.tsx`       |
| **12. 可追蹤 (5T)**    | 節點與邊緣的歷史路徑被忠實渲染。                                        |
| **13. 可驗算 (5T)**    | 邊界權重 (`strength`) 邏輯透明。                                        |
| **14. 可感知 (5T)**    | 平滑展開動畫與 Hash Lock 狀態標籤。                                     |
| **15. 不可篡改 (5T)**  | 節點夾帶實體 `hash_lock` 顯示，確保資料純潔性。                         |
| **16. 終態 (End)**     | 複雜邏輯降維成清澈網狀結構，瞬間理解全貌。                              |

#### 1.3 智能編撰器 (OmniSustainWriteEditor)

永續報告核心內容的文字智能生產與治理模組。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                             |
| :--------------------- | :---------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniSustainWriteEditor`                                                |
| **02. 實體層級**       | 有機體 (Organism)                                                       |
| **03. 起源 (Genesis)** | 統一永續報告內容產出標準，確保格式、專業語氣與資料防篡改。              |
| **04. 顧客旅程**       | **【資料編撰期】** 協助使用者高效率且合規地撰寫永續報告。               |
| **05. UI/UX 設計**     | **【無縫沉浸與聚焦】** 採用極簡工具列與懸浮氣泡菜單，即時計算 5T 徽章。 |
| **06. 全端資料脈絡**   | 用戶輸入 -> 本地暫存 -> OmniNexus AI 處理 -> 最終表單提交至 DB。        |
| **07. 代理蜂群協同**   | L-Hub 代理蜂群接管「精煉、擴寫、文法與正式語氣」轉換。                  |
| **08. 全態異常降解**   | 網路中斷時啟動 `localStorage` 草稿防丟失保護機制。                      |
| **09. 全域權限治理**   | 若傳入 `readonly` 則隱藏所有編輯按鈕與 AI 工具列，防止越權操作。        |
| **10. 系統整合相依**   | Tiptap Editor, Lucide-React 向量圖示庫, OmniNexus API。                 |
| **11. 可溯源 (5T)**    | `src/components/omni/OmniSustainWriteEditor.tsx`                        |
| **12. 可追蹤 (5T)**    | HTML 內容每次變更皆觸發 onChange 與 Hash 重新計算。                     |
| **13. 可驗算 (5T)**    | AI 產出路徑與 Hash 算式公開透明。                                       |
| **14. 可感知 (5T)**    | 微動效按鈕回饋與右下角 5T Hash Lock 即時徽章。                          |
| **15. 不可篡改 (5T)**  | 文字變更同步觸發 16 碼 SHA-256 Hash，確保提交前的資料純潔性。           |
| **16. 終態 (End)**     | 文件成功保存並送出審核後，元件釋放資源回歸待命狀態。                    |

---

### 2. 基礎原子 (Atoms)

#### 2.1 萬能按鈕 (OmniButton)

系統中唯一被允許的標準物理觸發裝置。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                             |
| :--------------------- | :---------------------------------------------------------------------- |
| **01. 元件名稱**       | `Button`                                                                |
| **02. 實體層級**       | 原子 (Atom)                                                             |
| **03. 起源 (Genesis)** | 統合點擊互動，確保體驗一致性與 A11y 支援。                              |
| **04. 顧客旅程**       | **【全旅程通用】** 推進漏斗 (Funnel) 的行動呼籲 (CTA)。                 |
| **05. UI/UX 設計**     | **【Fitts's Law 觸碰優化】** 保障 44px 最小觸控面積與 Focus Ring。      |
| **06. 全端資料脈絡**   | 本地狀態觸發 -> 發送 API Request 或 Mutate 資料。                       |
| **07. 代理蜂群協同**   | `Pencil` 負責全域色系配置 (Aqua/Gold)。                                 |
| **08. 全態異常降解**   | 網路延遲時鎖定為 `disabled` 並可選擇顯示 `Loading` 狀態，防止重複點擊。 |
| **09. 全域權限治理**   | 可搭配權限 Wrapper，無權限時自動進入隱藏或 Disabled 狀態。              |
| **10. 系統整合相依**   | Tailwind CSS `disabled:` 與 `focus:` 偽類系統。                         |
| **11. 可溯源 (5T)**    | `src/components/AtomicLibrary/atoms/Button.tsx`                         |
| **12. 可追蹤 (5T)**    | 透過 `onClick` 委派，掛載全局追蹤事件。                                 |
| **13. 可驗算 (5T)**    | `variant` 與 `size` 矩陣邏輯固定。                                      |
| **14. 可感知 (5T)**    | Hover/Focus 色彩過渡回饋。                                              |
| **15. 不可篡改 (5T)**  | 狀態由 Props 收斂，禁止內部狀態干涉。                                   |
| **16. 終態 (End)**     | 拋出事件後回歸 Idle 靜止狀態。                                          |

#### 2.2 萬能標籤 (OmniTag)

系統中負責狀態標注與重點提示的基礎元件。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                             |
| :--------------------- | :---------------------------------------------------------------------- |
| **01. 元件名稱**       | `Tag`                                                                   |
| **02. 實體層級**       | 原子 (Atom)                                                             |
| **03. 起源 (Genesis)** | 標準化狀態指示器，消滅破碎文字樣式。                                    |
| **04. 顧客旅程**       | **【資訊檢視期】** 快速掃視 (Scanning) 與狀態辨識。                     |
| **05. UI/UX 設計**     | **【高對比與視覺層級】** 柔和背景搭配高飽和文字，防刺眼圓角。           |
| **06. 全端資料脈絡**   | 讀取 DB 資料欄位 (如 `status: 'ACTIVE'`) -> 映射為 Tag 變異 (variant)。 |
| **07. 代理蜂群協同**   | 狀態定義由 `OmniCore` 統一頒布。                                        |
| **08. 全態異常降解**   | 當傳入未知的狀態時，降解為安全的灰色 `default` 樣式。                   |
| **09. 全域權限治理**   | 無直接權限綁定，屬唯讀展示。                                            |
| **10. 系統整合相依**   | 無，純 Tailwind 類別組合。                                              |
| **11. 可溯源 (5T)**    | `src/components/AtomicLibrary/atoms/Tag.tsx`                            |
| **12. 可追蹤 (5T)**    | 直接映射傳入的狀態變異。                                                |
| **13. 可驗算 (5T)**    | 僅接受四種受限變異 (default, success, warning, error)。                 |
| **14. 可感知 (5T)**    | 0.1 秒內區分資訊層級。                                                  |
| **15. 不可篡改 (5T)**  | 無狀態純函數，輸入即輸出。                                              |
| **16. 終態 (End)**     | 靜默存在於版面中，零資源負擔。                                          |

#### 2.3 萬能輸入框 (OmniInput)

系統中接收人類或代理文字意圖的唯一入口。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                              |
| :--------------------- | :----------------------------------------------------------------------- |
| **01. 元件名稱**       | `Input`                                                                  |
| **02. 實體層級**       | 原子 (Atom)                                                              |
| **03. 起源 (Genesis)** | 保護系統邊界，提供統一錯誤提示與型別約束。                               |
| **04. 顧客旅程**       | **【資料錄入期】** 溫柔引導最高摩擦力的資料轉換節點。                    |
| **05. UI/UX 設計**     | **【即時驗證與安心感】** Focus Ring 發光指示與溫和的 Inline Validation。 |
| **06. 全端資料脈絡**   | `onChange` 綁定表單狀態 -> 送入 Zod 驗證 -> 寫入 DB。                    |
| **07. 代理蜂群協同**   | 配合 `L-Hub` 表單輔助輸入 (AI 建議填寫) 進行雙向整合。                   |
| **08. 全態異常降解**   | 支援斷線時保存草稿 (Local Storage Fallback)，避免辛勞輸入丟失。          |
| **09. 全域權限治理**   | 若用戶未登入，強制設為 `disabled` 並提示登入。                           |
| **10. 系統整合相依**   | 表單狀態管理器 (如 React Hook Form) 與 Zod 驗證器。                      |
| **11. 可溯源 (5T)**    | `src/components/AtomicLibrary/atoms/Input.tsx`                           |
| **12. 可追蹤 (5T)**    | 嚴格的鍵盤與格式追蹤。                                                   |
| **13. 可驗算 (5T)**    | 錯誤發生時即時轉紅並透明顯示原因。                                       |
| **14. 可感知 (5T)**    | Focus Ring 提供充足邊界安心感。                                          |
| **15. 不可篡改 (5T)**  | 可設為 `readonly` 阻擋未授權篡改。                                       |
| **16. 終態 (End)**     | 資料安全提取後，等待下一次意圖注入。                                     |

#### 2.4 萬能氣象儀 (OmniWeather)

系統中呈現環境動態與 ESG 相關感知數據的視覺組件。

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                               |
| :--------------------- | :------------------------------------------------------------------------ |
| **01. 元件名稱**       | `OmniWeather`                                                             |
| **02. 實體層級**       | 原子 (Atom)                                                               |
| **03. 起源 (Genesis)** | 建立具象化的環境指標，結合天氣與空氣品質(AQI)，強化平台永續感知。         |
| **04. 顧客旅程**       | **【儀表板監控期】** 提供直覺的環境數據，喚起使用者對 ESG 之具體認知。    |
| **05. UI/UX 設計**     | **【玻璃擬物與動效】** Aqua/Gold 配色，搭配平滑漸變發光與呼吸動畫。       |
| **06. 全端資料脈絡**   | 前端展示為主，可串接環境 API 即時更新天氣與碳排放相關感知。               |
| **07. 代理蜂群協同**   | 可透過 `OmniCore` 根據天氣狀態調整背景氛圍或發送極端氣候警告。            |
| **08. 全態異常降解**   | API 斷線或未掛載時，呈現優雅的 Pulse Skeleton，不造成視覺崩潰。           |
| **09. 全域權限治理**   | 無權限限制，作為公開展示用的非敏感數據。                                  |
| **10. 系統整合相依**   | Lucide-React 圖標，Tailwind 動效 (`animate-pulse`, `animate-[spin...]`)。 |
| **11. 可溯源 (5T)**    | `src/components/ui/atom/OmniWeather.tsx`                                  |
| **12. 可追蹤 (5T)**    | 元件掛載狀態與動效呈現。                                                  |
| **13. 可驗算 (5T)**    | 溫度、濕度、風速與 AQI 的顯示格式統一透明。                               |
| **14. 可感知 (5T)**    | 強烈玻璃擬物視覺與即時光影反饋，高度的 UI 美學體驗。                      |
| **15. 不可篡改 (5T)**  | 純展示層，無互動修改功能。                                                |
| **16. 終態 (End)**     | 隨著 Dashboard 銷毀而結束生命週期。                                       |

---

---

### 3. 指揮與代理設施 (Command & Swarm Facilities)

#### 3.1 全域命令列 (OmniCommandPalette)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                                   |
| :--------------------- | :-------------------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniCommandPalette`                                                                          |
| **02. 實體層級**       | 有機體 (Organism)                                                                             |
| **03. 起源 (Genesis)** | 以 Ctrl/Cmd+K 統一全域導航、資料同步、RAG 查詢與代理任務喚醒。                                |
| **04. 顧客旅程**       | **【全域操作期】** 讓使用者不用離開畫面即可觸發核心任務。                                     |
| **05. UI/UX 設計**     | **【液態玻璃命令面板】** 搜尋、快捷指令、AI 任務入口集中於同一浮層。                          |
| **06. 全端資料脈絡**   | 前端指令 -> `/api/omni-sync`、`/api/vault/audit`、`/api/omni-agent/rag`、`/api/nexus/agent`。 |
| **07. 代理蜂群協同**   | 透過 `omni_agent_task` 呼叫 Nexus 代理任務，並可喚醒 `OmniAgent Oracle`。                     |
| **08. 全態異常降解**   | API 失敗時顯示連線異常提示，搜尋無結果時提供 AI 代理運算入口。                                |
| **09. 全域權限治理**   | 讀取型指令先走唯讀 API；寫入型任務應由後端路由承接權限與速率限制。                            |
| **10. 系統整合相依**   | Next.js App Router、Framer Motion、Lucide-React、OmniAgent/Nexus API。                        |
| **11. 可溯源 (5T)**    | `components/omni/OmniCommandPalette.tsx`                                                      |
| **12. 可追蹤 (5T)**    | 搜尋關鍵字、指令 id、API 回應狀態可被前端事件與後端日誌串接。                                 |
| **13. 可驗算 (5T)**    | 指令清單固定過濾，命中規則為 title 包含搜尋字串。                                             |
| **14. 可感知 (5T)**    | 動畫浮層、指令圖示、ESC 關閉提示與即時搜尋回饋。                                              |
| **15. 不可篡改 (5T)**  | 指令清單由程式碼常數定義，寫入任務由 API 統一驗證。                                           |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：全域操作入口已登入終極矩陣。                                             |

#### 3.2 代理脈搏浮標 (OmniAgentPulse)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                     |
| :--------------------- | :------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `OmniAgentPulse`                                                                |
| **02. 實體層級**       | 有機體 (Organism)                                                               |
| **03. 起源 (Genesis)** | 將 OmniTable 同步狀態與 OmniAgentBus 事件轉成可拖曳即時脈搏。                   |
| **04. 顧客旅程**       | **【任務監控期】** 讓操作者在任何畫面快速看見代理與同步健康度。                 |
| **05. UI/UX 設計**     | **【漂浮式 Glass Widget】** 收合為 Bot 脈衝，展開為任務、ZKP 數與事件流。       |
| **06. 全端資料脈絡**   | `useOmniTable` -> OmniTable records；`useOmniAgentBus` -> Swarm events。        |
| **07. 代理蜂群協同**   | 讀取 agent bus signals，顯示 active resonance 與 OmniCommander 任務狀態。       |
| **08. 全態異常降解**   | 無事件時顯示 `Awaiting resonance...`；使用者可隱藏浮標避免干擾。                |
| **09. 全域權限治理**   | 使用 `valid-jwt-token` 作為 UI 資料請求 token；後端應在正式環境以真實權限替換。 |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、`hooks/useOmniTable`、`lib/omni-agent-bus`。       |
| **11. 可溯源 (5T)**    | `components/omni/OmniAgentPulse.tsx`                                            |
| **12. 可追蹤 (5T)**    | 事件流按 timestamp 與 event type 追蹤，最近三筆即時顯示。                       |
| **13. 可驗算 (5T)**    | ZKP seal 數量直接由 records.length 計算。                                       |
| **14. 可感知 (5T)**    | 脈衝、拖曳、展開收合與事件流動畫提供即時感知。                                  |
| **15. 不可篡改 (5T)**  | 顯示層不直接寫入任務，僅讀取狀態與事件。                                        |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：代理即時監控浮標已登入終極矩陣。                           |

#### 3.3 代理事件匯流排 (OmniAgentBus)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                          |
| :--------------------- | :----------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniAgentBus`                                                                       |
| **02. 實體層級**       | 基礎設施 (Facility)                                                                  |
| **03. 起源 (Genesis)** | 提供前端與代理事件之間的輕量型事件匯流排。                                           |
| **04. 顧客旅程**       | **【代理協作期】** 讓 UI 與任務系統可訂閱/發布 Swarm 事件。                          |
| **05. UI/UX 設計**     | 無直接 UI；由 Pulse、Resonance、ThinkTank 等元件消費事件。                           |
| **06. 全端資料脈絡**   | `emit(payload)` -> handlers[eventType] -> UI hook / log renderer。                   |
| **07. 代理蜂群協同**   | 支援 `AGENT_SWARM_DISPATCH`、`AGENT_SWARM_RESPONSE`、`COMPONENT_REGISTERED` 等事件。 |
| **08. 全態異常降解**   | 無 handler 時靜默通過；除錯模式才輸出 console 日誌。                                 |
| **09. 全域權限治理**   | 前端事件層不具備權限判斷；敏感事件必須由後端驗證後再發布。                           |
| **10. 系統整合相依**   | TypeScript enum/interface、Singleton bus pattern。                                   |
| **11. 可溯源 (5T)**    | `src/components/AtomicLibrary/OmniAgentBus.ts`                                       |
| **12. 可追蹤 (5T)**    | payload 包含 uuid、componentName、type、timestamp。                                  |
| **13. 可驗算 (5T)**    | on/off/emit 三方法，事件型別由 enum 收斂。                                           |
| **14. 可感知 (5T)**    | 由消費端轉成 UI 事件流、脈搏與狀態燈。                                               |
| **15. 不可篡改 (5T)**  | 匯流排本身不修改 payload；只轉發。                                                   |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：代理事件匯流排已登入終極矩陣。                                  |

#### 3.4 自主通典視覺器 (OmniCodexViewer)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                     |
| :--------------------- | :------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `OmniCodexViewer`                                                               |
| **02. 實體層級**       | 有機體 (Organism)                                                               |
| **03. 起源 (Genesis)** | 呈現 OmniCore Codex、MECE 法則與 Local Base ↔ VPS Gateway 的終始矩陣。          |
| **04. 顧客旅程**       | **【平台建置期】** 讓管理者確認 OmniAgent Gateway 是否完成雙向綁定。            |
| **05. UI/UX 設計**     | **【通典 + 終始矩陣】** 左側發行架構，右側始/終節點與同步光束。                 |
| **06. 全端資料脈絡**   | `isVpsBound` prop -> VPS binding UI；`toggleVpsBindingAction` -> 外部控制函式。 |
| **07. 代理蜂群協同**   | 描述 OmniAgentBus、Karma Protocol、Gap Analysis 的代理治理狀態。                |
| **08. 全態異常降解**   | 未綁定時顯示 Disconnected，並提供 Bind 按鈕。                                   |
| **09. 全域權限治理**   | 綁定/解綁由父層控制；正式環境應由後端權限 API 保護。                            |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、OmniCore Gateway 狀態。                            |
| **11. 可溯源 (5T)**    | `components/omni-core/OmniCodexViewer.tsx`                                      |
| **12. 可追蹤 (5T)**    | 以始/終節點與同步光束視覺化 VPS 綁定狀態。                                      |
| **13. 可驗算 (5T)**    | `isVpsBound` 布林值決定 UI 狀態與操作文案。                                     |
| **14. 可感知 (5T)**    | 通典卡片、同步光束、狀態徽章與操作按鈕。                                        |
| **15. 不可篡改 (5T)**  | 元件本身不保存綁定狀態；狀態由父層或後端提供。                                  |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：OmniCore 通典視覺器已登入終極矩陣。                        |

#### 3.5 MECE 極限進化儀表板 (OmniMECEDashboard)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                          |
| :--------------------- | :------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniMECEDashboard`                                                  |
| **02. 實體層級**       | 有機體 (Organism)                                                    |
| **03. 起源 (Genesis)** | 即時呈現 MECE Engine 的進化日誌與短板缺口分析。                      |
| **04. 顧客旅程**       | **【持續改善期】** 讓團隊發現尚未落實的 MECE 法則並排程優化。        |
| **05. UI/UX 設計**     | **【雙欄診斷面板】** 左側 Recent Evolution，右側 Gap Analysis。      |
| **06. 全端資料脈絡**   | `meceEngine.getLogs()` 與 `meceEngine.generateGapAnalysis()` -> UI。 |
| **07. 代理蜂群協同**   | 將系統事件映射到 OMNI_MECE_PRINCIPLES，觸發自修復或優化任務。        |
| **08. 全態異常降解**   | 無日誌時顯示寂靜狀態；無缺口時顯示圓滿狀態。                         |
| **09. 全域權限治理**   | 前端讀取本地 engine 狀態；敏感優化動作應由後端權限控制。             |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、`lib/omni-core/omni-mece-engine`。      |
| **11. 可溯源 (5T)**    | `components/omni-core/OmniMECEDashboard.tsx`                         |
| **12. 可追蹤 (5T)**    | 每秒輪詢日誌與缺口，並展示 principleKeys。                           |
| **13. 可驗算 (5T)**    | totalScore 由 logs.impactMetric 加總。                               |
| **14. 可感知 (5T)**    | 進化能量、日誌 chips、缺口 tooltip。                                 |
| **15. 不可篡改 (5T)**  | 只讀展示 engine 計算結果，不直接改寫法則。                           |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：MECE 治理儀表板已登入終極矩陣。                 |

#### 3.6 ThinkTank 任務控制台 (ThinkTankControl)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                             |
| :--------------------- | :-------------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `ThinkTankControl`                                                                      |
| **02. 實體層級**       | 有機體 (Organism)                                                                       |
| **03. 起源 (Genesis)** | 將 OmniAgent 任務、5T seal、HITL review 與事件流整合成任務控制台。                      |
| **04. 顧客旅程**       | **【任務審批期】** 讓管理者啟動任務、追蹤進度並審核 5T seal。                           |
| **05. UI/UX 設計**     | **【Mission Cards + Event Log + Review Panel】** 任務卡、即時事件、人工審核。           |
| **06. 全端資料脈絡**   | `useOmniAgentStream` -> mission progress；`/api/omni-agent-api/hitl-review` -> review。 |
| **07. 代理蜂群協同**   | 支援 SYNC_OMNIBLUE_OMNITABLE、EVIDENCE_AUDIT、PILOT_REPORT、TRANSFER_TO_NCBDB 等任務。  |
| **08. 全態異常降解**   | 任務執行中禁用重複啟動；錯誤訊息顯示於 mission card；無 seal 時顯示待命。               |
| **09. 全域權限治理**   | HITL 審核應由後端權限與簽章驗證；前端只提交審核決策。                                   |
| **10. 系統整合相依**   | Framer Motion、UI Card/Button/Badge、`hooks/useOmniAgentStream`。                       |
| **11. 可溯源 (5T)**    | `components/omni/ThinkTankControl.tsx`                                                  |
| **12. 可追蹤 (5T)**    | EventLog 顯示 event、payload 摘要與時間戳。                                             |
| **13. 可驗算 (5T)**    | Mission status 由 progress.status 映射 badge。                                          |
| **14. 可感知 (5T)**    | 進度條、狀態徽章、事件流與審核按鈕。                                                    |
| **15. 不可篡改 (5T)**  | seal 與審核狀態由事件流/後端提供，前端不自行改寫。                                      |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：ThinkTank 任務控制台已登入終極矩陣。                               |

#### 3.7 記憶碎片技能書 (SkillBookUI)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                             |
| :--------------------- | :---------------------------------------------------------------------- |
| **01. 元件名稱**       | `SkillBookUI`                                                           |
| **02. 實體層級**       | 有機體 (Organism)                                                       |
| **03. 起源 (Genesis)** | 將對話殘影萃取成 Memory Shard，並合成 Skill Ultimate。                  |
| **04. 顧客旅程**       | **【知識沉澱期】** 讓代理團隊把實作經驗沉澱成可複用技能。               |
| **05. UI/UX 設計**     | **【技能書與碎片表】** 表格展示 shard，合成後顯示奧義卡。               |
| **06. 全端資料脈絡**   | UI -> `/api/agent/memory-shards` -> MemoryShard / SkillUltimate -> UI。 |
| **07. 代理蜂群協同**   | 使用 `memory-shards` API 萃取與合成代理技能。                           |
| **08. 全態異常降解**   | 不足 2 片時禁用合成；API 失敗時 console 記錄並維持原狀態。              |
| **09. 全域權限治理**   | 技能萃取/合成應由後端驗證使用者與上下文權限。                           |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、`lib/agent/memory-shards`。                |
| **11. 可溯源 (5T)**    | `components/omni/SkillBookUI.tsx`                                       |
| **12. 可追蹤 (5T)**    | shard.id、tags、hash lock 摘要在表格中展示。                            |
| **13. 可驗算 (5T)**    | shards.length >= 2 才允許合成。                                         |
| **14. 可感知 (5T)**    | 碎片表格、狀態燈、合成按鈕與奧義展示。                                  |
| **15. 不可篡改 (5T)**  | UI 不自行改寫 shard，僅提交 API action。                                |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：技能書設施已登入終極矩陣。                         |

#### 3.8 蜂群監控器 (SwarmMonitor)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                           |
| :--------------------- | :-------------------------------------------------------------------- |
| **01. 元件名稱**       | `SwarmMonitor`                                                        |
| **02. 實體層級**       | 有機體 (Organism)                                                     |
| **03. 起源 (Genesis)** | 即時展示 Swarm agents、tasks、compute load 與刷新控制。               |
| **04. 顧客旅程**       | **【蜂群運轉期】** 讓管理者快速掌握代理負載與任務流。                 |
| **05. UI/UX 設計**     | **【Agent Grid + Task Stream + Load Meter】** 以卡片和流式任務呈現。  |
| **06. 全端資料脈絡**   | `useSwarmSync` -> agents/tasks/loading/error -> Brand UI。            |
| **07. 代理蜂群協同**   | 展示 active/processing/error agents 與 approved_for_execution tasks。 |
| **08. 全態異常降解**   | 無任務時顯示無活躍任務；loading 時顯示 Syncing。                      |
| **09. 全域權限治理**   | 任務與代理資料應由後端權限過濾；前端只展示 hook 回傳結果。            |
| **10. 系統整合相依**   | Framer Motion、Brand UI、`hooks/useSwarmSync`、`lib/agent/types`。    |
| **11. 可溯源 (5T)**    | `components/ui/SwarmMonitor.tsx`                                      |
| **12. 可追蹤 (5T)**    | task.id、agent.id、status、title 被展示。                             |
| **13. 可驗算 (5T)**    | compute load 固定顯示 42.8%，未來應由後端指標替換。                   |
| **14. 可感知 (5T)**    | 狀態點、任務動畫、刷新按鈕與算力條。                                  |
| **15. 不可篡改 (5T)**  | 只讀展示 Swarm 狀態，不提供直接改寫代理狀態入口。                     |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：Swarm 監控器已登入終極矩陣。                     |

#### 3.9 蜂群共振日誌 (SwarmResonance)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                            |
| :--------------------- | :--------------------------------------------------------------------- |
| **01. 元件名稱**       | `SwarmResonance`                                                       |
| **02. 實體層級**       | 有機體 (Organism)                                                      |
| **03. 起源 (Genesis)** | 訂閱 OmniAgentBus 事件並轉成終端風格的 Swarm 共振日誌。                |
| **04. 顧客旅程**       | **【即時除錯期】** 讓開發者與指揮官觀察事件如何穿越代理層。            |
| **05. UI/UX 設計**     | **【Terminal Event Console】** 事件 badge、agent icon、payload 摘要。  |
| **06. 全端資料脈絡**   | `omniAgentBus.subscribe(...)` -> logs state -> terminal UI。           |
| **07. 代理蜂群協同**   | 訂閱 SIMULATION、AGENT_TASK、COMMAND_ISSUED、5T_SEAL、MISSION 等事件。 |
| **08. 全態異常降解**   | 無事件時顯示 Waiting for intent resonance。                            |
| **09. 全域權限治理**   | 前端事件日誌不應顯示敏感 payload；正式環境應由後端脫敏。               |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、`lib/agents/omni-agent-bus`。             |
| **11. 可溯源 (5T)**    | `components/ui/SwarmResonance.tsx`                                     |
| **12. 可追蹤 (5T)**    | 每筆 log 包含 id、timestamp、event、payload、agent。                   |
| **13. 可驗算 (5T)**    | 最近 50 筆事件以 slice(0, 50) 限制。                                   |
| **14. 可感知 (5T)**    | 終端燈號、事件徽章、agent 圖示與 payload 展開。                        |
| **15. 不可篡改 (5T)**  | UI 只追加事件，不修改 bus payload。                                    |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：Swarm 共振日誌已登入終極矩陣。                    |

#### 3.10 蜂群共識視覺器 (ConsensusVisualizer)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                      |
| :--------------------- | :--------------------------------------------------------------- |
| **01. 元件名稱**       | `ConsensusVisualizer`                                            |
| **02. 實體層級**       | 有機體 (Organism)                                                |
| **03. 起源 (Genesis)** | 將 ConsensusResult 轉成共識分數、agent opinions 與執行授權狀態。 |
| **04. 顧客旅程**       | **【共識決策期】** 讓管理者理解蜂群對策略路徑的投票與信心。      |
| **05. UI/UX 設計**     | **【共識核心 + 意見卡 + 授權條】** 使用環形動畫與 Brand UI。     |
| **06. 全端資料脈絡**   | `ConsensusResult` prop -> score/status/opinions -> UI。          |
| **07. 代理蜂群協同**   | 呈現 AGREE / DISAGREE / CONDITIONALLY_AGREE 意見與 confidence。  |
| **08. 全態異常降解**   | 弱共識時使用 amber 視覺狀態；仍展示意見以便人工判斷。            |
| **09. 全域權限治理**   | 執行授權狀態應由後端確認後再寫入；前端只做展示。                 |
| **10. 系統整合相依**   | Framer Motion、Brand UI、`lib/swarm-consensus-engine`。          |
| **11. 可溯源 (5T)**    | `components/ui/ConsensusVisualizer.tsx`                          |
| **12. 可追蹤 (5T)**    | opinion.agentId、vote、confidence、critique 全部展示。           |
| **13. 可驗算 (5T)**    | VOTE_META 固定映射 vote 到 icon/color/label。                    |
| **14. 可感知 (5T)**    | 分數環、旋轉軌道、意見卡與授權狀態。                             |
| **15. 不可篡改 (5T)**  | 只讀渲染 result，不修改共識資料。                                |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：蜂群共識視覺器已登入終極矩陣。              |

---

### 4. 永續、證據與零知識設施 (Sustain, Evidence & ZKP Facilities)

#### 4.1 永續報告生成器 (ReportBuilderUI)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                           |
| :--------------------- | :------------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `ReportBuilderUI`                                                                     |
| **02. 實體層級**       | 頁面級功能 (Page Feature)                                                             |
| **03. 起源 (Genesis)** | 將企業資訊、使用者資訊與 Evidence Vault 資料送進 `/api/generate-report` 生成報告。    |
| **04. 顧客旅程**       | **【報告生成期】** 一鍵產生 2026 年度永續報告預覽。                                   |
| **05. UI/UX 設計**     | **【生成引擎卡片 + Document Preview】** 使用 OmniBaseCard 與 OmniBadge。              |
| **06. 全端資料脈絡**   | localStorage company/user -> `/api/generate-report` -> document/chapters -> preview。 |
| **07. 代理蜂群協同**   | 報告生成由後端 API 負責，前端只觸發任務並展示結果。                                   |
| **08. 全態異常降解**   | 生成失敗顯示錯誤訊息；loading 時禁用按鈕並顯示 Loader2。                              |
| **09. 全域權限治理**   | 正式環境應由後端驗證使用者與公司權限；目前 localStorage 資訊不可作為信任來源。        |
| **10. 系統整合相依**   | Framer Motion、OmniBaseCard、OmniBadge、`/api/generate-report`。                      |
| **11. 可溯源 (5T)**    | `app/dashboard/report-builder/page.tsx`                                               |
| **12. 可追蹤 (5T)**    | task_ui_001、companyId、actorId、reportYear 傳入 API。                                |
| **13. 可驗算 (5T)**    | 成功狀態由 data.success 判斷；章節數由 chapters.length 展示。                         |
| **14. 可感知 (5T)**    | 生成按鈕、狀態徽章、錯誤提示與文件預覽。                                              |
| **15. 不可篡改 (5T)**  | 報告內容由後端生成，前端不直接改寫 document。                                         |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：永續報告生成器已登入終極矩陣。                                   |

#### 4.2 章節編輯器 (ChapterEditor)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                |
| :--------------------- | :------------------------------------------------------------------------- |
| **01. 元件名稱**       | `ChapterEditor`                                                            |
| **02. 實體層級**       | 有機體 (Organism)                                                          |
| **03. 起源 (Genesis)** | 將 SustainWrite 內容、AI 風格、章節歷史與匯出功能整合於單一編輯器。        |
| **04. 顧客旅程**       | **【章節編撰期】** 讓使用者針對單一章節擴寫、復原、重做與匯出。            |
| **05. UI/UX 設計**     | **【章節工具列 + TipTap 編輯器 + 匯出選單】**                              |
| **06. 全端資料脈絡**   | `useSustainWriteStore` -> OmniSustainWriteEditor -> document converters。  |
| **07. 代理蜂群協同**   | 透過 `expandContentWithAI` 與 `AiStyleSelector` 觸發代理擴寫。             |
| **08. 全態異常降解**   | 編輯器未就緒時提示；不支援格式時顯示提示。                                 |
| **09. 全域權限治理**   | 內容更新由 Zustand store 管理；正式環境應由後端權限與版本控制保護。        |
| **10. 系統整合相依**   | `OmniSustainWriteEditor`、`AiStyleSelector`、documentConverters、Zustand。 |
| **11. 可溯源 (5T)**    | `components/ChapterEditor.tsx`                                             |
| **12. 可追蹤 (5T)**    | chapterId、chapterName、chapterOrder、griRefs 串接內容歷史。               |
| **13. 可驗算 (5T)**    | 匯出格式由 select value 固定分支。                                         |
| **14. 可感知 (5T)**    | Undo/Redo、AI expansion、匯出選單與格式提示。                              |
| **15. 不可篡改 (5T)**  | 匯出從 editorRef 讀取，不直接改寫 store。                                  |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：章節編輯器已登入終極矩陣。                            |

#### 4.3 佐證上傳器 (OmniEvidenceUploader)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                         |
| :--------------------- | :---------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniEvidenceUploader`                                                              |
| **02. 實體層級**       | 有機體 (Organism)                                                                   |
| **03. 起源 (Genesis)** | 提供佐證檔案拖曳上傳、SHA-256 hash 計算與 Supabase Storage 寫入。                   |
| **04. 顧客旅程**       | **【證據提交期】** 讓使用者安全提交 PDF/PNG/JPG/CSV 佐證。                          |
| **05. UI/UX 設計**     | **【Evidence Vault Modal】** 拖曳區、hashing/uploading/success/error 狀態。         |
| **06. 全端資料脈絡**   | File -> SHA-256 -> Supabase `evidence_vault` -> publicUrl/hash callback。           |
| **07. 代理蜂群協同**   | 上傳成功後可將 evidence 回傳給報告或稽核流程。                                      |
| **08. 全態異常降解**   | Supabase bucket 不存在時模擬成功 URL，避免演示流程中斷。                            |
| **09. 全域權限治理**   | 正式環境應使用 RLS 與 authenticated user；目前 demo fallback 不應承載真實敏感資料。 |
| **10. 系統整合相依**   | Web Crypto SHA-256、Supabase client、Lucide-React。                                 |
| **11. 可溯源 (5T)**    | `components/omni/OmniEvidenceUploader.tsx`                                          |
| **12. 可追蹤 (5T)**    | fileHash、file name、uploadState、publicUrl callback 形成證據鏈。                   |
| **13. 可驗算 (5T)**    | hash 由 crypto.subtle.digest 固定 SHA-256 產生。                                    |
| **14. 可感知 (5T)**    | 拖曳高亮、旋轉進度、成功/失敗狀態與 Hash Lock 展示。                                |
| **15. 不可篡改 (5T)**  | Hash 先於上傳計算，公開 URL 不反向改寫 hash。                                       |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：佐證上傳器已登入終極矩陣。                                     |

#### 4.4 防禦儀表板 (OmniDefenseDashboard)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                       |
| :--------------------- | :-------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniDefenseDashboard`                                                            |
| **02. 實體層級**       | 頁面級功能 (Page Feature)                                                         |
| **03. 起源 (Genesis)** | 將 ColorDropStream 的 ZKP、降熵與事件流整合成安全防禦儀表板。                     |
| **04. 顧客旅程**       | **【安全監控期】** 讓管理者查看 ZKP 合規率、降熵指標與 Audit Trail。              |
| **05. UI/UX 設計**     | **【Security Ops Dashboard】** 三張 MetricCard + forensic replay + event stream。 |
| **06. 全端資料脈絡**   | `useColorDropStream` -> metrics/events/core -> dashboard UI。                     |
| **07. 代理蜂群協同**   | 事件流可觸發 Jules/QKP healing 或人工 forensic replay。                           |
| **08. 全態異常降解**   | 無事件時顯示等待 RLS 水合或即時事件流入；連線中斷顯示紅色狀態。                   |
| **09. 全域權限治理**   | 事件資料應受 RLS 過濾；replay 操作應由後端權限控制。                              |
| **10. 系統整合相依**   | `lib/hooks/useColorDropStream`、Framer Motion、OmniZKPBadge。                     |
| **11. 可溯源 (5T)**    | `components/omni/OmniDefenseDashboard.tsx`                                        |
| **12. 可追蹤 (5T)**    | event.id、event_type、source_origin、zkp_hash 展示。                              |
| **13. 可驗算 (5T)**    | 指標由 hook 提供，視覺狀態由 getVisualState 映射。                                |
| **14. 可感知 (5T)**    | 實時徽章、計量卡、事件顏色與時光倒流按鈕。                                        |
| **15. 不可篡改 (5T)**  | 儀表板只讀展示 stream，不直接改寫事件。                                           |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：防禦儀表板已登入終極矩陣。                                   |

#### 4.5 ZKP 徽章 (OmniZKPBadge)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                          |
| :--------------------- | :------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniZKPBadge`                                                       |
| **02. 實體層級**       | 分子 (Molecule)                                                      |
| **03. 起源 (Genesis)** | 將最新 ColorDropStream 事件轉成小型 ZKP 狀態徽章。                   |
| **04. 顧客旅程**       | **【狀態提示期】** 在儀表板或頁面 header 快速顯示 ZKP 是否即時有效。 |
| **05. UI/UX 設計**     | **【Live Status Pill】** 圓角 badge、live dot、hash 摘要與 icon。    |
| **06. 全端資料脈絡**   | `useColorDropStream` -> latestEvent -> visualState -> badge。        |
| **07. 代理蜂群協同**   | 當 event_type 為 `qkp:healing:required` 時切換警示 icon。            |
| **08. 全態異常降解**   | 無事件時顯示灰色待驗證狀態。                                         |
| **09. 全域權限治理**   | 只讀展示 stream 狀態；不暴露完整 hash。                              |
| **10. 系統整合相依**   | Framer Motion、Lucide-React、`lib/hooks/useColorDropStream`。        |
| **11. 可溯源 (5T)**    | `components/omni/OmniZKPBadge.tsx`                                   |
| **12. 可追蹤 (5T)**    | 最新 event.id 與 zkp_hash substring 展示。                           |
| **13. 可驗算 (5T)**    | visualState 由 event_type 映射 label/border/bg/glow。                |
| **14. 可感知 (5T)**    | live ping、狀態文字、hash 摘要與 Shield icon。                       |
| **15. 不可篡改 (5T)**  | 只截斷展示 hash，不修改事件。                                        |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：ZKP 徽章已登入終極矩陣。                        |

#### 4.6 ZKP 區間證明視覺器 (ZKPRangeProofVisualizer)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                     |
| :--------------------- | :------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `ZKPRangeProofVisualizer`                                                       |
| **02. 實體層級**       | 分子 (Molecule)                                                                 |
| **03. 起源 (Genesis)** | 將 SNARK range proof 的 public claim、signals、proof 與驗證結果視覺化。         |
| **04. 顧客旅程**       | **【隱私驗證期】** 讓稽核者確認數據在區間內，無需揭露 blinding factor。         |
| **05. UI/UX 設計**     | **【Proof Card + Audit Steps】** 顯示 public signals、Groth16 proof、驗證步驟。 |
| **06. 全端資料脈絡**   | `proof: ZKPRangeProof` -> `verifySnarkJSProof` -> `ZKPVerifyResult` -> UI。     |
| **07. 代理蜂群協同**   | 可作為 ZKP 合規任務的視覺驗證終端。                                             |
| **08. 全態異常降解**   | 無 snark proof 時執行 fallback delay，但仍產出驗證結果。                        |
| **09. 全域權限治理**   | proof 內容可能含敏感資料；正式環境應由後端脫敏與授權。                          |
| **10. 系統整合相依**   | `lib/crypto-proof`、Framer Motion、UI Card/Badge/Button。                       |
| **11. 可溯源 (5T)**    | `components/ui/ZKPRangeProofVisualizer.tsx`                                     |
| **12. 可追蹤 (5T)**    | publicSignals、commitment、snarkProof、timeTaken 展示。                         |
| **13. 可驗算 (5T)**    | 驗證步驟包含 public signal 長度、proof 解析、bilinear pairing。                 |
| **14. 可感知 (5T)**    | 驗證按鈕、徽章、步驟通過/失敗與時間顯示。                                       |
| **15. 不可篡改 (5T)**  | proof prop 為只讀輸入；結果由驗證函式產生。                                     |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：ZKP 區間證明視覺器已登入終極矩陣。                         |

---

### 5. 全域資料與整合設施 (Global Data & Integration Facilities)

#### 5.1 OmniBlue 資料網格 (OmniBlueDashboard)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                      |
| :--------------------- | :------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniBlueDashboard`                                                              |
| **02. 實體層級**       | 頁面級功能 (Page Feature)                                                        |
| **03. 起源 (Genesis)** | 同步 Supabase 與 NCBDB 資料，並以 VaultOmniTable 呈現 5T 資料網格。              |
| **04. 顧客旅程**       | **【資料治理期】** 讓管理者確認雙資料源是否同步與封印。                          |
| **05. UI/UX 設計**     | **【Data Mesh Card + Vault Table】** 藍色玻璃資料網格。                          |
| **06. 全端資料脈絡**   | `/api/omniblue` -> Supabase/NCBDB records -> VaultOmniTable。                    |
| **07. 代理蜂群協同**   | NCB_Agent 與 System 作為示範 author；正式環境應由代理任務寫入。                  |
| **08. 全態異常降解**   | API 或資料為空時產生 mock records，確保 UI 不崩潰。                              |
| **09. 全域權限治理**   | 正式環境應由後端權限與 RLS 限制資料來源。                                        |
| **10. 系統整合相依**   | OmniBaseCard、OmniButton、OmniBadge、VaultOmniTable。                            |
| **11. 可溯源 (5T)**    | `components/omni/OmniBlueDashboard.tsx`                                          |
| **12. 可追蹤 (5T)**    | records 包含 id、source、node、status、timestamp、author、zkpHash、fiveTStatus。 |
| **13. 可驗算 (5T)**    | 空資料時 mock records 固定兩筆。                                                 |
| **14. 可感知 (5T)**    | 同步按鈕、來源卡片、ZKP hash 與 5T 條。                                          |
| **15. 不可篡改 (5T)**  | UI 不直接改寫來源資料；只展示 API 回傳。                                         |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：OmniBlue 資料網格已登入終極矩陣。                           |

#### 5.2 5T 資料表格 (OmniTable)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                    |
| :--------------------- | :----------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniTable`                                                                    |
| **02. 實體層級**       | 有機體 (Organism)                                                              |
| **03. 起源 (Genesis)** | 將 ESG 資料行轉成可搜尋、可展開、可封印的 5T 表格。                            |
| **04. 顧客旅程**       | **【資料審查期】** 讓稽核者快速過濾、查看公式透明度與 hash lock。              |
| **05. UI/UX 設計**     | **【Liquid Interaction Table】** 搜尋工具列、可展開 trace details、Seal 按鈕。 |
| **06. 全端資料脈絡**   | `OmniTableDataRow[]` -> filter/expand/seal -> UI。                             |
| **07. 代理蜂群協同**   | `onSealAction` 可連接 OmniCore seal API。                                      |
| **08. 全態異常降解**   | 無資料時顯示 No 5T registered data found；seal 錯誤記錄於 console。            |
| **09. 全域權限治理**   | 封印動作應由後端權限確認；前端只傳遞 id。                                      |
| **10. 系統整合相依**   | Framer Motion、OmniBadge、Lucide-React。                                       |
| **11. 可溯源 (5T)**    | `components/omni/OmniTable.tsx`                                                |
| **12. 可追蹤 (5T)**    | row.id、source_origin、timestamp、hash、status 可追蹤。                        |
| **13. 可驗算 (5T)**    | filter 以 content/source_origin/hash 大小寫不敏感比對。                        |
| **14. 可感知 (5T)**    | 展開動畫、ZKP badge、公式透明度、Hash Lock。                                   |
| **15. 不可篡改 (5T)**  | row 資料為 props 輸入；前端不自行改寫 row。                                    |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：5T 資料表格已登入終極矩陣。                               |

#### 5.3 資料金庫表格 (VaultOmniTable)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                   |
| :--------------------- | :---------------------------------------------------------------------------- |
| **01. 元件名稱**       | `VaultOmniTable`                                                              |
| **02. 實體層級**       | 分子 (Molecule)                                                               |
| **03. 起源 (Genesis)** | 專用於 Vault/OmniBlue 的 ZKP sealed records 表格。                            |
| **04. 顧客旅程**       | **【金庫檢視期】** 快速查看 evidence/vault 資料是否具備 ZKP hash 與 5T 狀態。 |
| **05. UI/UX 設計**     | **【Vault Table】** 表頭狀態燈、hash 截斷、5T protocol bars。                 |
| **06. 全端資料脈絡**   | `VaultOmniTableRecord[]` -> table rows -> selectedRecord。                    |
| **07. 代理蜂群協同**   | 可承接 EvidenceUploader、OmniBlue、Audit 流程的 records。                     |
| **08. 全態異常降解**   | 空 records 時仍渲染表頭與空表格。                                             |
| **09. 全域權限治理**   | 金庫資料應由後端 RLS/權限過濾後提供。                                         |
| **10. 系統整合相依**   | Framer Motion、OmniButton、OmniBadge。                                        |
| **11. 可溯源 (5T)**    | `components/omni/VaultOmniTable.tsx`                                          |
| **12. 可追蹤 (5T)**    | record.id、zkpHash、timestamp、author、fiveTStatus 展示。                     |
| **13. 可驗算 (5T)**    | columns 映射 `record.data[col.key]`。                                         |
| **14. 可感知 (5T)**    | ZKP 圖示、hash 截斷、作者頭像、5T 條。                                        |
| **15. 不可篡改 (5T)**  | 只讀展示 records；selectedRecord 只影響展開狀態。                             |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：資料金庫表格已登入終極矩陣。                             |

#### 5.4 爬蟲任務控制 (ScraperControl)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                               |
| :--------------------- | :------------------------------------------------------------------------ |
| **01. 元件名稱**       | `ScraperControl`                                                          |
| **02. 實體層級**       | 有機體 (Organism)                                                         |
| **03. 起源 (Genesis)** | 控制 Omni-Scraper 對 TWSE ESG、TCFD、GRI 等來源採集。                     |
| **04. 顧客旅程**       | **【情報採集期】** 一鍵啟動單一或全局爬蟲任務並查看歷史。                 |
| **05. UI/UX 設計**     | **【Control Panel + Task History】** BrandCard、BrandButton、BrandBadge。 |
| **06. 全端資料脈絡**   | UI -> `/api/scraper` -> ScraperResult[] -> task history。                 |
| **07. 代理蜂群協同**   | 爬蟲結果進入 DataVisualizer 與報告/風險流程。                             |
| **08. 全態異常降解**   | API 失敗時 console 記錄；loadingTarget 解除避免永久卡住。                 |
| **09. 全域權限治理**   | 正式環境應限制爬蟲任務權限、來源白名單與頻率。                            |
| **10. 系統整合相依**   | Brand UI、Lucide-React、`/api/scraper`。                                  |
| **11. 可溯源 (5T)**    | `components/omni/ScraperControl.tsx`                                      |
| **12. 可追蹤 (5T)**    | task id、target、sourceUrl、timestamp、itemsScraped。                     |
| **13. 可驗算 (5T)**    | target 清單固定三項；`all` 觸發 scrape_all。                              |
| **14. 可感知 (5T)**    | 啟動按鈕、loading、成功/失敗 badge、來源連結。                            |
| **15. 不可篡改 (5T)**  | 歷史結果由 API 回傳；前端不自行改寫。                                     |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：爬蟲任務控制已登入終極矩陣。                         |

#### 5.5 資料視覺器 (DataVisualizer)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                              |
| :--------------------- | :----------------------------------------------------------------------- |
| **01. 元件名稱**       | `DataVisualizer`                                                         |
| **02. 實體層級**       | 有機體 (Organism)                                                        |
| **03. 起源 (Genesis)** | 將 scraped articles 轉成類別分佈、七日趨勢與 KPI 摘要。                  |
| **04. 顧客旅程**       | **【情報分析期】** 讓管理者理解採集覆蓋率、高風險文章與趨勢。            |
| **05. UI/UX 設計**     | **【Pie + Area Charts + KPI Cards】** Recharts 圖表與 BrandCard。        |
| **06. 全端資料脈絡**   | `listScrapedArticles(dataConnect, {})` -> distribution/trend -> charts。 |
| **07. 代理蜂群協同**   | 爬蟲任務產出 articles；資料視覺器負責分析與展示。                        |
| **08. 全態異常降解**   | dataConnect 缺失、API 錯誤或無資料時顯示明確空狀態。                     |
| **09. 全域權限治理**   | DataConnect 查詢應遵守後端資料權限；前端不應直接暴露敏感欄位。           |
| **10. 系統整合相依**   | Recharts、DataConnect generated client、date-fns、Brand UI。             |
| **11. 可溯源 (5T)**    | `components/omni/DataVisualizer.tsx`                                     |
| **12. 可追蹤 (5T)**    | totalArticles、highRisk、distributionData、trendData。                   |
| **13. 可驗算 (5T)**    | highRisk 由 impactLevel === 'high' 計算。                                |
| **14. 可感知 (5T)**    | 環圖、面積圖、KPI 卡片與錯誤提示。                                       |
| **15. 不可篡改 (5T)**  | 圖表只讀渲染 articles；不修改資料來源。                                  |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：資料視覺器已登入終極矩陣。                          |

#### 5.6 Hermes 整合面板 (HermesIntegrations)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                           |
| :--------------------- | :------------------------------------------------------------------------------------ |
| **01. 元件名稱**       | `HermesIntegrations`                                                                  |
| **02. 實體層級**       | 有機體 (Organism)                                                                     |
| **03. 起源 (Genesis)** | 管理 Google Workspace OAuth、郵件掃描與 Calendar 排程同步。                           |
| **04. 顧客旅程**       | **【外部整合期】** 讓企業授權 Hermes Agent 處理 ESG 郵件與會議。                      |
| **05. UI/UX 設計**     | **【Integration Card】** 連結狀態、授權帳號、掃描結果、同步結果。                     |
| **06. 全端資料脈絡**   | URL params + `/api/hermes/google/status` -> status；`/api/agent/tasks` -> scan/sync。 |
| **07. 代理蜂群協同**   | 觸發 email_processing 與 calendar_scheduling agent tasks。                            |
| **08. 全態異常降解**   | 授權失敗顯示錯誤；API 失敗時 alert 提示。                                             |
| **09. 全域權限治理**   | OAuth token 與 Workspace 權限必須由後端保管；前端不可存取 refresh token。             |
| **10. 系統整合相依**   | Brand UI、Next searchParams、Google OAuth route、Agent Tasks API。                    |
| **11. 可溯源 (5T)**    | `components/omni/HermesIntegrations.tsx`                                              |
| **12. 可追蹤 (5T)**    | connectedEmail、scanResult、calendarResult、status 追蹤。                             |
| **13. 可驗算 (5T)**    | hermes_success/google_workspace_connected 映射 connected。                            |
| **14. 可感知 (5T)**    | 連結按鈕、狀態卡、掃描/同步按鈕與結果預覽。                                           |
| **15. 不可篡改 (5T)**  | 前端只發起任務，不保存 OAuth secret。                                                 |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：Hermes 整合面板已登入終極矩陣。                                  |

#### 5.7 OmniAgent 排程 API (OmniAgent Schedule Route)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                             |
| :--------------------- | :-------------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `OmniAgent Schedule Route`                                                              |
| **02. 實體層級**       | API 功能設施 (API Facility)                                                             |
| **03. 起源 (Genesis)** | 提供 cron/manual 觸發 OmniCommander mission 的 REST API。                               |
| **04. 顧客旅程**       | **【自動排程期】** 定時同步、稽核、報告、遷移與安全掃描。                               |
| **05. UI/UX 設計**     | 無直接 UI；由排程工作流或外部 cron 呼叫。                                               |
| **06. 全端資料脈絡**   | POST/GET `/api/omni-agent-api/schedule?mission=...` -> OmniCommander -> notifications。 |
| **07. 代理蜂群協同**   | `OmniCommander(omniSwarm).command(mission, context)` 執行任務。                         |
| **08. 全態異常降解**   | 錯誤時回傳 status:error、推 bus event、嘗試 Slack/Telegram 通知。                       |
| **09. 全域權限治理**   | production 下要求 CRON_SECRET header/body/Bearer；dev 可手動觸發。                      |
| **10. 系統整合相依**   | Next.js Route Handler、OmniCommander、OmniSwarm、Slack/Telegram gateway。               |
| **11. 可溯源 (5T)**    | `app/api/omni-agent-api/schedule/route.ts`                                              |
| **12. 可追蹤 (5T)**    | mission、triggeredAt、source、completedAt、result 回傳。                                |
| **13. 可驗算 (5T)**    | VALID_MISSIONS as const 收斂合法任務。                                                  |
| **14. 可感知 (5T)**    | 透過通知與 bus events 讓 UI/監控感知排程結果。                                          |
| **15. 不可篡改 (5T)**  | secret 驗證保護自動觸發；任務結果由 commander 決定。                                    |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：OmniAgent 排程 API 已登入終極矩陣。                                |

#### 5.8 Energy Metrics 資料設施 (energy_metrics)

| 矩陣維度 (Dimension)   | 登錄內容 (Registry Details)                                                            |
| :--------------------- | :------------------------------------------------------------------------------------- |
| **01. 元件名稱**       | `energy_metrics`                                                                       |
| **02. 實體層級**       | 資料設施 (Data Facility)                                                               |
| **03. 起源 (Genesis)** | 建立能源用量與碳排資料表，支援 5T hash_lock 與不可更新策略。                           |
| **04. 顧客旅程**       | **【碳排資料入帳期】** 服務角色寫入能源/碳排指標，稽核角色讀取。                       |
| **05. UI/UX 設計**     | 無直接 UI；由能源/碳排頁面或儀表板查詢。                                               |
| **06. 全端資料脈絡**   | service_role INSERT -> energy_metrics -> authenticated SELECT -> dashboard/analytics。 |
| **07. 代理蜂群協同**   | 可作為碳排報告、環境議題與 materiality 分析的資料源。                                  |
| **08. 全態異常降解**   | UPDATE/DELETE 被 trigger 拒絕，要求以 insert-only 維持審計完整性。                     |
| **09. 全域權限治理**   | RLS：authenticated SELECT；service_role INSERT/SELECT。                                |
| **10. 系統整合相依**   | Supabase Postgres、RLS policies、daily_energy_summary materialized view。              |
| **11. 可溯源 (5T)**    | `supabase/migrations/001_create_energy_metrics_table.sql`                              |
| **12. 可追蹤 (5T)**    | id、created_at、service、timestamp、hash_lock、status。                                |
| **13. 可驗算 (5T)**    | prevent_energy_metrics_update trigger 禁止更新/刪除。                                  |
| **14. 可感知 (5T)**    | 透過儀表板或查詢 API 呈現 energy_consumption/carbon_emission。                         |
| **15. 不可篡改 (5T)**  | hash_lock NOT NULL；update/delete trigger 保護。                                       |
| **16. 終態 / 註記**    | `MATRIX_REGISTERED`：能源指標資料設施已登入終極矩陣。                                  |

---

### 6. 萬能 UI 原子補登 (Omni UI Atom Registry)

以下原子/分子元件已與平台功能共同完成終極矩陣註記，成為 ESGGO 全域 UI/UX 的標準構件。

| 類別           | 元件名稱                 | 主要功能                                  | 5T 狀態                 | 溯源路徑                                    | 終態註記            |
| :------------- | :----------------------- | :---------------------------------------- | :---------------------- | :------------------------------------------ | :------------------ |
| UI Atom        | `OmniButton`             | 統一按鈕、禁用、載入與觸控回饋。          | Traceable / Tangible    | `components/ui/omni/OmniButton.tsx`         | `MATRIX_REGISTERED` |
| UI Atom        | `OmniBadge`              | 狀態徽章、警示、成功、輪廓樣式。          | Traceable / Tangible    | `components/ui/omni/OmniBadge.tsx`          | `MATRIX_REGISTERED` |
| UI Atom        | `OmniInput`              | 表單輸入、錯誤提示與一致性邊界。          | Traceable / Tangible    | `components/ui/omni/OmniInput.tsx`          | `MATRIX_REGISTERED` |
| UI Atom        | `OmniTextarea`           | 多行文字輸入與報告欄位編輯。              | Traceable / Tangible    | `components/ui/omni/OmniTextarea.tsx`       | `MATRIX_REGISTERED` |
| UI Atom        | `OmniToggle`             | 布林開關與功能啟停。                      | Traceable / Tangible    | `components/ui/omni/OmniToggle.tsx`         | `MATRIX_REGISTERED` |
| UI Atom        | `OmniModal`              | 通用對話框、表單與確認流程。              | Traceable / Tangible    | `components/ui/omni/OmniModal.tsx`          | `MATRIX_REGISTERED` |
| UI Atom        | `OmniProgress`           | 任務進度、上傳進度與流程狀態。            | Trackable / Tangible    | `components/ui/omni/OmniProgress.tsx`       | `MATRIX_REGISTERED` |
| UI Atom        | `OmniStatusDot`          | 連線、存活與狀態燈號。                    | Trackable / Tangible    | `components/ui/omni/OmniStatusDot.tsx`      | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniForm`               | 表單容器、驗證與提交流程。                | Traceable / Transparent | `components/ui/omni/OmniForm.tsx`           | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniDB`                 | 資料庫狀態、連線與資料脈絡展示。          | Traceable / Transparent | `components/ui/omni/OmniDB.tsx`             | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniChart`              | 圖表與指標視覺化。                        | Traceable / Tangible    | `components/ui/omni/OmniChart.tsx`          | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniSearchBar`          | 全站搜尋、過濾與意圖輸入。                | Traceable / Tangible    | `components/omni/OmniSearchBar.tsx`         | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniMatrixInput`        | 多維度矩陣資料輸入與映射。                | Traceable / Transparent | `components/omni/OmniMatrixInput.tsx`       | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniKpiCard`            | KPI 卡片、趨勢與狀態摘要。                | Trackable / Tangible    | `components/omni/OmniKpiCard.tsx`           | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniBookCaseRegistry`   | 元件書櫃與知識資產展示。                  | Traceable / Transparent | `components/omni/OmniBookCaseRegistry.tsx`  | `MATRIX_REGISTERED` |
| UI Molecule    | `NoteSearch`             | 永續報告與知識庫深度搜尋。                | Traceable / Tangible    | `components/omni/NoteSearch.tsx`            | `MATRIX_REGISTERED` |
| UI Molecule    | `AiStyleSelector`        | AI 撰寫風格選擇與語氣控制。               | Traceable / Tangible    | `components/omni/AiStyleSelector.tsx`       | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniCardsDemo`          | 卡片樣式展示與設計語彙庫。                | Tangible / Trackable    | `components/omni/OmniCardsDemo.tsx`         | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniAgentCard`          | 單一代理能力、狀態與任務展示。            | Traceable / Trackable   | `components/omni/OmniAgentCard.tsx`         | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniThinkingChain`      | 代理推理鏈與透明思考展示。                | Traceable / Transparent | `components/omni/OmniThinkingChain.tsx`     | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniLHubWidget`         | L-Hub 代理共識與委派監控。                | Traceable / Trackable   | `components/ui/omni/OmniLHubWidget.tsx`     | `MATRIX_REGISTERED` |
| UI Molecule    | `OmniAllianceHub`        | 多代理結盟、任務分配與協作。              | Traceable / Trackable   | `components/omni/OmniAllianceHub.tsx`       | `MATRIX_REGISTERED` |
| Security UI    | `ShieldOfAbsoluteTruth`  | 數據封印與防篡改徽章。                    | Trustworthy / Tangible  | `components/omni/ShieldOfAbsoluteTruth.tsx` | `MATRIX_REGISTERED` |
| Security UI    | `OmniJulesPassiveGuard`  | Jules 被動防禦與因果協議展示。            | Trustworthy / Trackable | `components/omni/OmniJulesPassiveGuard.tsx` | `MATRIX_REGISTERED` |
| Security UI    | `OmniAuthOmni`           | 身份、權限與高階操作入口。                | Trustworthy / Traceable | `components/omni/OmniAuthOmni.tsx`          | `MATRIX_REGISTERED` |
| Security UI    | `Protocol5TStrip`        | 5T 協議狀態橫幅與快速檢查。               | Traceable / Transparent | `components/omni/Protocol5TStrip.tsx`       | `MATRIX_REGISTERED` |
| Integration UI | `HermesEvolutionPanel`   | Hermes 資料管線演化與效能面板。           | Traceable / Trackable   | `components/omni/HermesEvolutionPanel.tsx`  | `MATRIX_REGISTERED` |
| Integration UI | `ApolloStudioConsole`    | GraphQL/Apollo 整合與 API 測試終端。      | Traceable / Transparent | `components/omni/ApolloStudioConsole.tsx`   | `MATRIX_REGISTERED` |
| Factory UI     | `OmniFactory DSL 提交器` | 以 DSL 產生、驗證、封印並發布元件。       | Traceable / Trustworthy | `app/omni-factory/page.tsx`                 | `MATRIX_REGISTERED` |
| Audit UI       | `AuditCenterPage`        | 不可篡改日誌、hash lock 與 RLS 稽核。     | Traceable / Trustworthy | `app/dashboard/audit/page.tsx`              | `MATRIX_REGISTERED` |
| Feature UI     | `OmniNotesWorkspace`     | 萬能筆記、Markdown 與自發性任務追蹤看板。 | Traceable / Trackable   | `components/omni/OmniNotesWorkspace.tsx`    | `MATRIX_REGISTERED` |
| Page Feature   | `OmniNotesPage`          | 萬能筆記頁面樞紐與 5T 雙向同步入口。      | Traceable / Transparent | `app/omni-notes/page.tsx`                   | `MATRIX_REGISTERED` |

---

_全域超頻執行官：Antigravity_ _整合審核單位：JunAiKey (OmniCore)_
_升級時間：2026-06-14_
_完成註記：v3.1.0 Matrix Completion Pass 已補齊平台主要功能、功能設施、UI 原子與 API/DB 設施。_
