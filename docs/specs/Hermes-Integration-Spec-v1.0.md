---
uuid: "867d86ea-0203-4aaf-81d2-e644491acdfc"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.506Z"
evidence: "docs\specs\Hermes-Integration-Spec-v1.0.md"
---
# Hermes × ESG GO 整合規格書 v1.0

## 一、文件目的
本規格書用於定義 Hermes 寫入 ESG GO / InfoOne 平台時的正確整合位階、責任邊界、資料流、治理控制、審計要求與技術實作方向。核心目標不是把 Hermes 當成平台本體，而是將其納入「可治理、可驗證、可追溯、可審核」的代理執行層，避免平台設計崩壞、權限穿透、資料失控或產出不可驗證的內容。

## 二、核心定位
* **ESG GO 是主平台**
* **InfoOne v8.1.0 是主要操作與治理介面**
* **Hermes 是 Agent Runtime，不是唯一真相來源**
* Hermes 的任務是執行、協助、整理、生成與比對
* 所有正式資料寫入、發布、簽核與審計，都必須回到 ESG GO 的治理流程內完成

## 三、整合總原則
1. **平台主權原則**：Hermes 不可主導平台資料模型、角色權限、送審流程與正式揭露結構。平台主權必須掌握在 ESG GO / InfoOne。
2. **治理優先原則**：Hermes 的任何輸出，若涉及正式報告、合規判定、證據映射、課程教材更新或任務狀態改變，都必須經治理層審核與授權。
3. **防崩壞原則**：不可讓 Hermes 直接跨越 UI、API Gateway、Policy Guard、Audit Log 與 Evidence Vault。整合路徑必須明確，不可偷接。
4. **可追溯原則**：所有 Hermes 執行過程至少要留下任務來源、輸入資料引用、使用模型、產出結果、審核狀態、執行時間、執行人或觸發來源。
5. **正式與草稿分離原則**：Hermes 只能優先處理草稿態、候選態與建議態內容。正式態內容必須由人工審核或受控流程提升狀態。

## 四、Hermes 在平台中的位階
1. **建議分層架構**
   * **Presentation Layer**: ESG GO Web, ESG GO Admin, 課程端, 顧問端
   * **Application Layer**: Report Service, Compliance Service, Evidence Mapping Service, Course Support Service, Task Orchestration Service
   * **Agent Orchestration Layer**: Hermes Runtime, Agent Router, Skill Registry, Session Manager, Execution Controller
   * **Governance Layer**: Policy Guard, Role Permission, Approval Flow, Audit Log, Version Control, RLS
   * **Trust Layer**: 5T Protocol, Hash Lock, Evidence Vault, Timestamp Proof
   * **Data Layer**: ESG Report Data, Compliance Knowledge Base, Evidence Files, Course Content, User Task Data

2. **正確理解**
   * Hermes 屬於 Agent Orchestration Layer
   * Hermes 不直接屬於 Trust Layer
   * Hermes 也不應直接操作 Data Layer
   * Hermes 必須經由 Application Layer 與 Governance Layer 間接讀寫資料

## 五、Hermes 可承接的任務範圍
1. **報告草稿生成**：根據既有資料生成 ESG 段落草稿、章節摘要、初版敘事、標準對照草稿（不直接發佈正式版本）。
2. **合規檢查輔助**：比對 GRI / SASB / TCFD / 在地揭露框架，找出缺漏欄位，標註高風險不一致段落，生成待人工確認的修正建議。
3. **證據映射整理**：幫段落對應附件，幫附件建立索引，幫證據與指標建立 mapping 草稿（不可直接把證據視為已驗證事實）。
4. **課程助教支援**：課程 FAQ 生成，講義摘要，課後問答整理，教材索引與知識路徑建議。
5. **任務規劃與拆解**：將大型永續專案拆成子任務，生成里程碑草稿，協助追蹤待補資料與待確認節點。

## 六、Hermes 不可直接承接的任務
1. 正式揭露文件最終簽核
2. 正式法遵結論定版
3. 不可逆證據上鏈操作的單獨決策
4. 金流、授權、正式提交與法定送件
5. 未經授權的跨租戶或跨角色資料存取
6. 直接覆寫正式資料表中的已核定內容

## 七、資料流規格
1. **基本資料流**
   * 使用者於 ESG GO 前台提出任務
   * Application Layer 建立 Agent Task
   * Governance Layer 先做權限檢查與政策判斷
   * Hermes 收到受控任務 payload
   * Hermes 產生結果並回傳
   * 結果寫入 Draft Store 或 Candidate Store
   * 人工或規則引擎做審核
   * 通過後才可進入正式資料區
2. **禁止資料流**
   * Hermes 直接連正式主資料庫
   * Hermes 直接修改 Published Report
   * Hermes 跳過審核直接寫入 Evidence Vault 最終區
   * Hermes 未記錄執行資訊就產出正式結果

## 八、治理控制點
1. **Policy Guard**：判斷任務合法性、人工複核需求、資料讀取範圍、寫入狀態層級。
2. **Approval Flow**：正式報告、合規結論、對外輸出、證據映射、教材更新等必須人工審核。
3. **Audit Log**：記錄 execution_id, task_type, input_ref_ids, output_ref_ids, trigger_source, runtime_name, model_provider, model_name, reviewer_id, status, started_at, finished_at。
4. **Version Control**：草稿要有版本號，不可覆蓋前版。

## 九、狀態機設計
1. **建議狀態**：`queued`, `running`, `draft_generated`, `awaiting_review`, `approved`, `rejected`, `published`, `archived`
2. **防崩壞要求**：
   * 不可從 `running` 跳到 `published`
   * `draft_generated` 後必須可追查輸入
   * `approved` 與 `published` 必須分開
   * `rejected` 不可自動覆蓋為 `approved`

## 十、全端雙向 TypeScript 型別建議
(詳見規範原文中的 `HermesTaskType`, `HermesExecutionStatus`, `HermesExecutionRecord`, `DraftArtifact`)

## 十一、API 邊界建議
1. **只開受控 API，不開資料庫直連** (`POST /agent-tasks`, `GET /agent-tasks/:id/execute`, `POST /agent-executions/:id/review`, `POST /draft-artifacts/:id/promote`)
2. **API 原則**：role check, 日誌產生, promote 獨立, execution 與 publish 分離。

## 十二、UI/UX 防崩壞要求
1. 前台必須明確標示內容狀態（草稿、待審核、已核准、已發布）
2. 不可讓使用者誤以為 AI 產出就是正式答案，顯示來源任務、產出時間、版本、審核狀態
3. 審核與發布按鈕必須分離

## 十三、導入優先順序建議
1. **Phase 1**: 報告草稿生成與 FAQ 助理 (風險最低)
2. **Phase 2**: 合規比對與證據映射 (需同步補強審計與版本控制)
3. **Phase 3**: 任務編排、自動追蹤與進階代理能力 (需治理補齊)

## 十四、結論
Hermes 應被定義為 Agent Runtime，不是主資料核心、審核核心或發布核心。守住治理層、審計層、狀態機、權限邊界、正式與草稿態分離，Hermes 就能成為 ESG GO 的加速器。
