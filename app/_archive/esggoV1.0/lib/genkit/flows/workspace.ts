import { z } from "genkit";
import { ai } from "../genkit";

/**
 * Workspace Analysis Flow
 * Analyzes the ESG GO project structure and provides a technical summary.
 */
export const workspaceFlow = ai.defineFlow(
    {
        name: "workspaceFlow",
        inputSchema: z.object({
            files: z.array(z.string()),
            depth: z.number().default(2)
        }),
        outputSchema: z.object({
            summary: z.string(),
            techStack: z.array(z.string()),
            readiness: z.number(),
            recommendations: z.array(z.string()),
        }),
    },
    async (input) => {
        const prompt = `
Role: Project Architect & ESG Compliance Lead.
Task: Analyze the following project file manifest and provide a professional summary for the "Cora Hub".

File Manifest:
${input.files.slice(0, 50).join("\n")}

Requirements:
1. Summarize what this project is and its current development stage.
2. Identify key technologies (e.g., Next.js, Genkit, Firebase).
3. Rate "ESG Readiness" based on the presence of ESG-related modules (0-100).
4. Provide 3 specific technical recommendations.
5. Language: Traditional Chinese (zh-TW).
`;

        const { output } = await ai.generate({
            prompt,
            output: {
                schema: z.object({
                    summary: z.string(),
                    techStack: z.array(z.string()),
                    readiness: z.number(),
                    recommendations: z.array(z.string()),
                })
            }
        });

        return output || {
            summary: "無法生成專案摘要。",
            techStack: [],
            readiness: 0,
            recommendations: []
        };
    }
);
