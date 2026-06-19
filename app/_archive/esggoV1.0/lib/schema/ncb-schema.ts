import { z } from "zod";

/**
 * 5T Protocol Privacy Levels
 */
export const PrivacyLevelSchema = z.enum(['L1', 'L2', 'L3', 'Open']);

/**
 * Evidence Item Schema (ZKP & 5T Compliant)
 */
export const EvidenceItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(["pending", "scanning", "uploaded", "verified"]),
    file: z.string().optional(),
    explanation: z.string().optional(),
    category: z.enum(["D", "E", "S", "T", "G"]),
});

/**
 * Impact Analysis Item Schema
 */
export const ImpactItemSchema = z.object({
    id: z.string(),
    chapterId: z.string(),
    chapterTitle: z.string(),
    description: z.string(),
    severity: z.enum(["high", "medium", "low"]),
    suggestedAction: z.string(),
    status: z.enum(["pending", "confirmed", "ignored"]),
});

/**
 * ESG Report Content Schema
 */
export const ReportContentSchema = z.object({
    chapterId: z.string(),
    content: z.string(),
    evidenceIds: z.array(z.string()),
    privacyLevel: PrivacyLevelSchema.optional(),
    zkProof: z.string().optional(),
    isMasked: z.boolean().optional(),
});

/**
 * Main ESG Report Schema (Full-stack Sync)
 */
export const NcbReportSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    title: z.string(),
    date: z.string(),
    standard: z.string().optional(),
    status: z.enum(['draft', 'completed', 'Sealed', 'Verified', 'In Progress']),
    lastUpdated: z.number().optional(),
    industry: z.string().optional(),
    selectedIssues: z.array(z.string()).optional(),
    chapters: z.record(z.string(), ReportContentSchema).optional(),
    metadata: z.object({
        hash: z.string(),
        timestamp: z.number(),
        protocol: z.string().optional(),
        zkpVerified: z.boolean().optional(),
        pillars: z.object({
            traceable: z.number(),
            transparent: z.number(),
            trustworthy: z.number(),
            tangible: z.number(),
            trackable: z.number(),
        }),
    }).optional(),
});

export type ZEvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type ZImpactItem = z.infer<typeof ImpactItemSchema>;
export type ZNcbReport = z.infer<typeof NcbReportSchema>;
