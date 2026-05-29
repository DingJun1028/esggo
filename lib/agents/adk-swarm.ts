import { ADKAgent, AgentConfig } from './adk-core';
import { ADK_STANDARD_TOOLS } from './adk-tools';
import { agent0, OmniCommander, omniAgentBus } from './omni-commander';
import { auditSealTool, auditSealValidationTool } from '../tools/audit-seal';
import { parsePdfTool, parseImageTool } from '../tools/evidence-genkit-tool';
import { memoryStore } from '../memory/memory-store';

const AGENT_TOOLS = [auditSealTool, auditSealValidationTool, parsePdfTool, parseImageTool];

export const esgResearcher = new ADKAgent({
  name: 'ESG_Researcher',
  role: 'Sustainability Data Specialist',
  model: 'googleai/gemini-1.5-flash',
  systemPrompt: `
You are the ESG_Researcher. Your specialty is GRI, SASB, and TCFD mapping.
You help identify relevant metrics and draft professional sustainability content.
  `,
  tools: [...ADK_STANDARD_TOOLS, ...AGENT_TOOLS]
});

export const esgAuditor = new ADKAgent({
  name: 'ESG_Auditor',
  role: 'Internal Control and 5T Compliance Officer',
  model: 'googleai/gemini-1.5-flash',
  systemPrompt: `
You are the ESG_Auditor. You verify the 5T integrity (Traceable, Transparent, Tangible, Trustworthy, Trackable).
You look for data gaps, check hash locks, and perform automated ZKP-like verification.
  `,
  tools: [...ADK_STANDARD_TOOLS, ...AGENT_TOOLS]
});

export const esgStrategist = new ADKAgent({
  name: 'ESG_Strategist',
  role: 'External Communication and Strategic Alignment',
  model: 'googleai/gemini-1.5-pro',
  systemPrompt: `
You are the ESG_Strategist. You help align sustainability goals with corporate strategy.
You focus on Notion syncing, report visualization, and executive summaries.
  `,
  tools: [...ADK_STANDARD_TOOLS, ...AGENT_TOOLS]
});

export const esgConsultant = new ADKAgent({
  name: 'ESG_Consultant',
  role: 'Sustainability Framework Expert',
  model: 'googleai/gemini-1.5-pro',
  systemPrompt: `
You are the ESG_Consultant. You specialize in advising companies on ESG framework adoption.
You help with materiality assessments, gap analysis, and improvement strategies.
You can map to GRI, SASB, TCFD, and emerging frameworks like TNFD.
  `,
  tools: [...ADK_STANDARD_TOOLS, ...AGENT_TOOLS]
});

class CollaborativeSwarmAgent {
  private agent: ADKAgent;
  private memorySummary: string = 'Initial swarm memory summary';

  constructor(private agentConfig: Omit<AgentConfig, 'tools'>) {
    this.agent = new ADKAgent(agentConfig);
  }

  public async execute(task: string, context?: any): Promise<any> {
    const retrievedMemories = memoryStore.search(task, 3);

    if (retrievedMemories.length === 0) {
      return this.agent.run(task, context);
    }

    const enhancedContext = {
      ...context || {},
      retrievedMemories,
      memorySummary: this.generateMemorySummary(retrievedMemories)
    };

    return this.agent.run(task, enhancedContext);
  }

  private generateMemorySummary(memories: any[]): string {
    return `Summarized insights from past similar tasks: ${memories.map(m => `${m.task} resulted in: ${m.result}`).join(', ')}`;
  }

  get name(): string {
    return this.agentConfig.name;
  }

  get config(): AgentConfig {
    return this.agentConfig as AgentConfig;
  }
}

export class CollaborativeADKSwarm {
  private agents: Map<string, CollaborativeSwarmAgent> = new Map();

  register(agentConfig: Omit<AgentConfig, 'tools'>) {
    this.agents.set(agentConfig.name, new CollaborativeSwarmAgent(agentConfig));
    return this;
  }

  async collaborate(task: string, context?: any) {
    const agentResults: { [key: string]: any } = {};

    for (const agent of this.agents.values()) {
      const result = await agent.execute(task, context);
      agentResults[agent.name] = result;
    }

    const negotiationResult = await this.swarmNegotiate(agentResults);
    return negotiationResult ?? agentResults;
  }

  private swarmNegotiate(results: { [key: string]: any }): { [key: string]: any } | null {
    const values = Object.values(results);
    const allSame = values.every(v => v === values[0] && typeof v !== 'undefined');
    if (allSame) {
      return results;
    }

    const successfulEntries = Object.fromEntries(
      Object.entries(results).filter(([_, val]) => val && typeof val !== 'undefined' && !(val.error || val.simulated))
    );
    if (Object.keys(successfulEntries).length > 0) {
      return successfulEntries;
    }

    return null;
  }
}

/**
 * Instantiate the collaborative swarm with the same agents as before
 */
export const omniSwarm = new CollaborativeADKSwarm();
omniSwarm.register({ name: 'ESG_Researcher', role: 'Sustainability Data Specialist', model: 'googleai/gemini-1.5-flash', systemPrompt: `
You are the ESG_Researcher. Your specialty is GRI, SASB, and TCFD mapping.
You help identify relevant metrics and draft professional sustainability content.
  ` });
omniSwarm.register({ name: 'ESG_Auditor', role: 'Internal Control and 5T Compliance Officer', model: 'googleai/gemini-1.5-flash', systemPrompt: `
You are the ESG_Auditor. You verify the 5T integrity (Traceable, Transparent, Tangible, Trustworthy, Trackable).
You look for data gaps, check hash locks, and perform automated ZKP-like verification.
  ` });
omniSwarm.register({ name: 'ESG_Strategist', role: 'External Communication and Strategic Alignment', model: 'googleai/gemini-1.5-pro', systemPrompt: `
You are the ESG_Strategist. You help align sustainability goals with corporate strategy.
You focus on Notion syncing, report visualization, and executive summaries.
  ` });
omniSwarm.register({ name: 'ESG_Consultant', role: 'Sustainability Framework Expert', model: 'googleai/gemini-1.5-pro', systemPrompt: `
You are the ESG_Consultant. You specialize in advising companies on ESG framework adoption.
You help with materiality assessments, gap analysis, and improvement strategies.
You can map to GRI, SASB, TCFD, and emerging frameworks like TNFD.
  ` });
omniSwarm.register({ name: 'Agent0', role: 'Technical Executor and Code Specialist', model: 'googleai/gemini-1.5-flash', systemPrompt: `
You are Agent0, the core technical executor of OmniCore.
Your focus is precision, code integrity, and direct action.
You respond to OmniAgent events and execute low-level operations.
  ` });

export const omniAgent = new OmniCommander(omniSwarm);