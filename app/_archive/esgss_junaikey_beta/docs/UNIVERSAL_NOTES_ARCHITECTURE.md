# 奧秘筆記系統架構文檔
# Universal Notes System Architecture

## 📋 概述

奧秘筆記（Universal Notes）是一個基於 Capacities 改良項目的筆記軟體，以 OmniCircle 為基礎，整合了多個子系統，提供全方位的筆記管理、知識管理、智能助手和安全防護功能。

## 🎯 核心理念

### 設計原則
1. **無通自通**: 將錯誤轉化為學習資產
2. **數據無礙流轉**: 跨平台數據同步與整合
3. **三位一體**: OmniPriest、OmniKey Keeper、OmniGemini 協同運作
4. **5T 閉環**: Traceable、Tangible、Trackable、Transformative、Transcendent

### 基礎架構
- **基礎平台**: Capacities 改良項目
- **核心引擎**: OmniCircle
- **協議層**: Model Context Protocol (MCP)

## 🏗️ 系統架構

### 整體架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        奧秘筆記系統                              │
│                    Universal Notes System                        │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  用戶界面層     │    │   MCP 控制層     │    │   數據存儲層     │
│  UI Layer      │    │  OmniCircleMCP  │    │  Data Layer     │
└───────┬────────┘    └────────┬────────┘    └────────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  核心服務層     │    │   智能服務層     │    │   支持服務層     │
│  Core Services │    │  AI Services    │    │  Support Svc    │
└───────┬────────┘    └────────┬────────┘    └────────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  整合層         │    │   擴展層         │    │   安全層         │
│  Integration   │    │   Extension     │    │   Security      │
└───────┬────────┘    └────────┬────────┘    └────────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  監控層         │    │   日誌層         │    │   分析層         │
│  Monitoring    │    │   Logging       │    │   Analytics     │
└───────┬────────┘    └────────┬────────┘    └────────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  報告層         │    │   文檔層         │    │   社區層         │
│  Reporting     │    │   Documentation │    │   Community     │
└────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 子系統詳解

### 1. OmniKnowledgeBase（奧秘智庫）

**功能描述**: 知識庫管理系統，負責存儲、檢索和管理所有知識條目。

**核心功能**:
- 知識條目創建、編輯、刪除
- 智能分類和標籤系統
- 全文搜索和語義搜索
- 知識關聯和引用管理
- 版本控制和歷史追蹤

**技術實現**:
```typescript
interface OmniKnowledgeBase {
  // 知識條目管理
  createKnowledge(entry: KnowledgeEntry): Promise<KnowledgeEntry>;
  updateKnowledge(id: string, entry: Partial<KnowledgeEntry>): Promise<KnowledgeEntry>;
  deleteKnowledge(id: string): Promise<void>;
  getKnowledge(id: string): Promise<KnowledgeEntry>;

  // 搜索功能
  searchKnowledge(query: string, options: SearchOptions): Promise<KnowledgeEntry[]>;
  semanticSearch(query: string, options: SemanticSearchOptions): Promise<KnowledgeEntry[]>;

  // 分類和標籤
  categorizeKnowledge(id: string, category: string): Promise<void>;
  tagKnowledge(id: string, tags: string[]): Promise<void>;

  // 關聯管理
  linkKnowledge(sourceId: string, targetId: string, relation: string): Promise<void>;
  getRelatedKnowledge(id: string): Promise<KnowledgeEntry[]>;

  // 版本控制
  getVersionHistory(id: string): Promise<KnowledgeVersion[]>;
  restoreVersion(id: string, versionId: string): Promise<KnowledgeEntry>;
}

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, any>;
}

type KnowledgeCategory = 'INSIGHT' | 'ESG' | 'TECHNICAL' | 'BUSINESS' | 'PERSONAL';
```

**數據模型**:
```sql
CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  metadata JSONB
);

CREATE TABLE knowledge_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id UUID NOT NULL REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  UNIQUE(knowledge_id, tag)
);

CREATE TABLE knowledge_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  relation VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_id, target_id, relation)
);

CREATE TABLE knowledge_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id UUID NOT NULL REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  UNIQUE(knowledge_id, version)
);
```

---

### 2. OmniSyncService（奧秘同步服務）

**功能描述**: 跨平台數據同步服務，確保數據在各平台間無礙流轉。

**核心功能**:
- 多平台同步（OmniSpace、Boost.Space、AITable、OmniNote、OmniTable）
- 衝突檢測和解決
- 增量同步和全量同步
- 離線支持和同步隊列
- 同步狀態監控

**技術實現**:
```typescript
interface OmniSyncService {
  // 同步操作
  syncEntity(platform: Platform, entityType: EntityType, entityId: string): Promise<SyncResult>;
  syncAll(platform: Platform): Promise<SyncSummary>;
  syncBatch(entities: SyncEntity[]): Promise<SyncResult[]>;

  // 衝突處理
  detectConflicts(platform: Platform): Promise<Conflict[]>;
  resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void>;

  // 同步狀態
  getSyncStatus(platform: Platform): Promise<SyncStatus>;
  getSyncHistory(limit: number): Promise<SyncRecord[]>;

  // 離線支持
  queueOfflineSync(entity: SyncEntity): Promise<void>;
  processOfflineQueue(): Promise<SyncSummary>;
}

type Platform = 'omni_space' | 'boost_space' | 'ai_table' | 'omni_note' | 'omni_table';
type EntityType = 'insight' | 'knowledge' | 'crystal' | 'tag' | 'memory';

interface SyncResult {
  success: boolean;
  entityId: string;
  platform: Platform;
  timestamp: Date;
  error?: string;
}

interface Conflict {
  id: string;
  entityId: string;
  platform: Platform;
  localVersion: any;
  remoteVersion: any;
  detectedAt: Date;
}

type ConflictResolution = 'local' | 'remote' | 'merge' | 'manual';
```

**同步策略**:
```typescript
enum SyncStrategy {
  // 最後寫入優先
  LAST_WRITE_WINS = 'last_write_wins',

  // 服務器優先
  SERVER_WINS = 'server_wins',

  // 客戶端優先
  CLIENT_WINS = 'client_wins',

  // 智能合併
  SMART_MERGE = 'smart_merge',

  // 手動解決
  MANUAL_RESOLUTION = 'manual_resolution'
}
```

---

### 3. OmniCircleMCP（奧秘圓通控制中心）

**功能描述**: MCP 協議控制中心，提供標準化的工具接口。

**核心功能**:
- 工具註冊和管理
- 工具執行和調度
- 請求/響應處理
- 錯誤處理和日誌記錄
- 工具權限管理

**技術實現**:
```typescript
interface OmniCircleMCP {
  // 工具管理
  registerTool(tool: MCPTool): void;
  unregisterTool(toolName: string): void;
  getTool(toolName: string): MCPTool | undefined;
  getToolList(): MCPTool[];

  // 工具執行
  executeTool(toolName: string, params: any): Promise<any>;
  executeToolBatch(requests: ToolRequest[]): Promise<ToolResponse[]>;

  // 權限管理
  checkPermission(toolName: string, userId: string): Promise<boolean>;
  grantPermission(toolName: string, userId: string): Promise<void>;
  revokePermission(toolName: string, userId: string): Promise<void>;

  // 系統狀態
  getSystemStatus(): Promise<SystemStatus>;
  getToolUsageStats(toolName: string): Promise<ToolUsageStats>;
}

interface MCPTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  handler: (params: any) => Promise<any>;
  permissions: string[];
  rateLimit?: RateLimit;
}

interface ToolRequest {
  toolName: string;
  params: any;
  requestId: string;
}

interface ToolResponse {
  requestId: string;
  success: boolean;
  result?: any;
  error?: string;
}
```

**可用工具列表**:
1. `orchestrate_sentience` - 編排覺醒奧義
2. `infuse_crystal` - 注入晶體 DNA
3. `create_knowledge` - 創建知識條目
4. `query_knowledge` - 查詢奧秘智庫
5. `sync_entity` - 同步實體到外部平台
6. `get_resonance_field` - 獲取共振場狀態
7. `format_label` - 格式化展示標籤
8. `get_system_status` - 獲取系統狀態

---

### 4. OmniCircleAI（奧秘圓通智能助手）

**功能描述**: AI 智能助手，提供智能建議、自動化和自然語言交互。

**核心功能**:
- 自然語言理解
- 智能建議和推薦
- 自動化任務執行
- 語義搜索和問答
- 多模態交互（文本、語音、圖像）

**技術實現**:
```typescript
interface OmniCircleAI {
  // 自然語言處理
  understandIntent(input: string): Promise<Intent>;
  generateResponse(context: ConversationContext): Promise<string>;
  translateText(text: string, targetLang: string): Promise<string>;

  // 智能建議
  suggestActions(context: UserContext): Promise<ActionSuggestion[]>;
  suggestTags(content: string): Promise<string[]>;
  suggestCategories(content: string): Promise<KnowledgeCategory>;

  // 自動化
  executeAutomation(automation: Automation): Promise<AutomationResult>;
  createAutomation(description: string): Promise<Automation>;

  // 語義搜索
  semanticSearch(query: string, scope: SearchScope): Promise<SearchResult[]>;
  answerQuestion(question: string, context: QuestionContext): Promise<Answer>;

  // 多模態
  processImage(image: ImageInput): Promise<ImageAnalysis>;
  processVoice(audio: AudioInput): Promise<VoiceCommand>;
}

interface Intent {
  type: IntentType;
  confidence: number;
  entities: Entity[];
  parameters: Record<string, any>;
}

type IntentType =
  | 'create_note'
  | 'search_knowledge'
  | 'sync_data'
  | 'generate_report'
  | 'ask_question'
  | 'execute_automation';

interface ActionSuggestion {
  type: string;
  description: string;
  confidence: number;
  parameters: Record<string, any>;
}
```

**AI 模型集成**:
```typescript
interface AIModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens: number;
  temperature: number;
}

class OmniCircleAI {
  private models: Map<string, AIModel> = new Map();

  async initialize(config: AIModelConfig): Promise<void> {
    const model = await this.createModel(config);
    this.models.set(config.model, model);
  }

  async chat(messages: Message[], options: ChatOptions): Promise<string> {
    const model = this.selectBestModel(options);
    return await model.chat(messages, options);
  }

  async embed(text: string): Promise<number[]> {
    const model = this.models.get('embedding');
    return await model.embed(text);
  }
}
```

---

### 5. OmniCircleSecurity（奧秘圓通安全防護）

**功能描述**: 全面的安全防護系統，保護用戶數據和系統安全。

**核心功能**:
- 身份驗證和授權
- 數據加密和解密
- 訪問控制和權限管理
- 安全審計和日誌
- 威脅檢測和防護

**技術實現**:
```typescript
interface OmniCircleSecurity {
  // 身份驗證
  authenticate(credentials: Credentials): Promise<AuthResult>;
  refreshToken(token: string): Promise<AuthResult>;
  logout(userId: string): Promise<void>;

  // 授權
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
  grantPermission(userId: string, permission: Permission): Promise<void>;
  revokePermission(userId: string, permission: Permission): Promise<void>;

  // 加密
  encryptData(data: any, keyId: string): Promise<EncryptedData>;
  decryptData(encryptedData: EncryptedData, keyId: string): Promise<any>;

  // 審計
  logSecurityEvent(event: SecurityEvent): Promise<void>;
  getAuditLog(filters: AuditFilters): Promise<SecurityEvent[]>;

  // 威脅檢測
  detectThreat(activity: UserActivity): Promise<ThreatDetection>;
  blockThreat(threatId: string): Promise<void>;
}

interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

interface EncryptedData {
  data: string;
  iv: string;
  keyId: string;
  algorithm: string;
}
```

**安全策略**:
```typescript
enum SecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}

interface SecurityPolicy {
  level: SecurityLevel;
  encryptionRequired: boolean;
  mfaRequired: boolean;
  auditRequired: boolean;
  retentionPeriod: number;
}
```

---

### 6. OmniCircleMonitoring（奧秘圓通監控系統）

**功能描述**: 實時監控系統，追蹤系統性能和健康狀態。

**核心功能**:
- 系統性能監控
- 服務健康檢查
- 錯誤追蹤和報警
- 資源使用監控
- 自定義指標收集

**技術實現**:
```typescript
interface OmniCircleMonitoring {
  // 指標收集
  recordMetric(metric: Metric): void;
  recordCounter(name: string, value: number, tags?: Record<string, string>): void;
  recordGauge(name: string, value: number, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;

  // 健康檢查
  checkHealth(service: string): Promise<HealthStatus>;
  checkAllHealth(): Promise<Record<string, HealthStatus>>;

  // 錯誤追蹤
  trackError(error: Error, context?: ErrorContext): void;
  getErrors(filters: ErrorFilters): Promise<ErrorRecord[]>;

  // 報警
  createAlert(alert: AlertConfig): Promise<Alert>;
  triggerAlert(alertId: string): Promise<void>;
  resolveAlert(alertId: string): Promise<void>;

  // 儀表板
  getDashboard(dashboardId: string): Promise<Dashboard>;
  createDashboard(dashboard: DashboardConfig): Promise<Dashboard>;
}

interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  details?: Record<string, any>;
}

interface AlertConfig {
  name: string;
  condition: AlertCondition;
  severity: 'info' | 'warning' | 'error' | 'critical';
  channels: NotificationChannel[];
}
```

---

### 7. OmniCircleLogging（奧秘圓通日誌系統）

**功能描述**: 統一的日誌管理系統，記錄所有系統活動。

**核心功能**:
- 結構化日誌記錄
- 日誌級別管理
- 日誌查詢和過濾
- 日誌歸檔和清理
- 日誌分析和報告

**技術實現**:
```typescript
interface OmniCircleLogging {
  // 日誌記錄
  log(level: LogLevel, message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  fatal(message: string, context?: LogContext): void;

  // 日誌查詢
  queryLogs(query: LogQuery): Promise<LogEntry[]>;
  searchLogs(pattern: string, options: SearchOptions): Promise<LogEntry[]>;

  // 日誌管理
  archiveLogs(beforeDate: Date): Promise<ArchiveResult>;
  cleanupLogs(retentionDays: number): Promise<CleanupResult>;
  exportLogs(query: LogQuery, format: ExportFormat): Promise<Buffer>;

  // 日誌分析
  analyzeLogs(query: LogQuery): Promise<LogAnalysis>;
  getLogStats(period: TimePeriod): Promise<LogStats>;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: LogContext;
  source: string;
}

interface LogContext {
  userId?: string;
  requestId?: string;
  service?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

---

### 8. OmniCircleAnalytics（奧秘圓通分析系統）

**功能描述**: 數據分析系統，提供深入的數據洞察和報告。

**核心功能**:
- 用戶行為分析
- 內容使用分析
- 系統性能分析
- 趨勢分析和預測
- 自定義報告生成

**技術實現**:
```typescript
interface OmniCircleAnalytics {
  // 事件追蹤
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(page: string, userId?: string): void;
  trackUserAction(action: string, userId: string, properties?: Record<string, any>): void;

  // 數據查詢
  queryMetrics(query: MetricsQuery): Promise<MetricData[]>;
  queryFunnel(funnel: FunnelDefinition): Promise<FunnelResult>;
  queryCohort(cohort: CohortDefinition): Promise<CohortResult>;

  // 分析
  analyzeUserBehavior(userId: string, period: TimePeriod): Promise<UserBehaviorAnalysis>;
  analyzeContentUsage(contentId: string, period: TimePeriod): Promise<ContentUsageAnalysis>;
  analyzeSystemPerformance(period: TimePeriod): Promise<SystemPerformanceAnalysis>;

  // 預測
  predictTrend(metric: string, horizon: number): Promise<TrendPrediction>;
  predictUserChurn(userId: string): Promise<ChurnPrediction>;

  // 報告
  generateReport(report: ReportDefinition): Promise<Report>;
  scheduleReport(report: ReportDefinition, schedule: Schedule): Promise<void>;
}

interface AnalyticsEvent {
  name: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

interface MetricData {
  metric: string;
  value: number;
  timestamp: Date;
  dimensions: Record<string, string>;
}
```

---

### 9. OmniCircleReporting（奧秘圓通報告系統）

**功能描述**: 報告生成系統，創建各種類型的報告和文檔。

**核心功能**:
- 報告模板管理
- 報告生成和導出
- 報告調度和分發
- 報告版本控制
- 報告權限管理

**技術實現**:
```typescript
interface OmniCircleReporting {
  // 報告管理
  createReport(report: ReportDefinition): Promise<Report>;
  updateReport(id: string, report: Partial<ReportDefinition>): Promise<Report>;
  deleteReport(id: string): Promise<void>;
  getReport(id: string): Promise<Report>;
  listReports(filters: ReportFilters): Promise<Report[]>;

  // 報告生成
  generateReport(id: string, parameters?: ReportParameters): Promise<GeneratedReport>;
  generateReportBatch(ids: string[]): Promise<GeneratedReport[]>;

  // 報告導出
  exportReport(id: string, format: ExportFormat): Promise<Buffer>;
  exportReportBatch(ids: string[], format: ExportFormat): Promise<Buffer>;

  // 報告調度
  scheduleReport(reportId: string, schedule: Schedule): Promise<void>;
  cancelSchedule(scheduleId: string): Promise<void>;
  getSchedules(reportId: string): Promise<Schedule[]>;

  // 報告模板
  createTemplate(template: ReportTemplate): Promise<ReportTemplate>;
  updateTemplate(id: string, template: Partial<ReportTemplate>): Promise<ReportTemplate>;
  deleteTemplate(id: string): Promise<void>;
  getTemplate(id: string): Promise<ReportTemplate>;
  listTemplates(): Promise<ReportTemplate[]>;
}

interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  templateId: string;
  dataSource: DataSource;
  parameters: ReportParameter[];
  permissions: Permission[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

type ExportFormat = 'pdf' | 'html' | 'docx' | 'xlsx' | 'csv' | 'json';
```

---

### 10. OmniCircleIntegration（奧秘圓通整合系統）

**功能描述**: 第三方服務整合系統，連接外部 API 和服務。

**核心功能**:
- API 連接器管理
- Webhook 處理
- 數據映射和轉換
- 整合流程編排
- 整合監控和日誌

**技術實現**:
```typescript
interface OmniCircleIntegration {
  // 連接器管理
  registerConnector(connector: Connector): Promise<Connector>;
  unregisterConnector(connectorId: string): Promise<void>;
  getConnector(connectorId: string): Promise<Connector>;
  listConnectors(): Promise<Connector[]>;

  // API 調用
  callAPI(connectorId: string, endpoint: string, options: APIOptions): Promise<APIResponse>;
  callAPIBatch(requests: APIRequest[]): Promise<APIResponse[]>;

  // Webhook
  createWebhook(webhook: WebhookConfig): Promise<Webhook>;
  updateWebhook(id: string, webhook: Partial<WebhookConfig>): Promise<Webhook>;
  deleteWebhook(id: string): Promise<void>;
  handleWebhook(webhookId: string, payload: any): Promise<WebhookResult>;

  // 數據映射
  createMapping(mapping: DataMapping): Promise<DataMapping>;
  applyMapping(mappingId: string, data: any): Promise<any>;

  // 流程編排
  createWorkflow(workflow: WorkflowDefinition): Promise<Workflow>;
  executeWorkflow(workflowId: string, input: any): Promise<WorkflowResult>;
}

interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  config: ConnectorConfig;
  auth: AuthConfig;
  endpoints: Endpoint[];
  status: 'active' | 'inactive' | 'error';
}

type ConnectorType = 'rest' | 'graphql' | 'soap' | 'grpc' | 'websocket';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}
```

---

### 11. OmniCircleExtension（奧秘圓通擴展系統）

**功能描述**: 系統擴展框架，支持動態加載和管理擴展。

**核心功能**:
- 擴展註冊和發現
- 擴展加載和卸載
- 擴展依賴管理
- 擴展沙箱隔離
- 擴展市場

**技術實現**:
```typescript
interface OmniCircleExtension {
  // 擴展管理
  registerExtension(extension: Extension): Promise<Extension>;
  unregisterExtension(extensionId: string): Promise<void>;
  loadExtension(extensionId: string): Promise<void>;
  unloadExtension(extensionId: string): Promise<void>;
  getExtension(extensionId: string): Promise<Extension>;
  listExtensions(): Promise<Extension[]>;

  // 擴發市場
  searchExtensions(query: string): Promise<Extension[]>;
  installExtension(extensionId: string): Promise<void>;
  uninstallExtension(extensionId: string): Promise<void>;
  updateExtension(extensionId: string): Promise<void>;

  // 擴展 API
  getExtensionAPI(extensionId: string): Promise<ExtensionAPI>;
  callExtension(extensionId: string, method: string, params: any): Promise<any>;

  // 擴展權限
  grantPermissions(extensionId: string, permissions: string[]): Promise<void>;
  revokePermissions(extensionId: string, permissions: string[]): Promise<void>;
  checkPermissions(extensionId: string, permission: string): Promise<boolean>;
}

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  permissions: string[];
  dependencies: string[];
  entryPoint: string;
  manifest: ExtensionManifest;
  status: 'installed' | 'loaded' | 'unloaded' | 'error';
}

interface ExtensionManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: string[];
  dependencies: Record<string, string>;
  entryPoints: {
    main: string;
    background?: string;
    content?: string;
  };
  capabilities: string[];
}
```

---

### 12. OmniCirclePlugin（奧秘圓通插件系統）

**功能描述**: 插件系統，提供輕量級的功能擴展。

**核心功能**:
- 插件註冊和管理
- 插件鉤子和事件
- 插件配置管理
- 插件熱重載
- 插件依賴注入

**技術實現**:
```typescript
interface OmniCirclePlugin {
  // 插件管理
  registerPlugin(plugin: Plugin): Promise<Plugin>;
  unregisterPlugin(pluginId: string): Promise<void>;
  enablePlugin(pluginId: string): Promise<void>;
  disablePlugin(pluginId: string): Promise<void>;
  getPlugin(pluginId: string): Promise<Plugin>;
  listPlugins(): Promise<Plugin[]>;

  // 鉤子系統
  registerHook(hookName: string, callback: HookCallback): void;
  unregisterHook(hookName: string, callback: HookCallback): void;
  executeHook(hookName: string, data: any): Promise<any>;

  // 事件系統
  emitEvent(eventName: string, data: any): void;
  onEvent(eventName: string, callback: EventCallback): void;
  offEvent(eventName: string, callback: EventCallback): void;

  // 插件配置
  getPluginConfig(pluginId: string): Promise<PluginConfig>;
  updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): Promise<void>;
  resetPluginConfig(pluginId: string): Promise<void>;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  hooks: PluginHook[];
  events: PluginEvent[];
  config: PluginConfig;
  status: 'enabled' | 'disabled';
}

interface PluginHook {
  name: string;
  priority: number;
  callback: HookCallback;
}

type HookCallback = (data: any) => any | Promise<any>;
```

---

### 13. OmniCircleTheme（奧秘圓通主題系統）

**功能描述**: 主題管理系統，支持多種視覺主題和自定義樣式。

**核心功能**:
- 主題創建和管理
- 主題切換和預覽
- 主題變量和樣式
- 深色/淺色模式
- 主題導入/導出

**技術實現**:
```typescript
interface OmniCircleTheme {
  // 主題管理
  createTheme(theme: ThemeDefinition): Promise<Theme>;
  updateTheme(id: string, theme: Partial<ThemeDefinition>): Promise<Theme>;
  deleteTheme(id: string): Promise<void>;
  getTheme(id: string): Promise<Theme>;
  listThemes(): Promise<Theme[]>;

  // 主題應用
  applyTheme(themeId: string): Promise<void>;
  getCurrentTheme(): Promise<Theme>;
  previewTheme(themeId: string): Promise<void>;

  // 主題變量
  getThemeVariables(themeId: string): Promise<ThemeVariables>;
  updateThemeVariable(themeId: string, variable: string, value: string): Promise<void>;

  // 主題導入/導出
  exportTheme(themeId: string): Promise<ThemeExport>;
  importTheme(themeExport: ThemeExport): Promise<Theme>;

  // 預設主題
  getBuiltinThemes(): Promise<Theme[]>;
  createThemeFromPreset(preset: ThemePreset): Promise<Theme>;
}

interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  author: string;
  variables: ThemeVariables;
  styles: ThemeStyles;
  mode: 'light' | 'dark' | 'auto';
  preview?: string;
}

interface ThemeVariables {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
}

type ThemePreset = 'default' | 'minimal' | 'colorful' | 'dark' | 'nature' | 'ocean';
```

---

### 14. OmniCircleCustomization（奧秘圓通定制系統）

**功能描述**: 用戶定制系統，支持個性化配置和布局。

**核心功能**:
- 用戶偏好設置
- 界面布局定制
- 快捷鍵配置
- 工作區管理
- 定制模板

**技術實現**:
```typescript
interface OmniCircleCustomization {
  // 偏好設置
  getUserPreferences(userId: string): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void>;
  resetUserPreferences(userId: string): Promise<void>;

  // 界面布局
  getLayout(userId: string): Promise<Layout>;
  updateLayout(userId: string, layout: Partial<Layout>): Promise<void>;
  saveLayoutTemplate(userId: string, name: string, layout: Layout): Promise<LayoutTemplate>;
  loadLayoutTemplate(userId: string, templateId: string): Promise<void>;

  // 快捷鍵
  getShortcuts(userId: string): Promise<Shortcuts>;
  updateShortcut(userId: string, action: string, shortcut: string): Promise<void>;
  resetShortcuts(userId: string): Promise<void>;

  // 工作區
  createWorkspace(userId: string, workspace: Workspace): Promise<Workspace>;
  updateWorkspace(userId: string, workspaceId: string, workspace: Partial<Workspace>): Promise<void>;
  deleteWorkspace(userId: string, workspaceId: string): Promise<void>;
  getWorkspaces(userId: string): Promise<Workspace[]>;
  setActiveWorkspace(userId: string, workspaceId: string): Promise<void>;

  // 定制模板
  createCustomTemplate(userId: string, template: CustomTemplate): Promise<CustomTemplate>;
  getCustomTemplates(userId: string): Promise<CustomTemplate[]>;
  deleteCustomTemplate(userId: string, templateId: string): Promise<void>;
}

interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
  fontSize: number;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

interface Layout {
  panels: Panel[];
  sidebar: SidebarConfig;
  toolbar: ToolbarConfig;
  statusBar: StatusBarConfig;
}
```

---

### 15. OmniCircleSettings（奧秘圓通設置系統）

**功能描述**: 系統設置管理，提供全局配置和選項。

**核心功能**:
- 系統配置管理
- 設置分類和組織
- 設置驗證和同步
- 設置導入/導出
- 設置版本控制

**技術實現**:
```typescript
interface OmniCircleSettings {
  // 設置管理
  getSetting(key: string): Promise<any>;
  setSetting(key: string, value: any): Promise<void>;
  getSettings(category?: string): Promise<Record<string, any>>;
  setSettings(settings: Record<string, any>): Promise<void>;
  resetSetting(key: string): Promise<void>;
  resetSettings(category?: string): Promise<void>;

  // 設置分類
  getCategories(): Promise<SettingCategory[]>;
  getCategorySettings(category: string): Promise<Record<string, any>>;

  // 設置驗證
  validateSetting(key: string, value: any): Promise<ValidationResult>;
  validateSettings(settings: Record<string, any>): Promise<ValidationResult[]>;

  // 設置導入/導出
  exportSettings(category?: string): Promise<SettingsExport>;
  importSettings(settingsExport: SettingsExport): Promise<void>;

  // 設置歷史
  getSettingHistory(key: string): Promise<SettingHistory[]>;
  restoreSetting(key: string, version: number): Promise<void>;
}

interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: SettingDefinition[];
}

interface SettingDefinition {
  key: string;
  name: string;
  description: string;
  type: SettingType;
  defaultValue: any;
  validation?: ValidationRule[];
  options?: SettingOption[];
}

type SettingType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object';
```

---

### 16. OmniCircleHelp（奧秘圓通幫助系統）

**功能描述**: 幫助文檔系統，提供用戶指導和教程。

**核心功能**:
- 幫助文檔管理
- 交互式教程
- 上下文幫助
- 搜索和索引
- 幫助反饋

**技術實現**:
```typescript
interface OmniCircleHelp {
  // 幫助文檔
  createArticle(article: HelpArticle): Promise<HelpArticle>;
  updateArticle(id: string, article: Partial<HelpArticle>): Promise<HelpArticle>;
  deleteArticle(id: string): Promise<void>;
  getArticle(id: string): Promise<HelpArticle>;
  searchArticles(query: string): Promise<HelpArticle[]>;

  // 交互式教程
  createTutorial(tutorial: Tutorial): Promise<Tutorial>;
  updateTutorial(id: string, tutorial: Partial<Tutorial>): Promise<Tutorial>;
  deleteTutorial(id: string): Promise<void>;
  getTutorial(id: string): Promise<Tutorial>;
  listTutorials(): Promise<Tutorial[]>;
  startTutorial(userId: string, tutorialId: string): Promise<TutorialSession>;
  completeTutorial(userId: string, sessionId: string): Promise<void>;

  // 上下文幫助
  getContextHelp(context: HelpContext): Promise<HelpArticle[]>;
  registerContextHelp(context: string, articleIds: string[]): Promise<void>;

  // 幫助反饋
  submitFeedback(feedback: HelpFeedback): Promise<void>;
  getFeedback(articleId: string): Promise<HelpFeedback[]>;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedArticles: string[];
  contextHelp: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}
```

---

### 17. OmniCircleSupport（奧秘圓通支持系統）

**功能描述**: 用戶支持系統，提供問題報告和技術支持。

**核心功能**:
- 問題報告和追蹤
- 支持工單管理
- 實時聊天支持
- 知識庫集成
- 支持分析

**技術實現**:
```typescript
interface OmniCircleSupport {
  // 問題報告
  createIssue(issue: Issue): Promise<Issue>;
  updateIssue(id: string, issue: Partial<Issue>): Promise<Issue>;
  deleteIssue(id: string): Promise<void>;
  getIssue(id: string): Promise<Issue>;
  listIssues(filters: IssueFilters): Promise<Issue[]>;

  // 支持工單
  createTicket(ticket: SupportTicket): Promise<SupportTicket>;
  updateTicket(id: string, ticket: Partial<SupportTicket>): Promise<SupportTicket>;
  closeTicket(id: string, resolution: string): Promise<void>;
  getTicket(id: string): Promise<SupportTicket>;
  listTickets(userId: string): Promise<SupportTicket[]>;

  // 實時聊天
  startChatSession(userId: string): Promise<ChatSession>;
  sendMessage(sessionId: string, message: string): Promise<void>;
  endChatSession(sessionId: string): Promise<void>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;

  // 支持分析
  getSupportStats(period: TimePeriod): Promise<SupportStats>;
  getCommonIssues(period: TimePeriod): Promise<CommonIssue[]>;
  getSupportTrends(period: TimePeriod): Promise<SupportTrend[]>;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reporterId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
}

type IssueCategory = 'bug' | 'feature' | 'improvement' | 'question' | 'other';
```

---

### 18. OmniCircleCommunity（奧秘圓通社區系統）

**功能描述**: 社區平台，支持用戶交流和協作。

**核心功能**:
- 討論論壇
- 用戶資料和社交
- 內容分享
- 社區活動
- 聲譽系統

**技術實現**:
```typescript
interface OmniCircleCommunity {
  // 討論論壇
  createPost(post: CommunityPost): Promise<CommunityPost>;
  updatePost(id: string, post: Partial<CommunityPost>): Promise<CommunityPost>;
  deletePost(id: string): Promise<void>;
  getPost(id: string): Promise<CommunityPost>;
  listPosts(filters: PostFilters): Promise<CommunityPost[]>;
  createComment(postId: string, comment: Comment): Promise<Comment>;
  deleteComment(commentId: string): Promise<void>;

  // 用戶資料
  getUserProfile(userId: string): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void>;
  followUser(userId: string, targetUserId: string): Promise<void>;
  unfollowUser(userId: string, targetUserId: string): Promise<void>;
  getFollowers(userId: string): Promise<UserProfile[]>;
  getFollowing(userId: string): Promise<UserProfile[]>;

  // 內容分享
  shareContent(userId: string, content: SharedContent): Promise<SharedContent>;
  getSharedContent(userId: string): Promise<SharedContent[]>;
  likeContent(userId: string, contentId: string): Promise<void>;
  unlikeContent(userId: string, contentId: string): Promise<void>;

  // 社區活動
  createEvent(event: CommunityEvent): Promise<CommunityEvent>;
  updateEvent(id: string, event: Partial<CommunityEvent>): Promise<CommunityEvent>;
  deleteEvent(id: string): Promise<void>;
  getEvent(id: string): Promise<CommunityEvent>;
  listEvents(filters: EventFilters): Promise<CommunityEvent[]>;
  rsvpEvent(userId: string, eventId: string): Promise<void>;

  // 聲譽系統
  getUserReputation(userId: string): Promise<Reputation>;
  awardReputation(userId: string, amount: number, reason: string): Promise<void>;
  getLeaderboard(limit: number): Promise<LeaderboardEntry[]>;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

interface Reputation {
  userId: string;
  score: number;
  level: number;
  badges: Badge[];
  history: ReputationHistory[];
}
```

---

### 19. OmniCircleDocumentation（奧秘圓通文檔系統）

**功能描述**: 技術文檔系統，管理開發者文檔和 API 文檔。

**核心功能**:
- 文檔版本管理
- 文檔搜索和索引
- API 文檔生成
- 代碼示例管理
- 文檔審核流程

**技術實現**:
```typescript
interface OmniCircleDocumentation {
  // 文檔管理
  createDocument(document: DocDocument): Promise<DocDocument>;
  updateDocument(id: string, document: Partial<DocDocument>): Promise<DocDocument>;
  deleteDocument(id: string): Promise<void>;
  getDocument(id: string): Promise<DocDocument>;
  listDocuments(filters: DocFilters): Promise<DocDocument[]>;

  // 版本管理
  createVersion(documentId: string, version: string): Promise<DocVersion>;
  getVersion(documentId: string, version: string): Promise<DocVersion>;
  listVersions(documentId: string): Promise<DocVersion[]>;
  compareVersions(documentId: string, version1: string, version2: string): Promise<DiffResult>;

  // API 文檔
  generateAPIDocumentation(source: APISource): Promise<APIDocument>;
  updateAPIDocumentation(apiId: string, documentation: APIDocument): Promise<APIDocument>;
  getAPIDocumentation(apiId: string): Promise<APIDocument>;

  // 代碼示例
  createCodeExample(example: CodeExample): Promise<CodeExample>;
  updateCodeExample(id: string, example: Partial<CodeExample>): Promise<CodeExample>;
  deleteCodeExample(id: string): Promise<void>;
  getCodeExamples(documentId: string): Promise<CodeExample[]>;

  // 文檔審核
  submitForReview(documentId: string): Promise<void>;
  reviewDocument(documentId: string, review: DocumentReview): Promise<void>;
  approveDocument(documentId: string): Promise<void>;
  rejectDocument(documentId: string, reason: string): Promise<void>;
}

interface DocDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  version: string;
  status: 'draft' | 'review' | 'published' | 'deprecated';
  authorId: string;
  reviewerId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface APIDocument {
  id: string;
  name: string;
  version: string;
  endpoints: APIEndpoint[];
  schemas: APISchema[];
  examples: CodeExample[];
}
```

---

### 20. OmniCircleTutorial（奧秘圓通教程系統）

**功能描述**: 教程系統，提供結構化的學習路徑和課程。

**核心功能**:
- 課程管理
- 學習路徑
- 進度追蹤
- 測驗和評估
- 證書系統

**技術實現**:
```typescript
interface OmniCircleTutorial {
  // 課程管理
  createCourse(course: Course): Promise<Course>;
  updateCourse(id: string, course: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  getCourse(id: string): Promise<Course>;
  listCourses(filters: CourseFilters): Promise<Course[]>;

  // 學習路徑
  createLearningPath(path: LearningPath): Promise<LearningPath>;
  updateLearningPath(id: string, path: Partial<LearningPath>): Promise<LearningPath>;
  deleteLearningPath(id: string): Promise<void>;
  getLearningPath(id: string): Promise<LearningPath>;
  listLearningPaths(): Promise<LearningPath[]>;

  // 進度追蹤
  enrollUser(userId: string, courseId: string): Promise<Enrollment>;
  updateProgress(userId: string, courseId: string, progress: Progress): Promise<void>;
  getProgress(userId: string, courseId: string): Promise<Progress>;
  getEnrollments(userId: string): Promise<Enrollment[]>;

  // 測驗和評估
  createQuiz(quiz: Quiz): Promise<Quiz>;
  submitQuiz(userId: string, quizId: string, answers: QuizAnswers): Promise<QuizResult>;
  getQuizResult(userId: string, quizId: string): Promise<QuizResult>;

  // 證書系統
  generateCertificate(userId: string, courseId: string): Promise<Certificate>;
  getCertificates(userId: string): Promise<Certificate[]>;
  verifyCertificate(certificateId: string): Promise<VerificationResult>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  modules: CourseModule[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  prerequisites: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}
```

---

### 21. OmniCircleFAQ（奧秘圓通常見問題系統）

**功能描述**: FAQ 系統，管理常見問題和答案。

**核心功能**:
- FAQ 條目管理
- FAQ 分類和標籤
- FAQ 搜索
- FAQ 反饋
- FAQ 分析

**技術實現**:
```typescript
interface OmniCircleFAQ {
  // FAQ 管理
  createFAQ(faq: FAQEntry): Promise<FAQEntry>;
  updateFAQ(id: string, faq: Partial<FAQEntry>): Promise<FAQEntry>;
  deleteFAQ(id: string): Promise<void>;
  getFAQ(id: string): Promise<FAQEntry>;
  listFAQs(filters: FAQFilters): Promise<FAQEntry[]>;

  // FAQ 分類
  createCategory(category: FAQCategory): Promise<FAQCategory>;
  updateCategory(id: string, category: Partial<FAQCategory>): Promise<FAQCategory>;
  deleteCategory(id: string): Promise<void>;
  getCategories(): Promise<FAQCategory[]>;

  // FAQ 搜索
  searchFAQs(query: string): Promise<FAQEntry[]>;
  getPopularFAQs(limit: number): Promise<FAQEntry[]>;
  getRecentFAQs(limit: number): Promise<FAQEntry[]>;

  // FAQ 反饋
  submitFeedback(faqId: string, feedback: FAQFeedback): Promise<void>;
  getFeedback(faqId: string): Promise<FAQFeedback[]>;

  // FAQ 分析
  getFAQStats(period: TimePeriod): Promise<FAQStats>;
  getUnansweredQuestions(): Promise<UnansweredQuestion[]>;
}

interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: number;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}
```

## 🚀 MCP 服務器實現

### 奧秘筆記 MCP 服務器架構

```typescript
// mcp-servers/universal-notes/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// 創建 MCP 服務器
const server = new Server(
  {
    name: 'universal-notes',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 註冊工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_note',
        description: '創建新的筆記',
        inputSchema: z.object({
          title: z.string().describe('筆記標題'),
          content: z.string().describe('筆記內容'),
          category: z.enum(['INSIGHT', 'ESG', 'TECHNICAL', 'BUSINESS', 'PERSONAL']).describe('筆記類別'),
          tags: z.array(z.string()).optional().describe('標籤列表'),
        }).strict(),
      },
      {
        name: 'search_notes',
        description: '搜索筆記',
        inputSchema: z.object({
          query: z.string().describe('搜索查詢'),
          category: z.enum(['INSIGHT', 'ESG', 'TECHNICAL', 'BUSINESS', 'PERSONAL', 'ALL']).optional().describe('類別過濾'),
          tags: z.array(z.string()).optional().describe('標籤過濾'),
          limit: z.number().optional().describe('返回數量限制'),
        }).strict(),
      },
      {
        name: 'sync_note',
        description: '同步筆記到外部平台',
        inputSchema: z.object({
          noteId: z.string().describe('筆記 ID'),
          platform: z.enum(['omni_space', 'boost_space', 'ai_table', 'omni_note', 'omni_table']).describe('目標平台'),
        }).strict(),
      },
      {
        name: 'get_note',
        description: '獲取筆記詳情',
        inputSchema: z.object({
          noteId: z.string().describe('筆記 ID'),
        }).strict(),
      },
      {
        name: 'update_note',
        description: '更新筆記',
        inputSchema: z.object({
          noteId: z.string().describe('筆記 ID'),
          title: z.string().optional().describe('筆記標題'),
          content: z.string().optional().describe('筆記內容'),
          tags: z.array(z.string()).optional().describe('標籤列表'),
        }).strict(),
      },
      {
        name: 'delete_note',
        description: '刪除筆記',
        inputSchema: z.object({
          noteId: z.string().describe('筆記 ID'),
        }).strict(),
      },
      {
        name: 'get_related_notes',
        description: '獲取相關筆記',
        inputSchema: z.object({
          noteId: z.string().describe('筆記 ID'),
          limit: z.number().optional().describe('返回數量限制'),
        }).strict(),
      },
      {
        name: 'ask_ai',
        description: '向 AI 助手提問',
        inputSchema: z.object({
          question: z.string().describe('問題'),
          context: z.string().optional().describe('上下文'),
        }).strict(),
      },
      {
        name: 'generate_report',
        description: '生成報告',
        inputSchema: z.object({
          reportType: z.enum(['usage', 'analytics', 'performance']).describe('報告類型'),
          period: z.enum(['day', 'week', 'month', 'year']).describe('時間範圍'),
          format: z.enum(['pdf', 'html', 'json']).describe('輸出格式'),
        }).strict(),
      },
      {
        name: 'get_system_status',
        description: '獲取系統狀態',
        inputSchema: z.object({}).strict(),
      },
    ],
  };
});

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_note':
        return await handleCreateNote(args);
      case 'search_notes':
        return await handleSearchNotes(args);
      case 'sync_note':
        return await handleSyncNote(args);
      case 'get_note':
        return await handleGetNote(args);
      case 'update_note':
        return await handleUpdateNote(args);
      case 'delete_note':
        return await handleDeleteNote(args);
      case 'get_related_notes':
        return await handleGetRelatedNotes(args);
      case 'ask_ai':
        return await handleAskAI(args);
      case 'generate_report':
        return await handleGenerateReport(args);
      case 'get_system_status':
        return await handleGetSystemStatus(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

// 啟動服務器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Universal Notes MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
```

## 📊 數據流圖

```
┌─────────────┐
│   用戶輸入   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    OmniCircleMCP                         │
│                  (控制中心)                              │
└──────┬──────────────────────────────────────────────────┘
       │
       ├──────────────────────────────────────────────────┐
       │                                                  │
       ▼                                                  ▼
┌──────────────────┐                            ┌──────────────────┐
│ OmniKnowledgeBase│                            │  OmniCircleAI    │
│   (知識庫)       │                            │   (智能助手)     │
└────────┬─────────┘                            └────────┬─────────┘
         │                                                │
         ▼                                                ▼
┌──────────────────┐                            ┌──────────────────┐
│ OmniSyncService  │                            │ OmniCircleSecurity│
│   (同步服務)     │                            │   (安全防護)     │
└────────┬─────────┘                            └────────┬─────────┘
         │                                                │
         └────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │   數據存儲層     │
                  │  (Supabase)     │
                  └─────────────────┘
```

## 🔐 安全架構

### 安全層級
1. **網絡層**: HTTPS/TLS 加密
2. **應用層**: JWT 認證、RBAC 授權
3. **數據層**: AES-256 加密、數據脫敏
4. **審計層**: 完整的操作日誌和審計追蹤

### 安全策略
- 最小權限原則
- 深度防禦
- 定期安全審計
- 漏洞掃描和修復
- 安全培訓和意識

## 📈 性能優化

### 緩存策略
- Redis 緩存熱點數據
- CDN 緩存靜態資源
- 瀏覽器緩存策略
- 服務端緩存

### 數據庫優化
- 索引優化
- 查詢優化
- 連接池管理
- 讀寫分離

### 前端優化
- 代碼分割
- 懶加載
- 圖片優化
- 渲染優化

## 🧪 測試策略

### 單元測試
- Jest 測試框架
- 覆蓋率要求 > 80%
- Mock 外部依賴

### 集成測試
- Playwright E2E 測試
- API 集成測試
- 數據庫集成測試

### 性能測試
- 負載測試
- 壓力測試
- 基準測試

## 📦 部署架構

### 開發環境
- 本地開發服務器
- Docker Compose
- 熱重載

### 測試環境
- CI/CD 管道
- 自動化測試
- 代碼審查

### 生產環境
- Google Cloud Run
- 負載均衡
- 自動擴展
- 監控和報警

## 🔄 持續集成/持續部署

### CI/CD 流程
1. 代碼提交
2. 自動化測試
3. 代碼審查
4. 構建和部署
5. 監控和驗證

### 工具鏈
- GitHub Actions
- Docker
- Google Cloud Build
- Cloud Run

## 📚 相關文檔

- [OmniCircle MCP 集成指南](./OMNICIRCLE_MCP_GUIDE.md)
- [Omni 系統文檔](./OMNI_SYSTEM_DOCUMENTATION.md)
- [開發者指南](./DEVELOPER_GUIDE.md)
- [API 文檔](./API_DOCUMENTATION.md)

## 🤝 貢獻指南

歡迎貢獻！請查看 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解詳情。

## 📄 許可證

MIT License

---

**奧秘筆記系統** - 筆記軟體之大成，讓知識無礙流轉！
