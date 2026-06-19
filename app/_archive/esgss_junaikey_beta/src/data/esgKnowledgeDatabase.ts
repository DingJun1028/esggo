import { ILearningNexus } from "../types/impact-nexus";

/**
 * 🏛️ ESG Knowledge & Case Database
 * Core repository for "Service as Teaching" methodology.
 */
export const esgKnowledgeDatabase: ILearningNexus[] = [
    // --- ENVIRONMENTAL (E) ---
    {
        knowledgePoint: {
            title: "範疇三排放量 (Scope 3 Emissions)",
            content: "指企業價值鏈中產生的所有間接排放，包括上游供應商與下游產品使用。通常佔企業總排放的 70% 以上。",
            standard: "GRI",
            category: "E"
        },
        corporateCase: {
            company: "Apple",
            achievement: "承諾 2030 年達成全價值鏈碳中和。",
            context: "透過 100% 再生能源供應鏈計畫，已帶動超過 200 家供應商轉型。",
            impactLevel: 95
        }
    },
    {
        knowledgePoint: {
            title: "循環經濟 (Circular Economy)",
            content: "透過設計消除廢棄物、保持產品與材料及性能的最高價值、並促進自然系統再生。",
            standard: "SDGs",
            category: "E"
        },
        corporateCase: {
            company: "Patagonia",
            achievement: "實施 'Worn Wear' 計畫。",
            context: "鼓勵消費者修補而非購買新品，並回收無法修理的衣物，將廢棄物轉化為新資源。",
            impactLevel: 90
        }
    },
    {
        knowledgePoint: {
            title: "內部碳定價 (Internal Carbon Pricing)",
            content: "企業為其碳排放量設定一個虛擬價格，以將外部成本內部化，引導低碳投資決策。",
            standard: "TCFD",
            category: "E"
        },
        corporateCase: {
            company: "Microsoft",
            achievement: "自 2012 年起實施內部碳費。",
            context: "對各業務部門徵收碳費，並將資金投入碳移除技術與再生能源計畫。",
            impactLevel: 88
        }
    },

    // --- SOCIAL (S) ---
    {
        knowledgePoint: {
            title: "人權盡職調查 (Human Rights Due Diligence)",
            content: "企業識別、防止、減輕並解釋其如何應對對人權的負面影響的過程。",
            standard: "GRI",
            category: "S"
        },
        corporateCase: {
            company: "Unilever",
            achievement: "全面實施《聯合國工商業與人權指導原則》。",
            context: "對其棕櫚油供應鏈進行深度審核，確保農民獲得公正報酬並消除童工。",
            impactLevel: 85
        }
    },
    {
        knowledgePoint: {
            title: "多元、平等與共融 (DEI)",
            content: "確保工作場所尊重各種背景的員工，消除系統性歧視，並提供平等的發展機會。",
            standard: "SASB",
            category: "S"
        },
        corporateCase: {
            company: "Google",
            achievement: "年度多元化報告公開。",
            context: "透過無意識偏見培訓與透明的薪酬政策，提升女性與少數族裔在技術與領導層的比例。",
            impactLevel: 82
        }
    },

    // --- GOVERNANCE (G) ---
    {
        knowledgePoint: {
            title: "雙重重大性 (Double Materiality)",
            content: "同時考慮「財務重大性」（環境對企業的影響）與「影響重大性」（企業對社會與環境的影響）。",
            standard: "GRI",
            category: "G"
        },
        corporateCase: {
            company: "Allianz",
            achievement: "全面整合 ESG 風險至投資決策。",
            context: "對其投資組合進行嚴格的 ESG 審核，剔除不符合永續標準的標的。",
            impactLevel: 92
        }
    },
    {
        knowledgePoint: {
            title: "薪酬與 ESG 指標掛鉤",
            content: "將高階主管的薪酬一部分與企業的 ESG 表現（如減碳目標、多元化比例）掛鉤。",
            standard: "SASB",
            category: "G"
        },
        corporateCase: {
            company: "Shell",
            achievement: "將執行長薪酬與能源轉型績效連結。",
            context: "透過績效指標 (KPIs) 驅動領導層對永續轉型的承諾與責任感。",
            impactLevel: 80
        }
    }
];
