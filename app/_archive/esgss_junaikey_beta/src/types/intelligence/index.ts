/**
 * 商情偵測中心類型定義
 * Intelligence Detection Center Type Definitions
 */

// ============================================================================
// 情報項目類型 (Intelligence Items)
// ============================================================================

export type IntelligenceCategory =
  | 'regulatory_update'
  | 'market_trend'
  | 'competitor_activity'
  | 'technology_innovation'
  | 'sustainability_initiative'
  | 'policy_change'
  | 'industry_report'
  | 'news_event';

export type IntelligencePriority = 'low' | 'medium' | 'high' | 'critical';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type PersonaType = 'ceo' | 'cfo' | 'coo' | 'cmo' | 'csro' | 'cto' | 'general';

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: IntelligencePriority;
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface PersonaRelevance {
  persona: PersonaType;
  relevanceScore: number;
  customSummary: string;
  customActions: string[];
}

export interface IntelligenceMetadata {
  author?: string;
  language: string;
  region: string;
  industry: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl?: string;
  category: IntelligenceCategory;
  priority: IntelligencePriority;
  relevanceScore: number;
  impactLevel: ImpactLevel;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags: string[];
  relatedStandards: string[];
  suggestedActions: SuggestedAction[];
  personaRelevance: PersonaRelevance[];
  metadata: IntelligenceMetadata;
}

export interface CreateIntelligenceItemInput {
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl?: string;
  category: IntelligenceCategory;
  priority: IntelligencePriority;
  tags: string[];
  relatedStandards: string[];
}

export interface UpdateIntelligenceItemInput {
  title?: string;
  summary?: string;
  content?: string;
  source?: string;
  sourceUrl?: string;
  category?: IntelligenceCategory;
  priority?: IntelligencePriority;
  tags?: string[];
  relatedStandards?: string[];
}

export interface IntelligenceQueryParams {
  page?: number;
  limit?: number;
  offset?: number;
  category?: IntelligenceCategory;
  priority?: IntelligencePriority;
  impactLevel?: ImpactLevel;
  persona?: PersonaType;
  type?: string;
  status?: string;
  sourceId?: string;
  search?: string;
  query?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface IntelligenceListResponse {
  items: IntelligenceItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// 每日簡報類型 (Daily Briefs)
// ============================================================================

export interface DailyBrief {
  id: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  intelligenceItems: string[];
  keyInsights: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateDailyBriefInput {
  date: string;
  title: string;
  summary: string;
  content: string;
  intelligenceItems: string[];
  keyInsights: string[];
  recommendedActions: string[];
}

// ============================================================================
// 趨勢預測類型 (Trend Predictions)
// ============================================================================

export interface TrendPrediction {
  id: string;
  category: IntelligenceCategory;
  title: string;
  description: string;
  timeframe: string;
  confidence: number;
  impact: ImpactLevel;
  dataPoints: {
    date: string;
    value: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 類別類型 (Categories)
// ============================================================================

export interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

// ============================================================================
// 來源類型 (Sources)
// ============================================================================

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'news' | 'government' | 'industry' | 'academic' | 'social';
  reliability: number;
  isActive: boolean;
  lastCrawledAt?: string;
}

// ============================================================================
// 標籤類型 (Tags)
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  category: IntelligenceCategory;
  usageCount: number;
  createdAt: string;
}

// ============================================================================
// 分析類型 (Analysis)
// ============================================================================

export type AnalysisType = 'sentiment' | 'relevance' | 'impact' | 'trend' | 'risk';

export interface AnalysisResult {
  id: string;
  intelligenceId: string;
  analysisType: AnalysisType;
  result: any;
  createdAt: string;
  processedBy: string;
  confidence: number;
}

export interface CreateAnalysisInput {
  analysisTypes: AnalysisType[];
}

// ============================================================================
// 通知類型 (Notifications)
// ============================================================================

export type NotificationType = 'new_intelligence' | 'trend_alert' | 'deadline_reminder' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// ============================================================================
// 偏好設定類型 (Preferences)
// ============================================================================

export interface UserPreferences {
  userId: string;
  categories: IntelligenceCategory[];
  priorities: IntelligencePriority[];
  personas: PersonaType[];
  notificationSettings: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  language: string;
  timezone: string;
}

export interface UpdatePreferencesInput {
  categories?: IntelligenceCategory[];
  priorities?: IntelligencePriority[];
  personas?: PersonaType[];
  notificationSettings?: {
    email?: boolean;
    push?: boolean;
    frequency?: 'immediate' | 'daily' | 'weekly';
  };
  language?: string;
  timezone?: string;
}

// ============================================================================
// 法規更新對照表類型 (Regulation Updates)
// ============================================================================

export interface RegulationUpdate {
  id: string;
  regulationId: string;
  regulationName: string;
  jurisdiction: string;
  effectiveDate: string;
  status: 'proposed' | 'pending' | 'enacted' | 'amended' | 'repealed';
  summary: string;
  impact: ImpactLevel;
  relatedIntelligenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 任務轉換類型 (Task Conversion)
// ============================================================================

export interface ConvertToTaskInput {
  intelligenceId: string;
  actionId: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: IntelligencePriority;
  notes?: string;
}

export interface ConvertedTask {
  id: string;
  intelligenceId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: string;
  priority: IntelligencePriority;
  dueDate: string;
  createdAt: string;
}

// ============================================================================
// API 回應類型 (API Response Types)
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    messageTC?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
