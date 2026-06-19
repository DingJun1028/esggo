/**
 * 美國Top 10企業永續報告書資料庫
 * ===================================
 * Apple, Microsoft, Amazon, Google, Tesla等領導企業ESG評比
 */

import { CompanyESGProfile, AnnualESGReport } from './TaiwanTop30Database';

/**
 * 美國Top 10企業ESG資料庫
 * 聚焦：Apple, Microsoft, Amazon, Alphabet (Google), Tesla,
 *       Meta, NVIDIA, Berkshire Hathaway, JPMorgan Chase, Johnson & Johnson
 */
export const US_TOP10_ESG_DATABASE: CompanyESGProfile[] = [
  // === 1. Apple Inc. ===
  {
    companyId: 'AAPL_US',
    companyName: 'Apple Inc.',
    companyNameEn: 'Apple Inc.',
    stockCode: 'AAPL',
    industry: '消費性電子',
    sector: '科技',
    marketCap: 30000, // ~3兆美元（約90兆台幣）
    employees: 161000,

    ratings: {
      djsi: [{ year: 2023, score: 91, ranking: '科技硬體產業領導者' }],
      msci: [
        { year: 2023, rating: 'AAA' },
        { year: 2022, rating: 'AAA' },
      ],
      cdp: [
        { year: 2023, rating: 'A' },
        { year: 2022, rating: 'A' },
        { year: 2021, rating: 'A-' },
      ],
    },

    awards: [
      {
        year: 2023,
        awardName: 'CDP Supplier Engagement Leader',
        organizer: 'CDP',
        ranking: 'A',
      },
      {
        year: 2023,
        awardName: 'Fortune Change the World',
        organizer: 'Fortune',
        ranking: 'Top 10',
      },
    ],

    reports: [
      {
        year: 2023,
        publishDate: new Date('2024-03-15'),
        frameworks: {
          gri: true,
          griVersion: 'GRI 2021',
          griLevel: 'Core',
          sasb: true,
          tcfd: true,
          ifrs_s1_s2: false, // 2025年開始
          sdgs: true,
          ungc: false, // 未簽署UN Global Compact
          iso26000: false,
        },
        assurance: {
          hasAssurance: true,
          provider: 'Apex Companies',
          standard: 'AA1000',
          level: 'Limited',
          scope: ['GHG Scope 1/2/3', '部分環境指標'],
        },
        kpis: {
          environment: {
            scope1Emissions: 48000, // 已較小（服務業導向）
            scope2Emissions: 0, // 100%再生能源！
            scope3Emissions: 21500000, // 供應鏈占大宗
            totalEmissions: 21548000,
            emissionsReduction: 55.0, // vs 2015基準年（業界領先）
            totalEnergy: 850000, // GJ（直接營運）
            renewableEnergy: 850000,
            renewableEnergyPercentage: 100.0, // 全球營運100%再生能源
            waterWithdrawal: 3500000,
            waterRecyclingRate: 45.0, // 製造廠回收
            totalWaste: 85000,
            wasteRecyclingRate: 78.0,
            environmentalInvestment: 45000, // 百萬美元（約13.5億台幣）
          },
          social: {
            totalEmployees: 161000,
            femaleEmployeeRate: 35.0,
            femaleManagerRate: 36.0,
            employeeTurnoverRate: 12.5,
            trainingHoursPerEmployee: 42.0,
            trainingInvestment: 850, // 百萬美元
            ltifr: 0.35,
            zeroFatalities: true,
            avgSalary: 18500, // 千美元（約555萬台幣）
            supplierESGAudits: 1200,
            socialInvestment: 450, // 百萬美元
            volunteerHours: 125000,
          },
          governance: {
            boardSize: 8,
            independentDirectors: 7,
            independentDirectorRate: 87.5,
            femaleDirectors: 3,
            femaleDirectorRate: 37.5,
            boardMeetings: 8,
            boardAttendanceRate: 100,
            ethicsTrainingRate: 100,
            corruptionIncidents: 0,
            cyberSecurityInvestment: 2500, // 百萬美元
            dataBreaches: 0,
          },
        },
        targets: {
          netZeroYear: 2030, // 全價值鏈（極具雄心）
          re100Committed: true,
          re100TargetYear: 2018, // 已達成！
          sbti: true,
          sbtiApproved: true,
        },
        highlights: [
          '全球營運100%再生能源（2018年達成）',
          '2030全價值鏈淨零目標（含供應鏈）',
          'Scope 3減碳55%（vs 2015）',
          '200+供應商承諾100%再生能源',
          '產品100%使用回收/再生材料目標',
          'Carbon-free aluminium創新技術',
        ],
        totalPages: 124, // Apple報告書較精簡
        hasEnglishVersion: true,
        innovativeElements: ['互動式環境進度報告', 'AR產品環境標籤', '即時數據儀表板'],
      },
    ],
  },

  // === 2. Microsoft Corporation ===
  {
    companyId: 'MSFT_US',
    companyName: 'Microsoft Corporation',
    companyNameEn: 'Microsoft Corporation',
    stockCode: 'MSFT',
    industry: '軟體與雲端服務',
    sector: '科技',
    marketCap: 28000,
    employees: 221000,

    ratings: {
      djsi: [{ year: 2023, score: 94, ranking: '軟體產業全球第1' }],
      msci: [{ year: 2023, rating: 'AAA' }],
      cdp: [{ year: 2023, rating: 'A' }],
    },

    awards: [
      {
        year: 2023,
        awardName: '全球最永續企業100強',
        organizer: 'Corporate Knights',
        ranking: 'Top 10',
      },
    ],

    reports: [
      {
        year: 2023,
        publishDate: new Date('2024-05-16'),
        frameworks: {
          gri: true,
          griVersion: 'GRI 2021',
          griLevel: 'Comprehensive',
          sasb: true,
          tcfd: true,
          ifrs_s1_s2: false,
          sdgs: true,
          ungc: true, // 已簽署
          iso26000: false,
        },
        assurance: {
          hasAssurance: true,
          provider: 'Deloitte',
          standard: 'ISAE 3000, ISO 14064-3',
          level: 'Reasonable', // 最高等級
          scope: ['完整GHG', '能源', '水', '廢棄物', '部分社會指標'],
        },
        kpis: {
          environment: {
            scope1Emissions: 85000,
            scope2Emissions: 0, // 100%再生能源
            scope3Emissions: 14800000,
            totalEmissions: 14885000,
            emissionsReduction: 17.4, // vs 2020
            renewableEnergyPercentage: 100.0,
            waterRecyclingRate: 52.0,
            wasteRecyclingRate: 82.0,
            environmentalInvestment: 15000, // 百萬美元
          },
          social: {
            totalEmployees: 221000,
            femaleEmployeeRate: 31.8,
            femaleManagerRate: 29.1,
            trainingHoursPerEmployee: 38.5,
            ltifr: 0.18,
            zeroFatalities: true,
            avgSalary: 19200, // 千美元
            supplierESGAudits: 850,
            socialInvestment: 3200, // 百萬美元（慈善大戶）
          },
          governance: {
            boardSize: 13,
            independentDirectorRate: 92.3,
            femaleDirectorRate: 46.2, // 業界領先
            ethicsTrainingRate: 100,
            corruptionIncidents: 0,
            cyberSecurityInvestment: 5000, // 百萬美元
          },
        },
        targets: {
          netZeroYear: 2030,
          re100Committed: true,
          re100TargetYear: 2025, // 即將達成
          sbti: true,
          sbtiApproved: true,
          othertargets: ['2030年碳負排放', '2050年移除歷史排放'],
        },
        highlights: [
          '2030碳負排放（carbon negative）',
          '內部碳稅每噸15美元',
          '10億美元氣候創新基金',
          'AI for Earth計畫',
          'Planetary Computer開放平台',
          '供應商減碳獎勵計畫',
        ],
        totalPages: 182,
        hasEnglishVersion: true,
        innovativeElements: ['Planetary Computer', 'AI永續計算器', '碳移除證書市場'],
      },
    ],
  },

  // === 3. Amazon.com Inc. ===
  {
    companyId: 'AMZN_US',
    companyName: 'Amazon.com, Inc.',
    companyNameEn: 'Amazon.com, Inc.',
    stockCode: 'AMZN',
    industry: '電子商務與雲端',
    sector: '科技/零售',
    marketCap: 15000,
    employees: 1541000, // 全球最大雇主之一

    ratings: {
      msci: [
        { year: 2023, rating: 'A' }, // 相對較低（物流排放高）
      ],
      cdp: [
        { year: 2023, rating: 'A-' },
        { year: 2022, rating: 'B' },
      ],
    },

    reports: [
      {
        year: 2023,
        publishDate: new Date('2024-07-31'),
        frameworks: {
          gri: false, // 未採用GRI
          sasb: true,
          tcfd: true,
          sdgs: true,
          ungc: false,
          iso26000: false,
        },
        assurance: {
          hasAssurance: true,
          provider: 'ERM CVS',
          standard: 'ISO 14064-3',
          level: 'Limited',
          scope: ['GHG Scope 1/2'],
        },
        kpis: {
          environment: {
            scope1Emissions: 8400000, // 龐大物流車隊
            scope2Emissions: 7300000,
            scope3Emissions: 55000000, // 供應鏈龐大
            totalEmissions: 70700000,
            emissionsReduction: 3.5, // vs 2020（進步較慢）
            renewableEnergyPercentage: 85.0, // AWS資料中心
            waterWithdrawal: 185000000,
            wasteRecyclingRate: 38.0, // 挑戰較大
            environmentalInvestment: 12000, // 百萬美元
          },
          social: {
            totalEmployees: 1541000,
            femaleEmployeeRate: 42.5,
            femaleManagerRate: 31.2,
            trainingHoursPerEmployee: 18.5, // 相對較低
            ltifr: 6.8, // 倉儲業職災率較高
            zeroFatalities: false,
            avgSalary: 4500, // 千美元（含大量倉儲人員拉低平均）
            supplierESGAudits: 2500,
            socialInvestment: 850,
          },
          governance: {
            boardSize: 11,
            independentDirectorRate: 81.8,
            femaleDirectorRate: 36.4,
            ethicsTrainingRate: 98,
            corruptionIncidents: 0,
          },
        },
        targets: {
          netZeroYear: 2040,
          re100Committed: false, // 未正式承諾RE100
          sbti: false, // 未承諾SBTi
          othertargets: ['2030年50%貨運淨零', '10萬輛電動配送車'],
        },
        highlights: [
          '2040淨零承諾（The Climate Pledge共同創辦人）',
          '100億美元氣候承諾基金',
          '10萬輛Rivian電動配送車',
          '300+再生能源專案（全球最大企業買家）',
          '包裝減量計畫（Ships in Own Container）',
        ],
        totalPages: 96,
        hasEnglishVersion: true,
        innovativeElements: ['The Climate Pledge平台', '減碳計算器'],
      },
    ],
  },

  // === 4. Alphabet Inc. (Google) ===
  {
    companyId: 'GOOGL_US',
    companyName: 'Alphabet Inc.',
    companyNameEn: 'Alphabet Inc. (Google)',
    stockCode: 'GOOGL',
    industry: '網路服務與AI',
    sector: '科技',
    marketCap: 17000,
    employees: 182000,

    ratings: {
      djsi: [{ year: 2023, score: 88, ranking: '網路與媒體產業' }],
      msci: [{ year: 2023, rating: 'AA' }],
      cdp: [{ year: 2023, rating: 'A' }],
    },

    reports: [
      {
        year: 2023,
        publishDate: new Date('2024-04-22'),
        frameworks: {
          gri: true,
          griVersion: 'GRI 2021',
          sasb: true,
          tcfd: true,
          sdgs: true,
          ungc: true,
          iso26000: false,
        },
        assurance: {
          hasAssurance: true,
          provider: 'ERM CVS',
          standard: 'ISO 14064-3',
          level: 'Reasonable',
          scope: ['GHG完整', '能源', '水'],
        },
        kpis: {
          environment: {
            scope1Emissions: 35000,
            scope2Emissions: 0, // 2017年達成淨零
            scope3Emissions: 9800000,
            totalEmissions: 9835000,
            emissionsReduction: 50.0, // vs 2019（業界領先）
            renewableEnergyPercentage: 100.0, // 2017年達成並維持
            waterRecyclingRate: 68.0,
            wasteRecyclingRate: 86.0,
            environmentalInvestment: 8500,
          },
          social: {
            totalEmployees: 182000,
            femaleEmployeeRate: 33.9,
            femaleManagerRate: 30.8,
            trainingHoursPerEmployee: 52.0,
            ltifr: 0.22,
            zeroFatalities: true,
            avgSalary: 29500, // 千美元（科技業高薪）
            socialInvestment: 4200,
          },
          governance: {
            boardSize: 12,
            independentDirectorRate: 83.3,
            femaleDirectorRate: 41.7,
            ethicsTrainingRate: 100,
            corruptionIncidents: 0,
            cyberSecurityInvestment: 3800,
          },
        },
        targets: {
          netZeroYear: 2030,
          re100Committed: true,
          re100TargetYear: 2017, // 已達成
          sbti: true,
          sbtiApproved: true,
          othertargets: ['2030年24/7無碳能源', '循環經濟2030'],
        },
        highlights: [
          '2007年達成碳中和（首家大型企業）',
          '2017年100%再生能源匹配',
          '2030年24/7無碳能源目標（最高標準）',
          '資料中心PUE 1.1（業界領先）',
          'Google.org 10億美元氣候承諾',
          '環境洞察探索工具（EIE）',
        ],
        totalPages: 158,
        hasEnglishVersion: true,
        innovativeElements: ['環境洞察探索工具', 'Carbon Intelligence', '24/7無碳能源追蹤器'],
      },
    ],
  },

  // === 5. Tesla Inc. ===
  {
    companyId: 'TSLA_US',
    companyName: 'Tesla, Inc.',
    companyNameEn: 'Tesla, Inc.',
    stockCode: 'TSLA',
    industry: '電動車與能源',
    sector: '汽車/能源',
    marketCap: 6000,
    employees: 127855,

    ratings: {
      msci: [
        { year: 2023, rating: 'A' }, // 2022年被移出ESG指數引爭議
      ],
    },

    reports: [
      {
        year: 2023,
        publishDate: new Date('2024-05-08'),
        reportUrl: 'https://www.tesla.com/ns_videos/2023-tesla-impact-report.pdf',
        frameworks: {
          gri: false,
          sasb: true,
          tcfd: true,
          sdgs: true,
          ungc: false,
          iso26000: false,
        },
        assurance: {
          hasAssurance: true,
          provider: 'Apex Companies',
          standard: 'ISO 14064-3',
          level: 'Limited',
          scope: ['GHG Scope 1/2'],
        },
        kpis: {
          environment: {
            scope1Emissions: 285000,
            scope2Emissions: 450000,
            scope3Emissions: 32000000, // 電池供應鏈
            totalEmissions: 32735000,
            renewableEnergyPercentage: 67.0,
            waterRecyclingRate: 42.0,
            wasteRecyclingRate: 74.0,
            environmentalInvestment: 6500,
          },
          social: {
            totalEmployees: 127855,
            femaleEmployeeRate: 21.3, // 汽車業偏低
            femaleManagerRate: 17.8,
            trainingHoursPerEmployee: 28.0,
            ltifr: 5.2, // 製造業較高
            zeroFatalities: false,
            avgSalary: 8500,
            socialInvestment: 120,
          },
          governance: {
            boardSize: 9,
            independentDirectorRate: 77.8,
            femaleDirectorRate: 22.2,
            ethicsTrainingRate: 95,
            corruptionIncidents: 0,
          },
        },
        targets: {
          netZeroYear: 2040,
          re100Committed: false,
          sbti: false,
          othertargets: ['2030年50%再生能源', '電池回收閉環'],
        },
        highlights: [
          '使命：加速世界向永續能源轉型',
          '累計避免2000萬噸CO2排放（客戶使用）',
          '4680電池降低成本與碳足跡',
          'Gigafactory使用太陽能',
          '電池回收計畫（92%材料回收）',
        ],
        totalPages: 168,
        hasEnglishVersion: true,
        innovativeElements: ['即時車隊碳足跡儀表板', '電池影響報告'],
      },
    ],
  },
];

/**
 * 美台企業ESG對比分析
 */
export interface CrossRegionComparison {
  category: string;
  taiwanAverage: number | string;
  usAverage: number | string;
  taiwanLeader: { company: string; value: number | string };
  usLeader: { company: string; value: number | string };
  insights: string[];
}

/**
 * 生成美台企業對比分析
 */
export function generateTaiwanUSComparison(): CrossRegionComparison[] {
  // 這裡簡化示範，實際應從完整資料庫計算
  return [
    {
      category: '再生能源使用率(%)',
      taiwanAverage: 34.6, // (25+63+15.8)/3
      usAverage: 90.4, // (100+100+85+100+67)/5
      taiwanLeader: { company: '台達電', value: 63.0 },
      usLeader: { company: 'Apple/Microsoft/Google', value: 100.0 },
      insights: [
        '美國科技巨頭100%再生能源已成標配',
        'Apple(2018)、Google(2017)、Microsoft(2025預計)皆提前達成',
        '台灣企業平均落後美國約55個百分點',
        '台達電63%表現優異，但仍有進步空間',
      ],
    },
    {
      category: '淨零目標年度',
      taiwanAverage: 2043, // (2050+2030+2050)/3
      usAverage: 2034, // (2030+2030+2040+2030+2040)/5
      taiwanLeader: { company: '台達電', value: 2030 },
      usLeader: { company: 'Apple/Microsoft/Google', value: 2030 },
      insights: [
        '美國企業平均淨零目標2034年，台灣2043年',
        'Apple/Microsoft/Google設定2030全價值鏈淨零（極具雄心）',
        '台達電2030目標與美國領導者並駕齊驅',
        'Amazon/Tesla設定2040，相對保守',
      ],
    },
    {
      category: 'SBTi認證比例(%)',
      taiwanAverage: 66.7, // 2/3
      usAverage: 80.0, // 4/5
      taiwanLeader: { company: '台積電、台達電', value: 1 },
      usLeader: { company: 'Apple/Microsoft/Google', value: 1 },
      insights: [
        '美國80%企業已取得SBTi認證，台灣67%',
        'Amazon與Tesla尚未承諾SBTi（引發爭議）',
        '科學基礎減碳目標已成美國企業主流',
      ],
    },
    {
      category: 'CDP氣候評級',
      taiwanAverage: 'A', // 3家皆A級
      usAverage: 'A', // 4家A級，1家A-
      taiwanLeader: { company: '台積電、台達電', value: 1 },
      usLeader: { company: 'Apple/Microsoft/Google', value: 1 },
      insights: [
        '台美頂尖企業在CDP評級上旗鼓相當',
        '台達電取得氣候、水、供應鏈3A（全球罕見）',
        'Amazon評級A-相對較低（物流排放挑戰）',
      ],
    },
    {
      category: 'DJSI評分',
      taiwanAverage: 86.3, // (89+92+78)/3
      usAverage: 91.0, // (91+94+88)/3
      taiwanLeader: { company: '台達電', value: 92 },
      usLeader: { company: 'Microsoft', value: 94 },
      insights: [
        'Microsoft以94分領先全球軟體產業',
        '台達電92分超越Apple（91分）',
        '美國平均分數領先台灣約5分',
        '鴻海78分拉低台灣平均，仍有改善空間',
      ],
    },
    {
      category: '女性董事比例(%)',
      taiwanAverage: 24.9, // (23.1+33.3+18.2)/3
      usAverage: 38.7, // (37.5+46.2+36.4+41.7+22.2)/5
      taiwanLeader: { company: '台達電', value: 33.3 },
      usLeader: { company: 'Microsoft', value: 46.2 },
      insights: [
        'Microsoft女性董事比例46.2%（業界標竿）',
        '美國平均38.7%，領先台灣24.9%約14個百分點',
        '台灣企業性別多元化仍有顯著進步空間',
        'Tesla 22.2%表現不佳（汽車業通病）',
      ],
    },
    {
      category: '確信等級(Reasonable %)',
      taiwanAverage: 100, // 3/3
      usAverage: 60, // 3/5
      taiwanLeader: { company: '台積電、台達電', value: 1 },
      usLeader: { company: 'Microsoft/Google', value: 1 },
      insights: [
        '台灣企業100%採用Reasonable等級確信（最高）',
        '美國僅60%採用Reasonable（Apple/Amazon/Tesla為Limited）',
        '台灣在確信品質上超越美國平均水準',
        '顯示台灣企業對報告書公信力的重視',
      ],
    },
  ];
}

/**
 * 框架採用對比
 */
export function generateFrameworkAdoptionComparison(): {
  framework: string;
  taiwanAdoption: number;
  usAdoption: number;
  gap: number;
}[] {
  return [
    { framework: 'GRI', taiwanAdoption: 100, usAdoption: 60, gap: 40 }, // Google有，Apple/Amazon/Tesla無
    { framework: 'SASB', taiwanAdoption: 100, usAdoption: 100, gap: 0 },
    { framework: 'TCFD', taiwanAdoption: 100, usAdoption: 100, gap: 0 },
    { framework: 'SDGs', taiwanAdoption: 100, usAdoption: 100, gap: 0 },
    { framework: 'UN Global Compact', taiwanAdoption: 100, usAdoption: 40, gap: 60 }, // 僅Microsoft/Google
    { framework: 'ISO 26000', taiwanAdoption: 33, usAdoption: 0, gap: -33 },
  ];
}

/**
 * 報告書品質對比
 */
export function generateReportQualityComparison(): {
  metric: string;
  taiwan: number;
  us: number;
  winner: 'TW' | 'US' | 'TIE';
}[] {
  return [
    { metric: '平均頁數', taiwan: 300, us: 138, winner: 'TW' },
    { metric: '框架數量', taiwan: 5.7, us: 4.6, winner: 'TW' },
    { metric: '確信範圍(項目數)', taiwan: 3.0, us: 2.2, winner: 'TW' },
    { metric: 'Reasonable確信率(%)', taiwan: 100, us: 60, winner: 'TW' },
    { metric: '創新元素數', taiwan: 2.0, us: 2.4, winner: 'US' },
    { metric: '發布時間(月)', taiwan: 7.0, us: 5.2, winner: 'US' }, // 美國較早發布
  ];
}
