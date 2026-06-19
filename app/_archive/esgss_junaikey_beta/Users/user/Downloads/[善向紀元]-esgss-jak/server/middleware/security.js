// 安全中間件集合 - ESG系統安全防護
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const express = require('express');
const crypto = require('crypto');

/**
 * IP白名單檢查中間件
 * 允許特定的IP地址或IP範圍訪問
 */
const ipWhitelistMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

  // 在生產環境中實現IP白名單邏輯
  const whitelist = process.env.IP_WHITELIST ? process.env.IP_WHITELIST.split(',') : [];

  if (process.env.NODE_ENV === 'production' && whitelist.length > 0) {
    const isWhitelisted = whitelist.some(ip => {
      if (ip.includes('/')) {
        // CIDR notation support (simplified)
        return clientIP.startsWith(ip.split('/')[0]);
      }
      return clientIP === ip;
    });

    if (!isWhitelisted) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: IP not whitelisted'
      });
    }
  }

  next();
};

/**
 * 請求大小限制中間件
 * 防止大請求攻擊
 */
const requestSizeLimiter = express.json({
  limit: process.env.REQUEST_SIZE_LIMIT || '10mb',
  verify: (req, res, buf) => {
    // 檢查請求體大小
    if (buf.length > (parseInt(process.env.MAX_REQUEST_SIZE) || 10 * 1024 * 1024)) {
      throw new Error('Request too large');
    }
  }
});

/**
 * 速率限制中間件 - API端點
 */
const apiRateLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 默認15分鐘
  max: process.env.RATE_LIMIT_MAX || 100, // 默認每窗口100個請求
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  // 跳過健康檢查端點
  skip: (req) => req.path === '/health' || req.path === '/api/health',
  // 根據用戶角色動態調整限制
  keyGenerator: (req) => {
    // 如果有用戶信息，使用用戶ID；否則使用IP
    return req.user?.id || req.ip;
  },
  onLimitReached: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);

    // 記錄可疑活動
    if (req.rateLimit && req.rateLimit.remaining === 0) {
      // 這裡可以集成到監控系統
      console.error(`Suspicious activity detected from IP: ${req.ip}`);
    }
  }
});

/**
 * 敏感操作速率限制
 * 用於登入、密碼重置等敏感操作
 */
const sensitiveOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 5, // 每15分鐘最多5次
  message: {
    success: false,
    error: 'Too many sensitive operations, please try again later.'
  },
  standardHeaders: true,
  skip: (req) => req.path === '/health'
});

/**
 * 慢速攻擊防護中間件
 */
const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000, // 15分鐘
  delayAfter: 50, // 50個請求後開始延遲
  delayMs: 500, // 每次請求延遲500ms
  maxDelayMs: 20000, // 最大延遲20秒
  skip: (req) => req.path === '/health' || req.path === '/api/health'
});

/**
 * HSTS (HTTP Strict Transport Security) 中間件
 */
const hstsMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};

/**
 * CSP (Content Security Policy) 中間件
 */
const cspMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Content-Security-Policy',
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
 * 請求標頭驗證中間件
 */
const headerValidationMiddleware = (req, res, next) => {
  // 檢查User-Agent
  if (!req.headers['user-agent']) {
    return res.status(400).json({
      success: false,
      error: 'Missing User-Agent header'
    });
  }

  // 檢查可疑的User-Agent
  const suspiciousAgents = ['curl', 'wget', 'python', 'bot'];
  const userAgent = req.headers['user-agent'].toLowerCase();

  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    console.warn(`Suspicious User-Agent detected: ${req.headers['user-agent']} from IP: ${req.ip}`);
  }

  // 檢查Content-Type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (req.body && !contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type header required for requests with body'
      });
    }
  }

  next();
};

/**
 * 請求記錄中間件（安全審計）
 */
const securityAuditMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // 添加請求ID到響應標頭
  res.setHeader('X-Request-ID', requestId);

  // 記錄請求信息
  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  };

  console.log(`[SECURITY] Request: ${JSON.stringify(logData)}`);

  // 監聽響應完成事件
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // 記錄可疑活動
    if (statusCode >= 400) {
      console.warn(`[SECURITY] Suspicious activity: ${req.method} ${req.path} - Status: ${statusCode} - Duration: ${duration}ms - IP: ${req.ip}`);
    }

    // 記錄長時間請求（可能為DoS嘗試）
    if (duration > 30000) { // 30秒
      console.warn(`[SECURITY] Slow request detected: ${req.method} ${req.path} - Duration: ${duration}ms - IP: ${req.ip}`);
    }
  });

  next();
};

/**
 * SQL注入防護中間件
 */
const sqlInjectionProtection = (req, res, next) => {
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#)|(\%27)|(\%22)|(\%23))/i,
    /(\bOR\b|\bAND\b).*(\=|\<|\>)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#))/i
  ];

  const checkValue = (value, path = '') => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          console.error(`[SECURITY] Potential SQL injection detected in ${path}: ${value.substring(0, 100)}...`);
          return res.status(400).json({
            success: false,
            error: 'Invalid input detected'
          });
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, val] of Object.entries(value)) {
        checkValue(val, `${path}.${key}`);
      }
    }
  };

  // 檢查查詢參數
  checkValue(req.query, 'query');
  // 檢查請求體
  checkValue(req.body, 'body');
  // 檢查路由參數
  checkValue(req.params, 'params');

  next();
};

/**
 * XSS防護中間件
 */
const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  ];

  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      let sanitized = value;
      for (const pattern of xssPatterns) {
        sanitized = sanitized.replace(pattern, '');
      }
      return sanitized;
    } else if (typeof value === 'object' && value !== null) {
      const sanitized = Array.isArray(value) ? [] : {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  // 清理請求體
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  // 清理查詢參數
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
};

/**
 * CORS安全配置
 */
const corsOptions = {
  origin: function (origin, callback) {
    // 允許的來源
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://esg-sunshine.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // 允許沒有來源的請求（如移動應用）
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
    'Access-Control-Request-Headers'
  ]
};

module.exports = {
  ipWhitelistMiddleware,
  requestSizeLimiter,
  apiRateLimiter,
  sensitiveOperationLimiter,
  slowDownMiddleware,
  hstsMiddleware,
  cspMiddleware,
  headerValidationMiddleware,
  securityAuditMiddleware,
  sqlInjectionProtection,
  xssProtection,
  corsOptions
};