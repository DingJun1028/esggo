import { Request, Response, NextFunction } from 'express';
import { OmniError, ErrorCode } from '../utils/omniError.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { errorTracker } from '../utils/errorTracker.js';

/**
 * 非同步路由處理器包裝器 (asyncHandler)
 * 自動捕獲 async/await 錯誤並傳遞給 next()
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * 全域錯誤處理中間件
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 如果已經發送過回應，交給 Express 預設處理
    if (res.headersSent) {
        return next(err);
    }

    let omniError: OmniError;

    // 處理 CSRF 錯誤 (csurf 特有)
    if (err.code === 'EBADCSRFTOKEN') {
        omniError = new OmniError('Invalid or missing CSRF token', 403, ErrorCode.CSRF_ERROR, undefined, 'CSRF 驗證失敗');
    }
    // 轉換為 OmniError
    else if (err instanceof OmniError) {
        omniError = err;
    } else {
        const statusCode = err.statusCode || err.status || 500;
        const message = err.message || 'An unexpected error occurred';
        const code = err.errorCode || (statusCode >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.BAD_REQUEST);

        omniError = new OmniError(
            message,
            statusCode,
            code as any,
            err.details || { originalError: err.name || 'UnknownError' }
        );

        if (err.stack) {
            omniError.stack = err.stack;
        }
    }

    // Foundational Error Tracking
    errorTracker.track(omniError, req.originalUrl);

    // 記錄錯誤日誌 (使用 5T Traceable 原則)
    const requestId = (req.headers['x-request-id'] as string) || (res.getHeader('X-Request-ID') as string) || (req as any).traceId || 'omni-' + Math.random().toString(36).substring(7);

    const logData = {
        requestId,
        url: req.originalUrl,
        method: req.method,
        statusCode: omniError.statusCode,
        errorCode: omniError.errorCode,
        details: omniError.details,
        ip: req.ip
    };

    if (omniError.statusCode >= 500) {
        omniLogger.error(LogCategory.API, `[CRITICAL] Neural Core Fault: ${omniError.message}`, err, logData);
    } else {
        omniLogger.warn(LogCategory.API, `[Client] Request Exception: ${omniError.message}`, logData);
    }

    // 發送錯誤回應 (使用 5T Transparent 原則)
    const response = omniError.toJSON();
    (response as any).requestId = requestId;

    // 開發環境下包含 Stack Trace
    if (process.env.NODE_ENV === 'development') {
        (response.error as any).stack = omniError.stack;
    }

    res.status(omniError.statusCode).json(response);
};

/**
 * 404 Not Found 處理器
 */
export const notFoundHandler = (req: Request, res: Response) => {
    omniLogger.warn(LogCategory.API, `Route not found: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(404).json({
        success: false,
        error: {
            message: `The requested path ${req.originalUrl} does not exist in the Neural Core`,
            code: ErrorCode.NOT_FOUND,
            statusCode: 404,
            timestamp: new Date().toISOString()
        }
    });
};

/**
 * 設置進程級別的未捕獲異常處理器
 */
export const setupUncaughtExceptionHandlers = () => {
    process.on('unhandledRejection', (reason: any) => {
        omniLogger.error(LogCategory.SYSTEM, '[FATAL] Unhandled Rejection', {
            message: reason?.message || reason,
            stack: reason?.stack
        });
        // 在生產環境中，某些未捕獲錯誤可能需要重啟服務
    });

    process.on('uncaughtException', (error: Error) => {
        omniLogger.error(LogCategory.SYSTEM, '[FATAL] Uncaught Exception', {
            message: error.message,
            stack: error.stack
        });
        // 強制退出以防止進入不穩定狀態
        process.exit(1);
    });
};
