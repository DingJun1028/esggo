import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const geminiApiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY;

// Create a mock object with a defineTool method that does nothing, to avoid Cannot read properties of null during build
const mockAi = {
  defineTool: (params: any) => params,
  generate: async () => ({ text: '' }),
  generateStream: async () => ({ stream: [] }),
  defineFlow: (params: any) => params
};

export const ai = geminiApiKey
  ? genkit({
      plugins: [googleAI({ apiKey: geminiApiKey })],
    })
  : mockAi as any;
