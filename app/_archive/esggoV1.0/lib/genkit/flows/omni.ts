import { z } from "genkit";
import { ai } from "../genkit";

/**
 * Omni Flow
 * The central intelligence gateway for real-time ESG expert consultation.
 */
export const OmniInputSchema = z.object({
    text: z.string(),
    persona: z.object({
        name: z.string(),
        title: z.string(),
        description: z.string().optional(),
    }).optional(),
    history: z.array(z.object({
        role: z.enum(["user", "model"]),
        content: z.array(z.object({ text: z.string() }))
    })).optional(),
});

export const omniFlow = ai.defineFlow(
    {
        name: "omniFlow",
        inputSchema: OmniInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const systemPrompt = `You are ${input.persona?.name || 'Omni'}, ${input.persona?.title || 'an ESG expert'}. ${input.persona?.description || ''}. 
Provide professional, high-impact ESG advice in Traditional Chinese (zh-TW). 
Link your insights to GRI/SASB standards and emphasize forensic traceability.
Maintain a sophisticated, industrial-grade tone.`;

        // Using messages array for full control and correct type support in Genkit
        const { text } = await ai.generate({
            messages: [
                { role: "system", content: [{ text: systemPrompt }] },
                ...(input.history || []).map(h => ({
                    role: h.role,
                    content: h.content
                })),
                { role: "user", content: [{ text: input.text }] }
            ]
        });

        return text || "無法生成回應內容。";
    }
);
