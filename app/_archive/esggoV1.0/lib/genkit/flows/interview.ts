import { z } from "genkit";
import { ai } from "../genkit";

export const InterviewInputSchema = z.object({
    chapterType: z.string(),
    companyProfile: z.string().optional(),
    existingAnswers: z.string().optional(),
});

export const InterviewOutputSchema = z.object({
    questions: z.array(z.string()),
    missingFields: z.array(z.string()).optional(),
    context: z.string().optional(),
});

/**
 * interviewFlow (Agent 1: Interviewer)
 * Generates tailored ESG interview questions.
 */
export const interviewFlow = ai.defineFlow(
    {
        name: "interviewFlow",
        inputSchema: InterviewInputSchema,
        outputSchema: InterviewOutputSchema,
    },
    async (input) => {
        const prompt = `
You are an expert ESG Consultant specializing in sustainability reporting (GRI, SASB, TCFD).
Task: Generate a list of targeted interview questions for the chapter: "${input.chapterType}".

Company Profile: ${input.companyProfile || "TBD"}
Existing Data: ${input.existingAnswers || "None"}

Requirements:
1. Provide exactly 3-5 high-impact questions.
2. Focus on policies, quantitative KPIs, and governance.
3. If specific standard-required metrics are missing, list them in 'missingFields'.
4. Respond in Traditional Chinese (zh-TW).
`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: InterviewOutputSchema },
        });

        if (!output) throw new Error("Failed to generate interview questions.");
        return output;
    }
);
