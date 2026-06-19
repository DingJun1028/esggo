// celestial-server/services/arvoAgent.ts
// ARVO AI System Integration
// Autonomous Reasoning and Verification Orchestrator

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../db/supabaseClient.js';
import ragService from './rag.js';
import skillExecutor from './skillExecutor.js';
import { runSwarm } from './swarmService.js';

// Lazy init wrapper
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

/**
 * ARVO Agent - Autonomous Reasoning and Verification Orchestrator
 *
 * Core pillars:
 * 1. Autonomous: Self-directed task execution
 * 2. Reasoning: Logic-based problem solving
 * 3. Verification: Fact-checking and validation
 * 4. Orchestrator: Coordinating tools and data
 */

// Type definitions for ARVO context and responses
interface ARVOContext {
  force_swarm?: boolean;
  kb_id?: string;
  history?: Array<{ role: string; parts: Array<{ text: string }> }>;
  conversation_history?: Array<{ user: string; assistant: string }>;
  [key: string]: unknown;
}

interface ARVOAction {
  skill: string;
  parameters?: Record<string, unknown>;
  expected_outcome?: string;
}

interface ARVOParsedResponse {
  analysis: string;
  reasoning: string;
  verification: string;
  actions: ARVOAction[];
  response: string;
  execution_results?: any[];
}

interface ARVOConfig {
  id?: string;
  system_prompt?: string;
  base_model?: string;
  available_skills?: string[];
}

interface ARVOProcessResult {
  status: 'success' | 'error';
  response?: string;
  arvo_reasoning?: string;
  actions_taken?: ARVOAction[];
  execution_results?: any[];
  error?: string;
  arvo_analysis?: string;
  arvo_verification?: string;
  raw_output?: string;
}

interface SkillResult {
  status: string;
  result: unknown;
  error?: string;
}

interface ExecutionContext {
  agent_id?: string;
  session_id?: string;
  hitl_approved?: boolean;
}

export class ARVOAgent {
  config: ARVOConfig;
  model: ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel> | null;
  executionHistory: Array<{
    input: string;
    analysis: string;
    reasoning: string;
    verification: string;
    actions: ARVOAction[];
    response: string;
    timestamp: string;
  }>;
  thoughtProcess: string[];
  execution_results: {
    analysis: unknown;
    reasoning: unknown;
    verification: unknown;
    actions: unknown;
    response: unknown;
  } = {
      analysis: null,
      reasoning: null,
      verification: null,
      actions: [],
      response: null
    };

  constructor(agentConfig: ARVOConfig) {
    this.config = agentConfig;
    const genAI = getGenAI();
    if (genAI) {
      this.model = genAI.getGenerativeModel({
        model: agentConfig.base_model || 'gemini-2.0-flash',
        systemInstruction: this.buildSystemInstruction(),
      });
    } else {
      console.warn('[ARVO] AI capabilities disabled: Missing API Key');
      this.model = null;
    }
    this.executionHistory = [];
    this.thoughtProcess = [];
  }

  /**
   * Builds the system instruction prompt for ARVO
   */
  buildSystemInstruction() {
    return `
You are ARVO (Autonomous Reasoning and Verification Orchestrator).
Your Core Mission: ${this.config.system_prompt}

You follow a strict 4-step cognitive process for every request:

1. ANALYZE
   - Deconstruct the user's request.
   - Identify implicit and explicit requirements.
   - Determine necessary context.

2. REASON
   - Formulate a logical plan.
   - Connect facts from the knowledge base.
   - Deduce potential outcomes.

3. VERIFY
   - Check assumptions against facts.
   - Ensure safety and compliance.
   - Validate proposed actions.

4. ORCHESTRATE
   - Select appropriate tools/skills.
   - Coordinate execution flow.
   - Synthesize final output.

Response Format:
You must respond in the following XML structure:

<arvo_analysis>
[Your analysis here]
</arvo_analysis>

<arvo_reasoning>
[Your reasoning here]
</arvo_reasoning>

<arvo_verification>
[Verification of your plan]
</arvo_verification>

<arvo_action>
{
  "skills": ["skill_name_1", "skill_name_2"],
  "parameters": {...},
  "expected_outcome": "..."
}
</arvo_action>

<arvo_response>
[Final response to the user]
</arvo_response>

Available Skills: ${this.config.available_skills ? this.config.available_skills.join(', ') : 'No skills available'}

Guidelines:
- If you are unsure, ask for clarification.
- Prioritize safety and accuracy.
- Keep the user informed of your reasoning.
`;
  }

  /**
   * Process a user input
   */
  async process(userInput: string, context: ARVOContext = {}): Promise<ARVOProcessResult> {
    try {
      console.log(`[ARVO] Processing: "${userInput}"`);

      // 0. SWARM TRIGGER: Check if this is a complex task requiring Multi-Agent Swarm
      if (userInput.includes('SWARM') || userInput.includes('swarm') || (context as ARVOContext).force_swarm) {
        console.log('[ARVO] Swarm Mode Activated!');
        try {
          const swarmResult = await runSwarm(userInput) as any;
          return {
            status: 'success',
            response: swarmResult.message || 'Swarm mission initiated.',
            arvo_reasoning: `Initiated Swarm Mission: ${swarmResult.taskId}`,
            actions_taken: [{ skill: 'swarm_initiation', parameters: { goal: userInput } }],
          };
        } catch (e) {
          console.error('[ARVO] Swarm failed:', e);
          // Fallback to normal processing
        }
      }

      // 1. RAG Retrieval
      let ragContext: any = null;
      if ((context as ARVOContext).kb_id) {
        const kbId = (context as ARVOContext).kb_id!;
        // [AWAKENING] Use Reasoned Retrieval (Gemini Synthesis)
        console.log(`[ARVO] Reasoning over Knowledge Base: ${kbId}`);
        try {
          ragContext = await ragService.synthesizeAnswer(kbId, userInput);
          console.log(
            `[ARVO] Retrieved Synthesized Knowledge length: ${ragContext ? ragContext.length : 0}`
          );
        } catch (e) {
          console.warn('[ARVO] Synthesis failed, falling back to raw chunks', e);
          ragContext = await ragService.retrieveRelevant(kbId, userInput, 3);
        }
      }

      // 2. Build Augmented Prompt
      const augmentedPrompt = this.buildAugmentedPrompt(userInput, ragContext, context);

      // 3. Call ARVO Model
      if (!this.model) {
        return {
          status: 'error',
          error: 'AI Model unavailable (Missing API Key)',
          response:
            'I cannot process your request because my AI core is currently disabled due to missing configuration.',
        };
      }

      const chat = this.model.startChat({ history: (context as ARVOContext).history || [] });
      const result = await chat.sendMessage(augmentedPrompt);
      const response = result.response.text();

      // 4. Parse Response
      const parsed = this.parseARVOResponse(response);

      // 5. Execute Actions
      if (parsed.actions && parsed.actions.length > 0) {
        const executionResults = await this.executeSkills(parsed.actions, context);
        parsed.execution_results = executionResults;
      }

      // 6. Update History
      this.executionHistory.push({
        input: userInput,
        analysis: parsed.analysis,
        reasoning: parsed.reasoning,
        verification: parsed.verification,
        actions: parsed.actions,
        response: parsed.response,
        timestamp: new Date().toISOString(),
      });

      console.log(`[ARVO] Processing complete`);

      return {
        status: 'success',
        arvo_analysis: parsed.analysis,
        arvo_reasoning: parsed.reasoning,
        arvo_verification: parsed.verification,
        actions_taken: parsed.actions,
        execution_results: parsed.execution_results,
        response: parsed.response,
        raw_output: response,
      };
    } catch (error: unknown) {
      console.error('[ARVO] Error:', error);
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        status: 'error',
        error: err.message,
        response: 'An error occurred while processing your request.',
      };
    }
  }

  /**
   * Build the prompt with RAG context and history
   */
  buildAugmentedPrompt(userInput: string, ragContext: any, context: ARVOContext): string { // Changed ragContext type to any
    let prompt = '';

    if (ragContext) {
      if (typeof ragContext === 'string') {
        prompt += `[Synthesized Knowledge]\n${ragContext}\n\n`;
      } else if (Array.isArray(ragContext) && ragContext.length > 0) {
        prompt += '[Knowledge Context]\n';
        (ragContext as any[]).forEach((chunk: any, idx: number) => {
          prompt += `${idx + 1}. ${chunk.content}\n`;
        });
        prompt += '\n';
      }
    }

    if (context.conversation_history) {
      prompt += '[Conversation History]\n';
      prompt += context.conversation_history
        .slice(-3)
        .map(h => `User: ${h.user}\nAI: ${h.assistant}`)
        .join('\n\n');
      prompt += '\n\n';
    }

    prompt += `[User Input]\n${userInput}`;

    return prompt;
  }

  /**
   * Parse the XML response from ARVO
   */
  parseARVOResponse(responseText: string): ARVOParsedResponse {
    const parsed = {
      analysis: this.extractTag(responseText, 'arvo_analysis'),
      reasoning: this.extractTag(responseText, 'arvo_reasoning'),
      verification: this.extractTag(responseText, 'arvo_verification'),
      actions: this.parseActions(this.extractTag(responseText, 'arvo_action')),
      response: this.extractTag(responseText, 'arvo_response'),
      execution_results: undefined,
    } as ARVOParsedResponse;

    return parsed;
  }

  /**
   * Extract content from XML tags
   */
  extractTag(text: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Parse actions from XML
   */
  parseActions(actionText: string | null): ARVOAction[] {
    if (!actionText) return [];

    try {
      const actionData = JSON.parse(actionText);
      if (Array.isArray(actionData.skills)) {
        return actionData.skills.map((skill: string) => ({
          skill,
          parameters: actionData.parameters || {},
          expected_outcome: actionData.expected_outcome,
        }));
      }
      if (actionData.skill) {
        return [{
          skill: actionData.skill,
          parameters: actionData.parameters || {},
          expected_outcome: actionData.expected_outcome,
        }];
      }
      return [];
    } catch (error) {
      console.error('[ARVO] Failed to parse actions:', error);
      return [];
    }
  }

  /**
   * Execute skills
   */
  async executeSkills(actions: ARVOAction[], context: ARVOContext): Promise<Array<{
    skill: string;
    status: string;
    result?: unknown;
    error?: string;
  }>> {
    const results: Array<{
      skill: string;
      status: string;
      result?: unknown;
      error?: string;
    }> = [];

    for (const action of actions) {
      try {
        console.log(`[ARVO] Executing skill: ${action.skill}`);

        const execContext: ExecutionContext = {
          agent_id: this.config.id,
          session_id: context.session_id as string | undefined,
          hitl_approved: (context.hitl_approved as boolean) || false,
        };

        const result = await skillExecutor.execute(action.skill, action.parameters || {}, execContext);

        results.push({
          skill: action.skill,
          status: result.status,
          result: result.result,
          error: result.error,
        });
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        results.push({
          skill: action.skill,
          status: 'error',
          error: err.message,
        });
      }
    }

    return results;
  }

  /**
   * Get history
   */
  getExecutionHistory() {
    return this.executionHistory;
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.executionHistory = [];
    this.thoughtProcess = [];
  }

  /**
   * Meta-Learning Reflection
   */
  async selfReflect() {
    if (this.executionHistory.length === 0) {
      return { message: 'No execution history to reflect on' };
    }

    if (!this.model) {
      return { message: 'Self-reflection unavailable (Missing API Key)' };
    }

    const reflectionPrompt = `
Analyze the following interaction history to improve future performance:

${JSON.stringify(this.executionHistory.slice(-5), null, 2)}

Provide:
1. Analysis of success/failure patterns.
2. Suggestions for improvement.
3. Potential missing skills or knowledge.
`;

    const result = await this.model.generateContent(reflectionPrompt);
    const reflection = result.response.text();

    return {
      reflection,
      history_analyzed: this.executionHistory.length,
    };
  }
}

/**
 * ARVO Agent Factory
 */
export class ARVOAgentFactory {
  static async create(agentIdOrName: string | number) {
    // Lookup agent config
    const { data: agentConfigs, error } = await supabase
      .from('agent_full_info')
      .select('*')
      .or(`id.eq.${agentIdOrName},name.eq.${agentIdOrName}`);

    if (error) {
      throw new Error(`Failed to fetch agent config: ${error.message}`);
    }

    if (!agentConfigs || agentConfigs.length === 0) {
      throw new Error(`Agent not found: ${agentIdOrName}`);
    }

    const agentConfig = agentConfigs[0];

    // Extract skills
    const availableSkills = agentConfig.skills ? agentConfig.skills.map((s: any) => s.skill_name) : [];

    return new ARVOAgent({
      ...agentConfig,
      available_skills: availableSkills,
    });
  }
}

export default ARVOAgent;
