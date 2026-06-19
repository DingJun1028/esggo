/**
 * unifiedAdvancementValidation.ts
 * ---------------------------------
 * 奧秘晉級系統 - 驗證中介層
 * 
 * 核心理念：永續經營，安全第一
 * 設計哲學：防範於未然，驗證先行
 */

import { Request, Response, NextFunction } from 'express';

/**
 * 用戶 ID 驗證
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.params;
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: '用戶 ID 為必填',
    });
    return;
  }
  
  // 驗證用戶 ID 格式
  if (typeof userId !== 'string' || userId.length < 3 || userId.length > 255) {
    res.status(400).json({
      success: false,
      error: '用戶 ID 格式無效',
    });
    return;
  }
  
  // 檢查是否包含非法字符
  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
    res.status(400).json({
      success: false,
      error: '用戶 ID 只能包含字母、數字、底線和連字符',
    });
    return;
  }
  
  next();
};

/**
 * 經驗值添加驗證
 */
export const validateAddExperience = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, xp, type, metadata } = req.body;
  const errors: string[] = [];
  
  // 驗證用戶 ID
  if (!userId) {
    errors.push('用戶 ID 為必填');
  } else if (typeof userId !== 'string' || userId.length < 3) {
    errors.push('用戶 ID 格式無效');
  }
  
  // 驗證 XP
  if (typeof xp !== 'number') {
    errors.push('XP 必須是數字');
  } else if (xp < 0 || xp > 10000) {
    errors.push('XP 必須在 0-10000 之間');
  }
  
  // 驗證類型
  const validTypes = ['report', 'market', 'cross'];
  if (!type) {
    errors.push('類型為必填');
  } else if (!validTypes.includes(type)) {
    errors.push(`類型必須是以下之一: ${validTypes.join(', ')}`);
  }
  
  // 驗證 metadata（可選）
  if (metadata && typeof metadata !== 'object') {
    errors.push('Metadata 必須是對象');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: '驗證失敗',
      details: errors,
    });
    return;
  }
  
  next();
};

/**
 * 跨服務學習驗證
 */
export const validateCrossLearning = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, reportModuleId, marketModuleId } = req.body;
  const errors: string[] = [];
  
  // 驗證用戶 ID
  if (!userId) {
    errors.push('用戶 ID 為必填');
  }
  
  // 驗證報告書模組 ID
  const validReportModules = ['src-01', 'src-02', 'src-03', 'src-04', 'src-05', 'src-06'];
  if (!reportModuleId) {
    errors.push('報告書模組 ID 為必填');
  } else if (!validReportModules.includes(reportModuleId)) {
    errors.push(`報告書模組 ID 無效，可選值: ${validReportModules.join(', ')}`);
  }
  
  // 驗證商情模組 ID
  const validMarketModules = ['mic-01-01', 'mic-01-02', 'mic-02-01', 'mic-03-01', 'mic-04-01'];
  if (!marketModuleId) {
    errors.push('商情模組 ID 為必填');
  } else if (!validMarketModules.includes(marketModuleId)) {
    errors.push(`商情模組 ID 無效，可選值: ${validMarketModules.join(', ')}`);
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: '驗證失敗',
      details: errors,
    });
    return;
  }
  
  next();
};

/**
 * 傳承點數驗證
 */
export const validateLegacyPoints = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, points, reason } = req.body;
  const errors: string[] = [];
  
  // 驗證用戶 ID
  if (!userId) {
    errors.push('用戶 ID 為必填');
  }
  
  // 驗證點數
  if (typeof points !== 'number') {
    errors.push('點數必須是數字');
  } else if (points < 1 || points > 10000) {
    errors.push('點數必須在 1-10000 之間');
  }
  
  // 驗證原因（可選）
  if (reason && (typeof reason !== 'string' || reason.length > 500)) {
    errors.push('原因長度不能超過 500 字符');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: '驗證失敗',
      details: errors,
    });
    return;
  }
  
  next();
};

/**
 * 傳承轉移驗證
 */
export const validateLegacyTransfer = (req: Request, res: Response, next: NextFunction): void => {
  const { fromUserId, toUserId, points, reason } = req.body;
  const errors: string[] = [];
  
  // 驗證轉出用戶 ID
  if (!fromUserId) {
    errors.push('轉出用戶 ID 為必填');
  }
  
  // 驗證轉入用戶 ID
  if (!toUserId) {
    errors.push('轉入用戶 ID 為必填');
  } else if (fromUserId === toUserId) {
    errors.push('不能轉給自己');
  }
  
  // 驗證點數
  if (typeof points !== 'number') {
    errors.push('點數必須是數字');
  } else if (points < 1 || points > 10000) {
    errors.push('點數必須在 1-10000 之間');
  }
  
  // 驗證原因（可選）
  if (reason && (typeof reason !== 'string' || reason.length > 500)) {
    errors.push('原因長度不能超過 500 字符');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: '驗證失敗',
      details: errors,
    });
    return;
  }
  
  next();
};

/**
 * AI 分析驗證
 */
export const validateAIAnalyze = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, context } = req.body;
  const errors: string[] = [];
  
  // 驗證用戶 ID
  if (!userId) {
    errors.push('用戶 ID 為必填');
  }
  
  // 驗證上下文（可選）
  if (context && (typeof context !== 'string' || context.length > 2000)) {
    errors.push('上下文長度不能超過 2000 字符');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: '驗證失敗',
      details: errors,
    });
    return;
  }
  
  next();
};

/**
 * 排行榜參數驗證
 */
export const validateLeaderboard = (req: Request, res: Response, next: NextFunction): void => {
  const { limit } = req.query;
  
  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      res.status(400).json({
        success: false,
        error: '排行榜限制必須在 1-100 之間',
      });
      return;
    }
  }
  
  next();
};

/**
 * 活動日誌參數驗證
 */
export const validateActivities = (req: Request, res: Response, next: NextFunction): void => {
  const { limit } = req.query;
  
  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      res.status(400).json({
        success: false,
        error: '活動限制必須在 1-100 之間',
      });
      return;
    }
  }
  
  next();
};

/**
 * 學習路徑驗證
 */
export const validateLearningPath = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.params;
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: '用戶 ID 為必填',
    });
    return;
  }
  
  next();
};

/**
 * 智能推薦驗證
 */
export const validateRecommendations = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.params;
  
  if (!userId) {
    res.status(400).json({
      success: false,
      error: '用戶 ID 為必填',
    });
    return;
  }
  
  next();
};
