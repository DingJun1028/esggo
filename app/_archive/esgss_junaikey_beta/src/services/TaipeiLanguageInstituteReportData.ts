/**
 * 台北語文學院 (Taipei Language Institute) 永續發展報告書完整數據
 * 2024 年度報告書 - 500+ 頁面完整版
 */

import type { ComprehensiveReportData } from './Comprehensive500PagePDFGeneratorService';

// ============ 台北語文學院 2024 永續報告書完整數據 ============
export const taipeiLanguageInstituteReportData: ComprehensiveReportData = {
  organizationName: '台北語文學院',
  industry: '教育服務業',
  employeeCount: 450,
  reportingPeriod: { start: '2024-01-01', end: '2024-12-31' },
  reportType: 'esg',

  // ============ 環境數據 ============
  environment: {
    emissions: {
      scope1: {
        total: 2850,
        unit: 'kg CO2e',
        fixed: 2100,  // 天然氣鍋爐
        mobile: 550,   // 公務車
        fugitive: 200, // 冷媒逸散
        bySource: [
          { source: '天然氣消耗', value: 2100 },
          { source: '汽油消耗', value: 380 },
          { source: '柴油消耗', value: 170 },
          { source: '冷媒逸散', value: 200 },
        ],
      },
      scope2: {
        total: 42500,
        unit: 'kg CO2e',
        electricity: 40000,
        heat: 2500,
        locationBased: 42500,
        marketBased: 38000,
      },
      scope3: [
        {
          category: '類別1：購買商品與服務',
          value: 8500,
          subcategories: [
            { name: '教學用品', value: 3200 },
            { name: '圖書教材', value: 1800 },
            { name: '辦公用品', value: 2100 },
            { name: '資訊設備', value: 1400 },
          ],
        },
        {
          category: '類別2：資本財',
          value: 4200,
          subcategories: [
            { name: '建築物改善', value: 2800 },
            { name: '教學設備', value: 1400 },
          ],
        },
        {
          category: '類別3：燃料與能源相關活動',
          value: 3800,
          subcategories: [
            { name: '電力輸配電損失', value: 2800 },
            { name: '天然氣生產與配送', value: 1000 },
          ],
        },
        {
          category: '類別4：上游運輸與配送',
          value: 2100,
          subcategories: [
            { name: '供應商送貨', value: 1500 },
            { name: '郵寄服務', value: 600 },
          ],
        },
        {
          category: '類別5：營運產生的廢棄物',
          value: 1800,
          subcategories: [
            { name: '一般廢棄物', value: 1200 },
            { name: '資源回收', value: 400 },
            { name: '電子廢棄物', value: 200 },
          ],
        },
        {
          category: '類別6：商務差旅',
          value: 6500,
          subcategories: [
            { name: '國內差旅', value: 2500 },
            { name: '國外差旅', value: 4000 },
          ],
        },
        {
          category: '類別7：員工通勤',
          value: 12000,
          subcategories: [
            { name: '汽機車通勤', value: 8500 },
            { name: '大眾運輸', value: 3500 },
          ],
        },
        {
          category: '類別8：上游租賃資產',
          value: 2800,
          subcategories: [
            { name: '分校租金', value: 2800 },
          ],
        },
        {
          category: '類別9：下游運輸與配送',
          value: 1200,
          subcategories: [
            { name: '學生接送', value: 1200 },
          ],
        },
        {
          category: '類別10：加工售出的產品',
          value: 0,
          subcategories: [],
        },
        {
          category: '類別11：售出產品的使用',
          value: 1500,
          subcategories: [
            { name: '數位教材使用', value: 1500 },
          ],
        },
        {
          category: '類別12：售出產品的生命週期末端處理',
          value: 800,
          subcategories: [
            { name: '教材回收處理', value: 800 },
          ],
        },
        {
          category: '類別13：下游租賃資產',
          value: 0,
          subcategories: [],
        },
        {
          category: '類別14：特許權',
          value: 0,
          subcategories: [],
        },
        {
          category: '類別15：投資',
          value: 1200,
          subcategories: [
            { name: '基金投資', value: 1200 },
          ],
        },
      ],
      intensity: {
        value: 0.142,
        unit: 'kg CO2e',
        denominator: '每位學生每學期',
      },
      reduction: {
        target: 25,
        actual: 18,
        progress: 72,
      },
    },
    energy: {
      consumption: {
        total: 520000,
        unit: 'kWh',
        byType: [
          { type: '電力', value: 480000, unit: 'kWh' },
          { type: '天然氣', value: 28000, unit: 'm³' },
          { type: '柴油', value: 5000, unit: 'L' },
        ],
      },
      intensity: {
        value: 1155,
        unit: 'kWh/m²',
      },
      renewable: {
        installed: 50000,
        purchased: 30000,
        renewablePercent: 15.4,
        target: 30,
      },
      efficiency: {
        investments: 2500000,
        savings: 850000,
        projects: [
          { name: 'LED 照明更新', saving: 120000, status: '已完成' },
          { name: '空調系統升級', saving: 280000, status: '已完成' },
          { name: '智慧節能系統', saving: 180000, status: '進行中' },
          { name: '太陽能板安裝', saving: 270000, status: '規劃中' },
        ],
      },
    },
    water: {
      intake: {
        total: 15000,
        unit: 'm³',
        bySource: [
          { source: '自來水', value: 14500 },
          { source: '地下水', value: 500 },
        ],
      },
      discharge: {
        total: 12000,
        unit: 'm³',
        byTreatment: [
          { type: '化糞池處理', value: 8000 },
          { type: '一般污水', value: 4000 },
        ],
      },
      consumption: {
        total: 3000,
        unit: 'm³',
        intensity: 2.5,
      },
      recycling: {
        rate: 25,
        volume: 750,
      },
    },
    waste: {
      total: {
        hazardous: 50,
        nonHazardous: 28000,
        total: 28050,
        unit: 'kg',
      },
      byDisposal: [
        { method: '資源回收', value: 11200, percent: 40 },
        { method: '一般垃圾', value: 8400, percent: 30 },
        { method: '廚餘回收', value: 5600, percent: 20 },
        { method: '特殊廢棄物', value: 1400, percent: 5 },
        { method: '電子廢棄物', value: 1400, percent: 5 },
      ],
      recycling: {
        rate: 45,
        volume: 12600,
      },
      reduction: {
        target: 30,
        actual: 22,
      },
    },
    biodiversity: {
      protectedAreas: {
        area: 500,
        percent: '15%',
      },
      habitats: [
        { name: '生態步道', area: '300 m²', protection: '校內保護' },
        { name: '雨水花園', area: '150 m²', protection: '自然教育' },
        { name: '屋頂菜園', area: '50 m²', protection: '教學用途' },
      ],
      impacts: [
        { type: '土地利用變更', assessment: '無重大影響', mitigation: '維持既有綠地' },
        { type: '生態廊道', assessment: '正向影響', mitigation: '持續擴大綠覆率' },
      ],
    },
  },

  // ============ 社會數據 ============
  social: {

    employment: {
      total: 450,
      byContract: [
        { type: '正職', count: 380, percent: 84.4 },
        { type: '兼職', count: 50, percent: 11.1 },
        { type: '約聘', count: 20, percent: 4.5 },
      ],
      byRegion: [
        { region: '台北總校', count: 280, percent: 62.2 },
        { region: '台中分校', count: 80, percent: 17.8 },
        { region: '高雄分校', count: 70, percent: 15.6 },
        { region: '海外辦事處', count: 20, percent: 4.4 },
      ],
      turnover: {
        voluntary: 35,
        involuntary: 8,
        rate: 9.6,
        reasons: [
          { reason: '個人生涯規劃', percent: 45 },
          { reason: '家庭因素', percent: 25 },
          { reason: '轉換跑道', percent: 18 },
          { reason: '退休', percent: 8 },
          { reason: '其他', percent: 4 },
        ],
      },
      newHires: {
        total: 65,
        rate: 14.4,
        byAge: [
          { range: '25 歲以下', percent: 35 },
          { range: '25-35 歲', percent: 42 },
          { range: '35-45 歲', percent: 18 },
          { range: '45 歲以上', percent: 5 },
        ],
        byGender: [
          { gender: '女性', percent: 58 },
          { gender: '男性', percent: 42 },
        ],
      },
    },
    benefits: {
      pension: { coverage: 100, details: '勞工退休金條例' },
      healthcare: { coverage: 100, details: '全民健康保險' },
      parental: { covered: 45, taken: 38, returnRate: 94 },
    },
    training: {
      averageHours: 42,
      totalHours: 18900,
      byLevel: [
        { level: '高階主管', hours: 56 },
        { level: '中階主管', hours: 48 },
        { level: '一般員工', hours: 38 },
        { level: '兼任教師', hours: 24 },
      ],
      investment: 3200000,
      satisfaction: 4.3,
    },
    health: {
      injuryRate: 0.12,
      lostDayRate: 0.05,
      fatalities: 0,
      occupationalDiseases: 0,
      trainingHours: 2800,
      programs: [
        { name: '健康檢查', participation: 95, outcome: '全員完成' },
        { name: '心理諮商', participation: 12, outcome: '滿意度 4.5/5' },
        { name: '運動健身', participation: 35, outcome: '參與率提升 15%' },
      ],
    },
    diversity: {
      gender: {
        board: { female: 3, male: 6 },
        management: { female: 18, male: 22 },
        general: { female: 260, male: 190 },
      },
      age: [
        { range: '25 歲以下', percent: 18 },
        { range: '25-35 歲', percent: 35 },
        { range: '35-45 歲', percent: 28 },
        { range: '45-55 歲', percent: 14 },
        { range: '55 歲以上', percent: 5 },
      ],
      nationality: [
        { region: '本國', percent: 92 },
        { region: '外籍教師', percent: 8 },
      ],
      disability: { percent: 2.2, initiatives: '無障礙設施與職務再設計' },
      lgbtq: { policy: '多元性別友善職場政策', incidents: 0 },
    },
    community: {
      investment: 5800000,
      programs: [
        { name: '弱勢獎學金', beneficiaries: 120, description: '提供清寒學生獎學金' },
        { name: '社區語言課程', beneficiaries: 500, description: '免費社區語言課程' },
        { name: '偏鄉教育服務', beneficiaries: 300, description: '偏鄉遠距教學支援' },
        { name: '老年數位學習', beneficiaries: 200, description: '銀髮族數位培訓' },
      ],
      impacts: [
        { type: '教育平權', assessment: '正向', mitigation: '持續擴大服務範圍' },
        { type: '社區連結', assessment: '顯著', mitigation: '深化在地合作' },
      ],
    },
    supplier: {
      total: 180,
      assessed: 145,
      byRegion: [
        { region: '北部', percent: 65 },
        { region: '中部', percent: 22 },
        { region: '南部', percent: 13 },
      ],
      assessments: [
        { type: '環境評估', findings: '85% 符合標準' },
        { type: '社會評估', findings: '90% 符合標準' },
        { type: '永續發展', findings: '78% 符合標準' },
      ],
    },
  },

  // ============ 治理數據 ============
  governance: {
    structure: {
      boardSize: 9,
      committees: [
        { name: '審計委員會', members: 3, independence: 100, meetings: 12 },
        { name: '薪資報酬委員會', members: 3, independence: 100, meetings: 6 },
        { name: '永續發展委員會', members: 5, independence: 60, meetings: 4 },
        { name: '提名委員會', members: 3, independence: 100, meetings: 2 },
      ],
      diversity: {
        gender: { female: 3, male: 6 },
        nationality: [
          { region: '本國', percent: 78 },
          { region: '海外', percent: 22 },
        ],
      },
      evaluation: { process: '360 度評估', frequency: '每年', outcomes: '改善項目已納入年度計畫' },
    },
    ethics: {
      policies: [
        { name: '員工行為準則', coverage: 100 },
        { name: '利益衝突管理', coverage: 100 },
        { name: '舉報人保護', coverage: 100 },
        { name: '反歧視政策', coverage: 100 },
      ],
      training: { coverage: 100, hours: 8 },
      incidents: { corruption: 0, discrimination: 0, harassment: 0 },
      whistleblowing: { reports: 3, resolved: 100 },
    },
    risk: {
      management: { framework: 'COSO', coverage: '全面', frequency: '每季' },
      risks: [
        { category: '營運風險', level: '中', mitigation: '建立內部控制制度' },
        { category: '財務風險', level: '低', mitigation: '定期財務預測與監控' },
        { category: '資安風險', level: '高', mitigation: '資安管理系統認證' },
        { category: '法遵風險', level: '中', mitigation: '法規追蹤系統' },
        { category: '氣候風險', level: '中', mitigation: 'TCFD 揭露框架' },
      ],
      compliance: { audits: 4, findings: 5, resolved: 100 },
    },
    stakeholder: {
      identification: { process: '問卷調查與訪談', frequency: '每年' },
      engagement: {
        methods: [
          { type: '利害關係人座談會', frequency: '每季' },
          { type: '滿意度調查', frequency: '每學期' },
          { type: '申訴管道', frequency: '全年' },
          { type: '社群媒體', frequency: '每日' },
        ],
        topics: [
          { topic: '教學品質', importance: '高' },
          { topic: '學費合理性', importance: '高' },
          { topic: '校園環境', importance: '中' },
          { topic: '永續發展', importance: '中' },
        ],
      },
      rights: {
        mechanisms: [
          { type: '學生代表參與', coverage: '校務會議' },
          { type: '教職員工會', coverage: '100%' },
          { type: '家長委員會', coverage: '各分校' },
        ],
      },
    },
  },

  // ============ TCFD 揭露 ============
  tcfd: {
    governance: {
      oversight: '永續發展委員會每季向董事会報告氣候相關議題，董事会每半年進行重大氣候決策審議。',
      frequency: '每季',
      expertise: '委員會成員包含具備氣候變遷、環境管理背景之專業人士。',
    },
    management: {
      role: '由永續長統籌氣候相關風險與機會之識別、評估及管理，並定期向管理階層報告。',
      reporting: '月報提供給高階管理團隊，季報提供給永續發展委員會，年報提供給董事会。',
      expertise: '永續長及團隊成員均接受過 TCFD 及氣候相關財務揭露之專業訓練。',
    },
    strategy: {
      risks: [
        { type: '風險', category: '轉型風險-政策與法規', timeframe: '短期', impact: '中等', likelihood: '高' },
        { type: '風險', category: '轉型風險-技術', timeframe: '中期', impact: '高', likelihood: '中' },
        { type: '風險', category: '轉型風險-市場', timeframe: '中期', impact: '中等', likelihood: '中' },
        { type: '風險', category: '實體風險-急性', timeframe: '短期', impact: '中等', likelihood: '中' },
        { type: '風險', category: '實體風險-慢性', timeframe: '長期', impact: '低', likelihood: '低' },
        { type: '機會', category: '資源效率', timeframe: '短期', impact: '高', likelihood: '高' },
        { type: '機會', category: '低碳能源', timeframe: '中期', impact: '高', likelihood: '高' },
        { type: '機會', category: '綠色產品', timeframe: '中期', impact: '中等', likelihood: '中' },
        { type: '機會', category: '氣候教育', timeframe: '長期', impact: '高', likelihood: '高' },
      ],
      opportunities: [
        { type: '綠色校園', description: '建構低碳校園，提升品牌價值', timeframe: '短期', impact: '高' },
        { type: '氣候課程', description: '開發氣候變遷相關課程，滿足市場需求', timeframe: '中期', impact: '中等' },
        { type: '永續研究', description: '建立永續發展研究中心，取得研究經費', timeframe: '長期', impact: '高' },
      ],
      resilience: {
        scenarios: [
          { name: '1.5°C 情境', description: '積極減排情境', outcome: '提前達標淨零排放' },
          { name: '2°C 情境', description: '適度減排情境', outcome: '按計畫達成減排目標' },
          { name: '3°C 情境', description: '延遲行動情境', outcome: '需額外投資調適措施' },
        ],
        adaptations: '持續監控氣候政策走向，弹性調整減排路徑；建立氣候風險早期預警系統；強化校園基礎設施韌性。',
      },
    },
    riskManagement: {
      identification: '透過年度重大主題鑑別程序，整合外部趨勢分析與內部評估，識別氣候相關風險與機會。',
      frequency: '每年完整鑑別，每季更新監控。',
      assessment: '採用情境分析評估財務影響，依可能性與影響程度排序風險等級。',
      criteria: '結合 GRI 重大性評估與 TCFD 建議框架。',
      management: '依風險等級制定應對策略，並納入年度營運計畫執行。',
      integration: '氣候風險管理已整合至企業風險管理（ERM）框架。',
    },
    metrics: {
      emissions: [
        { scope: '範疇一', value: 2850, unit: 'kg CO2e' },
        { scope: '範疇二（地點基礎）', value: 42500, unit: 'kg CO2e' },
        { scope: '範疇二（市場基礎）', value: 38000, unit: 'kg CO2e' },
        { scope: '範疇三', value: 48400, unit: 'kg CO2e' },
        { scope: '碳密集度', value: 0.142, unit: 'kg CO2e/學生/學期' },
      ],
      risks: [
        { metric: '氣候風險鑑別數', value: '5 項風險、4 項機會' },
        { metric: '高風險項目', value: '資安風險、轉型風險-技術' },
        { metric: '韌性評估', value: '已完成 3 種情境分析' },
      ],
      targets: [
        { target: '2030 年範疇一、二減排 30%（基準年 2020）', baseline: '2020', progress: '68%' },
        { target: '2025 年範疇二減排 15%', baseline: '2020', progress: '82%' },
        { target: '2040 年 RE100', baseline: '2020', progress: '45%' },
        { target: '2050 年淨零排放', baseline: '2020', progress: '25%' },
      ],
    },
  },

  // ============ 4T 驗證 ============
  verification: {
    score: 94.5,
    badge: 'Platinum',
    truth: {
      score: 96,
      details: '所有數據均經過內部稽核與第三方驗證，數據來源可追溯至原始憑證。',
    },
    transparency: {
      score: 95,
      details: '依據 GRI 2021、TCFD、SASB 標準完整揭露，揭露項目涵蓋所有重大主題。',
    },
    traceability: {
      score: 93,
      details: '建立完整的數據版本控制與歷史紀錄，確保所有揭露數據可追溯至源頭。',
    },
    trust: {
      score: 94,
      details: '外部獨立機構進行有限確信，並取得國際認可之永續發展認證。',
    },
    hash: 'sha256-taipei-language-institute-2024-sample-hash',
    timestamp: new Date().toISOString(),
  },
};

// ============ 預設樣本數據 ============
export const sampleTaipeiLanguageInstituteData: ComprehensiveReportData = taipeiLanguageInstituteReportData;

// ============ 匯出便捷函數 ============
export function getTaipeiLanguageInstituteReport(): ComprehensiveReportData {
  return structuredClone(taipeiLanguageInstituteReportData);
}

export function createCustomReportData(orgName: string, industry: string): ComprehensiveReportData {
  const base = getTaipeiLanguageInstituteReport();
  base.organizationName = orgName;
  base.industry = industry;
  return base;
}
