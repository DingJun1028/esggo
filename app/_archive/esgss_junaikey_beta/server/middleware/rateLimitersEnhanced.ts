/**
 * 🛡️ 增強版 Rate Limiting Middleware Suite
 * [協議] 階段 103: 安全性強化
 * 提供更細緻的速率限制配置和分布式支援
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import crypto from 'crypto';
import dotenv from 'dotenv';
import redisClient from '../src/config/redis.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { SubscriptionTier } from '../../src/services/esg/LicensingService.js';

dotenv.config();

// ==================== Store Factory ====================

const createStore = (prefix: string, windowMs: number) => {
  // Use ioredis client - correct ioredis v5 array syntax for sendCommand
  return new RedisStore({
    sendCommand: (...args: string[]) => (redisClient as any).call(...args) as Promise<any>,
    prefix: `rl:${prefix}:`,
  });
};

// ==================== 預設配置 ====================

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  // 預設 API 限制
  api: {
    windowMs: 15 * 60 * 1000, // 15 分鐘
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  },

  // 讀取密集型操作
  read: {
    windowMs: 1 * 60 * 1000, // 1 分鐘
    max: 200,
    message: 'Read operations exceeded. Limit: 200/min.',
  },

  // 寫入密集型操作
  write: {
    windowMs: 1 * 60 * 1000, // 1 分鐘
    max: 50,
    message: 'Write operations exceeded. Limit: 50/min.',
  },

  // 敏感操作（登錄、密碼重置等）
  sensitive: {
    windowMs: 15 * 60 * 1000, // 15 分鐘
    max: 10,
    message: 'Sensitive operations limited. Try again in 15 minutes.',
  },

  // 檔案上傳
  upload: {
    windowMs: 15 * 60 * 1000, // 15 分鐘
    max: 15,
    message: 'Upload limit reached. 15 files per 15 minutes.',
  },

  // AI Chat
  ai: {
    windowMs: 1 * 60 * 1000, // 1 分鐘
    max: 30,
    message: 'AI chat frequency limit reached. 30 requests per minute.',
  },

  // WebSocket 連結
  websocket: {
    windowMs: 1 * 60 * 1000, // 1 分鐘
    max: 50,
    message: 'WebSocket connection limit reached.',
  },

  // 健康檢查
  health: {
    windowMs: 1 * 60 * 1000, // 1 分鐘
    max: 1000,
    message: 'Health check rate limit exceeded.',
  },
};

// ==================== Rate Limiters ====================

// 1. 核心 API 限制器（全域）
export const createApiRateLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.api, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    // max is handled by the function below
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: finalConfig.message,
      retryAfter: Math.ceil(finalConfig.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('api', finalConfig.windowMs),
    validate: false,
    keyGenerator: (req: Request) => {
      // 優先使用用戶 ID 進行辨識
      const user = (req as any).user;
      if (user?.id) return `user:${user.id}`;

      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      return ip.replace(/::ffff:/, '');
    },
    max: (req: Request) => {
      const user = (req as any).user;
      const tier: SubscriptionTier = user?.subscriptionTier || 'BASIC';

      // Tier-Aware Thresholds
      if (tier === 'MASTER') return 1000;
      if (tier === 'PRO') return 300;
      return DEFAULT_CONFIGS.api.max; // 100
    },
    skip: (req: Request) => {
      // 跳過內部 IP
      const ip = (req.ip || '') as string;
      return (
        ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1' || ip === '127.0.0.1'
      );
    },
    handler: (req: Request, res: Response) => {
      omniLogger.warn(LogCategory.SECURITY, 'Rate Limit Exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });

      res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: finalConfig.message,
        retryAfter: Math.ceil(finalConfig.windowMs / 1000),
      });
    },
  } as any);
};

// 2. 讀取密集型限制器
export const createReadLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.read, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    max: finalConfig.max,
    message: finalConfig.message,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('read', finalConfig.windowMs),
    validate: false,
  } as any);
};

// 3. 寫入密集型限制器
export const createWriteLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.write, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    max: finalConfig.max,
    message: finalConfig.message,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('write', finalConfig.windowMs),
    validate: false,
  } as any);
};

// 4. 敏感操作限制器
export const createSensitiveOperationLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.sensitive, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    max: finalConfig.max,
    message: {
      success: false,
      error: 'SENSITIVE_OPERATION_LIMITED',
      message: finalConfig.message,
      retryAfter: Math.ceil(finalConfig.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('sensitive', finalConfig.windowMs),
    validate: false,
    handler: (req: Request, res: Response) => {
      omniLogger.warn(LogCategory.SECURITY, 'Sensitive Operation Rate Limit Exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });

      res.status(429).json({
        success: false,
        error: 'SENSITIVE_OPERATION_LIMITED',
        message: finalConfig.message,
        retryAfter: Math.ceil(finalConfig.windowMs / 1000),
      });
    },
  } as any);
};

// 5. 檔案上傳限制器
export const createUploadLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.upload, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    max: finalConfig.max,
    message: finalConfig.message,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('upload', finalConfig.windowMs),
    validate: false,
  } as any);
};

// 6. AI Chat 限制器
export const createAiChatLimiter = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...DEFAULT_CONFIGS.ai, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs,
    max: finalConfig.max,
    message: {
      success: false,
      error: 'AI_CHAT_RATE_LIMIT_EXCEEDED',
      message: finalConfig.message,
      retryAfter: Math.ceil(finalConfig.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('ai', finalConfig.windowMs),
    validate: false,
    keyGenerator: (req: Request) => {
      // [Security] Hash the Authorization header to avoid storing raw tokens in Redis
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const tokenHash = crypto.createHash('sha256').update(authHeader).digest('hex').slice(0, 16);
        return `user:${tokenHash}`;
      }
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      return `ip:${ip.replace(/::ffff:/, '')}`;
    },
  } as any);
};

// 7. 自定義限制器工廠
export const createCustomRateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: config.message,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('custom', config.windowMs),
  } as any);
};

// 8. Sliding Window 限制器
export const createSlidingWindowLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: config.message,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('sliding', config.windowMs),
    // 使用 sliding window 算法
  } as any);
};

// ==================== Slow Down Middleware ====================

export const createSlowDownMiddleware = (options?: {
  windowMs?: number;
  delayAfter?: number;
  delayMs?: number;
  maxDelayMs?: number;
}) => {
  const opts = {
    windowMs: options?.windowMs || 15 * 60 * 1000,
    delayAfter: options?.delayAfter || 50,
    delayMs: options?.delayMs || 500,
    maxDelayMs: options?.maxDelayMs || 30000,
  };

  return slowDown({
    windowMs: opts.windowMs,
    delayAfter: opts.delayAfter,
    delayMs: () => opts.delayMs,
    maxDelayMs: opts.maxDelayMs,
    store: createStore('slowdown', opts.windowMs),
  } as any);
};

// ==================== 預設導出 ====================

// 使用預設配置實例化限制器
export const apiRateLimiter = createApiRateLimiter();
export const readLimiter = createReadLimiter();
export const writeLimiter = createWriteLimiter();
export const sensitiveOperationLimiter = createSensitiveOperationLimiter();
export const uploadLimiter = createUploadLimiter();
export const aiChatLimiter = createAiChatLimiter();
export const slowDownMiddleware = createSlowDownMiddleware();

// ==================== 初始化 ====================

export const initializeRateLimiters = async () => {
  // redisClient is pre-initialized in its own module
  omniLogger.info(LogCategory.SYSTEM, 'Rate Limiters Synchronized with Neural Redis Core');
};

export default {
  createApiRateLimiter,
  createReadLimiter,
  createWriteLimiter,
  createSensitiveOperationLimiter,
  createUploadLimiter,
  createAiChatLimiter,
  createCustomRateLimiter,
  createSlidingWindowLimiter,
  createSlowDownMiddleware,
  initializeRateLimiters,
  apiRateLimiter,
  readLimiter,
  writeLimiter,
  sensitiveOperationLimiter,
  uploadLimiter,
  aiChatLimiter,
  slowDownMiddleware,
};
