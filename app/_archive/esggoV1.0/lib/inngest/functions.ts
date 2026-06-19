import { inngest } from "./client";
import { FirestoreService } from "../services/firestore-service";
import { SustainabilityReportOrchestrator } from "../genkit/orchestrator";

/**
 * orchestrateForensicChapter (Durable Background Orchestration)
 * 整合全鏈條的鑑識與報告生成流程於背景執行。
 */
export const orchestrateForensicChapter = inngest.createFunction(
    {
        id: "orchestrate-forensic-chapter",
        triggers: [{ event: "chapter/forensic.requested" }],
        concurrency: 5 // 限制並發以優化 API 配額
    },
    async ({ event, step }: { event: any; step: any }) => {
        const { sessionId, chapterType, intent } = event.data;

        // 步驟 1: 初始化背景處理狀態
        await step.run("initialize-status", async () => {
            await FirestoreService.updateAuditTrail(sessionId, {
                status: "FORENSIC_ORCHESTRATING",
                lastUpdatedAt: new Date().toISOString(),
                chapterType
            });
        });

        // 步驟 2: 執行 Discovery (Interview Flow)
        const discovery = await step.run("phase-1-discovery", async () => {
            return await SustainabilityReportOrchestrator.discover(chapterType, intent);
        });

        // 步驟 3: 執行 Structural Transformation (Forensic Grade)
        const structured = await step.run("phase-2-structure", async () => {
            return await SustainabilityReportOrchestrator.structure(chapterType, JSON.stringify(discovery));
        });

        // 步驟 4: 執行 Generative Cycle (Writer + QA with Forensic Check)
        const report = await step.run("phase-3-generate", async () => {
            return await SustainabilityReportOrchestrator.generate(
                chapterType,
                `永續報告: ${chapterType}`,
                structured
            );
        });

        // 步驟 5: 執行最終封印與存證
        await step.run("phase-4-finalize", async () => {
            await FirestoreService.updateAuditTrail(sessionId, {
                status: "COMPLETED",
                result: report,
                integritySeal: report.forensic?.integritySeal,
                lastUpdatedAt: new Date().toISOString()
            });

            // 可以在此發送通知事件
            await inngest.send({
                name: "chapter/forensic.sealed",
                data: { sessionId, reportId: report.title, hash: report.forensic?.sourceHash }
            });
        });

        return { sessionId, status: "completed", integrity: report.forensic?.sourceHash };
    }
);

/**
 * 背景自動歸檔函數 (Legacy Support)
 */
export const generateArchiveReport = inngest.createFunction(
    {
        id: "generate-archive-report",
        triggers: [{ event: "audit/report.requested" }]
    },
    async ({ event, step }: { event: any; step: any }) => {
        const { auditId, reportContent } = event.data;

        await step.run("update-firestore-processing", async () => {
            await FirestoreService.updateAuditTrail(auditId, {
                status: "PROCESSING",
                lastUpdatedAt: new Date().toISOString(),
            });
        });

        return { auditId, status: "completed" };
    }
);
