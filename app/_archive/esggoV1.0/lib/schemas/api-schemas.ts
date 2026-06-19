import { z } from "zod";

/**
 * AI 世代請求 Schema
 * 用於 /api/generate 節點
 */
export const AiGenerateSchema = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"),
    model: z.string().optional().default("gemini-1.5-flash"),
    stream: z.boolean().optional().default(false),
    tier: z.enum(["Cloud", "Local", "Edge"]).optional().default("Cloud"),
    context: z.record(z.string(), z.any()).optional(),
});

/**
 * 永續報告章節儲存 Schema
 */
export const ReportSectionSchema = z.object({
    reportId: z.string().uuid().optional(),
    chapterId: z.string(),
    content: z.string(),
    wordCount: z.number().nonnegative(),
    lastModified: z.string().datetime().optional(),
});

/**
 * 證據上傳元數據 Schema
 */
export const EvidenceUploadSchema = z.object({
    title: z.string(),
    source: z.string().optional(),
    confidenceScore: z.number().min(0).max(1).optional(),
    tags: z.array(z.string()).optional(),
});

/**
 * 永續電子報發布 Schema
 */
export const NewsletterIssueSchema = z.object({
    id: z.string().uuid().optional(),
    issueNumber: z.number().int(),
    title: z.string(),
    author: z.string(),
    publishDate: z.string().datetime().optional(),
    executiveTakeaways: z.string(),
    chapters: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string()
    })),
    status: z.enum(["Draft", "Published", "Archived"]).default("Draft"),
});

export type TAiGenerateSchema = z.infer<typeof AiGenerateSchema>;
export type TReportSectionSchema = z.infer<typeof ReportSectionSchema>;
export type TEvidenceUploadSchema = z.infer<typeof EvidenceUploadSchema>;
export type TNewsletterIssueSchema = z.infer<typeof NewsletterIssueSchema>;
