import { z } from "genkit";
import { ai } from "../genkit";
import { ChapterDataSchema, ForensicMetaSchema } from "../schemas/chapter";

export const WriterInputSchema = z.object({
    chapterType: z.string(),
    title: z.string(),
    structuredData: ChapterDataSchema,
    style: z.enum(["professional", "technical", "narrative"]).default("professional"),
});

export const WriterOutputSchema = z.object({
    summary: z.string(),
    outline: z.array(z.string()),
    draft: z.string(),
    forensicTrail: z.object({
        sourceHash: z.string(),
        inputConfidence: z.number(),
        agentChain: z.array(z.string()),
        integritySeal: z.string(),
    }).optional(),
});

/**
 * writerFlow (Agent 3: Writer)
 * Generates an ESG chapter draft based on structured data with Forensic Traceability.
 */
export const writerFlow = ai.defineFlow(
    {
        name: "writerFlow",
        inputSchema: WriterInputSchema,
        outputSchema: WriterOutputSchema,
    },
    async (input) => {
        const forensicData = input.structuredData.forensic;

        const prompt = `
Role: Omni Chief Sustainability Editor & Forensic Auditor.
Task: Write a formal ESG report section for "${input.title}" (Type: ${input.chapterType}).

Structured Input Data (Forensic Grade):
${JSON.stringify(input.structuredData, null, 2)}

Requirements:
1. Style: ${input.style}.
2. Language: Traditional Chinese (zh-TW).
3. Follow GRI and SASB disclosure standards.
4. **Forensic Citations**: Seamlessly integrate data points. For every KPI or critical action, use the information from the 'forensic.evidence' provided in the input to ensure absolute accuracy. 
5. If data points are missing (as listed in 'missingInfo'), state "資訊待補充" (Information pending) professionally.
6. **Integrity Seal**: Conclude and provide a high-level summary of the "Evidence Chain" used for this draft.
`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: WriterOutputSchema },
        });

        if (!output) throw new Error("Failed to generate forensic report draft.");

        // 計算草稿的 SHA-256 簽置，實現防竄改鑑識
        const crypto = await import("crypto");
        const sealHash = crypto.createHash('sha256').update(output.draft).digest('hex');

        // Seal the Forensic Trail
        output.forensicTrail = {
            sourceHash: forensicData?.sourceHash ?? "UNKNOWN_ORIGIN",
            inputConfidence: forensicData?.confidence ?? 0.0,
            agentChain: ["antigravity_structure_01", "antigravity_writer_01"],
            integritySeal: `SHA256:${sealHash}:SEALED_BY_OMNI_WRITER`,
        };

        return output;
    }
);
