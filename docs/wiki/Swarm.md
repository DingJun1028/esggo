# 代理人蜂群 Agent Swarm
路徑： /swarm | 權限： SYSTEM_ADMIN, DEV | 所屬旅程： 核心概念與架構

1. 模組定位 (Core Purpose)
Agent Swarm 是 ESGGO 系統的「執行部隊」，由一群具備單一專業權能的自治代理人組成。透過 OmniAgent Bus 進行協作，它們能並行處理海量任務（如數據採集、風險評估、ZKP 生成），實現系統的高效運作。

2. 客戶旅程與 UX 體驗 (Customer Journey & UX)
目標對象與痛點： 系統管理員與開發者。當系統面臨突發的高流量數據寫入或複雜的合規檢查時，單一線性處理會導致瓶頸。
體驗高光時刻 (Aha Moment)： 在 /swarm 監控介面中，看到數十個代理人節點同時閃爍，並行完成「證據封裝」與「ZKP 證明生成」，那種「數位軍團」的協作美感是本模組的巔峰體驗。
操作軌跡：
1. 系統派發一個複合型任務（如：年度報告合規檢查）。
2. Task Decomposer 代理人將任務分解為原子子項。
3. 透過 Bus 廣播，各專業代理人（Risk Assessor, Auditor, Linker）領取任務。
4. 各節點並行執行並回傳成果。
5. 最終由 Aggregator 代理人彙整結果並反饋給 JunAiKey。

3. UI/UX 視覺與 RWD 基準 (Visual & RWD Baseline)
桌面版佈局： **蜂巢式動態拓撲圖**。每個代理人是一個六角形節點，線條代表實時通訊流。
核心液態玻璃元件： AgentNode (六角形發光節點)、TrafficLine (動態流動線條)、BusTerminal (指令總線監控面板)。
行動端適配 (RWD)： 轉化為「狀態列表」，顯示各代理人群組的存活率 (Health) 與負載 (Load)。

4. 核心邏輯與 5T 協定 (Logic & 5T Protocol)
資料流向： Task Queue -> Agent Swarm -> Result Aggregation -> Audit Log.
5T 實踐點：
[T3 Trackable 追蹤]： 透過 Hook 全程追蹤代理人的行為軌跡與執行時間。
[T4 Transparent 透明]： 每個代理人的任務領取與成果上報皆公開透明。

5. 功能項目解說和使用技術 (Features & Tech Stack)
*   **多智能體編排 (Multi-Agent Orchestration)**：基於 Genkit 與客製化 Agent Bus。
*   **動態負載平衡**：根據代理人當前負載動態分配權重。
*   **自治恢復機制**：若某一代理人節點失效，Swarm 自動重新分配其任務。

6. 品質達標與驗收紅線 (QA Red Lines)
🚨 邏輯紅線： 嚴禁出現「循環代理死結」，系統必須具備超時強制終止機制 (TTL)。
🚨 性能紅線： 代理人之間的通信延遲必須控制在 50ms 以內。

7. 矩陣關聯 (Matrix Connection)
上游數據： 來自 `JunAiKey` 的分配指令。
下游影響： 處理後的數據流向 `/vault` (封裝) 與 `/editor` (同步)。
依賴組件： AgentNode, TrafficLine, BusTerminal.
