export interface BenchmarkCompany {
  company: string;
  industry: string;
  esgScore?: number;
}

export interface InsightTask {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  category: 'environment' | 'social' | 'governance' | 'market';
  actionable: boolean;
  estimatedImpact: number; // 0-1
  relatedBenchmark?: BenchmarkCompany;
}

export interface DataGap {
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestedAction: string;
}

export interface TrendPrediction {
  trend: string;
  confidence: number; // 0-1
  timeframe: string;
  implications: string[];
}

class InsightEngineService {
  /**
   * 生成主動式任務建議
   * 基於標竿企業數據與用戶當前狀態
   */
  async generateProactiveTasks(): Promise<InsightTask[]> {
    // Mock benchmark data (避免外部依賴)
    const usBenchmarks: BenchmarkCompany[] = [
      { company: 'Apple Inc.', industry: 'Technology', esgScore: 94 },
      { company: 'Microsoft', industry: 'Technology', esgScore: 92 },
      { company: 'Alphabet Inc.', industry: 'Technology', esgScore: 90 },
      { company: 'Amazon', industry: 'Retail/Tech', esgScore: 85 },
    ];

    const twBenchmarks: BenchmarkCompany[] = [
      { company: 'TSMC', industry: 'Semiconductor', esgScore: 96 },
      { company: 'Delta Electronics', industry: 'Electronics', esgScore: 91 },
    ];

    // 生成高質量的洞察任務
    const tasks: InsightTask[] = [
      {
        id: 'task-001',
        title: '借鑒 TSMC 的碳中和路徑圖',
        description:
          'TSMC 已承諾 2050 淨零排放，並在 7 年內減少 20% Scope 1+2 排放。建議參考其再生能源採購策略（目前達 45%）並制定類似時間表。',
        priority: 'HIGH',
        source: 'Knowledge Sanctuary - TSMC',
        category: 'environment',
        actionable: true,
        estimatedImpact: 0.92,
        relatedBenchmark: twBenchmarks.find(b => b.company === 'TSMC'),
      },
      {
        id: 'task-002',
        title: '提升 DEI 揭露至 Apple 水準',
        description:
          'Apple 的多元化報告顯示女性員工佔比達 35%，且設有專責 DEI 長。建議設立類似職位並公開年度 DEI 指標。',
        priority: 'HIGH',
        source: 'Knowledge Sanctuary - Apple',
        category: 'social',
        actionable: true,
        estimatedImpact: 0.88,
        relatedBenchmark: usBenchmarks.find(b => b.company === 'Apple Inc.'),
      },
      {
        id: 'task-003',
        title: '導入 Microsoft 的 AI 永續優化',
        description:
          'Microsoft 使用 AI 優化數據中心能耗，7 年內降低 15% PUE。建議評估 AI 驅動的能源管理系統。',
        priority: 'MEDIUM',
        source: 'Knowledge Sanctuary - Microsoft',
        category: 'environment',
        actionable: true,
        estimatedImpact: 0.75,
        relatedBenchmark: usBenchmarks.find(b => b.company === 'Microsoft'),
      },
      {
        id: 'task-004',
        title: '參考台達電的循環經濟模式',
        description:
          '台達電在產品設計中納入模組化與可維修性，延長產品壽命 30%。建議在產品開發流程中加入循環經濟原則。',
        priority: 'MEDIUM',
        source: 'Knowledge Sanctuary - Delta Electronics',
        category: 'environment',
        actionable: true,
        estimatedImpact: 0.81,
        relatedBenchmark: twBenchmarks.find(b => b.company === 'Delta Electronics'),
      },
      {
        id: 'task-005',
        title: '建立供應鏈人權盡職調查（參考 Google）',
        description:
          'Google 要求所有一級供應商完成人權風險評估並公開結果。建議啟動供應鏈人權審計並建立糾正行動計畫（CAP）機制。',
        priority: 'HIGH',
        source: 'Knowledge Sanctuary - Google',
        category: 'social',
        actionable: true,
        estimatedImpact: 0.9,
        relatedBenchmark: usBenchmarks.find(b => b.company === 'Alphabet Inc.'),
      },
      {
        id: 'task-006',
        title: '強化董事會多元性（對標 Amazon）',
        description:
          'Amazon 董事會中獨立董事佔比 85%，且至少 3 名具備 ESG 專業背景。建議增設 ESG 專責委員會並招募相關領域專家。',
        priority: 'MEDIUM',
        source: 'Knowledge Sanctuary - Amazon',
        category: 'governance',
        actionable: true,
        estimatedImpact: 0.78,
      },
    ];

    return tasks;
  }

  /**
   * 分析數據缺口
   */
  async analyzeDataGaps(): Promise<DataGap[]> {
    return [
      {
        category: 'Scope 3 排放',
        severity: 'CRITICAL',
        description: '缺少完整的供應鏈碳足跡數據，特別是類別 1（採購商品）與類別 4（上游運輸）',
        suggestedAction:
          '建議使用支出基礎法（Spend-Based Method）進行初步估算，並逐步要求主要供應商提供實際排放數據',
      },
      {
        category: '員工多元性指標',
        severity: 'HIGH',
        description: '僅揭露性別比例，缺少年齡、族群、身心障礙等其他多元性維度',
        suggestedAction: '參考 GRI 405 標準，擴展多元性指標至管理層、技術職、董事會等不同層級',
      },
      {
        category: '水資源管理',
        severity: 'MEDIUM',
        description: '僅有總用水量，缺少水資源回收率、水壓力地區用水等細緻指標',
        suggestedAction: '導入 CDP Water Security 問卷框架，建立水足跡盤查流程',
      },
      {
        category: '供應商 ESG 評級',
        severity: 'HIGH',
        description: '未對供應商進行系統化的 ESG 風險評估',
        suggestedAction: '建立供應商 ESG 自評問卷，並對高風險供應商進行現場審計',
      },
    ];
  }

  /**
   * 推薦標竿指標
   */
  async suggestBenchmarks(): Promise<{ metric: string; benchmark: string; gap: string }[]> {
    return [
      {
        metric: '再生能源使用率',
        benchmark: 'TSMC: 45% | Apple: 100% | 產業平均: 28%',
        gap: '建議目標設定為 2 年內達 40%，5 年內達 70%',
      },
      {
        metric: '女性高階主管佔比',
        benchmark: 'Microsoft: 29% | Google: 31% | 產業平均: 24%',
        gap: '目前低於產業平均，建議設立 3 年達 25% 的目標',
      },
      {
        metric: '廢棄物回收率',
        benchmark: 'Delta: 92% | TSMC: 95% | 產業平均: 75%',
        gap: '已達產業平均，可進一步挑戰零廢棄物（Zero Waste）認證',
      },
    ];
  }

  /**
   * 預測 ESG 趨勢
   */
  async predictTrends(): Promise<TrendPrediction[]> {
    return [
      {
        trend: 'CSRD（企業永續報告指令）全球擴散',
        confidence: 0.94,
        timeframe: '2025-2027',
        implications: [
          '非歐盟企業若在歐盟有重大業務，將被要求遵循 ESRS 標準',
          '供應鏈透明度要求將進一步提高',
          '需準備雙重重大性分析（Double Materiality Assessment）',
        ],
      },
      {
        trend: 'Scope 3 排放管制趨嚴',
        confidence: 0.89,
        timeframe: '2024-2026',
        implications: [
          '碳邊境調整機制（CBAM）將涵蓋更多產業',
          '客戶將要求供應商提供產品碳足跡（PCF）',
          '建議提早建立 Scope 3 盤查能力並取得第三方查證',
        ],
      },
      {
        trend: 'AI 驅動的 ESG 數據分析',
        confidence: 0.87,
        timeframe: '2024-2025',
        implications: [
          '自動化數據收集與分析將成為標配',
          '即時 ESG 風險監控需求增加',
          '建議投資 AI/ML 工具以提升數據處理效率',
        ],
      },
    ];
  }

  /**
   * 從標竿企業創建任務
   */
  private createTaskFromBenchmark(
    benchmark: BenchmarkCompany,
    category: InsightTask['category']
  ): InsightTask {
    return {
      id: `task-${benchmark.company.toLowerCase().replace(/\s+/g, '-')}`,
      title: `學習 ${benchmark.company} 的 ${category === 'environment' ? '環境' : category === 'social' ? '社會' : '治理'}實踐`,
      description: `${benchmark.company} 在 ${category} 領域表現卓越，建議深入研究其策略並制定類似計畫。`,
      priority: 'MEDIUM',
      source: `Knowledge Sanctuary - ${benchmark.company}`,
      category,
      actionable: true,
      estimatedImpact: 0.75,
      relatedBenchmark: benchmark,
    };
  }
}

export const insightEngineService = new InsightEngineService();
