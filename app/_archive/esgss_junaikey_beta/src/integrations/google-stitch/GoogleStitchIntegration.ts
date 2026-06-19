/**
 * Google Stitch MCP Integration
 * Google Stitch MCP 集成層
 * 
 * 提供與 Google Stitch MCP 的集成接口
 * 遵循 Anti-gravity 設計原則
 */

import { UUID, UUIDUtil } from '@/core';

// ============================================================================
// 類型定義
// ============================================================================

/**
 * Google Stitch MCP 配置
 */
export interface GoogleStitchConfig {
  apiKey: string;
  projectId: string;
  region?: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * Google Stitch MCP 請求選項
 */
export interface GoogleStitchRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  timeout?: number;
}

/**
 * Google Stitch MCP 響應
 */
export interface GoogleStitchResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: UUID;
    timestamp: number;
    duration: number;
  };
}

/**
 * Google Stitch MCP 事件
 */
export interface GoogleStitchEvent {
  type: 'request' | 'response' | 'error' | 'retry';
  timestamp: number;
  requestId: UUID;
  data?: any;
}

/**
 * Google Stitch MCP 事件監聽器
 */
export type GoogleStitchEventListener = (event: GoogleStitchEvent) => void;

// ============================================================================
// Google Stitch MCP 客戶端
// ============================================================================

/**
 * Google Stitch MCP 客戶端類
 * 提供與 Google Stitch MCP 的完整集成
 */
export class GoogleStitchClient {
  private config: GoogleStitchConfig;
  private eventListeners: Map<string, GoogleStitchEventListener[]> = new Map();
  private requestQueue: Map<UUID, Promise<any>> = new Map();

  constructor(config: GoogleStitchConfig) {
    this.config = {
      region: 'us-central1',
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    };
  }

  // ------------------------------------------------------------------------
  // 公共方法
  // ------------------------------------------------------------------------

  /**
   * 發送請求到 Google Stitch MCP
   */
  public async request<T = any>(
    options: GoogleStitchRequestOptions
  ): Promise<GoogleStitchResponse<T>> {
    const requestId = UUIDUtil.generate();
    const startTime = Date.now();

    try {
      // 發出請求事件
      this.emitEvent({
        type: 'request',
        timestamp: startTime,
        requestId,
        data: options,
      });

      // 檢查是否已有相同請求在處理中
      if (this.requestQueue.has(requestId)) {
        return this.requestQueue.get(requestId)!;
      }

      // 創建請求承諾
      const requestPromise = this.executeRequest<T>(requestId, options);
      this.requestQueue.set(requestId, requestPromise);

      // 執行請求
      const response = await requestPromise;

      // 清理請求隊列
      this.requestQueue.delete(requestId);

      // 發出響應事件
      this.emitEvent({
        type: 'response',
        timestamp: Date.now(),
        requestId,
        data: response,
      });

      return response;
    } catch (error) {
      // 清理請求隊列
      this.requestQueue.delete(requestId);

      // 發出錯誤事件
      this.emitEvent({
        type: 'error',
        timestamp: Date.now(),
        requestId,
        data: error,
      });

      return {
        success: false,
        error: {
          code: 'REQUEST_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
        metadata: {
          requestId,
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * GET 請求
   */
  public async get<T = any>(
    endpoint: string,
    params?: Record<string, string | number>,
    options?: Partial<GoogleStitchRequestOptions>
  ): Promise<GoogleStitchResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      params,
      ...options,
    });
  }

  /**
   * POST 請求
   */
  public async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Partial<GoogleStitchRequestOptions>
  ): Promise<GoogleStitchResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      body,
      ...options,
    });
  }

  /**
   * PUT 請求
   */
  public async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Partial<GoogleStitchRequestOptions>
  ): Promise<GoogleStitchResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      body,
      ...options,
    });
  }

  /**
   * DELETE 請求
   */
  public async delete<T = any>(
    endpoint: string,
    options?: Partial<GoogleStitchRequestOptions>
  ): Promise<GoogleStitchResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
      ...options,
    });
  }

  /**
   * PATCH 請求
   */
  public async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Partial<GoogleStitchRequestOptions>
  ): Promise<GoogleStitchResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      body,
      ...options,
    });
  }

  // ------------------------------------------------------------------------
  // 事件監聽
  // ------------------------------------------------------------------------

  /**
   * 添加事件監聽器
   */
  public on(eventType: string, listener: GoogleStitchEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  /**
   * 移除事件監聽器
   */
  public off(eventType: string, listener: GoogleStitchEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 發出事件
   */
  private emitEvent(event: GoogleStitchEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  // ------------------------------------------------------------------------
  // 私有方法
  // ------------------------------------------------------------------------

  /**
   * 執行請求
   */
  private async executeRequest<T>(
    requestId: UUID,
    options: GoogleStitchRequestOptions
  ): Promise<GoogleStitchResponse<T>> {
    const startTime = Date.now();
    const timeout = options.timeout || this.config.timeout;

    // 構建 URL
    const url = this.buildUrl(options.endpoint, options.params);

    // 構建請求選項
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Project-ID': this.config.projectId,
        'X-Request-ID': requestId,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    // 執行請求（帶超時）
    const timeoutValue = timeout || 30000;
    const response = await Promise.race([
      fetch(url, fetchOptions),
      this.createTimeoutPromise(timeoutValue),
    ]);

    // 解析響應
    const data = await response.json();

    // 構建響應對象
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : {
        code: data.code || 'HTTP_ERROR',
        message: data.message || response.statusText,
        details: data.details,
      },
      metadata: {
        requestId,
        timestamp: startTime,
        duration: Date.now() - startTime,
      },
    };
  }

  /**
   * 構建 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const baseUrl = this.config.baseUrl || `https://${this.config.region}-stitch.googleapis.com/v1`;
    let url = `${baseUrl}${endpoint}`;

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * 創建超時承諾
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  // ------------------------------------------------------------------------
  // 配置管理
  // ------------------------------------------------------------------------

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<GoogleStitchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 獲取配置
   */
  public getConfig(): GoogleStitchConfig {
    return { ...this.config };
  }
}

// ============================================================================
// Google Stitch MCP 工廠
// ============================================================================

/**
 * Google Stitch MCP 客戶端工廠
 * 提供單例模式和客戶端創建
 */
export class GoogleStitchClientFactory {
  private static instance: GoogleStitchClient | null = null;

  /**
   * 創建客戶端實例
   */
  public static create(config: GoogleStitchConfig): GoogleStitchClient {
    return new GoogleStitchClient(config);
  }

  /**
   * 獲取單例實例
   */
  public static getInstance(config?: GoogleStitchConfig): GoogleStitchClient {
    if (!this.instance && config) {
      this.instance = new GoogleStitchClient(config);
    }
    if (!this.instance) {
      throw new Error('GoogleStitchClient instance not initialized. Call create() first.');
    }
    return this.instance;
  }

  /**
   * 重置單例實例
   */
  public static reset(): void {
    this.instance = null;
  }
}

// ============================================================================
// 導出
// ============================================================================

export default GoogleStitchClient;
