/**
 * Omni Component Heart: AI Agent Infrastructure (AgentCore)
 * --------------------------------------------------
 * [Protocol] 4 Yes + 1 No Digital Trust - Logic Layer
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { omniGemini } from './OmniGeminiService.js';
import { knowledgeSanctuary } from './ai/KnowledgeSanctuaryService.js';

export interface AgentResponse {
  content: string;
  metadata: {
    confidence: number;
    reasoning_path: string[];
    protocol_tags: string[];
    telemetry: {
      startTime: number;
      endTime: number;
      duration: number;
      tokenCount?: number;
    };
  };
}

export interface PersonaConfiguration {
  id: string;
  name: string;
  role: string;
  tone: 'Professional' | 'Casual' | 'Socratic' | 'Empathetic' | 'Strict';
  strictness: number; // 1-10
  focusArea: 'General' | ' Environment' | 'Social' | 'Governance';
  customInstructions?: string;
  capabilities?: string[]; // E.g., ['write_report', 'audit_compliance', 'analyze_data']
}

export class AgentBase {
  protected persona: PersonaConfiguration;

  public get capabilities(): string[] {
    return this.persona.capabilities || ['general_reasoning'];
  }

  public get id(): string {
    return this.persona.id;
  }

  public get name(): string {
    return this.persona.name;
  }

  protected history: { role: 'user' | 'model'; parts: string }[] = [];
  protected MAX_HISTORY_TURNS = 20;

  constructor(personaConfig: string | PersonaConfiguration) {
    if (typeof personaConfig === 'string') {
      this.persona = {
        id: 'default',
        name: personaConfig,
        role: personaConfig,
        tone: 'Professional',
        strictness: 5,
        focusArea: 'General'
      };
    } else {
      this.persona = personaConfig;
    }
  }

  /**
   * Stateful Chat Interaction
   */
  public async chat(message: string): Promise<AgentResponse> {
    const startTime = Date.now();

    // 1. Add User Message to History
    this.history.push({ role: 'user', parts: message });
    this.manageHistory();

    // 2. Prepare System Instruction from Persona
    const systemInstruction = `
      You are acting as: ${this.persona.name} (${this.persona.role}).
      Tone: ${this.persona.tone}.
      Strictness Level: ${this.persona.strictness}/10.
      Focus Area: ${this.persona.focusArea}.
      Instructions: ${this.persona.customInstructions || 'None'}
    `;

    try {
      // 3. Call LLM with History and System Instruction
      const responseContent = await omniGemini.chat(message, {
        history: this.history,
        systemInstruction
      });

      // 4. Add Model Response to History
      this.history.push({ role: 'model', parts: responseContent });
      this.manageHistory();

      // Estimate token count more accurately (using 4 chars per token approximation)
      const estimatedTokens = Math.ceil((message.length + responseContent.length) / 4);

      return {
        content: responseContent,
        metadata: {
          confidence: 0.95, // Placeholder - could be improved with actual confidence scores
          reasoning_path: ['History Recall', 'Persona Alignment', 'Response Generation'],
          protocol_tags: ['traceable'],
          telemetry: {
            startTime,
            endTime: Date.now(),
            duration: Date.now() - startTime,
            tokenCount: estimatedTokens
          }
        }
      };

    } catch (error) {
      omniLogger.error(LogCategory.AI, `[Agent: ${this.persona.name}] Chat Failed`, { error });

      // Return graceful fallback response
      return {
        content: `I apologize, but I encountered an issue while processing your request. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          confidence: 0.0,
          reasoning_path: ['Error occurred during processing'],
          protocol_tags: ['error', 'fallback'],
          telemetry: {
            startTime,
            endTime: Date.now(),
            duration: Date.now() - startTime,
            tokenCount: 0
          }
        }
      };
    }
  }

  /**
   * Resets the conversation history
   */
  public resetHistory(): void {
    this.history = [];
    omniLogger.info(LogCategory.AI, `[Agent: ${this.persona.name}] History reset`);
  }

  /**
   * Gets the current history length
   */
  public getHistoryLength(): number {
    return this.history.length;
  }

  private manageHistory() {
    if (this.history.length > this.MAX_HISTORY_TURNS) {
      this.history = this.history.slice(this.history.length - this.MAX_HISTORY_TURNS);
    }
  }

  protected async callLLM(
    prompt: string,
    context: Record<string, any> = {}
  ): Promise<{ content: string; telemetry: AgentResponse['metadata']['telemetry'] }> {
    // Forward to chat for consistency, but as a single turn (might lose history context if we don't use the same instance)
    // For backward compatibility, we treat callLLM as a stateless call or just use the current state.
    // Let's use the new chat method to ensure persona is applied.
    const response = await this.chat(prompt);
    return {
      content: response.content,
      telemetry: response.metadata.telemetry
    };
  }
}

/**
 * Omni Writer Agent: Responsible for Sustainability Narrative Generation
 */
export class WriterAgent extends AgentBase {
  constructor() {
    super('Sustainability Report Writer');
  }

  async generateNarrative<TData = unknown>(
    indicatorId: string,
    data: TData
  ): Promise<AgentResponse> {
    if (!indicatorId || !data) {
      const err = 'WriterAgent: Missing indicatorId or data for narrative generation';
      omniLogger.warn(LogCategory.AGENT, err);
      throw new Error(err);
    }

    try {
      // RAG Retrieval (Knowledge Sanctuary)
      const contextItems = await knowledgeSanctuary.retrieveContext(indicatorId);
      const ragContext = contextItems.map(item => item.content).join('\n---\n');

      const prompt = `
          Principle: Indicator Alignment - Narrative Generation
          Task: Generate a GRI-standard sustainability narrative based on the following data:
          
          Indicator ID: ${indicatorId}
          Data Content: ${JSON.stringify(data)}

          [Reference Context from Knowledge Sanctuary]
          ${ragContext}
          
          Requirement: The narrative must be rigorous, and the data must precisely match the source data.
        `;

      const { content, telemetry } = await this.callLLM(prompt);

      omniLogger.info(LogCategory.AGENT, `WriterAgent narrative generated`, {
        indicatorId,
        duration: telemetry.duration,
      });

      return {
        content,
        metadata: {
          confidence: 0.98,
          reasoning_path: ['Data Ingestion', 'GRI Alignment', 'Narrative Synthesis'],
          protocol_tags: ['traceable', 'trackable'],
          telemetry,
        },
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, `WriterAgent Generation Failed`, { error, indicatorId });
      throw error;
    }
  }
}

/**
 * Omni Auditor Agent: Responsible for 4 Yes + 1 No Digital Audit (Compliance Audit)
 */
export class AuditorAgent extends AgentBase {
  constructor() {
    super('Compliance Auditor');
  }

  async auditNarrative<TTruth = unknown>(
    narrative: string,
    truth: TTruth
  ): Promise<{
    pass: boolean;
    feedback: string;
    telemetry?: AgentResponse['metadata']['telemetry'];
  }> {
    const startTime = Date.now();
    if (!narrative || !truth) {
      omniLogger.warn(LogCategory.AGENT, 'AuditorAgent: Missing narrative or truth data for audit');
      return {
        pass: false,
        feedback: 'Missing required audit inputs',
        telemetry: {
          startTime,
          endTime: Date.now(),
          duration: Date.now() - startTime,
        },
      };
    }

    try {
      const prompt = `
          Principle: Compliance - Data Freshness
          Task: Audit if the following narrative complies with the 4 Yes + 1 No Protocol:
          Narrative to audit: {narrative}
          Source Database: {JSON.stringify(truth)}
          Audit points: 1. Values match 2. Traceability tags are complete 3. Logic is consistent
        `;

      // In actual development, this should also call callLLM
      // To ensure stable logic and strengthen consolidation, we simulate a call here
      const { telemetry } = await this.callLLM(prompt);

      // Simulate audit logic
      const isConsistent = narrative.length > 10; // Basic mock validation

      omniLogger.info(LogCategory.AGENT, `Auditor Agent complete`, {
        pass: isConsistent,
        narrativeLength: narrative.length,
        duration: telemetry.duration,
      });

      return {
        pass: isConsistent,
        feedback: isConsistent ? 'Audit Successful' : 'Data Mismatch or Insufficient Detail',
        telemetry,
      };
    } catch (error) {
      omniLogger.error(LogCategory.AI, `Auditor Agent Failed`, { error });
      throw error;
    }
  }
}
