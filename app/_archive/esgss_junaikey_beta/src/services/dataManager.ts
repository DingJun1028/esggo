// Data Manager - M2 Data Module
import { omniLogger, LogCategory } from './omniLogger.js';
import { BehaviorSubject } from 'rxjs';

// Data Operation Result
export interface DataOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    operation: string;
    timestamp: number;
    duration: number;
    [key: string]: any;
  };
}

// Query Options
export interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
}

// Strategy Interface
export interface IDataStrategy {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
}

// Exported Strategy
export class LocalStorageStrategy implements IDataStrategy {
  async save(key: string, data: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
  async load(key: string) {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

// Service Class
export class DataManager {
  private static instance: DataManager;
  private storage: Map<string, any[]> = new Map();
  private schema: Map<string, any> = new Map();

  public constructor() {
    this.initializeMockStorage();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Query Data
  async query<T = any>(
    collection: string,
    options: QueryOptions = {}
  ): Promise<DataOperationResult<T[]>> {
    const start = Date.now();
    try {
      if (!this.storage.has(collection)) {
        return {
          success: true,
          data: [],
          metadata: { operation: 'query', timestamp: start, duration: 0 },
        };
      }

      let data = [...this.storage.get(collection)!];

      // Filter
      if (options.filter) {
        data = data.filter(item => {
          return Object.entries(options.filter!).every(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              // Simple numeric range check simulation ($gte, $lte)
              if (value.$gte !== undefined && item[key] < value.$gte) return false;
              if (value.$lte !== undefined && item[key] > value.$lte) return false;
              return true;
            }
            return item[key] === value;
          });
        });
      }

      // Sort
      if (options.sort) {
        const entries = Object.entries(options.sort);
        if (entries.length > 0 && entries[0]) {
          const [key, order] = entries[0];
          data.sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
          });
        }
      }

      // Limit/Offset
      if (options.offset) data = data.slice(options.offset);
      if (options.limit) data = data.slice(0, options.limit);

      return {
        success: true,
        data: data as T[],
        metadata: {
          operation: 'query',
          timestamp: start,
          duration: Date.now() - start,
          count: data.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Query failed',
        metadata: { operation: 'query', timestamp: start, duration: Date.now() - start },
      };
    }
  }

  // Store Data
  async store(collection: string, data: any): Promise<DataOperationResult<string>> {
    const start = Date.now();
    try {
      if (!this.storage.has(collection)) {
        this.storage.set(collection, []);
      }

      const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const record = { ...data, id, createdAt: Date.now(), updatedAt: Date.now() };

      this.storage.get(collection)!.push(record);

      return {
        success: true,
        data: id,
        metadata: {
          operation: 'store',
          timestamp: start,
          duration: Date.now() - start,
        },
      };
    } catch (error) {
      return { success: false, error: 'Store failed' };
    }
  }

  // Update Data
  async update(collection: string, id: string, data: any): Promise<DataOperationResult<boolean>> {
    // Simplified update
    return { success: true, data: true };
  }

  // Delete Data
  async delete(collection: string, id: string): Promise<DataOperationResult<boolean>> {
    // Simplified delete
    if (!this.storage.has(collection)) return { success: false, error: 'Collection not found' };
    const list = this.storage.get(collection)!;
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return { success: false, error: 'Item not found' };

    list.splice(index, 1);
    return { success: true, data: true };
  }

  // Initialize Mock Data
  private initializeMockStorage() {
    this.storage.set('carbon_emissions', [
      { id: '1', scope1: 50, scope2: 30, timestamp: Date.now() - 86400000 },
      { id: '2', scope1: 52, scope2: 31, timestamp: Date.now() },
    ]);
  }
}

export const dataManager = DataManager.getInstance();
