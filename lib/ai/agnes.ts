import { createOpenAI } from '@ai-sdk/openai';

// Initialize Agnes AI using the OpenAI compatible SDK provider
export const agnes = createOpenAI({
  baseURL: 'https://apihub.agnes-ai.com/v1',
  apiKey: process.env.AGNES_API || process.env.AGNES_API_KEY || '',
});

// Helper to provide the default Agnes model used across the platform
export const getAgnesModel = () => agnes('agnes-2.0-flash');
