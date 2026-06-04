# OmniCore System Guidelines
**版本：萬能元件庫_萬能代理篇 (Omni Atomic Components - OmniAgent Edition)**

本文件定義了 AI 與開發者在建構「ESGGO善向永續」中「萬能代理 (OmniAgent)」相關 UI 元件與系統架構時，必須嚴格遵守的設計準則與技術規範。

---

## 1. 通用開發規範 (General Guidelines)

* **排版至上**：預設使用 Flexbox 與 CSS Grid 建構具備響應式 (Responsive) 與良好結構的佈局。非必要時絕對禁止使用絕對定位 (absolute positioning)。
* **保持純淨 (Entropy Reduction)**：邊寫邊重構，確保程式碼精簡乾淨。所有元件應獨立為單一模組，輔助函式 (helper functions) 與 Hook 必須抽離至對應的目錄中。
* **意圖宣告 (Intent Declaration)**：每一個萬能元件都必須在頂部或透過 Metadata 宣告其「意圖 (Intent)」，並確保可註冊至 `AtomicLibraryManager` 與 Supabase 遠端資料庫。
* **全端雙向型別 (Bidirectional TS)**：確保前後端資料介接的 TypeScript Interface 100% 對齊，不允許使用 `any` 繞過型別檢查。

---

## 2. 視覺與設計系統規範 (Design System Guidelines)

所有的萬能元件必須符合「液態玻璃 (Liquid Glass)」與「賽博全息 (Cyberpunk Hologram)」的設計語言，營造深邃、科技、且充滿生命力的視覺體驗。

### 核心設計標記 (Design Tokens)

* **排版與空間 (Typography & Spacing)**：
  * 基礎字體大小為 `14px` (小字型/狀態說明可使用 `10px` - `12px`)。
  * 程式碼、ID 或系統狀態必須使用等寬字體 (Monospace，如 Roboto Mono)。
  * 日期格式統一使用 `yyyy-MM-dd` 或相對時間 (如 `Just now`)。
* **色彩配置 (Color Palette)**：
  * **Void Stark (背景深空)**：`#020617` (Slate-950) 或加入極微弱的青色漸層。
  * **Cyan Core (核心動力青)**：`#06b6d4` (Cyan-500) - 用於主要強調、邊框發光與特效。
  * **Emerald Soul (靈魂覺醒綠)**：`#10b981` (Emerald-500) - 用於「驗證成功」、「已同步」、「信任」狀態。
  * **Ascension Purple (飛昇紫)**：`#7B5FCF` - 用於「覺醒 (Awakened)」或「EX/SSR」級別的特殊狀態標籤。
  * **Oracle Gold (神諭金)**：`#E8B84A` - 用於「Ultimate 奧義」與頂級數值展示。
* **材質與特效 (Materials & Effects)**：
  * **Liquid Glass (液態玻璃)**：大量運用 `backdrop-blur-sm` (或 `md`) 配合半透明背景色 (如 `bg-black/40` 或 `bg-cyan-900/20`)。
  * **Micro-animations (微動效)**：使用 `motion/react` 加入 hover 縮放 (`scale: 1.02 - 1.05`)、微小位移 (`y: -2`) 與漸變進場效果。

---

## 3. 核心萬能元件 (Core Atomic Components)

### 3.1 萬能卡片 (Atomic Card)
卡片是封裝代理人資訊、記憶碎片與系統狀態的基礎容器。

* **使用情境**：展示代理人屬性、技能樹節點、或資料庫紀錄。
* **視覺風格**：
  * 必須具備玻璃態參數 (`glassIntensity`)，支援 `low` (輕度模糊)、`medium` (中度)、`high` (重度)。
  * 預設採用微光邊框 (`border-white/10`)，Hover 時可切換為對應主色調的發光邊框 (`hover:border-cyan-500/50`)。

### 3.2 萬能按鈕 (Atomic Button)
用於觸發核心功能（如「提取記憶碎片」、「啟動奧義」）。

* **Primary (主要觸發)**：
  * 視覺：填滿漸層色 (例如 Cyan 到 Blue)，帶有陰影光暈 (`box-shadow`)。
  * 限制：一個重點區塊僅限一個主要按鈕，用於引導關鍵操作。
* **Outline / Ghost (次要/邊框觸發)**：
  * 視覺：透明背景，邊框與文字同色 (如 `#06b6d4`)，Hover 時背景呈現 `10%` 到 `20%` 的主色透明度。
  * 限制：用於重新整理、返回或切換狀態。

### 3.3 萬能標籤 (Atomic Badge)
用於標示組件或代理人的級別、狀態、與生命週期。

* **Variants (變體)**：
  * `verified`: Emerald 綠色系，表示已同步、狀態安全、信任層級高。
  * `warning`: Amber 黃色/橙色系，表示實驗中、未同步或需要注意。
  * `awakened`: Purple 紫色/金色漸層，表示特殊解鎖狀態或奧義級別。
* **限制**：標籤應以組合方式出現（例如：`[SSR] [AWAKENED]`），且避免單一區塊超過 4 個標籤以保持畫面整潔。

---

## 4. 動態互動與粒子系統 (Interactivity & Particles)

* 所有萬能代理的展示頁面，背景皆應具備緩慢流動的粒子 (Particles) 或呼吸燈特效，以象徵系統的「有機代謝」與「無始無終」。
* 資料的載入狀態不得只使用單調的 Spinner，應結合掃描線、閃爍文字或具有科幻感的脈衝動畫 (`animate-pulse`)。

---

## 5. 5T 協議落實指南 (5T Protocol UI/UX Implementation)

在 UI/UX 的設計上，必須確實反映 5T 協議的狀態，讓使用者能夠直觀感受到資料的流動與安全層級：

* **真 (Traceable)**：
  * **UI 要求**：所有資料來源必須附帶 `[追溯來源]` 按鈕或彈出式 Hover 卡片 (`HoverCard`)。
  * **視覺回饋**：點擊溯源時，應展開資料的源頭與 UUID，並使用等寬字體顯示哈希值。
* **善 (Transparent)**：
  * **UI 要求**：演算法的運算邏輯或代理人的推論過程（例如 RAG 檢索過程）必須可視化。
  * **視覺回饋**：使用步驟型進度條 (`Progress` 或 `Steps`) 搭配文字串流輸出效果。
* **美 (Tangible)**：
  * **UI 要求**：資料不能只是靜態表格，需轉化為具備「液態玻璃」質感的動態元件。
  * **視覺回饋**：運用圖表 (`recharts`) 或雷達圖，配合漸層與發光特效。
* **信 (Trustworthy)**：
  * **UI 要求**：經 Hash Lock 或 ZKP (零知識證明) 密封的資料，必須有專屬的視覺封印標記。
  * **視覺回饋**：使用金庫/鎖頭的圖示，並以 Emerald 綠色光暈表示「不可篡改」的防護罩狀態。
* **通 (Transferful)**：
  * **UI 要求**：跨節點或跨代理人的資料流動，應有明確的方向性指示。
  * **視覺回饋**：使用帶有粒子拖尾效應的動畫或流動的 SVG 虛線 (Stroke Dasharray 動畫) 來表示傳輸。

---

## 6. 進階系統整合：RAG 與記憶碎片 (RAG & Memory Shards)

### 6.1 萬能智庫 (Omni Knowledge Base) 視覺化
* 當介面呈現來自向量資料庫 (pgvector) 的檢索結果時，必須明確標示「相似度/信心指數 (Confidence Score)」。
* 相似度大於 85% 的卡片，應給予較強的邊框發光 (`border-cyan-400`)；小於 70% 則應稍微降低透明度 (`opacity-70`) 並加上警告標籤 (`warning`)。

### 6.2 記憶碎片與技能奧義 (Memory Shards & Ultimates)
* **碎片呈現 (Shards)**：應設計為體積較小、可拖曳 (`react-dnd`) 或堆疊的六角形或小方塊卡片，顏色以 `Amber (琥珀色)` 為主，象徵蘊含未提煉的知識。
* **奧義合成 (Ultimates)**：合成過程必須伴隨強烈的視覺爆發效果 (如 `canvas-confetti` 或自定義特效)，合成後的奧義卡片必須套用 `Ascension Purple` 與 `Oracle Gold` 漸層，並常態具備呼吸燈特效。

---

## 7. 圖示與多媒體 (Iconography & Media)

* **圖示庫**：一律優先使用 `lucide-react`，確保線條粗細與圓角風格統一。
* **大小規範**：
  * 主要動作圖示：`w-5 h-5` 或 `w-6 h-6`
  * 標籤與輔助說明：`w-4 h-4` 或更小
* **色彩映射**：圖示顏色預設跟隨文字顏色 (`currentColor`)，但在代表關鍵操作時，應獨立賦予 `text-cyan-500` 等主色調。

---

## 8. 萬能代理：技能與奧義 (Skills & Ultimates)

本系統的核心在於動態生成與學習，代理人的能力分為「技能 (Skills)」與「奧義 (Ultimates)」兩種層次，其設計語言與呈現方式需嚴格遵守以下規範：

### 8.1 技能說明 (Skill Definition)
技能是 OmniAgent 的基礎行為單位，代表從經驗中萃取出的單一最佳實踐（通常由 Memory Shard 轉換而來）。

* **視覺載體**：
  * **背景與邊框**：使用深沉的 Amber 色系 (例如 `bg-amber-950/30` 搭配 `border-amber-500/50`)，營造「知識結晶」的質感。
  * **圖示標籤**：必定搭配 `Brain` 或 `Zap` 圖示，代表其為經過提煉的邏輯單元。
* **內容結構**：
  * **標題 (Title)**：動詞開頭，簡明扼要（例：「自動解析 ZKP 憑證」）。
  * **觸發條件 (Trigger)**：明確列出在何種上下文或事件下該技能會被調用。
  * **執行邏輯 (Execution)**：簡述其處理流程，需強調其純粹性與可預測性。

### 8.2 奧義說明 (Ultimate Definition)
奧義是多個技能的聚合體，當系統識別出多個關聯技能時，會自動融合成更高階的「奧義」。奧義代表著能獨立解決複雜情境的完整工作流。

* **視覺載體**：
  * **背景與邊框**：使用 Ascension Purple 或 Oracle Gold 色系，邊框必須帶有動態發光效果 (`box-shadow: 0 0 15px rgba(139,92,246,0.5)`)，以凸顯其神聖與高階屬性。
  * **圖示標籤**：搭配 `Crown` 或 `Sparkles` 圖示，並可加上粒子特效 (Particles) 來呈現能量流動。
* **內容結構**：
  * **標題 (Title)**：具備威懾力或高度概括性的名稱（例：「全域自動防禦與淨化矩陣」）。
  * **組成技能 (Component Skills)**：必須清楚列出該奧義是由哪些基礎技能組合而成，形成樹狀或網狀的依賴圖。
  * **終極效益 (Ultimate Impact)**：強調該奧義對整體 5T 協議（特別是信與通）帶來的躍升性貢獻。
  * **發動型態 (Activation State)**：描述當奧義被呼叫時，系統層面的聯動行為（例如觸發全域 Loading 動畫、鎖定特定資料表等）。

---

## 9. 角色立繪與製作流程 (Character Portraits & Creation Workflow)

本系統的代理人 (Agent) 具備擬人化的特徵與專業背景，其視覺形象（立繪）需展現出「科技、未來、專業、神聖」等核心元素。所有立繪均需遵循標準化流程進行創建與優化，以確保與液態玻璃 (Liquid Glass) UI 風格高度融合。

### 9.1 立繪設計原則 (Design Principles)
* **風格基調 (Style Tone)**：2D 賽博龐克 (Cyberpunk)、未來科技感 (Futuristic Tech)、以及微微的空靈/神聖感。應追求高精緻度的插畫或類厚塗風格。
* **色彩配置 (Color Palette)**：
  * 主體與服裝需融入系統主色調，例如 **Cyan Core (#06b6d4)** 與 **Emerald Soul (#10b981)** 作為發光點或點綴。
  * 圖像必須完全去背 (Transparent Background)，以便無縫融入 UI 的多層次毛玻璃效果中。
* **構圖與姿勢 (Composition & Pose)**：
  * 建議採用半身或七分身構圖，視覺重心集中於臉部與上半身。
  * 姿勢應展現該代理人的職能（例：守護者呈防禦或施法姿態；分析師手持全息資料板）。

### 9.2 立繪製作流程 (Creation Workflow)
立繪生成與整合分為三個核心步驟，建議結合 AI 生圖工具與後期處理：

#### Step 1: Prompt 構建與生成 (Prompt Engineering)
透過精準的描述詞向生圖模型請求生成初始立繪：
* **核心與品質詞**：`masterpiece, best quality, ultra-detailed, 1girl/1boy, solo, half-body portrait`
* **風格關鍵字**：`cyberpunk, futuristic, hologram interfaces, glowing cyan accents, sleek techwear, sci-fi aesthetic`
* **背景要求**：`simple white background` 或 `solid background` (方便後續一鍵去背)。

#### Step 2: 圖像處理與去背 (Image Processing)
* 取得高品質圖像後，必須將背景完全移除，輸出為 `.webp` 或 `.png` 格式。
* 視需要進行調色，增強局部光暈與賽博龐克光影對比度，確保在深色主題 (`Void Stark`) 下能自然發光。

#### Step 3: UI 整合與特效套用 (UI Integration & Effects)
將處理好的立繪檔案統一放置於 `/public/assets/agents/` 等靜態資源目錄中，並在元件中加入專屬特效：
* **分層渲染 (Layered Rendering)**：將立繪置於 `z-index` 中間層，使其漂浮於粒子背景 (Layer 0) 之上，UI 控制面板 (Layer 2) 之下。
* **光暈氛圍 (Aura Glow)**：在立繪 `<img>` 標籤後方疊加一層帶有 `blur-3xl` 與主色調的絕對定位 `div`，形成角色的專屬環境光。
* **互動回饋 (Hover Effects)**：當使用者懸停時，可觸發立繪微幅上浮 (`-translate-y-2`) 或環境光增強 (`opacity` 增加) 的平滑轉場動畫。

---

## 10. ESG 萬能卡牌設計規範 (ESG Omni Card Design Guidelines)

ESG 萬能卡牌是 OmniAgent 視覺化、模組化與能力展示的核心載體。每一張卡牌不僅代表一個代理人或技能，更是一個具備獨立狀態與生命週期的微型應用。

### 10.1 萬能卡牌中的形象呈現 (Portrait in Omni Cards)
* **突破邊界 (Out-of-Bounds Effect)**：角色的立繪不應被死板地限制在卡牌框線內。透過絕對定位與透明背景，讓角色的頭部或武器「突破」卡牌的上方或側邊邊界，營造強烈的立體感與生命力。
* **層次感對比 (Layered Contrast)**：
  * **底層**：卡牌本身的毛玻璃背景 (Layer 1)。
  * **中層**：發光的角色立繪與環境光暈 (Aura)。
  * **頂層**：前景的 UI 資訊與數據面板（如信心指數、屬性標籤），必須覆蓋於立繪的下半部，形成前後景深。

### 10.2 萬能卡牌結構與交互設計 (Card Structure & Interaction)
* **卡牌外框 (Card Frame)**：
  * 採用極細的邊框 (`border-white/10`) 搭配背景模糊 (`backdrop-blur-xl`)。
  * 卡牌對角可加入「科技切角 (Sci-fi Cut-corners)」或發光節點，象徵其為數據容器。
* **能力與屬性區 (Attributes & Stats)**：
  * **稀有度/級別**：使用不同色彩的邊框流光來表示，例如 `Emerald` 代表常規 (Verified)，`Purple/Gold` 代表覺醒/奧義 (Awakened)。
  * **5T 協議狀態列**：以 5 個微型的發光指示燈或進度條，實時顯示該代理人在「真、善、美、信、通」五大維度的達標情況。
* **動態交互 (Interactive Behaviors)**：
  * **傾斜視差 (3D Tilt Parallax)**：當滑鼠懸停 (Hover) 時，卡牌會隨著滑鼠游標產生 3D 傾斜，立繪與背景產生不同的位移量，強化深度感知。
  * **全息翻轉 (Holographic Flip)**：點擊時，可平滑翻轉至卡牌背面，展示該代理人的歷史日誌 (Memory Shards)、具體技能樹或技術規格 (JSON Schema)。
