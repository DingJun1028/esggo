import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit
const ai = genkit({
    plugins: [
        googleAI({
            // The API key should be provided via environment variables in Cloud Functions
            apiKey: process.env.GEMINI_API_KEY,
        }),
    ],
});

/**
 * Cloud Function Entry Point: esggo_alpha
 * 
 * This function provides AI-driven ESG compliance assistance.
 * It expects a JSON body with 'messages' and optional 'persona'.
 */
export const esggo_alpha = async (req: any, res: any) => {
    // Set CORS headers for potential cross-origin requests
    res.set('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }

    try {
        const { messages, persona, language = 'zh' } = req.body;

        if (!messages || !Array.isArray(messages)) {
            res.status(400).send('Invalid request: "messages" array is required.');
            return;
        }

        console.log(`[esggo_alpha] Processing request with persona: ${persona || 'default'}`);

        const response = await ai.generate({
            model: 'googleai/gemini-1.5-flash-latest',
            prompt: `
                You are an ESG Compliance expert. 
                Persona: ${persona || 'compliance_expert'}
                Language: ${language}
                
                Conversation History:
                ${JSON.stringify(messages)}
                
                Please provide a professional, evidence-based response.
            `,
            config: {
                maxOutputTokens: 1024,
                temperature: 0.7,
            }
        });

        res.status(200).json({
            text: response.text,
            timestamp: new Date().toISOString(),
            status: 'success'
        });
    } catch (error: any) {
        console.error('[esggo_alpha] Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};
