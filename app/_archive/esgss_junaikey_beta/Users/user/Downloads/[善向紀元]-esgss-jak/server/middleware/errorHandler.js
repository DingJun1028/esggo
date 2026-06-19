// 錯誤處理中間件 - 基於ErrorHandler服務
const { ErrorHandler, AppError } = require('../../services/ErrorHandler');

const errorHandler = ErrorHandler.getInstance();

/**
 * Express錯誤處理中間件
 * 統一處理所有未捕獲的錯誤
 */
function errorHandlerMiddleware(err, req, res, next) {
  // 如果響應已經發送，委派給默認Express處理器
  if (res.headersSent) {
    return next(err);
  }

  // 創建錯誤上下文
  const context = {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl || req.url,
    method: req.method,
    sessionId: req.session?.id,
    requestId: req.get('X-Request-ID') || req.get('x-request-id'),
    userId: req.user?.id,
    metadata: {
      body: req.method !== 'GET' ? '[REDACTED]' : undefined,
      query: req.query,
      params: req.params
    }
  };

  // 使用ErrorHandler處理錯誤
  const errorInfo = errorHandler.handle(err, context);

  // 確定HTTP狀態碼
  let statusCode = 500;
  if (err instanceof AppError) {
    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
  }

  // 在生產環境中隱藏詳細錯誤信息
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    error: {
      message: errorInfo.message,
      code: errorInfo.code || 'INTERNAL_ERROR',
      ...(isDevelopment && {
        stack: errorInfo.stack,
        details: err.details
      })
    },
    timestamp: new Date(errorInfo.context.timestamp).toISOString(),
    requestId: errorInfo.context.requestId,
    path: req.path
  };

  // 記錄錯誤響應
  console.error(`[ERROR_RESPONSE] ${statusCode} ${req.method} ${req.path}`, {
    errorId: errorInfo.id,
    requestId: errorInfo.context.requestId,
    ip: context.ip,
    userId: context.userId
  });

  // 發送錯誤響應
  res.status(statusCode).json(errorResponse);
}

/**
 * 404錯誤處理中間件
 */
function notFoundMiddleware(req, res, next) {
  const error = new AppError(`Route ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND', 404);
  next(error);
}

/**
 * 異步錯誤包裝器
 * 將異步路由處理器包裝起來，自動捕獲拒絕的Promise
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 請求超時中間件
 */
function timeoutMiddleware(timeoutMs = 30000) {
  return (req, res, next) => {
    // 設置請求超時
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        const error = new AppError(`Request timeout after ${timeoutMs}ms`, 'REQUEST_TIMEOUT', 408);
        next(error);
      }
    }, timeoutMs);

    // 當響應完成時清除超時
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    next();
  };
}

/**
 * 請求日誌中間件
 * 記錄所有請求（成功和失敗）
 */
function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();
  const requestId = req.get('X-Request-ID') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 添加請求ID到響應
  res.setHeader('X-Request-ID', requestId);

  // 記錄請求開始
  console.log(`[REQUEST_START] ${req.method} ${req.originalUrl}`, {
    requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // 監聽響應完成
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // 根據狀態碼選擇日誌級別
    const logLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';

    console[logLevel](`[REQUEST_END] ${req.method} ${req.originalUrl} ${statusCode}`, {
      requestId,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id,
      contentLength: res.get('Content-Length')
    });
  });

  // 監聽響應錯誤
  res.on('error', (err) => {
    const duration = Date.now() - startTime;
    console.error(`[REQUEST_ERROR] ${req.method} ${req.originalUrl}`, {
      requestId,
      duration: `${duration}ms`,
      error: err.message,
      ip: req.ip,
      userId: req.user?.id
    });
  });

  next();
}

module.exports = {
  errorHandlerMiddleware,
  notFoundMiddleware,
  asyncHandler,
  timeoutMiddleware,
  requestLoggerMiddleware
};