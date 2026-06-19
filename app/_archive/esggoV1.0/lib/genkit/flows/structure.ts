import { z } from "genkit";
import { ai } from "../genkit";
import { ChapterDataSchema } from "../schemas/chapter";
import crypto from "node:crypto";

export const StructureInputSchema = z.object({
    chapterType: z.string(),
    rawAnswers: z.string(),
});

/**
 * structureFlow (Agent 2: Structuring)
 * Transforms raw text into a structured JSON schema with Forensic Traceability.
 */
export const structureFlow = ai.defineFlow(
    {
        name: "structureFlow",
        inputSchema: StructureInputSchema,
        outputSchema: ChapterDataSchema,
    },
    async (input) => {
        // Generate Forensic Hash of the source
        const sourceHash = crypto.createHash('sha256').update(input.rawAnswers).digest('hex');
        const timestamp = new Date().toISOString();

        const prompt = `
Task: Transform the following raw interview answers for the "${input.chapterType}" ESG chapter into a structured JSON format with Forensic Traceability.

Raw Content:
${input.rawAnswers}

Instructions:
1. Map policies, governance, actions, and KPIs following the provided schema.
2. DO NOT hallucinate facts.
3. If information is missing for a field, leave it empty or list it in 'missingInfo'.
4. Ensure KPI values are separated into 'value' and 'unit'.
5. **Traceability**: For each major claim or KPI, extract the exact snippet from the "Raw Content" that supports it and store it in the 'forensic.evidence' map.
6. **Integrity**: Provide a confidence score (0.0 - 1.0) for the overall extraction.
7. Always output in Traditional Chinese (zh-TW).
`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: ChapterDataSchema },
        });

        if (!output) throw new Error("Failed to structure ESG data with forensic integrity.");

        // Inject Forensic Metadata
        output.forensic = {
            sourceHash,
            agentId: "antigravity_01",
            timestamp,
            confidence: output.forensic?.confidence ?? 0.85, // Default if model lacks self-scoring
            evidence: output.forensic?.evidence ?? {},
        };

        return output;
    }
);
