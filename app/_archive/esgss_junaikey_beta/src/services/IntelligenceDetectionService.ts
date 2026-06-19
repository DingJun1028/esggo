import { getSupabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, omniLogger } from '@/omni/infrastructure/logging/OmniLogger';
import { SystemError } from '@/omni/infrastructure/errors/SystemError';
import { omniCache } from '@/services/OmniCacheService';
import type {
  IntelligenceItem,
  CreateIntelligenceItemInput,
  UpdateIntelligenceItemInput,
  IntelligenceQueryParams,
  IntelligenceListResponse,
  TrendPrediction,
  Category,
  Source,
  Tag,
  AnalysisResult,
  CreateAnalysisInput,
  Notification,
  UserPreferences,
  UpdatePreferencesInput,
  RegulationUpdate,
  ConvertToTaskInput,
  ConvertedTask,
  DailyBrief,
  CreateDailyBriefInput,
} from '@/types/intelligence/index';

// 內部使用的擴展類型
type TrendItem = {
  id: string;
  label: string;
  value: number;
  change: number;
  status: 'up' | 'down' | 'stable';
};


/**
 * 商情偵測中心服務
 * Intelligence Detection Center Service
 */
export class IntelligenceDetectionService {
  private static instance: IntelligenceDetectionService;

  private constructor() { }

  public static getInstance(): IntelligenceDetectionService {
    if (!IntelligenceDetectionService.instance) {
      IntelligenceDetectionService.instance = new IntelligenceDetectionService();
    }
    return IntelligenceDetectionService.instance;
  }

  // ============================================================================
  // 情報項目 (Intelligence Items)
  // ============================================================================

  /**
   * 取得情報項目列表
   */
  public async getIntelligenceItems(params: IntelligenceQueryParams = {}): Promise<IntelligenceListResponse> {
    const cacheKey = JSON.stringify(params);

    return omniCache.getOrSet('knowledge', `items:${cacheKey}`, async () => {
      let query = getSupabase()
        .from('intelligence_items' as any)
        .select('*', { count: 'exact' });

      // 應用過濾
      if (params.category) query = query.eq('category', params.category);
      if (params.type) query = query.eq('type', params.type);
      if (params.status) query = query.eq('status', params.status);
      if (params.sourceId) query = query.eq('source_id', params.sourceId);

      // 關鍵字搜索
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,content.ilike.%${params.query}%`);
      }

      // 排序與分頁
      const orderBy = params.orderBy || 'created_at';
      const orderDir = params.orderDir || 'desc';
      query = query.order(orderBy, { ascending: orderDir === 'asc' });

      if (params.limit) {
        const offset = params.offset || 0;
        query = query.range(offset, offset + params.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to fetch intelligence items: ${error.message}`,
          details: error,
          params
        });
      }

      return {
        items: data ? (data as any[]).map(this.mapDbItemToIntelligenceItem) : [],
        total: count || 0,
        page: params.page || 1,
        limit: params.limit || 20,
        hasMore: ((params.page || 1) * (params.limit || 20)) < (count || 0)
      };
    });
  }

  /**
   * 取得單一情報項目
   */
  async getIntelligenceItemById(id: string): Promise<IntelligenceItem> {
    const { data, error } = await getSupabase()
      .from('intelligence_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw SystemError.resourceNotFound({ id, table: 'intelligence_items' });
      }
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch intelligence item ${id}: ${error.message}`,
        details: error
      });
    }

    return this.mapDbItemToIntelligenceItem(data);
  }

  /**
   * 建立情報項目
   */
  async createIntelligenceItem(
    input: CreateIntelligenceItemInput,
    userId?: string
  ): Promise<IntelligenceItem> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newItem = {
      id,
      title: input.title,
      summary: input.summary,
      content: input.content,
      source: input.source,
      source_url: input.sourceUrl,
      category: input.category,
      priority: input.priority,
      relevance_score: 0,
      impact_level: this.calculateImpactLevel(input.priority),
      created_at: now,
      updated_at: now,
      published_at: now,
      tags: input.tags,
      related_standards: input.relatedStandards,
      suggested_actions: [],
      persona_relevance: [],
      metadata: {
        author: userId || 'system',
        language: 'zh-TW',
        region: 'TW',
        industry: 'all',
        sentiment: 'neutral',
        confidence: 1.0,
      },
    };

    const { data, error } = await (getSupabase()
      .from('intelligence_items' as any)
      .insert(newItem)
      .select()
      .single() as any);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to create intelligence item: ${error.message}`,
        details: error,
        input
      });
    }

    return this.mapDbItemToIntelligenceItem(data);
  }

  /**
   * 更新情報項目
   */
  async updateIntelligenceItem(
    id: string,
    input: UpdateIntelligenceItemInput
  ): Promise<IntelligenceItem> {
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.title !== undefined) updates.title = input.title;
    if (input.summary !== undefined) updates.summary = input.summary;
    if (input.content !== undefined) updates.content = input.content;
    if (input.source !== undefined) updates.source = input.source;
    if (input.sourceUrl !== undefined) updates.source_url = input.sourceUrl;
    if (input.category !== undefined) updates.category = input.category;
    if (input.priority !== undefined) {
      updates.priority = input.priority;
      updates.impact_level = this.calculateImpactLevel(input.priority);
    }
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.relatedStandards !== undefined) updates.related_standards = input.relatedStandards;

    const { data, error } = await getSupabase()
      .from('intelligence_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to update intelligence item: ${error.message}`,
        details: error,
        id,
        input
      });
    }

    if (!data) {
      throw SystemError.resourceNotFound({ id, table: 'intelligence_items' });
    }

    return this.mapDbItemToIntelligenceItem(data);
  }

  /**
   * 刪除情報項目
   */
  async deleteIntelligenceItem(id: string): Promise<void> {
    const { error } = await getSupabase()
      .from('intelligence_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to delete intelligence item ${id}: ${error.message}`,
        details: error
      });
    }
  }

  // ============================================================================
  // 每日簡報 (Daily Briefs)
  // ============================================================================

  /**
   * 取得每日簡報列表
   */
  async getDailyBriefs(page: number = 1, limit: number = 20): Promise<{ items: DailyBrief[]; total: number }> {
    const offset = (page - 1) * limit;

    const { data, error, count } = await getSupabase()
      .from('daily_briefs')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch daily briefs: ${error.message}`,
        details: error,
        page,
        limit
      });
    }

    const items = data?.map(this.mapDbItemToDailyBrief) || [];
    const total = count || 0;

    return { items, total };
  }

  /**
   * 取得單一每日簡報
   */
  async getDailyBriefById(id: string): Promise<DailyBrief> {
    const { data, error } = await getSupabase()
      .from('daily_briefs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw SystemError.resourceNotFound({ id, table: 'daily_briefs' });
      }
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch daily brief: ${error.message}`,
        details: error,
        id
      });
    }

    if (!data) {
      throw SystemError.resourceNotFound({ id, table: 'daily_briefs' });
    }

    return this.mapDbItemToDailyBrief(data);
  }

  /**
   * 建立每日簡報
   */
  async createDailyBrief(input: CreateDailyBriefInput, userId: string): Promise<DailyBrief> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newBrief = {
      id,
      date: input.date,
      title: input.title,
      summary: input.summary,
      content: input.content,
      intelligence_items: input.intelligenceItems,
      key_insights: input.keyInsights,
      recommended_actions: input.recommendedActions,
      created_at: now,
      updated_at: now,
      created_by: userId,
    };

    const { data, error } = await getSupabase()
      .from('daily_briefs')
      .insert(newBrief)
      .select()
      .single();

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to create daily brief: ${error.message}`,
        details: error,
        input
      });
    }

    return this.mapDbItemToDailyBrief(data);
  }

  // ============================================================================
  // 趨勢預測 (Trend Predictions)
  // ============================================================================

  /**
   * 取得趨勢預測列表
   */
  public async getTrends(category?: string, limit: number = 5): Promise<TrendItem[]> {
    return omniCache.getOrSet('knowledge', `trends:${category || 'all'}:${limit}`, async () => {
      let query = getSupabase()
        .from('intelligence_items' as any)
        .select('*')
        .order('impact_score', { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to fetch trends: ${error.message}`,
          details: error,
          category,
          limit
        });
      }

      return data ? (data as any[]).map(item => ({
        id: item.id,
        label: item.title,
        value: item.impact_score || 0,
        change: Math.floor(Math.random() * 20) - 10, // 模擬數據
        status: (item.impact_score || 0) > 70 ? 'up' : (item.impact_score || 0) > 40 ? 'stable' : 'down'
      })) : [];
    });
  }

  // ============================================================================
  // 類別 (Categories)
  // ============================================================================

  /**
   * 取得類別列表
   */
  public async getDailyBrief(userId: string): Promise<DailyBrief | null> {
    return omniCache.getOrSet('knowledge', `brief:${userId}`, async () => {
      const { data, error } = await getSupabase()
        .from('intelligence_daily_briefs' as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw SystemError.apiRequestFailed({
          message: `Failed to fetch daily brief: ${error.message}`,
          details: error,
          userId
        });
      }

      return data ? this.mapDbItemToDailyBrief(data) : null;
    });
  }

  // ============================================================================
  // 來源 (Sources)
  // ============================================================================

  /**
   * 取得來源列表
   */
  async getSources(): Promise<Source[]> {
    const { data, error } = await getSupabase()
      .from('intelligence_sources')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch sources: ${error.message}`,
        details: error
      });
    }

    return data?.map(this.mapDbItemToSource) || [];
  }

  // ============================================================================
  // 標籤 (Tags)
  // ============================================================================

  /**
   * 取得標籤列表
   */
  async getTags(): Promise<Tag[]> {
    const { data, error } = await getSupabase()
      .from('intelligence_tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch intelligence tags: ${error.message}`,
        details: error
      });
    }

    return data?.map(this.mapDbItemToTag) || [];
  }

  // ============================================================================
  // 分析 (Analysis)
  // ============================================================================

  /**
   * 分析情報項目
   */
  async analyzeIntelligenceItem(
    intelligenceId: string,
    input: CreateAnalysisInput
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const now = new Date().toISOString();

    for (const analysisType of input.analysisTypes) {
      const id = uuidv4();
      const result = await this.performAnalysis(intelligenceId, analysisType);

      const newAnalysis = {
        id,
        intelligence_id: intelligenceId,
        analysis_type: analysisType,
        result,
        created_at: now,
        processed_by: 'ai',
        confidence: result.confidence || 0.9,
      };

      const { data, error } = await getSupabase()
        .from('intelligence_analysis')
        .insert(newAnalysis)
        .select()
        .single();

      if (error) {
        throw SystemError.apiRequestFailed({
          message: `Failed to create intelligence analysis: ${error.message}`,
          details: error,
          input
        });
      }

      results.push(this.mapDbItemToAnalysisResult(data));
    }

    return results;
  }

  /**
   * 取得分析結果
   */
  async getAnalysisResults(intelligenceId: string, analysisType?: string): Promise<AnalysisResult[]> {
    let query = getSupabase()
      .from('intelligence_analysis')
      .select('*')
      .eq('intelligence_id', intelligenceId)
      .order('created_at', { ascending: false });

    if (analysisType) {
      query = query.eq('analysis_type', analysisType);
    }

    const { data, error } = await query;

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch analysis results: ${error.message}`,
        details: error,
        intelligenceId,
        analysisType
      });
    }

    return data?.map(this.mapDbItemToAnalysisResult) || [];
  }

  // ============================================================================
  // 通知 (Notifications)
  // ============================================================================

  /**
   * 取得用戶通知
   */
  async getNotifications(userId: string, onlyUnread: boolean = false): Promise<Notification[]> {
    let query = getSupabase()
      .from('intelligence_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (onlyUnread) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch notifications: ${error.message}`,
        details: error,
        userId,
        onlyUnread
      });
    }

    return data?.map(this.mapDbItemToNotification) || [];
  }

  /**
   * 標記通知為已讀
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await getSupabase()
      .from('intelligence_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to mark notification as read: ${error.message}`,
        details: error,
        notificationId
      });
    }
  }

  /**
   * 標記所有通知為已讀
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const { error } = await getSupabase()
      .from('intelligence_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to mark all notifications as read: ${error.message}`,
        details: error,
        userId
      });
    }
  }

  /**
   * 刪除通知
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await getSupabase()
      .from('intelligence_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to delete notification: ${error.message}`,
        details: error,
        notificationId
      });
    }
  }

  // ============================================================================
  // 偏好設定 (Preferences)
  // ============================================================================

  /**
   * 取得用戶偏好
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const { data, error } = await getSupabase()
      .from('intelligence_user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Preference not found, return default
        return {
          userId,
          categories: [],
          priorities: [],
          personas: [],
          notificationSettings: { email: true, push: true, frequency: 'daily' },
          language: 'zh-TW',
          timezone: 'Asia/Taipei',
        };
      }
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch user preferences: ${error.message}`,
        details: error
      });
    }

    return this.mapDbItemToUserPreferences(data);
  }

  /**
   * 更新用戶偏好
   */
  async updateUserPreferences(userId: string, input: UpdatePreferencesInput): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    const now = new Date().toISOString();

    const updates: any = {
      updated_at: now,
    };

    if (input.categories !== undefined) updates.categories = input.categories;
    if (input.priorities !== undefined) updates.priorities = input.priorities;
    if (input.personas !== undefined) updates.personas = input.personas;
    if (input.notificationSettings !== undefined) {
      updates.notification_settings = {
        ...existing.notificationSettings,
        ...input.notificationSettings,
      };
    }
    if (input.language !== undefined) updates.language = input.language;
    if (input.timezone !== undefined) updates.timezone = input.timezone;

    const updateData = {
      user_id: userId,
      ...existing, // Include existing data to ensure all fields are present for upsert
      ...updates,
    };

    const { data, error } = await getSupabase()
      .from('intelligence_user_preferences')
      .upsert(updateData)
      .select()
      .single();

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to update preferences: ${error.message}`,
        details: error,
        userId,
        input
      });
    }

    return this.mapDbItemToUserPreferences(data);
  }

  // ============================================================================
  // 法規更新對照表 (Regulation Updates)
  // ============================================================================

  /**
   * 取得法規更新對照表
   */
  async getRegulationUpdates(): Promise<RegulationUpdate[]> {
    const { data, error } = await getSupabase()
      .from('regulation_updates')
      .select('*')
      .order('effective_date', { ascending: false });

    if (error) {
      throw SystemError.apiRequestFailed({
        message: `Failed to fetch regulation updates: ${error.message}`,
        details: error
      });
    }

    return data?.map(this.mapDbItemToRegulationUpdate) || [];
  }

  // ============================================================================
  // 任務轉換 (Task Conversion)
  // ============================================================================

  /**
   * 轉換為任務
   */
  async convertToTask(input: ConvertToTaskInput, userId: string): Promise<ConvertedTask> {
    const intelligenceItem = await this.getIntelligenceItemById(input.intelligenceId);
    const action = intelligenceItem.suggestedActions.find((a: any) => a.id === input.actionId);

    if (!action) {
      throw new Error('Action not found');
    }

    const taskId = uuidv4();
    const now = new Date().toISOString();

    const task = {
      id: taskId,
      intelligence_id: input.intelligenceId,
      title: action.title,
      description: action.description,
      assignee_id: input.assigneeId || userId,
      status: 'pending',
      priority: input.priority || action.priority,
      due_date: input.dueDate || action.deadline || now,
      created_at: now,
      notes: input.notes,
    };

    // 這裡應該插入到任務表，但為了簡化，我們直接返回
    return {
      id: task.id,
      intelligenceId: task.intelligence_id,
      title: task.title,
      description: task.description,
      assigneeId: task.assignee_id,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      createdAt: task.created_at,
    };
  }

  // ============================================================================
  // 輔助方法 (Helper Methods)
  // ============================================================================

  /**
   * 計算影響等級
   */
  private calculateImpactLevel(priority: string): string {
    const impactMap: Record<string, string> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      critical: 'critical',
    };
    return impactMap[priority] || 'medium';
  }

  /**
   * 執行分析
   */
  private async performAnalysis(intelligenceId: string, analysisType: string): Promise<any> {
    // 這裡應該實際執行 AI 分析
    // 為了簡化，返回模擬結果
    const mockResults: Record<string, any> = {
      sentiment: {
        score: 0.3,
        details: {
          positive: 0.2,
          negative: 0.5,
          neutral: 0.3,
        },
        recommendations: ['建議關注負面情緒', '準備回應策略'],
        confidence: 0.95,
      },
      relevance: {
        score: 85,
        details: {
          environmental: 90,
          social: 70,
          governance: 95,
        },
        recommendations: ['高度相關，建議優先處理'],
        confidence: 0.92,
      },
      impact: {
        score: 75,
        details: {
          financial: 80,
          operational: 70,
          reputational: 75,
        },
        recommendations: ['中等影響，需要評估'],
        confidence: 0.88,
      },
      trend: {
        direction: 'increasing',
        magnitude: 'high',
        timeframe: '6-12 months',
        confidence: 0.85,
      },
      risk: {
        level: 'medium',
        probability: 0.6,
        impact: 'high',
        mitigation: ['監控發展', '制定應對計劃'],
        confidence: 0.90,
      },
    };

    return mockResults[analysisType] || { confidence: 0.5 };
  }

  /**
   * 取得預設偏好設定
   */
  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      categories: ['regulatory_update', 'market_trend'],
      priorities: ['high', 'critical'],
      personas: ['ceo', 'csro'],
      notificationSettings: {
        email: true,
        push: true,
        frequency: 'daily',
      },
      language: 'zh-TW',
      timezone: 'Asia/Taipei',
    };
  }

  // ============================================================================
  // 資料庫映射方法 (Database Mapping Methods)
  // ============================================================================

  private mapDbItemToIntelligenceItem(dbItem: any): IntelligenceItem {
    return {
      id: dbItem.id,
      title: dbItem.title,
      summary: dbItem.summary,
      content: dbItem.content,
      source: dbItem.source,
      sourceUrl: dbItem.source_url,
      category: dbItem.category,
      priority: dbItem.priority,
      relevanceScore: dbItem.relevance_score,
      impactLevel: dbItem.impact_level,
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
      publishedAt: dbItem.published_at,
      tags: dbItem.tags || [],
      relatedStandards: dbItem.related_standards || [],
      suggestedActions: dbItem.suggested_actions || [],
      personaRelevance: dbItem.persona_relevance || [],
      metadata: dbItem.metadata || {
        language: 'zh-TW',
        region: 'TW',
        industry: 'all',
        sentiment: 'neutral',
        confidence: 1.0,
      },
    };
  }

  private mapDbItemToDailyBrief(dbItem: any): DailyBrief {
    return {
      id: dbItem.id,
      date: dbItem.date,
      title: dbItem.title,
      summary: dbItem.summary,
      content: dbItem.content,
      intelligenceItems: dbItem.intelligence_items || [],
      keyInsights: dbItem.key_insights || [],
      recommendedActions: dbItem.recommended_actions || [],
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
      createdBy: dbItem.created_by,
    };
  }

  private mapDbItemToTrendPrediction(dbItem: any): TrendPrediction {
    return {
      id: dbItem.id,
      category: dbItem.category,
      title: dbItem.title,
      description: dbItem.description,
      timeframe: dbItem.timeframe,
      confidence: dbItem.confidence,
      impact: dbItem.impact,
      dataPoints: dbItem.data_points || [],
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
    };
  }

  private mapDbItemToCategory(dbItem: any): Category {
    return {
      id: dbItem.id,
      name: dbItem.name,
      displayName: dbItem.display_name,
      description: dbItem.description,
      color: dbItem.color,
      icon: dbItem.icon,
      isActive: dbItem.is_active,
    };
  }

  private mapDbItemToSource(dbItem: any): Source {
    return {
      id: dbItem.id,
      name: dbItem.name,
      url: dbItem.url,
      type: dbItem.type,
      reliability: dbItem.reliability,
      isActive: dbItem.is_active,
      lastCrawledAt: dbItem.last_crawled_at,
    };
  }

  private mapDbItemToTag(dbItem: any): Tag {
    return {
      id: dbItem.id,
      name: dbItem.name,
      category: dbItem.category,
      usageCount: dbItem.usage_count,
      createdAt: dbItem.created_at,
    };
  }

  private mapDbItemToAnalysisResult(dbItem: any): AnalysisResult {
    return {
      id: dbItem.id,
      intelligenceId: dbItem.intelligence_id,
      analysisType: dbItem.analysis_type,
      result: dbItem.result,
      createdAt: dbItem.created_at,
      processedBy: dbItem.processed_by,
      confidence: dbItem.confidence,
    };
  }

  private mapDbItemToNotification(dbItem: any): Notification {
    return {
      id: dbItem.id,
      userId: dbItem.user_id,
      type: dbItem.type,
      title: dbItem.title,
      message: dbItem.message,
      data: dbItem.data,
      isRead: dbItem.is_read,
      createdAt: dbItem.created_at,
      readAt: dbItem.read_at,
    };
  }

  private mapDbItemToUserPreferences(dbItem: any): UserPreferences {
    return {
      userId: dbItem.user_id,
      categories: dbItem.categories || [],
      priorities: dbItem.priorities || [],
      personas: dbItem.personas || [],
      notificationSettings: dbItem.notification_settings || {
        email: true,
        push: true,
        frequency: 'daily',
      },
      language: dbItem.language || 'zh-TW',
      timezone: dbItem.timezone || 'Asia/Taipei',
    };
  }

  private mapDbItemToRegulationUpdate(dbItem: any): RegulationUpdate {
    return {
      id: dbItem.id,
      regulationId: dbItem.regulation_id,
      regulationName: dbItem.regulation_name,
      jurisdiction: dbItem.jurisdiction,
      effectiveDate: dbItem.effective_date,
      status: dbItem.status,
      summary: dbItem.summary,
      impact: dbItem.impact,
      relatedIntelligenceIds: dbItem.related_intelligence_ids || [],
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
    };
  }
}

// 匯出單例實例
export const intelligenceDetectionService = IntelligenceDetectionService.getInstance();
