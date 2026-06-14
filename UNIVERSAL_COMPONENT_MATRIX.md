# ESGGO Platform - 萬能元件·終極矩陣

> 每一項功能/頁面對應之核心「萬能元件」，確保跨域複用、一致 UI/UX、型別安全、可測試、可觀測。

| #   | 功能 / 頁面       | 路由                               | 萬能元件                      | 狀態    | 備註                         |
| --- | ----------------- | ---------------------------------- | ----------------------------- | ------- | ---------------------------- |
| 1   | 首頁儀表板        | `/`                                | `DashboardShell`              | ✅ 完成 | 整合 KPI、快捷入口、即時通知 |
| 2   | 登入/驗證         | `/login`                           | `AuthGate` + `OAuthProviders` | ✅ 完成 | 多因子、SSO、Magic Link      |
| 3   | ESG 素性評估      | `/materiality`                     | `MaterialityMatrix`           | ✅ 完成 | 雙軸散佈、拖曳權重           |
| 4   | 碳熱力圖          | `/carbon-heatmap`                  | `CarbonHeatmap`               | ✅ 完成 | GeoJSON + WebGL 渲染         |
| 5   | CBAM 計算器       | `/cbam-calculator`                 | `CbamCalculator`              | ✅ 完成 | 即時試算、匯出 PDF           |
| 6   | 供應鏈追溯        | `/supply-chain`                    | `SupplyChainGraph`            | ✅ 完成 | D3 力導向圖、節點詳情        |
| 7   | 數位雙生          | `/digital-twin`                    | `DigitalTwinCanvas`           | ✅ 完成 | Three.js 場景、即時同步      |
| 8   | 合規檢核          | `/compliance-check`                | `ComplianceChecklist`         | ✅ 完成 | 規則引擎、差異報表           |
| 9   | 審計驗證          | `/audit-verify`                    | `AuditVerification`           | ✅ 完成 | 區塊鏈錨定、ZKP 證明         |
| 10  | AI 智能顧問       | `/advisory`                        | `AdvisoryChat`                | ✅ 完成 | RAG + Tool Calling           |
| 11  | 代理人協作        | `/agents`                          | `AgentSwarm`                  | ✅ 完成 | 多 Agent 編排、事件總線      |
| 12  | 思維實驗室        | `/think-tank`                      | `ThinkTankBoard`              | ✅ 完成 | 白板、便利貼、投票           |
| 13  | 永續撰寫室        | `/sustain-write`                   | `SustainWriteEditor`          | ✅ 完成 | 區塊編輯器、版本控制         |
| 14  | 文件核對清單      | `/document-checklist`              | `DocChecklist`                | ✅ 完成 | 動態表單、簽核流             |
| 15  | 報告產生器        | `/dashboard/report-builder`        | `ReportBuilder`               | ✅ 完成 | 拖拉版面、多格式匯出         |
| 16  | 指標儀表板-環境   | `/dashboard/metrics/environmental` | `MetricsDashboard` (env)      | ✅ 完成 | 即時圖表、鑽取               |
| 17  | 指標儀表板-社會   | `/dashboard/metrics/social`        | `MetricsDashboard` (soc)      | ✅ 完成 | 同上                         |
| 18  | 指標儀表板-治理   | `/dashboard/metrics/governance`    | `MetricsDashboard` (gov)      | ✅ 完成 | 同上                         |
| 19  | 矩陣視圖          | `/dashboard/matrix`                | `MatrixView`                  | ✅ 完成 | 多維交叉分析                 |
| 20  | 審計日誌          | `/audit-log`                       | `AuditLogViewer`              | ✅ 完成 | 篩選、匯出、不可竄改         |
| 21  | 資料源管理        | `/data-sources`                    | `DataSourceRegistry`          | ✅ 完成 | 連線測試、Schema 同步        |
| 22  | API 設定          | `/api-setup`                       | `ApiConfigPanel`              | ✅ 完成 | 金鑰管理、速率限制           |
| 23  | 使用者設定檔      | `/profile`                         | `ProfileManager`              | ✅ 完成 | 偏好、通知、安全             |
| 24  | 任務看板          | `/tasks`                           | `TaskBoard`                   | ✅ 完成 | Kanban、依賴、SLA            |
| 25  | 利益相關者        | `/stakeholders`                    | `StakeholderMap`              | ✅ 完成 | 關係圖、溝通記錄             |
| 26  | 學院/知識庫       | `/academy`                         | `AcademyLibrary`              | ✅ 完成 | 分類、搜尋、進度             |
| 27  | 閱讀室            | `/reading-room`                    | `ReadingRoom`                 | ✅ 完成 | PDF/EPUB 閱讀、筆記          |
| 28  | 比較實驗室        | `/reading-room/comparative-lab`    | `ComparativeLab`              | ✅ 完成 | 多版本並排、差異高亮         |
| 29  | 完整性驗證        | `/integrity`                       | `IntegrityVerifier`           | ✅ 完成 | 雜湊驗證、Merkle Tree        |
| 30  | 健康檢查          | `/health-check`                    | `HealthCheckPanel`            | ✅ 完成 | 服務狀態、延遲、錯誤率       |
| 31  | 系統狀態          | `/system-status`                   | `SystemStatusBoard`           | ✅ 完成 | 即時拓撲、告警               |
| 32  | 超級管理員        | `/super-admin`                     | `SuperAdminConsole`           | ✅ 完成 | 權限矩陣、審計、遷移         |
| 33  | 管理員 Omni Table | `/admin/omni-table`                | `OmniTable`                   | ✅ 完成 | 萬用表格、內建 CRUD          |
| 34  | 設計系統庫        | `/design-library`                  | `DesignSystemViewer`          | ✅ 完成 | 元件預覽、Token 匯出         |
| 35  | OmniSpace 聖殿    | `/omnispace/sanctuary`             | `SanctuarySpace`              | ✅ 完成 | 沉浸式 3D、空間音訊          |
| 36  | OmniFactory       | `/omni-factory`                    | `OmniFactory`                 | ✅ 完成 | 低代碼流程編排               |
| 37  | AI 平台           | `/ai-platform`                     | `AIPlatformDashboard`         | ✅ 完成 | 模型管理、微調、部署         |
| 38  | 終端機            | `/terminal`                        | `TerminalEmulator`            | ✅ 完成 | xterm.js、WebSocket          |
| 39  | 編輯器            | `/editor`                          | `CodeEditor`                  | ✅ 完成 | Monaco、協同編輯             |
| 40  | 發布中心          | `/publish`                         | `PublishCenter`               | ✅ 完成 | 多頻道、排程、版本           |
| 41  | 列印預覽          | `/publish/print`                   | `PrintPreview`                | ✅ 完成 | 分頁、浮水印、PDF            |
| 42  | 證明中心          | `/proof-center`                    | `ProofCenter`                 | ✅ 完成 | ZKP、VC、時間戳記            |
| 43  | 路線圖            | `/roadmap`                         | `RoadmapTimeline`             | ✅ 完成 | 里程碑、依賴、進度           |
| 44  | 系統測試          | `/system-test`                     | `SystemTestRunner`            | ✅ 完成 | E2E、效能、混沌              |
| 45  | 靈魂模式          | `/soul`                            | `SoulMode`                    | ✅ 完成 | 專注、冥想、環境音           |
| 46  | 社交              | `/social`                          | `SocialFeed`                  | ✅ 完成 | 動態、評論、標記             |
| 47  | 智慧庫            | `/intelligence`                    | `IntelligenceHub`             | ✅ 完成 | 洞察、預測、建議             |
| 48  | 金融模組          | `/finance`                         | `FinanceModule`               | ✅ 完成 | 報表、預算、審計             |
| 49  | 治理模組          | `/governance`                      | `GovernanceModule`            | ✅ 完成 | 董事會、決議、合規           |
| 50  | 環境模組          | `/environmental`                   | `EnvironmentalModule`         | ✅ 完成 | 排放、能源、水               |
| 51  | 顧問名單          | `/advisors`                        | `AdvisorDirectory`            | ✅ 完成 | 專長、可用性、評價           |
| 52  | 範本市集          | `/templates`                       | `TemplateMarketplace`         | ✅ 完成 | 搜尋、預覽、一鍵套用         |
| 53  | Vault 加密倉      | `/vault`                           | `VaultManager`                | ✅ 完成 | 密鑰輪換、存取控制           |
| 54  | ESGGO OmniPencil  | `/esggo-omnipencil`                | `OmniPencilCanvas`            | ✅ 完成 | 手寫、向量、協同             |
| 55  | OAuth 同意        | `/oauth/consent`                   | `OAuthConsentScreen`          | ✅ 完成 | 範圍、撤銷、審計             |

---

## 通用基礎元件 (被上述頁面複用)

| 元件                                | 用途                 | 狀態 |
| ----------------------------------- | -------------------- | ---- |
| `Button` / `IconButton`             | 統一交互入口         | ✅   |
| `Input` / `Select` / `DatePicker`   | 表單輸入             | ✅   |
| `Table` / `DataGrid`                | 資料表格、排序、分頁 | ✅   |
| `Chart` (Line/Bar/Pie/Heatmap)      | 視覺化               | ✅   |
| `Modal` / `Drawer` / `Toast`        | 回饋與彈出           | ✅   |
| `Tabs` / `Accordion` / `Breadcrumb` | 導航結構             | ✅   |
| `Avatar` / `Badge` / `Tag`          | 識別與標記           | ✅   |
| `Form` / `FieldArray`               | 複雜表單驗證         | ✅   |
| `VirtualList` / `InfiniteScroll`    | 大量資料渲染         | ✅   |
| `WebSocketProvider` / `EventBus`    | 即時通訊             | ✅   |
| `AuthGuard` / `RoleGuard`           | 路由守衛             | ✅   |
| `ErrorBoundary` / `LoadingSkeleton` | 容錯與體驗           | ✅   |
| `ThemeProvider` / `LocaleProvider`  | 國際化、主題         | ✅   |
| `Logger` / `Telemetry`              | 觀測與追蹤           | ✅   |

---

> **註記**：以上矩陣涵蓋平台全部 55 項一級功能/頁面與 15+ 通用基礎元件。每個萬能元件皆具備：TypeScript 嚴格型別、單元/整合測試、Storybook 文件、無障礙 (WCAG AA)、響應式設計、暗黑模式、效能預算 (< 100ms 互動延遲)。後續新增功能請依此矩陣擴展，確保「零重複、全複用、強一致」。
