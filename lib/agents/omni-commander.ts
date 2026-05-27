import { ADKAgent, ADKSwarm } from './adk-core';
import { ai } from './genkit';
import { createHash } from 'crypto';
import { GRI_CHAPTERS } from '../constants/chapters';
import { saveSustainWriteSection } from '../dataconnect-memory';

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
    console.log('[OmniCommander] 🚀 Starting Autonomous SustainWrite Pilot...');
    hermes.publish('MISSION_START', { mission: 'Autonomous SustainWrite Pilot', totalChapters: GRI_CHAPTERS.length });

    const results = [];

    for (const chapter of GRI_CHAPTERS) {
      hermes.publish('AGENT_TASK', { agent: 'ESG_Researcher', task: `Generating content for ${chapter.title}` });
      
      const researcherAgent = this.swarm.getAgent('ESG_Researcher');
      if (!researcherAgent) continue;

      try {
        const genResponse = await researcherAgent.run(`Write a detailed professional draft for the ESG report chapter: ${chapter.title} (${chapter.gri}).`, ctx);

        if (!genResponse.success || !genResponse.output) {
          hermes.publish('AGENT_ERROR', { agent: 'ESG_Researcher', chapter: chapter.id, error: genResponse.error });
          continue;
        }

        const content = genResponse.output;
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
      } catch (err: any) {
        console.error(`[OmniCommander] Error in chapter ${chapter.id}:`, err);
      }
    }

    hermes.publish('MISSION_COMPLETE', { mission: 'Autonomous SustainWrite Pilot', totalSealed: results.length });

    return {
      success: true,
      message: 'Autonomous Pilot Complete.',
      results
    };
  }
}
