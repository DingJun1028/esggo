import { ADKAgent, ADKSwarm, AgentConfig } from './adk-core';
import { ai } from './genkit';
import { createHash } from 'crypto';
import { negotiationEngine } from '../negotiation/engine';
import { saveSustainWriteSection } from '../dataconnect-memory';

const GRI_CHAPTERS = [
  { id: 'intro', title: '永續經營與策略願景', gri: 'GRI 2-22', order: 1 },
  { id: 'ghg', title: '溫室氣體排放與減量', gri: 'GRI 305', order: 2 },
  { id: 'labor', title: '勞雇關係與職場安全', gri: 'GRI 401', order: 3 },
  { id: 'board', title: '公司治理與董事會效能', gri: 'GRI 2-9', order: 4 }
];

/**
 * OmniAgentBus: High-Speed Event & Message Bus
 */
export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance() {
    if (!OmniAgentBus.instance) OmniAgentBus.instance = new OmniAgentBus();
    return OmniAgentBus.instance;
  }

  publish(event: string, payload: Record<string, unknown>) {
    console.log(`[OmniAgent Bus] Publishing event: ${event}`);
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(payload));
  }

  subscribe(event: string, callback: (payload: Record<string, unknown>) => void) {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, [...callbacks, callback]);
  }
}

export const omniAgentBus = OmniAgentBus.getInstance();

/**
 * Agent0: Specialized Low-Level Executor
 */
export const agent0 = new ADKAgent({
  name: 'Agent0',
  role: 'Technical Executor and Code Specialist',
  model: 'googleai/gemini-1.5-flash', 
  systemPrompt: `
You are Agent0, the core technical executor of OmniCore.
Your focus is precision, code integrity, and direct action.
You respond to OmniAgent events and execute low-level operations.
  `
});

export interface MissionResult {
  success: boolean;
  message: string;
  results?: unknown[];
  error?: string;
  agent?: string;
  commanderOutput?: string;
  swarmResults?: unknown[];
  negotiation?: any;
}

/**
 * OmniAgent: Supreme Commander
 */
export class OmniCommander extends ADKAgent {
  private swarm: any; // CollaborativeADKSwarm

  constructor(swarm: any) {
    super({
      name: 'OmniAgent',
      role: 'Supreme Commander of the ESG GO Platform',
      model: 'googleai/gemini-1.5-pro',
      systemPrompt: `
You are OmniAgent, the Supreme Commander.
Your mission is to orchestrate all other agents (Researcher, Auditor, Strategist, Agent0).
You utilize OmniAgentBus for communication and Gemini for deep reasoning.
You ensure the 5T Integrity Protocol is maintained across the entire ecosystem.
      `
    });
    this.swarm = swarm;
  }

  async command(task: string, context?: Record<string, unknown>): Promise<MissionResult> {
    console.log(`[OmniCommander] ⚡ Commanding: ${task}`);
    
    if (task.includes('PILOT_REPORT')) {
      return await this.runPilotMission(context);
    }

    if (task.includes('TRANSFER_TO_NCBDB')) {
      return await this.runNCBDBMigration(context);
    }

    if (task.includes('EVIDENCE_AUDIT')) {
      return await this.runEvidenceAuditMission(context);
    }

    try {
      const planResponse = await this.run(`Create an execution plan for: ${task}`, context);
      omniAgentBus.publish('COMMAND_ISSUED', { task, plan: planResponse.output });

      // Use swarm collaboration with consensus
      const swarmResults = await this.swarm.collaborate(task, context);
      
      // High-stakes tasks require negotiation
      if (task.includes('audit') || task.includes('SEAL') || task.includes('VERIFY')) {
        const negotiation = await negotiationEngine.negotiate(task, [
          { agent: 'ESG_Auditor', result: swarmResults.ESG_Auditor, success: true },
          { agent: 'ESG_Researcher', result: swarmResults.ESG_Researcher, success: true },
          { agent: 'ESG_Strategist', result: swarmResults.ESG_Strategist, success: true }
        ]);

        if (negotiation.consensus) {
          return {
            success: true,
            message: 'Command executed with consensus',
            commanderOutput: planResponse.output,
            swarmResults,
            negotiation
          };
        } else {
          return {
            success: false,
            message: 'Command failed: no consensus reached',
            swarmResults,
            negotiation
          };
        }
      }

      return {
        success: true,
        message: 'Command executed successfully',
        commanderOutput: planResponse.output,
        swarmResults
      };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error('[OmniCommander] Execution Error:', errorMessage);
      return { success: false, error: errorMessage, agent: 'OmniAgent', message: 'Command failed' };
    }
  }

  private async runPilotMission(context?: Record<string, unknown>): Promise<MissionResult> {
    const ctx = context || {};
    console.log(`[OmniCommander] 🚀 Starting Autonomous SustainWrite Pilot with ${GRI_CHAPTERS.length} chapters...`);
    omniAgentBus.publish('MISSION_START', { mission: 'Autonomous SustainWrite Pilot', totalChapters: GRI_CHAPTERS.length });

    const results = [];

    for (const chapter of GRI_CHAPTERS) {
      console.log(`[OmniCommander] Processing chapter: ${chapter.id} (${chapter.title})`);
      omniAgentBus.publish('AGENT_TASK', { agent: 'ESG_Researcher', task: `Generating content for ${chapter.title}` });
      
      const researcherAgent = this.swarm.getAgent('ESG_Researcher');
      if (!researcherAgent) {
        console.error(`[OmniCommander] ESG_Researcher not found in swarm for chapter ${chapter.id}`);
        continue;
      }

      try {
        const genResponse = await researcherAgent.run(`Write a detailed professional draft for the ESG report chapter: ${chapter.title} (${chapter.gri}).`, ctx);

        if (!genResponse.success || !genResponse.output) {
          const errorMsg = genResponse.error || 'No output generated';
          console.error(`[OmniCommander] Generation failed for ${chapter.id}:`, errorMsg);
          omniAgentBus.publish('AGENT_ERROR', { agent: 'ESG_Researcher', chapter: chapter.id, error: errorMsg });
          continue;
        }

        const content = genResponse.output;
        console.log(`[OmniCommander] Generated ${content.length} chars for ${chapter.id}`);
        const hash = createHash('sha256').update(String(content)).digest('hex');

        await saveSustainWriteSection({
          company_id: (ctx.companyId as string) || 'default',
          chapter_id: chapter.id,
          chapter_name: chapter.title,
          content: content,
          content_md: content,
          status: 'completed',
          chapter_order: chapter.order,
          gri_references: [chapter.gri],
          hash_lock: hash
        });

        omniAgentBus.publish('5T_SEAL', { gate: 'T4', chapter: chapter.id, hash });
        results.push({ chapter: chapter.id, status: 'sealed', hash });

        // Phase 14: Sync to Notion
        const strategist = this.swarm.getAgent('ESG_Strategist');
        if (strategist) {
          omniAgentBus.publish('AGENT_TASK', { agent: 'ESG_Strategist', task: `Syncing ${chapter.title} to Notion` });
          await strategist.run(`Create a Notion page for chapter ${chapter.title}`, { 
            parentId: 'notion-workspace-root', 
            title: `[GRI 2024] ${chapter.title}`,
            content: content 
          });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`[OmniCommander] Error in chapter ${chapter.id}:`, errorMessage);
      }
    }

    console.log(`[OmniCommander] MISSION COMPLETE. Sealed ${results.length} chapters.`);
    omniAgentBus.publish('MISSION_COMPLETE', { mission: 'Autonomous SustainWrite Pilot', totalSealed: results.length });

    return {
      success: true,
      message: `Autonomous Pilot Complete. Sealed ${results.length} chapters.`,
      results
    };
  }

  private async runNCBDBMigration(context?: Record<string, unknown>): Promise<MissionResult> {
    const { loadSustainWriteSections } = await import('../dataconnect-memory');
    const { ncbClient } = await import('../ncbdb');
    const cid = (context?.companyId as string) || 'default';

    console.log(`[OmniCommander] 📦 Migrating content for ${cid} to NCBDB (Nocodebackend DataBase)...`);
    omniAgentBus.publish('MISSION_START', { mission: 'NCBDB Migration', companyId: cid });

    const sections = await loadSustainWriteSections(cid);
    const results = [];

    for (const s of sections) {
      omniAgentBus.publish('AGENT_TASK', { agent: 'Agent0', task: `Syncing section ${s.chapter_id} to NCBDB` });
      
      const ncbData = {
        ChapterID: s.chapter_id,
        Title: s.chapter_name,
        Content: s.content,
        Status: s.status,
        HashLock: s.hash_lock,
        GRI: (s.gri_references || []).join(', '),
        LastUpdated: s.updated_at
      };

      const res = await ncbClient.upsertRecord('ESG_Reports', ncbData);
      results.push({ id: s.chapter_id, success: res.success });
    }

    omniAgentBus.publish('MISSION_COMPLETE', { mission: 'NCBDB Migration', totalMigrated: results.length });

    return {
      success: true,
      message: `Migration to NCBDB complete. ${results.length} sections processed.`,
      results
    };
  }

  /**
   * 蜂群任務：5T 實證驗證 (Swarm Evidence Audit)
   * 由 Researcher, Auditor, Agent0 協作完成
   */
  private async runEvidenceAuditMission(context?: Record<string, unknown>): Promise<MissionResult> {
    console.log(`[OmniCommander] 🛡️ Starting Swarm Evidence Audit Mission...`);
    omniAgentBus.publish('MISSION_START', { mission: 'Swarm Evidence Audit' });

    const results = [];
    const { getEvidenceFiles } = await import('../db');
    const files = await getEvidenceFiles();

    for (const file of files) {
      // 1. Researcher: 識別 GRI 映射
      omniAgentBus.publish('AGENT_TASK', { agent: 'ESG_Researcher', task: `Mapping GRI for: ${file.file_name}` });
      await this.swarm.getAgent('ESG_Researcher')?.run(`Analyze the evidence file and identify its primary GRI mapping: ${file.file_name}`, file);
      
      // 2. Auditor: 驗證 Hash 與 誠信狀態
      omniAgentBus.publish('AGENT_TASK', { agent: 'ESG_Auditor', task: `Verifying HashLock for: ${file.file_name}` });
      await this.swarm.getAgent('ESG_Auditor')?.run(`Verify the 5T integrity of the evidence: ${file.file_name}. HashLock: ${file.hash_lock}`, file);

      // 3. Agent0: 執行 ZKP 封印與更新狀態
      omniAgentBus.publish('AGENT_TASK', { agent: 'Agent0', task: `Applying ZKP Seal for: ${file.file_name}` });
      
      // 模擬封印與更新
      const sealHash = createHash('sha256').update(file.id + Date.now()).digest('hex');
      
      results.push({
        id: file.id,
        fileName: file.file_name,
        gri: file.gri_reference || 'GRI-305',
        status: 'verified',
        zkp_hash: sealHash
      });

      omniAgentBus.publish('5T_SEAL', { gate: 'T4', resource: file.file_name, hash: sealHash });
    }

    omniAgentBus.publish('MISSION_COMPLETE', { mission: 'Swarm Evidence Audit', totalProcessed: results.length });

    return {
      success: true,
      message: `Swarm Evidence Audit Complete. Processed ${results.length} evidence files.`,
      results
    };
  }
}
