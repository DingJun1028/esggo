export interface Question {
    id: number;
    question: {
        zh: string;
        en: string;
    };
    gri_mapping: string;
}

export interface Chapter {
    id: string;
    title: {
        zh: string;
        en: string;
    };
    intro: {
        zh: string;
        en: string;
    };
    questions: Question[];
    conclusion?: {
        zh: string;
        en: string;
    };
    tips?: string[];
}

export const Omni_REPORT_DATA: Chapter[] = [
    {
        id: "ch1",
        title: { zh: "第一章｜公司概況", en: "Chapter 1 | Company Profile" },
        intro: { zh: "請提供公司基本資訊以建立報告基礎。", en: "Please provide basic company information to establish the report foundation." },
        questions: [
            { id: 1, question: { zh: "請輸入公司全名、成立日期及主要業務範疇。", en: "Please enter the company full name, incorporation date, and main business scope." }, gri_mapping: "GRI 2-1" },
            { id: 2, question: { zh: "詳細描述公司的組織架構與部門組成。", en: "Describe the organization chart and departmental composition in detail." }, gri_mapping: "GRI 2-2" },
            { id: 3, question: { zh: "確認本報告之核算期間與地理邊界（涵蓋據點）。", en: "Confirm the reporting period and geographic boundaries (covered sites) for this report." }, gri_mapping: "GRI 2-3" },
            { id: 4, question: { zh: "識別本報告的主要利害關係人（投資人、客戶、員工、監管機構）。", en: "Identify the primary stakeholders (Investors, clients, employees, regulators)." }, gri_mapping: "GRI 2-4" },
            { id: 5, question: { zh: "列出公司參與之外部倡議或專業組織（如 RE100、TCFD、SBTi）。", en: "List the initiatives or organizations the company participates in (e.g., RE100, TCFD, SBTi)." }, gri_mapping: "GRI 2-15" },
            { id: 6, question: { zh: "說明本報告是否取得第三方外部查證及其機構名稱。", en: "State whether the report has been externally verified and the name of the provider." }, gri_mapping: "GRI 2-14" },
        ],
        conclusion: { zh: "第一章「公司概況」基本數據已完成核算。", en: "Chapter 1 basic data accounting completed." },
    },
    {
        id: "ch2",
        title: { zh: "第二章｜公司治理", en: "Chapter 2 | Corporate Governance" },
        intro: { zh: "評估公司治理體系與內部控制制度。", en: "Assess corporate governance and internal control systems." },
        questions: [
            { id: 7, question: { zh: "說明董事會組成，包含獨立董事人數與女性席次比例。", en: "Describe board composition, including independent directors and female ratio." }, gri_mapping: "GRI 2-9" },
            { id: 8, question: { zh: "公司是否設立 ESG 專責單位或永續發展委員會？請說明負責人。", en: "Is there a dedicated ESG unit or sustainability committee? Specify the lead." }, gri_mapping: "GRI 2-12" },
            { id: 9, question: { zh: "記錄年度永續發展委員會會議頻率與重大決議摘要。", en: "Record annual committee meeting frequency and summaries of key decisions." }, gri_mapping: "FSC Requirements" },
            { id: 10, question: { zh: "說明反貪腐政策之實施現況及年度違規紀錄。", en: "Describe anti-corruption policy implementation and annual violations." }, gri_mapping: "GRI 205-1" },
            { id: 11, question: { zh: "執行重大性評估之流程及其識別之關鍵 ESG 議題。", en: "The materiality assessment process and identified key ESG issues." }, gri_mapping: "GRI 3-1 / 3-2" },
            { id: 12, question: { zh: "說明吹哨者保護制度及檢舉溝通管道。", en: "Describe whistleblower protection and reporting channels." }, gri_mapping: "GRI 2-26" },
            { id: 13, question: { zh: "描述公司的風險管理架構及年度識別之重大風險項目。", en: "Describe the risk management framework and identified major risks." }, gri_mapping: "TCFD Governance" },
        ],
        conclusion: { zh: "第二章「公司治理」數據已完成對標。", en: "Chapter 2 data aligned." },
    },
    {
        id: "ch3",
        title: { zh: "第三章｜環境永續", en: "Chapter 3 | Environmental Sustainability" },
        intro: { zh: "量化環境影響指標與資源使用效率。", en: "Quantify environmental impact indicators and resource efficiency." },
        questions: [
            { id: 14, question: { zh: "核算年度範疇一（直接排放）之溫室氣體總量。", en: "Calculate annual Scope 1 (Direct) GHG emissions." }, gri_mapping: "GRI 305-1, ISO 14064" },
            { id: 15, question: { zh: "核算年度範疇二（能源間接排放）之總量及計算方法。", en: "Calculate annual Scope 2 emissions and methodology used." }, gri_mapping: "GRI 305-2" },
            { id: 16, question: { zh: "是否執行範疇三（價值鏈）盤查？請列出涵蓋類別。", en: "Is Scope 3 (Value Chain) inventoried? List categories covered." }, gri_mapping: "GRI 305-3" },
            { id: 17, question: { zh: "記錄年度能源消耗總量及再生能源使用佔比。", en: "Record total energy consumption and renewable energy ratio." }, gri_mapping: "GRI 302-1" },
            { id: 18, question: { zh: "核算年度取水量及涉及水資源壓力之廠區。 ", en: "Calculate annual water withdrawal and sites in water-stressed areas." }, gri_mapping: "GRI 303-3" },
            { id: 19, question: { zh: "揭露年度廢棄物產生量及處置方案。 ", en: "Disclose annual waste generation and disposal methods." }, gri_mapping: "GRI 306-3" },
            { id: 20, question: { zh: "說明碳減量目標之設定及其達成進度。", en: "Describe carbon reduction targets and current progress." }, gri_mapping: "GRI 305-5" },
            { id: 21, question: { zh: "執行氣候情境分析（1.5°C / 2°C / 4°C）之結果。", en: "Results of climate scenario analysis (1.5°C / 2°C / 4°C)." }, gri_mapping: "TCFD Strategy" },
            { id: 22, question: { zh: "揭露淨零排放路徑圖及其目標基準年。", en: "Disclose net-zero roadmap and base year." }, gri_mapping: "TCFD High Priority" },
            { id: 23, question: { zh: "說明供應鏈碳足跡盤查之執行現況。", en: "Describe the status of supply chain carbon footprinting." }, gri_mapping: "GRI 308" },
            { id: 24, question: { zh: "說明綠色採購政策及其實施比例。", en: "Describe green procurement policy and implementation ratio." }, gri_mapping: "GRI 204" },
        ],
        conclusion: { zh: "第三章「環境永續」數據已完成量化處理。", en: "Chapter 3 environmental data quantified." },
    },
    {
        id: "ch4",
        title: { zh: "第四章｜社會責任", en: "Chapter 4 | Social Responsibility" },
        intro: { zh: "評估人力資源管理與社會影響力指標。", en: "Assess human resources management and social impact indicators." },
        questions: [
            { id: 25, question: { zh: "統計年度員工總數、性別比例及僱用類型。", en: "Stat total employee count, gender ratio, and employment type." }, gri_mapping: "GRI 2-7" },
            { id: 26, question: { zh: "核算員工平均薪資及性別薪酬比。", en: "Calculate average salary and gender pay gap ratio." }, gri_mapping: "GRI 2-21" },
            { id: 27, question: { zh: "統計年度職業災害件數及重大工安事故紀錄。", en: "Stat annual occupational injuries and major accident records." }, gri_mapping: "GRI 403-9" },
            { id: 28, question: { zh: "核算員工年度平均受訓時數。", en: "Calculate average annual training hours per employee." }, gri_mapping: "GRI 404-1" },
            { id: 29, question: { zh: "描述多元共融（DE&I）相關政策及其執行成果。", en: "Describe DE&I policies and implementation outcomes." }, gri_mapping: "GRI 405" },
            { id: 30, question: { zh: "提供員工滿意度調查結果及年度留任率。", en: "Provide employee satisfaction results and retention rate." }, gri_mapping: "GRI 401" },
            { id: 31, question: { zh: "說明供應商社會責任稽核進度與結果。", en: "Describe supplier social audit progress and results." }, gri_mapping: "GRI 414" },
            { id: 32, question: { zh: "說明客戶隱私保護機制及年度資料外洩紀錄。", en: "Describe customer privacy mechanisms and data breach records." }, gri_mapping: "GRI 418" },
            { id: 33, question: { zh: "列出年度社區參與項目及其投入金額。", en: "List community engagement projects and invested amounts." }, gri_mapping: "GRI 413" },
            { id: 34, question: { zh: "執行人權盡職調查之現況及其覆蓋群體。", en: "Status of human rights due diligence and covered groups." }, gri_mapping: "GRI 411 High Priority" },
        ],
        conclusion: { zh: "第四章「社會責任」社會指標已完成核實。", en: "Chapter 4 social indicators verified." },
    },
    {
        id: "ch5",
        title: { zh: "第五章｜資訊安全與附錄", en: "Chapter 5 | InfoSec & Appendix" },
        intro: { zh: "完善資訊安全框架與標準對照表。", en: "Complete InfoSec framework and standard indexes." },
        questions: [
            { id: 35, question: { zh: "說明資訊安全管理政策及相關國際認證（如 ISO 27001）取得現況。", en: "Describe InfoSec policy and status of international certifications (e.g., ISO 27001)." }, gri_mapping: "FSC Requirements" },
            { id: 36, question: { zh: "揭露年度資安事件及事件響應通報流程。", en: "Disclose annual InfoSec incidents and response protocols." }, gri_mapping: "FSC Requirements" },
            { id: 37, question: { zh: "說明個人資料保護機制及影響評估（DPIA）執行現況。", en: "Describe data protection mechanisms and DPIA status." }, gri_mapping: "GRI 418" },
            { id: 38, question: { zh: "確認 GRI 內容索引表之完整性。", en: "Confirm GRI Content Index completeness." }, gri_mapping: "GRI Requirement" },
            { id: 39, question: { zh: "確認 TCFD 揭露對照表之完整性。", en: "Confirm TCFD Disclosure Index completeness." }, gri_mapping: "TCFD Requirement" },
            { id: 40, question: { zh: "上傳第三方確信聲明書。", en: "Upload third-party assurance statement." }, gri_mapping: "FSC High Priority" },
            { id: 41, question: { zh: "彙整利害關係人溝通清單與會議紀錄。", en: "Compile stakeholder communication lists and minutes." }, gri_mapping: "GRI 2-29" },
        ],
        conclusion: { zh: "永續報告數據引導流程已全數完成。", en: "Reporting guidance flow fully completed." },
    },
];

export const PRIORITY_ITEMS = [
    {
        item: { zh: "氣候情境分析（TCFD）", en: "Climate Scenario Analysis (TCFD)" },
        level: { zh: "🔴 最高", en: "🔴 Highest" },
        reason: { zh: "TCFD 核心要求，審查必看", en: "TCFD core requirement, mandatory for review" }
    },
    {
        item: { zh: "碳中和路徑圖", en: "Net-Zero Roadmap" },
        level: { zh: "🔴 高", en: "🔴 High" },
        reason: { zh: "投資人最關注的承諾", en: "Commitment investors care about most" }
    },
    {
        item: { zh: "第三方查證報告", en: "Third-party Assurance" },
        level: { zh: "🔴 建議項", en: "🔴 Recommended" },
        reason: { zh: "建議盡早委託確信機構", en: "Advised to appoint assurance provider early" }
    },
    {
        item: { zh: "永續委員會議事錄", en: "Sustainability Committee Minutes" },
        level: { zh: "🔴 必要項", en: "🔴 Required" },
        reason: { zh: "確認開會紀錄完整存檔", en: "Ensure minutes are fully archived" }
    },
];

