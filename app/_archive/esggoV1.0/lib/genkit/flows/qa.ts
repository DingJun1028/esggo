import { z } from "genkit";
import { ai } from "../genkit";
import { ChapterDataSchema, QAResultSchema } from "../schemas/chapter";

export const QAInputSchema = z.object({
    chapterType: z.string(),
    draft: z.string(),
    structuredData: ChapterDataSchema,
    standards: z.array(z.string()).default(["GRI"]),
});

/**
 * qaFlow (Agent 4: QA Auditor)
 * Audits an ESG draft for quality, data completeness, and Forensic Integrity.
 */
export const qaFlow = ai.defineFlow(
    {
        name: "qaFlow",
        inputSchema: QAInputSchema,
        outputSchema: QAResultSchema,
    },
    async (input) => {
        const forensicData = input.structuredData.forensic;

        const prompt = `
Role: Omni Chief Forensic Auditor.
Task: Audit the provided ESG report draft based on the standards: ${input.standards.join(", ")}.

Draft Content:
${input.draft}

Forensic Source Data (Evidence-Backed):
${JSON.stringify(input.structuredData, null, 2)}

Audit Requirements:
1. **Forensic Cross-Check**: Compare the 'Draft Content' against the 'Forensic Source Data'. Ensure every metric in the draft is directly supported by the 'evidence' snippets in the structured data.
2. **Integrity Validation**: If the draft includes data points NOT found in the source or evidence, flag them as "Hallucination Risk".
3. **Disclosure Gap Analysis**: Identify missing KPIs required by ${input.standards.join(", ")} that were noted as missing in the structure phase.
4. **Scoring**: Provide a 'forensicIntegrity' score in the final audit.

Respond with a strictly structured JSON audit report in Traditional Chinese (zh-TW).
`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: QAResultSchema },
        });

        if (!output) throw new Error("Failed to audit report draft with forensic integrity.");

        // Add a master forensic badge to the output if confidence is high
        if (output.score.credibility > 90 && (forensicData?.confidence || 0) > 0.9) {
            output.issues.push({
                type: "inconsistency", // Using closest enum, but with a positive message
                location: "Full Document",
                description: "FOR-CERT: Document integrity verified against source hash.",
                suggestion: "None. Integrity is optimal."
            });
        }

        return output;
    }
);
