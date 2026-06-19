export interface ReadingResource {
    id: string;
    title: string;
    organization: string;
    category: "Standard" | "Template" | "Yearbook" | "Guide";
    year: string;
    description: string;
    thumbnail?: string;
    viewUrl: string;
    downloadUrl?: string;
    officialUrl: string;
}

export const READING_ROOM_RESOURCES: ReadingResource[] = [
    {
        id: "twse-template-2025",
        title: "2025 永續報告書編製範本 (全體上市櫃適用)",
        organization: "證交所 (TWSE)",
        category: "Template",
        year: "2025",
        description: "配合金管會 2025 全面申報政策，提供中小型企業適用之標準化模板。",
        viewUrl: "https://cgc.twse.com.tw/promoteEvent/promoteEventContent/628",
        officialUrl: "https://cgc.twse.com.tw"
    },
    {
        id: "csrone-2024-yearbook",
        title: "2024 台灣永續報告現況白皮書",
        organization: "CSRone 永續智庫",
        category: "Yearbook",
        year: "2024",
        description: "深入分析台灣上市櫃公司永續資訊揭露趨勢與 SASB/TCFD 導入現況。",
        viewUrl: "https://csrone.com/reports",
        officialUrl: "https://csrone.com"
    },
    {
        id: "gri-standards-zh",
        title: "GRI 準則繁體中文版 (2021 版)",
        organization: "GRI (Global Reporting Initiative)",
        category: "Standard",
        year: "2021",
        description: "全球最廣泛採用之永續報告編製標準官方中文定義。",
        viewUrl: "https://www.globalreporting.org/how-to-use-the-gri-standards/gri-standards-translations-traditional-chinese/",
        officialUrl: "https://www.globalreporting.org"
    },
    {
        id: "fsc-roadmap-2025",
        title: "上市櫃公司永續發展路徑圖 (2025 更新版)",
        organization: "金管會 (FSC)",
        category: "Guide",
        year: "2025",
        description: "明確全體上市櫃公司之溫室氣體盤查與永續報告書申報時程。",
        viewUrl: "https://www.fsc.gov.tw",
        officialUrl: "https://www.fsc.gov.tw"
    },
    {
        id: "commonwealth-esg-2024",
        title: "2024 天下永續公民獎：企業標竿年鑑",
        organization: "天下雜誌",
        category: "Yearbook",
        year: "2024",
        description: "台灣企業 ESG 指標排行與優異案例深度報導。",
        viewUrl: "https://www.cw.com.tw/topic/csr",
        officialUrl: "https://www.cw.com.tw"
    }
];
