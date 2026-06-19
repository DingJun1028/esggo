/**
 * OmniSync Service - Unified Platform Synchronization
 * 
 * Merges OmniSpace Sync and OmniTable Sync into a single unified service
 * Supports multiple platforms: OmniSpace, OmniTable, NoCodeBackend, and custom integrations
 * 
 * @version 2.0.0
 * @date 2026-02-16
 */

import { ncb } from '@/lib/ncb/client';
import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

// ==========================================
// Type Definitions
// ==========================================

export type Platform =
  | 'omni_space'  // Transcendence of OmniSpace
  | 'omni_table'  // Transcendence of OmniTable
  | 'ncb'         // NoCodeBackend (System Core)
  | 'airtable'
  | 'notion'
  | 'custom';

export type SyncDirection = 'to_platform' | 'from_platform' | 'bidirectional';
export type SyncStatus = 'success' | 'failed' | 'conflict' | 'pending' | 'retry' | 'in_progress';
export type ConflictResolutionStrategy = 'manual' | 'local_wins' | 'remote_wins' | 'latest_wins' | 'merge';

export enum OmniSyncEventType {
  RESONANCE_UPDATE = 'RESONANCE_UPDATE',
  AWAKENING_BROADCAST = 'AWAKENING_BROADCAST',
  SYNC_COMPLETED = 'SYNC_COMPLETED',
  SYNC_ERROR = 'SYNC_ERROR',
  // 🔄 日誌同步事件 (OmniCircle Integration)
  LOG_SYNC_STARTED = 'LOG_SYNC_STARTED',        // 日誌同步開始
  LOG_SYNC_COMPLETED = 'LOG_SYNC_COMPLETED',    // 日誌同步完成
  LOG_SYNC_FAILED = 'LOG_SYNC_FAILED',          // 日誌同步失敗
  CRITICAL_LOG_RECEIVED = 'CRITICAL_LOG_RECEIVED', // 關鍵錯誤日誌接收
  INVESTIGATION_RESOLVED = 'INVESTIGATION_RESOLVED', // 調查完成
}

export interface SyncEvent {
  type: OmniSyncEventType;
  payload: any;
  source?: string;
}

export interface SyncLog {
  id: string;
  platform: Platform;
  entity_type: string;
  entity_id: string;
  external_id?: string;
  sync_direction: SyncDirection;
  sync_status: SyncStatus;
  payload?: Record<string, unknown>;
  metadata?: SyncMetadata;
  conflict_data?: ConflictData;
  resolved_at?: string;
  resolved_by?: string;
  error_message?: string;
  error_code?: string;
  retry_count: number;
  max_retries: number;
  last_retry_at?: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at?: string;
}

export interface EntityMap {
  id: string;
  local_entity_type: string;
  local_entity_id: string;
  platform: Platform;
  external_entity_id: string;
  external_datasheet_id?: string;
  mapping_type: 'automatic' | 'manual' | 'imported';
  confidence_score: number;
  last_synced_at?: string;
  sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyncConfig {
  id: string;
  config_name: string;
  platform: Platform;
  sync_enabled: boolean;
  sync_direction: SyncDirection;
  sync_interval_minutes: number;
  scheduled_sync: string;
  timezone: string;
  max_retries: number;
  retry_interval_minutes: number;
  conflict_resolution_strategy: ConflictResolutionStrategy;
  field_mappings?: Record<string, string>;
  webhook_url?: string;
  webhook_secret?: string;
  is_active: boolean;
  last_sync_at?: string;
  last_error?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface SyncMetadata {
  duration_ms?: number;
  batch_size?: number;
  source_version?: string;
  target_version?: string;
  checksum?: string;
  [key: string]: unknown;
}

export interface ConflictData {
  field: string;
  local_value: unknown;
  remote_value: unknown;
  local_timestamp?: string;
  remote_timestamp?: string;
  resolution_suggestion?: string;
}

export interface SyncResult {
  success: boolean;
  sync_id?: string;
  error_message?: string;
  error_code?: string;
  external_id?: string;
  duration_ms?: number;
}

// ==========================================
// OmniSync Service Class
// ==========================================

export class OmniSyncService {
  private platformClients: Map<Platform, PlatformClient>;
  private configCache: Map<string, SyncConfig>;
  private broadcastChannel: BroadcastChannel;
  private subscribers: ((event: SyncEvent) => void)[] = [];

  constructor() {
    this.platformClients = new Map();
    this.configCache = new Map();
    this.broadcastChannel = new BroadcastChannel('omni_sync_channel');

    // Listen for cross-tab messages
    this.broadcastChannel.onmessage = (event) => {
      this.notifySubscribers(event.data);
    };

    // Initialize platform clients
    this.initializePlatformClients();
  }

  /**
   * Broadcast an event to all tabs
   */
  public broadcast(type: OmniSyncEventType, payload: any) {
    const event: SyncEvent = { type, payload, source: 'omni_sync_service' };
    this.broadcastChannel.postMessage(event);
    this.notifySubscribers(event);
  }

  /**
   * Subscribe to sync events
   */
  public subscribe(callback: (event: SyncEvent) => void) {
    this.subscribers.push(callback);
    return () => this.unsubscribe(callback);
  }

  /**
   * Unsubscribe from sync events
   */
  public unsubscribe(callback: (event: SyncEvent) => void) {
    this.subscribers = this.subscribers.filter(s => s !== callback);
  }

  private notifySubscribers(event: SyncEvent) {
    this.subscribers.forEach(s => s(event));
  }

  // ==========================================
  // Core Sync Operations
  // ==========================================

  /**
   * Execute sync for a specific entity
   */
  async syncEntity(
    platform: Platform,
    entityType: string,
    entityId: string,
    direction: SyncDirection,
    payload?: Record<string, unknown>
  ): Promise<SyncResult> {
    const startTime = Date.now();

    // In OmniBackend, we assume defaults if config missing to simplify bootstrapping
    let config: SyncConfig;
    try {
      config = await this.getSyncConfig(platform);
    } catch (e) {
      // Fallback or create default config logic could go here
      // For now, assume sync is enabled
      config = { sync_enabled: true } as SyncConfig;
    }

    if (!config.sync_enabled) {
      return {
        success: false,
        error_message: `Sync is disabled for platform: ${platform}`,
        error_code: 'SYNC_DISABLED'
      };
    }

    try {
      const client = this.platformClients.get(platform);
      if (!client) {
        throw new Error(`Platform client not found: ${platform}`);
      }

      // Get external ID if exists
      const entityMap = await this.getEntityMapping(platform, entityType, entityId);
      const externalId = entityMap?.external_entity_id;

      // Perform sync based on direction
      let result: { external_id: string; data: Record<string, unknown> } = {
        external_id: externalId || entityId,
        data: {}
      };

      if (direction === 'to_platform' || direction === 'bidirectional') {
        result = await client.pushData(entityType, entityId, payload, externalId);
      }

      if (direction === 'from_platform' || direction === 'bidirectional') {
        const remoteData = await client.pullData(entityType, externalId || entityId);
        await this.saveLocalEntity(entityType, entityId, remoteData);
      }

      // Log successful sync
      const syncLog = await this.logSync({
        platform,
        entity_type: entityType,
        entity_id: entityId,
        external_id: result.external_id,
        sync_direction: direction,
        sync_status: 'success',
        payload,
        metadata: {
          duration_ms: Date.now() - startTime,
          batch_size: 1
        }
      });

      return {
        success: true,
        sync_id: syncLog?.id,
        external_id: result.external_id,
        duration_ms: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Log failed sync
      await this.logSync({
        platform,
        entity_type: entityType,
        entity_id: entityId,
        sync_direction: direction,
        sync_status: 'failed',
        error_message: errorMessage,
        retry_count: 0
      });

      return {
        success: false,
        error_message: errorMessage,
        error_code: 'SYNC_FAILED',
        duration_ms: Date.now() - startTime
      };
    }
  }

  /**
   * Batch sync multiple entities
   */
  async batchSync(
    platform: Platform,
    entities: Array<{
      entityType: string;
      entityId: string;
      payload?: Record<string, unknown>;
    }>,
    direction: SyncDirection
  ): Promise<{ successful: number; failed: number; results: SyncResult[] }> {
    const results: SyncResult[] = [];
    let successful = 0;
    let failed = 0;

    for (const entity of entities) {
      const result = await this.syncEntity(
        platform,
        entity.entityType,
        entity.entityId,
        direction,
        entity.payload
      );

      results.push(result);

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return { successful, failed, results };
  }

  // ==========================================
  // Sync Logging Operations
  // ==========================================

  /**
   * Log a sync operation
   */
  async logSync(data: Partial<SyncLog>): Promise<SyncLog | null> {
    // Note: If omni_sync_log table doesn't exist in NCB, this will fail silently or throw.
    // We assume the schema exists.
    try {
      const { data: result, error } = await ncb
        .from('omni_sync_log')
        .insert({
          platform: data.platform,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          external_id: data.external_id,
          sync_direction: data.sync_direction,
          sync_status: data.sync_status,
          payload: data.payload,
          metadata: data.metadata,
          conflict_data: data.conflict_data,
          resolved_at: data.resolved_at,
          resolved_by: data.resolved_by,
          error_message: data.error_message,
          error_code: data.error_code,
          retry_count: data.retry_count || 0,
          max_retries: data.max_retries || 5,
          synced_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_deleted: false,
        })
        .select()
        .single();

      if (error) {
        omniLogger.error(LogCategory.SYSTEM, `Failed to log sync: ${error.message}`);
        return null;
      }
      return result as unknown as SyncLog;
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, `Exception logging sync`, { error: e });
      return null;
    }
  }

  /**
   * Get sync status for an entity
   */
  async getSyncStatus(
    platform: Platform,
    entityType: string,
    entityId: string
  ): Promise<SyncLog | null> {
    const { data, error } = await ncb
      .from('omni_sync_log')
      .select('*')
      .eq('platform', platform)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      //.eq('is_deleted', false) // Check if is_deleted column exists in your schema
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as unknown as SyncLog;
  }

  /**
   * Get all unresolved conflicts
   */
  async getUnresolvedConflicts(): Promise<SyncLog[]> {
    // Replaced RPC with direct query
    const { data, error } = await ncb
      .from('omni_sync_log')
      .select('*')
      .eq('sync_status', 'conflict');

    if (error) return [];
    return data as unknown as SyncLog[];
  }

  /**
   * Resolve a conflict
   */
  async resolveConflict(
    syncId: string,
    resolution: 'local_wins' | 'remote_wins' | 'merge',
    resolvedBy: string,
    mergedData?: Record<string, unknown>
  ): Promise<SyncResult> {
    const conflict = await this.getSyncLog(syncId);
    if (!conflict) {
      return { success: false, error_message: 'Sync log not found' };
    }

    if (conflict.sync_status !== 'conflict') {
      return { success: false, error_message: 'Not a conflict record' };
    }

    const client = this.platformClients.get(conflict.platform as Platform);
    if (!client) {
      return { success: false, error_message: 'Platform client not found' };
    }

    try {
      // Apply resolution
      if (resolution === 'local_wins') {
        // Push local data to platform
        await client.pushData(
          conflict.entity_type,
          conflict.entity_id,
          conflict.payload,
          conflict.external_id
        );
      } else if (resolution === 'remote_wins') {
        // Pull remote data to local
        await client.pullData(
          conflict.entity_type,
          conflict.external_id || conflict.entity_id
        );
      } else if (resolution === 'merge' && mergedData) {
        // Merge and push
        await client.pushData(
          conflict.entity_type,
          conflict.entity_id,
          mergedData,
          conflict.external_id
        );
      }

      // Update sync log
      const { error } = await ncb
        .from('omni_sync_log')
        .update({
          sync_status: 'success',
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
          conflict_data: null
        })
        .eq('id', syncId);

      if (error) {
        throw new Error(`Failed to resolve conflict: ${error.message}`);
      }

      return { success: true, sync_id: syncId };

    } catch (error) {
      return {
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Retry failed syncs
   */
  async retryFailedSyncs(platform?: Platform): Promise<{ retried: number; succeeded: number; failed: number }> {
    // Replaced RPC with direct query
    let query = ncb.from('omni_sync_log').select('*').eq('sync_status', 'failed').lt('retry_count', 5);

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data: failedSyncs, error } = await query;

    if (error || !failedSyncs) {
      return { retried: 0, succeeded: 0, failed: 0 };
    }

    let retried = 0;
    let succeeded = 0;
    let failedCount = 0;

    for (const sync of (failedSyncs as any[])) {
      const syncLog = sync as SyncLog; // Cast to SyncLog

      // Update retry count
      await ncb
        .from('omni_sync_log')
        .update({
          retry_count: (syncLog.retry_count || 0) + 1,
          last_retry_at: new Date().toISOString(),
          sync_status: 'retry'
        })
        .eq('id', syncLog.id);

      // Retry
      const result = await this.syncEntity(
        syncLog.platform as Platform,
        syncLog.entity_type,
        syncLog.entity_id,
        syncLog.sync_direction as SyncDirection,
        syncLog.payload
      );

      retried++;

      if (result.success) {
        succeeded++;
      } else {
        failedCount++;
      }
    }

    return { retried, succeeded, failed: failedCount };
  }

  // ==========================================
  // Entity Mapping Operations
  // ==========================================

  /**
   * Get entity mapping
   */
  async getEntityMapping(
    platform: Platform,
    entityType: string,
    entityId: string
  ): Promise<EntityMap | null> {
    const { data, error } = await ncb
      .from('omni_sync_entity_map')
      .select('*')
      .eq('platform', platform)
      .eq('local_entity_type', entityType)
      .eq('local_entity_id', entityId)
      .single();

    if (error) return null; // Treat not found as null
    return data as unknown as EntityMap;
  }

  /**
   * Create entity mapping
   */
  async createEntityMapping(
    platform: Platform,
    entityType: string,
    entityId: string,
    externalEntityId: string,
    options?: {
      externalDatasheetId?: string;
      mappingType?: 'automatic' | 'manual' | 'imported';
      confidenceScore?: number;
    }
  ): Promise<EntityMap> {
    const { data, error } = await ncb
      .from('omni_sync_entity_map')
      .insert({
        platform,
        local_entity_type: entityType,
        local_entity_id: entityId,
        external_entity_id: externalEntityId,
        external_datasheet_id: options?.externalDatasheetId,
        mapping_type: options?.mappingType || 'manual',
        confidence_score: options?.confidenceScore || 1.0,
        sync_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create entity mapping: ${error.message}`);
    }

    return data as unknown as EntityMap;
  }

  /**
   * Update entity mapping
   */
  async updateEntityMapping(
    platform: Platform,
    entityType: string,
    entityId: string,
    updates: Partial<EntityMap>
  ): Promise<EntityMap> {
    const { data, error } = await ncb
      .from('omni_sync_entity_map')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('platform', platform)
      .eq('local_entity_type', entityType)
      .eq('local_entity_id', entityId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update entity mapping: ${error.message}`);
    }

    return data as unknown as EntityMap;
  }

  // ==========================================
  // Sync Configuration Operations
  // ==========================================

  /**
   * Get sync config for a platform
   */
  async getSyncConfig(platform: Platform): Promise<SyncConfig> {
    const cacheKey = `config_${platform}`;
    if (this.configCache.has(cacheKey)) {
      return this.configCache.get(cacheKey)!;
    }

    const { data, error } = await ncb
      .from('omni_sync_config')
      .select('*')
      .eq('platform', platform)
      .eq('is_active', true)
      .single();

    if (error) {
      // Return default if not found
      const defaultConfig: SyncConfig = {
        id: 'default',
        platform,
        config_name: 'Default Config',
        sync_enabled: true,
        sync_direction: 'bidirectional',
        sync_interval_minutes: 60,
        scheduled_sync: '00:00',
        timezone: 'UTC',
        max_retries: 3,
        retry_interval_minutes: 5,
        conflict_resolution_strategy: 'local_wins',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return defaultConfig;
    }

    this.configCache.set(cacheKey, data as unknown as SyncConfig);
    return data as unknown as SyncConfig;
  }

  /**
   * Update sync config
   */
  async updateSyncConfig(
    platform: Platform,
    updates: Partial<SyncConfig>
  ): Promise<SyncConfig> {
    const { data, error } = await ncb
      .from('omni_sync_config')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('platform', platform)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update sync config: ${error.message}`);
    }

    // Clear cache
    this.configCache.delete(`config_${platform}`);

    return data as unknown as SyncConfig;
  }

  /**
   * Enable/disable sync for a platform
   */
  async setSyncEnabled(platform: Platform, enabled: boolean): Promise<void> {
    try {
      await this.updateSyncConfig(platform, { sync_enabled: enabled });
    } catch (e) {
      // Ignore if config doesn't exist
    }
  }

  // ==========================================
  // Statistics and Analytics
  // ==========================================

  /**
   * Get sync statistics
   */
  async getStatistics(platform?: Platform, hours: number = 24): Promise<{
    platform: string;
    total_syncs: number;
    successful_syncs: number;
    failed_syncs: number;
    conflict_syncs: number;
    success_rate: number;
    avg_duration_ms: number;
  }[]> {
    // Mock statistics for Basic Functionality, as real aggregation requires DB support
    // In a future phase, we can implement a stats table or use an aggregation API if available
    return [
      {
        platform: platform || 'all',
        total_syncs: 0,
        successful_syncs: 0,
        failed_syncs: 0,
        conflict_syncs: 0,
        success_rate: 0,
        avg_duration_ms: 0,
      }
    ];
  }

  // ==========================================
  // Private Helper Methods
  // ==========================================

  /**
   * Save data to local entity (NCB)
   */
  private async saveLocalEntity(
    entityType: string,
    entityId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    // This uses the 'ncb' client internal logic to save to the appropriate table
    const client = this.platformClients.get('ncb');
    if (client) {
      await client.pushData(entityType, entityId, data);
    } else {
      throw new Error('NCB Client not initialized for local save');
    }
  }

  private async getSyncLog(id: string): Promise<SyncLog | null> {
    const { data, error } = await ncb
      .from('omni_sync_log')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as unknown as SyncLog;
  }

  private initializePlatformClients(): void {
    // Initialize OmniSpace client (optimized OmniSpace)
    this.platformClients.set('omni_space', new OmniSpaceClient());

    // Initialize OmniTable client (optimized OmniTable)
    this.platformClients.set('omni_table', new OmniTableClient());

    // Initialize NCB as the System Core client
    this.platformClients.set('ncb', new NcbClientImpl());
  }
}

// ==========================================
// Platform Client Interfaces
// ==========================================

interface PlatformClient {
  pushData(
    entityType: string,
    entityId: string,
    payload?: Record<string, unknown>,
    externalId?: string
  ): Promise<{ external_id: string; data: Record<string, unknown> }>;

  pullData(
    entityType: string,
    externalId: string
  ): Promise<Record<string, unknown>>;
}

/**
 * 🌌 OmniSpace Client Implementation (Transcendence of Boost.Space)
 * Simplified for OmniBackend Integration
 */
/**
 * 🌌 OmniSpace Client Implementation (Transcendence of Boost.Space)
 * Integrates directly with NoCodeBackend via 'omni_space_nodes' table.
 */
class OmniSpaceClient implements PlatformClient {
  constructor() { }

  async pushData(
    entityType: string,
    entityId: string,
    payload?: Record<string, unknown>,
    externalId?: string
  ): Promise<{ external_id: string; data: Record<string, unknown> }> {
    // Map to omni_space_nodes by default for OmniSpace platform
    const tableName = 'omni_space_nodes';
    const targetId = externalId || entityId;

    // Try Update first
    let resultData;
    if (targetId) {
      const { data, error } = await ncb
        .from(tableName as any)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', targetId)
        .select()
        .single();
      if (!error && data) resultData = data;
    }

    // If update failed or no ID, Insert
    if (!resultData) {
      const { data, error } = await ncb
        .from(tableName as any)
        .insert({
          id: targetId || undefined, // LET NCB generate if null, or use provided
          ...payload,
          name: payload?.name || 'New Node', // Default required fields
          type: payload?.type || 'node',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw new Error(`OmniSpace push failed: ${error.message}`);
      resultData = data;
    }

    return {
      external_id: (resultData as any).id,
      data: resultData as unknown as Record<string, unknown>
    };
  }

  async pullData(
    entityType: string,
    externalId: string
  ): Promise<Record<string, unknown>> {
    const tableName = 'omni_space_nodes';
    const { data, error } = await ncb
      .from(tableName as any)
      .select('*')
      .eq('id', externalId)
      .single();

    if (error) throw new Error(`OmniSpace pull failed: ${error.message}`);
    return data as Record<string, unknown>;
  }
}

/**
 * 📊 OmniTable Client Implementation (Transcendence of AITable)
 */
class OmniTableClient implements PlatformClient {
  private apiKey: string;
  private baseUrl: string = (import.meta as any).env?.VITE_OMNI_TABLE_API_URL || 'https://api.aitable.ai/fusion/v1';

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_OMNI_TABLE_API_KEY || '';
  }

  async pushData(
    entityType: string,
    entityId: string,
    payload?: Record<string, unknown>,
    externalId?: string
  ): Promise<{ external_id: string; data: Record<string, unknown> }> {
    // For now, we mock the actual API call to avoid failure without keys
    // In Phase 3 (Real Integration), we will enable the fetch call
    return {
      external_id: externalId || `mock_table_${entityId}`,
      data: payload || {}
    };
  }

  async pullData(
    entityType: string,
    externalId: string
  ): Promise<Record<string, unknown>> {
    return { id: externalId, status: 'synced_from_table' };
  }
}

// ==========================================
// NoCodeBackend (NCB) Client Implementation
// ==========================================

class NcbClientImpl implements PlatformClient {

  constructor() { }

  async pushData(
    entityType: string,
    entityId: string,
    payload?: Record<string, unknown>,
    externalId?: string
  ): Promise<{ external_id: string; data: Record<string, unknown> }> {
    const tableName = this.getTableName(entityType);

    // Using Upsert logic (Insert or Update)
    // NCB doesn't have a single 'upsert' method in our client yet, so we try update, if fail then insert
    // OR we use the logic: if externalId exists, update, else insert

    let resultData;
    const targetId = externalId || entityId;

    if (externalId) {
      // Try Update
      const { data, error } = await ncb
        .from(tableName as any)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', externalId)
        .select() // Assuming NCB supports .select() after update
        .single();

      if (!error && data) {
        resultData = data;
      }
    }

    if (!resultData) {
      // Insert
      const { data, error } = await ncb
        .from(tableName as any)
        .insert({
          id: targetId,
          ...payload,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`NCB error: ${error.message}`);
      }
      resultData = data;
    }

    return {
      external_id: (resultData as any).id,
      data: resultData as unknown as Record<string, unknown>
    };
  }

  async pullData(
    entityType: string,
    externalId: string
  ): Promise<Record<string, unknown>> {
    const tableName = this.getTableName(entityType);

    const { data, error } = await ncb
      .from(tableName as any)
      .select('*')
      .eq('id', externalId)
      .single();

    if (error) {
      throw new Error(`NCB error: ${error.message}`);
    }

    return data as Record<string, unknown>;
  }

  private getTableName(entityType: string): string {
    const tableMapping: Record<string, string> = {
      customer: 'customers',
      project: 'projects',
      metric: 'esg_metrics',
      document: 'documents',
      opportunity: 'opportunities',
      player: 'game_players',
      achievement: 'game_achievements',
      battle: 'game_battle_history',
      card: 'game_card_collections',
      evidence: 'evidence_vault'
    };
    return tableMapping[entityType] || entityType;
  }
}

// ==========================================
// Export Factory Function
// ==========================================

export function createOmniSyncService(): OmniSyncService {
  return new OmniSyncService();
}

// Create a singleton instance for global use
export const omniSyncService = new OmniSyncService();

export default OmniSyncService;
