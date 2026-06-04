import { AgentTask, AgentStep, ContractInput } from '../agent/esg-schemas';
export interface TaskInput {
    prompt: string;
    targetFramework?: string;
    sessionId?: string;
}
export declare class ESGDataService {
    private supabase;
    private omniTableClient;
    createContract(input: ContractInput): Promise<ContractInput & {
        id: string;
        created_at: string;
    }>;
    getContracts(): Promise<(ContractInput & {
        id: string;
        created_at: string;
    })[]>;
    createAgentTask(input: TaskInput): Promise<AgentTask>;
    updateAgentTask(taskId: string, updates: Partial<AgentTask>): Promise<AgentTask>;
    getAgentTask(taskId: string): Promise<AgentTask | null>;
    addAgentStep(taskId: string, step: AgentStep): Promise<void>;
    createEvidenceRecord(input: Record<string, unknown>): Promise<Record<string, unknown>>;
    getEvidenceRecords(): Promise<Record<string, unknown>[]>;
    private generateUUID;
    getLatestAgentTasks(limit?: number): Promise<AgentTask[]>;
    searchByCompliance(framework: string): Promise<AgentTask[]>;
}
//# sourceMappingURL=esg-data-service.d.ts.map