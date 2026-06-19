import { chatFlow } from '@/lib/genkit';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(chatFlow);
