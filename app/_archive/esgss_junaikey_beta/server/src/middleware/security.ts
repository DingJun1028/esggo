import { rateLimit } from 'express-rate-limit';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';

import slowDown from 'express-slow-down';

/**
 * IP 來源與信任驗證
 * 管理黑名單與速率限制以確保安全
 */
export const ipWhitelistMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientIP: string = (req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    '') as string;

  const whitelist: string[] = process.env.IP_WHITELIST ? process.env.IP_WHITELIST.split(',') : [];

  if (process.env.NODE_ENV === 'production' && whitelist.length > 0) {
    const isWhitelisted = whitelist.some((ip: string) => {
      if (ip.includes('/')) {
        // Basic CIDR match (prefix check)
        const [prefix] = ip.split('/');
        return clientIP.startsWith(prefix);
      }
      return clientIP === ip;
    });

    if (!isWhitelisted) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Access denied: IP not whitelisted',
          code: 'IP_NOT_WHITELISTED'
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: req.path
        }
      });
      return;
    }
  }

  next();
};

/**
 * 請求大小限制中間件
 * 防止惡意的大量數據攻擊
 */
export const requestSizeLimiter = express.json({
  limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
  verify: (req: any, res: any, buf: Buffer) => {
    // 檢查緩衝區強度
    if (buf.length > (parseInt(process.env.MAX_REQUEST_SIZE || '10485760') || 10 * 1024 * 1024)) {
      throw new Error('Request too large');
    }
  },
});

/**
 * API 速率限制 (Rate Limiter)
 */
export const apiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 分鐘
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 限制 100 次請求
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    meta: {
      retryAfterSeconds: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000) / 1000),
    }
  } as any,
  standardHeaders: true,
  legacyHeaders: false,
  // 忽略健康檢查路徑
  skip: (req: Request) => req.path === '/health' || req.path === '/api/health',
  // 基於用戶 ID 或 IP 進行限制
  keyGenerator: (req: any) => {
    return req.user?.id || req.ip;
  },
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * 敏感操作頻率限制
 */
export const sensitiveOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: {
      message: 'Too many sensitive operations, please try again later.',
      code: 'SENSITIVE_OP_LIMIT_EXCEEDED'
    }
  } as any,
  standardHeaders: true,
  skip: (req: Request) => req.path === '/health',
});

/**
 * 請求速率放緩 (Slow Down)
 * 防止密碼爆破與 API 濫用
 */
export const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
  maxDelayMs: 20000,
  skip: (req: Request) => req.path === '/health' || req.path === '/api/health',
});

/**
 * HSTS 安全標頭
 */
export const hstsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};

/**
 * CSP 內容安全政策
 */
export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );
  }
  next();
};

/**
 * HTTP 標頭驗證中間件
 */
export const headerValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

/**
 * 安全審計與日誌記錄中間件
 */
export const securityAuditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // 設置請求 ID
  res.setHeader('X-Request-ID', requestId);

  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  };

  omniLogger.info(LogCategory.SECURITY, `Request tracked`, logData);


  // 完成請求後記錄性能與安全指標
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // 異常狀態監控
    if (statusCode >= 400) {
      omniLogger.warn(LogCategory.SECURITY, `Suspicious activity`, {
        method: req.method,
        path: req.path,
        statusCode,
        duration,
        ip: req.ip
      });
    }

    // 慢請求監控
    if (duration > 30000) {
      omniLogger.warn(LogCategory.SECURITY, `Slow request detected`, {
        method: req.method,
        path: req.path,
        duration,
        ip: req.ip
      });
    }
  });

  next();
};

/**
 * SQL 注入防護中間件
 */
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#)|(\%27)|(\%22)|(\%23))/i,
    /(\bOR\b|\bAND\b).*(\=|\<|\>)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#))/i,
  ];

  const checkValue = (value: any, path = ''): boolean => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          omniLogger.error(LogCategory.SECURITY, `Potential SQL injection detected`, {
            path,
            value: value.substring(0, 100)
          });
          res.status(400).json({
            success: false,
            error: {
              message: 'Invalid input detected',
              code: 'SQL_INJECTION_DETECTED',
              details: process.env.NODE_ENV === 'development' ? { path, pattern: pattern.toString() } : undefined
            },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.path
            }
          });
          return false;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, val] of Object.entries(value)) {
        if (!checkValue(val, `${path}.${key}`)) return false;
      }
    }
    return true;
  };

  // 檢查 Query, Body, Params
  if (!checkValue(req.query, 'query')) return;
  if (!checkValue(req.body, 'body')) return;
  if (!checkValue(req.params, 'params')) return;

  next();
};

/**
 * XSS 跨站腳本防護中間件
 */
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ];

  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      let sanitized = value;
      for (const pattern of xssPatterns) {
        sanitized = sanitized.replace(pattern, '');
      }
      return sanitized;
    } else if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body || req.query) {
    const originalBody = req.body ? JSON.stringify(req.body) : '';
    const originalQuery = req.query ? JSON.stringify(req.query) : '';

    req.body = sanitizeValue(req.body);
    req.query = sanitizeValue(req.query);

    const sanitizedBody = req.body ? JSON.stringify(req.body) : '';
    const sanitizedQuery = req.query ? JSON.stringify(req.query) : '';

    if (originalBody !== sanitizedBody || originalQuery !== sanitizedQuery) {
      omniLogger.warn(LogCategory.SECURITY, 'XSS injection attempt sanitized', {
        ip: req.ip,
        path: req.path
      });
    }
  }

  next();
};

/**
 * CORS 跨域配置
 */
export const corsOptions = {
  origin: function (origin: any, callback: any) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://esg-sunshine.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
};
