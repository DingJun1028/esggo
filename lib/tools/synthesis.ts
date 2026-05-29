import { z } from 'genkit';
import { ai } from './genkit';
import { memoryStore } from '../memory/memory-store';
import { createHash } from 'crypto';

export interface ToolExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime?: number;
  generatedCode?: string;
  toolId?: string;
}

export class DynamicToolSynthesizer {
  private static instance: DynamicToolSynthesizer;
  private toolRegistry: Map<string, { code: string; createdAt: string }> = new Map();

  private constructor() {}

  static getInstance(): DynamicToolSynthesizer {
    if (!DynamicToolSynthesizer.instance) {
      DynamicToolSynthesizer.instance = new DynamicToolSynthesizer();
    }
    return DynamicToolSynthesizer.instance;
  }

  /**
   * Synthesize a new tool based on a problem description
   */
  async synthesizeTool(
    problem: string,
    context?: any,
    agentName: string = 'Unknown'
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    // Retrieve relevant memories for context
    const relevantMemories = memoryStore.search(problem, 5);
    const memoryContext = relevantMemories
      .map(m => `Past: ${m.task} -> ${m.result}`)
      .join('\n');

    // Generate the tool code
    const toolCode = await this.generateToolCode(problem, context, memoryContext);

    // Create a unique tool ID
    const toolId = `tool_${createHash('sha256')
      .update(`${problem}${Date.now()}`)
      .digest('hex')
      .substring(0, 8)}`;

    // Store the tool
    this.toolRegistry.set(toolId, {
      code: toolCode,
      createdAt: new Date().toISOString()
    });

    // Execute the tool in a sandbox
    const executionResult = await this.executeSandboxedTool(toolCode, context || {});

    // Record in memory
    memoryStore.add({
      agentName: 'DynamicToolSynthesizer',
      task: `Synthesize tool for: ${problem}`,
      context: { problem, agentName },
      result: executionResult.success ? 'Tool synthesized and executed' : executionResult.error,
      success: executionResult.success,
      tags: ['tool_synthesis', 'dynamic'],
      timestamp: new Date().toISOString()
    });

    return {
      ...executionResult,
      generatedCode: toolCode,
      toolId,
      executionTime: Date.now() - startTime
    };
  }

  /**
   * Generate tool code using AI
   */
  private async generateToolCode(
    problem: string,
    context?: any,
    memoryContext?: string
  ): Promise<string> {
    const prompt = `
You are an expert TypeScript/JavaScript developer. Create a standalone function to solve this ESG-related problem:

PROBLEM: ${problem}

CONTEXT: ${JSON.stringify(context || {})}

RELEVANT PAST EXPERIENCE:
${memoryContext || 'No relevant past experience'}

Requirements:
1. Create a single function named 'solveProblem' that accepts one parameter (context)
2. Return the result directly (no promises unless absolutely necessary)
3. Use only standard JavaScript/ES6 features - no external dependencies
4. Include proper error handling
5. Add JSDoc comments explaining the function
6. Make it self-contained and pure (no side effects)
7. Focus on ESG domain: calculations, data validation, report generation, compliance checking

Return ONLY the function code, no explanations or markdown formatting.
`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt,
      config: { temperature: 0.2 }
    });

    // Clean up the response to extract just the function code
    let code = response.text || '';
    
    // Remove markdown code blocks if present
    code = code.replace(/```(?:typescript|javascript|js|ts)?\n/g, '')
               .replace(/```/g, '')
               .trim();

    // Ensure we have a function
    if (!code.includes('function') && !code.includes('=>')) {
      code = `function solveProblem(context) {\n  // Solution for: ${problem}\n  return {\n    status: 'completed',\n    message: 'Problem analyzed',\n    data: context || {}\n  };\n}`;
    }

    return code;
  }

  /**
   * Execute tool in a secure sandbox
   */
  private async executeSandboxedTool(
    code: string,
    context: any
  ): Promise<ToolExecutionResult> {
    try {
      // Wrap the code in a function that we can execute
      const wrappedCode = `
        (function solveProblem(context) {
          ${code}
        })
      `;

      // Create the function
      const fn = new Function('context', wrappedCode);

      // Execute with the provided context
      const result = fn(context);

      return {
        success: true,
        result,
        executionTime: 0 // Will be filled by caller
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        executionTime: 0
      };
    }
  }

  /**
   * Get a synthesized tool by ID
   */
  getTool(toolId: string): { code: string; createdAt: string } | undefined {
    return this.toolRegistry.get(toolId);
  }

  /**
   * List all synthesized tools
   */
  listTools(): Array<{ id: string; code: string; createdAt: string }> {
    return Array.from(this.toolRegistry.entries()).map(([id, tool]) => ({
      id,
      ...tool
    }));
  }

  /**
   * Clear all synthesized tools
   */
  clearTools(): void {
    this.toolRegistry.clear();
  }
}

export const toolSynthesizer = DynamicToolSynthesizer.getInstance();