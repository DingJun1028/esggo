export type ChapterStatus = 'completed' | 'draft' | 'not-started';

export interface ChapterItem {
    id: string;
    title: string;
    status: ChapterStatus;
    progress: number;
}

export interface ChapterCategory {
    category: string;
    items: ChapterItem[];
}

export const ESG_STRUCTURE: ChapterCategory[] = [
    {
        category: "1 關於本報告書",
        items: [
            { id: "1-01", title: "1.01 經營者的話", status: "completed", progress: 100 },
            { id: "1-02", title: "1.02 關於本公司", status: "draft", progress: 80 },
            { id: "1-03", title: "1.03 報告書資訊", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "2 永續經營",
        items: [
            { id: "2-01", title: "2.01 永續發展策略", status: "not-started", progress: 0 },
            { id: "2-02", title: "2.02 推動永續發展機制", status: "not-started", progress: 0 },
            { id: "2-03", title: "2.03 董事會及功能性委員會", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "3 利害關係人與重大議題",
        items: [
            { id: "3-01", title: "3.01 利害關係人議合", status: "not-started", progress: 0 },
            { id: "3-02", title: "3.02 決定重大主題的流程", status: "not-started", progress: 0 },
            { id: "3-03", title: "3.03 重大主題列表", status: "not-started", progress: 0 },
            { id: "3-04", title: "3.04 重大議題之管理", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "4 治理面",
        items: [
            { id: "4-01", title: "4.01 經濟績效", status: "not-started", progress: 0 },
            { id: "4-02", title: "4.02 稅務", status: "not-started", progress: 0 },
            { id: "4-03", title: "4.03 誠信經營", status: "not-started", progress: 0 },
            { id: "4-04", title: "4.04 溝通管道及申訴機制", status: "not-started", progress: 0 },
            { id: "4-05", title: "4.05 風險管理", status: "not-started", progress: 0 },
            { id: "4-06", title: "4.06 資訊安全", status: "not-started", progress: 0 },
            { id: "4-07", title: "4.07 參與各類社團組織", status: "not-started", progress: 0 },
            { id: "4-08", title: "4.08 產品管理", status: "not-started", progress: 0 },
            { id: "4-09", title: "4.09 供應商管理", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "5 社會面",
        items: [
            { id: "5-01", title: "5.01 人力發展", status: "not-started", progress: 0 },
            { id: "5-02", title: "5.02 職業安全及衛生", status: "not-started", progress: 0 },
            { id: "5-03", title: "5.03 社區參與", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "6 環境面",
        items: [
            { id: "6-01", title: "6.01 氣候變遷", status: "not-started", progress: 0 },
            { id: "6-02", title: "6.02 溫室氣體排放", status: "not-started", progress: 0 },
            { id: "6-03", title: "6.03 能源管理", status: "not-started", progress: 0 },
            { id: "6-04", title: "6.04 水資源管理", status: "not-started", progress: 0 },
            { id: "6-05", title: "6.05 廢棄物管理", status: "not-started", progress: 0 },
        ]
    },
    {
        category: "7 附錄",
        items: [
            { id: "7-01", title: "7.01 附錄一、GRI 內容索引表", status: "not-started", progress: 0 },
            { id: "7-02", title: "7.02 附錄二、氣候相關資訊", status: "not-started", progress: 0 },
            { id: "7-03", title: "7.03 附錄三、產業別永續指標資訊", status: "not-started", progress: 0 },
            { id: "7-04", title: "7.04 附錄四、其他準則(如TCFD/SASB)內容索引表", status: "not-started", progress: 0 },
            { id: "7-05", title: "7.05 附錄五、確信機構意見書", status: "not-started", progress: 0 },
            { id: "7-06", title: "7.06 附錄六、其他", status: "not-started", progress: 0 },
        ]
    }
];
