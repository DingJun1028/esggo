import { z } from "genkit";

/**
 * Forensic metadata for traceability and audit.
 */
export const ForensicMetaSchema = z.object({
    sourceHash: z.string().describe("SHA-256 hash of the source text"),
    agentId: z.string().describe("ID of the agent that performed the extraction"),
    timestamp: z.string().describe("ISO timestamp of the operation"),
    confidence: z.number().min(0).max(1).describe("Extraction confidence score"),
    evidence: z.record(z.string()).optional().describe("Mapping of fields to source text snippets"),
});

/**
 * Structured schema for ESG Chapter data.
 */
export const ChapterDataSchema = z.object({
    chapterType: z.string().describe("The type of ESG chapter (e.g., environmental, social)"),
    title: z.string().describe("The formal title of the chapter"),
    policy: z.string().optional().describe("Management policies and commitments"),
    governance: z.string().optional().describe("Governance structure and oversight"),
    actions: z.array(z.string()).optional().describe("Specific actions and initiatives taken"),
    kpis: z.array(z.object({
        name: z.string(),
        value: z.string(),
        unit: z.string().optional(),
        year: z.number().optional(),
        note: z.string().optional(),
    })).optional().describe("Quantitative performance indicators"),
    results: z.array(z.string()).optional().describe("Key outcomes and achievements"),
    risks: z.array(z.string()).optional().describe("Identified risks and mitigation strategies"),
    futureGoals: z.array(z.string()).optional().describe("Future targets and roadmap"),
    missingInfo: z.array(z.string()).optional().describe("Data gaps identified by the agent"),
    forensic: ForensicMetaSchema.optional().describe("Forensic traceability metadata"),
});

/**
 * Schema for QA audit findings.
 */
export const QAIssueSchema = z.object({
    type: z.enum([
        "missing_data",
        "missing_kpi",
        "vague_statement",
        "tone_issue",
        "inconsistency",
        "missing_future_goal"
    ]),
    location: z.string().describe("The specific section or paragraph context"),
    description: z.string().describe("What is wrong with the content"),
    suggestion: z.string().describe("How to improve it"),
});

export const QAResultSchema = z.object({
    issues: z.array(QAIssueSchema),
    score: z.object({
        completeness: z.number().min(0).max(100),
        credibility: z.number().min(0).max(100),
        consistency: z.number().min(0).max(100),
    }),
});
