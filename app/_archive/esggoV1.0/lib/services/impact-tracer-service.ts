/**
 * ImpactTracer Service
 * 核心功能：掃描全章節內容，辨識跨章節的數據依賴與語意不一致。
 * [信/Tp] 善：透明算法解析聯動路徑。
 */

import { ESG_STRUCTURE } from "@/lib/data/esg-structure";
import { ImpactItem } from "@/components/wizard/impact-analysis-sidebar";

interface DraftData {
    [chapterId: string]: {
        content: string;
        lastModified: number | string; // Renamed to lastModified to match core hooks
        status?: string;
    };
}

export function traceImpacts(drafts: DraftData): ImpactItem[] {
    const impacts: ImpactItem[] = [];

    // 1. 溫室氣體 vs 能源使用 (Scoped Trace)
    const envEnergy = Object.entries(drafts).find(([id]) => id.includes("能源") || id.includes("302"));
    const envCarbon = Object.entries(drafts).find(([id]) => id.includes("排放") || id.includes("305"));

    if (envEnergy && envCarbon) {
        const energyUpdate = new Date(envEnergy[1].lastModified).getTime();
        const carbonUpdate = new Date(envCarbon[1].lastModified).getTime();

        // 如果能源數據比碳排數據「晚」更新，且章節已撰寫，則提示聯動
        if (energyUpdate > carbonUpdate && envCarbon[1].content.length > 100) {
            impacts.push({
                id: `imp-env-${Date.now()}`,
                chapterId: envCarbon[0],
                chapterTitle: envCarbon[0],
                description: `偵測到「能源管理」數據有更新（${new Date(energyUpdate).toLocaleTimeString()}），建議同步修正「溫室氣體排放」中的排放係數與總額。`,
                severity: "high",
                suggestedAction: "檢查範疇二 (Scope 2) 的台電排放係數是否對齊最新的能源消耗量。",
                status: "pending"
            });
        }
    }

    // 2. 董事會 vs 治理架構
    const govBoard = Object.entries(drafts).find(([id]) => id.includes("董事會") || id.includes("2-9"));
    const govEthics = Object.entries(drafts).find(([id]) => id.includes("道德") || id.includes("Ethics"));

    if (govBoard && govEthics) {
        const boardUpdate = new Date(govBoard[1].lastModified).getTime();
        const ethicsUpdate = new Date(govEthics[1].lastModified).getTime();

        if (boardUpdate > ethicsUpdate && govEthics[1].content.length > 50) {
            impacts.push({
                id: `imp-gov-${Date.now()}`,
                chapterId: govEthics[0],
                chapterTitle: govEthics[0],
                description: "董事會組成變動可能影響反貪腐政策的監督層級描述。",
                severity: "medium",
                suggestedAction: "核對治理委員會成員清單。",
                status: "pending"
            });
        }
    }

    // 3. Management Ambition vs Data Gap (Gap Trace)
    const statement = Object.values(drafts).find(d => d.content.includes("淨零") || d.content.includes("Net Zero") || d.content.includes("氣候目標"));
    const envChapter = drafts["2.01"] || drafts["GRI-305"];

    if (statement && (!envChapter || envChapter.content.length < 200)) {
        impacts.push({
            id: `gap-ambition-${Date.now()}`,
            chapterId: "2.01",
            chapterTitle: "環境治理章節",
            description: "經營者聲明中提及「淨零目標」，但環境章節內容不足以支撐此承諾，存在誠信揭露風險。",
            severity: "high",
            suggestedAction: "請至少提供範疇一、二排放數據與具體減碳路徑。",
            status: "pending"
        });
    }

    return impacts;
}
