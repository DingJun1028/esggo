import { interviewFlow } from "./flows/interview";
import { structureFlow } from "./flows/structure";
import { writerFlow } from "./flows/writer";
import { qaFlow } from "./flows/qa";
import { ChapterDataSchema } from "./schemas/chapter";

/**
 * SustainabilityReportOrchestrator
 * Coordinates the multi-agent workflow for ESG report generation.
 */
export class SustainabilityReportOrchestrator {
    /**
     * Phase 1: Interview & Discovery
     */
    static async discover(chapterType: string, companyProfile?: string, existingAnswers?: string) {
        console.log(`[ADK Orchestrator] Starting Discovery for: ${chapterType}`);
        const result = await interviewFlow({
            chapterType,
            companyProfile,
            existingAnswers,
        });
        return result;
    }

    /**
     * Phase 2: Structural Transformation
     */
    static async structure(chapterType: string, rawAnswers: string) {
        console.log(`[ADK Orchestrator] Starting Structural Transformation for: ${chapterType}`);
        const result = await structureFlow({
            chapterType,
            rawAnswers,
        });
        return result;
    }

    /**
     * Phase 3: Drafting & QA Audit (Combined Agentic Cycle)
     */
    static async generate(chapterType: string, title: string, structuredData: any) {
        console.log(`[ADK Orchestrator] Starting Generative Cycle for: ${title}`);

        try {
            // 1. Writer Agent generates the first draft
            const draftResult = await writerFlow({
                chapterType,
                title,
                structuredData,
                style: "professional",
            });

            // 2. QA Auditor Agent reviews the draft
            const auditResult = await qaFlow({
                chapterType,
                draft: draftResult.draft,
                structuredData, // Pass structured data for forensic cross-checking
                standards: ["GRI"],
            });

            return {
                title,
                chapterType,
                draft: draftResult.draft,
                summary: draftResult.summary,
                audit: auditResult,
                forensic: structuredData.forensic, // Maintain forensic metadata
                status: auditResult.score.completeness > 80 ? "SUCCESS" : "NEEDS_REVISION",
            };
        } catch (error: any) {
            console.error(`[ADK Orchestrator] Generative Cycle failed for ${title}:`, error);
            throw new Error(`揭露撰寫失敗: ${error.message}`);
        }
    }

    /**
     * 動態揭露編排器 (Dynamic Disclosure Orchestrator)
     * 整合 Discover -> Structure -> Generate 全流程
     */
    static async orchestrateChapter(chapterType: string, intent: string) {
        // 1. Discovery
        const discovery = await this.discover(chapterType, intent);

        // 2. Structure (Simulation: Using discovery context as raw answers)
        const structured = await this.structure(chapterType, JSON.stringify(discovery));

        // 3. Generate
        const report = await this.generate(chapterType, `永續報告: ${chapterType}`, structured);

        return report;
    }

    /**
     * Phase 4: Full Report Consolidation (Future Expansion)
     */
    static async finalise(chapters: any[]) {
        console.log(`[ADK Orchestrator] Finalising Full Report Consolidation`);
        // Implementation for merging chapters and consistent styling
        return {
            totalChapters: chapters.length,
            status: "READY_FOR_EXPORT"
        };
    }
}
