import { z } from 'genkit';
import { ai } from './genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const agentZ0InputSchema = z.object({
  query: z.string().describe('User query or task description for the agent'),
  context: z.any().optional().describe('Additional context or data for the agent'),
});

export const agentZ0Flow = ai.defineFlow(
  {
    name: 'agentZ0Flow',
    inputSchema: agentZ0InputSchema,
    outputSchema: z.string().describe('The generated response from aGENTZ0'),
  },
  async (input) => {
    const { query, context } = input;
    
    let prompt = `You are aGENTZ0, a highly intelligent and specialized agent for this system.\n`;
    prompt += `Task: ${query}\n`;
    if (context) {
      prompt += `Context: ${JSON.stringify(context)}\n`;
    }

    const response = await ai.generate({
      model: googleAI.model('gemini-2.5-pro'),
      prompt,
      config: { temperature: 0.7 },
    });
    
    return response.text || '';
  }
);
