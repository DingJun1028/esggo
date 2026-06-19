/**
 * ESG 報告書填寫標準與評分準則
 * =================================
 * 定義各框架的填寫標準與質量評分系統
 */

export interface ReportingStandard {
  framework: string;
  version: string;
  standards: StandardSection[];
  scoringCriteria: ScoringCriteria;
}

export interface StandardSection {
  section: string;
  requirements: Requirement[];
  weight: number; // 權重百分比
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  verificationMethod: 'document' | 'data' | 'narrative' | 'calculation';
  exampleGoodPractice: string;
  commonMistakes: string[];
}

export interface ScoringCriteria {
  categories: ScoreCategory[];
  overallWeights: {
    completeness: number;
    accuracy: number;
    transparency: number;
    materiality: number;
    comparability: number;
  };
  gradingScale: GradingLevel[];
}

export interface ScoreCategory {
  name: string;
  criteria: ScoreCriterion[];
  weight: number;
}

export interface ScoreCriterion {
  aspect: string;
  description: string;
  scoring: {
    excellent: string; // 90-100分
    good: string; // 70-89分
    fair: string; // 50-69分
    poor: string; // <50分
  };
}

export interface GradingLevel {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  scoreRange: [number, number];
  description: string;
  label: string;
}

/**
 * GRI 填寫標準
 */
export const GRI_STANDARDS: ReportingStandard = {
  framework: 'GRI',
  version: 'GRI Standards 2021',
  standards: [
    {
      section: '基礎揭露',
      weight: 30,
      requirements: [
        {
          id: 'GRI_2-1',
          title: '組織詳細資訊',
          description: '揭露組織名稱、所有權性質、總部位置、營運據點',
          mandatory: true,
          verificationMethod: 'document',
          exampleGoodPractice: '提供完整的公司背景、組織架構圖、全球營運據點地圖',
          commonMistakes: ['資訊不完整', '未更新最新資料', '缺少營運範圍說明'],
        },
        {
          id: 'GRI_2-9',
          title: '治理結構與組成',
          description: '揭露最高治理單位的結構、組成、獨立性、任期',
          mandatory: true,
          verificationMethod: 'document',
          exampleGoodPractice: '詳列董事會成員背景、專業領域、多元性指標、ESG監督機制',
          commonMistakes: ['未揭露獨立性', '缺少多元性數據', '未說明ESG職責'],
        },
        {
          id: 'GRI_2-29',
          title: '利害關係人議合方式',
          description: '說明如何識別並與利害關係人溝通',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '完整的利害關係人地圖、溝通頻率表、議合成果與回應',
          commonMistakes: ['僅列舉類別未說明方法', '缺少溝通頻率', '未回應重要議題'],
        },
      ],
    },
    {
      section: '重大性評估',
      weight: 20,
      requirements: [
        {
          id: 'GRI_3-1',
          title: '決定重大主題的流程',
          description: '說明如何識別與評估重大主題',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '詳細的重大性分析流程圖、評估矩陣、利害關係人調查數據',
          commonMistakes: ['流程說明過於簡略', '缺少量化數據', '未展示評估結果'],
        },
        {
          id: 'GRI_3-2',
          title: '重大主題列表',
          description: '列出所有重大主題及其邊界',
          mandatory: true,
          verificationMethod: 'data',
          exampleGoodPractice: '完整的重大議題清單、影響邊界說明、對應的GRI主題',
          commonMistakes: ['未說明邊界', '缺少影響評估', '未對應GRI主題'],
        },
      ],
    },
    {
      section: '主題揭露',
      weight: 50,
      requirements: [
        {
          id: 'GRI_301-1',
          title: '所用物料的重量或體積',
          description: '報告製程所用物料的總重量或體積',
          mandatory: false,
          verificationMethod: 'data',
          exampleGoodPractice: '按物料類型分類、提供趨勢分析、說明減量措施',
          commonMistakes: ['數據不完整', '缺少分類', '未提供歷史比較'],
        },
        {
          id: 'GRI_305-1',
          title: '直接(範疇一)溫室氣體排放',
          description: '報告Scope 1排放總量',
          mandatory: true,
          verificationMethod: 'calculation',
          exampleGoodPractice: '完整盤查數據、排放源分析、計算方法說明、第三方查證',
          commonMistakes: ['缺少計算依據', '未涵蓋所有排放源', '缺少查證聲明'],
        },
        {
          id: 'GRI_401-1',
          title: '新進員工和離職員工',
          description: '按年齡、性別、地區報告新進與離職人數',
          mandatory: true,
          verificationMethod: 'data',
          exampleGoodPractice: '完整的人力結構分析、流動率趨勢、留任策略說明',
          commonMistakes: ['分類不夠細緻', '缺少流動率計算', '未分析原因'],
        },
      ],
    },
  ],
  scoringCriteria: {
    categories: [
      {
        name: '完整性',
        weight: 30,
        criteria: [
          {
            aspect: '基礎揭露覆蓋率',
            description: 'GRI 2 通用準則揭露的完整程度',
            scoring: {
              excellent: '100%揭露所有必要項目，並提供額外背景資訊',
              good: '90%以上揭露，少數非關鍵項目缺失',
              fair: '70-90%揭露，部分重要項目不完整',
              poor: '<70%揭露，缺少關鍵資訊',
            },
          },
          {
            aspect: '主題準則覆蓋率',
            description: '所選主題準則的完整揭露程度',
            scoring: {
              excellent: '所有重大主題完整揭露，並符合GRI要求',
              good: '主要主題完整，次要主題部分揭露',
              fair: '重大主題揭露不完整，缺少數據或說明',
              poor: '多數主題揭露嚴重不足',
            },
          },
        ],
      },
      {
        name: '準確性',
        weight: 25,
        criteria: [
          {
            aspect: '數據質量',
            description: '數據的準確性、一致性、可靠性',
            scoring: {
              excellent: '所有數據經第三方查證，有完整計算依據',
              good: '關鍵數據經查證，計算方法清楚',
              fair: '部分數據缺少驗證或計算依據',
              poor: '數據可靠性存疑，缺少驗證',
            },
          },
          {
            aspect: '邊界一致性',
            description: '報告邊界的清晰定義與一致性',
            scoring: {
              excellent: '邊界清晰定義，各指標一致，有說明差異',
              good: '邊界明確，少數指標有差異但已說明',
              fair: '邊界定義模糊，部分指標不一致',
              poor: '邊界不清，指標混亂',
            },
          },
        ],
      },
      {
        name: '透明度',
        weight: 20,
        criteria: [
          {
            aspect: '方法論說明',
            description: '計算方法、數據來源、假設的透明度',
            scoring: {
              excellent: '所有方法、來源、假設完整說明',
              good: '主要方法清楚，少數細節未說明',
              fair: '部分方法說明不足',
              poor: '缺少方法論說明',
            },
          },
          {
            aspect: '負面資訊揭露',
            description: '對挑戰、失敗、負面事件的坦誠度',
            scoring: {
              excellent: '坦誠揭露挑戰與失敗，說明改善計畫',
              good: '揭露主要挑戰，有改善說明',
              fair: '僅輕描淡寫提及負面資訊',
              poor: '迴避或隱藏負面資訊',
            },
          },
        ],
      },
      {
        name: '重大性',
        weight: 15,
        criteria: [
          {
            aspect: '重大性評估流程',
            description: '重大性分析的嚴謹性與透明度',
            scoring: {
              excellent: '完整的重大性分析流程，有利害關係人參與',
              good: '基本流程完整，有利害關係人輸入',
              fair: '流程簡化，利害關係人參與有限',
              poor: '缺少正式的重大性評估',
            },
          },
        ],
      },
      {
        name: '可比性',
        weight: 10,
        criteria: [
          {
            aspect: '歷史數據比較',
            description: '提供多年度數據比較與趨勢分析',
            scoring: {
              excellent: '3年以上數據，完整趨勢分析與目標比較',
              good: '2-3年數據，基本趨勢說明',
              fair: '僅有當年數據，少量歷史比較',
              poor: '缺少歷史比較',
            },
          },
        ],
      },
    ],
    overallWeights: {
      completeness: 0.3,
      accuracy: 0.25,
      transparency: 0.2,
      materiality: 0.15,
      comparability: 0.1,
    },
    gradingScale: [
      {
        grade: 'A+',
        scoreRange: [95, 100],
        description: '卓越級',
        label: '報告達到國際最佳實踐水平',
      },
      {
        grade: 'A',
        scoreRange: [90, 94],
        description: '優秀級',
        label: '報告質量優秀，符合所有關鍵標準',
      },
      {
        grade: 'B+',
        scoreRange: [85, 89],
        description: '良好+級',
        label: '報告質量良好，少數地方可改進',
      },
      {
        grade: 'B',
        scoreRange: [80, 84],
        description: '良好級',
        label: '報告質量尚可，部分地方需加強',
      },
      {
        grade: 'C',
        scoreRange: [70, 79],
        description: '及格級',
        label: '報告基本符合要求，有明顯改進空間',
      },
      {
        grade: 'D',
        scoreRange: [60, 69],
        description: '不及格+級',
        label: '報告質量不足，需大幅改進',
      },
      { grade: 'F', scoreRange: [0, 59], description: '不及格級', label: '報告嚴重不符合標準' },
    ],
  },
};

/**
 * TCFD 填寫標準
 */
export const TCFD_STANDARDS: ReportingStandard = {
  framework: 'TCFD',
  version: 'TCFD Recommendations 2023',
  standards: [
    {
      section: '治理 (Governance)',
      weight: 20,
      requirements: [
        {
          id: 'TCFD_GOV_A',
          title: '董事會對氣候相關風險與機會的監督',
          description: '說明董事會如何監督氣候相關風險與機會',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '明確說明董事會職責、審議頻率、決策案例、ESG委員會功能',
          commonMistakes: ['僅描述架構未說明實際運作', '缺少具體案例', '未說明監督頻率'],
        },
        {
          id: 'TCFD_GOV_B',
          title: '管理階層在氣候風險管理的角色',
          description: '說明管理階層如何評估與管理氣候相關風險',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '說明管理階層架構、責任分配、報告機制、整合進入決策',
          commonMistakes: ['缺少明確責任劃分', '未說明如何整合進營運', '缺少實際案例'],
        },
      ],
    },
    {
      section: '策略 (Strategy)',
      weight: 30,
      requirements: [
        {
          id: 'TCFD_STR_A',
          title: '短中長期氣候風險與機會',
          description: '識別組織在不同時間範圍內的氣候風險與機會',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '完整的風險與機會清單、時間框架定義、影響評估、應對策略',
          commonMistakes: ['未定義時間範圍', '風險識別不全面', '缺少量化影響評估'],
        },
        {
          id: 'TCFD_STR_B',
          title: '氣候對營運、策略、財務的影響',
          description: '說明氣候風險如何影響業務、策略與財務規劃',
          mandatory: true,
          verificationMethod: 'calculation',
          exampleGoodPractice: '量化財務影響、情境分析、策略調整說明、資本配置考量',
          commonMistakes: ['僅定性描述缺少量化', '未連結財務影響', '缺少策略調整'],
        },
        {
          id: 'TCFD_STR_C',
          title: '氣候情境分析',
          description: '使用情境分析評估組織韌性',
          mandatory: true,
          verificationMethod: 'calculation',
          exampleGoodPractice: '2°C/1.5°C情境分析、關鍵假設說明、韌性評估、因應措施',
          commonMistakes: ['未使用標準情境', '假設不清', '缺少韌性評估', '未說明因應'],
        },
      ],
    },
    {
      section: '風險管理 (Risk Management)',
      weight: 25,
      requirements: [
        {
          id: 'TCFD_RM_A',
          title: '氣候風險識別與評估流程',
          description: '說明組織如何識別與評估氣候相關風險',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '完整流程圖、評估工具、優先順序方法、更新頻率',
          commonMistakes: ['流程說明過於簡化', '缺少評估工具說明', '未說明更新機制'],
        },
        {
          id: 'TCFD_RM_B',
          title: '氣候風險管理流程',
          description: '說明如何管理氣候相關風險',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '風險緩解措施、監控機制、責任歸屬、成效評估',
          commonMistakes: ['僅列舉措施未說明成效', '缺少監控機制', '責任不明確'],
        },
        {
          id: 'TCFD_RM_C',
          title: '整合進入整體風險管理',
          description: '說明氣候風險如何整合進組織的整體風險管理',
          mandatory: true,
          verificationMethod: 'narrative',
          exampleGoodPractice: '說明整合架構、與其他風險的關聯、報告流程',
          commonMistakes: ['未說明整合方式', '缺少與其他風險的關聯性'],
        },
      ],
    },
    {
      section: '指標與目標 (Metrics and Targets)',
      weight: 25,
      requirements: [
        {
          id: 'TCFD_MT_A',
          title: '氣候相關指標',
          description: '揭露評估氣候風險與機會的指標',
          mandatory: true,
          verificationMethod: 'data',
          exampleGoodPractice: 'Scope 1/2/3排放、能源強度、水風險、再生能源%等關鍵指標',
          commonMistakes: ['指標不完整', '缺少強度指標', '未提供歷史數據'],
        },
        {
          id: 'TCFD_MT_B',
          title: 'Scope 1, 2, 3 排放',
          description: '揭露溫室氣體排放並說明相關風險',
          mandatory: true,
          verificationMethod: 'calculation',
          exampleGoodPractice: '完整盤查數據、第三方查證、排放源分析、減量計畫',
          commonMistakes: ['Scope 3 不完整', '缺少查證', '未說明計算方法'],
        },
        {
          id: 'TCFD_MT_C',
          title: '氣候相關目標與績效',
          description: '揭露氣候目標及達成進度',
          mandatory: true,
          verificationMethod: 'data',
          exampleGoodPractice: '明確目標（SBTi認證）、基準年、減量路徑、年度進度',
          commonMistakes: ['目標不明確', '缺少基準年', '未追蹤進度', '未說明如何達成'],
        },
      ],
    },
  ],
  scoringCriteria: {
    categories: [
      {
        name: '四大支柱完整性',
        weight: 40,
        criteria: [
          {
            aspect: '治理揭露',
            description: '董事會與管理階層的氣候監督與管理',
            scoring: {
              excellent: '完整說明董事會與管理階層角色、有具體案例與成效',
              good: '角色說明清楚，有部分案例',
              fair: '基本架構說明，缺少運作細節',
              poor: '僅簡略描述，缺少實質內容',
            },
          },
          {
            aspect: '策略揭露',
            description: '氣候風險對業務、策略、財務的影響',
            scoring: {
              excellent: '完整風險分析、情境分析、量化財務影響、策略回應',
              good: '風險分析完整，有基本情境分析',
              fair: '風險識別但分析不足，缺少財務量化',
              poor: '風險識別不全，缺少影響評估',
            },
          },
          {
            aspect: '風險管理揭露',
            description: '氣候風險識別、評估、管理流程',
            scoring: {
              excellent: '完整流程說明、整合進ERM、有監控與成效評估',
              good: '流程清楚，有整合說明',
              fair: '流程簡化，整合說明不足',
              poor: '缺少正式流程',
            },
          },
          {
            aspect: '指標與目標揭露',
            description: '關鍵指標與氣候目標設定',
            scoring: {
              excellent: 'Scope 1/2/3完整、SBTi認證目標、完整進度追蹤',
              good: 'Scope 1/2完整、有明確目標、追蹤進度',
              fair: '部分指標、目標不夠明確',
              poor: '指標不完整、缺少目標',
            },
          },
        ],
      },
      {
        name: '情境分析質量',
        weight: 30,
        criteria: [
          {
            aspect: '情境設定',
            description: '情境選擇的適切性與嚴謹度',
            scoring: {
              excellent: '使用IEA/IPCC標準情境，包含2°C/1.5°C，假設清楚',
              good: '使用標準情境，假設基本清楚',
              fair: '情境選擇簡化，假設不夠清楚',
              poor: '未使用標準情境或缺少情境分析',
            },
          },
          {
            aspect: '影響評估',
            description: '對業務與財務影響的評估深度',
            scoring: {
              excellent: '量化財務影響、評估多個業務面向、有韌性評估',
              good: '有財務影響評估、涵蓋主要業務',
              fair: '定性評估為主，量化不足',
              poor: '缺少影響評估',
            },
          },
        ],
      },
      {
        name: '數據質量',
        weight: 20,
        criteria: [
          {
            aspect: 'Scope 3 完整性',
            description: 'Scope 3排放的涵蓋範圍與質量',
            scoring: {
              excellent: '涵蓋所有15類，有第三方查證，數據可靠',
              good: '涵蓋主要類別（>80%），數據可靠',
              fair: '僅涵蓋部分類別，質量一般',
              poor: '缺少Scope 3或質量不佳',
            },
          },
        ],
      },
      {
        name: '策略整合',
        weight: 10,
        criteria: [
          {
            aspect: '與企業策略整合',
            description: '氣候考量整合進企業策略的程度',
            scoring: {
              excellent: '深度整合、影響資本配置與業務決策',
              good: '有整合、影響部分決策',
              fair: '初步整合、影響有限',
              poor: '未整合或僅表面整合',
            },
          },
        ],
      },
    ],
    overallWeights: {
      completeness: 0.4,
      accuracy: 0.3,
      transparency: 0.15,
      materiality: 0.1,
      comparability: 0.05,
    },
    gradingScale: [
      {
        grade: 'A+',
        scoreRange: [95, 100],
        description: '卓越級',
        label: 'TCFD完整揭露，達國際最佳實踐',
      },
      { grade: 'A', scoreRange: [90, 94], description: '優秀級', label: 'TCFD 11項建議全部符合' },
      {
        grade: 'B+',
        scoreRange: [85, 89],
        description: '良好+級',
        label: '四大支柱完整，部分細節可加強',
      },
      { grade: 'B', scoreRange: [80, 84], description: '良好級', label: '四大支柱基本完整' },
      { grade: 'C', scoreRange: [70, 79], description: '及格級', label: '部分支柱不完整，需改進' },
      { grade: 'D', scoreRange: [60, 69], description: '不及格+級', label: '多數支柱不足' },
      { grade: 'F', scoreRange: [0, 59], description: '不及格級', label: '嚴重不符合TCFD建議' },
    ],
  },
};

/**
 * 整合評分系統
 */
export interface ReportScore {
  framework: string;
  overallScore: number;
  grade: string;
  categoryScores: {
    [category: string]: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  comparisonToBenchmark: {
    percentile: number;
    industryAverage: number;
  };
}

/**
 * 計算報告分數
 */
export function calculateReportScore(
  framework: string,
  responses: any,
  documents: any
): ReportScore {
  // 簡化實作 - 實際應用需要更複雜的評分邏輯
  const standard = framework === 'GRI' ? GRI_STANDARDS : TCFD_STANDARDS;

  // 計算各類別分數
  const categoryScores: { [key: string]: number } = {};
  standard.scoringCriteria.categories.forEach(cat => {
    // 這裡應該根據實際回答與文件進行評分
    categoryScores[cat.name] = 85; // 示範值
  });

  // 計算總分
  const overallScore = Object.entries(categoryScores).reduce((sum, [name, score]) => {
    const category = standard.scoringCriteria.categories.find(c => c.name === name);
    return sum + (score * (category?.weight || 0)) / 100;
  }, 0);

  // 決定等級
  const grade =
    standard.scoringCriteria.gradingScale.find(
      g => overallScore >= g.scoreRange[0] && overallScore <= g.scoreRange[1]
    )?.grade || 'F';

  return {
    framework,
    overallScore,
    grade,
    categoryScores,
    strengths: ['完整性達標', '數據質量良好'],
    weaknesses: ['Scope 3 涵蓋率可提升', '歷史數據比較不足'],
    recommendations: ['建議完善Scope 3 盤查', '提供3年以上歷史數據', '加強情境分析深度'],
    comparisonToBenchmark: {
      percentile: 75,
      industryAverage: 78,
    },
  };
}

/**
 * 導出所有框架標準
 */
export const ALL_STANDARDS = {
  GRI: GRI_STANDARDS,
  TCFD: TCFD_STANDARDS,
  // 其他框架可以按需添加
};
