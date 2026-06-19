/**
 * 整合與擴充服務 (M7: Integration & Extension)
 *
 * 提供系統整合、多平台支援和擴充功能：
 * - 企業系統整合
 * - 外部資料源整合
 * - 多平台支援
 * - API服務
 * - 模組化擴充
 */

import { SystemHealthStatus } from '../types/core';

export interface SystemIntegration {
  id: string;
  name: string;
  type: 'erp' | 'hr' | 'mes' | 'ehs' | 'finance' | 'supply_chain' | 'other';
  systemName: string;
  vendor: string;
  version?: string;
  connectionType: 'api' | 'database' | 'file' | 'webhook';
  endpoint?: string;
  authentication: {
    type: 'basic' | 'oauth' | 'api_key' | 'certificate';
    credentials?: any; // 加密儲存
  };
  dataMapping: {
    sourceFields: string[];
    targetFields: string[];
    transformations: Array<{
      source: string;
      target: string;
      type: 'direct' | 'calculation' | 'lookup' | 'custom';
      formula?: string;
    }>;
  };
  syncSchedule: {
    frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:MM格式
    lastSync?: string;
    nextSync?: string;
  };
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  errorLog: Array<{
    timestamp: string;
    error: string;
    resolved: boolean;
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    dataOwner: string;
  };
}

export interface ExternalDataSource {
  id: string;
  name: string;
  category: 'carbon' | 'climate' | 'supplier' | 'regulatory' | 'market' | 'other';
  provider: string;
  apiEndpoint: string;
  authentication: {
    type: 'api_key' | 'oauth' | 'basic';
    credentials: any; // 加密
  };
  dataTypes: string[];
  updateFrequency: 'real_time' | 'daily' | 'weekly' | 'monthly';
  lastUpdate?: string;
  status: 'active' | 'inactive' | 'error';
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    dataPointsProcessed: number;
  };
  cost: {
    monthlyLimit: number;
    currentUsage: number;
    costPerUnit: number;
  };
}

export interface PlatformSupport {
  platform: 'web' | 'mobile' | 'desktop' | 'api';
  version: string;
  supportedBrowsers?: string[];
  supportedOS?: string[];
  features: string[];
  limitations: string[];
  lastTested: string;
  compatibility: 'full' | 'partial' | 'limited' | 'unsupported';
}

export interface APIService {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  endpoints: Array<{
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    responses: {
      [statusCode: string]: {
        description: string;
        schema?: any;
      };
    };
  }>;
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth';
    required: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  status: 'active' | 'deprecated' | 'maintenance';
  documentation: string; // URL
}

export interface ExtensionModule {
  id: string;
  name: string;
  version: string;
  category: 'industry' | 'regional' | 'functional' | 'custom';
  description: string;
  dependencies: string[]; // 其他模組ID
  permissions: string[]; // 需要的權限
  features: Array<{
    name: string;
    description: string;
    enabled: boolean;
  }>;
  status: 'available' | 'installed' | 'updating' | 'error';
  installationDate?: string;
  lastUpdate?: string;
  license: {
    type: 'free' | 'paid' | 'subscription';
    expiryDate?: string;
    maxUsers?: number;
  };
  metrics: {
    usageCount: number;
    errorCount: number;
    satisfactionScore?: number;
  };
}

export class IntegrationService {
  private systemIntegrations: Map<string, SystemIntegration> = new Map();
  private externalDataSources: Map<string, ExternalDataSource> = new Map();
  private platformSupport: Map<string, PlatformSupport> = new Map();
  private apiServices: Map<string, APIService> = new Map();
  private extensionModules: Map<string, ExtensionModule> = new Map();

  constructor() {
    this.initializeDefaultConfigurations();
  }

  /**
   * 企業系統整合
   */
  async createSystemIntegration(
    integrationData: Omit<SystemIntegration, 'id' | 'status' | 'errorLog' | 'metadata'>
  ): Promise<string> {
    const id = `INT_${Date.now()}`;

    const integration: SystemIntegration = {
      id,
      ...integrationData,
      status: 'inactive',
      errorLog: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        dataOwner: integrationData.authentication?.credentials?.owner || 'admin',
      },
    };

    this.systemIntegrations.set(id, integration);
    return id;
  }

  async activateIntegration(integrationId: string): Promise<boolean> {
    const integration = this.systemIntegrations.get(integrationId);
    if (!integration) throw new Error('整合不存在');

    try {
      // 測試連接
      const testResult = await this.testConnection(integration);
      if (!testResult.success) {
        throw new Error(`連接測試失敗: ${testResult.error}`);
      }

      // 更新狀態
      integration.status = 'active';
      integration.metadata.updatedAt = new Date().toISOString();

      // 設定同步排程
      this.scheduleSync(integration);

      return true;
    } catch (error: any) {
      integration.status = 'error';
      integration.errorLog.push({
        timestamp: new Date().toISOString(),
        error: error.message,
        resolved: false,
      });
      return false;
    }
  }

  async syncData(
    integrationId: string,
    options?: { force: boolean }
  ): Promise<{
    success: boolean;
    recordsProcessed: number;
    errors: string[];
    duration: number;
  }> {
    const integration = this.systemIntegrations.get(integrationId);
    if (!integration) throw new Error('整合不存在');
    if (integration.status !== 'active') throw new Error('整合未激活');

    const startTime = Date.now();

    try {
      const result = await this.performDataSync(integration, options);
      const duration = Date.now() - startTime;

      // 更新最後同步時間
      integration.syncSchedule.lastSync = new Date().toISOString();
      integration.syncSchedule.nextSync = this.calculateNextSync(integration);

      return {
        success: true,
        recordsProcessed: result.recordsProcessed,
        errors: result.errors,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      integration.status = 'error';
      integration.errorLog.push({
        timestamp: new Date().toISOString(),
        error: error.message,
        resolved: false,
      });

      return {
        success: false,
        recordsProcessed: 0,
        errors: [error.message],
        duration,
      };
    }
  }

  getSystemIntegrations(filters?: { type?: string; status?: string }): SystemIntegration[] {
    let integrations = Array.from(this.systemIntegrations.values());

    if (filters) {
      if (filters.type) {
        integrations = integrations.filter(i => i.type === filters.type);
      }
      if (filters.status) {
        integrations = integrations.filter(i => i.status === filters.status);
      }
    }

    return integrations.sort(
      (a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
    );
  }

  /**
   * 外部資料源管理
   */
  async addExternalDataSource(
    sourceData: Omit<ExternalDataSource, 'id' | 'lastUpdate' | 'usage'>
  ): Promise<string> {
    const id = `EXT_${Date.now()}`;

    const source: ExternalDataSource = {
      id,
      ...sourceData,
      lastUpdate: undefined,
      usage: {
        requestsToday: 0,
        requestsThisMonth: 0,
        dataPointsProcessed: 0,
      },
    };

    this.externalDataSources.set(id, source);
    return id;
  }

  async fetchExternalData(sourceId: string, dataType: string): Promise<any> {
    const source = this.externalDataSources.get(sourceId);
    if (!source) throw new Error('外部資料源不存在');
    if (source.status !== 'active') throw new Error('資料源未激活');

    // 檢查使用限制
    if (source.usage.requestsToday >= 1000) {
      // 每天限制
      throw new Error('已達到每日請求限制');
    }

    try {
      const data = await this.callExternalAPI(source, dataType);

      // 更新使用統計
      source.usage.requestsToday++;
      source.usage.requestsThisMonth++;
      source.usage.dataPointsProcessed += data.length || 1;
      source.lastUpdate = new Date().toISOString();

      return data;
    } catch (error: any) {
      source.status = 'error';
      throw error;
    }
  }

  getExternalDataSources(category?: string): ExternalDataSource[] {
    let sources = Array.from(this.externalDataSources.values());

    if (category) {
      sources = sources.filter(s => s.category === category);
    }

    return sources;
  }

  /**
   * 多平台支援
   */
  addPlatformSupport(platformData: PlatformSupport): void {
    this.platformSupport.set(platformData.platform, platformData);
  }

  getPlatformSupport(): PlatformSupport[] {
    return Array.from(this.platformSupport.values());
  }

  checkPlatformCompatibility(
    platform: string,
    version?: string
  ): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const support = this.platformSupport.get(platform);
    if (!support) {
      return {
        compatible: false,
        issues: ['平台不受支援'],
        recommendations: ['請聯繫技術支援確認相容性'],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // 版本檢查
    if (version && support.version !== version) {
      issues.push(`版本不相容：需要 ${support.version}，目前 ${version}`);
      recommendations.push('請升級到支援的版本');
    }

    // 功能限制檢查
    if (support.limitations.length > 0) {
      issues.push(...support.limitations.map(l => `功能限制：${l}`));
    }

    return {
      compatible: support.compatibility === 'full',
      issues,
      recommendations,
    };
  }

  /**
   * API服務管理
   */
  async createAPIService(serviceData: Omit<APIService, 'id'>): Promise<string> {
    const id = `API_${Date.now()}`;

    const service: APIService = {
      id,
      ...serviceData,
    };

    this.apiServices.set(id, service);
    return id;
  }

  getAPIServices(status?: string): APIService[] {
    let services = Array.from(this.apiServices.values());

    if (status) {
      services = services.filter(s => s.status === status);
    }

    return services;
  }

  async validateAPIRequest(
    serviceId: string,
    request: {
      method: string;
      path: string;
      headers: Record<string, string>;
      body?: any;
    }
  ): Promise<{
    valid: boolean;
    errors: string[];
    rateLimitRemaining: number;
  }> {
    const service = this.apiServices.get(serviceId);
    if (!service) {
      return { valid: false, errors: ['API服務不存在'], rateLimitRemaining: 0 };
    }

    const errors: string[] = [];

    // 驗證認證
    if (service.authentication.required) {
      const hasAuth = this.validateAuthentication(request.headers, service.authentication.type);
      if (!hasAuth) {
        errors.push('缺少必要的認證資訊');
      }
    }

    // 驗證端點
    const endpoint = service.endpoints.find(
      e => e.path === request.path && e.method === request.method
    );
    if (!endpoint) {
      errors.push('端點不存在或方法不支援');
    }

    // 驗證請求參數
    if (endpoint) {
      const paramErrors = this.validateParameters(request, endpoint.parameters);
      errors.push(...paramErrors);
    }

    // 檢查速率限制 (簡化實現)
    const rateLimitRemaining = service.rateLimits.requestsPerMinute;

    return {
      valid: errors.length === 0,
      errors,
      rateLimitRemaining,
    };
  }

  /**
   * 擴充模組管理
   */
  async installExtensionModule(
    moduleData: Omit<ExtensionModule, 'id' | 'status' | 'installationDate' | 'metrics'>
  ): Promise<string> {
    const id = `MOD_${Date.now()}`;

    // 檢查依賴
    for (const depId of moduleData.dependencies) {
      const dependency = this.extensionModules.get(depId);
      if (!dependency || dependency.status !== 'installed') {
        throw new Error(`缺少依賴模組: ${depId}`);
      }
    }

    const module: ExtensionModule = {
      id,
      ...moduleData,
      status: 'installed',
      installationDate: new Date().toISOString(),
      metrics: {
        usageCount: 0,
        errorCount: 0,
      },
    };

    this.extensionModules.set(id, module);
    return id;
  }

  async uninstallExtensionModule(moduleId: string): Promise<void> {
    const module = this.extensionModules.get(moduleId);
    if (!module) throw new Error('模組不存在');

    // 檢查是否有其他模組依賴此模組
    const dependents = Array.from(this.extensionModules.values()).filter(
      m => m.dependencies.includes(moduleId) && m.status === 'installed'
    );

    if (dependents.length > 0) {
      throw new Error(`無法卸載：${dependents.length}個模組依賴此模組`);
    }

    module.status = 'available';
    delete module.installationDate;
  }

  getExtensionModules(category?: string): ExtensionModule[] {
    let modules = Array.from(this.extensionModules.values());

    if (category) {
      modules = modules.filter(m => m.category === category);
    }

    return modules.sort(
      (a, b) =>
        new Date(b.installationDate || '1970-01-01').getTime() -
        new Date(a.installationDate || '1970-01-01').getTime()
    );
  }

  getAvailableExtensions(): ExtensionModule[] {
    // 預定義可用的擴充模組
    const availableModules: Omit<
      ExtensionModule,
      'id' | 'status' | 'installationDate' | 'lastUpdate' | 'metrics'
    >[] = [
        {
          name: '製造業ESG模組',
          version: '1.0.0',
          category: 'industry',
          description: '專為製造業設計的ESG指標和製程優化工具',
          dependencies: [],
          permissions: ['manufacturing.read', 'process.write'],
          features: [
            { name: '製程碳足跡追蹤', description: '追蹤各製程的碳排放', enabled: true },
            { name: '設備能源效率分析', description: '分析設備能源使用效率', enabled: true },
            { name: '供應鏈碳管理', description: '管理供應鏈碳足跡', enabled: true },
          ],
          license: { type: 'paid', expiryDate: '2026-12-31', maxUsers: 100 },
        },
        {
          name: 'EU CSRD合規模組',
          version: '1.0.0',
          category: 'regional',
          description: '協助符合歐盟永續發展報告指令要求',
          dependencies: [],
          permissions: ['reporting.eu', 'compliance.read'],
          features: [
            { name: 'ESRS報告框架', description: '自動生成ESRS格式報告', enabled: true },
            { name: '雙重重大性評估', description: '財務和影響雙重重大性分析', enabled: true },
            { name: '利害關係人參與', description: '管理利害關係人參與流程', enabled: true },
          ],
          license: { type: 'subscription', expiryDate: '2025-12-31' },
        },
        {
          name: '永續供應鏈模組',
          version: '1.0.0',
          category: 'functional',
          description: '進階供應鏈ESG評估和管理工具',
          dependencies: [],
          permissions: ['supply_chain.read', 'supplier.write'],
          features: [
            { name: '供應商ESG評分', description: '自動化供應商ESG評估', enabled: true },
            { name: '風險熱區圖', description: '視覺化供應鏈風險分布', enabled: true },
            { name: '改善追蹤系統', description: '追蹤供應商改善進度', enabled: true },
            { name: '永續採購優化', description: '優化採購決策的ESG因素', enabled: true },
          ],
          license: { type: 'paid', expiryDate: '2026-06-30' },
        },
      ];

    return availableModules.map(module => ({
      ...module,
      id: '', // 會在安裝時生成
      status: 'available',
      metrics: { usageCount: 0, errorCount: 0 },
    }));
  }

  /**
   * 系統健康檢查
   */
  async healthCheck(): Promise<{
    status: SystemHealthStatus; // 使用統一的健康狀態類型
    integrations: { active: number; error: number; total: number };
    externalSources: { active: number; error: number; total: number };
    platformSupport: { supported: number; total: number };
    apiServices: { active: number; total: number };
    extensionModules: { installed: number; total: number };
  }> {
    const integrations = this.systemIntegrations;
    const externalSources = this.externalDataSources;
    const platformSupport = this.platformSupport;
    const apiServices = this.apiServices;
    const extensionModules = this.extensionModules;

    const integrationStats = {
      active: Array.from(integrations.values()).filter(i => i.status === 'active').length,
      error: Array.from(integrations.values()).filter(i => i.status === 'error').length,
      total: integrations.size,
    };

    const externalStats = {
      active: Array.from(externalSources.values()).filter(s => s.status === 'active').length,
      error: Array.from(externalSources.values()).filter(s => s.status === 'error').length,
      total: externalSources.size,
    };

    const platformStats = {
      supported: Array.from(platformSupport.values()).filter(p => p.compatibility === 'full')
        .length,
      total: platformSupport.size,
    };

    const apiStats = {
      active: Array.from(apiServices.values()).filter(s => s.status === 'active').length,
      total: apiServices.size,
    };

    const moduleStats = {
      installed: Array.from(extensionModules.values()).filter(m => m.status === 'installed').length,
      total: extensionModules.size,
    };

    // 計算整體健康狀態
    const healthScore =
      (integrationStats.active / Math.max(integrationStats.total, 1)) * 25 +
      (externalStats.active / Math.max(externalStats.total, 1)) * 20 +
      (platformStats.supported / Math.max(platformStats.total, 1)) * 15 +
      (apiStats.active / Math.max(apiStats.total, 1)) * 20 +
      (moduleStats.installed / Math.max(moduleStats.total, 1)) * 20;

    let status: SystemHealthStatus;
    if (healthScore >= 80) status = 'healthy';
    else if (healthScore >= 60) status = 'warning'; // degraded 映射為 warning
    else status = 'critical'; // unhealthy 映射為 critical

    return {
      status,
      integrations: integrationStats,
      externalSources: externalStats,
      platformSupport: platformStats,
      apiServices: apiStats,
      extensionModules: moduleStats,
    };
  }

  private initializeDefaultConfigurations(): void {
    // 初始化預設平台支援
    this.addPlatformSupport({
      platform: 'web',
      version: '1.0.0',
      supportedBrowsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
      features: ['完整功能', '實時同步', '進階圖表', '批量操作'],
      limitations: ['離線功能有限'],
      lastTested: new Date().toISOString(),
      compatibility: 'full',
    });

    this.addPlatformSupport({
      platform: 'mobile',
      version: '1.0.0',
      supportedOS: ['iOS 14+', 'Android 9+'],
      features: ['核心功能', '推播通知', '離線瀏覽', '相機整合'],
      limitations: ['圖表功能簡化', '批量操作受限'],
      lastTested: new Date().toISOString(),
      compatibility: 'partial',
    });

    // 初始化預設API服務
    this.createAPIService({
      name: 'ESG Data API',
      version: 'v1.0',
      baseUrl: '/api/v1',
      endpoints: [
        {
          path: '/esg/metrics',
          method: 'GET',
          description: '獲取ESG指標數據',
          parameters: [
            { name: 'category', type: 'string', required: false, description: '指標類別' },
            { name: 'period', type: 'string', required: false, description: '時間區間' },
          ],
          responses: {
            '200': { description: '成功返回指標數據' },
          },
        },
      ],
      authentication: { type: 'bearer', required: true },
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 5000,
        requestsPerDay: 20000,
      },
      status: 'active',
      documentation: '/api/docs',
    });
  }

  private async testConnection(
    integration: SystemIntegration
  ): Promise<{ success: boolean; error?: string }> {
    // 模擬連接測試
    try {
      // 實際實現會根據integration.connectionType進行測試
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private scheduleSync(integration: SystemIntegration): void {
    // 設定同步排程器
    const nextSync = this.calculateNextSync(integration);
    integration.syncSchedule.nextSync = nextSync;
  }

  private calculateNextSync(integration: SystemIntegration): string {
    const now = new Date();
    const frequency = integration.syncSchedule.frequency;

    switch (frequency) {
      case 'real_time':
        return now.toISOString();
      case 'hourly':
        now.setHours(now.getHours() + 1);
        break;
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }

    return now.toISOString();
  }

  private async performDataSync(
    integration: SystemIntegration,
    options?: { force: boolean }
  ): Promise<{
    recordsProcessed: number;
    errors: string[];
  }> {
    // 模擬資料同步
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      recordsProcessed: Math.floor(Math.random() * 1000) + 100,
      errors: Math.random() > 0.8 ? ['部分數據同步失敗'] : [],
    };
  }

  private async callExternalAPI(source: ExternalDataSource, dataType: string): Promise<any> {
    // 模擬外部API調用
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      dataType,
      timestamp: new Date().toISOString(),
      data: [],
    };
  }

  private validateAuthentication(headers: Record<string, string>, authType: string): boolean {
    switch (authType) {
      case 'basic':
        return !!headers['authorization']?.startsWith('Basic ');
      case 'bearer':
        return !!headers['authorization']?.startsWith('Bearer ');
      case 'api_key':
        return !!headers['x-api-key'];
      case 'oauth':
        return !!headers['authorization'];
      default:
        return true;
    }
  }

  private validateParameters(request: any, parameters: any[]): string[] {
    const errors: string[] = [];

    for (const param of parameters) {
      if (param.required) {
        const value = request.body?.[param.name] || request.query?.[param.name];
        if (value === undefined || value === null || value === '') {
          errors.push(`缺少必要參數: ${param.name}`);
        }
      }
    }

    return errors;
  }
}

// 導出預設實例
export const integrationService = new IntegrationService();

// Phase 42: Reality Bridge (Bio-Digital Execution)
export interface RealityActionCheck {
  success: boolean;
  transactionId: string;
  timestamp: string;
  bioVerified: boolean;
}

// Extend class for Bio-Action
declare module './integrationService' {
  interface IntegrationService {
    executeBioSignedAction(
      agentId: string,
      bioSignature: string,
      actionType: string,
      payload: any
    ): Promise<RealityActionCheck>;
  }
}

IntegrationService.prototype.executeBioSignedAction = async function (
  agentId: string,
  bioSignature: string,
  actionType: string,
  payload: any
): Promise<RealityActionCheck> {
  // 1. Verify Bio-Digital Signature (Mock)
  if (!bioSignature || !bioSignature.startsWith('BIO-')) {
    throw new Error(`[Security Breach] Invalid Bio-Signature from Agent ${agentId}`);
  }

  // 2. Simulate Latency (Connecting to Real-world API)
  await new Promise(resolve => setTimeout(resolve, 1200));

  const { omniLogger, LogCategory } = await import('./omniLogger');

  omniLogger.info(
    LogCategory.SYSTEM,
    `[Reality Bridge] 🌐 Executing High-Fidelity Action: ${actionType}`,
    { agentId, bioSignature, payload }
  );
  omniLogger.info(LogCategory.SEC, `[Bio-Auth] Verified: ${bioSignature}`, { agentId });

  // 3. Return Receipt
  return {
    success: true,
    transactionId: `REALITY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    bioVerified: true,
  };
};
