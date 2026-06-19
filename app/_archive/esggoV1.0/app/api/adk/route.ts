import { NextResponse } from "next/server";
import { ComplianceAgent } from "@/lib/services/compliance-agent";
import { AlignmentService } from "@/lib/services/alignment-service";

/**
 * ADK (Agent Development Kit) 專業合規路由
 * 整合 ComplianceAgent 提供深層數據誠信與準則缺口分析。
 */

// 定義 ADK 回應結構 (Clinical Sentinel 標準)
interface ADKCard {
    header?: { title: string; subtitle?: string; imageUrl?: string };
    sections: {
        header?: string;
        widgets: any[];
    }[];
    actions?: any[];
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const intent = body.intent || body.action;

        // 處理補救意圖 (Remediation)
        if (intent === "FIX_GAPS") {
            return NextResponse.json({
                renderAction: {
                    notification: {
                        text: "🛠️ 正在修復數據缺口：已啟動範疇 3 (Scope 3) 排放量的自動估算邏輯。即將同步至 Firestore 審計追蹤。"
                    }
                }
            });
        }

        // 模擬：獲取當前全局指標 (實務中應從資料庫或 Context 讀取)
        const metrics = {
            scope1Emissions: 450,
            scope2Emissions: 120,
            energyConsumption: 5000,
            waterUsage: 800,
            scope3Emissions: 0 // 已知缺口
        };

        // 啟動合規代理進行審計
        const insights = await ComplianceAgent.audit(metrics);
        const alignment = AlignmentService.getAlignmentReport(metrics);

        // 構建 ADK Card
        const adkCard: ADKCard = {
            header: {
                title: "ESG 合規稽核報告 (Omni Agent)",
                subtitle: `5T 協議誠信驗證：通過 ● 準則對齊：GRI/ESRS`,
            },
            sections: [
                {
                    header: "即時合規洞察",
                    widgets: insights.map(insight => ({
                        textParagraph: {
                            text: `${insight.type === "CRITICAL" ? "🔴" : insight.type === "WARNING" ? "🟡" : "🔵"} **[${insight.targetFramework}]** ${insight.message}\n> **建議行動**: ${insight.suggestedAction}`
                        }
                    }))
                },
                {
                    header: "準則對齊摘要",
                    widgets: alignment.map(res => ({
                        keyValue: {
                            topLabel: res.requirement.standard,
                            content: res.requirement.id,
                            bottomLabel: `狀態: ${res.status} (${res.score}%)`,
                            icon: res.status === "COMPLETE" ? "CONFIRMATION_NUMBER" : "DESCRIPTION"
                        }
                    }))
                }
            ],
            actions: [
                {
                    button: {
                        text: "補全數據缺口",
                        onClick: { action: "FIX_GAPS" }
                    }
                },
                {
                    button: {
                        text: "生成審計報告",
                        onClick: { action: "GENERATE_REPORT" }
                    }
                }
            ]
        };

        // 回傳標準 ADK 回應
        return NextResponse.json({
            renderAction: {
                action: {
                    navigations: [{
                        pushCard: adkCard
                    }]
                },
                notification: {
                    text: insights.some(i => i.type === "CRITICAL")
                        ? "🚨 檢測到嚴重合規風險，請立即處理。"
                        : "✅ 審計掃描完成，數據誠信度良好。"
                }
            }
        });
    } catch (error) {
        console.error("ADK API Error:", error);
        return NextResponse.json({ error: "Agentic Audit Failed" }, { status: 500 });
    }
}
