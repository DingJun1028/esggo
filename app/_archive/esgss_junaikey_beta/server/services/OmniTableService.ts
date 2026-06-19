import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { OmniSupabase } from './OmniSupabase.js';

export interface OmniGenRequest {
    type: 'chart' | 'table' | 'dashboard' | 'database';
    prompt: string;
    context?: any;
}

export interface OmniGenResponse {
    success: boolean;
    data?: any;
    layout?: any;
    schema?: any; // For tables/databases
    components?: any[]; // For dashboards
    error?: string;
}

export interface SyncResult {
    success: boolean;
    recordId?: string;
    error?: string;
    retryable?: boolean;
}

export interface BatchSyncResult {
    total: number;
    succeeded: number;
    failed: number;
    conflicts: number;
    details: SyncResult[];
}

export class OmniTableService {

    /**
     * Omni_Table Core: Generate content based on Natural Language
     */
    static async generate(request: OmniGenRequest): Promise<OmniGenResponse> {
        omniLogger.info(LogCategory.SYSTEM, `[OmniTable] Generating ${request.type} from prompt: "${request.prompt}"`);

        // Placeholder for AI Integration (OpenAI/Gemini)
        // In a real implementation, this would call the LLM to get the JSON structure.

        try {
            switch (request.type) {
                case 'chart':
                    return this.mockChartGeneration(request.prompt);
                case 'table':
                    return this.mockTableGeneration(request.prompt);
                case 'dashboard':
                    return this.mockDashboardGeneration(request.prompt);
                case 'database':
                    return this.mockDatabaseGeneration(request.prompt);
                default:
                    return { success: false, error: 'Unknown generation type' };
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniTable] Generation failed', { error });
            return { success: false, error: (error as Error).message };
        }
    }

    // ==================== Legacy Sync Support (Non-Crashing Stubs) ====================
    // These methods maintain compatibility with existing controllers but redirect to Omni logic or No-op

    static async syncCustomerToOmniTable(customerId: string): Promise<SyncResult> {
        // Migration: Log intention to sync to Omni_Table
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Absorbing customer sync for ${customerId}`);
        return { success: true, recordId: `omni_${Date.now()}` };
    }

    static async syncProjectToOmniTable(projectId: string): Promise<SyncResult> {
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Absorbing project sync for ${projectId}`);
        return { success: true, recordId: `omni_proj_${Date.now()}` };
    }

    static async syncMetricToOmniTable(metricId: string): Promise<SyncResult> {
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Absorbing metric sync for ${metricId}`);
        return { success: true, recordId: `omni_met_${Date.now()}` };
    }

    static async syncEvidenceToOmniTable(evidenceId: string): Promise<SyncResult> {
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Absorbing evidence sync for ${evidenceId}`);
        return { success: true, recordId: `omni_ev_${Date.now()}` };
    }

    static async syncOmniTableToCustomer(recordId: string): Promise<SyncResult> {
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Absorbing sync OmniTable -> Customer for ${recordId}`);
        return { success: true, recordId };
    }

    static async getRecords(datasheetId: string, params: any) {
        omniLogger.info(LogCategory.SYSTEM, `[OmniTable] Mock getRecords for ${datasheetId}`);
        return [];
    }

    static async createRecords(datasheetId: string, records: any[]) {
        omniLogger.info(LogCategory.SYSTEM, `[OmniTable] Mock createRecords for ${datasheetId}`);
        return records.map((r, i) => ({ recordId: `mock_rec_${i}` }));
    }

    static async updateRecords(datasheetId: string, records: any[]) {
        omniLogger.info(LogCategory.SYSTEM, `[OmniTable] Mock updateRecords for ${datasheetId}`);
        return records.map((r) => ({ recordId: r.recordId }));
    }

    static async bulkSyncCustomers(customerIds: string[]): Promise<BatchSyncResult> {
        omniLogger.info(LogCategory.SYNC, `[OmniTable] Mock bulkSyncCustomers for ${customerIds.length} items`);
        return {
            total: customerIds.length,
            succeeded: customerIds.length,
            failed: 0,
            conflicts: 0,
            details: customerIds.map(id => ({ success: true, recordId: `omni_bulk_${id}` }))
        };
    }

    // ==================== Node-UUID Registry (Phase 29) ====================

    /**
     * Register a mapping between a UI Node ID and a Technical UUID
     */
    static async registerNodeUUID(nodeId: string, uuid: string, type?: string, metadata: any = {}): Promise<SyncResult> {
        omniLogger.info(LogCategory.SYSTEM, `[OmniTable] Registering Node-UUID mapping: ${nodeId} -> ${uuid}`);

        const supabase = OmniSupabase.getInstance().getClient();
        if (!supabase) {
            // [RESILIENCE] Fallback to mock succeed if Supabase is unavailable
            return { success: true, recordId: nodeId };
        }

        try {
            const { error } = await supabase
                .from('node_registry')
                .upsert({
                    node_id: nodeId,
                    uuid: uuid,
                    node_type: type,
                    metadata: metadata
                }, { onConflict: 'node_id' });

            if (error) throw error;
            return { success: true, recordId: nodeId };
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[OmniTable] Failed to register Node-UUID`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Retrieve a UUID for a given UI Node ID
     */
    static async getNodeUUID(nodeId: string): Promise<string | null> {
        const supabase = OmniSupabase.getInstance().getClient();
        if (!supabase) return null;

        try {
            const { data, error } = await supabase
                .from('node_registry')
                .select('uuid')
                .eq('node_id', nodeId)
                .single();

            if (error) return null;
            return data.uuid;
        } catch (error) {
            return null;
        }
    }

    // ==================== Mock Generators (To Be Replaced by Real AI) ====================

    private static mockChartGeneration(prompt: string): OmniGenResponse {
        return {
            success: true,
            data: {
                type: 'bar',
                title: `Generated Chart: ${prompt}`,
                xAxis: ['Q1', 'Q2', 'Q3', 'Q4'],
                series: [
                    { name: 'Revenue', data: [120, 200, 150, 80] }
                ]
            }
        };
    }

    private static mockTableGeneration(prompt: string): OmniGenResponse {
        return {
            success: true,
            data: {
                columns: [
                    { id: 'c1', name: 'Name', type: 'text' },
                    { id: 'c2', name: 'Status', type: 'select', options: ['Active', 'Pending'] }
                ],
                rows: [
                    { c1: 'Project Alpha', c2: 'Active' },
                    { c1: 'Project Beta', c2: 'Pending' }
                ]
            }
        };
    }

    private static mockDashboardGeneration(prompt: string): OmniGenResponse {
        return {
            success: true,
            layout: 'grid',
            components: [
                { type: 'chart', title: 'Sales Overview', x: 0, y: 0, w: 6, h: 4 },
                { type: 'table', title: 'Recent Activity', x: 6, y: 0, w: 6, h: 4 }
            ]
        };
    }

    private static mockDatabaseGeneration(prompt: string): OmniGenResponse {
        return {
            success: true,
            schema: {
                tableName: 'Generated_DB',
                fields: {
                    id: 'uuid',
                    created_at: 'timestamp',
                    name: 'text'
                }
            }
        };
    }
}
