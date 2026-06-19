/**
 * 商情偵測中心控制器
 * Intelligence Detection Center Controller
 */

import { Request, Response } from 'express';
import { intelligenceDetectionService } from '../../../src/services/IntelligenceDetectionService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../services/ErrorHandler.js';
import type {
  CreateIntelligenceItemInput,
  UpdateIntelligenceItemInput,
  IntelligenceQueryParams,
  CreateDailyBriefInput,
  CreateAnalysisInput,
  UpdatePreferencesInput,
  ConvertToTaskInput,
} from '../../../src/types/intelligence/index.js';

/**
 * 商情偵測中心控制器
 */
export class IntelligenceController {
  // ============================================================================
  // 情報項目 (Intelligence Items)
  // ============================================================================

  /**
   * GET /api/intelligence/items
   * 取得情報項目列表
   */
  public static getIntelligenceItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const params: IntelligenceQueryParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      category: req.query.category as any,
      priority: req.query.priority as any,
      impactLevel: req.query.impactLevel as any,
      persona: req.query.persona as any,
      search: req.query.search as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await intelligenceDetectionService.getIntelligenceItems(params);

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * GET /api/intelligence/items/:id
   * 取得單一情報項目
   */
  public static getIntelligenceItemById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    const item = await intelligenceDetectionService.getIntelligenceItemById(id);

    res.status(200).json({
      success: true,
      data: item,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * POST /api/intelligence/items
   * 建立情報項目
   */
  public static createIntelligenceItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: CreateIntelligenceItemInput = req.body;
    const userId = (req as any).user?.id;

    // 驗證必填欄位
    if (!input.title || !input.summary || !input.content || !input.source || !input.category || !input.priority) {
      throw new AppError('Missing required fields: title, summary, content, source, category, priority', 400, 'MISSING_REQUIRED_FIELDS');
    }

    // 驗證類別
    const validCategories = ['regulatory_update', 'market_trend', 'competitor_activity', 'technology_innovation', 'sustainability_initiative', 'policy_change', 'industry_report', 'news_event'];
    if (!validCategories.includes(input.category)) {
      throw new AppError(`Invalid category. Valid values: ${validCategories.join(', ')}`, 400, 'INVALID_CATEGORY');
    }

    // 驗證優先級
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(input.priority)) {
      throw new AppError(`Invalid priority. Valid values: ${validPriorities.join(', ')}`, 400, 'INVALID_PRIORITY');
    }

    const item = await intelligenceDetectionService.createIntelligenceItem(input, userId);

    res.status(201).json({
      success: true,
      data: item,
      message: 'Intelligence item created successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * PUT /api/intelligence/items/:id
   * 更新情報項目
   */
  public static updateIntelligenceItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const input: UpdateIntelligenceItemInput = req.body;

    if (!id) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    // 驗證類別（如果提供）
    if (input.category) {
      const validCategories = ['regulatory_update', 'market_trend', 'competitor_activity', 'technology_innovation', 'sustainability_initiative', 'policy_change', 'industry_report', 'news_event'];
      if (!validCategories.includes(input.category)) {
        throw new AppError(`Invalid category. Valid values: ${validCategories.join(', ')}`, 400, 'INVALID_CATEGORY');
      }
    }

    // 驗證優先級（如果提供）
    if (input.priority) {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      if (!validPriorities.includes(input.priority)) {
        throw new AppError(`Invalid priority. Valid values: ${validPriorities.join(', ')}`, 400, 'INVALID_PRIORITY');
      }
    }

    const item = await intelligenceDetectionService.updateIntelligenceItem(id, input);

    res.status(200).json({
      success: true,
      data: item,
      message: 'Intelligence item updated successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * DELETE /api/intelligence/items/:id
   * 刪除情報項目
   */
  public static deleteIntelligenceItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    await intelligenceDetectionService.deleteIntelligenceItem(id);

    res.status(200).json({
      success: true,
      message: 'Intelligence item deleted successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 每日簡報 (Daily Briefs)
  // ============================================================================

  /**
   * GET /api/intelligence/daily-briefs
   * 取得每日簡報列表
   */
  public static getDailyBriefs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await intelligenceDetectionService.getDailyBriefs(page, limit);

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * GET /api/intelligence/daily-briefs/:id
   * 取得單一每日簡報
   */
  public static getDailyBriefById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Daily brief ID is required', 400, 'MISSING_ID');
    }

    const brief = await intelligenceDetectionService.getDailyBriefById(id);

    res.status(200).json({
      success: true,
      data: brief,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * POST /api/intelligence/daily-briefs
   * 建立每日簡報
   */
  public static createDailyBrief = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: CreateDailyBriefInput = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User authentication required', 401, 'AUTH_REQUIRED');
    }

    // 驗證必填欄位
    if (!input.date || !input.title || !input.summary || !input.content) {
      throw new AppError('Missing required fields: date, title, summary, content', 400, 'MISSING_REQUIRED_FIELDS');
    }

    const brief = await intelligenceDetectionService.createDailyBrief(input, userId);

    res.status(201).json({
      success: true,
      data: brief,
      message: 'Daily brief created successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 趨勢預測 (Trend Predictions)
  // ============================================================================

  /**
   * GET /api/intelligence/trends
   * 取得趨勢預測列表
   */
  public static getTrendPredictions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = req.query.category as string;

    const trends = await intelligenceDetectionService.getTrendPredictions(category);

    res.status(200).json({
      success: true,
      data: trends,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 類別 (Categories)
  // ============================================================================

  /**
   * GET /api/intelligence/categories
   * 取得類別列表
   */
  public static getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await intelligenceDetectionService.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 來源 (Sources)
  // ============================================================================

  /**
   * GET /api/intelligence/sources
   * 取得來源列表
   */
  public static getSources = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sources = await intelligenceDetectionService.getSources();

    res.status(200).json({
      success: true,
      data: sources,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 標籤 (Tags)
  // ============================================================================

  /**
   * GET /api/intelligence/tags
   * 取得標籤列表
   */
  public static getTags = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tags = await intelligenceDetectionService.getTags();

    res.status(200).json({
      success: true,
      data: tags,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 分析 (Analysis)
  // ============================================================================

  /**
   * POST /api/intelligence/analysis/:intelligenceId
   * 分析情報項目
   */
  public static analyzeIntelligenceItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { intelligenceId } = req.params;
    const input: CreateAnalysisInput = req.body;

    if (!intelligenceId) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    if (!input.analysisTypes || !Array.isArray(input.analysisTypes) || input.analysisTypes.length === 0) {
      throw new AppError('analysisTypes is required and must be a non-empty array', 400, 'MISSING_ANALYSIS_TYPES');
    }

    // 驗證分析類型
    const validAnalysisTypes = ['sentiment', 'relevance', 'impact', 'trend', 'risk'];
    const invalidTypes = input.analysisTypes.filter(type => !validAnalysisTypes.includes(type));
    if (invalidTypes.length > 0) {
      throw new AppError(`Invalid analysis types: ${invalidTypes.join(', ')}. Valid values: ${validAnalysisTypes.join(', ')}`, 400, 'INVALID_ANALYSIS_TYPES');
    }

    const results = await intelligenceDetectionService.analyzeIntelligenceItem(intelligenceId, input);

    res.status(200).json({
      success: true,
      data: results,
      message: 'Analysis completed successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * GET /api/intelligence/analysis/:intelligenceId
   * 取得分析結果
   */
  public static getAnalysisResults = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { intelligenceId } = req.params;
    const analysisType = req.query.analysisType as string;

    if (!intelligenceId) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    const results = await intelligenceDetectionService.getAnalysisResults(intelligenceId, analysisType);

    res.status(200).json({
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 通知 (Notifications)
  // ============================================================================

  /**
   * GET /api/intelligence/notifications
   * 取得用戶通知
   */
  public static getUserNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User authentication required', 401, 'AUTH_REQUIRED');
    }

    const unreadOnly = req.query.unreadOnly === 'true';

    const notifications = await intelligenceDetectionService.getUserNotifications(userId, unreadOnly);

    res.status(200).json({
      success: true,
      data: notifications,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * PUT /api/intelligence/notifications/:id/read
   * 標記通知為已讀
   */
  public static markNotificationAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Notification ID is required', 400, 'MISSING_ID');
    }

    await intelligenceDetectionService.markNotificationAsRead(id);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * PUT /api/intelligence/notifications/read-all
   * 標記所有通知為已讀
   */
  public static markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User authentication required', 401, 'AUTH_REQUIRED');
    }

    await intelligenceDetectionService.markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * DELETE /api/intelligence/notifications/:id
   * 刪除通知
   */
  public static deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Notification ID is required', 400, 'MISSING_ID');
    }

    await intelligenceDetectionService.deleteNotification(id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 偏好設定 (Preferences)
  // ============================================================================

  /**
   * GET /api/intelligence/preferences
   * 取得用戶偏好
   */
  public static getUserPreferences = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User authentication required', 401, 'AUTH_REQUIRED');
    }

    const preferences = await intelligenceDetectionService.getUserPreferences(userId);

    res.status(200).json({
      success: true,
      data: preferences,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * PUT /api/intelligence/preferences
   * 更新用戶偏好
   */
  public static updateUserPreferences = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new AppError('User authentication required', 401, 'AUTH_REQUIRED');
    }

    const input: UpdatePreferencesInput = req.body;

    const preferences = await intelligenceDetectionService.updateUserPreferences(userId, input);

    res.status(200).json({
      success: true,
      data: preferences,
      message: 'User preferences updated successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 法規更新對照表 (Regulation Updates)
  // ============================================================================

  /**
   * GET /api/intelligence/regulation-updates
   * 取得法規更新對照表
   */
  public static getRegulationUpdates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const regulations = await intelligenceDetectionService.getRegulationUpdates();

    res.status(200).json({
      success: true,
      data: regulations,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // 任務轉換 (Task Conversion)
  // ============================================================================

  /**
   * POST /api/intelligence/items/:id/convert-to-task
   * 轉換為任務
   */
  public static convertToTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const input: ConvertToTaskInput = req.body;
    const userId = (req as any).user?.id;

    if (!id) {
      throw new AppError('Intelligence item ID is required', 400, 'MISSING_ID');
    }

    if (!input.actionId) {
      throw new AppError('Action ID is required', 400, 'MISSING_ACTION_ID');
    }

    const task = await intelligenceDetectionService.convertToTask(
      { intelligenceId: id, ...input },
      userId || 'system'
    );

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });
}
