/**
 * UnifiedAdvancementRateLimiter.ts
 * ---------------------------------
 * 奧秘晉級系統 - 速率限制中介層
 * 
 * 核心理念：永續經營，公平使用
 * 設計哲學：防止濫用，保護系統
 */

import { Request, Response, NextFunction } from 'express';

// 速率限制存儲
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;      // 時間窗口（毫秒）
  maxRequests: number;    // 最大請求數
  message?: string;      // 錯誤消息
  statusCode?: number;   // HTTP 狀態碼
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

export class UnifiedAdvancementRateLimiter {
  private store: RateLimitStore;
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config?: Partial<RateLimitConfig>) {
    this.store = {};
    this.config = {
      windowMs: config?.windowMs || 60000,      // 1 分鐘
      maxRequests: config?.maxRequests || 100,   // 100 請求/分鐘
      message: config?.message || '請求過於頻繁，請稍後再試',
      statusCode: config?.statusCode || 429,
      ...config,
    };

    // 定期清理過期條目
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.windowMs);
  }

  /**
   * 速率限制中間件工廠
   */
  middleware(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.getKey(req);
      const now = Date.now();
      
      // 檢查現有条目
      let entry = this.store[key];
      
      if (!entry || entry.resetTime < now) {
        // 創建新條目
        entry = {
          count: 1,
          resetTime: now + this.config.windowMs,
        };
        this.store[key] = entry;
      } else {
        // 增加計數
        entry.count++;
      }

      // 設置響應頭
      res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - entry.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

      // 檢查是否超過限制
      if (entry.count > this.config.maxRequests) {
        res.status(this.config.statusCode!).json({
          success: false,
          error: {
            message: this.config.message,
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((entry.resetTime - now) / 1000),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next();
    };
  }

  /**
   * 嚴格速率限制（更嚴格的限制）
   */
  strictMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
    const strictConfig: RateLimitConfig = {
      ...this.config,
      windowMs: 60000,           // 1 分鐘
      maxRequests: 30,            // 30 請求/分鐘
      message: '請求過於頻繁，請稍後再試',
    };

    const strictLimiter = new UnifiedAdvancementRateLimiter(strictConfig);
    return strictLimiter.middleware();
  }

  /**
   * 寬鬆速率限制（用於公開端點）
   */
 宽松Middleware(): (req: Request, res: Response, next: NextFunction) => void {
    const lenientConfig: RateLimitConfig = {
      ...this.config,
      windowMs: 60000,           // 1 分鐘
      maxRequests: 300,           // 300 請求/分鐘
    };

    const lenientLimiter = new UnifiedAdvancementRateLimiter(lenientConfig);
    return lenientLimiter.middleware();
  }

  /**
   * IP 白名單
   */
  whitelistMiddleware(ipWhitelist: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const ip = req.ip || req.connection?.remoteAddress || '';
      
      if (ipWhitelist.includes(ip)) {
        next();
        return;
      }

      this.middleware()(req, res, next);
    };
  }

  /**
   * 獲取客戶端 IP
   */
  private getKey(req: Request): string {
    // 考慮 X-Forwarded-For 頭（代理伺服器）
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',');
      return ips[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }

  /**
   * 清理過期條目
   */
  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  /**
   * 銷毀計時器
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
  }

  /**
   * 獲取當前狀態
   */
  getStatus(): { activeKeys: number; config: RateLimitConfig } {
    return {
      activeKeys: Object.keys(this.store).length,
      config: this.config,
    };
  }
}

// 導出實例
export const unifiedAdvancementRateLimiter = new UnifiedAdvancementRateLimiter();
