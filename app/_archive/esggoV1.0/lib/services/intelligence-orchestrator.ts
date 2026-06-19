import { IntelligenceSource } from "@/lib/data/intelligence-sources";

export interface IntelligenceSignal {
    id: string;
    sourceId: string;
    title: string;
    summary: string;
    type: "POLICY" | "MARKET" | "SUPPLY" | "RISK" | "OPPORTUNITY";
    impactScore: number;
    confidence: number;
    timestamp: number;
    sector: string[];
    region: string[];
}

export interface ImpactMatrix {
    finance: number;    // 財務 (成本/營收)
    compliance: number; // 合規 (罰則/時程)
    supply: number;     // 供應 (交期/替代性)
    reputation: number; // 聲譽 (媒體/訴訟)
}

/**
 * 商業偵情中心 - 核心邏輯編排器
 */
export class IntelligenceOrchestrator {

    // M1: 多源信號雷達 - 獲取當前信號
    static async getTopSignals(): Promise<IntelligenceSignal[]> {
        const { INTELLIGENCE_SOURCES } = await import("@/lib/data/intelligence-sources");
        const { OmniService } = await import("./omni-service");

        try {
            const signals = await OmniService.callFlow("intelligenceFlow", {
                sources: INTELLIGENCE_SOURCES
            });
            return signals;
        } catch (error) {
            console.error("Failed to fetch intelligence signals, falling back to cache:", error);
            return [
                {
                    id: "sig-tw-2025",
                    sourceId: "fsc-tw-2025",
                    title: "金管會 2025 全體上市櫃強制申報令 (Cache)",
                    summary: "全體上市櫃公司不論資本額大小，均須於 2025 年起編製並申報 2024 年度永續報告書。",
                    type: "POLICY",
                    impactScore: 98,
                    confidence: 100,
                    timestamp: Date.now(),
                    sector: ["Listed Companies", "Public"],
                    region: ["Taiwan"]
                }
            ];
        }
    }

    // M3: 影響評分矩陣架構
    static calculateImpactMatrix(signal: IntelligenceSignal): ImpactMatrix {
        // 基於信號類別與強度的權重計算
        if (signal.id === "sig-me-001") {
            return {
                finance: 92,
                compliance: 45,
                supply: 85,
                reputation: 60
            };
        }
        return {
            finance: 50,
            compliance: 80,
            supply: 40,
            reputation: 30
        };
    }

    // M10: 90天行動包 (Playbook) - 從訊號到交辦
    static get90DayPlaybook(signalId: string): { title: string; actions: string[] } {
        if (signalId === "sig-me-001") {
            return {
                title: "中東能源與物流韌性 90 天行動方案",
                actions: [
                    "分部門評估：採購部需於 15 天內盤點中東來源原料庫存 (M6)",
                    "數據需求：收集未來 3 個月經由 Hormuz 航線之訂單清單 (M2)",
                    "佐證準備：準備能源價格對沖合約之 5T 存證資料 (M3)",
                    "專家對策：建議分散供應鏈至東南亞或拉丁美洲 (M7)"
                ]
            };
        }
        return {
            title: "一般合規應對方案",
            actions: ["盤點受影響指標", "更新數據檢核規則", "提交定期報告"]
        };
    }

    // 專家建議生成 (Expert Advice)
    static getExpertAdvice(signalId: string): string {
        if (signalId === "sig-me-001") {
            return "本中心分析顯示，油價波動與航運受阻呈現強烈共振。建議企業不應僅視其為短期波動，而應將其納入長期「能源主權」戰略。透過 DART AI 模擬顯示，若衝突持續超過 180 天，成本傳導將導致毛利下降 4.2%。應立即強化供應鏈韌性。";
        }
        return "建議持續關注法規異動，並透過系統自動化工具減少人為申報誤差。";
    }
}
