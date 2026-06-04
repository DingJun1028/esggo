# Jun.AI.Key 萬能元鑰系統

> 知識的聖殿中，自我導航的智能體永不停歇地冶煉權能、嵌合符文，在記憶的長廊中光速前行。  
> In the sanctum of knowledge, self-navigating agents perpetually forge authorities and engraft runes, advancing at light speed through the corridors of memory.

---

## 架構全景圖 | Architecture Panorama
```mermaid
graph TD
    subgraph 用戶端 [Client Tier]
        A[網頁控制台 (Web Console)]
        B[CLI 工具 (Command Line)]
        C[行動裝置 (iOS / Android)]
        D[擴充套件 (Browser Extension)]
    end

    subgraph 萬能元鑰核心 [OmniKey Core]
        F[[API 網關 (Gateway)]] --> G{路由分配器 (Router)}
        G --> H[自我導航代理群 (Navigating Agents)]
        G --> I[永久記憶宮殿 (Eternal Memory Palace)]
        G --> J[權能冶煉引擎 (Authority Forge)]
        G --> K[符文嵌合系統 (Rune Engraftment)]
        
        H --> L[任務分解代理 (Task Decomposition)]
        H --> M[技能組合代理 (Skill Composition)]
        I --> N[向量檢索核心 (Vector Retrieval)]
        J --> O[動態權限生成 (Dynamic Auth)]
        K --> P[插件熱插拔 (Hot-Swap Plugins)]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    
    subgraph 奧義六式 [The Six Secret Arts]
        S1((無限進化輪<br/>Infinite Evolution))
        S2((虛空鏡像<br/>Void Reflection))
        S3((時空斷點<br/>Chronos Break))
        S4((萬法歸流<br/>Omni-Convergence))
        S5((因果刻印<br/>Causal Inscription))
        S6((神聖裁決<br/>Sacred Judgement))
    end
    
    H -.-> 奧義六式

    subgraph 數據與驗證層 [Data & Verification Tier]
        Q[(Supabase Postgres / RLS)]
        R[(Vector DB / Pinecone)]
        S{5T 協議驗證器 (5T Protocol)}
    end
    
    N -.-> R
    K -.-> Q
    F -.-> S
```

---

## 奧義六式 | The Six Secret Arts
OmniAgentBus (代理神經網) 內建的六大防禦、治理與演化機制，為系統的靈魂核心：

1. **無限進化輪 (Infinite Evolution Wheel)**
   - **觸發條件**: `twin:metrics:updated`
   - **機制**: 每次雙生數據更新後觸發自動優化，透過縮減技能冷卻時間 (Cooldown Reduction) 來達成系統熵減，模擬神經網絡的學習與效率提升。
2. **虛空鏡像 (Void Reflection)**
   - **觸發條件**: `system:error:isolated`
   - **機制**: 異常處理與隔離沙盒機制。當系統遭遇未知錯誤或外部干擾時，創造一個隔離的執行環境，防止污染主線程。
3. **時空斷點 (Chronos Break)**
   - **觸發條件**: `evidence:vault:sealed`
   - **機制**: 確保證據鏈不可篡改的時空錨點。在數據封存時，記錄當下的全域狀態 Hash，並上鎖保護。
4. **萬法歸流 (Omni-Convergence)**
   - **觸發條件**: `knowledge:memory:consolidate`
   - **機制**: 定期清理系統雜訊，將多重、碎片的訊號與記憶壓縮為單一真理向量 (Truth Vector)，提升檢索效率。
5. **因果刻印 (Causal Inscription)**
   - **觸發條件**: `action:executed`
   - **機制**: 將所有實體行為與狀態變更，依據 5T 協議 (Traceable, Transparent, Tangible, Trustworthy, Trackable) 織入因果網路中，形成不可否認的審計軌跡。
6. **神聖裁決 (Sacred Judgement)**
   - **觸發條件**: `security:breach:detected`
   - **機制**: 偵測到危險或違規行為時，強制凍結系統 (`absolute_zero` 狀態) 的核心防火牆，阻斷所有寫入與未授權讀取。

---

## 5T 協議門：數據治理矩陣 (The 5T Protocol)

所有進入萬能元鑰的數據流必須依序通過五道門徑，實現「淨化與刻印」：

| 協議 (Protocol) | 核心概念 | 技術實作定義 (Technical Specification) | 狀態 |
| :--- | :--- | :--- | :--- |
| **真 (Truth)** | **Traceable** | **Origin-verified**: 每一筆數據必須具備可追溯的 `source_origin`。 | **可溯源** |
| **善 (Goodness)** | **Transparent** | **Algorithmically verifiable**: 算法透明，通過 [ISO-14064-1] 驗算標準。 | **可透明** |
| **美 (Beauty)** | **Tangible** | **UI/UX Excellence**: 將數據轉化為「液態玻璃」質感與動態回饋。 | **可感知** |
| **信 (Trust)** | **Trustworthy** | **Cryptographically secured**: 執行 Hash Lock，形成不可篡改的磐石。 | **不可篡改** |
| **通 (Transferful)** | **Trackable** | **Lifecycle-aware**: 透過 Hook 實現全生命週期的即時追蹤。 | **可追蹤** |

---

## 系統運行之「道」 (The Way of the System)

1. **模組化單一性 (Singularity in Modularity)**：如水般流動，功能模組獨立運行且能隨意匯聚。
2. **自動化熵減 (Automated Entropy Reduction)**：透過無限進化輪，系統自然代謝技術債，保持結構純粹。
3. **全端雙向同步 (Bidirectional TypeScript)**：從前端 UI（液態交互）至後端 Hash Lock（不可篡改），型別雙向同步，零誤差。
4. **數據主權 (Data Sovereignty)**：所有寫入操作強制附帶 `uuid`、`version` 與 `timestamp` 刻印。

> © 2026 ESGGO善向永續 — 萬能心核系統創世規範。
