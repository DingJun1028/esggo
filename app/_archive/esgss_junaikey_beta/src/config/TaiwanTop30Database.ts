/**
 * 台灣Top 30企業永續報告書分析系統
 * ====================================
 * 追蹤台積電、台達電、鴻海等領導企業的5年永續趨勢
 */

export interface CompanyESGProfile {
    // 基本資訊
    companyId: string;
    companyName: string;
    companyNameEn: string;
    stockCode: string;
    industry: string;
    sector: string;
    marketCap: number; // 市值（億元）
    employees: number;

    // 年度報告書數據
    reports: AnnualESGReport[];

    // 綜合評級
    ratings: {
        djsi?: { year: number; score: number; ranking?: string }[];
        msci?: { year: number; rating: string }[];
        cdp?: { year: number; rating: string }[];
        ecovadis?: { year: number; rating: string; score?: number }[];
        tcfd?: { year: number; supporter: boolean; fullyAligned?: boolean }[];
    };

    // 獎項
    awards?: CompanyAward[];
}

export interface AnnualESGReport {
    year: number;
    publishDate: Date;
    reportUrl?: string;

    // 報告書特性
    frameworks: {
        gri: boolean;
        griVersion?: string;
        griLevel?: 'Core' | 'Comprehensive';
        sasb: boolean;
        tcfd: boolean;
        ifrs_s1_s2?: boolean;
        sdgs: boolean;
        ungc: boolean; // UN Global Compact
        iso26000: boolean;
    };

    // 確信/保證
    assurance: {
        hasAssurance: boolean;
        provider?: string;
        standard?: string; // ISAE 3000, AA1000
        level?: 'Limited' | 'Reasonable';
        scope?: string[];
    };

    // 關鍵績效指標
    kpis: ESGKeyMetrics;

    // 目標與承諾
    targets: {
        netZeroYear?: number;
        re100Committed?: boolean;
        re100TargetYear?: number;
        sbti?: boolean;
        sbtiApproved?: boolean;
        othertargets?: string[];
    };

    // 特色亮點
    highlights?: string[];

    // 報告書頁數與品質
    totalPages: number;
    hasEnglishVersion: boolean;
    innovativeElements?: string[]; // 創新元素（AR、影片、互動網頁等）
}

export interface ESGKeyMetrics {
    // 環境 (E)
    environment: {
        // 溫室氣體
        scope1Emissions?: number; // tCO2e
        scope2Emissions?: number;
        scope3Emissions?: number;
        totalEmissions?: number;
        emissionsIntensity?: number; // tCO2e/百萬營收
        emissionsReduction?: number; // % vs 基準年

        // 能源
        totalEnergy?: number; // GJ
        renewableEnergy?: number; // GJ
        renewableEnergyPercentage?: number; // %
        energyIntensity?: number;

        // 水資源
        waterWithdrawal?: number; // 公噸
        waterRecyclingRate?: number; // %

        // 廢棄物
        totalWaste?: number; // 公噸
        wasteRecyclingRate?: number; // %
        hazardousWaste?: number;

        // 其他環境投資
        environmentalInvestment?: number; // 百萬元
    };

    // 社會 (S)
    social: {
        // 員工
        totalEmployees?: number;
        femaleEmployeeRate?: number; // %
        femaleManagerRate?: number; // %
        employeeTurnoverRate?: number; // %

        // 訓練
        trainingHoursPerEmployee?: number;
        trainingInvestment?: number; // 百萬元

        // 職業安全
        ltifr?: number; // Lost Time Injury Frequency Rate
        occupationalDiseaseRate?: number;
        zeroFatalities?: boolean;

        // 薪酬福利
        avgSalary?: number; // 千元
        avgSalaryGrowth?: number; // % vs 前年

        // 供應鏈
        supplierESGAudits?: number;
        supplierImprovementRate?: number; // %

        // 社會投資
        socialInvestment?: number; // 百萬元
        volunteerHours?: number;
    };

    // 治理 (G)
    governance: {
        // 董事會
        boardSize?: number;
        independentDirectors?: number;
        independentDirectorRate?: number; // %
        femaleDirectors?: number;
        femaleDirectorRate?: number; // %

        // 會議
        boardMeetings?: number;
        boardAttendanceRate?: number; // %

        // 倫理
        ethicsTrainingRate?: number; // %
        corruptionIncidents?: number;

        // 資訊安全
        cyberSecurityInvestment?: number; // 百萬元
        dataBreaches?: number;
    };
}

export interface CompanyAward {
    year: number;
    awardName: string;
    organizer: string;
    category?: string;
    ranking?: string;
}

/**
 * 台灣Top 30企業永續資料庫
 * 重點企業：台積電、台達電、鴻海
 */
export const TAIWAN_TOP30_ESG_DATABASE: CompanyESGProfile[] = [
    // === 1. 台積電 TSMC ===
    {
        companyId: 'TSMC_2330',
        companyName: '台灣積體電路製造股份有限公司',
        companyNameEn: 'Taiwan Semiconductor Manufacturing Company',
        stockCode: '2330',
        industry: '半導體業',
        sector: '科技',
        marketCap: 200000, // 約20兆（2024概估）
        employees: 73000,

        ratings: {
            djsi: [
                { year: 2023, score: 89, ranking: '全球半導體產業第1名' },
                { year: 2022, score: 87, ranking: '全球半導體產業第1名' },
                { year: 2021, score: 85, ranking: '全球半導體產業第1名' }
            ],
            msci: [
                { year: 2023, rating: 'AAA' },
                { year: 2022, rating: 'AAA' }
            ],
            cdp: [
                { year: 2023, rating: 'A' },
                { year: 2022, rating: 'A' },
                { year: 2021, rating: 'A-' }
            ]
        },

        awards: [
            {
                year: 2023,
                awardName: 'DJSI世界指數成份股',
                organizer: 'S&P Global',
                category: '半導體產業',
                ranking: '全球第1'
            },
            {
                year: 2023,
                awardName: 'CDP氣候變遷領導等級',
                organizer: 'CDP',
                category: 'Climate Change',
                ranking: 'A'
            }
        ],

        reports: [
            {
                year: 2023,
                publishDate: new Date('2024-06-30'),
                frameworks: {
                    gri: true,
                    griVersion: 'GRI 2021',
                    griLevel: 'Comprehensive',
                    sasb: true,
                    tcfd: true,
                    ifrs_s1_s2: false, // 2025年開始適用
                    sdgs: true,
                    ungc: true,
                    iso26000: true
                },
                assurance: {
                    hasAssurance: true,
                    provider: 'BSI與DNV',
                    standard: 'ISAE 3000, AA1000',
                    level: 'Reasonable',
                    scope: ['GHG Scope 1/2', '能源', '水資源']
                },
                kpis: {
                    environment: {
                        scope1Emissions: 180000,
                        scope2Emissions: 12800000,
                        scope3Emissions: 28500000,
                        totalEmissions: 41480000,
                        emissionsIntensity: 185.2, // tCO2e/百萬營收
                        emissionsReduction: 4.2, // vs 2020基準年
                        totalEnergy: 221000000, // GJ
                        renewableEnergy: 55250000,
                        renewableEnergyPercentage: 25.0,
                        waterWithdrawal: 180000000, // 公噸
                        waterRecyclingRate: 87.0,
                        totalWaste: 310000,
                        wasteRecyclingRate: 95.2,
                        environmentalInvestment: 12500
                    },
                    social: {
                        totalEmployees: 73000,
                        femaleEmployeeRate: 35.2,
                        femaleManagerRate: 21.5,
                        employeeTurnoverRate: 3.8,
                        trainingHoursPerEmployee: 68.5,
                        trainingInvestment: 1850,
                        ltifr: 0.08,
                        zeroFatalities: true,
                        avgSalary: 2850,
                        avgSalaryGrowth: 5.8,
                        supplierESGAudits: 580,
                        socialInvestment: 850,
                        volunteerHours: 28500
                    },
                    governance: {
                        boardSize: 13,
                        independentDirectors: 5,
                        independentDirectorRate: 38.5,
                        femaleDirectors: 3,
                        femaleDirectorRate: 23.1,
                        boardMeetings: 12,
                        boardAttendanceRate: 98.5,
                        ethicsTrainingRate: 100,
                        corruptionIncidents: 0,
                        cyberSecurityInvestment: 1200,
                        dataBreaches: 0
                    }
                },
                targets: {
                    netZeroYear: 2050,
                    re100Committed: true,
                    re100TargetYear: 2050,
                    sbti: true,
                    sbtiApproved: true
                },
                highlights: [
                    '連續7年入選DJSI世界指數',
                    'CDP氣候變遷、水安全雙A評級',
                    '全球首家承諾RE100的半導體公司',
                    'SBTi科學基礎減碳目標獲批准',
                    '綠建築認證廠房達100%'
                ],
                totalPages: 368,
                hasEnglishVersion: true,
                innovativeElements: ['互動式網頁版', 'AR擴增實境', 'ESG數據儀表板']
            },
            {
                year: 2022,
                publishDate: new Date('2023-06-28'),
                frameworks: {
                    gri: true,
                    griVersion: 'GRI 2021',
                    griLevel: 'Comprehensive',
                    sasb: true,
                    tcfd: true,
                    sdgs: true,
                    ungc: true,
                    iso26000: true
                },
                assurance: {
                    hasAssurance: true,
                    provider: 'BSI與DNV',
                    standard: 'ISAE 3000, AA1000',
                    level: 'Reasonable',
                    scope: ['GHG Scope 1/2', '能源', '水資源']
                },
                kpis: {
                    environment: {
                        scope1Emissions: 175000,
                        scope2Emissions: 12500000,
                        scope3Emissions: 27800000,
                        totalEmissions: 40475000,
                        emissionsIntensity: 192.5,
                        emissionsReduction: 2.8,
                        renewableEnergyPercentage: 21.0,
                        waterRecyclingRate: 86.5,
                        wasteRecyclingRate: 94.8
                    },
                    social: {
                        totalEmployees: 71000,
                        femaleEmployeeRate: 34.8,
                        trainingHoursPerEmployee: 65.2,
                        ltifr: 0.09,
                        zeroFatalities: true,
                        avgSalaryGrowth: 6.2
                    },
                    governance: {
                        boardSize: 13,
                        independentDirectorRate: 38.5,
                        femaleDirectorRate: 23.1,
                        ethicsTrainingRate: 100,
                        corruptionIncidents: 0
                    }
                },
                targets: {
                    netZeroYear: 2050,
                    re100Committed: true,
                    re100TargetYear: 2050,
                    sbti: true,
                    sbtiApproved: false // 2023年獲批
                },
                totalPages: 352,
                hasEnglishVersion: true
            }
            // ... 可擴充至2019-2021年數據
        ]
    },

    // === 2. 台達電 Delta Electronics ===
    {
        companyId: 'DELTA_2308',
        companyName: '台達電子工業股份有限公司',
        companyNameEn: 'Delta Electronics, Inc.',
        stockCode: '2308',
        industry: '電子零組件業',
        sector: '科技',
        marketCap: 8500,
        employees: 96000,

        ratings: {
            djsi: [
                { year: 2023, score: 92, ranking: '全球電子設備產業第1名' },
                { year: 2022, score: 91, ranking: '全球電子設備產業第1名' }
            ],
            cdp: [
                { year: 2023, rating: 'A' },
                { year: 2022, rating: 'A' },
                { year: 2021, rating: 'A' }
            ]
        },

        awards: [
            {
                year: 2023,
                awardName: 'DJSI世界指數成份股',
                organizer: 'S&P Global',
                ranking: '連續13年入選'
            },
            {
                year: 2023,
                awardName: 'CDP氣候變遷、水安全、供應鏈議合領導等級',
                organizer: 'CDP',
                ranking: '三項A級（3A）'
            }
        ],

        reports: [
            {
                year: 2023,
                publishDate: new Date('2024-06-15'),
                frameworks: {
                    gri: true,
                    griVersion: 'GRI 2021',
                    griLevel: 'Comprehensive',
                    sasb: true,
                    tcfd: true,
                    sdgs: true,
                    ungc: true,
                    iso26000: true
                },
                assurance: {
                    hasAssurance: true,
                    provider: 'BSI',
                    standard: 'AA1000',
                    level: 'Reasonable',
                    scope: ['完整報告書', 'GHG Scope 1/2/3']
                },
                kpis: {
                    environment: {
                        scope1Emissions: 58000,
                        scope2Emissions: 785000,
                        scope3Emissions: 18500000,
                        totalEmissions: 19343000,
                        emissionsReduction: 62.5, // vs 2014基準年（顯著領先）
                        renewableEnergyPercentage: 63.0, // 業界領先
                        waterRecyclingRate: 78.5,
                        wasteRecyclingRate: 92.3,
                        environmentalInvestment: 3500
                    },
                    social: {
                        totalEmployees: 96000,
                        femaleEmployeeRate: 38.5,
                        trainingHoursPerEmployee: 52.3,
                        ltifr: 0.12,
                        zeroFatalities: true,
                        supplierESGAudits: 420,
                        socialInvestment: 450
                    },
                    governance: {
                        boardSize: 9,
                        independentDirectorRate: 44.4,
                        femaleDirectorRate: 33.3,
                        ethicsTrainingRate: 100,
                        corruptionIncidents: 0
                    }
                },
                targets: {
                    netZeroYear: 2030, // 比台積電更積極
                    re100Committed: true,
                    re100TargetYear: 2030,
                    sbti: true,
                    sbtiApproved: true
                },
                highlights: [
                    '連續13年入選DJSI世界指數',
                    'CDP三項評比皆獲A級（氣候、水、供應鏈）',
                    '2030淨零目標（全球最積極的科技公司之一）',
                    '再生能源使用率63%（業界領先）',
                    '累計減碳6250萬噸（透過高效產品）'
                ],
                totalPages: 286,
                hasEnglishVersion: true,
                innovativeElements: ['互動式ESG網站', 'VR廠房導覽', '碳足跡計算器']
            }
        ]
    },

    // === 3. 鴻海精密 Foxconn ===
    {
        companyId: 'FOXCONN_2317',
        companyName: '鴻海精密工業股份有限公司',
        companyNameEn: 'Hon Hai Precision Industry Co., Ltd.',
        stockCode: '2317',
        industry: '電子通路業',
        sector: '科技',
        marketCap: 20000,
        employees: 826000, // 全球員工

        ratings: {
            djsi: [
                { year: 2023, score: 78, ranking: '入選新興市場指數' }
            ],
            cdp: [
                { year: 2023, rating: 'B' },
                { year: 2022, rating: 'B' }
            ]
        },

        reports: [
            {
                year: 2023,
                publishDate: new Date('2024-07-31'),
                frameworks: {
                    gri: true,
                    griVersion: 'GRI 2021',
                    sasb: true,
                    tcfd: true,
                    sdgs: true,
                    ungc: true,
                    iso26000: false
                },
                assurance: {
                    hasAssurance: true,
                    provider: 'SGS',
                    standard: 'AA1000',
                    level: 'Limited',
                    scope: ['GHG Scope 1/2', '部分社會指標']
                },
                kpis: {
                    environment: {
                        scope1Emissions: 425000,
                        scope2Emissions: 3850000,
                        scope3Emissions: 125000000, // 供應鏈龐大
                        totalEmissions: 129275000,
                        renewableEnergyPercentage: 15.8,
                        waterRecyclingRate: 65.2,
                        wasteRecyclingRate: 88.5
                    },
                    social: {
                        totalEmployees: 826000,
                        femaleEmployeeRate: 42.5,
                        trainingHoursPerEmployee: 38.5,
                        ltifr: 0.15,
                        zeroFatalities: false, // 全球大規模製造的挑戰
                        supplierESGAudits: 1250,
                        socialInvestment: 280
                    },
                    governance: {
                        boardSize: 11,
                        independentDirectorRate: 36.4,
                        femaleDirectorRate: 18.2,
                        ethicsTrainingRate: 95,
                        corruptionIncidents: 0
                    }
                },
                targets: {
                    netZeroYear: 2050,
                    re100Committed: false, // 尚未承諾
                    sbti: false
                },
                highlights: [
                    '全球最大電子製造服務商',
                    '啟動電動車事業布局',
                    '推動MIH電動車聯盟',
                    '建立循環經濟商業模式'
                ],
                totalPages: 245,
                hasEnglishVersion: true
            }
        ]
    },

    // ... Other 27 companies can be expanded

    // === 4. Freetimegears (Vege Creek) ===
    {
        companyId: 'VEGECREEK_TW',
        companyName: 'Freetimegears Co., Ltd.',
        companyNameEn: 'Vege Creek Co., Ltd.',
        stockCode: 'N/A', // Unlisted
        industry: 'Sustainable Dining & Lifestyle',
        sector: 'Service Industry',
        marketCap: 0, // Unlisted
        employees: 85,

        ratings: {
            // SME, not yet participated in international ratings
        },

        awards: [
            {
                year: 2023,
                awardName: 'B型企業認證',
                organizer: 'B Lab',
                category: '永續消費',
                ranking: '取得認證'
            },
            {
                year: 2022,
                awardName: '台灣循環經濟獎',
                organizer: '循環台灣基金會',
                category: '餐飲業',
                ranking: '優選'
            }
        ],

        reports: [
            {
                year: 2023,
                publishDate: new Date('2024-06-30'),
                frameworks: {
                    gri: false, // 中小企業簡化版
                    sasb: false,
                    tcfd: false,
                    sdgs: true, // 重點對接SDG 2, 12, 13
                    ungc: false,
                    iso26000: true
                },
                assurance: {
                    hasAssurance: false, // 中小企業暫無第三方確信
                    provider: undefined,
                    standard: undefined,
                    level: undefined
                },
                kpis: {
                    environment: {
                        scope1Emissions: 12, // tCO2e（餐飲業規模小）
                        scope2Emissions: 35,
                        scope3Emissions: 850, // 主要來自食材供應鏈
                        totalEmissions: 897,
                        emissionsReduction: 18.5, // vs 2020基準年
                        renewableEnergyPercentage: 45.0, // 採購綠電
                        waterWithdrawal: 8500, // 公噸/年
                        waterRecyclingRate: 28.0,
                        totalWaste: 45, // 公噸/年
                        wasteRecyclingRate: 92.0, // 廚餘堆肥+回收
                        environmentalInvestment: 2.5 // 百萬元
                    },
                    social: {
                        totalEmployees: 85,
                        femaleEmployeeRate: 62.0, // 餐飲業女性員工較多
                        femaleManagerRate: 55.0,
                        employeeTurnoverRate: 18.5,
                        trainingHoursPerEmployee: 32.0,
                        trainingInvestment: 1.2,
                        ltifr: 0.85, // 餐飲業廚房安全
                        zeroFatalities: true,
                        avgSalary: 550, // 千元（餐飲業薪資水準）
                        avgSalaryGrowth: 4.2,
                        supplierESGAudits: 25, // 在地小農稽核
                        socialInvestment: 0.8,
                        volunteerHours: 850
                    },
                    governance: {
                        boardSize: 5,
                        independentDirectors: 0, // 未上市公司
                        independentDirectorRate: 0,
                        femaleDirectors: 2,
                        femaleDirectorRate: 40.0,
                        boardMeetings: 12,
                        boardAttendanceRate: 100,
                        ethicsTrainingRate: 100,
                        corruptionIncidents: 0,
                        cyberSecurityInvestment: 0.5,
                        dataBreaches: 0
                    }
                },
                targets: {
                    netZeroYear: 2030, // 積極目標
                    re100Committed: false,
                    re100TargetYear: undefined,
                    sbti: false,
                    sbtiApproved: false,
                    othertargets: ['100%在地食材', '零廢棄餐廳']
                },
                highlights: [
                    'B型企業認證（台灣第一批餐飲業）',
                    '92%廚餘堆肥與回收率',
                    '100%使用在地小農食材',
                    '循環餐盒租賃系統',
                    '員工55%女性主管比例',
                    '每年850小時社區志工服務'
                ],
                totalPages: 48, // 中小企業精簡報告
                hasEnglishVersion: false,
                innovativeElements: ['循環餐盒系統', '廚餘堆肥追蹤', '食材碳足跡標示']
            }
        ]
    },

    // === 5. 山衛科技 ShunWei Technology ===
    {
        companyId: 'SHUNWEI_TW',
        companyName: '山衛科技股份有限公司',
        companyNameEn: 'ShunWei Technology Co., Ltd.',
        stockCode: 'N/A', // 未上市
        industry: '環境監測科技',
        sector: '科技服務',
        marketCap: 0,
        employees: 152,

        ratings: {
            // 新創企業，尚未參與國際評級
        },

        awards: [
            {
                year: 2023,
                awardName: '台灣創新技術博覽會金牌',
                organizer: '經濟部',
                category: '環境科技',
                ranking: '金牌'
            },
            {
                year: 2023,
                awardName: 'Talent, in Taiwan',
                organizer: '經濟部中小企業處',
                category: '永續新創',
                ranking: '100家'
            }
        ],

        reports: [
            {
                year: 2023,
                publishDate: new Date('2024-05-15'),
                frameworks: {
                    gri: false,
                    sasb: true, // 採用SASB軟體業準則
                    tcfd: false,
                    sdgs: true, // SDG 6, 9, 13, 14, 15
                    ungc: false,
                    iso26000: false
                },
                assurance: {
                    hasAssurance: false
                },
                kpis: {
                    environment: {
                        scope1Emissions: 8,
                        scope2Emissions: 125,
                        scope3Emissions: 450,
                        totalEmissions: 583,
                        emissionsReduction: 12.0,
                        renewableEnergyPercentage: 35.0,
                        waterWithdrawal: 1200,
                        waterRecyclingRate: 18.0,
                        totalWaste: 12,
                        wasteRecyclingRate: 85.0,
                        environmentalInvestment: 8.5
                    },
                    social: {
                        totalEmployees: 152,
                        femaleEmployeeRate: 38.0,
                        femaleManagerRate: 42.0, // 科技業女性主管比例高
                        employeeTurnoverRate: 8.5, // 新創留才佳
                        trainingHoursPerEmployee: 65.0, // 重視技能培養
                        trainingInvestment: 3.8,
                        ltifr: 0.0, // 辦公室環境安全
                        zeroFatalities: true,
                        avgSalary: 1250, // 千元（科技業薪資）
                        avgSalaryGrowth: 8.5,
                        supplierESGAudits: 15,
                        socialInvestment: 1.2,
                        volunteerHours: 1200
                    },
                    governance: {
                        boardSize: 7,
                        independentDirectors: 2, // 引進外部董事
                        independentDirectorRate: 28.6,
                        femaleDirectors: 3,
                        femaleDirectorRate: 42.9,
                        boardMeetings: 12,
                        boardAttendanceRate: 98.5,
                        ethicsTrainingRate: 100,
                        corruptionIncidents: 0,
                        cyberSecurityInvestment: 4.5,
                        dataBreaches: 0
                    }
                },
                targets: {
                    netZeroYear: 2035,
                    re100Committed: false,
                    sbti: false,
                    othertargets: [
                        '2025年50%再生能源',
                        'AI驅動環境監測普及化',
                        '協助100家企業達成ESG目標'
                    ]
                },
                highlights: [
                    'AI智能環境監測系統（專利技術）',
                    '協助50+企業完成碳盤查',
                    '水質即時監測IoT平台',
                    '女性主管比例42%（科技業標竿）',
                    '員工訓練65小時/人（高於產業平均）',
                    '低離職率8.5%（新創罕見）'
                ],
                totalPages: 68,
                hasEnglishVersion: true,
                innovativeElements: [
                    'AI環境監測儀表板',
                    'IoT感測器網路',
                    '碳盤查SaaS平台',
                    '區塊鏈數據驗證'
                ]
            }
        ]
    }
];

/**
 * 分析維度定義
 */
export interface AnalysisDimension {
    id: string;
    category: 'framework' | 'kpi' | 'target' | 'certification' | 'quality';
    name: string;
    description: string;
    extractFunction: (report: AnnualESGReport) => any;
    benchmarkValue?: any; // 業界標竿值
}

export const ANALYSIS_DIMENSIONS: AnalysisDimension[] = [
    {
        id: 'gri_adoption',
        category: 'framework',
        name: 'GRI準則採用',
        description: '是否採用GRI準則及版本',
        extractFunction: (report) => ({
            adopted: report.frameworks.gri,
            version: report.frameworks.griVersion,
            level: report.frameworks.griLevel
        })
    },
    {
        id: 'renewable_energy',
        category: 'kpi',
        name: '再生能源使用率',
        description: '再生能源占總能源消耗比例',
        extractFunction: (report) => report.kpis.environment.renewableEnergyPercentage,
        benchmarkValue: 50 // 2030年建議目標
    },
    {
        id: 'net_zero_commitment',
        category: 'target',
        name: '淨零承諾年度',
        description: '企業承諾達成淨零排放的目標年度',
        extractFunction: (report) => report.targets.netZeroYear,
        benchmarkValue: 2050 // 巴黎協定目標
    },
    {
        id: 'sbti_approval',
        category: 'certification',
        name: 'SBTi認證狀態',
        description: '是否通過SBTi科學基礎減碳目標認證',
        extractFunction: (report) => report.targets.sbtiApproved
    },
    {
        id: 'assurance_level',
        category: 'quality',
        name: '確信等級',
        description: '第三方確信的保證等級',
        extractFunction: (report) => report.assurance.level
    }
];

/**
 * 生成趨勢分析
 */
export function generateTrendAnalysis(
    company: CompanyESGProfile,
    metric: keyof ESGKeyMetrics['environment'] | keyof ESGKeyMetrics['social'] | keyof ESGKeyMetrics['governance']
): {
    years: number[];
    values: number[];
    trend: 'improving' | 'declining' | 'stable';
    cagr?: number; // Compound Annual Growth Rate
} {
    const reports = company.reports.sort((a, b) => a.year - b.year);
    const years: number[] = [];
    const values: number[] = [];

    reports.forEach(report => {
        const value = extractMetricValue(report.kpis, metric);
        if (value !== undefined && value !== null) {
            years.push(report.year);
            values.push(value);
        }
    });

    // 計算趨勢
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (values.length >= 2) {
        const firstValue = values[0] ?? 0;
        const lastValue = values[values.length - 1] ?? 0;
        const changeRate = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

        // 根據指標特性判斷改善方向
        const improvingMetrics = ['renewableEnergyPercentage', 'waterRecyclingRate', 'wasteRecyclingRate',
            'femaleManagerRate', 'trainingHoursPerEmployee', 'avgSalaryGrowth'];
        const decliningMetrics = ['emissionsIntensity', 'employeeTurnoverRate', 'ltifr'];

        if (improvingMetrics.some(m => metric.includes(m))) {
            trend = changeRate > 5 ? 'improving' : changeRate < -5 ? 'declining' : 'stable';
        } else if (decliningMetrics.some(m => metric.includes(m))) {
            trend = changeRate < -5 ? 'improving' : changeRate > 5 ? 'declining' : 'stable';
        }
    }

    // 計算CAGR（如適用）
    let cagr: number | undefined;
    if (values.length >= 2 && values[0] && values[0] !== 0) {
        const n = years.length - 1;
        cagr = (Math.pow(values[values.length - 1]! / values[0]!, 1 / n) - 1) * 100;
    }

    return { years, values, trend, cagr };
}

function extractMetricValue(kpis: ESGKeyMetrics, metric: string): number | undefined {
    // 簡化的提取邏輯
    if (metric in kpis.environment) return kpis.environment[metric as keyof typeof kpis.environment] as number;
    if (metric in kpis.social) return kpis.social[metric as keyof typeof kpis.social] as number;
    if (metric in kpis.governance) return kpis.governance[metric as keyof typeof kpis.governance] as number;
    return undefined;
}
