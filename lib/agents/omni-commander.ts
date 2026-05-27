import { ADKAgent, ADKSwarm } from './adk-core';
import { ai } from './genkit';
import { createHash } from 'crypto';
import { saveSustainWriteSection } from '../dataconnect-memory';

const GRI_CHAPTERS = [
  { id: 'intro', title: '永續經營與策略願景', gri: 'GRI 2-22', order: 1 },
  { id: 'ghg', title: '溫室氣體排放與減量', gri: 'GRI 305', order: 2 },
  { id: 'labor', title: '勞雇關係與職場安全', gri: 'GRI 401', order: 3 },
  { id: 'board', title: '公司治理與董事會效能', gri: 'GRI 2-9', order: 4 }
];

/**
 * Hermes: High-Speed Event & Message Bus
 */
export class HermesBus {
  private static instance: HermesBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance() {
    if (!HermesBus.instance) HermesBus.instance = new HermesBus();
    return HermesBus.instance;
  }

  publish(event: string, payload: any) {
    console.log(`[Hermes Bus] Publishing event: ${event}`);
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(payload));
  }

  subscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event) || [];
    this.listeners.set(event, [...callbacks, callback]);
  }
}

export const hermes = HermesBus.getInstance();

/**
 * Agent0: Specialized Low-Level Executor
 */
export const agent0 = new ADKAgent({
  name: 'Agent0',
  role: 'Technical Executor and Code Specialist',
  model: 'googleai/gemini-1.5-flash', // More stable model ID
  systemPrompt: `
You are Agent0, the core technical executor of OmniCore.
Your focus is precision, code integrity, and direct action.
You respond to Hermes events and execute low-level operations.
  `
});

/**
 * OmniAgent: Supreme Commander
 */
export class OmniCommander extends ADKAgent {
  private swarm: ADKSwarm;

  constructor(swarm: ADKSwarm) {
    super({
      name: 'OmniAgent',
      role: 'Supreme Commander of the ESG GO Platform',
      model: 'googleai/gemini-1.5-pro', // More stable reasoning model
      systemPrompt: `
You are OmniAgent, the Supreme Commander.
Your mission is to orchestrate all other agents (Researcher, Auditor, Strategist, Agent0).
You utilize Hermes for communication and Gemini for deep reasoning.
You ensure the 5T Integrity Protocol is maintained across the entire ecosystem.
      `
    });
    this.swarm = swarm;
  }

  async command(task: string, context?: any) {
    console.log(`[OmniCommander] ⚡ Commanding: ${task}`);
    
    if (task.includes('PILOT_REPORT')) {
      return await this.runPilotMission(context);
    }

    if (task.includes('TRANSFER_TO_NOCODB')) {
      return await this.runNocoDBMigration(context);
    }

    try {
      const planResponse = await this.run(`Create an execution plan for: ${task}`, context);
      hermes.publish('COMMAND_ISSUED', { task, plan: planResponse.output });
      const swarmResults = await this.swarm.broadcast(task, context);
      
      return {
        commanderOutput: planResponse.output,
        swarmResults
      };
    } catch (e: any) {
      console.error('[OmniCommander] Execution Error:', e);
      return { success: false, error: e.message, agent: 'OmniAgent' };
    }
  }

  private async runPilotMission(context: any) {
    const ctx = context || {};
    console.log(`[OmniCommander] 🚀 Starting Autonomous SustainWrite Pilot with ${GRI_CHAPTERS.length} chapters...`);
    hermes.publish('MISSION_START', { mission: 'Autonomous SustainWrite Pilot', totalChapters: GRI_CHAPTERS.length });

    const results = [];

    for (const chapter of GRI_CHAPTERS) {
      console.log(`[OmniCommander] Processing chapter: ${chapter.id} (${chapter.title})`);
      hermes.publish('AGENT_TASK', { agent: 'ESG_Researcher', task: `Generating content for ${chapter.title}` });
      
      const researcherAgent = this.swarm.getAgent('ESG_Researcher');
      if (!researcherAgent) {
        console.error(`[OmniCommander] ESG_Researcher not found in swarm for chapter ${chapter.id}`);
        continue;
      }

      try {
        const genResponse = await researcherAgent.run(`Write a detailed professional draft for the ESG report chapter: ${chapter.title} (${chapter.gri}).`, ctx);

        if (!genResponse.success || !genResponse.output) {
          console.error(`[OmniCommander] Generation failed for ${chapter.id}:`, genResponse.error);
          hermes.publish('AGENT_ERROR', { agent: 'ESG_Researcher', chapter: chapter.id, error: genResponse.error });
          continue;
        }

        const content = genResponse.output;
        console.log(`[OmniCommander] Generated ${content.length} chars for ${chapter.id}`);
        const hash = createHash('sha256').update(String(content)).digest('hex');

        await saveSustainWriteSection({
          company_id: ctx.companyId || 'default',
          chapter_id: chapter.id,
          chapter_name: chapter.title,
          content: content,
          content_md: content,
          status: 'completed',
          chapter_order: chapter.order,
          gri_references: [chapter.gri],
          hash_lock: hash
        });

        hermes.publish('5T_SEAL', { gate: 'T4', chapter: chapter.id, hash });
        results.push({ chapter: chapter.id, status: 'sealed', hash });

        // Phase 14: Sync to Notion
        const strategist = this.swarm.getAgent('ESG_Strategist');
        if (strategist) {
          hermes.publish('AGENT_TASK', { agent: 'ESG_Strategist', task: `Syncing ${chapter.title} to Notion` });
          await strategist.run(`Create a Notion page for chapter ${chapter.title}`, { 
            parentId: 'notion-workspace-root', 
            title: `[GRI 2024] ${chapter.title}`,
            content: content 
          });
        }
      } catch (err: any) {
        console.error(`[OmniCommander] Error in chapter ${chapter.id}:`, err);
      }
    }

    console.log(`[OmniCommander] MISSION COMPLETE. Sealed ${results.length} chapters.`);
    hermes.publish('MISSION_COMPLETE', { mission: 'Autonomous SustainWrite Pilot', totalSealed: results.length });

    return {
      success: true,
      message: `Autonomous Pilot Complete. Sealed ${results.length} chapters.`,
      results
    };
  }

  private async runNocoDBMigration(context: any) {
    const { loadSustainWriteSections } = require('../dataconnect-memory');
    const { nocoClient } = require('../nocodb');
    const cid = context?.companyId || 'default';

    console.log(`[OmniCommander] 📦 Migrating content for ${cid} to NocoDB...`);
    hermes.publish('MISSION_START', { mission: 'NocoDB Migration', companyId: cid });

    const sections = await loadSustainWriteSections(cid);
    const results = [];

    for (const s of sections) {
      hermes.publish('AGENT_TASK', { agent: 'Agent0', task: `Syncing section ${s.chapter_id} to NocoDB` });
      
      const nocoData = {
        ChapterID: s.chapter_id,
        Title: s.chapter_name,
        Content: s.content,
        Status: s.status,
        HashLock: s.hash_lock,
        GRI: (s.gri_references || []).join(', '),
        LastUpdated: s.updated_at
      };

      const res = await nocoClient.upsertRecord('ESG_Reports', nocoData);
      results.push({ id: s.chapter_id, success: res.success });
    }

    hermes.publish('MISSION_COMPLETE', { mission: 'NocoDB Migration', totalMigrated: results.length });

    return {
      success: true,
      message: `Migration to NocoDB complete. ${results.length} sections processed.`,
      results
    };
  }
}
