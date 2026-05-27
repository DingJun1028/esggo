import { z } from 'genkit';
import { ai } from './genkit';

/**
 * ADK Core: Agent Abstraction Layer
 * v1.0.0 | High-Performance Multi-Agent Orchestration
 */

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt?: string;
  tools?: any[];
  model?: any;
}

export class ADKAgent {
  readonly config: AgentConfig;
  private memory: { task: string; response: string; timestamp: string }[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async run(task: string, context?: any) {
    console.log(`[ADK Agent - ${this.config.name}] Executing task: ${task}`);

    const finalSystemPrompt = this.config.systemPrompt || `
You are ${this.config.name}, an expert ${this.config.role}.
Maintain high technical integrity and follow the 5T protocol.
    `;

    try {
      const response = await ai.generate({
        model: this.config.model || 'googleai/gemini-2.0-flash',
        system: finalSystemPrompt,
        prompt: `Task: ${task}\nContext: ${JSON.stringify(context || {})}`,
        tools: this.config.tools,
        config: { temperature: 0.2 }
      });

      const result = response.text || 'No response generated.';
      this.memory.push({ task, response: result, timestamp: new Date().toISOString() });

      return {
        success: true,
        agent: this.config.name,
        output: result,
        toolCalls: response.toolCalls
      };
    } catch (error: any) {
      console.error(`[ADK Agent - ${this.config.name}] Error:`, error);
      return {
        success: false,
        agent: this.config.name,
        error: error.message
      };
    }
  }

  getHistory() {
    return [...this.memory];
  }
}

/**
 * ADK Swarm: Coordinated Multi-Agent Execution
 */
export class ADKSwarm {
  private agents: Map<string, ADKAgent> = new Map();

  register(agent: ADKAgent) {
    this.agents.set(agent.config.name, agent);
    return this;
  }

  getAgent(name: string) {
    return this.agents.get(name);
  }

  async broadcast(task: string, context?: any) {
    const results = await Promise.all(
      Array.from(this.agents.values()).map(agent => agent.run(task, context))
    );
    return results;
  }
}
