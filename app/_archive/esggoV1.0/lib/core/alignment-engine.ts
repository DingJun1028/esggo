import { EsgMetrics } from "@/lib/services/omni-service";
import { MansionCodeEnum, MANSIONS_DATA } from "@/lib/schemas/mansions-schema";
import {
    TFrameworkRequirement,
    TAlignmentStatus,
    TMetricAlignment
} from "@/lib/schemas/framework-mapping-schemas";
import { GRI_2021_REQUIREMENTS } from "@/lib/data/frameworks/gri-2021-mapping";
import { ESRS_2_REQUIREMENTS } from "@/lib/data/frameworks/esrs-2-mapping";
import { omniFlow } from "@/lib/genkit";
import { useEvolutionStore } from "@/lib/stores/evolution-store";

/**
 * Omni Alignment Engine
 * 自動對齊 ESG 指標與國際框架的要求。
 */
export class AlignmentEngine {
    private requirements: TFrameworkRequirement[] = [];

    constructor() {
        // 合併所有已註冊的框架要求
        this.requirements = [
            ...GRI_2021_REQUIREMENTS,
            ...ESRS_2_REQUIREMENTS
        ];
    }

    /**
     * 執行對齊分析
     * @param metrics 企業目前的 ESG 指標
     * @returns 每個要求的對齊狀態
     */
    public async analyze(metrics: EsgMetrics): Promise<TAlignmentStatus[]> {
        return Promise.all(this.requirements.map(req => {
            return this.evaluateRequirement(req, metrics);
        }));
    }

    private async evaluateRequirement(req: TFrameworkRequirement, metrics: EsgMetrics): Promise<TAlignmentStatus> {
        let status: TAlignmentStatus["status"] = "Gap";
        let confidenceScore = 0.95; // 基於 5T 協議的預設信任值
        let gapAnalysis = "";
        const evidenceIds: string[] = [];

        // 簡單映射邏輯 (後續可擴充為複雜的 MetricAlignment 矩陣)
        switch (req.id) {
            case "GRI-302-1":
                if ((metrics.energyConsumption || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = "已偵測到能源消耗數據，符合 GRI 302-1 揭露要求。";
                } else {
                    status = "Gap";
                    gapAnalysis = "尚未填寫能源消耗總量，無法執行 GRI 302-1 對齊。";
                }
                break;

            case "GRI-305-1":
                if ((metrics.scope1Emissions || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = "範疇一排放量數據完整。";
                } else {
                    status = "Gap";
                    gapAnalysis = "缺乏直接排放數據。";
                }
                break;

            case "GRI-305-2":
                if ((metrics.scope2Emissions || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = "範疇二排放量數據完整。";
                } else {
                    status = "Gap";
                    gapAnalysis = "缺乏能源間接排放數據。";
                }
                break;

            case "GRI-303-1":
                if ((metrics.waterUsage || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = "已備齊水資源消耗數據。";
                } else {
                    status = "Gap";
                    gapAnalysis = "缺乏水資源使用量數據。";
                }
                break;

            case "GRI-305-3":
                if ((metrics.scope3Emissions || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = "範疇三間接排放數據已識別，符合 GRI 305-3。";
                } else {
                    status = "Partial";
                    gapAnalysis = "範疇三數據尚未完整揭露，建議進行供應鏈碳盤查。";
                }
                break;

            case "GRI-306-3":
                if (((metrics.hazardousWaste || 0) + (metrics.nonHazardousWaste || 0)) > 0) {
                    status = "Aligned";
                    gapAnalysis = "廢棄物產出量數據完整。";
                } else {
                    status = "Gap";
                    gapAnalysis = "缺乏有害與無害廢棄物數據。";
                }
                break;

            case "GRI-405-1":
                if ((metrics.femaleManagementPct || 0) > 0) {
                    status = "Aligned";
                    gapAnalysis = `多樣性數據完整：管理階層女性比例為 ${metrics.femaleManagementPct}%。`;
                } else {
                    status = "Gap";
                    gapAnalysis = "缺乏管理階層背景多樣性數據。";
                }
                break;

            case "ESRS-2-BP-1":
                try {
                    const aiAdvice = await omniFlow({
                        text: "針對 ESRS 2-BP-1 (編寫基礎) 要求，目前企業僅具備基礎結構。請提供具體的補強建議。",
                        persona: {
                            name: "Alignment Engine",
                            title: "ESG Specialist",
                            description: "Automated AI Alignment Auditor"
                        }
                    });
                    status = "Partial";
                    gapAnalysis = aiAdvice;
                    confidenceScore = 0.88;
                } catch (e) {
                    status = "Partial";
                    gapAnalysis = "已具備基礎報告結構，但需進一步提供「編寫基礎 (Basis of Preparation)」的具體描述文本。";
                }
                break;

            default:
                status = "Gap";
                gapAnalysis = `框架要求 ${req.id} 尚無自動對齊映射，需人工介入。`;
                confidenceScore = 0.5;
        }

        // --- v4.5 Sovereign Logic: Soul Resonance & Hallucination Penalty ---
        const soulResonance = this.calculateSoulResonance(req, metrics, confidenceScore);
        const tacticalSovereignty = this.calculateTacticalSovereignty(req); // NEW Phase 13 logic

        const hallucinationPenalty = confidenceScore < 0.8 ? (0.8 - confidenceScore) * 2 : 0;
        const verifiedScore = Math.min(1, Math.max(0, soulResonance + tacticalSovereignty - hallucinationPenalty));

        return {
            requirementId: req.id,
            status,
            confidenceScore: verifiedScore,
            evidenceIds,
            gapAnalysis: `${gapAnalysis}${hallucinationPenalty > 0 ? ` [Hallucination Penalty Applied: -${hallucinationPenalty.toFixed(2)}]` : ""}${tacticalSovereignty > 0 ? ` [Tactical Boost: +${(tacticalSovereignty * 100).toFixed(0)}%]` : ""}`
        };
    }

    /**
     * Calculate Soul Resonance based on Mansion alignment
     */
    private calculateSoulResonance(req: TFrameworkRequirement, metrics: EsgMetrics, baseScore: number): number {
        // Find if this requirement is linked to a mansion
        // For demo: mapping GRI-305-* to "Azure Dragon" (E) mansions
        let resonance = baseScore;

        if (req.id.startsWith("GRI-305")) {
            // "KJL" (亢金龍) specialty is "大氣監測"
            const mansion = MANSIONS_DATA["KJL"];
            if (mansion && (metrics.scope1Emissions || 0) > 0) {
                resonance += 0.05; // Resonance Boost from specialty
            }
        }

        return Math.min(1, resonance);
    }

    /**
     * Calculate Tactical Sovereignty based on AI Skill Tree evolution
     */
    private calculateTacticalSovereignty(req: TFrameworkRequirement): number {
        // Safe access to getState
        const state = useEvolutionStore.getState();
        if (!state || !state.skills) return 0;

        const { skills } = state;

        // Find relevant skills for this requirement type
        const auditSkill = skills.find(s => s.id === 'audit-1');
        const logicSkill = skills.find(s => s.id === 'logic-1');

        let boost = 0;

        if (auditSkill && auditSkill.unlocked) {
            boost += (auditSkill.level / 100); // Max +10% boost from Audit level
        }

        if (logicSkill && logicSkill.unlocked && req.id.startsWith("GRI")) {
            boost += (logicSkill.level / 200); // Max +5% boost from Logic level
        }

        return boost;
    }
}

export const alignmentEngine = new AlignmentEngine();
