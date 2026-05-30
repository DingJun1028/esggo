import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgentTask, AgentStep, ContractInput, ESGProposal } from '../agent/esg-schemas';

export interface TaskInput {
  prompt: string;
  targetFramework?: string;
  sessionId?: string;
}

export class ESGDataService {
   private supabase!: SupabaseClient;
   private omniTableClient!: unknown; // OmniTable client will be injected

   // Contract Operations
   async createContract(input: ContractInput): Promise<ContractInput & { id: string; created_at: string }> {
    const contract = {
      id: this.generateUUID(),
      ...input,
      created_at: new Date().toISOString(),
    };

    // Insert to Supabase
    const { data, error } = await this.supabase
      .from('contracts')
      .insert([contract])
      .select()
      .single();

    if (error) throw error;

    // Sync to OmniTable
    if (this.omniTableClient && typeof (this.omniTableClient as any).createRecords === 'function') {
      await (this.omniTableClient as any).createRecords('esg_contracts', [contract]);
    }

    return data;
  }

   async getContracts(): Promise<(ContractInput & { id: string; created_at: string })[]> {
    const { data, error } = await this.supabase.from('contracts').select('*');
    if (error) throw error;
    return data ?? [];
  }

   // Agent Task Operations
   async createAgentTask(input: TaskInput): Promise<AgentTask> {
    const task: AgentTask = {
      id: this.generateUUID(),
      prompt: input.prompt,
      targetFramework: input.targetFramework || '5T',
      status: 'PLANNING',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sessionId: input.sessionId,
    };

    const { data, error } = await this.supabase
      .from('agent_tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async updateAgentTask(taskId: string, updates: Partial<AgentTask>): Promise<AgentTask> {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAgentTask(taskId: string): Promise<AgentTask | null> {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  async addAgentStep(taskId: string, step: AgentStep): Promise<void> {
    // Update task with new step
    await this.updateAgentTask(taskId, {
      steps: [...(await this.getAgentTask(taskId))?.steps || [], step]
    });

    // Log to OmniTable
    if (this.omniTableClient && typeof (this.omniTableClient as any).createRecords === 'function') {
      await (this.omniTableClient as any).createRecords('esg_agent_logs', [{
        taskId,
        agentName: step.agentName,
        status: step.status,
        message: step.message,
        payload: step.payload,
        timestamp: step.timestamp,
        evidenceBundleId: step.payload?.evidenceBundleId,
        formula: step.payload?.formula,
        impactMetric: step.payload?.impactMetric,
        complianceScore: step.payload?.complianceScore,
      }]);
    }
  }

   // Evidence Operations
   async createEvidenceRecord(input: Record<string, unknown>): Promise<Record<string, unknown>> {
     const evidence = {
       id: this.generateUUID(),
       ...input,
       created_at: new Date().toISOString(),
     };

     const { data, error } = await this.supabase
       .from('evidence_records')
       .insert([evidence])
       .select()
       .single();

     if (error) throw error;

     // Sync to OmniTable
     if (this.omniTableClient && typeof (this.omniTableClient as any).createRecords === 'function') {
       await (this.omniTableClient as any).createRecords('esg_evidence', [evidence]);
     }

     return data;
   }

   async getEvidenceRecords(): Promise<Record<string, unknown>[]> {
     const { data, error } = await this.supabase.from('evidence_records').select('*');
     if (error) throw error;
     return data ?? [];
   }

  // Helper Methods
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
  }

   // Get latest agent tasks with OmniTable integration
   async getLatestAgentTasks(limit: number = 10): Promise<AgentTask[]> {
     const { data, error } = await this.supabase
       .from('agent_tasks')
       .select('*')
       .order('createdAt', { ascending: false })
       .limit(limit);

     if (error) throw error;
     return data ?? [];
   }

   // Search by compliance framework
   async searchByCompliance(framework: string): Promise<AgentTask[]> {
     const { data, error } = await this.supabase
       .from('agent_tasks')
       .select('*')
       .ilike('targetFramework', `%${framework}%`);

     if (error) throw error;
     return data ?? [];
   }
}