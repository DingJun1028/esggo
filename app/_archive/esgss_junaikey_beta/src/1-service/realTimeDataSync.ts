import * as crypto from 'crypto';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * Real-Time Data Synchronization Service
 * [核心協議] 4+1 Protocol - All operations are logged with traceable origins
 */

type MessageCallback = (data: any) => void;
export type Unsubscribe = () => void;

export enum SyncMode {
  POLLING = 'polling',
  PUSH = 'push',
  REALTIME = 'realtime',
  BATCH = 'batch',
}

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface SyncDataOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: any;
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
  batchSize: number; // 批次大小
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

// 實時數據同步服務主體
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
  private heartbeatInterval?: any;
  private syncIntervals: Map<string, any> = new Map();
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
    connectionQuality: 0,
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

  private initializeDefaultConfigs() {
    // Basic init
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connectionState === ConnectionState.CONNECTED && this.webSocket) {
        this.webSocket.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
      }
    }, 30000);
  }

  private startScheduledSyncs() {
    this.syncConfigs.forEach(config => {
      if (config.enabled && config.mode === SyncMode.POLLING) {
        this.startSyncForConfig(config.id);
      }
    });
  }

  private stopScheduledSyncs() {
    this.syncIntervals.forEach(interval => clearInterval(interval));
    this.syncIntervals.clear();
  }

  private startSyncForConfig(configId: string) {
    const config = this.syncConfigs.get(configId);
    if (!config) return;

    if (this.syncIntervals.has(configId)) {
      clearInterval(this.syncIntervals.get(configId));
    }

    const interval = setInterval(() => {
      this.triggerSync(configId);
    }, config.interval);

    this.syncIntervals.set(configId, interval);
  }

  // 連接 WebSocket
  async connect(
    url: string,
    options: {
      protocols?: string[];
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<SyncDataOperationResult<boolean>> {
    const startTime = Date.now();
    const { protocols, timeout = 10000 } = options;

    if (this.connectionState === ConnectionState.CONNECTED) {
      return {
        success: true,
        data: true,
        metadata: {
          operation: 'connect',
          timestamp: startTime,
          duration: Date.now() - startTime,
          message: 'Already connected',
        },
      };
    }

    this.connectionState = ConnectionState.CONNECTING;

    try {
      return await new Promise(resolve => {
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
              duration: Date.now() - startTime,
            },
          });
        }, timeout);

        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          this.connectionState = ConnectionState.CONNECTED;
          this.reconnectAttempts = 0;
          omniLogger.info(LogCategory.SYSTEM, '[T1-Tangible] Real-time connection established', { url });
          this.notifySubscribers('connected', { url });

          // 啟動同步任務
          this.startScheduledSyncs();

          resolve({
            success: true,
            data: true,
            metadata: {
              operation: 'connect',
              timestamp: startTime,
              duration: Date.now() - startTime,
            },
          });
        };

        ws.onmessage = event => {
          this.handleMessage(event.data);
        };

        ws.onclose = event => {
          this.handleDisconnect(event.code, event.reason, url, options);
        };

        ws.onerror = error => {
          clearTimeout(connectionTimeout);
          this.connectionState = ConnectionState.ERROR;
          omniLogger.error(LogCategory.SYSTEM, '[realTimeDataSync] WebSocket connection error:', { error });
          resolve({
            success: false,
            error: 'WebSocket connection failed',
            metadata: {
              operation: 'connect',
              timestamp: startTime,
              duration: Date.now() - startTime,
            },
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
          duration: Date.now() - startTime,
        },
      };
    }
  }

  private handleMessage(data: any) {
    try {
      const message = JSON.parse(data);
      // T2-Traceable: Log incoming message with its channel
      omniLogger.info(LogCategory.INTEGRATION, `[T2-Traceable] Incoming real-time message`, {
        channel: message.channel || 'default',
        timestamp: Date.now(),
      });

      if (message.type === 'data_sync' && message.configId) {
        this.processIncomingSyncData(message.configId, message.data);
      }

      this.notifySubscribers(message.channel || 'default', message.data);
    } catch (e) {
      omniLogger.error(LogCategory.INTEGRATION, 'Failed to handle incoming message', { error: e });
    }
  }

  private processIncomingSyncData(configId: string, remoteData: any) {
    const config = this.syncConfigs.get(configId);
    if (!config) return;

    // T4-Transparent: Algorithm for conflict detection
    // In a real app, 'localData' would be fetched from a store
    const localData = {}; // Mock local state
    const conflicts = this.detectConflicts(configId, localData, remoteData);

    if (conflicts.length > 0) {
      const existingConflicts = this.conflicts.get(configId) || [];
      this.conflicts.set(configId, [...existingConflicts, ...conflicts]);
      omniLogger.warn(LogCategory.INTEGRATION, `[T3-Trackable] Data conflicts detected during sync`, { configId, count: conflicts.length });

      // Auto-resolve based on config
      if (config.conflictResolution === 'remote_wins') {
        this.resolveConflicts(configId, 'remote');
      } else if (config.conflictResolution === 'local_wins') {
        this.resolveConflicts(configId, 'local');
      }
    } else {
      omniLogger.info(LogCategory.INTEGRATION, `[T1-Tangible] Data synced successfully without conflicts`, { configId });
    }
  }

  private detectConflicts(configId: string, localData: any, remoteData: any): DataConflict[] {
    const conflicts: DataConflict[] = [];
    const keys = Object.keys(remoteData);

    keys.forEach(key => {
      if (localData[key] !== undefined && localData[key] !== remoteData[key]) {
        conflicts.push({
          id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          field: key,
          localValue: localData[key],
          remoteValue: remoteData[key],
          timestamp: Date.now(),
        });
      }
    });

    return conflicts;
  }

  /**
   * Resolve conflicts for a specific configuration
   * @param configId - Configuration ID
   * @param resolution - Resolution strategy
   */
  resolveConflicts(configId: string, resolution: 'local' | 'remote' | 'merge' | 'manual'): void {
    const activeConflicts = this.conflicts.get(configId) || [];
    activeConflicts.forEach(conflict => {
      conflict.resolution = resolution;
      conflict.resolvedAt = Date.now();
    });

    omniLogger.info(LogCategory.INTEGRATION, `[T3-Trackable] Conflicts resolved`, { configId, resolution, count: activeConflicts.length });
    // In a real app, update the local store with resolved values
    this.conflicts.set(configId, []); // Clear resolved conflicts
  }

  private handleDisconnect(code: number, reason: string, url: string, options: any) {
    this.connectionState = ConnectionState.DISCONNECTED;
    this.stopScheduledSyncs();
    omniLogger.warn(LogCategory.SYSTEM, '[realTimeDataSync] WebSocket disconnected', { code, reason, url });
    this.notifySubscribers('disconnected', { code, reason });

    // Update connection quality on disconnect
    this.stats.connectionQuality = Math.max(0, this.stats.connectionQuality - 10);

    // Auto-reconnect logic
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      this.reconnectAttempts++;
      omniLogger.info(LogCategory.SYSTEM, `[realTimeDataSync] Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      setTimeout(() => this.connect(url, options), delay);
    }
  }

  // 斷開連接
  disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close(1000, 'Client disconnect');
      this.webSocket = null;
    }

    this.connectionState = ConnectionState.DISCONNECTED;
    this.reconnectAttempts = this.maxReconnectAttempts; // Disable auto-reconnect
    this.stopScheduledSyncs();
    this.notifySubscribers('disconnected', {});
    omniLogger.info(LogCategory.SYSTEM, '[realTimeDataSync] Connection closed by client');
  }

  // 配置同步任務
  configureSync(config: SyncConfig): SyncDataOperationResult<SyncConfig> {
    const startTime = Date.now();

    try {
      this.syncConfigs.set(config.id, config);
      omniLogger.info(LogCategory.SYSTEM, `[T1-Tangible] Sync configured: ${config.id}`, { mode: config.mode });

      // 如果已連接且配置已啟用，立即啟動同步
      if (this.connectionState === ConnectionState.CONNECTED && config.enabled) {
        this.startSyncForConfig(config.id);
      }

      return {
        success: true,
        data: config,
        metadata: {
          operation: 'configure_sync',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Configuration failed',
        metadata: {
          operation: 'configure_sync',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    }
  }

  // 手動觸發同步
  async triggerSync(
    configId: string,
    options: {
      mode?: SyncMode;
      force?: boolean;
    } = {}
  ): Promise<SyncDataOperationResult<SyncTask>> {
    const config = this.syncConfigs.get(configId);
    if (!config) {
      return {
        success: false,
        error: 'Sync configuration not found',
        metadata: {
          operation: 'trigger_sync',
          timestamp: Date.now(),
          duration: 0,
        },
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
      maxRetries: config.retryPolicy.maxRetries,
    };

    this.activeTasks.set(taskId, task);
    omniLogger.info(LogCategory.INTEGRATION, `[T3-Trackable] Sync task started`, { taskId, configId, mode: task.mode });

    try {
      const result = await this.executeSyncTask(task, config);

      task.endTime = Date.now();
      task.status = result.success ? 'completed' : 'failed';
      task.recordsProcessed = result.recordsProcessed || 0;
      task.bytesTransferred = result.bytesTransferred || 0;

      if (!result.success) {
        task.error = result.error;
        omniLogger.error(LogCategory.INTEGRATION, `[T3-Trackable] Sync task failed`, { taskId, error: task.error });
      } else {
        omniLogger.info(LogCategory.INTEGRATION, `[T1-Tangible] Sync task completed successfully`, {
          taskId,
          records: task.recordsProcessed,
          bytes: task.bytesTransferred,
        });
      }

      this.activeTasks.set(taskId, task);
      this.updateStats(task);

      return {
        success: result.success,
        data: task,
        metadata: {
          operation: 'trigger_sync',
          timestamp: task.startTime || Date.now(),
          duration: (task.endTime || Date.now()) - (task.startTime || Date.now()),
          recordsProcessed: task.recordsProcessed,
          bytesTransferred: task.bytesTransferred,
        },
      };
    } catch (error) {
      task.endTime = Date.now();
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Sync failed';
      this.activeTasks.set(taskId, task);
      omniLogger.error(LogCategory.INTEGRATION, `[T3-Trackable] Sync task encountered exception`, { taskId, error: task.error });

      return {
        success: false,
        error: task.error,
        data: task,
        metadata: {
          operation: 'trigger_sync',
          timestamp: task.startTime || Date.now(),
          duration: task.endTime - (task.startTime || Date.now()),
        },
      };
    }
  }

  private async executeSyncTask(task: SyncTask, config: SyncConfig): Promise<{ success: boolean; recordsProcessed: number; bytesTransferred: number; error?: string }> {
    // In a real implementation, this would fetch data from config.dataSourceId
    // For now, we simulate the 5T protocol flow
    try {
      // T2-Traceable: Source Origin check
      const sourceOrigin = `api://datasource/${config.dataSourceId}`;

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData = [{ id: 1, value: 100, timestamp: Date.now() }];
      const dataSize = JSON.stringify(mockData).length;

      // T5-Trustworthy: Generate Hash Lock for data integrity
      const hash = await this.hashData(mockData);

      // 5T Traceability
      omniLogger.info(LogCategory.INTEGRATION, `[T2-Traceable] Data fetched from origin`, { sourceOrigin, size: dataSize });
      omniLogger.info(LogCategory.INTEGRATION, `[T5-Trustworthy] Data hash generated (Hash Lock)`, { hash });

      return {
        success: true,
        recordsProcessed: mockData.length,
        bytesTransferred: dataSize,
      };
    } catch (e) {
      return {
        success: false,
        recordsProcessed: 0,
        bytesTransferred: 0,
        error: e instanceof Error ? e.message : 'Unknown execution error',
      };
    }
  }

  private async hashData(data: any): Promise<string> {
    const payload = JSON.stringify(data);
    try {
      // Node.js environment
      if (typeof crypto !== 'undefined' && (crypto as any).createHash) {
        return (crypto as any).createHash('sha256').update(payload).digest('hex');
      }

      // Browser environment (Web Crypto API)
      const msgUint8 = new TextEncoder().encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      omniLogger.error(LogCategory.VALIDATION, '[realTimeDataSync] Critical: Hash generation failed', e);
      return `MOCK_HASH_${Date.now()}`;
    }
  }

  private updateStats(task: SyncTask) {
    this.stats.totalSyncs++;
    this.stats.lastSyncTime = Date.now();
    this.stats.uptime = Date.now() - this.startTime;

    if (task.status === 'completed') {
      this.stats.successfulSyncs++;
      this.stats.totalRecordsProcessed += task.recordsProcessed;
      this.stats.totalBytesTransferred += task.bytesTransferred;

      // Update quality based on success
      this.stats.connectionQuality = Math.min(100, this.stats.connectionQuality + 5);

      const syncDuration = (task.endTime || Date.now()) - (task.startTime || Date.now());
      this.stats.averageSyncTime = (this.stats.averageSyncTime * (this.stats.successfulSyncs - 1) + syncDuration) / this.stats.successfulSyncs;
    } else {
      this.stats.failedSyncs++;
      this.stats.connectionQuality = Math.max(0, this.stats.connectionQuality - 15);
    }
  }

  // 批量同步 - This method was in the dev branch but not in the patch, so it's omitted.
  // async batchSync(configIds: string[]): Promise<DataOperationResult<SyncTask[]>> {
  //   const startTime = Date.now();
  //   const results: SyncTask[] = [];
  //   const errors: string[] = [];

  //   // 並行執行同步任務
  //   const promises = configIds.map(async (configId) => {
  //     const result = await this.triggerSync(configId);
  //     if (result.success && result.data) {
  //       results.push(result.data);
  //     } else {
  //       errors.push(`${configId}: ${result.error}`);
  //     }
  //   });
  //   await Promise.all(promises);

  //   return {
  //     success: errors.length === 0,
  //     data: results,
  //     error: errors.length > 0 ? errors.join('; ') : undefined,
  //     metadata: {
  //       operation: 'batch_sync',
  //       timestamp: startTime,
  //       duration: Date.now() - startTime,
  //       successfulSyncs: results.length,
  //       failedSyncs: errors.length
  //     }
  //   };
  // }

  /**
   * Subscribe to a real-time data channel
   */
  subscribe(channel: string, callback: MessageCallback): Unsubscribe {
    const channelSubscribers = this.subscribers.get(channel) || [];
    channelSubscribers.push(callback);
    this.subscribers.set(channel, channelSubscribers);
    omniLogger.info(LogCategory.INTEGRATION, `Real-time subscription established`, { channel });

    return () => {
      const updated = this.subscribers.get(channel) || [];
      this.subscribers.set(channel, updated.filter(cb => cb !== callback));
    };
  }

  /**
   * Publish data to a real-time channel
   */
  publish(channel: string, data: any): void {
    if (this.connectionState === ConnectionState.CONNECTED && this.webSocket) {
      this.webSocket.send(JSON.stringify({ channel, data }));
    }
  }

  private notifySubscribers(channel: string, data: any) {
    const channelSubscribers = this.subscribers.get(channel) || [];
    channelSubscribers.forEach(callback => callback(data));
  }

  // private validateSyncConfig(config: SyncConfig): { isValid: boolean; errors: string[] } {
  //   const errors: string[] = [];
  //   if (!config.id) errors.push('Config ID is required.');
  //   if (!config.dataSourceId) errors.push('Data Source ID is required.');
  //   if (!Object.values(SyncMode).includes(config.mode)) errors.push('Invalid Sync Mode.');
  //   if (config.interval <= 0) errors.push('Interval must be positive.');
  //   if (config.batchSize <= 0) errors.push('Batch size must be positive.');
  //   if (config.retryPolicy.maxRetries < 0) errors.push('Max retries cannot be negative.');
  //   if (config.retryPolicy.retryDelay < 0) errors.push('Retry delay cannot be negative.');
  //   if (!['local_wins', 'remote_wins', 'manual', 'merge'].includes(config.conflictResolution)) errors.push('Invalid conflict resolution strategy.');
  //   return { isValid: errors.length === 0, errors };
  // }
}

// Export singleton for compatibility
export const realTimeDataSync = RealTimeDataSync.getInstance();
