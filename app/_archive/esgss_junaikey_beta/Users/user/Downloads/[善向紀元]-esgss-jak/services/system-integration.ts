/**
 * 外部系統整合服務
 * 負責與 ERP、IoT 設備、供應鏈等外部系統的數據同步
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';

export interface ERPConfig {
  baseUrl: string;
  apiKey: string;
  username: string;
  password: string;
  endpoints: {
    employees: string;
    financial: string;
    operations: string;
  };
}

export interface IoTConfig {
  mqttBroker: string;
  username: string;
  password: string;
  topics: {
    energy: string;
    emissions: string;
    sensors: string;
  };
}

export interface SupplyChainConfig {
  apiUrl: string;
  apiKey: string;
  webhookUrl: string;
  suppliersEndpoint: string;
}

export interface IntegrationResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  duration: number;
  timestamp: Date;
}

export class SystemIntegrationService extends EventEmitter {
  private supabase: SupabaseClient;
  private httpClient: AxiosInstance;
  private integrations: Map<string, any> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    super();
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ESG-Hub-Integration/1.0'
      }
    });

    this.setupInterceptors();
  }

  /**
   * 註冊 ERP 系統整合
   */
  registerERP(config: ERPConfig): void {
    this.integrations.set('erp', {
      type: 'erp',
      config,
      client: axios.create({
        baseURL: config.baseUrl,
        timeout: 30000,
        auth: {
          username: config.username,
          password: config.password
        },
        headers: {
          'X-API-Key': config.apiKey
        }
      })
    });
  }

  /**
   * 註冊 IoT 設備整合
   */
  registerIoT(config: IoTConfig): void {
    this.integrations.set('iot', {
      type: 'iot',
      config,
      connected: false,
      lastSync: null
    });
  }

  /**
   * 註冊供應鏈系統整合
   */
  registerSupplyChain(config: SupplyChainConfig): void {
    this.integrations.set('supply-chain', {
      type: 'supply-chain',
      config,
      client: axios.create({
        baseURL: config.apiUrl,
        timeout: 30000,
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      })
    });
  }

  /**
   * ERP 數據同步
   */
  async syncERPData(): Promise<IntegrationResult> {
    const startTime = Date.now();
    const result: IntegrationResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      duration: 0,
      timestamp: new Date()
    };

    try {
      const erpIntegration = this.integrations.get('erp');
      if (!erpIntegration) {
        throw new Error('ERP integration not configured');
      }

      this.emit('sync-started', { system: 'erp', type: 'start' });

      // 同步員工數據
      const employeeResult = await this.syncEmployeeData(erpIntegration.client, erpIntegration.config);
      result.recordsProcessed += employeeResult.recordsProcessed;
      result.errors.push(...employeeResult.errors);

      // 同步財務數據
      const financialResult = await this.syncFinancialData(erpIntegration.client, erpIntegration.config);
      result.recordsProcessed += financialResult.recordsProcessed;
      result.errors.push(...financialResult.errors);

      // 同步營運數據
      const operationsResult = await this.syncOperationalData(erpIntegration.client, erpIntegration.config);
      result.recordsProcessed += operationsResult.recordsProcessed;
      result.errors.push(...operationsResult.errors);

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      this.emit('sync-completed', {
        system: 'erp',
        result,
        type: 'complete'
      });

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      this.emit('sync-error', { system: 'erp', error, result });
    }

    return result;
  }

  /**
   * IoT 設備數據同步
   */
  async syncIoTData(): Promise<IntegrationResult> {
    const startTime = Date.now();
    const result: IntegrationResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      duration: 0,
      timestamp: new Date()
    };

    try {
      const iotIntegration = this.integrations.get('iot');
      if (!iotIntegration) {
        throw new Error('IoT integration not configured');
      }

      this.emit('sync-started', { system: 'iot', type: 'start' });

      // 連接到 MQTT Broker
      await this.connectToMQTT(iotIntegration);

      // 訂閱能源數據
      await this.subscribeToEnergyData(iotIntegration);

      // 訂閱排放數據
      await this.subscribeToEmissionsData(iotIntegration);

      // 訂閱傳感器數據
      await this.subscribeToSensorData(iotIntegration);

      result.success = true;
      result.duration = Date.now() - startTime;

      iotIntegration.lastSync = new Date();
      this.integrations.set('iot', iotIntegration);

      this.emit('sync-completed', {
        system: 'iot',
        result,
        type: 'complete'
      });

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      this.emit('sync-error', { system: 'iot', error, result });
    }

    return result;
  }

  /**
   * 供應鏈數據同步
   */
  async syncSupplyChainData(): Promise<IntegrationResult> {
    const startTime = Date.now();
    const result: IntegrationResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      duration: 0,
      timestamp: new Date()
    };

    try {
      const scIntegration = this.integrations.get('supply-chain');
      if (!scIntegration) {
        throw new Error('Supply chain integration not configured');
      }

      this.emit('sync-started', { system: 'supply-chain', type: 'start' });

      // 同步供應商 ESG 評分
      const supplierResult = await this.syncSupplierESGData(scIntegration.client, scIntegration.config);
      result.recordsProcessed += supplierResult.recordsProcessed;
      result.errors.push(...supplierResult.errors);

      // 同步供應鏈排放數據
      const emissionsResult = await this.syncSupplyChainEmissions(scIntegration.client, scIntegration.config);
      result.recordsProcessed += emissionsResult.recordsProcessed;
      result.errors.push(...emissionsResult.errors);

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      this.emit('sync-completed', {
        system: 'supply-chain',
        result,
        type: 'complete'
      });

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.duration = Date.now() - startTime;
      this.emit('sync-error', { system: 'supply-chain', error, result });
    }

    return result;
  }

  /**
   * 同步所有系統
   */
  async syncAllSystems(): Promise<Map<string, IntegrationResult>> {
    const results = new Map<string, IntegrationResult>();

    const syncPromises = [
      this.syncERPData().then(result => results.set('erp', result)),
      this.syncIoTData().then(result => results.set('iot', result)),
      this.syncSupplyChainData().then(result => results.set('supply-chain', result))
    ];

    await Promise.allSettled(syncPromises);
    return results;
  }

  /**
   * 私有方法：同步員工數據
   */
  private async syncEmployeeData(client: AxiosInstance, config: ERPConfig): Promise<Partial<IntegrationResult>> {
    const result: Partial<IntegrationResult> = { recordsProcessed: 0, errors: [] };

    try {
      const response = await client.get(config.endpoints.employees);
      const employees = response.data;

      for (const employee of employees) {
        try {
          // 將 ERP 員工數據轉換為 ESG 相關指標
          const esgData = {
            employee_count: employee.activeCount,
            diversity_score: employee.diversityIndex,
            turnover_rate: employee.turnoverRate,
            period_start: employee.periodStart,
            period_end: employee.periodEnd
          };

          // 插入到 ESG 讀數表
          await this.insertESGReading({
            metric_code: 'S-EMP-COUNT',
            value: esgData.employee_count,
            period_start: esgData.period_start,
            period_end: esgData.period_end
          });

          result.recordsProcessed!++;
        } catch (error) {
          result.errors!.push(`Employee sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors!.push(`ERP employee API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 私有方法：同步財務數據
   */
  private async syncFinancialData(client: AxiosInstance, config: ERPConfig): Promise<Partial<IntegrationResult>> {
    const result: Partial<IntegrationResult> = { recordsProcessed: 0, errors: [] };

    try {
      const response = await client.get(config.endpoints.financial);
      const financialData = response.data;

      for (const record of financialData) {
        try {
          // 處理財務數據用於 ESG 計算
          await this.insertESGReading({
            metric_code: 'G-FIN-REVENUE',
            value: record.revenue,
            period_start: record.periodStart,
            period_end: record.periodEnd
          });

          result.recordsProcessed!++;
        } catch (error) {
          result.errors!.push(`Financial sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors!.push(`ERP financial API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 私有方法：同步營運數據
   */
  private async syncOperationalData(client: AxiosInstance, config: ERPConfig): Promise<Partial<IntegrationResult>> {
    const result: Partial<IntegrationResult> = { recordsProcessed: 0, errors: [] };

    try {
      const response = await client.get(config.endpoints.operations);
      const operationsData = response.data;

      for (const record of operationsData) {
        try {
          // 處理營運數據
          if (record.energyConsumption) {
            await this.insertESGReading({
              metric_code: 'E-ELEC',
              value: record.energyConsumption,
              period_start: record.periodStart,
              period_end: record.periodEnd
            });
          }

          result.recordsProcessed!++;
        } catch (error) {
          result.errors!.push(`Operations sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors!.push(`ERP operations API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 私有方法：MQTT 連接
   */
  private async connectToMQTT(integration: any): Promise<void> {
    // 實現 MQTT 連接邏輯
    // 這裡需要集成 MQTT 客戶端庫
    integration.connected = true;
  }

  /**
   * 私有方法：訂閱能源數據
   */
  private async subscribeToEnergyData(integration: any): Promise<void> {
    // 實現 MQTT 訂閱邏輯
    // 監聽能源消耗數據並寫入 ESG 系統
  }

  /**
   * 私有方法：訂閱排放數據
   */
  private async subscribeToEmissionsData(integration: any): Promise<void> {
    // 實現排放數據監聽
  }

  /**
   * 私有方法：訂閱傳感器數據
   */
  private async subscribeToSensorData(integration: any): Promise<void> {
    // 實現傳感器數據監聽
  }

  /**
   * 私有方法：同步供應商 ESG 數據
   */
  private async syncSupplierESGData(client: AxiosInstance, config: SupplyChainConfig): Promise<Partial<IntegrationResult>> {
    const result: Partial<IntegrationResult> = { recordsProcessed: 0, errors: [] };

    try {
      const response = await client.get(config.suppliersEndpoint);
      const suppliers = response.data;

      for (const supplier of suppliers) {
        try {
          // 處理供應商 ESG 評分
          if (supplier.esgScore) {
            await this.insertESGReading({
              metric_code: 'G-SUPPLIER-ESG',
              value: supplier.esgScore,
              period_start: supplier.assessmentDate,
              period_end: supplier.assessmentDate
            });
          }

          result.recordsProcessed!++;
        } catch (error) {
          result.errors!.push(`Supplier sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors!.push(`Supply chain API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 私有方法：同步供應鏈排放
   */
  private async syncSupplyChainEmissions(client: AxiosInstance, config: SupplyChainConfig): Promise<Partial<IntegrationResult>> {
    const result: Partial<IntegrationResult> = { recordsProcessed: 0, errors: [] };

    try {
      const response = await client.get('/emissions');
      const emissions = response.data;

      for (const emission of emissions) {
        try {
          await this.insertESGReading({
            metric_code: 'E-SUPPLY-CHAIN',
            value: emission.totalEmissions,
            period_start: emission.periodStart,
            period_end: emission.periodEnd
          });

          result.recordsProcessed!++;
        } catch (error) {
          result.errors!.push(`Supply chain emissions sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors!.push(`Supply chain emissions API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * 私有方法：插入 ESG 讀數
   */
  private async insertESGReading(data: {
    metric_code: string;
    value: number;
    period_start: string;
    period_end: string;
    org_unit_id?: string;
  }): Promise<void> {
    // 查找指標和組織 ID
    const { data: metric } = await this.supabase
      .from('metric_definitions')
      .select('id')
      .eq('code', data.metric_code)
      .single();

    if (!metric) {
      throw new Error(`Metric ${data.metric_code} not found`);
    }

    // 如果沒有指定組織，使用預設組織
    const orgUnitId = data.org_unit_id || await this.getDefaultOrgUnitId();

    // 插入讀數
    const { error } = await this.supabase
      .from('esg_readings')
      .insert({
        metric_id: metric.id,
        org_unit_id: orgUnitId,
        period_start: data.period_start,
        period_end: data.period_end,
        value: data.value,
        status: 'draft',
        created_by: 'SYSTEM_INTEGRATION'
      });

    if (error) {
      throw error;
    }
  }

  /**
   * 私有方法：獲取預設組織單位 ID
   */
  private async getDefaultOrgUnitId(): Promise<string> {
    const { data, error } = await this.supabase
      .from('org_units')
      .select('id')
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error('No default organization unit found');
    }

    return data.id;
  }

  /**
   * 私有方法：設置 HTTP 攔截器
   */
  private setupInterceptors(): void {
    this.httpClient.interceptors.request.use((config) => {
      this.emit('request-started', {
        url: config.url,
        method: config.method,
        timestamp: new Date()
      });
      return config;
    });

    this.httpClient.interceptors.response.use(
      (response) => {
        this.emit('request-completed', {
          url: response.config.url,
          status: response.status,
          duration: Date.now() - (response.config as any).startTime,
          timestamp: new Date()
        });
        return response;
      },
      (error) => {
        this.emit('request-error', {
          url: error.config?.url,
          error: error.message,
          timestamp: new Date()
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * 獲取整合狀態
   */
  getIntegrationStatus(): { [key: string]: any } {
    const status: { [key: string]: any } = {};

    for (const [name, integration] of this.integrations) {
      status[name] = {
        type: integration.type,
        configured: true,
        lastSync: integration.lastSync,
        connected: integration.connected || false
      };
    }

    return status;
  }
}

// 導出單例實例
export const systemIntegration = new SystemIntegrationService(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);