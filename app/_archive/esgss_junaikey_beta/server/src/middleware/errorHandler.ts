import { Request, Response, NextFunction } from 'express';
import { ErrorHandler, AppError } from '../services/ErrorHandler.js';
import systemHealthService from '../services/SystemHealthService.js';

const errorHandler = ErrorHandler.getInstance();

/**
 * Express 錯誤處理中間件
 * 集中處理系統中拋出的所有異常與錯誤
 */
export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  // Phase 7: Record system error
  systemHealthService.recordError();

  // 檢查回應是否已發送，避免重複處裡
  if (res.headersSent) {
    return next(err);
  }

  // 收集錯誤上下文資訊
  const context = {
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl || req.url,
    method: req.method,
    // @ts-ignore
    sessionId: req.session?.id,
    requestId: req.get('X-Request-ID') || req.get('x-request-id'),
    // @ts-ignore
    userId: req.user?.id,
    metadata: {
      body: req.method !== 'GET' ? '[REDACTED]' : undefined,
      query: req.query,
      params: req.params,
    },
  };

  // 使用 ErrorHandler 處理錯誤
  const errorInfo = errorHandler.handle(err, context);

  // 映射 HTTP 狀態碼
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

  // 構建錯誤回應
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    error: {
      ...errorInfo.error,
      ...(isDevelopment && { stack: err.stack }),
    },
    meta: {
      requestId: errorInfo.id,
      timestamp: new Date(errorInfo.context.timestamp).toISOString(),
      path: req.path,
      version: 'v10.0',
    }
  };

  // 記錄錯誤日誌
  console.error(`[ERROR_RESPONSE] ${statusCode} ${req.method} ${req.path}`, {
    errorId: errorInfo.id,
    requestId: errorInfo.context.requestId,
    ip: context.ip,
    userId: context.userId,
    isOperational: errorInfo.context.isOperational
  });

  // 發送回應
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 未找到中間件
 */
export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
}

/**
 * 異步函式包裝器
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
