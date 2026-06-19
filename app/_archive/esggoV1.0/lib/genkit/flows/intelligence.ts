import { z } from "genkit";
import { ai } from "../genkit";

export const IntelligenceSignalSchema = z.object({
    id: z.string(),
    sourceId: z.string(),
    title: z.string(),
    summary: z.string(),
    type: z.enum(["POLICY", "MARKET", "SUPPLY", "RISK", "OPPORTUNITY"]),
    impactScore: z.number(),
    confidence: z.number(),
    timestamp: z.number(),
    sector: z.array(z.string()),
    region: z.array(z.string()),
});

/**
 * Intelligence Flow
 * Generates real-time intelligence signals from source monitoring.
 */
export const intelligenceFlow = ai.defineFlow(
    {
        name: "intelligenceFlow",
        inputSchema: z.object({
            sources: z.array(z.any()),
            category: z.string().optional()
        }),
        outputSchema: z.array(IntelligenceSignalSchema),
    },
    async (input) => {
        const prompt = `
Role: Omni Chief Intelligence Analyst.
Task: Synthesize the following ESG monitoring sources into 3-5 actionable "Intelligence Signals".

Context Sources:
${JSON.stringify(input.sources.slice(0, 10), null, 2)}

Requirements:
1. Generate signals that reflect current global ESG trends (e.g., CBAM updates, IFRS S1/S2 adoption, Energy Transition risks).
2. Each signal must have a logical impact score and sector targeting.
3. Language: Traditional Chinese (zh-TW).
4. Output must follow the IntelligenceSignalSchema structure precisely.
`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: z.array(IntelligenceSignalSchema) }
        });

        return (output || []).map(sig => ({
            ...sig,
            timestamp: Date.now()
        }));
    }
);
