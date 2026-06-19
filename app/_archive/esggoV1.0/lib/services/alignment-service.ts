import { EsgMetrics } from "./omni-service";
import { ESG_STRUCTURE, ChapterItem } from "@/lib/data/esg-structure";
import { GRI_2021_REQUIREMENTS } from "@/lib/data/frameworks/gri-2021-mapping";
import { ESRS_2_REQUIREMENTS } from "@/lib/data/frameworks/esrs-2-mapping";

export interface AlignmentRequirement {
    id: string;
    standard: "GRI" | "ESRS";
    title: string;
    description: string;
    metricsNeeded: (keyof EsgMetrics)[];
}

export interface AlignmentResult {
    requirement: AlignmentRequirement;
    status: "COMPLETE" | "PARTIAL" | "MISSING";
    gapAnalysis: string;
    score: number; // 0-100
}

/**
 * 將官方 Framework 映射轉換為 AlignmentRequirement 格式
 */
const MAPPED_GRI: AlignmentRequirement[] = GRI_2021_REQUIREMENTS.map(r => ({
    id: r.id,
    standard: "GRI",
    title: r.title,
    description: r.description,
    metricsNeeded: r.id === "GRI-305-1" ? ["scope1Emissions"] :
        r.id === "GRI-305-2" ? ["scope2Emissions"] :
            r.id === "GRI-302-1" ? ["energyConsumption"] :
                r.id === "GRI-303-1" ? ["waterUsage"] : [] as any
}));

const MAPPED_ESRS: AlignmentRequirement[] = ESRS_2_REQUIREMENTS.map(r => ({
    id: r.id,
    standard: "ESRS",
    title: r.title,
    description: r.description,
    metricsNeeded: r.id === "ESRS-E1-1" ? ["scope1Emissions", "scope2Emissions"] : [] as any
}));

export const ESG_STANDARDS: AlignmentRequirement[] = [...MAPPED_GRI, ...MAPPED_ESRS].filter(r => r.metricsNeeded.length > 0);

export class AlignmentService {
    static getAlignmentReport(metrics: Partial<EsgMetrics>): AlignmentResult[] {
        return ESG_STANDARDS.map(req => {
            const availableMetrics = req.metricsNeeded.filter(m => metrics[m] !== undefined && metrics[m] !== null);
            const coverage = availableMetrics.length / req.metricsNeeded.length;

            let status: AlignmentResult["status"] = "MISSING";
            if (coverage === 1) status = "COMPLETE";
            else if (coverage > 0) status = "PARTIAL";

            const missing = req.metricsNeeded.filter(m => metrics[m] === undefined || metrics[m] === null);

            let gapAnalysis = "";
            if (status === "COMPLETE") {
                gapAnalysis = "所有必要指標已就緒。數據已通過 5T 協議存證。";
            } else if (status === "PARTIAL") {
                gapAnalysis = `尚缺少部分指標: ${missing.join(", ")}。建議啟動 AI 推論以補足數據缺口。`;
            } else {
                gapAnalysis = `完全缺少指標: ${req.metricsNeeded.join(", ")}。請上傳相關原始憑證。`;
            }

            return {
                requirement: req,
                status,
                gapAnalysis,
                score: Math.round(coverage * 100),
            };
        });
    }

    static calculateOverallCompliance(results: AlignmentResult[]): number {
        if (results.length === 0) return 0;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        return Math.round(totalScore / results.length);
    }

    static getChapterCompleteness(): {
        totalChapters: number;
        completedChapters: number;
        draftChapters: number;
        overallProgress: number;
        chapterDetails: ChapterItem[];
    } {
        const allItems = ESG_STRUCTURE.flatMap(cat => cat.items);
        const totalChapters = allItems.length;
        const completedChapters = allItems.filter(i => i.status === "completed").length;
        const draftChapters = allItems.filter(i => i.status === "draft").length;
        const totalProgress = allItems.reduce((sum, i) => sum + i.progress, 0);
        const overallProgress = totalChapters > 0 ? Math.round(totalProgress / totalChapters) : 0;

        return {
            totalChapters,
            completedChapters,
            draftChapters,
            overallProgress,
            chapterDetails: allItems
        };
    }
}

