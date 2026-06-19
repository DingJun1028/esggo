import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { ENV } from './config/env';

export const ai = genkit({
    plugins: [
        googleAI({
            apiKey: ENV.GEMINI_API_KEY,
        }),
    ],
});

// Define flows for Dev UI detection
export const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: z.object({
            messages: z.array(z.object({
                role: z.enum(['user', 'ai', 'system']),
                content: z.string(),
            })),
            persona: z.string().optional(),
            language: z.enum(['zh', 'en']).optional(),
            auditMode: z.boolean().optional(),
            globalContext: z.string().optional(),
            linkedSourcesContext: z.string().optional(),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const response = await ai.generate({
            model: ENV.DEFAULT_MODEL,
            prompt: `Persona: ${input.persona || 'compliance'}. Language: ${input.language || 'zh'}. Audit Mode: ${input.auditMode || false}.
            Recent Conversation: ${JSON.stringify(input.messages)}
            Context: ${input.globalContext || ''} ${input.linkedSourcesContext || ''}`,
            config: { maxOutputTokens: 1000 }
        });
        return response.text;
    }
);
