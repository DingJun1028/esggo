import { z } from "zod";

/**
 * 永續報告框架定義 Schema
 */
export const ReportingFrameworkSchema = z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
});

/**
 * 框架具體揭露要求 Schema
 */
export const FrameworkRequirementSchema = z.object({
    id: z.string(), // 例如: "GRI 302-1", "ESRS 2-BP-1"
    frameworkId: z.string(),
    title: z.string(),
    description: z.string(),
    mandate: z.enum(["Mandatory", "Voluntary", "Conditional"]).default("Mandatory"),
    sector: z.string().optional(), // 適用產業
});

/**
 * 指標與框架對齊映射 Schema
 */
export const MetricAlignmentSchema = z.object({
    metricId: z.string(), // 指向 internal metrics
    requirementId: z.string(), // 指向 FrameworkRequirement.id
    relevanceScore: z.number().min(0).max(1), // 相關性權重
    mappingLogic: z.string(), // 對齊邏輯說明
});

/**
 * 對齊結果輸出 Schema
 */
export const AlignmentStatusSchema = z.object({
    requirementId: z.string(),
    status: z.enum(["Aligned", "Partial", "Gap", "Not_Applicable"]),
    confidenceScore: z.number().min(0).max(1),
    evidenceIds: z.array(z.string()), // 關聯的證據 ID
    gapAnalysis: z.string().optional(), // 若有缺口，說明缺口內容
});

export type TReportingFramework = z.infer<typeof ReportingFrameworkSchema>;
export type TFrameworkRequirement = z.infer<typeof FrameworkRequirementSchema>;
export type TMetricAlignment = z.infer<typeof MetricAlignmentSchema>;
export type TAlignmentStatus = z.infer<typeof AlignmentStatusSchema>;
