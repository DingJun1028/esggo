import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const geminiApiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY;

// Fallback gracefully during CI/build when API key is absent to avoid 'Cannot read properties of null (reading "defineTool")'
export const ai = genkit({
  plugins: geminiApiKey ? [googleAI({ apiKey: geminiApiKey })] : [],
});
