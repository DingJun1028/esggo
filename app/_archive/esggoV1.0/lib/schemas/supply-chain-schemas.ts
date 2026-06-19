import { z } from "zod";

/**
 * 供應商排放數據 Schema
 */
export const SupplierEmissionsSchema = z.object({
    scope3Emissions: z.number().min(0).describe("供應商範疇三排放量 (tCO2e)"),
    reductionTarget: z.number().min(0).max(100).describe("減碳目標達成率 (%)"),
    dataConfidence: z.number().min(0).max(1).describe("數據信賴度 (0-1)"),
    lastAuditDate: z.string().datetime().optional(),
});

/**
 * 供應商主體 Schema
 */
export const SupplierSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    region: z.enum(["North_America", "Europe", "Asia_Pacific", "Greater_China", "South_America", "Africa"]),
    industry: z.enum(["Semicondutor", "Industrial_Manufacturing", "Logistics", "Energy", "Raw_Materials"]),
    emissions: SupplierEmissionsSchema,
    riskScore: z.number().min(0).max(100).describe("供應鏈風險分數 (0-100)"),
    status: z.enum(["Strategic_Partner", "Qualified", "Under_Review", "High_Risk"]),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

/**
 * 供應鏈概覽分析 Schema
 */
export const SupplyChainAnalyticsSchema = z.object({
    totalScope3Emissions: z.number(),
    averageRiskScore: z.number(),
    supplierCount: z.number(),
    topEmittingRegion: z.string(),
    highRiskCount: z.number(),
});

export type TSupplier = z.infer<typeof SupplierSchema>;
export type TSupplierEmissions = z.infer<typeof SupplierEmissionsSchema>;
export type TSupplyChainAnalytics = z.infer<typeof SupplyChainAnalyticsSchema>;
