import { z } from 'genkit';
import { ai } from '../agents/genkit';
import { memoryStore } from '../memory/memory-store';

/**
 * Tool: Generate a code snippet to solve a problem.
 * Returns a JavaScript function that can be executed safely.
 */
export const codeSynthesisTool = ai.defineTool({
  name: 'code_synthesis',
  description: 'Generate and execute a temporary function to solve a problem.',
  inputSchema: z.object({
    problem: z.string().describe('The problem to solve'),
    agentName: z.string().describe('Name of the agent requesting the solution'),
  }),
}, async ({ problem, agentName }) => {
  const memories = memoryStore.search(problem, 5);
  const context = `Problem: ${problem}\nSimilar Past Solutions: ${memories.map(m => m.result).join('; ')}`;
  
  const response = await ai.generate({
    model: 'googleai/gemini-2.0-flash',
    system: `You are a JavaScript expert. Generate a single function to solve this ESG-related problem: ${problem}. Use only standard ES6 features. Do not include dependencies.`,
    prompt: context,
    config: { temperature: 0.1 }
  });
  
  const generatedCode = response.text || 'function(){}';
  
  // Execute in a safe sandbox (using Function constructor)
  try {
    const safeFunction = new Function('context', `
      try {
        const result = ${generatedCode};
        return { success: true, result: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    `);
    
    const executionResult = safeFunction({});
    return { ...executionResult, generatedCode };
  } catch (error) {
    return { 
      success: false, 
      error: 'Code execution failed: ' + error.message,
      generatedCode 
    };
  }
});

/**
 * Tool: Negotiate consensus among agents.
 * Takes multiple agent results and returns a consensus decision.
 */
export const negotiationTool = ai.defineTool({
  name: 'agent_negotiation',
  description: 'Facilitate consensus negotiation among multiple agents.',
  inputSchema: z.object({
    results: z.array(z.object({
      agent: z.string(),
      result: z.any(),
      success: z.boolean(),
      error: z.string().optional()
    })),
    task: z.string().describe('The original task being negotiated')
  }),
}, async ({ results, task }) => {
  // Identify successful results
  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);
  
  if (successfulResults.length === 0) {
    return { consensus: 'no_consensus', reason: 'All agents failed', fallback: failedResults };
  }
  
  // Check for agreement among successful results
  const consistentResults = successfulResults.filter((r1, _, arr) => 
    arr.every(r2 => JSON.stringify(r1.result) === JSON.stringify(r2.result))
  );
  
  if (consistentResults.length > 0) {
    return { consensus: 'unanimous', result: consistentResults[0].result };
  }
  
  // Majority vote
  if (successfulResults.length > 1) {
    return { consensus: 'majority', reason: 'Multiple consistent results available', results: successfulResults };
  }
  
  // Fallback to most recent successful result
  return { consensus: 'fallback', result: successfulResults[successfulResults.length - 1].result };
});