import { AI_TOOLS, executeTool } from './ai-tools';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGeminiWithTools(prompt: string, systemInstruction?: string) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API Key missing');

  const messages: any[] = [{ role: 'user', parts: [{ text: prompt }] }];
  const tools = [{ function_declarations: AI_TOOLS }];

  try {
    // 1. Initial Call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        tools,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      }),
    });

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    // 2. Handle Tool Call if present
    if (part?.functionCall) {
      const { name, args } = part.functionCall;
      const toolResult = await executeTool(name, args);

      // Add tool call and result to history
      messages.push(candidate.content);
      messages.push({
        role: 'function',
        parts: [{
          functionResponse: {
            name,
            response: { content: toolResult }
          }
        }]
      });

      // Final Call with results
      const finalResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          tools,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      });

      const finalData = await finalResponse.json();
      return finalData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response after tool call';
    }

    return part?.text || 'No response';
  } catch (error: any) {
    console.error('[AI Server Service] Tool call error:', error);
    throw error;
  }
}
