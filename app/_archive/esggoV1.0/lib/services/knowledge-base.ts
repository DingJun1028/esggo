/**
 * Knowledge Base Service — Omni Heart RAG 智庫召回
 * 用於召回歷史數據、ESG 指標定義與行業標竿，為 AI 寫作提供事實依據
 */

import { IOmniHeart, createOmniHeart } from "@/lib/omni-heart";

export interface KnowledgeSegment {
    id: string;
    title: string;
    content: string;
    category: string;
    source: string;
    griMapping?: string[];
    omniHeart: IOmniHeart;
}

// 模擬智庫數據 (Mock Knowledge Base)
const MOCK_KNOWLEDGE: KnowledgeSegment[] = [
    {
        id: "kb-001",
        title: "2023 範疇一排放數據摘要",
        content: "2023 年度全公司範疇一 (Scope 1) 總排放量為 1,250.5 tCO2e，主要來源為公務車用油與緊急發電機。",
        category: "Environment",
        source: "2023 ESG Report",
        griMapping: ["GRI 305-1"],
        omniHeart: createOmniHeart("Environment", "Carbon", "Historical_Report_2023")
    },
    {
        id: "kb-002",
        title: "GRI 302-1 能源消耗量計算準則",
        content: "機構應報告組織內部的總能源消耗量，包含不可再生能源、可再生能源、電力消耗量等合計值。",
        category: "Standards",
        source: "GRI Standard 2021",
        griMapping: ["GRI 302-1"],
        omniHeart: createOmniHeart("KnowledgeBase", "EternalRecord", "GRI_Official_Docs")
    },
    {
        id: "kb-003",
        title: "永續供應鏈：在地採購定義",
        content: "與組織進行業務往來的供應商，其營業地點位於組織運作之相同國家或地理範圍內者，視為在地供應商。",
        category: "Governance",
        source: "Omni Internal Policy v1.2",
        griMapping: ["GRI 204-1"],
        omniHeart: createOmniHeart("Governance", "Ethics", "Internal_Policy")
    }
];

/**
 * 語義檢索智庫素材 (RAG Recall)
 */
export async function retrieveKnowledge(
    query: string,
    limit: number = 3
): Promise<KnowledgeSegment[]> {
    console.log(`[RAG] Searching knowledge base for: "${query}"`);

    // 模擬網路延遲與簡單關鍵字匹配
    await new Promise(resolve => setTimeout(resolve, 800));

    const results = MOCK_KNOWLEDGE.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);

    // 若無結果，回傳隨機建議或通用準則
    if (results.length === 0) return MOCK_KNOWLEDGE.slice(0, 1);

    return results;
}

/**
 * 將召回素材格式化為 AI Prompt 的 Grounding Context
 */
export function formatKnowledgeForPrompt(segments: KnowledgeSegment[]): string {
    if (!segments.length) return "";

    const contextLines = segments.map(seg => {
        return `[數據來源: ${seg.source} (${seg.category})]\n標題: ${seg.title}\n內容: ${seg.content}\nUCC Hash: ${seg.omniHeart.A_Tagging.hash_lock}`;
    });

    return `\n### 智庫參考資料 (Omni Heart Grounding):\n${contextLines.join('\n---\n')}\n`;
}
