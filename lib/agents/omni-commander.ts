import { ADKAgent, ADKSwarm } from './adk-core';
import { ai } from './genkit';

/**
 * Hermes: High-Speed Event & Message Bus
 * v1.0.0 | System-Wide Coordination
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
 * Focuses on direct technical tasks and rapid execution.
 */
export const agent0 = new ADKAgent({
  name: 'Agent0',
  role: 'Technical Executor and Code Specialist',
  model: 'googleai/gemini-2.0-flash',
  systemPrompt: `
You are Agent0, the core technical executor of OmniCore.
Your focus is precision, code integrity, and direct action.
You respond to Hermes events and execute low-level operations.
  `
});

/**
 * OmniAgent: Supreme Commander
 * Orchestrates the entire swarm and makes high-level decisions.
 */
export class OmniCommander extends ADKAgent {
  private swarm: ADKSwarm;

  constructor(swarm: ADKSwarm) {
    super({
      name: 'OmniAgent',
      role: 'Supreme Commander of the ESG GO Platform',
      model: 'googleai/gemini-2.0-flash-exp', // Adjusted for compatibility
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
    
    // Logic for deciding which agents to deploy
    const planResponse = await this.run(`Create an execution plan for: ${task}`, context);
    
    hermes.publish('COMMAND_ISSUED', { task, plan: planResponse.output });

    // Execute the plan (Simplified broadcast for now)
    const swarmResults = await this.swarm.broadcast(task, context);

    return {
      commanderOutput: planResponse.output,
      swarmResults
    };
  }
}
