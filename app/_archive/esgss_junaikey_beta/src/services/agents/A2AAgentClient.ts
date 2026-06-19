/**
 * 🤖 A2A Agent Client - Agent-to-Agent Protocol
 * --------------------------------------------------
 * [Core] A2A Protocol Client
 * [Function] Call external AI agents (LangGraph, Vertex AI, etc.)
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

// ============================================================================
// Types (Aligned with A2A Protocol)
// ============================================================================

export interface A2AMessage {
  role: 'user' | 'agent';
  parts: A2AMessagePart[];
  messageId: string;
}

export interface A2AMessagePart {
  kind: 'text' | 'file' | 'tool_call' | 'tool_result';
  text?: string;
  file?: {
    name: string;
    mimeType: string;
    bytes: string; // base64
  };
  toolCall?: {
    name: string;
    arguments: Record<string, any>;
  };
  toolResult?: {
    name: string;
    result: any;
  };
}

export interface A2ASendMessageRequest {
  id: string;
  params: {
    message: A2AMessage;
  };
}

export interface A2ASendMessageResponse {
  id: string;
  result?: {
    message: A2AMessage;
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface A2AAgentCard {
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: string[];
}

export interface A2AAgentConfig {
  name: string;
  description: string;
  baseUrl: string;
  apiKey?: string;
}

// ============================================================================
// A2A Agent Client Class
// ============================================================================

class A2AAgentClient {
  private agents: Map<string, A2AAgentConfig> = new Map();

  constructor() {
    this.loadAgentsFromEnv();
  }

  /**
   * Load agent configs from environment
   */
  private loadAgentsFromEnv(): void {
    const env = (import.meta as any)?.env || {};

    // ESG Analyzer Agent
    const esgAgentUrl = env.VITE_ESG_AGENT_URL;
    if (esgAgentUrl) {
      this.registerAgent({
        name: 'esg-analyzer',
        description: 'ESG Data Analysis and Insights Agent',
        baseUrl: esgAgentUrl,
      });
    }

    // Report Writer Agent
    const reportAgentUrl = env.VITE_REPORT_AGENT_URL;
    if (reportAgentUrl) {
      this.registerAgent({
        name: 'report-writer',
        description: 'Sustainability Report Writing Agent',
        baseUrl: reportAgentUrl,
      });
    }

    // LiteLLM Proxy A2A endpoint (if configured)
    const litellmProxyUrl = env.VITE_LITELLM_PROXY_URL;
    if (litellmProxyUrl) {
      this.registerAgent({
        name: 'litellm-agent',
        description: 'LiteLLM Proxy A2A Gateway',
        baseUrl: `${litellmProxyUrl}/a2a`,
      });
    }
  }

  /**
   * Register an A2A agent
   */
  registerAgent(config: A2AAgentConfig): void {
    this.agents.set(config.name, config);
    omniLogger.info(LogCategory.AI, 'A2A agent registered', {
      source_origin: 'A2AAgentClient',
      agentName: config.name,
    });
  }

  /**
   * Get registered agents
   */
  getAgents(): A2AAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent card (metadata)
   */
  async getAgentCard(agentName: string): Promise<A2AAgentCard | null> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent "${agentName}" not registered`);
    }

    try {
      const response = await fetch(`${agent.baseUrl}/.well-known/agent.json`, {
        headers: agent.apiKey ? { Authorization: `Bearer ${agent.apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agent card: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      omniLogger.warn(LogCategory.AI, 'Failed to get agent card, using config', {
        source_origin: 'A2AAgentClient',
        agentName,
        error: error.message,
      });

      // Return config-based card
      return {
        name: agent.name,
        description: agent.description,
        url: agent.baseUrl,
        version: '1.0.0',
        capabilities: ['text', 'analysis'],
      };
    }
  }

  /**
   * Send message to an A2A agent
   */
  async sendMessage(
    agentName: string,
    message: string,
    context?: A2AMessagePart[]
  ): Promise<A2ASendMessageResponse> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent "${agentName}" not registered`);
    }

    const messageId = crypto.randomUUID();
    const requestId = crypto.randomUUID();

    const request: A2ASendMessageRequest = {
      id: requestId,
      params: {
        message: {
          role: 'user',
          parts: [{ kind: 'text', text: message }, ...(context || [])],
          messageId,
        },
      },
    };

    try {
      const response = await fetch(`${agent.baseUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(agent.apiKey ? { Authorization: `Bearer ${agent.apiKey}` } : {}),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.statusText}`);
      }

      const result: A2ASendMessageResponse = await response.json();

      omniLogger.info(LogCategory.AI, 'A2A message sent', {
        source_origin: 'A2AAgentClient',
        agentName,
        requestId,
        hasResult: !!result.result,
      });

      return result;
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'A2A message failed', {
        source_origin: 'A2AAgentClient',
        agentName,
        error: error.message,
      });

      // Return mock response for development

      const isDev = (import.meta as any)?.env?.DEV;
      if (isDev) {
        return this.getMockResponse(agentName, message, requestId);
      }

      return {
        id: requestId,
        error: {
          code: -1,
          message: error.message,
        },
      };
    }
  }

  /**
   * Mock response for development
   */
  private getMockResponse(
    agentName: string,
    message: string,
    requestId: string
  ): A2ASendMessageResponse {
    const mockResponses: Record<string, string> = {
      'esg-analyzer': `According to the analysis, your ESG data shows:
- Environmental (E): Scope 1 and 2 emissions align with decimalization path
- Social (S): Employee welfare indicators performing well
- Governance (G): Recommend strengthening independent director oversight mechanisms`,

      'report-writer': `Generated sustainability report chapter draft:

## Environmental Sustainability Performance

This year's environmental sustainability performance is significant. By introducing an AI energy management system,
Scope 2 carbon emissions decreased by 15% compared to last year, achieving the annual carbon reduction goal.`,

      'litellm-agent': `LiteLLM Agent Response: Analysis for ${message.slice(0, 50)}... has been completed.`,
    };

    return {
      id: requestId,
      result: {
        message: {
          role: 'agent',
          parts: [
            {
              kind: 'text',
              text: mockResponses[agentName] || `Agent "${agentName}" has processed your request.`,
            },
          ],
          messageId: crypto.randomUUID(),
        },
      },
    };
  }

  /**
   * Chat with agent (convenience method)
   */
  async chat(agentName: string, message: string): Promise<string> {
    const response = await this.sendMessage(agentName, message);

    if (response.error) {
      throw new Error(response.error.message);
    }

    const textPart = response.result?.message.parts.find(p => p.kind === 'text');
    return textPart?.text || '';
  }

  /**
   * Analyze ESG data using agent
   */
  async analyzeESG(data: any): Promise<string> {
    const message = `Please analyze the following ESG data and provide insights:\n${JSON.stringify(data, null, 2)}`;
    return this.chat('esg-analyzer', message);
  }

  /**
   * Generate report section using agent
   */
  async generateReport(section: string, context: string): Promise<string> {
    const message = `Please write the sustainability report chapter "${section}".\n\nBackground information:\n${context}`;
    return this.chat('report-writer', message);
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const a2aAgentClient = new A2AAgentClient();
export default a2aAgentClient;
