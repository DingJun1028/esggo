import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const geminiApiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY || 'MOCK_KEY_FOR_CI_BUILD_ONLY';

export const ai = genkit({
    plugins: [googleAI({ apiKey: geminiApiKey })],
});
