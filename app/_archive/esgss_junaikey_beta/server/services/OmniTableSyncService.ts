/**
 * 🔄 OmniTable Sync Service - Bi-directional Synchronization
 * --------------------------------------------------
 * [功能] OmniInfoOne ↔ OmniTable 雙向同步服務
 * [實體] Customer, Project, ESG Metric, Document, Opportunity
 * [策略] Last Write Wins + Conflict Detection
 */

import { createClient } from '@supabase/supabase-js';
import type {
    OmniTableRecord,
    OmniTableConfig,
    SyncResult,
    BatchSyncResult,
    ConflictData,
    ConflictStrategy,
    SyncEntityType,
    SyncDirection,
    SyncStatus,
    OmniTableSyncLog,
} from '../../src/types/esg-go/omni-table.types.js';
import { omniTableClient } from './OmniTableClient.js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== Configuration ====================

interface DatasheetMapping {
    customers: string;
    projects: string;
    esg_metrics: string;
    documents: string;
    opportunities: string;
}

const DATASHEET_IDS: DatasheetMapping = {
    customers: process.env.OMNI_TABLE_DATASHEET_CUSTOMERS || process.env.OMNITABLE_DATASHEET_CUSTOMERS || '',
    projects: process.env.OMNI_TABLE_DATASHEET_PROJECTS || process.env.OMNITABLE_DATASHEET_PROJECTS || '',
    esg_metrics: process.env.OMNI_TABLE_DATASHEET_ESG_METRICS || process.env.OMNITABLE_DATASHEET_ESG_METRICS || '',
    documents: process.env.OMNI_TABLE_DATASHEET_DOCUMENTS || process.env.OMNITABLE_DATASHEET_DOCUMENTS || '',
    opportunities: process.env.OMNI_TABLE_DATASHEET_OPPORTUNITIES || process.env.OMNITABLE_DATASHEET_OPPORTUNITIES || '',
};

const SYNC_CONFIG = {
    conflictResolution: (process.env.OMNI_TABLE_CONFLICT_STRATEGY as ConflictStrategy) || (process.env.OMNITABLE_CONFLICT_STRATEGY as ConflictStrategy) || 'last_write_wins',
    retryAttempts: parseInt(process.env.OMNI_TABLE_RETRY_ATTEMPTS || process.env.OMNITABLE_RETRY_ATTEMPTS || '3'),
    retryDelayMs: parseInt(process.env.OMNI_TABLE_RETRY_DELAY_MS || process.env.OMNITABLE_RETRY_DELAY_MS || '2000'),
    batchSize: parseInt(process.env.OMNI_TABLE_BATCH_SIZE || process.env.OMNITABLE_BATCH_SIZE || '50'),
    fieldOverrides: {
        created_at: 'never_sync' as const,
        updated_at: 'local_priority' as const,
    },
};

// ==================== Core Sync Service ====================

export class OmniTableSyncService {

    // ==================== Customer Sync ====================

    /**
     * Customer → OmniTable Customers
     */
    static async syncCustomerToOmniTable(customerId: string): Promise<SyncResult> {
        const datasheetId = DATASHEET_IDS.customers;
        if (!datasheetId) {
            return {
                success: false,
                error: 'OMNITABLE_DATASHEET_CUSTOMERS not configured',
                retryable: false,
            };
        }

        try {
            // 1. 從 Supabase 獲取 Customer 資料
            const { data: customer, error } = await supabase
                .from('customers')
                .select('*')
                .eq('id', customerId)
                .single();

            if (error || !customer) {
                return {
                    success: false,
                    error: `Customer not found: ${customerId}`,
                    retryable: false,
                };
            }

            // 2. 檢查是否已同步過（獲取 OmniTable Record ID）
            const existingSync = await this.getLatestSyncLog('customer', customerId, 'to_omni_table');

            // 3. 映射欄位（InfoOne → OmniTable）
            const omniTableFields = this.mapCustomerToOmniTable(customer);

            // 4. 建立或更新 OmniTable Record
            let omniTableRecordId: string | undefined;

            if (existingSync?.omni_table_record_id) {
                // 更新現有記錄
                const updated = await omniTableClient.updateRecords(
                    datasheetId,
                    [{ recordId: existingSync.omni_table_record_id, fields: omniTableFields }]
                );
                omniTableRecordId = updated?.[0]?.recordId;
            } else {
                // 建立新記錄
                const created = await omniTableClient.createRecords(datasheetId, [{ fields: omniTableFields }]);
                omniTableRecordId = created?.[0]?.recordId;
            }

            if (!omniTableRecordId) {
                throw new Error('Failed to create/update OmniTable record');
            }

            // 5. 記錄同步日誌
            await this.logSync({
                entityType: 'customer',
                entityId: customerId,
                omni_table_record_id: omniTableRecordId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'success',
            });

            return {
                success: true,
                recordId: omniTableRecordId,
            };
        } catch (error) {
            const errorMessage = (error as Error).message;

            await this.logSync({
                entityType: 'customer',
                entityId: customerId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'failed',
                errorMessage,
            });

            return {
                success: false,
                error: errorMessage,
                retryable: true,
            };
        }
    }

    /**
     * OmniTable Customers → Customer (Webhook 觸發)
     */
    static async syncOmniTableToCustomer(recordId: string): Promise<SyncResult> {
        const datasheetId = DATASHEET_IDS.customers;
        if (!datasheetId) {
            return { success: false, error: 'OMNITABLE_DATASHEET_CUSTOMERS not configured', retryable: false };
        }

        try {
            // 1. 從 OmniTable 獲取 Record
            const records = await omniTableClient.getRecords(datasheetId, {
                filterByFormula: `{recordId} = "${recordId}"`,
            });

            if (!records || records.length === 0) {
                return { success: false, error: `OmniTable record not found: ${recordId}`, retryable: false };
            }

            const omniTableRecord = records[0];

            // 2. 檢查是否已存在對應的 Customer
            const existingSync = await this.findSyncByOmniTableRecordId(recordId, 'customer');

            // 3. 映射欄位（OmniTable → InfoOne）
            const customerData = this.mapOmniTableToCustomer(omniTableRecord);

            let customerId: string;

            if (existingSync) {
                // 更新現有 Customer
                const { data: updated, error } = await supabase
                    .from('customers')
                    .update(customerData)
                    .eq('id', existingSync.entity_id)
                    .select()
                    .single();

                if (error) throw error;
                customerId = updated.id;
            } else {
                // 建立新 Customer
                const { data: created, error } = await supabase
                    .from('customers')
                    .insert(customerData)
                    .select()
                    .single();

                if (error) throw error;
                customerId = created.id;
            }

            // 4. 記錄同步日誌
            await this.logSync({
                entityType: 'customer',
                entityId: customerId,
                omni_table_record_id: recordId,
                datasheetId,
                syncDirection: 'from_omni_table',
                syncStatus: 'success',
            });

            return { success: true, recordId: customerId };
        } catch (error) {
            const errorMessage = (error as Error).message;

            await this.logSync({
                entityType: 'customer',
                omni_table_record_id: recordId,
                datasheetId,
                syncDirection: 'from_omni_table',
                syncStatus: 'failed',
                errorMessage,
            });

            return { success: false, error: errorMessage, retryable: true };
        }
    }

    // ==================== Project Sync ====================

    /**
     * Project → OmniTable Projects
     */
    static async syncProjectToOmniTable(projectId: string): Promise<SyncResult> {
        const datasheetId = DATASHEET_IDS.projects;
        if (!datasheetId) {
            return { success: false, error: 'OMNITABLE_DATASHEET_PROJECTS not configured', retryable: false };
        }

        try {
            const { data: project, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error || !project) {
                return { success: false, error: `Project not found: ${projectId}`, retryable: false };
            }

            const existingSync = await this.getLatestSyncLog('project', projectId, 'to_omni_table');
            const omniTableFields = this.mapProjectToOmniTable(project);

            let omniTableRecordId: string | undefined;

            if (existingSync?.omni_table_record_id) {
                const updated = await omniTableClient.updateRecords(datasheetId, [
                    { recordId: existingSync.omni_table_record_id, fields: omniTableFields }
                ]);
                omniTableRecordId = updated?.[0]?.recordId;
            } else {
                const created = await omniTableClient.createRecords(datasheetId, [{ fields: omniTableFields }]);
                omniTableRecordId = created?.[0]?.recordId;
            }

            if (!omniTableRecordId) throw new Error('Failed to sync project');

            await this.logSync({
                entityType: 'project',
                entityId: projectId,
                omni_table_record_id: omniTableRecordId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'success',
            });

            return { success: true, recordId: omniTableRecordId };
        } catch (error) {
            const errorMessage = (error as Error).message;
            await this.logSync({
                entityType: 'project',
                entityId: projectId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'failed',
                errorMessage,
            });
            return { success: false, error: errorMessage, retryable: true };
        }
    }

    // ==================== ESG Metric Sync ====================

    /**
     * ESG Metric → OmniTable ESG_Metrics
     */
    static async syncMetricToOmniTable(metricId: string): Promise<SyncResult> {
        const datasheetId = DATASHEET_IDS.esg_metrics;
        if (!datasheetId) {
            return { success: false, error: 'OMNITABLE_DATASHEET_ESG_METRICS not configured', retryable: false };
        }

        try {
            const { data: metric, error } = await supabase
                .from('esg_metrics')
                .select('*')
                .eq('id', metricId)
                .single();

            if (error || !metric) {
                return { success: false, error: `Metric not found: ${metricId}`, retryable: false };
            }

            const existingSync = await this.getLatestSyncLog('metric', metricId, 'to_omni_table');
            const omniTableFields = this.mapMetricToOmniTable(metric);

            let omniTableRecordId: string | undefined;

            if (existingSync?.omni_table_record_id) {
                const updated = await omniTableClient.updateRecords(datasheetId, [
                    { recordId: existingSync.omni_table_record_id, fields: omniTableFields }
                ]);
                omniTableRecordId = updated?.[0]?.recordId;
            } else {
                const created = await omniTableClient.createRecords(datasheetId, [{ fields: omniTableFields }]);
                omniTableRecordId = created?.[0]?.recordId;
            }

            if (!omniTableRecordId) throw new Error('Failed to sync metric');

            await this.logSync({
                entityType: 'metric',
                entityId: metricId,
                omni_table_record_id: omniTableRecordId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'success',
            });

            return { success: true, recordId: omniTableRecordId };
        } catch (error) {
            const errorMessage = (error as Error).message;
            await this.logSync({
                entityType: 'metric',
                entityId: metricId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'failed',
                errorMessage,
            });
            return { success: false, error: errorMessage, retryable: true };
        }
    }

    // ==================== Evidence/Document Sync ====================

    /**
     * Evidence → OmniTable Documents
     */
    static async syncEvidenceToOmniTable(evidenceId: string): Promise<SyncResult> {
        const datasheetId = DATASHEET_IDS.documents;
        if (!datasheetId) {
            return { success: false, error: 'OMNITABLE_DATASHEET_DOCUMENTS not configured', retryable: false };
        }

        try {
            const { data: evidence, error } = await supabase
                .from('evidence_vault')
                .select('*')
                .eq('id', evidenceId)
                .single();

            if (error || !evidence) {
                return { success: false, error: `Evidence not found: ${evidenceId}`, retryable: false };
            }

            const existingSync = await this.getLatestSyncLog('document', evidenceId, 'to_omni_table');
            const omniTableFields = this.mapEvidenceToOmniTable(evidence);

            let omniTableRecordId: string | undefined;

            if (existingSync?.omni_table_record_id) {
                const updated = await omniTableClient.updateRecords(datasheetId, [
                    { recordId: existingSync.omni_table_record_id, fields: omniTableFields }
                ]);
                omniTableRecordId = updated?.[0]?.recordId;
            } else {
                const created = await omniTableClient.createRecords(datasheetId, [{ fields: omniTableFields }]);
                omniTableRecordId = created?.[0]?.recordId;
            }

            if (!omniTableRecordId) throw new Error('Failed to sync evidence');

            await this.logSync({
                entityType: 'document',
                entityId: evidenceId,
                omni_table_record_id: omniTableRecordId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'success',
            });

            return { success: true, recordId: omniTableRecordId };
        } catch (error) {
            const errorMessage = (error as Error).message;
            await this.logSync({
                entityType: 'document',
                entityId: evidenceId,
                datasheetId,
                syncDirection: 'to_omni_table',
                syncStatus: 'failed',
                errorMessage,
            });
            return { success: false, error: errorMessage, retryable: true };
        }
    }

    // ==================== Batch Sync ====================

    /**
     * 批量同步 Customers
     */
    static async bulkSyncCustomers(customerIds: string[]): Promise<BatchSyncResult> {
        const results: SyncResult[] = [];
        let succeeded = 0;
        let failed = 0;
        let conflicts = 0;

        for (const customerId of customerIds) {
            const result = await this.syncCustomerToOmniTable(customerId);
            results.push(result);

            if (result.success) {
                succeeded++;
            } else if (result.conflict) {
                conflicts++;
            } else {
                failed++;
            }
        }

        return {
            total: customerIds.length,
            succeeded,
            failed,
            conflicts,
            results,
        };
    }

    // ==================== Conflict Detection ====================

    /**
     * 檢測衝突
     */
    static detectConflicts(local: any, remote: any, lastSyncTimestamp?: string): ConflictData | null {
        // 簡化的衝突檢測：比較時間戳
        if (!lastSyncTimestamp) return null;

        const localUpdated = new Date(local.updated_at);
        const remoteUpdated = new Date(remote.updated_at);
        const lastSync = new Date(lastSyncTimestamp);

        // 如果雙方都在上次同步後更新，則發生衝突
        if (localUpdated > lastSync && remoteUpdated > lastSync) {
            // 找出具體衝突的欄位（這裡簡化處理）
            return {
                field: 'multiple_fields',
                localValue: local,
                remoteValue: remote,
                localTimestamp: local.updated_at,
                remoteTimestamp: remote.updated_at,
            };
        }

        return null;
    }

    // ==================== Helper Functions ====================

    /**
     * 記錄同步日誌
     */
    private static async logSync(log: Partial<OmniTableSyncLog>): Promise<void> {
        try {
            await supabase.from('omni_table_sync_log').insert({
                entity_type: log.entityType,
                entity_id: log.entityId,
                omni_table_record_id: log.omni_table_record_id,
                datasheet_id: log.datasheetId,
                sync_direction: log.syncDirection,
                sync_status: log.syncStatus,
                conflict_data: log.conflictData,
                error_message: log.errorMessage,
            });
        } catch (error) {
            console.error('[OmniTableSyncService] Failed to log sync:', error);
        }
    }

    /**
     * 獲取最新同步日誌
     */
    private static async getLatestSyncLog(
        entityType: SyncEntityType,
        entityId: string,
        direction: SyncDirection
    ): Promise<any | null> {
        const { data } = await supabase
            .from('omni_table_sync_log')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('sync_direction', direction)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return data;
    }

    /**
     * 根據 OmniTable Record ID 找到同步記錄
     */
    private static async findSyncByOmniTableRecordId(
        recordId: string,
        entityType: SyncEntityType
    ): Promise<any | null> {
        const { data } = await supabase
            .from('omni_table_sync_log')
            .select('*')
            .eq('omni_table_record_id', recordId)
            .eq('entity_type', entityType)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return data;
    }

    // ==================== Field Mapping Functions ====================

    private static mapCustomerToOmniTable(customer: any): Record<string, any> {
        return {
            '客戶名稱': customer.name || '',
            '產業': customer.industry || '',
            '規模': customer.company_size || '',
            '聯絡人': customer.contact_person || '',
            'Email': customer.email || '',
            '電話': customer.phone || '',
            '地址': customer.address || '',
            '狀態': customer.status || 'active',
            '建立時間': customer.created_at,
            '更新時間': customer.updated_at,
        };
    }

    private static mapOmniTableToCustomer(record: OmniTableRecord): any {
        const fields = record.fields;
        return {
            name: fields['客戶名稱'] || '',
            industry: fields['產業'] || '',
            company_size: fields['規模'] || '',
            contact_person: fields['聯絡人'] || '',
            email: fields['Email'] || '',
            phone: fields['電話'] || '',
            address: fields['地址'] || '',
            status: fields['狀態'] || 'active',
        };
    }

    private static mapProjectToOmniTable(project: any): Record<string, any> {
        return {
            '專案名稱': project.name || '',
            '狀態': project.status || 'planning',
            '負責人': project.owner || '',
            '開始日期': project.start_date,
            '截止日期': project.end_date,
            '進度': project.progress || 0,
            '描述': project.description || '',
        };
    }

    private static mapMetricToOmniTable(metric: any): Record<string, any> {
        return {
            '指標類型': metric.metric_type || '',
            '指標名稱': metric.name || '',
            '數值': metric.value || 0,
            '單位': metric.unit || '',
            '時間戳': metric.timestamp,
            '來源': metric.source || '',
            '驗證狀態': metric.verified ? '已驗證' : '未驗證',
        };
    }

    private static mapEvidenceToOmniTable(evidence: any): Record<string, any> {
        return {
            '文檔標題': evidence.title || evidence.file_name || '',
            '分類': evidence.category || '',
            '標籤': evidence.tags?.join(', ') || '',
            '檔案類型': evidence.file_type || '',
            '檔案大小': evidence.file_size || 0,
            '上傳者': evidence.uploaded_by || '',
            'Hash': evidence.file_hash || '',
            '上傳時間': evidence.created_at,
        };
    }
}
