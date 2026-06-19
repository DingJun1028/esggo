// ESG儀表板API整合服務
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    status: number;
  };
  metadata: {
    url: string;
    method: string;
    duration: number;
    timestamp: number;
    cached?: boolean;
  };
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoff: number;
  };
}

export interface IntegrationStatus {
  service: string;
  status: 'connected' | 'disconnected' | 'error' | 'maintenance';
  lastChecked: number;
  responseTime?: number;
  errorMessage?: string;
}

// 第三方服務整合器
export abstract class ThirdPartyIntegration {
  protected apiKey: string;
  protected baseUrl: string;
  protected timeout: number = 30000;

  constructor(config: { apiKey: string; baseUrl: string; timeout?: number }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    if (config.timeout) this.timeout = config.timeout;
  }

  abstract getName(): string;
  abstract testConnection(): Promise<boolean>;
  abstract getStatus(): Promise<IntegrationStatus>;

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        metadata: {
          url,
          method: options.method || 'GET',
          duration,
          timestamp: startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          status: 0
        },
        metadata: {
          url,
          method: options.method || 'GET',
          duration: Date.now() - startTime,
          timestamp: startTime
        }
      };
    }
  }
}

// Google Gemini AI 整合
export class GeminiIntegration extends ThirdPartyIntegration {
  constructor(apiKey: string) {
    super({
      apiKey,
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      timeout: 60000
    });
  }

  getName(): string {
    return 'Google Gemini AI';
  }

  async testConnection(): Promise<boolean> {
    const response = await this.makeRequest('/models', { method: 'GET' });
    return response.success;
  }

  async getStatus(): Promise<IntegrationStatus> {
    const startTime = Date.now();
    const isConnected = await this.testConnection();
    const responseTime = Date.now() - startTime;

    return {
      service: this.getName(),
      status: isConnected ? 'connected' : 'error',
      lastChecked: startTime,
      responseTime,
      errorMessage: isConnected ? undefined : 'Connection test failed'
    };
  }

  async generateContent(prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}): Promise<ApiResponse> {
    const model = options.model || 'gemini-pro';
    const response = await this.makeRequest(`/models/${model}:generateContent`, {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 2048
        }
      })
    });

    return response;
  }
}

// Firebase 整合
export class FirebaseIntegration extends ThirdPartyIntegration {
  constructor(config: { apiKey: string; projectId: string }) {
    super({
      apiKey: config.apiKey,
      baseUrl: `https://${config.projectId}.firebasedatabase.app`,
      timeout: 30000
    });
    this.projectId = config.projectId;
  }

  private projectId: string;

  getName(): string {
    return 'Firebase Realtime Database';
  }

  async testConnection(): Promise<boolean> {
    const response = await this.makeRequest('.json', { method: 'GET' });
    return response.success;
  }

  async getStatus(): Promise<IntegrationStatus> {
    const startTime = Date.now();
    const isConnected = await this.testConnection();
    const responseTime = Date.now() - startTime;

    return {
      service: this.getName(),
      status: isConnected ? 'connected' : 'error',
      lastChecked: startTime,
      responseTime,
      errorMessage: isConnected ? undefined : 'Connection test failed'
    };
  }

  async saveData(path: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(`${path}.json`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getData(path: string): Promise<ApiResponse> {
    return this.makeRequest(`${path}.json`, { method: 'GET' });
  }
}

// 企業服務整合 (如 Flowlu, HubSpot 等)
export class BusinessIntegration extends ThirdPartyIntegration {
  constructor(config: { apiKey: string; baseUrl: string; serviceName: string }) {
    super({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      timeout: 30000
    });
    this.serviceName = config.serviceName;
  }

  private serviceName: string;

  getName(): string {
    return this.serviceName;
  }

  async testConnection(): Promise<boolean> {
    // 每個服務的連接測試邏輯不同
    const endpoints: Record<string, string> = {
      'Flowlu': '/ping',
      'HubSpot': '/contacts/v1/lists/all/contacts/all',
      'Salesforce': '/services/data/v58.0/limits'
    };

    const endpoint = endpoints[this.serviceName] || '/health';
    const response = await this.makeRequest(endpoint, { method: 'GET' });
    return response.success;
  }

  async getStatus(): Promise<IntegrationStatus> {
    const startTime = Date.now();
    const isConnected = await this.testConnection();
    const responseTime = Date.now() - startTime;

    return {
      service: this.getName(),
      status: isConnected ? 'connected' : 'error',
      lastChecked: startTime,
      responseTime,
      errorMessage: isConnected ? undefined : 'Connection test failed'
    };
  }

  async syncContacts(): Promise<ApiResponse> {
    // 根據不同服務實現聯絡人同步
    const endpoints: Record<string, string> = {
      'Flowlu': '/api/v1/module/crm/opportunity',
      'HubSpot': '/contacts/v1/lists/all/contacts/all',
      'Salesforce': '/services/data/v58.0/query'
    };

    const endpoint = endpoints[this.serviceName];
    if (!endpoint) {
      return {
        success: false,
        error: { code: 'UNSUPPORTED', message: 'Contact sync not implemented for this service', status: 501 },
        metadata: { url: '', method: 'GET', duration: 0, timestamp: Date.now() }
      };
    }

    return this.makeRequest(endpoint, { method: 'GET' });
  }
}

// Webhook 管理器
export class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();

  registerWebhook(config: WebhookConfig): void {
    this.webhooks.set(config.id, config);
  }

  unregisterWebhook(id: string): void {
    this.webhooks.delete(id);
  }

  async triggerWebhook(id: string, event: string, data: any): Promise<boolean> {
    const webhook = this.webhooks.get(id);
    if (!webhook || !webhook.events.includes(event)) {
      return false;
    }

    let success = false;
    let attempt = 0;
    const maxRetries = webhook.retryPolicy.maxRetries;
    const backoffMultiplier = webhook.retryPolicy.backoffMultiplier;
    const maxBackoff = webhook.retryPolicy.maxBackoff;

    while (attempt <= maxRetries && !success) {
      try {
        const payload = {
          event,
          data,
          timestamp: Date.now(),
          webhookId: id
        };

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...webhook.headers
        };

        if (webhook.secret) {
          // 簡單的HMAC簽名 (生產環境應使用更安全的實現)
          const signature = btoa(`${webhook.secret}:${JSON.stringify(payload)}`);
          headers['X-Webhook-Signature'] = signature;
        }

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000) // 30秒超時
        });

        if (response.ok) {
          success = true;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`Webhook ${id} attempt ${attempt + 1} failed:`, error);

        if (attempt < maxRetries) {
          // 指數退避重試
          const backoff = Math.min(
            backoffMultiplier ** attempt * 1000,
            maxBackoff
          );
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }

      attempt++;
    }

    return success;
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }

    // 觸發相關webhook
    this.webhooks.forEach(webhook => {
      if (webhook.events.includes(event)) {
        this.triggerWebhook(webhook.id, event, data);
      }
    });
  }

  getWebhooks(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }
}

// API 整合服務主類別
export class ApiIntegrationService {
  private integrations: Map<string, ThirdPartyIntegration> = new Map();
  private webhooks = new WebhookManager();
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // 註冊第三方服務整合
  registerIntegration(name: string, integration: ThirdPartyIntegration): void {
    this.integrations.set(name, integration);
  }

  // 註冊API端點
  registerEndpoint(endpoint: ApiEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  // 呼叫API端點
  async callEndpoint<T>(
    endpointId: string,
    params: Record<string, any> = {},
    options: { useCache?: boolean; retries?: number } = {}
  ): Promise<ApiResponse<T>> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      return {
        success: false,
        error: { code: 'ENDPOINT_NOT_FOUND', message: 'API endpoint not found', status: 404 },
        metadata: { url: '', method: 'GET', duration: 0, timestamp: Date.now() }
      };
    }

    // 檢查快取
    const cacheKey = `${endpointId}:${JSON.stringify(params)}`;
    if (options.useCache !== false && endpoint.cache?.enabled) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: {
            url: endpoint.url,
            method: endpoint.method,
            duration: 0,
            timestamp: Date.now(),
            cached: true
          }
        };
      }
    }

    const startTime = Date.now();
    let lastError: any = null;
    const maxRetries = options.retries ?? endpoint.retries ?? 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // 替換URL中的參數
        let url = endpoint.url;
        let body: string | undefined;

        if (endpoint.method === 'GET') {
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            queryParams.append(key, String(value));
          });
          url += `?${queryParams.toString()}`;
        } else {
          body = JSON.stringify(params);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout || 30000);

        const response = await fetch(url, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...endpoint.headers
          },
          body,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const duration = Date.now() - startTime;

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // 快取結果
        if (endpoint.cache?.enabled) {
          this.setCache(cacheKey, data, endpoint.cache.ttl);
        }

        // 觸發webhook
        this.webhooks.emit('api_call_success', {
          endpointId,
          url,
          method: endpoint.method,
          duration,
          status: response.status
        });

        return {
          success: true,
          data,
          metadata: {
            url,
            method: endpoint.method,
            duration,
            timestamp: startTime
          }
        };

      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          // 指數退避重試
          const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, backoff));
          continue;
        }

        break;
      }
    }

    // 觸發錯誤webhook
    this.webhooks.emit('api_call_error', {
      endpointId,
      error: lastError?.message,
      attempts: maxRetries + 1
    });

    return {
      success: false,
      error: {
        code: 'API_CALL_FAILED',
        message: lastError?.message || 'API call failed',
        status: 0
      },
      metadata: {
        url: endpoint.url,
        method: endpoint.method,
        duration: Date.now() - startTime,
        timestamp: startTime
      }
    };
  }

  // 取得整合狀態
  async getIntegrationStatus(): Promise<IntegrationStatus[]> {
    const statuses: IntegrationStatus[] = [];

    for (const [name, integration] of this.integrations.entries()) {
      try {
        const status = await integration.getStatus();
        statuses.push(status);
      } catch (error) {
        statuses.push({
          service: name,
          status: 'error',
          lastChecked: Date.now(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return statuses;
  }

  // Webhook 管理
  get webhooks() {
    return this.webhooks;
  }

  // 快取管理
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 全域實例
export const apiIntegrationService = new ApiIntegrationService();

// 預配置常用整合
export const geminiIntegration = new GeminiIntegration(process.env.VITE_GEMINI_API_KEY || '');
export const firebaseIntegration = new FirebaseIntegration({
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || ''
});

// React Hook
export const useApiIntegration = () => {
  return {
    callEndpoint: apiIntegrationService.callEndpoint.bind(apiIntegrationService),
    getIntegrationStatus: apiIntegrationService.getIntegrationStatus.bind(apiIntegrationService),
    webhooks: apiIntegrationService.webhooks
  };
};