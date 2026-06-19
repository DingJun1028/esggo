import { AlignmentService, AlignmentResult } from "./alignment-service";
import { EsgMetrics } from "./omni-service";
import { verifyZkpIntegrity } from "./zkp-snarks-engine";

export interface ComplianceInsight {
    type: "CRITICAL" | "WARNING" | "INFO";
    message: string;
    targetFramework: string;
    suggestedAction: string;
}

export class ComplianceAgent {
    /**
     * 「合規偵訊」核心：掃描數據並輸出即時洞察
     */
    static async audit(metrics: Partial<EsgMetrics>): Promise<ComplianceInsight[]> {
        const alignment = AlignmentService.getAlignmentReport(metrics);
        const chapterCompleteness = AlignmentService.getChapterCompleteness();
        const insights: ComplianceInsight[] = [];

        // 1. 檢測 ZKP 誠信度 (模擬驗證)
        const isIntegrityOk = await verifyZkpIntegrity("org-global-hash");
        if (!isIntegrityOk) {
            insights.push({
                type: "CRITICAL",
                message: "數據完整度驗證失敗：[ZKP_FAULT] 檢測到 Proof 雜湊不匹配，數據完整性受損。",
                targetFramework: "5T Protocol v4.3",
                suggestedAction: "立刻啟動深度鑑識模式 (Forensic) 並重新發布 ZKP-Anchor 交易。"
            });
        }

        // 2. 檢測指標缺口
        alignment.forEach(res => {
            if (res.status === "MISSING") {
                insights.push({
                    type: "CRITICAL",
                    message: `嚴重數據缺口：缺少 ${res.requirement.id} 所需的數據。`,
                    targetFramework: res.requirement.standard,
                    suggestedAction: `補齊 ${res.requirement.metricsNeeded.join(", ")}。`
                });
            } else if (res.status === "PARTIAL") {
                insights.push({
                    type: "WARNING",
                    message: `${res.requirement.id} [D-GAP]：數據涵蓋率僅 ${res.score}%，低於信託閾值。`,
                    targetFramework: res.requirement.standard,
                    suggestedAction: "執行代償性指標推論 (Compensatory Reasoning) 以降低不確定性權重。"
                });
            }
        });

        // 3. 檢測撰寫進度 (Narrative Gap)
        if (chapterCompleteness.overallProgress < 100) {
            insights.push({
                type: "WARNING",
                message: `撰寫進度未達標：目前報告整體撰寫進度為 ${chapterCompleteness.overallProgress}%。`,
                targetFramework: "Reporting Process",
                suggestedAction: `尚有 ${chapterCompleteness.totalChapters - chapterCompleteness.completedChapters} 個章節未完成，建議啟動 Genkit Orchestrator 進行草案生成。`
            });

            if (chapterCompleteness.draftChapters > 0) {
                insights.push({
                    type: "INFO",
                    message: `草稿待優化：發現 ${chapterCompleteness.draftChapters} 個章節處於草稿階段。`,
                    targetFramework: "Quality Assurance",
                    suggestedAction: "啟動 QA 分析流對現有草稿進行品質校正。"
                });
            }
        }

        // 4. 範疇三特別提醒
        if (!metrics.scope3Emissions) {
            insights.push({
                type: "INFO",
                message: "建議：範疇三 (Scope 3) 數據尚未填寫。",
                targetFramework: "GRI 305-3",
                suggestedAction: "啟動供應鏈協作模組以獲取上游數據。"
            });
        }

        return insights;
    }
}

