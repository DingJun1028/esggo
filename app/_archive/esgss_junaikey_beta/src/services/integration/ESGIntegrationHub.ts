/**
 * 🎯 ESG Integration Hub - 系統整合樞紐服務
 * 
 * 功能：
 * - 統一數據流管理
 * - 跨模組數據同步
 * - 全域事件匯流排
 * - 服務間通訊協調
 * 
 * @version 1.0.0
 * @date 2026-02-08
 */

import { EventEmitter } from '@/utils/EventEmitter';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface IntegrationEvent {
    id: string;
    type: EventType;
    source: ModuleName;
    target?: ModuleName;
    payload: Record<string, any>;
    timestamp: string;
    correlationId?: string;
}

export type EventType =
    | 'DATA_CREATED'
    | 'DATA_UPDATED'
    | 'DATA_DELETED'
    | 'STATUS_CHANGED'
    | 'WORKFLOW_STARTED'
    | 'WORKFLOW_COMPLETED'
    | 'ALERT_TRIGGERED'
    | 'SYNC_REQUIRED'
    | 'REPORT_GENERATED'
    | 'PAYMENT_PROCESSED'
    | 'COMMISSION_CALCULATED';

export type ModuleName =
    | 'CRM'
    | 'AGENCY'
    | 'FINANCE'
    | 'REPORT'
    | 'OCR'
    | 'CHART'
    | 'ANALYTICS'
    | 'AI_AGENT'
    | 'NOTIFICATION'
    | 'AUTH';

export interface ModuleState {
    name: ModuleName;
    status: 'idle' | 'active' | 'processing' | 'error';
    lastSync: string;
    pendingChanges: number;
    metrics: Record<string, number>;
}

export interface CrossModuleData {
    id: string;
    source: ModuleName;
    target: ModuleName;
    dataType: string;
    payload: Record<string, any>;
    direction: 'forward' | 'backward' | 'bidirectional';
    syncStrategy: 'immediate' | 'batch' | 'manual';
}

// Singleton Event Bus
class IntegrationEventBus extends EventEmitter {
    private static instance: IntegrationEventBus;

    private constructor() {
        super();
        this.setMaxListeners(100);
    }

    static getInstance(): IntegrationEventBus {
        if (!IntegrationEventBus.instance) {
            IntegrationEventBus.instance = new IntegrationEventBus();
        }
        return IntegrationEventBus.instance;
    }

    emitEvent(event: IntegrationEvent): void {
        this.emit(event.type, event);
        this.emit(`*:${event.type}`, event);
        this.emit(`${event.source}:${event.type}`, event);
        if (event.target) {
            this.emit(`${event.target}:${event.type}`, event);
        }
    }

    subscribe(eventType: EventType, callback: (event: IntegrationEvent) => void): () => void {
        this.on(eventType, callback);
        return () => this.off(eventType, callback);
    }
}

// Module Registry
class ModuleRegistry {
    private static instance: ModuleRegistry;
    private modules = new Map<ModuleName, ModuleState>();
    private dataStores = new Map<string, CrossModuleData[]>();

    private constructor() { }

    static getInstance(): ModuleRegistry {
        if (!ModuleRegistry.instance) {
            ModuleRegistry.instance = new ModuleRegistry();
        }
        return ModuleRegistry.instance;
    }

    registerModule(module: ModuleName): void {
        if (!this.modules.has(module)) {
            this.modules.set(module, {
                name: module,
                status: 'idle',
                lastSync: new Date().toISOString(),
                pendingChanges: 0,
                metrics: {},
            });
        }
    }

    updateModuleStatus(module: ModuleName, status: ModuleState['status']): void {
        const state = this.modules.get(module);
        if (state) {
            state.status = status;
        }
    }

    getModuleState(module: ModuleName): ModuleState | undefined {
        return this.modules.get(module);
    }

    getAllModules(): ModuleState[] {
        return Array.from(this.modules.values());
    }

    registerData(source: ModuleName, target: ModuleName, dataType: string, payload: Record<string, any>): CrossModuleData {
        const id = uuidv4();
        const data: CrossModuleData = {
            id,
            source,
            target,
            dataType,
            payload,
            direction: 'bidirectional',
            syncStrategy: 'immediate',
        };

        const key = `${source}:${target}:${dataType}`;
        if (!this.dataStores.has(key)) {
            this.dataStores.set(key, []);
        }
        this.dataStores.get(key)!.push(data);

        return data;
    }

    getData(source: ModuleName, target: ModuleName, dataType?: string): CrossModuleData[] {
        const key = dataType
            ? `${source}:${target}:${dataType}`
            : `${source}:${target}:*`;

        const results: CrossModuleData[] = [];
        this.dataStores.forEach((values, k) => {
            if (k.startsWith(key.replace(':*', ':'))) {
                results.push(...values);
            }
        });

        return results;
    }
}

// Main Integration Hub
export class ESGIntegrationHub {
    private static instance: ESGIntegrationHub;
    private eventBus: IntegrationEventBus;
    private registry: ModuleRegistry;
    private workflows: Map<string, WorkflowDefinition> = new Map();

    private constructor() {
        this.eventBus = IntegrationEventBus.getInstance();
        this.registry = ModuleRegistry.getInstance();
        this.initializeModules();
        this.initializeWorkflows();
    }

    static getInstance(): ESGIntegrationHub {
        if (!ESGIntegrationHub.instance) {
            ESGIntegrationHub.instance = new ESGIntegrationHub();
        }
        return ESGIntegrationHub.instance;
    }

    private initializeModules(): void {
        const modules: ModuleName[] = [
            'CRM', 'AGENCY', 'FINANCE', 'REPORT', 'OCR',
            'CHART', 'ANALYTICS', 'AI_AGENT', 'NOTIFICATION', 'AUTH'
        ];
        modules.forEach(m => this.registry.registerModule(m));
    }

    private initializeWorkflows(): void {
        // CRM → REPORT Workflow
        this.workflows.set('crm_to_report', {
            id: 'crm_to_report',
            name: '客戶專案 → 報告書生成',
            trigger: 'DATA_UPDATED',
            source: 'CRM',
            target: 'REPORT',
            steps: [
                { action: 'EXTRACT_DATA', params: { fields: ['project', 'milestones', 'outcomes'] } },
                { action: 'TRANSFORM_DATA', params: { template: 'project_summary' } },
                { action: 'GENERATE_REPORT', params: { section: 'project_achievements' } },
            ],
        });

        // AGENCY → FINANCE Workflow
        this.workflows.set('agency_to_finance', {
            id: 'agency_to_finance',
            name: '代理分潤 → 財務核算',
            trigger: 'COMMISSION_CALCULATED',
            source: 'AGENCY',
            target: 'FINANCE',
            steps: [
                { action: 'EXTRACT_COMMISSION', params: { fields: ['amount', 'partner', 'tier'] } },
                { action: 'CREATE_INVOICE', params: { type: 'commission' } },
                { action: 'RECORD_PAYMENT', params: { account: 'commission_payable' } },
            ],
        });

        // REPORT → ANALYTICS Workflow
        this.workflows.set('report_to_analytics', {
            id: 'report_to_analytics',
            name: '報告書 → 數據分析',
            trigger: 'REPORT_GENERATED',
            source: 'REPORT',
            target: 'ANALYTICS',
            steps: [
                { action: 'EXTRACT_METRICS', params: { fields: ['score', 'completeness', 'gri_alignment'] } },
                { action: 'UPDATE_DASHBOARD', params: { widget: 'report_metrics' } },
                { action: 'GENERATE_INSIGHTS', params: { level: 'summary' } },
            ],
        });

        // OCR → REPORT Workflow
        this.workflows.set('ocr_to_report', {
            id: 'ocr_to_report',
            name: '文件解析 → 報告書萃取',
            trigger: 'DATA_CREATED',
            source: 'OCR',
            target: 'REPORT',
            steps: [
                { action: 'PARSE_CONTENT', params: { format: 'structured' } },
                { action: 'ALIGN_GRI', params: { framework: 'GRI 2021' } },
                { action: 'INSERT_SECTION', params: { template: 'data_input' } },
            ],
        });
    }

    // Public API
    publishEvent(type: EventType, source: ModuleName, target: ModuleName | undefined, payload: Record<string, any>): IntegrationEvent {
        const event: IntegrationEvent = {
            id: uuidv4(),
            type,
            source,
            target,
            payload,
            timestamp: new Date().toISOString(),
            correlationId: uuidv4(),
        };

        this.eventBus.emitEvent(event);
        this.triggerWorkflows(event);

        return event;
    }

    private triggerWorkflows(event: IntegrationEvent): void {
        this.workflows.forEach((workflow) => {
            if (workflow.trigger === event.type && workflow.source === event.source) {
                this.executeWorkflow(workflow.id, event);
            }
        });
    }

    async executeWorkflow(workflowId: string, event: IntegrationEvent): Promise<any> {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) return null;

        console.log(`[IntegrationHub] Executing workflow: ${workflow.name}`);

        let result = event.payload;
        for (const step of workflow.steps) {
            console.log(`[IntegrationHub]   Step: ${step.action}`);
            // Execute step logic
            result = await this.executeStep(step.action, step.params, result);
        }

        return result;
    }

    private async executeStep(action: string, params: Record<string, any>, data: Record<string, any>): Promise<Record<string, any>> {
        // Simulate step execution
        return {
            ...data,
            [`_${action.toLowerCase()}_result`]: true,
            _timestamp: new Date().toISOString(),
        };
    }

    syncModuleData(source: ModuleName, target: ModuleName): Promise<number> {
        return new Promise((resolve) => {
            const data = this.registry.getData(source, target);

            // Trigger sync events for each data item
            data.forEach(item => {
                this.publishEvent(
                    'SYNC_REQUIRED',
                    source,
                    target,
                    { dataId: item.id, direction: item.direction }
                );
            });

            resolve(data.length);
        });
    }

    getIntegrationStatus(): {
        modules: ModuleState[];
        workflows: WorkflowDefinition[];
        eventStats: Record<string, number>;
    } {
        return {
            modules: this.registry.getAllModules(),
            workflows: Array.from(this.workflows.values()),
            eventStats: {
                DATA_CREATED: 0,
                DATA_UPDATED: 0,
                DATA_DELETED: 0,
                SYNC_REQUIRED: 0,
                REPORT_GENERATED: 0,
                PAYMENT_PROCESSED: 0,
                COMMISSION_CALCULATED: 0,
            },
        };
    }

    // Convenience methods for specific integrations
    syncCRMToReport(projectData: Record<string, any>): void {
        this.publishEvent('DATA_UPDATED', 'CRM', 'REPORT', { project: projectData });
    }

    syncAgencyToFinance(commissionData: Record<string, any>): void {
        this.publishEvent('COMMISSION_CALCULATED', 'AGENCY', 'FINANCE', { commission: commissionData });
    }

    syncReportToAnalytics(reportData: Record<string, any>): void {
        this.publishEvent('REPORT_GENERATED', 'REPORT', 'ANALYTICS', { report: reportData });
    }

    syncOCRToReport(ocrData: Record<string, any>): void {
        this.publishEvent('DATA_CREATED', 'OCR', 'REPORT', { extracted: ocrData });
    }
}

interface WorkflowDefinition {
    id: string;
    name: string;
    trigger: EventType;
    source: ModuleName;
    target: ModuleName;
    steps: WorkflowStep[];
}

interface WorkflowStep {
    action: string;
    params: Record<string, any>;
}

// Export singleton access
export const integrationHub = ESGIntegrationHub.getInstance();
export const eventBus = IntegrationEventBus.getInstance();
export const moduleRegistry = ModuleRegistry.getInstance();

export default {
    ESGIntegrationHub,
    integrationHub,
    eventBus,
    moduleRegistry,
};
