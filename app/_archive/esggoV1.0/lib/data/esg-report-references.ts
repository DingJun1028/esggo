/**
 * ESG Report Reference Library
 * 標竿企業永續報告書範本資料庫
 *
 * Contains links to publicly available ESG reports from leading Taiwanese
 * and global companies, categorized by industry, framework, and year.
 */

export type ReportIndustry =
    | "半導體"
    | "電子製造"
    | "金融"
    | "能源"
    | "零售"
    | "食品"
    | "科技"
    | "化工"
    | "鋼鐵";

export type ReportFramework = "GRI" | "SASB" | "TCFD" | "ISSB" | "TWSE" | "整合報告";
export type ReportRating = "A+" | "A" | "B+" | "B" | "C";

export interface BenchmarkReport {
    id: string;
    company: string;           // 公司名稱
    companyEn?: string;
    industry: ReportIndustry;
    year: number;              // 報告年度
    frameworks: ReportFramework[];
    rating?: ReportRating;     // External rating
    highlights: string[];      // 3 key strengths of this report
    url: string;               // Public PDF URL
    thumbnailColor: string;    // Brand color for card
    pages?: number;
    language: "zh" | "en" | "bilingual";
    isGold?: boolean;          // ESG GO精選推薦
}

export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    industry?: ReportIndustry;
    frameworks: ReportFramework[];
    chapters: string[];        // Chapter titles
    wordCountTarget: number;   // Recommended total word count
    difficulty: "入門" | "標準" | "進階";
    color: string;
}

// ─────────────────────────────────────────────
// BENCHMARK REPORTS — 標竿企業
// ─────────────────────────────────────────────

export const BENCHMARK_REPORTS: BenchmarkReport[] = [
    {
        id: "tsmc-2023",
        company: "台灣積體電路製造",
        companyEn: "TSMC",
        industry: "半導體",
        year: 2023,
        frameworks: ["GRI", "TCFD", "SASB", "ISSB"],
        highlights: [
            "Scope 3 供應鏈減碳目標明確，涵蓋 200+ 供應商",
            "再生能源使用率達 9.8%，2030 目標 40%",
            "水資源循環利用率達 86.2%，高於業界標準"
        ],
        url: "https://esg.tsmc.com/download/file/2023_sustainabilityReport/chinese/c_all.pdf",
        thumbnailColor: "#005BAC",
        pages: 280,
        language: "bilingual",
        isGold: true,
    },
    {
        id: "delta-2023",
        company: "台達電子",
        companyEn: "Delta Electronics",
        industry: "電子製造",
        year: 2023,
        frameworks: ["GRI", "TCFD", "SASB"],
        rating: "A+",
        highlights: [
            "2030 年碳中和路徑圖完整，包含 Scope 1/2/3",
            "綠色工廠認證廠區超過 50 個",
            "ESG 相關薪酬連結機制完整揭露"
        ],
        url: "https://www.deltaww.com/en-US/CSR_Report",
        thumbnailColor: "#E31837",
        pages: 220,
        language: "bilingual",
        isGold: true,
    },
    {
        id: "cathay-2023",
        company: "國泰金融控股",
        companyEn: "Cathay Financial Holdings",
        industry: "金融",
        year: 2023,
        frameworks: ["GRI", "TCFD", "整合報告"],
        rating: "A",
        highlights: [
            "負責任投資 AUM 佔比 70%，完整 ESG 評分體系",
            "永續保單設計，連結 SDGs 產品創新",
            "供應鏈 ESG 盡職調查 100% 納入採購流程"
        ],
        url: "https://www.cathayholdings.com/holdings/intro/csr/report",
        thumbnailColor: "#006341",
        pages: 195,
        language: "zh",
        isGold: false,
    },
    {
        id: "acer-2023",
        company: "宏碁",
        companyEn: "Acer",
        industry: "科技",
        year: 2023,
        frameworks: ["GRI", "TCFD"],
        highlights: [
            "循環經濟設計：50% 回收材料整合目標",
            "負責任採購：衝突礦產 100% 可追溯",
            "女性主管比例 35%，多元共融指標優"
        ],
        url: "https://www.acer-group.com/sustainability/en/report.html",
        thumbnailColor: "#83B81A",
        pages: 160,
        language: "bilingual",
    },
    {
        id: "uni-president-2023",
        company: "統一企業",
        companyEn: "Uni-President Enterprises",
        industry: "食品",
        year: 2023,
        frameworks: ["GRI", "TWSE"],
        highlights: [
            "食品安全 ISO 22000 全廠認證，100% 稽核覆蓋率",
            "農業供應鏈永續採購比例 85%",
            "包裝減量與再生材料：塑膠使用減少 15%"
        ],
        url: "https://www.uni-president.com.tw/eng/csr/report.aspx",
        thumbnailColor: "#E8880A",
        pages: 140,
        language: "zh",
    },
    {
        id: "apple-2023",
        company: "Apple Inc.",
        companyEn: "Apple",
        industry: "科技",
        year: 2023,
        frameworks: ["GRI", "SASB", "TCFD", "ISSB"],
        rating: "A+",
        highlights: [
            "2030 碳中和承諾（含整個供應鏈及產品生命週期）",
            "100% 再生能源運營，要求供應商同步達成",
            "隱私設計（Privacy by Design）揭露為治理典範"
        ],
        url: "https://www.apple.com/environment/pdf/Apple_Environmental_Progress_Report_2023.pdf",
        thumbnailColor: "#1D1D1F",
        pages: 110,
        language: "en",
        isGold: true,
    },
    {
        id: "microsoft-2023",
        company: "Microsoft",
        companyEn: "Microsoft",
        industry: "科技",
        year: 2023,
        frameworks: ["GRI", "TCFD", "SASB"],
        rating: "A+",
        highlights: [
            "2030 碳負排放目標，並承諾 2050 消除歷史碳足跡",
            "AI 治理完整，Responsible AI Standard 全球領先",
            "供應鏈人權盡職調查覆蓋 100% 第一層供應商"
        ],
        url: "https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RW15mgm",
        thumbnailColor: "#00A4EF",
        pages: 165,
        language: "en",
        isGold: true,
    },
];

// ─────────────────────────────────────────────
// REPORT TEMPLATES — 撰寫範本
// ─────────────────────────────────────────────

export const REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: "gri-standard",
        name: "GRI 通用準則基礎版",
        description: "適合首次撰寫 ESG 報告的中小企業。覆蓋 GRI 2 系列通用揭露，結構清晰，易於上手。",
        frameworks: ["GRI", "TWSE"],
        chapters: [
            "一、經營者的話",
            "二、公司概況與治理架構",
            "三、重大議題鑑別分析",
            "四、環境績效：能源與碳排",
            "五、社會績效：員工與社區",
            "六、供應鏈管理",
            "七、附錄：GRI 索引",
        ],
        wordCountTarget: 15000,
        difficulty: "入門",
        color: "#10B981",
    },
    {
        id: "twse-listed",
        name: "上市上櫃企業合規版",
        description: "符合金管會及台灣證交所 ESG 資訊揭露規範，適合台灣上市上櫃公司使用。",
        frameworks: ["GRI", "TWSE", "TCFD"],
        chapters: [
            "一、關於本報告",
            "二、公司治理與道德誠信",
            "三、氣候風險與 TCFD 框架",
            "四、環境管理：能源、水、廢棄物",
            "五、社會責任：勞工、多元共融",
            "六、供應鏈永續",
            "七、重要議題深度揭露",
            "八、GRI / SASB 指標對照表",
        ],
        wordCountTarget: 25000,
        difficulty: "標準",
        color: "#3B82F6",
    },
    {
        id: "tcfd-advanced",
        name: "氣候財務揭露進階版 (TCFD/ISSB)",
        description: "針對已完成基礎揭露、希望對齊國際氣候金融標準的企業，提供 TCFD 四大支柱完整框架。",
        frameworks: ["GRI", "TCFD", "ISSB", "SASB"],
        chapters: [
            "一、治理：氣候治理架構與董事會責任",
            "二、策略：氣候情境分析（1.5°C / 4°C）",
            "三、風險管理：實體風險與轉型風險鑑別",
            "四、指標與目標：Scope 1/2/3 與 SBTi",
            "五、自然資本：水資源、生物多樣性",
            "六、社會影響：人權盡職調查",
            "七、ISSB S1/S2 對標揭露",
            "八、第三方確信聲明",
        ],
        wordCountTarget: 40000,
        difficulty: "進階",
        color: "#8B5CF6",
    },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function getReportsByIndustry(industry: ReportIndustry) {
    return BENCHMARK_REPORTS.filter((r) => r.industry === industry);
}

export function getGoldReports() {
    return BENCHMARK_REPORTS.filter((r) => r.isGold);
}

export function getUniqueIndustries(): ReportIndustry[] {
    return [...new Set(BENCHMARK_REPORTS.map((r) => r.industry))];
}
