export interface IESGStandard {
    id: string;
    name: string;
    description: string;
    category: "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE";
    requirements: string[];
}

export const ESG_STANDARDS: IESGStandard[] = [
    {
        id: "GRI-305-1",
        name: "GRI 305: 直接 (範疇一) 溫室氣體排放",
        description: "揭露報告期內直接溫室氣體排放量及相關基準線對比。",
        category: "ENVIRONMENTAL",
        requirements: [
            "總排放量 (tCO2e)",
            "數據來源憑證鏈",
            "GWP 係數來源說明",
            "5T 專業存證封裝"
        ]
    },
    {
        id: "GRI-302-1",
        name: "GRI 302: 組織內部的能源消耗量",
        description: "揭露組織內部消耗的各種能源總量。",
        category: "ENVIRONMENTAL",
        requirements: [
            "非再生能源消耗總量",
            "再生能源佔比",
            "能源強度指標",
            "5T 溯源驗證"
        ]
    },
    {
        id: "SASB-RR-FC",
        name: "SASB: 燃料消耗與車隊數據",
        description: "針對運輸業或具有大型車隊之組織，核算燃料效率與足跡。",
        category: "ENVIRONMENTAL",
        requirements: [
            "燃料消耗總能量",
            "可再生燃料百分比",
            "車隊里程 5T 監控數據"
        ]
    }
];
