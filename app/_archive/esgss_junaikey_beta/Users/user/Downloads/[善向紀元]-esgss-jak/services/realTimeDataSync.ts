// 實時數據同步服務 - M1核心數據管理模組
import { DataOperationResult } from './dataManager';
import { esgDataCollector } from './esgDataCollector';

// 連接狀態
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// 同步模式
export enum SyncMode {
  FULL = 'full',           // 完全同步
  INCREMENTAL = 'incremental', // 增量同步
  SNAPSHOT = 'snapshot',   // 快照同步
  STREAM = 'stream'        // 流式同步
}

// 同步任務
export interface SyncTask {
  id: string;
  dataSourceId: string;
  mode: SyncMode;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: number;
  endTime?: number;
  recordsProcessed: number;
  bytesTransferred: number;
  lastSyncPoint?: any;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

// 數據衝突
export interface DataConflict {
  id: string;
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: number;
  resolution?: 'local' | 'remote' | 'merge' | 'manual';
  resolvedAt?: number;
}

// 同步配置
export interface SyncConfig {
  id: string;
  dataSourceId: string;
  enabled: boolean;
  mode: SyncMode;
  interval: number; // 同步間隔（毫秒）
  batchSize: number; // 批量大小
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    exponentialBackoff: boolean;
  };
  conflictResolution: 'local_wins' | 'remote_wins' | 'manual' | 'merge';
  filters?: Record<string, any>; // 數據過濾條件
  transformation?: (data: any) => any; // 數據轉換函數
}

// 同步統計
export interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalRecordsProcessed: number;
  totalBytesTransferred: number;
  averageSyncTime: number;
  lastSyncTime?: number;
  uptime: number;
  connectionQuality: number; // 0-100
}

// 實時數據同步服務主類
export class RealTimeDataSync {
  private static instance: RealTimeDataSync;
  private webSocket: WebSocket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private syncConfigs: Map<string, SyncConfig> = new Map();
  private activeTasks: Map<string, SyncTask> = new Map();
  private dataQueue: Array<{ data: any; configId: string; timestamp: number }> = [];
  private conflicts: Map<string, DataConflict[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1秒
  private heartbeatInterval?: NodeJS.Timeout;
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();

  // 統計信息
  private stats: SyncStats = {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    totalRecordsProcessed: 0,
    totalBytesTransferred: 0,
    averageSyncTime: 0,
    uptime: 0,
    connectionQuality: 0
  };

  private startTime = Date.now();

  private constructor() {
    this.initializeDefaultConfigs();
    this.startHeartbeat();
  }

  static getInstance(): RealTimeDataSync {
    if (!RealTimeDataSync.instance) {
      RealTimeDataSync.instance = new RealTimeDataSync();
    }
    return RealTimeDataSync.instance;
  }

  // 連接WebSocket
  async connect(url: string, options: {
    protocols?: string[];
    headers?: Record<string, string>;
    timeout?: number;
  } = {}): Promise<DataOperationResult<boolean>> {
    const startTime = Date.now();
    const { protocols, headers, timeout = 10000 } = options;

    if (this.connectionState === ConnectionState.CONNECTED) {
      return {
        success: true,
        data: true,
        metadata: {
          operation: 'connect',
          timestamp: startTime,
          duration: Date.now() - startTime,
          message: 'Already connected'
        }
      };
    }

    this.connectionState = ConnectionState.CONNECTING;

    try {
      return await new Promise((resolve) => {
        const ws = new WebSocket(url, protocols);
        this.webSocket = ws;

        const connectionTimeout = setTimeout(() => {
          ws.close();
          this.connectionState = ConnectionState.ERROR;
          resolve({
            success: false,
            error: 'Connection timeout',
            metadata: {
              operation: 'connect',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          });
        }, timeout);

        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          this.connectionState = ConnectionState.CONNECTED;
          this.reconnectAttempts = 0;
          this.notifySubscribers('connected', { url });

          // 啟動同步任務
          this.startScheduledSyncs();

          resolve({
            success: true,
            data: true,
            metadata: {
              operation: 'connect',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          });
        };

        ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        ws.onclose = (event) => {
          this.handleDisconnect(event.code, event.reason);
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          this.connectionState = ConnectionState.ERROR;
          console.error('WebSocket connection error:', error);
          resolve({
            success: false,
            error: 'WebSocket connection failed',
            metadata: {
              operation: 'connect',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          });
        };
      });
    } catch (error) {
      this.connectionState = ConnectionState.ERROR;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        metadata: {
          operation: 'connect',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 斷開連接
  disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close(1000, 'Client disconnect');
      this.webSocket = null;
    }

    this.connectionState = ConnectionState.DISCONNECTED;
    this.stopScheduledSyncs();
    this.notifySubscribers('disconnected', {});
  }

  // 配置同步任務
  configureSync(config: SyncConfig): DataOperationResult<SyncConfig> {
    const startTime = Date.now();

    try {
      // 驗證配置
      const validation = this.validateSyncConfig(config);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join('; '),
          metadata: {
            operation: 'configure_sync',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      this.syncConfigs.set(config.id, config);

      // 如果已連接且配置啟用，立即啟動同步
      if (this.connectionState === ConnectionState.CONNECTED && config.enabled) {
        this.startSyncForConfig(config.id);
      }

      return {
        success: true,
        data: config,
        metadata: {
          operation: 'configure_sync',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Configuration failed',
        metadata: {
          operation: 'configure_sync',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 手動觸發同步
  async triggerSync(configId: string, options: {
    mode?: SyncMode;
    force?: boolean;
  } = {}): Promise<DataOperationResult<SyncTask>> {
    const config = this.syncConfigs.get(configId);
    if (!config) {
      return {
        success: false,
        error: 'Sync configuration not found',
        metadata: {
          operation: 'trigger_sync',
          timestamp: Date.now(),
          duration: 0
        }
      };
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: SyncTask = {
      id: taskId,
      dataSourceId: config.dataSourceId,
      mode: options.mode || config.mode,
      status: 'running',
      startTime: Date.now(),
      recordsProcessed: 0,
      bytesTransferred: 0,
      retryCount: 0,
      maxRetries: config.retryPolicy.maxRetries
    };

    this.activeTasks.set(taskId, task);

    try {
      const result = await this.executeSyncTask(task, config, options.force);

      task.endTime = Date.now();
      task.status = result.success ? 'completed' : 'failed';
      task.recordsProcessed = result.recordsProcessed || 0;
      task.bytesTransferred = result.bytesTransferred || 0;

      if (!result.success) {
        task.error = result.error;
      }

      this.activeTasks.set(taskId, task);
      this.updateStats(task);

      return {
        success: result.success,
        data: task,
        error: result.error,
        metadata: {
          operation: 'trigger_sync',
          timestamp: task.startTime,
          duration: task.endTime - task.startTime,
          recordsProcessed: task.recordsProcessed,
          bytesTransferred: task.bytesTransferred
        }
      };
    } catch (error) {
      task.endTime = Date.now();
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Sync failed';
      this.activeTasks.set(taskId, task);

      return {
        success: false,
        error: task.error,
        data: task,
        metadata: {
          operation: 'trigger_sync',
          timestamp: task.startTime || Date.now(),
          duration: task.endTime - (task.startTime || Date.now())
        }
      };
    }
  }

  // 批量同步
  async batchSync(configIds: string[]): Promise<DataOperationResult<SyncTask[]>> {
    const startTime = Date.now();
    const results: SyncTask[] = [];
    const errors: string[] = [];

    // 並行執行同步任務
    const promises = configIds.map(async (configId) => {
      const result = await this.triggerSync(configId);
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        errors.push(`${configId}: ${result.error}`);
      }
    });

    await Promise.allSettled(promises);

    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      metadata: {
        operation: 'batch_sync',
        timestamp: startTime,
        duration: Date.now() - startTime,
        totalConfigs: configIds.length,
        successfulSyncs: results.length,
        failedSyncs: errors.length
      }
    };
  }

  // 處理數據衝突
  resolveConflict(conflictId: string, resolution: DataConflict['resolution']): boolean {
    const conflicts = this.conflicts.get(conflictId);
    if (!conflicts) return false;

    conflicts.forEach(conflict => {
      if (conflict.id === conflictId) {
        conflict.resolution = resolution;
        conflict.resolvedAt = Date.now();
      }
    });

    this.notifySubscribers('conflict_resolved', { conflictId, resolution });
    return true;
  }

  // 獲取同步統計
  getSyncStats(): SyncStats {
    return {
      ...this.stats,
      uptime: Date.now() - this.startTime,
      connectionQuality: this.calculateConnectionQuality()
    };
  }

  // 獲取活躍任務
  getActiveTasks(): SyncTask[] {
    return Array.from(this.activeTasks.values()).filter(
      task => task.status === 'running' || task.status === 'pending'
    );
  }

  // 獲取數據衝突
  getConflicts(dataSourceId?: string): DataConflict[] {
    if (dataSourceId) {
      return this.conflicts.get(dataSourceId) || [];
    }

    const allConflicts: DataConflict[] = [];
    this.conflicts.forEach(conflicts => {
      allConflicts.push(...conflicts);
    });
    return allConflicts;
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

  // 獲取連接狀態
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  // 私有方法實現

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      this.processIncomingMessage(message);
    } catch (error) {
      console.error('Failed to parse incoming message:', error);
    }
  }

  private handleDisconnect(code: number, reason: string): void {
    console.log(`WebSocket disconnected: ${code} - ${reason}`);
    this.connectionState = ConnectionState.DISCONNECTED;
    this.webSocket = null;

    // 停止所有定時同步
    this.stopScheduledSyncs();

    // 嘗試重連
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    } else {
      this.notifySubscribers('connection_failed', { code, reason });
    }
  }

  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempts++;
    this.connectionState = ConnectionState.RECONNECTING;

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      // 在實際實現中，這裡需要保存原始連接URL
      // this.connect(originalUrl);
    }, this.reconnectDelay * this.reconnectAttempts); // 指數退避
  }

  private processIncomingMessage(message: any): void {
    switch (message.type) {
      case 'data_update':
        this.handleDataUpdate(message.payload);
        break;
      case 'sync_request':
        this.handleSyncRequest(message.payload);
        break;
      case 'heartbeat_ack':
        this.handleHeartbeatAck();
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleDataUpdate(payload: any): void {
    // 將數據添加到隊列中進行處理
    this.dataQueue.push({
      data: payload.data,
      configId: payload.configId,
      timestamp: Date.now()
    });

    // 立即處理數據更新
    this.processDataQueue();

    this.notifySubscribers('data_received', payload);
  }

  private handleSyncRequest(payload: any): void {
    const config = this.syncConfigs.get(payload.configId);
    if (config) {
      this.triggerSync(payload.configId, { mode: payload.requestedMode });
    }
  }

  private handleHeartbeatAck(): void {
    // 心跳確認，更新連接質量
    this.updateConnectionQuality(100);
  }

  private async processDataQueue(): Promise<void> {
    while (this.dataQueue.length > 0) {
      const item = this.dataQueue.shift();
      if (!item) continue;

      try {
        const config = this.syncConfigs.get(item.configId);
        if (!config) continue;

        // 應用數據過濾和轉換
        let processedData = item.data;

        if (config.filters) {
          processedData = this.applyFilters(processedData, config.filters);
        }

        if (config.transformation) {
          processedData = config.transformation(processedData);
        }

        // 檢查衝突
        const conflicts = await this.detectConflicts(processedData, config);
        if (conflicts.length > 0) {
          // 存儲衝突以供手動解決
          this.conflicts.set(config.dataSourceId, conflicts);
          this.notifySubscribers('conflicts_detected', { configId: item.configId, conflicts });
          continue;
        }

        // 應用衝突解決策略
        const resolvedData = await this.applyConflictResolution(processedData, config);

        // 通過數據收集器處理數據
        await esgDataCollector.collectData(config.dataSourceId, {
          force: true,
          validate: false
        });

        this.notifySubscribers('data_processed', {
          configId: item.configId,
          recordsProcessed: Array.isArray(resolvedData) ? resolvedData.length : 1,
          timestamp: item.timestamp
        });

      } catch (error) {
        console.error('Failed to process queued data:', error);
        this.notifySubscribers('data_processing_error', {
          configId: item.configId,
          error: error instanceof Error ? error.message : 'Processing failed',
          timestamp: item.timestamp
        });
      }
    }
  }

  private applyFilters(data: any, filters: Record<string, any>): any {
    if (!Array.isArray(data)) return data;

    return data.filter(item => {
      for (const [field, condition] of Object.entries(filters)) {
        const value = item[field];
        if (!this.matchesCondition(value, condition)) {
          return false;
        }
      }
      return true;
    });
  }

  private matchesCondition(value: any, condition: any): boolean {
    if (typeof condition === 'object' && condition !== null) {
      if ('$gt' in condition && !(value > condition.$gt)) return false;
      if ('$gte' in condition && !(value >= condition.$gte)) return false;
      if ('$lt' in condition && !(value < condition.$lt)) return false;
      if ('$lte' in condition && !(value <= condition.$lte)) return false;
      if ('$in' in condition && !condition.$in.includes(value)) return false;
      if ('$nin' in condition && condition.$nin.includes(value)) return false;
      return true;
    }
    return value === condition;
  }

  private async detectConflicts(data: any, config: SyncConfig): Promise<DataConflict[]> {
    // 簡化的衝突檢測邏輯
    // 在實際實現中，需要比較本地和遠程數據
    const conflicts: DataConflict[] = [];

    // 示例：檢查時間戳衝突
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.lastModified && item.remoteLastModified) {
          if (item.lastModified !== item.remoteLastModified) {
            conflicts.push({
              id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              field: 'lastModified',
              localValue: item.lastModified,
              remoteValue: item.remoteLastModified,
              timestamp: Date.now()
            });
          }
        }
      }
    }

    return conflicts;
  }

  private async applyConflictResolution(data: any, config: SyncConfig): Promise<any> {
    // 應用配置的衝突解決策略
    switch (config.conflictResolution) {
      case 'local_wins':
        return data; // 保持本地數據
      case 'remote_wins':
        // 在實際實現中，需要獲取遠程數據
        return data;
      case 'merge':
        // 實現數據合併邏輯
        return this.mergeData(data, config);
      case 'manual':
        // 對於需要手動解決的衝突，標記但不應用
        return data;
      default:
        return data;
    }
  }

  private mergeData(data: any, config: SyncConfig): any {
    // 簡化的數據合併邏輯
    // 在實際實現中，需要更複雜的合併策略
    return data;
  }

  private async executeSyncTask(
    task: SyncTask,
    config: SyncConfig,
    force = false
  ): Promise<{ success: boolean; error?: string; recordsProcessed?: number; bytesTransferred?: number }> {
    try {
      // 根據同步模式執行不同的邏輯
      switch (task.mode) {
        case SyncMode.FULL:
          return await this.performFullSync(task, config);
        case SyncMode.INCREMENTAL:
          return await this.performIncrementalSync(task, config);
        case SyncMode.SNAPSHOT:
          return await this.performSnapshotSync(task, config);
        case SyncMode.STREAM:
          return await this.performStreamSync(task, config);
        default:
          return { success: false, error: `Unsupported sync mode: ${task.mode}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync execution failed'
      };
    }
  }

  private async performFullSync(task: SyncTask, config: SyncConfig): Promise<{ success: boolean; recordsProcessed?: number; bytesTransferred?: number }> {
    // 完全同步邏輯
    const result = await esgDataCollector.collectData(config.dataSourceId, { force: true });
    return {
      success: result.success,
      recordsProcessed: result.success ? result.metadata?.recordsProcessed : 0,
      bytesTransferred: JSON.stringify(result.data).length
    };
  }

  private async performIncrementalSync(task: SyncTask, config: SyncConfig): Promise<{ success: boolean; recordsProcessed?: number; bytesTransferred?: number }> {
    // 增量同步邏輯 - 只同步上次同步點之後的數據
    const result = await esgDataCollector.collectData(config.dataSourceId, { force: true });
    // 在實際實現中，需要實現增量查詢邏輯
    return {
      success: result.success,
      recordsProcessed: result.success ? result.metadata?.recordsProcessed : 0,
      bytesTransferred: JSON.stringify(result.data).length
    };
  }

  private async performSnapshotSync(task: SyncTask, config: SyncConfig): Promise<{ success: boolean; recordsProcessed?: number; bytesTransferred?: number }> {
    // 快照同步邏輯
    const result = await esgDataCollector.collectData(config.dataSourceId, { force: true });
    return {
      success: result.success,
      recordsProcessed: result.success ? result.metadata?.recordsProcessed : 0,
      bytesTransferred: JSON.stringify(result.data).length
    };
  }

  private async performStreamSync(task: SyncTask, config: SyncConfig): Promise<{ success: boolean; recordsProcessed?: number; bytesTransferred?: number }> {
    // 流式同步邏輯 - 保持實時連接
    // 在實際實現中，這會啟動持續的數據流
    return { success: true, recordsProcessed: 0, bytesTransferred: 0 };
  }

  private validateSyncConfig(config: SyncConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.id) errors.push('配置ID不能為空');
    if (!config.dataSourceId) errors.push('數據來源ID不能為空');
    if (config.interval <= 0) errors.push('同步間隔必須大於0');
    if (config.batchSize <= 0) errors.push('批量大小必須大於0');

    return { isValid: errors.length === 0, errors };
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.webSocket && this.connectionState === ConnectionState.CONNECTED) {
        try {
          this.webSocket.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
        } catch (error) {
          console.error('Heartbeat send failed:', error);
          this.updateConnectionQuality(0);
        }
      }
    }, 30000); // 每30秒發送心跳
  }

  private updateConnectionQuality(quality: number): void {
    // 使用指數移動平均來平滑連接質量
    const alpha = 0.1;
    this.stats.connectionQuality = (1 - alpha) * this.stats.connectionQuality + alpha * quality;
  }

  private calculateConnectionQuality(): number {
    // 基於各種因素計算連接質量
    let quality = 100;

    if (this.connectionState !== ConnectionState.CONNECTED) {
      quality = 0;
    }

    // 考慮重連嘗試
    quality -= this.reconnectAttempts * 10;

    // 考慮隊列長度
    quality -= Math.min(this.dataQueue.length * 5, 50);

    return Math.max(0, Math.min(100, quality));
  }

  private updateStats(task: SyncTask): void {
    this.stats.totalSyncs++;

    if (task.status === 'completed') {
      this.stats.successfulSyncs++;
    } else {
      this.stats.failedSyncs++;
    }

    this.stats.totalRecordsProcessed += task.recordsProcessed;
    this.stats.totalBytesTransferred += task.bytesTransferred;

    if (task.startTime && task.endTime) {
      const syncTime = task.endTime - task.startTime;
      this.stats.averageSyncTime = (this.stats.averageSyncTime + syncTime) / 2;
    }

    this.stats.lastSyncTime = task.endTime;
  }

  private startScheduledSyncs(): void {
    this.syncConfigs.forEach((config, configId) => {
      if (config.enabled) {
        this.startSyncForConfig(configId);
      }
    });
  }

  private startSyncForConfig(configId: string): void {
    const config = this.syncConfigs.get(configId);
    if (!config) return;

    const intervalId = setInterval(() => {
      this.triggerSync(configId);
    }, config.interval);

    this.syncIntervals.set(configId, intervalId);
  }

  private stopScheduledSyncs(): void {
    this.syncIntervals.forEach(interval => clearInterval(interval));
    this.syncIntervals.clear();
  }

  private initializeDefaultConfigs(): void {
    // 初始化默認同步配置
    const defaultConfigs: SyncConfig[] = [
      {
        id: 'esg_data_sync',
        dataSourceId: 'esg_api_source',
        enabled: true,
        mode: SyncMode.INCREMENTAL,
        interval: 300000, // 5分鐘
        batchSize: 100,
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          exponentialBackoff: true
        },
        conflictResolution: 'merge'
      },
      {
        id: 'sensor_data_sync',
        dataSourceId: 'sensor_source',
        enabled: true,
        mode: SyncMode.STREAM,
        interval: 60000, // 1分鐘
        batchSize: 50,
        retryPolicy: {
          maxRetries: 5,
          retryDelay: 2000,
          exponentialBackoff: true
        },
        conflictResolution: 'remote_wins'
      }
    ];

    defaultConfigs.forEach(config => {
      this.syncConfigs.set(config.id, config);
    });
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

  // 清理資源
  destroy(): void {
    this.disconnect();

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.syncConfigs.clear();
    this.activeTasks.clear();
    this.dataQueue.length = 0;
    this.conflicts.clear();
    this.subscribers.clear();
  }
}

// 導出單例實例
export const realTimeDataSync = RealTimeDataSync.getInstance();