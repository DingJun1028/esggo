// ESG數據收集服務 - M1核心數據管理模組
import { DataOperationResult, DataEntity } from './dataManager';
import { ESGDataValidator, esgValidator } from './esg';

// ESG數據來源類型
export enum DataSourceType {
  API = 'api',
  FILE = 'file',
  MANUAL = 'manual',
  INTEGRATION = 'integration',
  SENSOR = 'sensor'
}

// ESG數據類型
export enum ESGDataType {
  CARBON_EMISSIONS = 'carbon_emissions',
  ENERGY_CONSUMPTION = 'energy_consumption',
  WATER_USAGE = 'water_usage',
  WASTE_GENERATION = 'waste_generation',
  EMPLOYEE_DATA = 'employee_data',
  SUPPLY_CHAIN = 'supply_chain',
  FINANCIAL_METRICS = 'financial_metrics',
  GOVERNANCE_SCORES = 'governance_scores',
  STAKEHOLDER_FEEDBACK = 'stakeholder_feedback'
}

// 數據來源配置
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  url?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  frequency: number; // 收集頻率（分鐘）
  lastCollected?: number;
  isActive: boolean;
  validationRules?: any;
}

// 數據收集任務
export interface DataCollectionTask {
  id: string;
  dataSourceId: string;
  dataType: ESGDataType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: number;
  endTime?: number;
  recordsProcessed: number;
  errors: string[];
  metadata: Record<string, any>;
}

// 數據品質指標
export interface DataQualityMetrics {
  completeness: number; // 完整性 (0-100)
  accuracy: number; // 準確性 (0-100)
  consistency: number; // 一致性 (0-100)
  timeliness: number; // 及時性 (0-100)
  overallScore: number; // 整體品質評分 (0-100)
}

// 數據轉換規則
export interface DataTransformationRule {
  id: string;
  name: string;
  inputFormat: string;
  outputFormat: string;
  mapping: Record<string, string>;
  validationRules: any[];
  transformationLogic: (data: any) => any;
}

// ESG數據收集服務主類
export class ESGDataCollector {
  private static instance: ESGDataCollector;
  private dataSources: Map<string, DataSource> = new Map();
  private collectionTasks: Map<string, DataCollectionTask> = new Map();
  private transformationRules: Map<string, DataTransformationRule> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();

  // 實時同步配置
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isRealTimeEnabled = true;

  private constructor() {
    this.initializeDefaultSources();
    this.initializeDefaultTransformations();
    this.startRealTimeCollection();
  }

  static getInstance(): ESGDataCollector {
    if (!ESGDataCollector.instance) {
      ESGDataCollector.instance = new ESGDataCollector();
    }
    return ESGDataCollector.instance;
  }

  // 註冊數據來源
  async registerDataSource(source: Omit<DataSource, 'id'>): Promise<DataOperationResult<DataSource>> {
    const startTime = Date.now();

    try {
      const dataSource: DataSource = {
        id: `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...source
      };

      // 驗證數據來源
      const validation = await this.validateDataSource(dataSource);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join('; '),
          metadata: {
            operation: 'register_data_source',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      this.dataSources.set(dataSource.id, dataSource);

      // 如果是活躍的來源，啟動實時收集
      if (dataSource.isActive) {
        this.startDataSourceCollection(dataSource.id);
      }

      this.notifySubscribers('data_source_registered', dataSource);

      return {
        success: true,
        data: dataSource,
        metadata: {
          operation: 'register_data_source',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '註冊數據來源失敗',
        metadata: {
          operation: 'register_data_source',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 收集數據
  async collectData(
    dataSourceId: string,
    options: {
      dataType?: ESGDataType;
      force?: boolean;
      validate?: boolean;
    } = {}
  ): Promise<DataOperationResult<any[]>> {
    const startTime = Date.now();

    try {
      const dataSource = this.dataSources.get(dataSourceId);
      if (!dataSource) {
        return {
          success: false,
          error: '數據來源不存在',
          metadata: {
            operation: 'collect_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 檢查是否需要收集
      if (!options.force && dataSource.lastCollected) {
        const timeSinceLastCollection = Date.now() - dataSource.lastCollected;
        const collectionInterval = dataSource.frequency * 60 * 1000; // 轉換為毫秒

        if (timeSinceLastCollection < collectionInterval) {
          return {
            success: true,
            data: [],
            metadata: {
              operation: 'collect_data',
              timestamp: startTime,
              duration: Date.now() - startTime,
              message: '數據仍在有效期內，跳過收集'
            }
          };
        }
      }

      // 創建收集任務
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const task: DataCollectionTask = {
        id: taskId,
        dataSourceId,
        dataType: options.dataType || ESGDataType.CARBON_EMISSIONS,
        status: 'running',
        startTime,
        recordsProcessed: 0,
        errors: [],
        metadata: {}
      };

      this.collectionTasks.set(taskId, task);

      // 根據數據來源類型收集數據
      let rawData: any[] = [];

      switch (dataSource.type) {
        case DataSourceType.API:
          rawData = await this.collectFromAPI(dataSource);
          break;
        case DataSourceType.FILE:
          rawData = await this.collectFromFile(dataSource);
          break;
        case DataSourceType.MANUAL:
          rawData = await this.collectManualData(dataSource);
          break;
        case DataSourceType.INTEGRATION:
          rawData = await this.collectFromIntegration(dataSource);
          break;
        case DataSourceType.SENSOR:
          rawData = await this.collectFromSensor(dataSource);
          break;
        default:
          throw new Error(`不支持的數據來源類型: ${dataSource.type}`);
      }

      // 應用數據轉換
      const transformedData = await this.transformData(rawData, dataSource);

      // 驗證數據品質
      let validatedData = transformedData;
      if (options.validate !== false) {
        validatedData = await this.validateAndCleanData(transformedData, dataSource);
      }

      // 更新數據來源狀態
      dataSource.lastCollected = Date.now();
      this.dataSources.set(dataSourceId, dataSource);

      // 更新任務狀態
      task.status = 'completed';
      task.endTime = Date.now();
      task.recordsProcessed = validatedData.length;
      this.collectionTasks.set(taskId, task);

      // 通知訂閱者
      this.notifySubscribers('data_collected', {
        dataSourceId,
        dataType: task.dataType,
        data: validatedData,
        recordsProcessed: task.recordsProcessed
      });

      return {
        success: true,
        data: validatedData,
        metadata: {
          operation: 'collect_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
          recordsProcessed: validatedData.length,
          taskId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '數據收集失敗',
        metadata: {
          operation: 'collect_data',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 實時數據同步
  async syncRealTimeData(dataSourceId: string): Promise<DataOperationResult<any[]>> {
    const dataSource = this.dataSources.get(dataSourceId);
    if (!dataSource || !dataSource.isActive) {
      return {
        success: false,
        error: '數據來源不存在或未啟動',
        metadata: {
          operation: 'sync_real_time_data',
          timestamp: Date.now(),
          duration: 0
        }
      };
    }

    // 檢查數據來源是否支持實時同步
    if (dataSource.type === DataSourceType.SENSOR || dataSource.type === DataSourceType.API) {
      return this.collectData(dataSourceId, { force: true });
    }

    return {
      success: true,
      data: [],
      metadata: {
        operation: 'sync_real_time_data',
        timestamp: Date.now(),
        duration: 0,
        message: '數據來源不支持實時同步'
      }
    };
  }

  // 批量數據收集
  async collectBulkData(dataSourceIds: string[]): Promise<DataOperationResult<any[]>> {
    const startTime = Date.now();
    const results: any[] = [];
    const errors: string[] = [];

    for (const dataSourceId of dataSourceIds) {
      const result = await this.collectData(dataSourceId);
      if (result.success && result.data) {
        results.push(...result.data);
      } else if (result.error) {
        errors.push(`數據來源 ${dataSourceId}: ${result.error}`);
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      metadata: {
        operation: 'collect_bulk_data',
        timestamp: startTime,
        duration: Date.now() - startTime,
        totalRecordsProcessed: results.length,
        sourcesProcessed: dataSourceIds.length,
        errorsCount: errors.length
      }
    };
  }

  // 數據品質評估
  evaluateDataQuality(data: any[], dataType: ESGDataType): DataQualityMetrics {
    if (!data || data.length === 0) {
      return {
        completeness: 0,
        accuracy: 0,
        consistency: 0,
        timeliness: 0,
        overallScore: 0
      };
    }

    // 完整性評估
    const completeness = this.calculateCompleteness(data);

    // 準確性評估
    const accuracy = this.calculateAccuracy(data, dataType);

    // 一致性評估
    const consistency = this.calculateConsistency(data);

    // 及時性評估
    const timeliness = this.calculateTimeliness(data);

    // 整體評分
    const overallScore = (completeness * 0.3 + accuracy * 0.3 + consistency * 0.2 + timeliness * 0.2);

    return {
      completeness,
      accuracy,
      consistency,
      timeliness,
      overallScore: Math.min(100, Math.max(0, overallScore))
    };
  }

  // 事件訂閱
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  // 獲取數據來源
  getDataSource(id: string): DataSource | undefined {
    return this.dataSources.get(id);
  }

  // 獲取所有數據來源
  getAllDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  // 獲取收集任務
  getCollectionTask(id: string): DataCollectionTask | undefined {
    return this.collectionTasks.get(id);
  }

  // 獲取活躍的收集任務
  getActiveCollectionTasks(): DataCollectionTask[] {
    return Array.from(this.collectionTasks.values()).filter(
      task => task.status === 'running' || task.status === 'pending'
    );
  }

  // 私有方法實現

  private async validateDataSource(source: DataSource): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!source.name) {
      errors.push('數據來源名稱不能為空');
    }

    if (!Object.values(DataSourceType).includes(source.type)) {
      errors.push('無效的數據來源類型');
    }

    if (source.type === DataSourceType.API && !source.url) {
      errors.push('API數據來源必須提供URL');
    }

    if (source.frequency <= 0) {
      errors.push('收集頻率必須大於0');
    }

    return { isValid: errors.length === 0, errors };
  }

  private async collectFromAPI(source: DataSource): Promise<any[]> {
    if (!source.url) {
      throw new Error('API數據來源缺少URL');
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...source.headers
      };

      if (source.apiKey) {
        headers['Authorization'] = `Bearer ${source.apiKey}`;
      }

      const response = await fetch(source.url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error(`API數據收集失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  private async collectFromFile(source: DataSource): Promise<any[]> {
    // 文件收集邏輯（模擬實現）
    // 實際實現需要處理CSV、Excel等文件格式
    return [];
  }

  private async collectManualData(source: DataSource): Promise<any[]> {
    // 手動數據輸入邏輯
    return [];
  }

  private async collectFromIntegration(source: DataSource): Promise<any[]> {
    // 第三方系統整合邏輯
    return [];
  }

  private async collectFromSensor(source: DataSource): Promise<any[]> {
    // 傳感器數據收集邏輯
    // 模擬實時數據生成
    const currentTime = Date.now();
    return [{
      timestamp: currentTime,
      sensorId: source.id,
      value: Math.random() * 100,
      unit: 'metric_tons'
    }];
  }

  private async transformData(data: any[], source: DataSource): Promise<any[]> {
    if (!data || data.length === 0) return data;

    // 查找適用於此數據來源的轉換規則
    const transformationRules = Array.from(this.transformationRules.values())
      .filter(rule => rule.id.includes(source.type) || rule.id.includes('general'));

    if (transformationRules.length === 0) {
      return data; // 沒有轉換規則，直接返回原數據
    }

    // 應用轉換規則
    let transformedData = [...data];
    for (const rule of transformationRules) {
      try {
        transformedData = transformedData.map(item => rule.transformationLogic(item));
      } catch (error) {
        console.warn(`數據轉換失敗 (${rule.name}):`, error);
      }
    }

    return transformedData;
  }

  private async validateAndCleanData(data: any[], source: DataSource): Promise<any[]> {
    if (!data || data.length === 0) return data;

    const validatedData: any[] = [];

    for (const item of data) {
      try {
        // 根據數據類型應用相應的驗證邏輯
        let isValid = true;
        let cleanedItem = { ...item };

        // 通用驗證
        if (item.timestamp && typeof item.timestamp === 'string') {
          cleanedItem.timestamp = new Date(item.timestamp).getTime();
        }

        // 特定於數據來源的驗證規則
        if (source.validationRules) {
          // 應用自定義驗證規則
          // 這裡可以實現更複雜的驗證邏輯
        }

        // ESG特定驗證
        if (item.carbonEmission !== undefined) {
          const carbonValidation = esgValidator.validateCarbonData({
            scope1: item.carbonEmission,
            year: item.year || new Date().getFullYear()
          });
          isValid = carbonValidation.isValid;
        }

        if (isValid) {
          validatedData.push(cleanedItem);
        } else {
          console.warn('數據驗證失敗，跳過該記錄:', item);
        }
      } catch (error) {
        console.warn('數據清理失敗:', error);
      }
    }

    return validatedData;
  }

  private calculateCompleteness(data: any[]): number {
    if (data.length === 0) return 0;

    const sample = data[0];
    const requiredFields = Object.keys(sample);
    let totalCompleteness = 0;

    for (const item of data) {
      let itemCompleteness = 0;
      for (const field of requiredFields) {
        if (item[field] !== null && item[field] !== undefined && item[field] !== '') {
          itemCompleteness++;
        }
      }
      totalCompleteness += (itemCompleteness / requiredFields.length) * 100;
    }

    return totalCompleteness / data.length;
  }

  private calculateAccuracy(data: any[], dataType: ESGDataType): number {
    // 根據數據類型實現不同的準確性檢查
    // 這是一個簡化的實現
    let accuracyScore = 85; // 基礎準確性評分

    // 檢查數據範圍合理性
    for (const item of data) {
      if (dataType === ESGDataType.CARBON_EMISSIONS && item.value < 0) {
        accuracyScore -= 5;
      }
      if (dataType === ESGDataType.WATER_USAGE && item.value < 0) {
        accuracyScore -= 5;
      }
    }

    return Math.max(0, Math.min(100, accuracyScore));
  }

  private calculateConsistency(data: any[]): number {
    if (data.length < 2) return 100;

    // 檢查數據一致性（簡化實現）
    const sample = data[0];
    const fields = Object.keys(sample);
    let consistencyScore = 100;

    for (const field of fields) {
      const values = data.map(item => item[field]).filter(val => val !== null && val !== undefined);

      if (values.length > 1) {
        // 檢查數值型字段的變異性
        const numericValues = values.filter(val => typeof val === 'number');
        if (numericValues.length > 1) {
          const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
          const stdDev = Math.sqrt(variance);

          // 如果標準差過大，降低一致性評分
          if (stdDev > mean * 0.5) {
            consistencyScore -= 10;
          }
        }
      }
    }

    return Math.max(0, consistencyScore);
  }

  private calculateTimeliness(data: any[]): number {
    if (data.length === 0) return 0;

    let timelinessScore = 100;
    const now = Date.now();

    for (const item of data) {
      if (item.timestamp) {
        const age = now - item.timestamp;
        const ageInDays = age / (1000 * 60 * 60 * 24);

        // 如果數據超過30天，降低及時性評分
        if (ageInDays > 30) {
          timelinessScore -= (ageInDays - 30) * 0.5;
        }
      }
    }

    return Math.max(0, timelinessScore);
  }

  private notifySubscribers(event: string, data: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('事件訂閱者回調失敗:', error);
        }
      });
    }
  }

  private initializeDefaultSources(): void {
    // 初始化默認數據來源
    const defaultSources: Omit<DataSource, 'id'>[] = [
      {
        name: '企業ERP系統',
        type: DataSourceType.INTEGRATION,
        frequency: 60, // 每小時
        isActive: true,
        validationRules: {}
      },
      {
        name: '能源管理系統',
        type: DataSourceType.API,
        url: 'https://api.energy.example.com/data',
        frequency: 15, // 每15分鐘
        isActive: false,
        validationRules: {}
      },
      {
        name: '環境傳感器網路',
        type: DataSourceType.SENSOR,
        frequency: 5, // 每5分鐘
        isActive: true,
        validationRules: {}
      }
    ];

    defaultSources.forEach(source => {
      this.registerDataSource(source);
    });
  }

  private initializeDefaultTransformations(): void {
    // 初始化默認數據轉換規則
    const transformations: Omit<DataTransformationRule, 'id'>[] = [
      {
        name: '通用時間戳轉換',
        inputFormat: 'string',
        outputFormat: 'number',
        mapping: { timestamp: 'timestamp' },
        validationRules: [],
        transformationLogic: (data: any) => ({
          ...data,
          timestamp: typeof data.timestamp === 'string' ?
            new Date(data.timestamp).getTime() : data.timestamp
        })
      },
      {
        name: '碳排放單位標準化',
        inputFormat: 'any',
        outputFormat: 'metric_tons',
        mapping: { carbonEmission: 'carbon_emission' },
        validationRules: [],
        transformationLogic: (data: any) => ({
          ...data,
          carbonEmission: data.carbon_emission || data.carbonEmission || 0
        })
      }
    ];

    transformations.forEach(transformation => {
      const rule: DataTransformationRule = {
        id: `transform_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...transformation
      };
      this.transformationRules.set(rule.id, rule);
    });
  }

  private startRealTimeCollection(): void {
    if (!this.isRealTimeEnabled) return;

    // 每分鐘檢查一次需要實時同步的數據來源
    setInterval(() => {
      this.dataSources.forEach((source, id) => {
        if (source.isActive && source.frequency <= 5) { // 頻率5分鐘或更短的視為實時
          this.syncRealTimeData(id);
        }
      });
    }, 60 * 1000); // 每分鐘
  }

  private startDataSourceCollection(sourceId: string): void {
    const source = this.dataSources.get(sourceId);
    if (!source || !source.isActive) return;

    const intervalMs = source.frequency * 60 * 1000; // 轉換為毫秒
    const intervalId = setInterval(() => {
      this.collectData(sourceId);
    }, intervalMs);

    this.syncIntervals.set(sourceId, intervalId);
  }

  // 清理資源
  destroy(): void {
    this.syncIntervals.forEach(interval => clearInterval(interval));
    this.syncIntervals.clear();
    this.dataSources.clear();
    this.collectionTasks.clear();
    this.subscribers.clear();
  }
}

// 導出單例實例
export const esgDataCollector = ESGDataCollector.getInstance();