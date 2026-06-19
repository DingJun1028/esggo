# 商情偵測中心實作規格文件

**文件版本：** v1.0  
**建立日期：** 2026-02-11  
**文件狀態：** 正式版  
**適用範圍：** ESGss JunAiKey 平台商情偵測中心實作

---

## 📋 目錄

1. [執行摘要](#1-執行摘要)
2. [系統架構](#2-系統架構)
3. [資料模型設計](#3-資料模型設計)
4. [API 設計](#4-api-設計)
5. [服務層設計](#5-服務層設計)
6. [頁面層設計](#6-頁面層設計)
7. [組件層設計](#7-組件層設計)
8. [角色化介面設計](#8-角色化介面設計)
9. [整合現有系統](#9-整合現有系統)
10. [實作計劃](#10-實作計劃)

---

## 1. 執行摘要

### 1.1 文件目的

本文件定義商情偵測中心的完整實作規格，包括系統架構、資料模型、API 設計、服務層、頁面層、組件層和角色化介面設計。

### 1.2 核心功能

商情偵測中心是 ESG GO 平台的核心功能之一，提供以下核心功能：

| 功能模組 | 描述 | 優先級 |
|----------|------|--------|
| **每日簡報** | 每日 ESG 新聞摘要、AI 內容分析、法規更新提醒 | P0 |
| **趨勢預測** | 法規趨勢預測、碳價格走向預測、產業 ESG 評級趨勢 | P0 |
| **風險預警** | 早期預警系統、風險識別、風險評估 | P0 |
| **董事會儀表板** | 董事會決策支援、報告生成 | P1 |
| **法規更新對照表** | 法規庫管理、合規檢查清單、法規更新提醒 | P0 |
| **消息自動映射供應商分群** | 供應商評估、供應鏈追蹤、供應商改善計劃 | P1 |

### 1.3 6 種 Persona 支援

| Persona | 角色定位 | 核心需求 |
|---------|----------|----------|
| **傳產中小企業老闆** | 決策者 | 老闆版三段摘要（風險/機會/本週行動） |
| **上市櫃公司 ESG 專員** | 跨部門協調者 | 法規更新對照表、一鍵派任務 |
| **CFO / 財務主管** | 預算守門人 | 每則情報附「可能成本/避免損失區間」 |
| **供應鏈管理主管** | 供應穩定管理者 | 消息自動映射供應商分群（A/B/C） |
| **顧問公司專案經理** | 交付管理者 | 一鍵「套用到哪些專案」功能 |
| **銀行授信/投資評估端** | 風險評估者 | 僅推送「影響授信條件」等級事件 |

---

## 2. 系統架構

### 2.1 整體架構

```
┌─────────────────────────────────────────────────────────────────┐
│                    商情偵測中心系統架構                            │
├─────────────────────────────────────────────────────────────────┤
│  前端層 (React + TypeScript)                                      │
│  ├─ IntelligenceDetectionPage (主頁面)                          │
│  ├─ IntelligenceDashboard (儀表板)                              │
│  ├─ IntelligenceCard (情報卡片)                                  │
│  ├─ IntelligenceFilter (篩選器)                                  │
│  └─ PersonaView (角色化視圖)                                     │
├─────────────────────────────────────────────────────────────────┤
│  服務層 (TypeScript)                                              │
│  ├─ IntelligenceDetectionService (核心服務)                      │
│  ├─ IntelligenceAnalysisService (分析服務)                       │
│  ├─ IntelligenceFilterService (篩選服務)                         │
│  └─ IntelligenceNotificationService (通知服務)                   │
├─────────────────────────────────────────────────────────────────┤
│  整合層 (TypeScript)                                              │
│  ├─ OmniCache (快取整合)                                         │
│  ├─ OmniResonanceCore (共鳴核心整合)                             │
│  └─ OmniSyncService (同步服務整合)                              │
├─────────────────────────────────────────────────────────────────┤
│  API 層 (Node.js + Express)                                       │
│  ├─ /api/intelligence/* (情報 API)                               │
│  ├─ /api/intelligence/analysis/* (分析 API)                      │
│  └─ /api/intelligence/notification/* (通知 API)                  │
├─────────────────────────────────────────────────────────────────┤
│  資料層 (PostgreSQL + Supabase)                                   │
│  ├─ intelligence_items (情報項目)                                │
│  ├─ intelligence_analysis (分析結果)                             │
│  ├─ intelligence_notifications (通知)                            │
│  └─ intelligence_user_preferences (用戶偏好)                     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 技術棧

| 層級 | 技術 | 用途 |
|------|------|------|
| **前端** | React + TypeScript | 用戶介面 |
| **狀態管理** | Zustand | 狀態管理 |
| **UI 組件** | shadcn/ui + Tailwind CSS | UI 組件庫 |
| **後端** | Node.js + Express | API 服務 |
| **資料庫** | PostgreSQL + Supabase | 資料存儲 |
| **快取** | OmniCache | 快取層 |
| **同步** | OmniSyncService | 跨標籤同步 |
| **AI** | Gemini-2.0 | AI 分析 |

---

## 3. 資料模型設計

### 3.1 IntelligenceItem (情報項目)

```typescript
interface IntelligenceItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl?: string;
  category: IntelligenceCategory;
  priority: IntelligencePriority;
  relevanceScore: number; // 關聯分數 0-100
  impactLevel: IntelligenceImpactLevel;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  tags: string[];
  relatedStandards: string[]; // 對應準則條款
  suggestedActions: SuggestedAction[]; // 建議行動
  personaRelevance: PersonaRelevance[]; // 角色關聯性
  metadata: IntelligenceMetadata;
}

enum IntelligenceCategory {
  MARKET_NEWS = 'market_news',
  REGULATORY_UPDATE = 'regulatory_update',
  INDUSTRY_TREND = 'industry_trend',
  RISK_ALERT = 'risk_alert',
  OPPORTUNITY = 'opportunity',
  BEST_PRACTICE = 'best_practice',
}

enum IntelligencePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

enum IntelligenceImpactLevel {
  CRITICAL = 'critical', // 影響授信條件
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: IntelligencePriority;
  estimatedCost?: CostRange;
  estimatedImpact?: string;
  deadline?: Date;
  assignee?: string;
  status: ActionStatus;
}

interface CostRange {
  min: number;
  max: number;
  currency: string;
}

enum ActionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

interface PersonaRelevance {
  persona: PersonaType;
  relevanceScore: number; // 0-100
  customSummary?: string; // 角色化摘要
  customActions?: string[]; // 角色化行動
}

enum PersonaType {
  CEO = 'ceo', // 傳產中小企業老闆
  ESG_SPECIALIST = 'esg_specialist', // 上市櫃公司 ESG 專員
  CFO = 'cfo', // CFO / 財務主管
  SUPPLY_CHAIN_MANAGER = 'supply_chain_manager', // 供應鏈管理主管
  CONSULTANT_PM = 'consultant_pm', // 顧問公司專案經理
  BANK_CREDIT_ANALYST = 'bank_credit_analyst', // 銀行授信/投資評估端
}

interface IntelligenceMetadata {
  author?: string;
  language: string;
  region?: string;
  industry?: string;
  companyMentions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
}
```

### 3.2 IntelligenceAnalysis (分析結果)

```typescript
interface IntelligenceAnalysis {
  id: string;
  intelligenceId: string;
  analysisType: AnalysisType;
  result: AnalysisResult;
  createdAt: Date;
  processedBy: 'ai' | 'manual';
  confidence: number;
}

enum AnalysisType {
  SENTIMENT = 'sentiment',
  RELEVANCE = 'relevance',
  IMPACT = 'impact',
  TREND = 'trend',
  RISK = 'risk',
}

interface AnalysisResult {
  score: number;
  details: Record<string, any>;
  recommendations?: string[];
}
```

### 3.3 IntelligenceNotification (通知)

```typescript
interface IntelligenceNotification {
  id: string;
  userId: string;
  intelligenceId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

enum NotificationType {
  NEW_INTELLIGENCE = 'new_intelligence',
  PRIORITY_UPDATE = 'priority_update',
  DEADLINE_REMINDER = 'deadline_reminder',
  TREND_ALERT = 'trend_alert',
  RISK_ALERT = 'risk_alert',
}
```

### 3.4 IntelligenceUserPreferences (用戶偏好)

```typescript
interface IntelligenceUserPreferences {
  id: string;
  userId: string;
  persona: PersonaType;
  preferredCategories: IntelligenceCategory[];
  preferredPriorities: IntelligencePriority[];
  preferredIndustries: string[];
  preferredRegions: string[];
  notificationSettings: NotificationSettings;
  dashboardLayout: DashboardLayout;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours?: {
    start: string;
    end: string;
  };
}

interface DashboardLayout {
  sections: DashboardSection[];
}

interface DashboardSection {
  id: string;
  type: 'daily_briefing' | 'trend_prediction' | 'risk_alert' | 'regulatory_update';
  position: number;
  visible: boolean;
  config: Record<string, any>;
}
```

---

## 4. API 設計

### 4.1 情報 API

#### GET /api/intelligence/items

取得情報項目列表

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `category`: IntelligenceCategory
- `priority`: IntelligencePriority
- `impactLevel`: IntelligenceImpactLevel
- `persona`: PersonaType
- `search`: string
- `startDate`: string (ISO 8601)
- `endDate`: string (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [IntelligenceItem],
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

#### GET /api/intelligence/items/:id

取得單一情報項目

**Response:**
```json
{
  "success": true,
  "data": IntelligenceItem
}
```

#### POST /api/intelligence/items

建立情報項目

**Request Body:**
```json
{
  "title": string,
  "summary": string,
  "content": string,
  "source": string,
  "sourceUrl": string,
  "category": IntelligenceCategory,
  "priority": IntelligencePriority,
  "tags": string[],
  "relatedStandards": string[]
}
```

**Response:**
```json
{
  "success": true,
  "data": IntelligenceItem
}
```

### 4.2 分析 API

#### POST /api/intelligence/analysis/:intelligenceId

分析情報項目

**Request Body:**
```json
{
  "analysisTypes": AnalysisType[]
}
```

**Response:**
```json
{
  "success": true,
  "data": [IntelligenceAnalysis]
}
```

### 4.3 通知 API

#### GET /api/intelligence/notifications

取得用戶通知

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `unreadOnly`: boolean (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [IntelligenceNotification],
    "total": 50,
    "unreadCount": 10
  }
}
```

#### PUT /api/intelligence/notifications/:id/read

標記通知為已讀

**Response:**
```json
{
  "success": true,
  "data": IntelligenceNotification
}
```

### 4.4 偏好 API

#### GET /api/intelligence/preferences

取得用戶偏好

**Response:**
```json
{
  "success": true,
  "data": IntelligenceUserPreferences
}
```

#### PUT /api/intelligence/preferences

更新用戶偏好

**Request Body:**
```json
{
  "persona": PersonaType,
  "preferredCategories": IntelligenceCategory[],
  "preferredPriorities": IntelligencePriority[],
  "notificationSettings": NotificationSettings,
  "dashboardLayout": DashboardLayout
}
```

**Response:**
```json
{
  "success": true,
  "data": IntelligenceUserPreferences
}
```

---

## 5. 服務層設計

### 5.1 IntelligenceDetectionService (核心服務)

```typescript
class IntelligenceDetectionService {
  // 取得情報項目列表
  async getIntelligenceItems(params: GetIntelligenceItemsParams): Promise<PaginatedResponse<IntelligenceItem>>;
  
  // 取得單一情報項目
  async getIntelligenceItem(id: string): Promise<IntelligenceItem>;
  
  // 建立情報項目
  async createIntelligenceItem(data: CreateIntelligenceItemData): Promise<IntelligenceItem>;
  
  // 更新情報項目
  async updateIntelligenceItem(id: string, data: UpdateIntelligenceItemData): Promise<IntelligenceItem>;
  
  // 刪除情報項目
  async deleteIntelligenceItem(id: string): Promise<void>;
  
  // 搜尋情報項目
  async searchIntelligenceItems(query: string, filters?: IntelligenceFilters): Promise<IntelligenceItem[]>;
  
  // 取得每日簡報
  async getDailyBriefing(date?: Date): Promise<DailyBriefing>;
  
  // 取得趨勢預測
  async getTrendPrediction(category: IntelligenceCategory): Promise<TrendPrediction>;
  
  // 取得風險預警
  async getRiskAlerts(severity?: IntelligenceImpactLevel): Promise<RiskAlert[]>;
  
  // 取得法規更新對照表
  async getRegulatoryUpdates(): Promise<RegulatoryUpdate[]>;
  
  // 取得供應商分群情報
  async getSupplierGroupedIntelligence(supplierId?: string): Promise<SupplierGroupedIntelligence>;
}
```

### 5.2 IntelligenceAnalysisService (分析服務)

```typescript
class IntelligenceAnalysisService {
  // 分析情報項目
  async analyzeIntelligence(intelligenceId: string, analysisTypes: AnalysisType[]): Promise<IntelligenceAnalysis[]>;
  
  // 計算關聯分數
  async calculateRelevanceScore(intelligence: IntelligenceItem, userContext: UserContext): Promise<number>;
  
  // 識別相關準則條款
  async identifyRelatedStandards(intelligence: IntelligenceItem): Promise<string[]>;
  
  // 生成建議行動
  async generateSuggestedActions(intelligence: IntelligenceItem): Promise<SuggestedAction[]>;
  
  // 生成角色化摘要
  async generatePersonaSummary(intelligence: IntelligenceItem, persona: PersonaType): Promise<string>;
  
  // 估算成本影響
  async estimateCostImpact(intelligence: IntelligenceItem): Promise<CostRange>;
}
```

### 5.3 IntelligenceFilterService (篩選服務)

```typescript
class IntelligenceFilterService {
  // 根據角色篩選情報
  async filterByPersona(items: IntelligenceItem[], persona: PersonaType): Promise<IntelligenceItem[]>;
  
  // 根據優先級篩選情報
  async filterByPriority(items: IntelligenceItem[], priorities: IntelligencePriority[]): Promise<IntelligenceItem[]>;
  
  // 根據影響等級篩選情報
  async filterByImpactLevel(items: IntelligenceItem[], impactLevels: IntelligenceImpactLevel[]): Promise<IntelligenceItem[]>;
  
  // 根據類別篩選情報
  async filterByCategory(items: IntelligenceItem[], categories: IntelligenceCategory[]): Promise<IntelligenceItem[]>;
  
  // 根據供應商分群篩選情報
  async filterBySupplierGroup(items: IntelligenceItem[], supplierGroup: SupplierGroup): Promise<IntelligenceItem[]>;
}
```

### 5.4 IntelligenceNotificationService (通知服務)

```typescript
class IntelligenceNotificationService {
  // 建立通知
  async createNotification(data: CreateNotificationData): Promise<IntelligenceNotification>;
  
  // 取得用戶通知
  async getUserNotifications(userId: string, params: GetNotificationsParams): Promise<PaginatedResponse<IntelligenceNotification>>;
  
  // 標記通知為已讀
  async markAsRead(notificationId: string): Promise<IntelligenceNotification>;
  
  // 標記所有通知為已讀
  async markAllAsRead(userId: string): Promise<void>;
  
  // 刪除通知
  async deleteNotification(notificationId: string): Promise<void>;
  
  // 發送每日簡報通知
  async sendDailyBriefingNotification(userId: string): Promise<void>;
  
  // 發送風險預警通知
  async sendRiskAlertNotification(userId: string, riskAlert: RiskAlert): Promise<void>;
}
```

---

## 6. 頁面層設計

### 6.1 IntelligenceDetectionPage (主頁面)

```typescript
interface IntelligenceDetectionPageProps {
  persona?: PersonaType;
}

const IntelligenceDetectionPage: React.FC<IntelligenceDetectionPageProps> = ({ persona }) => {
  // 頁面狀態
  const [currentView, setCurrentView] = useState<IntelligenceView>('dashboard');
  const [selectedItem, setSelectedItem] = useState<IntelligenceItem | null>(null);
  const [filters, setFilters] = useState<IntelligenceFilters>({});
  
  // 頁面組件
  return (
    <div className="intelligence-detection-page">
      <IntelligenceHeader />
      <IntelligenceNavigation currentView={currentView} onViewChange={setCurrentView} />
      <IntelligenceFilter filters={filters} onFilterChange={setFilters} />
      
      {currentView === 'dashboard' && (
        <IntelligenceDashboard persona={persona} filters={filters} />
      )}
      {currentView === 'daily_briefing' && (
        <DailyBriefingView persona={persona} />
      )}
      {currentView === 'trend_prediction' && (
        <TrendPredictionView persona={persona} />
      )}
      {currentView === 'risk_alert' && (
        <RiskAlertView persona={persona} />
      )}
      {currentView === 'regulatory_update' && (
        <RegulatoryUpdateView persona={persona} />
      )}
      {currentView === 'supplier_group' && (
        <SupplierGroupView persona={persona} />
      )}
      
      {selectedItem && (
        <IntelligenceDetailModal
          item={selectedItem}
          persona={persona}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};
```

### 6.2 IntelligenceDashboard (儀表板)

```typescript
interface IntelligenceDashboardProps {
  persona?: PersonaType;
  filters?: IntelligenceFilters;
}

const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({ persona, filters }) => {
  const { data: briefing } = useDailyBriefing();
  const { data: trends } = useTrendPrediction();
  const { data: alerts } = useRiskAlerts();
  const { data: updates } = useRegulatoryUpdates();
  
  return (
    <div className="intelligence-dashboard">
      <BentoGrid>
        <BentoGridItem className="col-span-2">
          <DailyBriefingCard briefing={briefing} persona={persona} />
        </BentoGridItem>
        <BentoGridItem>
          <TrendPredictionCard trends={trends} persona={persona} />
        </BentoGridItem>
        <BentoGridItem>
          <RiskAlertCard alerts={alerts} persona={persona} />
        </BentoGridItem>
        <BentoGridItem className="col-span-2">
          <RegulatoryUpdateCard updates={updates} persona={persona} />
        </BentoGridItem>
        <BentoGridItem>
          <IntelligenceFeed filters={filters} persona={persona} />
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
};
```

---

## 7. 組件層設計

### 7.1 IntelligenceCard (情報卡片)

```typescript
interface IntelligenceCardProps {
  item: IntelligenceItem;
  persona?: PersonaType;
  onClick?: () => void;
  onActionClick?: (action: SuggestedAction) => void;
}

const IntelligenceCard: React.FC<IntelligenceCardProps> = ({ item, persona, onClick, onActionClick }) => {
  const personaRelevance = item.personaRelevance.find(p => p.persona === persona);
  const summary = personaRelevance?.customSummary || item.summary;
  const actions = personaRelevance?.customActions || item.suggestedActions.map(a => a.title);
  
  return (
    <Card className="intelligence-card" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={getPriorityVariant(item.priority)}>
            {getPriorityLabel(item.priority)}
          </Badge>
          <Badge variant={getImpactVariant(item.impactLevel)}>
            {getImpactLabel(item.impactLevel)}
          </Badge>
        </div>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
          <span className="text-sm text-muted-foreground">
            關聯分數: {item.relevanceScore}%
          </span>
        </div>
        {item.suggestedActions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">建議行動</h4>
            <div className="space-y-2">
              {item.suggestedActions.slice(0, 3).map(action => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick?.(action);
                  }}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            {formatDate(item.publishedAt)}
          </span>
          <span className="text-xs text-muted-foreground">
            {item.source}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
```

### 7.2 IntelligenceFilter (篩選器)

```typescript
interface IntelligenceFilterProps {
  filters: IntelligenceFilters;
  onFilterChange: (filters: IntelligenceFilters) => void;
}

const IntelligenceFilter: React.FC<IntelligenceFilterProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="intelligence-filter">
      <Input
        placeholder="搜尋情報..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />
      <Select
        value={filters.category}
        onValueChange={(value) => onFilterChange({ ...filters, category: value as IntelligenceCategory })}
      >
        <SelectTrigger>
          <SelectValue placeholder="選擇類別" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(IntelligenceCategory).map(category => (
            <SelectItem key={category} value={category}>
              {getCategoryLabel(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority}
        onValueChange={(value) => onFilterChange({ ...filters, priority: value as IntelligencePriority })}
      >
        <SelectTrigger>
          <SelectValue placeholder="選擇優先級" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(IntelligencePriority).map(priority => (
            <SelectItem key={priority} value={priority}>
              {getPriorityLabel(priority)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.impactLevel}
        onValueChange={(value) => onFilterChange({ ...filters, impactLevel: value as IntelligenceImpactLevel })}
      >
        <SelectTrigger>
          <SelectValue placeholder="選擇影響等級" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(IntelligenceImpactLevel).map(level => (
            <SelectItem key={level} value={level}>
              {getImpactLabel(level)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
```

---

## 8. 角色化介面設計

### 8.1 Persona 1: 傳產中小企業老闆 (CEO)

**核心需求：** 老闆版三段摘要（風險/機會/本週行動）

```typescript
const CEOIntelligenceView: React.FC = () => {
  const { data: briefing } = useDailyBriefing();
  
  return (
    <div className="ceo-intelligence-view">
      <h2>老闆版每日簡報</h2>
      <div className="ceo-summary">
        <div className="risk-section">
          <h3>⚠️ 風險</h3>
          {briefing?.risks.map(risk => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
        <div className="opportunity-section">
          <h3>🎯 機會</h3>
          {briefing?.opportunities.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
        <div className="action-section">
          <h3>📋 本週行動</h3>
          {briefing?.weeklyActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 8.2 Persona 2: 上市櫃公司 ESG 專員 (ESG Specialist)

**核心需求：** 法規更新對照表、一鍵派任務

```typescript
const ESGSpecialistIntelligenceView: React.FC = () => {
  const { data: updates } = useRegulatoryUpdates();
  const { createTask } = useTaskManagement();
  
  const handleCreateTask = async (intelligenceId: string, action: SuggestedAction) => {
    await createTask({
      title: action.title,
      description: action.description,
      priority: action.priority,
      deadline: action.deadline,
      assignee: action.assignee,
      relatedIntelligenceId: intelligenceId,
    });
  };
  
  return (
    <div className="esg-specialist-intelligence-view">
      <h2>法規更新對照表</h2>
      <RegulatoryUpdateTable updates={updates} onCreateTask={handleCreateTask} />
    </div>
  );
};
```

### 8.3 Persona 3: CFO / 財務主管 (CFO)

**核心需求：** 每則情報附「可能成本/避免損失區間」

```typescript
const CFOIntelligenceView: React.FC = () => {
  const { data: items } = useIntelligenceItems();
  
  return (
    <div className="cfo-intelligence-view">
      <h2>財務影響分析</h2>
      <div className="intelligence-list">
        {items?.map(item => (
          <CFOIntelligenceCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const CFOIntelligenceCard: React.FC<{ item: IntelligenceItem }> = ({ item }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        {item.suggestedActions.map(action => (
          <div key={action.id} className="cost-impact">
            <h4>{action.title}</h4>
            {action.estimatedCost && (
              <div className="cost-range">
                <span>可能成本: {formatCurrency(action.estimatedCost.min)} - {formatCurrency(action.estimatedCost.max)}</span>
              </div>
            )}
            {action.estimatedImpact && (
              <div className="impact-range">
                <span>避免損失: {action.estimatedImpact}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
```

### 8.4 Persona 4: 供應鏈管理主管 (Supply Chain Manager)

**核心需求：** 消息自動映射供應商分群（A/B/C）

```typescript
const SupplyChainIntelligenceView: React.FC = () => {
  const { data: groupedIntelligence } = useSupplierGroupedIntelligence();
  
  return (
    <div className="supply-chain-intelligence-view">
      <h2>供應鏈情報分群</h2>
      <Tabs defaultValue="group-a">
        <TabsList>
          <TabsTrigger value="group-a">A 群供應商</TabsTrigger>
          <TabsTrigger value="group-b">B 群供應商</TabsTrigger>
          <TabsTrigger value="group-c">C 群供應商</TabsTrigger>
        </TabsList>
        <TabsContent value="group-a">
          <SupplierGroupIntelligence group="A" intelligence={groupedIntelligence?.groupA} />
        </TabsContent>
        <TabsContent value="group-b">
          <SupplierGroupIntelligence group="B" intelligence={groupedIntelligence?.groupB} />
        </TabsContent>
        <TabsContent value="group-c">
          <SupplierGroupIntelligence group="C" intelligence={groupedIntelligence?.groupC} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### 8.5 Persona 5: 顧問公司專案經理 (Consultant PM)

**核心需求：** 一鍵「套用到哪些專案」功能

```typescript
const ConsultantIntelligenceView: React.FC = () => {
  const { data: items } = useIntelligenceItems();
  const { data: projects } = useProjects();
  const [selectedItem, setSelectedItem] = useState<IntelligenceItem | null>(null);
  
  const handleApplyToProjects = async (intelligenceId: string, projectIds: string[]) => {
    // 套用情報到專案
  };
  
  return (
    <div className="consultant-intelligence-view">
      <h2>專案應用</h2>
      <div className="intelligence-list">
        {items?.map(item => (
          <ConsultantIntelligenceCard
            key={item.id}
            item={item}
            projects={projects}
            onApplyToProjects={handleApplyToProjects}
          />
        ))}
      </div>
    </div>
  );
};
```

### 8.6 Persona 6: 銀行授信/投資評估端 (Bank Credit Analyst)

**核心需求：** 僅推送「影響授信條件」等級事件

```typescript
const BankCreditIntelligenceView: React.FC = () => {
  const { data: alerts } = useRiskAlerts(IntelligenceImpactLevel.CRITICAL);
  
  return (
    <div className="bank-credit-intelligence-view">
      <h2>授信條件影響事件</h2>
      <div className="critical-alerts">
        {alerts?.map(alert => (
          <CriticalAlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};
```

---

## 9. 整合現有系統

### 9.1 OmniCache 整合

```typescript
class IntelligenceDetectionService {
  private omniCache: OmniCache;
  
  async getIntelligenceItems(params: GetIntelligenceItemsParams): Promise<PaginatedResponse<IntelligenceItem>> {
    const cacheKey = `intelligence_items_${JSON.stringify(params)}`;
    
    // 嘗試從快取取得
    const cached = await this.omniCache.get<PaginatedResponse<IntelligenceItem>>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // 從資料庫取得
    const items = await this.fetchFromDatabase(params);
    
    // 存入快取
    await this.omniCache.set(cacheKey, items, { ttl: 300 }); // 5 分鐘
    
    return items;
  }
}
```

### 9.2 OmniResonanceCore 整合

```typescript
class IntelligenceAnalysisService {
  private resonanceCore: OmniResonanceCore;
  
  async calculateRelevanceScore(intelligence: IntelligenceItem, userContext: UserContext): Promise<number> {
    // 使用共鳴核心計算關聯分數
    const environmentalScore = this.resonanceCore.getResonance(OmniResonanceDimension.ENVIRONMENTAL);
    const socialScore = this.resonanceCore.getResonance(OmniResonanceDimension.SOCIAL);
    const governanceScore = this.resonanceCore.getResonance(OmniResonanceDimension.GOVERNANCE);
    
    // 根據情報類別計算加權分數
    let score = 0;
    switch (intelligence.category) {
      case IntelligenceCategory.REGULATORY_UPDATE:
        score = (governanceScore * 0.5) + (environmentalScore * 0.3) + (socialScore * 0.2);
        break;
      case IntelligenceCategory.RISK_ALERT:
        score = (governanceScore * 0.4) + (environmentalScore * 0.4) + (socialScore * 0.2);
        break;
      default:
        score = (environmentalScore + socialScore + governanceScore) / 3;
    }
    
    return Math.round(score * 100);
  }
}
```

### 9.3 OmniSyncService 整合

```typescript
class IntelligenceNotificationService {
  private syncService: OmniSyncService;
  
  async createNotification(data: CreateNotificationData): Promise<IntelligenceNotification> {
    const notification = await this.saveToDatabase(data);
    
    // 廣播通知到其他標籤
    this.syncService.broadcast({
      type: OmniSyncEventType.INTELLIGENCE_NOTIFICATION,
      payload: notification,
    });
    
    return notification;
  }
}
```

---

## 10. 實作計劃

### 10.1 階段 1: 基礎架構 (Week 1-2)

| 任務 | 描述 | 交付物 |
|------|------|--------|
| 類型定義 | 建立所有 TypeScript 類型定義 | `src/types/intelligence/` |
| 資料庫 Schema | 建立資料庫表格和遷移 | `server/migrations/` |
| API 路由 | 建立基本 API 路由 | `server/routes/intelligence.ts` |
| 服務層 | 建立核心服務類別 | `src/services/IntelligenceDetectionService.ts` |

### 10.2 階段 2: 核心功能 (Week 3-4)

| 任務 | 描述 | 交付物 |
|------|------|--------|
| 每日簡報 | 實作每日簡報功能 | `DailyBriefingView.tsx` |
| 趨勢預測 | 實作趨勢預測功能 | `TrendPredictionView.tsx` |
| 風險預警 | 實作風險預警功能 | `RiskAlertView.tsx` |
| 法規更新 | 實作法規更新對照表 | `RegulatoryUpdateView.tsx` |

### 10.3 階段 3: 角色化介面 (Week 5-6)

| 任務 | 描述 | 交付物 |
|------|------|--------|
| CEO 視圖 | 實作老闆版三段摘要 | `CEOIntelligenceView.tsx` |
| ESG 專員視圖 | 實作法規更新對照表 | `ESGSpecialistIntelligenceView.tsx` |
| CFO 視圖 | 實作成本影響分析 | `CFOIntelligenceView.tsx` |
| 供應鏈視圖 | 實作供應商分群 | `SupplyChainIntelligenceView.tsx` |
| 顧問視圖 | 實作專案應用 | `ConsultantIntelligenceView.tsx` |
| 銀行視圖 | 實作授信條件事件 | `BankCreditIntelligenceView.tsx` |

### 10.4 階段 4: 整合與測試 (Week 7-8)

| 任務 | 描述 | 交付物 |
|------|------|--------|
| Omni 整合 | 整合 OmniCache、OmniResonanceCore、OmniSyncService | 整合代碼 |
| 路由整合 | 整合到現有路由系統 | `navigation.config.ts` 更新 |
| 測試 | 單元測試、整合測試 | 測試報告 |
| 文檔 | API 文檔、用戶手冊 | 文檔 |

---

## 附錄

### A. 相關文件

- [`ESG_GO_PRODUCT_ROADMAP.md`](ESG_GO_PRODUCT_ROADMAP.md) - 產品路線圖
- [`ESG_GO_USER_JOURNEYS.md`](ESG_GO_USER_JOURNEYS.md) - 用戶流程圖
- [`ESG_GO_BUSINESS_MODEL.md`](ESG_GO_BUSINESS_MODEL.md) - 商業模式地圖
- [`ESG_GO_USER_EXPERIENCE_DESIGN.md`](ESG_GO_USER_EXPERIENCE_DESIGN.md) - 使用者體驗設計

### B. 術語表

| 術語 | 定義 |
|------|------|
| **情報項目** | 一條 ESG 相關的新聞、法規更新或趨勢資訊 |
| **關聯分數** | 情報項目與用戶公司的關聯程度（0-100） |
| **影響等級** | 情報項目對公司的影響程度（CRITICAL/HIGH/MEDIUM/LOW） |
| **角色化介面** | 根據不同 Persona 定製的介面 |
| **供應商分群** | 根據 ESG 表現將供應商分為 A/B/C 三群 |

### C. 版本歷史

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|----------|------|
| v1.0 | 2026-02-11 | 初始版本 | Kilo Code |
