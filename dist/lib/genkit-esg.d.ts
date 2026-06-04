/**
 * ESG GO | AI ESG Flows
 * Google Gemini × GRI 2021 × 5T Protocol
 */
import { z } from 'zod';
export declare const ESGAnalysisInputSchema: z.ZodObject<{
    content: z.ZodString;
    griReference: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["E", "S", "G"]>>;
    language: z.ZodDefault<z.ZodEnum<["zh-TW", "en"]>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    language: "zh-TW" | "en";
    category?: "E" | "S" | "G" | undefined;
    griReference?: string | undefined;
}, {
    content: string;
    category?: "E" | "S" | "G" | undefined;
    griReference?: string | undefined;
    language?: "zh-TW" | "en" | undefined;
}>;
export declare const ESGAnalysisOutputSchema: z.ZodObject<{
    summary: z.ZodString;
    compliance: z.ZodObject<{
        score: z.ZodNumber;
        gaps: z.ZodArray<z.ZodString, "many">;
        recommendations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        recommendations: string[];
        score: number;
        gaps: string[];
    }, {
        recommendations: string[];
        score: number;
        gaps: string[];
    }>;
    greenwashingRisks: z.ZodArray<z.ZodObject<{
        phrase: z.ZodString;
        riskLevel: z.ZodEnum<["low", "medium", "high"]>;
        suggestion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        phrase: string;
        riskLevel: "medium" | "high" | "low";
        suggestion: string;
    }, {
        phrase: string;
        riskLevel: "medium" | "high" | "low";
        suggestion: string;
    }>, "many">;
    griAlignment: z.ZodArray<z.ZodString, "many">;
    formula: z.ZodString;
}, "strip", z.ZodTypeAny, {
    formula: string;
    compliance: {
        recommendations: string[];
        score: number;
        gaps: string[];
    };
    summary: string;
    greenwashingRisks: {
        phrase: string;
        riskLevel: "medium" | "high" | "low";
        suggestion: string;
    }[];
    griAlignment: string[];
}, {
    formula: string;
    compliance: {
        recommendations: string[];
        score: number;
        gaps: string[];
    };
    summary: string;
    greenwashingRisks: {
        phrase: string;
        riskLevel: "medium" | "high" | "low";
        suggestion: string;
    }[];
    griAlignment: string[];
}>;
export declare const GRIContentInputSchema: z.ZodObject<{
    chapter: z.ZodString;
    metrics: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    persona: z.ZodDefault<z.ZodEnum<["compliance", "harmony", "innovation"]>>;
    wordCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    metrics: Record<string, string | number>;
    persona: "compliance" | "harmony" | "innovation";
    chapter: string;
    wordCount: number;
}, {
    metrics: Record<string, string | number>;
    chapter: string;
    persona?: "compliance" | "harmony" | "innovation" | undefined;
    wordCount?: number | undefined;
}>;
export declare const GRIContentOutputSchema: z.ZodObject<{
    content: z.ZodString;
    griIndicators: z.ZodArray<z.ZodString, "many">;
    keyPoints: z.ZodArray<z.ZodString, "many">;
    evidenceRequired: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    content: string;
    keyPoints: string[];
    griIndicators: string[];
    evidenceRequired: string[];
}, {
    content: string;
    keyPoints: string[];
    griIndicators: string[];
    evidenceRequired: string[];
}>;
export type ESGAnalysisInput = z.infer<typeof ESGAnalysisInputSchema>;
export type ESGAnalysisOutput = z.infer<typeof ESGAnalysisOutputSchema>;
export type GRIContentInput = z.infer<typeof GRIContentInputSchema>;
export type GRIContentOutput = z.infer<typeof GRIContentOutputSchema>;
export declare function callGemini(prompt: string, systemPrompt?: string): Promise<string>;
export declare function runGRIContentFlow(input: GRIContentInput): Promise<GRIContentOutput & {
    hashLock: string;
}>;
export declare const EXPERT_SACRED_TEMPLATES: Record<string, string>;
export declare function runESGAnalysisFlow(input: ESGAnalysisInput): Promise<ESGAnalysisOutput & {
    hashLock: string;
    vaultId: string;
}>;
export declare function scanGreenwashing(text: string): Promise<{
    risks: Array<{
        phrase: string;
        riskLevel: string;
        suggestion: string;
    }>;
    overallRisk: 'low' | 'medium' | 'high';
    hashLock: string;
}>;
export declare const OCRInputSchema: z.ZodObject<{
    imageUrl: z.ZodString;
    documentType: z.ZodDefault<z.ZodEnum<["invoice", "report", "certificate", "other"]>>;
    language: z.ZodDefault<z.ZodEnum<["zh-TW", "en"]>>;
}, "strip", z.ZodTypeAny, {
    language: "zh-TW" | "en";
    imageUrl: string;
    documentType: "report" | "invoice" | "certificate" | "other";
}, {
    imageUrl: string;
    language?: "zh-TW" | "en" | undefined;
    documentType?: "report" | "invoice" | "certificate" | "other" | undefined;
}>;
export declare const OCROutputSchema: z.ZodObject<{
    extractedText: z.ZodString;
    structuredData: z.ZodRecord<z.ZodString, z.ZodAny>;
    confidenceScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    extractedText: string;
    structuredData: Record<string, any>;
    confidenceScore: number;
}, {
    extractedText: string;
    structuredData: Record<string, any>;
    confidenceScore: number;
}>;
export type OCRInput = z.infer<typeof OCRInputSchema>;
export type OCROutput = z.infer<typeof OCROutputSchema>;
export declare function runOCRAnalysisFlow(input: OCRInput): Promise<OCROutput & {
    hashLock: string;
}>;
export declare function runEvidenceValidationFlow(evidenceText: string, griReference: string): Promise<{
    isValid: boolean;
    validationDetails: string;
    hashLock: string;
}>;
//# sourceMappingURL=genkit-esg.d.ts.map