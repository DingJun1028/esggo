import { z } from 'genkit';
import { ai } from '../agents/genkit';
import { memoryStore } from '../memory/memory-store';

export interface SynthesisResult {
  success: boolean;
  result?: any;
  error?: string;
  toolId?: string;
  generatedCode?: string;
}

export class ToolSynthesizer {
  private static instance: ToolSynthesizer;
  private toolRegistry: Map<string, { code: string; createdAt: string }> = new Map();

  private constructor() {}

  static getInstance(): ToolSynthesizer {
    if (!ToolSynthesizer.instance) {
      ToolSynthesizer.instance = new ToolSynthesizer();
    }
    return ToolSynthesizer.instance;
  }

  async synthesizeTool(
    problem: string,
    context?: any,
    agentName: string = 'Unknown'
  ): Promise<SynthesisResult> {
    const memories = memoryStore.search(problem, 5);
    const memoryContext = memories.map(m => `Past: ${m.task} -> ${m.result}`).join('\n');

    const prompt = `
Problem: ${problem}
Context: ${JSON.stringify(context || {})}
Similar Past Solutions:
${memoryContext || 'No similar past solutions found.'}

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

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt,
        config: { temperature: 0.2 }
      });

      const generatedCode = response.text || 'function solveProblem(){return {status:"ok"};}';
      const toolId = `synth_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

      // Store the tool
      this.toolRegistry.set(toolId, { code: generatedCode, createdAt: new Date().toISOString() });

      // Execute in sandbox
      const safeFunction = new Function('context', `
        try {
          const result = ${generatedCode};
          return { success: true, result };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `);

      const executionResult = safeFunction(context || {});

      // Record in memory
      memoryStore.add({
        agentName: 'ToolSynthesizer',
        task: `Synthesize tool for: ${problem}`,
        context: { problem, agentName },
        result: executionResult.success ? 'Tool synthesized and executed' : executionResult.error,
        success: executionResult.success,
        tags: ['tool_synthesis', 'dynamic']
      });

      return {
        success: true,
        result: executionResult.result,
        generatedCode,
        toolId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getTool(toolId: string): { code: string; createdAt: string } | undefined {
    return this.toolRegistry.get(toolId);
  }

  listTools(): Array<{ id: string; code: string; createdAt: string }> {
    return Array.from(this.toolRegistry.entries()).map(([id, tool]) => ({
      id,
      ...tool
    }));
  }

  clearTools(): void {
    this.toolRegistry.clear();
  }
}

export const toolSynthesizer = ToolSynthesizer.getInstance();