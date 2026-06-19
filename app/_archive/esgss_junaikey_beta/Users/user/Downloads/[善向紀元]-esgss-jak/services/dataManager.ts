// ESG儀表板資料管理服務
export interface DataEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface DataQuery {
  filter?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
  fields?: string[];
}

export interface DataOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    operation: string;
    timestamp: number;
    duration: number;
    affectedRows?: number;
    recordsProcessed?: number;
    taskId?: string;
    message?: string;
    totalRecordsProcessed?: number;
    sourcesProcessed?: number;
    errorsCount?: number;
    dataPoints?: number;
    groupsCount?: number;
    keyId?: string;
    totalConfigs?: number;
    itemSize?: number;
    itemId?: string;
  };
}

export interface DataValidationRule {
  field: string;
  type: 'required' | 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export interface DataMigration {
  id: string;
  version: string;
  description: string;
  up: (data: any) => any;
  down: (data: any) => any;
  appliedAt?: number;
}

// 資料儲存策略
export abstract class DataStorageStrategy {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T): Promise<void>;
  abstract delete(key: string): Promise<boolean>;
  abstract clear(): Promise<void>;
  abstract keys(pattern?: string): Promise<string[]>;
  abstract exists(key: string): Promise<boolean>;
}

// 本地儲存策略
export class LocalStorageStrategy extends DataStorageStrategy {
  private prefix: string;

  constructor(prefix = 'esg_') {
    super();
    this.prefix = prefix;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage set error:', error);
      throw new Error('Failed to store data in localStorage');
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('LocalStorage delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      const allKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));

      if (pattern) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return allKeys.filter(key => regex.test(key));
      }

      return allKeys;
    } catch (error) {
      console.error('LocalStorage keys error:', error);
      return [];
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return localStorage.getItem(this.prefix + key) !== null;
    } catch (error) {
      console.error('LocalStorage exists error:', error);
      return false;
    }
  }
}

// 索引DB儲存策略
export class IndexedDBStrategy extends DataStorageStrategy {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor(dbName = 'ESGData', dbVersion = 1) {
    super();
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return this.openDB();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');

      return new Promise((resolve, reject) => {
        const request = store.put({ key, value, timestamp: Date.now() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB set error:', error);
      throw new Error('Failed to store data in IndexedDB');
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');

      return new Promise((resolve) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('IndexedDB delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB clear error:', error);
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');

      return new Promise((resolve, reject) => {
        const request = store.getAllKeys();

        request.onsuccess = () => {
          let keys = Array.from(request.result) as string[];

          if (pattern) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            keys = keys.filter(key => regex.test(key));
          }

          resolve(keys);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB keys error:', error);
      return [];
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');

      return new Promise((resolve) => {
        const request = store.getKey(key);
        request.onsuccess = () => resolve(request.result !== undefined);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('IndexedDB exists error:', error);
      return false;
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// 資料管理器主類別
export class DataManager {
  private storage: DataStorageStrategy;
  private validators = new Map<string, DataValidationRule[]>();
  private migrations: DataMigration[] = [];
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private eventListeners = new Map<string, ((data: any) => void)[]>();

  constructor(storage: DataStorageStrategy = new LocalStorageStrategy()) {
    this.storage = storage;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // 載入驗證規則
    await this.loadValidationRules();

    // 執行資料遷移
    await this.runMigrations();

    // 設定定期清理快取
    setInterval(() => this.cleanExpiredCache(), 5 * 60 * 1000); // 每5分鐘清理
  }

  // 設定資料驗證規則
  setValidationRules(entityType: string, rules: DataValidationRule[]): void {
    this.validators.set(entityType, rules);
  }

  // 驗證資料
  validateData(entityType: string, data: any): { isValid: boolean; errors: string[] } {
    const rules = this.validators.get(entityType);
    if (!rules) return { isValid: true, errors: [] };

    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];
      const fieldName = rule.field;

      // 必填檢查
      if (rule.type === 'required' && (value === undefined || value === null || value === '')) {
        errors.push(`${fieldName}為必填欄位`);
        continue;
      }

      if (value === undefined || value === null) continue;

      // 類型檢查
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${fieldName}必須是字串`);
          } else {
            if (rule.minLength && value.length < rule.minLength) {
              errors.push(`${fieldName}長度不能少於${rule.minLength}個字符`);
            }
            if (rule.maxLength && value.length > rule.maxLength) {
              errors.push(`${fieldName}長度不能超過${rule.maxLength}個字符`);
            }
            if (rule.pattern && !rule.pattern.test(value)) {
              errors.push(`${fieldName}格式不符合要求`);
            }
          }
          break;

        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`${fieldName}必須是數字`);
          } else {
            if (rule.min !== undefined && value < rule.min) {
              errors.push(`${fieldName}不能小於${rule.min}`);
            }
            if (rule.max !== undefined && value > rule.max) {
              errors.push(`${fieldName}不能大於${rule.max}`);
            }
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${fieldName}必須是布林值`);
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`${fieldName}必須是陣列`);
          }
          break;

        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`${fieldName}必須是物件`);
          }
          break;
      }

      // 自訂驗證器
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push(`${fieldName}未通過自訂驗證`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // 新增資料遷移
  addMigration(migration: DataMigration): void {
    this.migrations.push(migration);
  }

  // 儲存資料
  async save<T extends DataEntity>(
    entityType: string,
    entity: T,
    options: { validate?: boolean; cache?: boolean } = {}
  ): Promise<DataOperationResult<T>> {
    const startTime = Date.now();

    try {
      // 驗證資料
      if (options.validate !== false) {
        const validation = this.validateData(entityType, entity);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join('; '),
            metadata: {
              operation: 'save',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          };
        }
      }

      // 更新時間戳記
      entity.updatedAt = Date.now();
      entity.version = (entity.version || 0) + 1;

      // 儲存到持久化層
      const key = `${entityType}:${entity.id}`;
      await this.storage.set(key, entity);

      // 更新快取
      if (options.cache !== false) {
        this.setCache(key, entity);
      }

      // 觸發事件
      this.emitEvent(`entity:saved:${entityType}`, entity);

      return {
        success: true,
        data: entity,
        metadata: {
          operation: 'save',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '儲存失敗',
        metadata: {
          operation: 'save',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 載入資料
  async load<T extends DataEntity>(
    entityType: string,
    entityId: string,
    options: { useCache?: boolean } = {}
  ): Promise<DataOperationResult<T>> {
    const startTime = Date.now();
    const key = `${entityType}:${entityId}`;

    try {
      // 檢查快取
      if (options.useCache !== false) {
        const cached = this.getCache<T>(key);
        if (cached) {
          return {
            success: true,
            data: cached,
            metadata: {
              operation: 'load',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          };
        }
      }

      // 從儲存層載入
      const data = await this.storage.get<T>(key);

      if (!data) {
        return {
          success: false,
          error: '資料不存在',
          metadata: {
            operation: 'load',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 更新快取
      this.setCache(key, data);

      return {
        success: true,
        data,
        metadata: {
          operation: 'load',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '載入失敗',
        metadata: {
          operation: 'load',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 查詢資料
  async query<T extends DataEntity>(
    entityType: string,
    query: DataQuery = {}
  ): Promise<DataOperationResult<T[]>> {
    const startTime = Date.now();

    try {
      // 取得所有相關鍵
      const pattern = `${entityType}:*`;
      const keys = await this.storage.keys(pattern);

      const results: T[] = [];

      for (const key of keys) {
        const data = await this.storage.get<T>(key);
        if (data && this.matchesFilter(data, query.filter)) {
          results.push(data);
        }
      }

      // 排序
      if (query.sort) {
        results.sort((a, b) => {
          for (const [field, direction] of Object.entries(query.sort!)) {
            const aVal = (a as any)[field];
            const bVal = (b as any)[field];

            let comparison = 0;
            if (aVal < bVal) comparison = -1;
            if (aVal > bVal) comparison = 1;

            if (comparison !== 0) {
              return direction === 'desc' ? -comparison : comparison;
            }
          }
          return 0;
        });
      }

      // 分頁
      let paginatedResults = results;
      if (query.offset || query.limit) {
        const offset = query.offset || 0;
        const limit = query.limit || results.length;
        paginatedResults = results.slice(offset, offset + limit);
      }

      // 欄位篩選
      let finalResults = paginatedResults;
      if (query.fields) {
        finalResults = paginatedResults.map(item => {
          const filtered: any = {};
          query.fields!.forEach(field => {
            if (field in item) {
              filtered[field] = (item as any)[field];
            }
          });
          return filtered as T;
        });
      }

      return {
        success: true,
        data: finalResults,
        metadata: {
          operation: 'query',
          timestamp: startTime,
          duration: Date.now() - startTime,
          affectedRows: finalResults.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '查詢失敗',
        metadata: {
          operation: 'query',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 刪除資料
  async delete(
    entityType: string,
    entityId: string
  ): Promise<DataOperationResult<boolean>> {
    const startTime = Date.now();
    const key = `${entityType}:${entityId}`;

    try {
      const exists = await this.storage.exists(key);
      if (!exists) {
        return {
          success: false,
          error: '資料不存在',
          metadata: {
            operation: 'delete',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      await this.storage.delete(key);

      // 清除快取
      this.cache.delete(key);

      // 觸發事件
      this.emitEvent(`entity:deleted:${entityType}`, { id: entityId });

      return {
        success: true,
        data: true,
        metadata: {
          operation: 'delete',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '刪除失敗',
        metadata: {
          operation: 'delete',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 批次操作
  async batch(operation: 'save' | 'delete', entities: Array<{ type: string; id: string; data?: any }>): Promise<DataOperationResult[]> {
    const results: DataOperationResult[] = [];

    // 依序執行以保持資料一致性
    for (const entity of entities) {
      let result: DataOperationResult;

      if (operation === 'save' && entity.data) {
        result = await this.save(entity.type, entity.data);
      } else if (operation === 'delete') {
        result = await this.delete(entity.type, entity.id);
      } else {
        result = {
          success: false,
          error: '無效的批次操作'
        };
      }

      results.push(result);
    }

    return results;
  }

  // 事件監聽
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // 資料匯出
  async exportData(entityTypes?: string[]): Promise<DataOperationResult<Record<string, any>>> {
    const startTime = Date.now();

    try {
      const data: Record<string, any> = {};

      const types = entityTypes || Array.from(this.validators.keys());

      for (const entityType of types) {
        const result = await this.query(entityType);
        if (result.success && result.data) {
          data[entityType] = result.data;
        }
      }

      return {
        success: true,
        data,
        metadata: {
          operation: 'export',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '匯出失敗',
        metadata: {
          operation: 'export',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 資料匯入
  async importData(data: Record<string, any[]>): Promise<DataOperationResult> {
    const startTime = Date.now();

    try {
      const results: DataOperationResult[] = [];

      for (const [entityType, entities] of Object.entries(data)) {
        for (const entity of entities) {
          const result = await this.save(entityType, entity);
          results.push(result);
        }
      }

      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      return {
        success: true,
        data: { successCount, totalCount },
        metadata: {
          operation: 'import',
          timestamp: startTime,
          duration: Date.now() - startTime,
          affectedRows: successCount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '匯入失敗',
        metadata: {
          operation: 'import',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  private matchesFilter(data: any, filter?: Record<string, any>): boolean {
    if (!filter) return true;

    for (const [key, value] of Object.entries(filter)) {
      const dataValue = data[key];

      if (typeof value === 'object' && value !== null) {
        // 複雜查詢條件
        if ('$gt' in value && !(dataValue > value.$gt)) return false;
        if ('$gte' in value && !(dataValue >= value.$gte)) return false;
        if ('$lt' in value && !(dataValue < value.$lt)) return false;
        if ('$lte' in value && !(dataValue <= value.$lte)) return false;
        if ('$in' in value && !value.$in.includes(dataValue)) return false;
        if ('$nin' in value && value.$nin.includes(dataValue)) return false;
        if ('$regex' in value && !value.$regex.test(dataValue)) return false;
      } else if (dataValue !== value) {
        return false;
      }
    }

    return true;
  }

  private setCache(key: string, data: any, ttl = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache<T>(key: string): T | null {
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

  private emitEvent(event: string, data: any): void {
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
  }

  private async loadValidationRules(): Promise<void> {
    // 載入預設驗證規則
    this.setValidationRules('user', [
      { field: 'id', type: 'required' },
      { field: 'email', type: 'required' },
      { field: 'email', type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { field: 'name', type: 'string', minLength: 2, maxLength: 100 }
    ]);

    this.setValidationRules('card', [
      { field: 'id', type: 'required' },
      { field: 'title', type: 'required' },
      { field: 'type', type: 'required' },
      { field: 'content', type: 'required' }
    ]);
  }

  private async runMigrations(): Promise<void> {
    // 資料遷移邏輯
    // 檢查哪些遷移已經執行過，執行尚未執行的遷移
  }

  // 關閉服務
  async close(): Promise<void> {
    if (this.storage instanceof IndexedDBStrategy) {
      this.storage.close();
    }
  }
}

// 全域實例
export const dataManager = new DataManager();

// React Hook
export const useDataManager = () => {
  return {
    save: dataManager.save.bind(dataManager),
    load: dataManager.load.bind(dataManager),
    query: dataManager.query.bind(dataManager),
    delete: dataManager.delete.bind(dataManager),
    batch: dataManager.batch.bind(dataManager),
    exportData: dataManager.exportData.bind(dataManager),
    importData: dataManager.importData.bind(dataManager),
    on: dataManager.on.bind(dataManager),
    off: dataManager.off.bind(dataManager)
  };
};