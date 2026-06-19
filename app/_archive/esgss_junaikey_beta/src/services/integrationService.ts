/**
 * Integration & Extension Services (M7: Integration & Extension)
 *
 * Provides system integration, multi-platform support, and extension functions:
 * - Enterprise system integration
 * - External data source integration
 * - Multi-platform support
 * - API services
 * - Modular extensions
 */

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
    credentials?: any; // Encrypted storage
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
    time?: string; // HH:MM format
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
    credentials: any; // Encrypted
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
  dependencies: string[]; // Other module IDs
  permissions: string[]; // Required permissions
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
   * Enterprise system integration
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
    if (!integration) throw new Error('Integration does not exist');

    try {
      // Test connection
      const testResult = await this.testConnection(integration);
      if (!testResult.success) {
        throw new Error(`Connection test failed: ${testResult.error}`);
      }

      // Update status
      integration.status = 'active';
      integration.metadata.updatedAt = new Date().toISOString();

      // Set sync schedule
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
    if (!integration) throw new Error('Integration does not exist');
    if (integration.status !== 'active') throw new Error('Integration not active');

    const startTime = Date.now();

    try {
      const result = await this.performDataSync(integration, options);
      const duration = Date.now() - startTime;

      // Update last sync time
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
   * External data source management
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
    if (!source) throw new Error('External data source does not exist');
    if (source.status !== 'active') throw new Error('Data source not active');

    // Check usage limits
    if (source.usage.requestsToday >= 1000) {
      // Daily limit
      throw new Error('Daily request limit reached');
    }

    try {
      const data = await this.callExternalAPI(source, dataType);

      // Update usage stats
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
   * Multi-platform support
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
        issues: ['Platform not supported'],
        recommendations: ['Please contact technical support to confirm compatibility'],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Version check
    if (version && support.version !== version) {
      issues.push(`Incompatible version: Requires ${support.version}, current ${version}`);
      recommendations.push('Please upgrade to a supported version');
    }

    // Feature limit check
    if (support.limitations.length > 0) {
      issues.push(...support.limitations.map(l => `Feature limitation: ${l}`));
    }

    return {
      compatible: support.compatibility === 'full',
      issues,
      recommendations,
    };
  }

  /**
   * API service management
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
      return { valid: false, errors: ['API service does not exist'], rateLimitRemaining: 0 };
    }

    const errors: string[] = [];

    // Validate authentication
    if (service.authentication.required) {
      const hasAuth = this.validateAuthentication(request.headers, service.authentication.type);
      if (!hasAuth) {
        errors.push('Missing required authentication information');
      }
    }

    // Validate endpoint
    const endpoint = service.endpoints.find(
      e => e.path === request.path && e.method === request.method
    );
    if (!endpoint) {
      errors.push('Endpoint does not exist or method not supported');
    }

    // Validate request parameters
    if (endpoint) {
      const paramErrors = this.validateParameters(request, endpoint.parameters);
      errors.push(...paramErrors);
    }

    // Check rate limit (simplified implementation)
    const rateLimitRemaining = service.rateLimits.requestsPerMinute;

    return {
      valid: errors.length === 0,
      errors,
      rateLimitRemaining,
    };
  }

  /**
   * Extension module management
   */
  async installExtensionModule(
    moduleData: Omit<ExtensionModule, 'id' | 'status' | 'installationDate' | 'metrics'>
  ): Promise<string> {
    const id = `MOD_${Date.now()}`;

    // Check dependencies
    for (const depId of moduleData.dependencies) {
      const dependency = this.extensionModules.get(depId);
      if (!dependency || dependency.status !== 'installed') {
        throw new Error(`Missing dependency module: ${depId}`);
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
    if (!module) throw new Error('Module does not exist');

    // Check if other modules depend on this module
    const dependents = Array.from(this.extensionModules.values()).filter(
      m => m.dependencies.includes(moduleId) && m.status === 'installed'
    );

    if (dependents.length > 0) {
      throw new Error(`Cannot uninstall: ${dependents.length} module(s) depend on this module`);
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
    // Predefined available extension modules
    const availableModules: Omit<
      ExtensionModule,
      'id' | 'status' | 'installationDate' | 'lastUpdate' | 'metrics'
    >[] = [
      {
        name: 'Manufacturing ESG Module',
        version: '1.0.0',
        category: 'industry',
        description:
          'ESG metrics and process optimization tools designed specifically for the manufacturing industry',
        dependencies: [],
        permissions: ['manufacturing.read', 'process.write'],
        features: [
          {
            name: 'Process Carbon Footprint Tracking',
            description: 'Track carbon emissions of each process',
            enabled: true,
          },
          {
            name: 'Equipment Energy Efficiency Analysis',
            description: 'Analyze equipment energy use efficiency',
            enabled: true,
          },
          {
            name: 'Supply Chain Carbon Management',
            description: 'Manage supply chain carbon footprint',
            enabled: true,
          },
        ],
        license: { type: 'paid', expiryDate: '2026-12-31', maxUsers: 100 },
      },
      {
        name: 'EU CSRD Compliance Module',
        version: '1.0.0',
        category: 'regional',
        description:
          'Assisting in compliance with EU Corporate Sustainability Reporting Directive requirements',
        dependencies: [],
        permissions: ['reporting.eu', 'compliance.read'],
        features: [
          {
            name: 'ESRS Reporting Framework',
            description: 'Automatically generate ESRS format report',
            enabled: true,
          },
          {
            name: 'Double Materiality Assessment',
            description: 'Financial and impact dual materiality analysis',
            enabled: true,
          },
          {
            name: 'Stakeholder Engagement',
            description: 'Manage stakeholder engagement process',
            enabled: true,
          },
        ],
        license: { type: 'subscription', expiryDate: '2025-12-31' },
      },
      {
        name: 'Sustainable Supply Chain Module',
        version: '1.0.0',
        category: 'functional',
        description: 'Advanced supply chain ESG assessment and management tools',
        dependencies: [],
        permissions: ['supply_chain.read', 'supplier.write'],
        features: [
          {
            name: 'Supplier ESG Scoring',
            description: 'Automated supplier ESG assessment',
            enabled: true,
          },
          {
            name: 'Risk Heatmap',
            description: 'Visualize supply chain risk distribution',
            enabled: true,
          },
          {
            name: 'Improvement Tracking System',
            description: 'Track supplier improvement progress',
            enabled: true,
          },
          {
            name: 'Sustainable Sourcing Optimization',
            description: 'Optimize ESG factors in procurement decisions',
            enabled: true,
          },
        ],
        license: { type: 'paid', expiryDate: '2026-06-30' },
      },
    ];

    return availableModules.map(module => ({
      ...module,
      id: '', // Will be generated on installation
      status: 'available',
      metrics: { usageCount: 0, errorCount: 0 },
    }));
  }

  /**
   * System health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
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

    // Calculate overall health status
    const healthScore =
      (integrationStats.active / Math.max(integrationStats.total, 1)) * 25 +
      (externalStats.active / Math.max(externalStats.total, 1)) * 20 +
      (platformStats.supported / Math.max(platformStats.total, 1)) * 15 +
      (apiStats.active / Math.max(apiStats.total, 1)) * 20 +
      (moduleStats.installed / Math.max(moduleStats.total, 1)) * 20;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthScore >= 80) status = 'healthy';
    else if (healthScore >= 60) status = 'degraded';
    else status = 'unhealthy';

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
    // Initialize default platform support
    this.addPlatformSupport({
      platform: 'web',
      version: '1.0.0',
      supportedBrowsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
      features: [
        'Full functionality',
        'Real-time synchronization',
        'Advanced charts',
        'Batch operations',
      ],
      limitations: ['Limited offline functionality'],
      lastTested: new Date().toISOString(),
      compatibility: 'full',
    });

    this.addPlatformSupport({
      platform: 'mobile',
      version: '1.0.0',
      supportedOS: ['iOS 14+', 'Android 9+'],
      features: ['Core functions', 'Push notifications', 'Offline browsing', 'Camera integration'],
      limitations: ['Simplified chart functions', 'Restricted batch operations'],
      lastTested: new Date().toISOString(),
      compatibility: 'partial',
    });

    // Initialize default API service
    this.createAPIService({
      name: 'ESG Data API',
      version: 'v1.0',
      baseUrl: '/api/v1',
      endpoints: [
        {
          path: '/esg/metrics',
          method: 'GET',
          description: 'Retrieve ESG metric data',
          parameters: [
            { name: 'category', type: 'string', required: false, description: 'Metric category' },
            { name: 'period', type: 'string', required: false, description: 'Time range' },
          ],
          responses: {
            '200': { description: 'Successfully returned metrics data' },
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
    // Simulated connection test
    try {
      // Actual implementation would test based on integration.connectionType
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private scheduleSync(integration: SystemIntegration): void {
    // Set sync scheduler
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
    // Simulated data sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      recordsProcessed: Math.floor(Math.random() * 1000) + 100,
      errors: Math.random() > 0.8 ? ['Partial data sync failed'] : [],
    };
  }

  private async callExternalAPI(source: ExternalDataSource, dataType: string): Promise<any> {
    // Simulated external API call
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
          errors.push(`Missing required parameter: ${param.name}`);
        }
      }
    }

    return errors;
  }
}

// Export default instance
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
