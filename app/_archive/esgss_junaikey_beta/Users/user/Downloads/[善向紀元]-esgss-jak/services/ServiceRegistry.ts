// 服務註冊與依賴注入管理器 - 萬能元鑰統一控制中心
import { EventEmitter } from 'events';

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  lastChecked: number;
  error?: string;
}

export interface ServiceMetadata {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  healthCheckUrl?: string;
  tags: string[];
}

/**
 * 服務註冊器 - 實現服務的集中管理與依賴注入
 * 遵循單一責任原則和開閉原則
 */
export class ServiceRegistry extends EventEmitter {
  private static instance: ServiceRegistry;
  private services = new Map<string, any>();
  private serviceMetadata = new Map<string, ServiceMetadata>();
  private healthCache = new Map<string, ServiceHealth>();
  private healthCheckInterval?: NodeJS.Timeout;
  private isInitialized = false;

  private constructor() {
    super();
    this.setupHealthMonitoring();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * 註冊服務到註冊器
   */
  register<T>(
    name: string,
    service: T,
    metadata?: Partial<ServiceMetadata>
  ): void {
    if (this.services.has(name)) {
      throw new Error(`Service '${name}' is already registered`);
    }

    this.services.set(name, service);

    // 設置默認元數據
    const defaultMetadata: ServiceMetadata = {
      name,
      version: '1.0.0',
      description: `Service ${name}`,
      dependencies: [],
      tags: [],
      ...metadata
    };

    this.serviceMetadata.set(name, defaultMetadata);

    this.emit('service-registered', { name, service, metadata: defaultMetadata });

    console.log(`[ServiceRegistry] Service '${name}' registered successfully`);
  }

  /**
   * 從註冊器獲取服務實例
   */
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`);
    }
    return service;
  }

  /**
   * 檢查服務是否存在
   */
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * 取消註冊服務
   */
  unregister(name: string): boolean {
    const existed = this.services.delete(name);
    if (existed) {
      this.serviceMetadata.delete(name);
      this.healthCache.delete(name);
      this.emit('service-unregistered', { name });
      console.log(`[ServiceRegistry] Service '${name}' unregistered`);
    }
    return existed;
  }

  /**
   * 獲取所有已註冊的服務名稱
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * 獲取服務元數據
   */
  getServiceMetadata(name: string): ServiceMetadata | null {
    return this.serviceMetadata.get(name) || null;
  }

  /**
   * 批量註冊服務
   */
  registerMultiple(services: Record<string, any>, metadata?: Record<string, Partial<ServiceMetadata>>): void {
    Object.entries(services).forEach(([name, service]) => {
      this.register(name, service, metadata?.[name]);
    });
  }

  /**
   * 執行服務健康檢查
   */
  async performHealthCheck(serviceName: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    const metadata = this.serviceMetadata.get(serviceName);

    try {
      if (!this.services.has(serviceName)) {
        throw new Error(`Service '${serviceName}' not found`);
      }

      const service = this.services.get(serviceName);

      // 如果服務有健康檢查方法，調用它
      if (typeof service.healthCheck === 'function') {
        const result = await service.healthCheck();
        const responseTime = Date.now() - startTime;

        const health: ServiceHealth = {
          name: serviceName,
          status: result.healthy ? 'healthy' : 'unhealthy',
          responseTime,
          lastChecked: Date.now(),
          error: result.error
        };

        this.healthCache.set(serviceName, health);
        return health;
      }

      // 默認健康檢查
      const responseTime = Date.now() - startTime;
      const health: ServiceHealth = {
        name: serviceName,
        status: 'healthy',
        responseTime,
        lastChecked: Date.now()
      };

      this.healthCache.set(serviceName, health);
      return health;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const health: ServiceHealth = {
        name: serviceName,
        status: 'unhealthy',
        responseTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      this.healthCache.set(serviceName, health);
      return health;
    }
  }

  /**
   * 執行所有服務的健康檢查
   */
  async performAllHealthChecks(): Promise<ServiceHealth[]> {
    const serviceNames = this.getServiceNames();
    const healthChecks = serviceNames.map(name => this.performHealthCheck(name));

    return Promise.all(healthChecks);
  }

  /**
   * 獲取服務健康狀態
   */
  getServiceHealth(name: string): ServiceHealth | null {
    return this.healthCache.get(name) || null;
  }

  /**
   * 獲取所有服務的健康狀態
   */
  getAllServiceHealth(): ServiceHealth[] {
    return Array.from(this.healthCache.values());
  }

  /**
   * 獲取系統整體健康狀態
   */
  getSystemHealth(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    totalServices: number;
    healthyServices: number;
    unhealthyServices: number;
    unknownServices: number;
    details: ServiceHealth[];
  } {
    const allHealth = this.getAllServiceHealth();
    const totalServices = allHealth.length;
    const healthyServices = allHealth.filter(h => h.status === 'healthy').length;
    const unhealthyServices = allHealth.filter(h => h.status === 'unhealthy').length;
    const unknownServices = allHealth.filter(h => h.status === 'unknown').length;

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (unhealthyServices > 0) {
      overall = unhealthyServices === totalServices ? 'unhealthy' : 'degraded';
    }

    return {
      overall,
      totalServices,
      healthyServices,
      unhealthyServices,
      unknownServices,
      details: allHealth
    };
  }

  /**
   * 依賴注入解析器
   */
  resolveDependencies(serviceName: string): string[] {
    const metadata = this.serviceMetadata.get(serviceName);
    return metadata?.dependencies || [];
  }

  /**
   * 檢查服務依賴是否滿足
   */
  checkDependencies(serviceName: string): { satisfied: boolean; missing: string[] } {
    const dependencies = this.resolveDependencies(serviceName);
    const missing = dependencies.filter(dep => !this.has(dep));

    return {
      satisfied: missing.length === 0,
      missing
    };
  }

  /**
   * 初始化服務註冊器
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('[ServiceRegistry] Initializing service registry...');

    // 執行初始健康檢查
    await this.performAllHealthChecks();

    this.isInitialized = true;
    this.emit('registry-initialized');

    console.log('[ServiceRegistry] Service registry initialized');
  }

  /**
   * 銷毀服務註冊器
   */
  async destroy(): Promise<void> {
    console.log('[ServiceRegistry] Destroying service registry...');

    // 停止健康監控
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    // 清除所有服務
    this.services.clear();
    this.serviceMetadata.clear();
    this.healthCache.clear();

    this.isInitialized = false;
    ServiceRegistry.instance = null!;

    this.emit('registry-destroyed');

    console.log('[ServiceRegistry] Service registry destroyed');
  }

  /**
   * 設置健康監控
   */
  private setupHealthMonitoring(): void {
    // 每30秒執行一次健康檢查
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performAllHealthChecks();
        this.emit('health-check-completed');
      } catch (error) {
        console.error('[ServiceRegistry] Health check failed:', error);
        this.emit('health-check-failed', error);
      }
    }, 30000);
  }

  /**
   * 獲取服務統計信息
   */
  getStats(): {
    totalServices: number;
    servicesByTag: Record<string, number>;
    averageResponseTime: number;
    healthDistribution: Record<string, number>;
  } {
    const totalServices = this.services.size;
    const servicesByTag: Record<string, number> = {};
    const responseTimes: number[] = [];
    const healthDistribution: Record<string, number> = {
      healthy: 0,
      unhealthy: 0,
      unknown: 0
    };

    for (const [name, metadata] of this.serviceMetadata) {
      // 統計標籤
      metadata.tags.forEach(tag => {
        servicesByTag[tag] = (servicesByTag[tag] || 0) + 1;
      });

      // 統計健康狀態
      const health = this.healthCache.get(name);
      if (health) {
        healthDistribution[health.status]++;
        if (health.responseTime) {
          responseTimes.push(health.responseTime);
        }
      }
    }

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    return {
      totalServices,
      servicesByTag,
      averageResponseTime,
      healthDistribution
    };
  }
}

// 導出單例實例
export const serviceRegistry = ServiceRegistry.getInstance();

// 服務裝飾器 - 用於自動註冊服務
export function Service(metadata?: Partial<ServiceMetadata>) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        const serviceName = metadata?.name || constructor.name.toLowerCase();
        serviceRegistry.register(serviceName, this, metadata);

        console.log(`[Service] ${serviceName} auto-registered`);
      }
    };
  };
}

// 注入裝飾器 - 用於依賴注入
export function Inject(serviceName: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: () => serviceRegistry.get(serviceName),
      enumerable: true,
      configurable: true
    });
  };
}