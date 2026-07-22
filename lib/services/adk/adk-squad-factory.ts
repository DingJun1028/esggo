import { LlmAgent, Runner, InMemorySessionService } from '@google/adk';

/**
 * ADK Squad Factory
 * Responsible for orchestrating the creation of Agents, Tools, and Runners 
 * according to the Phase 9 Advanced ADK patterns.
 */
export class AdkSquadFactory {
  private static sessionService = new InMemorySessionService();

  /**
   * Creates a standardized Information One Agent.
   */
  static createAgent(config: {
    name: string;
    description: string;
    model?: string;
    instruction: string;
    tools?: any[];
  }) {
    return new LlmAgent({
      name: config.name,
      description: config.description,
      model: config.model || 'gemini-2.5-flash',
      instruction: config.instruction,
      tools: config.tools || [],
    });
  }

  /**
   * Bridges a defineRune config to an ADK compatible tool.
   * Simulates MCP (Model Context Protocol) by allowing agents to call these functional Runes.
   */
  static registerRuneAsTool(rune: any) {
    return {
      definition: {
        name: rune.name,
        description: rune.description,
        parameters: {
          type: "object",
          properties: Object.entries((rune.schema as any)._def.shape()).reduce(
            (acc: any, [key, value]: any) => {
              acc[key] = {
                type: value._def.typeName.replace('Zod', '').toLowerCase(),
                description: value.description || key
              };
              return acc;
            }, {}
          ),
          required: Object.keys((rune.schema as any)._def.shape())
        }
      },
      execute: async (args: any) => {
        return await rune.execute({}, args);
      }
    };
  }

  /**
   * Creates a Runner to orchestrate agent execution.
   */
  static createRunner(rootAgent: any, sessionService?: any) {
    return new Runner({
      agent: rootAgent,
      sessionService: sessionService || this.sessionService,
      appName: 'InfoOne-ESG-Swarm'
    });
  }

  /**
   * Get the global in-memory session service (for development).
   */
  static getSessionService() {
    return this.sessionService;
  }
}
