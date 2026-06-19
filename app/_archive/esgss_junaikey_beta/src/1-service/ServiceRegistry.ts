// 服務註冊與依賴注入管理器 - 萬能元鑰統一控制中心
import { EventEmitter } from '@/utils/EventEmitter';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { SystemHealthStatus } from '../types/core';

/**
 * 擴展的服務健康狀態類型 (Extended Service Health Status)
 * 基於統一的 SystemHealthStatus，額外加入 'unknown' 狀態用於未檢查的服務
 */
export type RegistryHealthStatus = SystemHealthStatus | 'unknown';

export interface ServiceHealth {
  name: string;
  status: RegistryHealthStatus; // 使用擴展的健康狀態類型
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
 * 服務註冊器 - 實現服務集中管理與依賴注入
 * 遵循單一職責與控制反轉原則
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
   * 註冊服務至註冊器
   */
  register<T>(name: string, service: T, metadata?: Partial<ServiceMetadata>): void {
    if (this.services.has(name)) {
      omniLogger.warn(
        LogCategory.SYSTEM,
        `Service '${name}' is already registered. Skipping new registration to prevent conflicts.`
      );
      return;
    }

    this.services.set(name, service);

    // 設置默認元數據
    const defaultMetadata: ServiceMetadata = {
      name,
      version: '1.0.0',
      description: `Service ${name}`,
      dependencies: [],
      tags: [],
      ...metadata,
    };

    this.serviceMetadata.set(name, defaultMetadata);

    this.emit('service-registered', { name, service, metadata: defaultMetadata });

    omniLogger.info(LogCategory.SYSTEM, `Service '${name}' registered successfully`, {
      version: defaultMetadata.version,
    });
  }

  /**
   * 從註冊器取得服務實體
   */
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(
        `Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`
      );
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
      omniLogger.info(LogCategory.SYSTEM, `Service '${name}' unregistered`);
    }
    return existed;
  }

  /**
   * 取得所有已註冊服務的名稱
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * 取得服務元數據
   */
  getServiceMetadata(name: string): ServiceMetadata | null {
    return this.serviceMetadata.get(name) || null;
  }

  /**
   * 批量註冊服務
   */
  registerMultiple(
    services: Record<string, any>,
    metadata?: Record<string, Partial<ServiceMetadata>>
  ): void {
    Object.entries(services).forEach(([name, service]) => {
      this.register(name, service, metadata?.[name]);
    });
  }

  /**
   * 執行單一服務健康檢查
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
          status: result.healthy ? 'healthy' : 'critical', // unhealthy 映射為 critical
          responseTime,
          lastChecked: Date.now(),
          error: result.error,
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
        lastChecked: Date.now(),
      };

      this.healthCache.set(serviceName, health);
      return health;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const health: ServiceHealth = {
        name: serviceName,
        status: 'critical', // 錯誤狀態映射為 critical
        responseTime,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.healthCache.set(serviceName, health);
      return health;
    }
  }

  /**
   * 執行所有服務健康檢查
   */
  async performAllHealthChecks(): Promise<ServiceHealth[]> {
    const serviceNames = this.getServiceNames();
    const healthChecks = serviceNames.map(name => this.performHealthCheck(name));

    return Promise.all(healthChecks);
  }

  /**
   * 取得單一服務健康狀態
   */
  getServiceHealth(name: string): ServiceHealth | null {
    return this.healthCache.get(name) || null;
  }

  /**
   * 取得所有服務健康狀態
   */
  getAllServiceHealth(): ServiceHealth[] {
    return Array.from(this.healthCache.values());
  }

  /**
   * 取得系統整體健康狀態
   */
  getSystemHealth(): {
    overall: SystemHealthStatus; // 使用統一的基礎狀態類型
    totalServices: number;
    healthyServices: number;
    criticalServices: number; // unhealthy 改為 critical
    unknownServices: number;
    details: ServiceHealth[];
  } {
    const allHealth = this.getAllServiceHealth();
    const totalServices = allHealth.length;
    const healthyServices = allHealth.filter(h => h.status === 'healthy').length;
    const criticalServices = allHealth.filter(h => h.status === 'critical').length;
    const unknownServices = allHealth.filter(h => h.status === 'unknown').length;

    let overall: SystemHealthStatus = 'healthy';

    if (criticalServices > 0) {
      overall = criticalServices === totalServices ? 'critical' : 'warning'; // degraded 映射為 warning
    }

    return {
      overall,
      totalServices,
      healthyServices,
      criticalServices,
      unknownServices,
      details: allHealth,
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
      missing,
    };
  }

  /**
   * 初始化服務註冊器
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    omniLogger.info(LogCategory.SYSTEM, 'Initializing service registry...');

    // 執行所有服務健康檢查
    await this.performAllHealthChecks();

    this.isInitialized = true;
    this.emit('registry-initialized');

    omniLogger.info(LogCategory.SYSTEM, 'Service registry initialized');
  }

  /**
   * 銷毀服務註冊器
   */
  async destroy(): Promise<void> {
    omniLogger.info(
      LogCategory.SYSTEM,
      'Destroying service registry and all registered services...'
    );

    // 對所有服務執行銷毀邏輯 (如果有)
    for (const [name, service] of this.services) {
      if (service && typeof service.destroy === 'function') {
        try {
          omniLogger.debug(LogCategory.SYSTEM, `Destroying service: ${name}`);
          const result = service.destroy();
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          omniLogger.error(LogCategory.SYSTEM, `Error destroying service: ${name}`, { error });
        }
      }
    }

    // 停止健康監控
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      // this.healthCheckInterval = undefined; // removed per exactOptionalPropertyTypes
    }

    // 清除所有數據
    this.services.clear();
    this.serviceMetadata.clear();
    this.healthCache.clear();

    this.isInitialized = false;
    ServiceRegistry.instance = null!;

    this.emit('registry-destroyed');

    omniLogger.info(LogCategory.SYSTEM, 'Service registry destroyed');
  }

  /**
   * 設置健康監控
   */
  private setupHealthMonitoring(): void {
    // 每 30 秒執行一次健康檢查
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performAllHealthChecks();
        this.emit('health-check-completed');
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, 'Health check failed', { error });
        this.emit('health-check-failed', error);
      }
    }, 30000);
  }

  /**
   * 取得服務統計信息
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
      unknown: 0,
    };

    for (const [name, metadata] of this.serviceMetadata) {
      // 統計標籤
      metadata.tags.forEach(tag => {
        servicesByTag[tag] = (servicesByTag[tag] || 0) + 1;
      });

      // 統計健康狀態
      const health = this.healthCache.get(name);
      if (health) {
        const status = health.status;
        healthDistribution[status] = (healthDistribution[status] || 0) + 1;
        const rt = health.responseTime;
        if (typeof rt === 'number') {
          responseTimes.push(rt);
        }
      }
    }

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    return {
      totalServices,
      servicesByTag,
      averageResponseTime,
      healthDistribution,
    };
  }
}

// 導出單例實體
export const serviceRegistry = ServiceRegistry.getInstance();

// 服務裝飾器 - 用於自動註冊服務
export function Service(metadata?: Partial<ServiceMetadata>) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        const serviceName = metadata?.name || constructor.name.toLowerCase();
        serviceRegistry.register(serviceName, this, metadata);

        omniLogger.debug(LogCategory.SYSTEM, `Service ${serviceName} auto-registered`);
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
      configurable: true,
    });
  };
}
