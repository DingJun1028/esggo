/**
 * 善向技術 - LangGraph 工作流程實作範例
 * 基於 "LangGraph 簡介" 和 "LangGraph 中的 AI 代理" 課程
 *
 * 此範例展示如何使用 LangGraph 建立複雜的 ESG 分析工作流程
 */

// 模擬 LangGraph 的基本結構 (實際使用需要安裝 langgraph)
class LangGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.state = {};
  }

  addNode(name, nodeFunction) {
    this.nodes.set(name, nodeFunction);
    return this;
  }

  addEdge(fromNode, toNode, condition = null) {
    this.edges.push({ from: fromNode, to: toNode, condition });
    return this;
  }

  async execute(initialState = {}) {
    this.state = { ...initialState };
    let currentNode = 'start';

    console.log('🚀 啟動 LangGraph 工作流程...');

    while (currentNode && currentNode !== 'end') {
      const nodeFunction = this.nodes.get(currentNode);

      if (!nodeFunction) {
        throw new Error(`節點 ${currentNode} 不存在`);
      }

      console.log(`📍 執行節點: ${currentNode}`);
      const result = await nodeFunction(this.state);

      // 更新狀態
      this.state = { ...this.state, ...result };

      // 決定下一個節點
      currentNode = this.getNextNode(currentNode, result);
    }

    return this.state;
  }

  getNextNode(currentNode, result) {
    // 查找從當前節點出去的邊
    const possibleEdges = this.edges.filter(edge => edge.from === currentNode);

    for (const edge of possibleEdges) {
      if (!edge.condition || edge.condition(result)) {
        return edge.to;
      }
    }

    return 'end';
  }
}

// ESG 數據收集節點
function dataCollectionNode(state) {
  console.log('📊 收集 ESG 數據...');

  // 模擬數據收集
  return {
    esgData: {
      environmental: {
        emissions: 12500,
        energyUse: 87500,
        waterUse: 45200,
        waste: 1250
      },
      social: {
        employees: 300,
        femaleRatio: 0.42,
        trainingHours: 25600,
        communityInvestment: 125000
      },
      governance: {
        boardSize: 9,
        independentDirectors: 6,
        executivePay: 4500000,
        policiesCount: 12
      }
    },
    dataCollected: true,
    timestamp: new Date().toISOString()
  };
}

// ESG 數據驗證節點
function dataValidationNode(state) {
  console.log('✅ 驗證 ESG 數據完整性...');

  const { esgData } = state;
  const issues = [];

  // 檢查環境數據
  if (!esgData.environmental.emissions || esgData.environmental.emissions < 0) {
    issues.push('碳排放數據無效');
  }

  // 檢查社會數據
  if (!esgData.social.employees || esgData.social.employees <= 0) {
    issues.push('員工人數數據無效');
  }

  // 檢查治理數據
  if (!esgData.governance.boardSize || esgData.governance.boardSize < 3) {
    issues.push('董事會規模數據無效');
  }

  return {
    validationPassed: issues.length === 0,
    validationIssues: issues,
    dataValid: issues.length === 0
  };
}

// ESG 指標計算節點
function metricsCalculationNode(state) {
  console.log('📈 計算 ESG 指標...');

  if (!state.dataValid) {
    throw new Error('數據驗證失敗，無法計算指標');
  }

  const { esgData } = state;

  // 計算環境指標
  const envScore = calculateEnvironmentalScore(esgData.environmental);

  // 計算社會指標
  const socialScore = calculateSocialScore(esgData.social);

  // 計算治理指標
  const governanceScore = calculateGovernanceScore(esgData.governance);

  // 計算綜合評分
  const overallScore = (envScore + socialScore + governanceScore) / 3;

  return {
    metrics: {
      environmental: envScore,
      social: socialScore,
      governance: governanceScore,
      overall: overallScore
    },
    scoresCalculated: true
  };
}

// ESG 分析和洞察節點
function analysisInsightsNode(state) {
  console.log('🔍 生成 ESG 分析洞察...');

  const { metrics, esgData } = state;
  const insights = [];

  // 環境洞察
  if (metrics.environmental < 50) {
    insights.push({
      category: 'environmental',
      severity: 'high',
      message: '環境表現需要顯著改善，建議制定減碳計劃',
      recommendations: [
        '投資再生能源項目',
        '實施能源效率提升計劃',
        '建立碳排放追蹤系統'
      ]
    });
  }

  // 社會洞察
  if (metrics.social < 60) {
    insights.push({
      category: 'social',
      severity: 'medium',
      message: '社會責任表現有改善空間',
      recommendations: [
        '加強員工多元性計劃',
        '提升工作場所安全措施',
        '增加社區投資'
      ]
    });
  }

  // 治理洞察
  if (metrics.governance > 80) {
    insights.push({
      category: 'governance',
      severity: 'low',
      message: '治理結構表現優良',
      recommendations: [
        '繼續維持現有治理標準',
        '分享最佳實務經驗'
      ]
    });
  }

  return {
    insights: insights,
    analysisCompleted: true
  };
}

// ESG 報告生成節點
function reportGenerationNode(state) {
  console.log('📝 生成 ESG 報告...');

  const { esgData, metrics, insights } = state;

  const report = {
    companyInfo: {
      name: '示例公司',
      industry: '科技業',
      reportPeriod: '2024年度'
    },
    scores: metrics,
    detailedMetrics: esgData,
    keyInsights: insights,
    recommendations: insights.flatMap(insight => insight.recommendations),
    generatedAt: new Date().toISOString(),
    version: '1.0'
  };

  return {
    report: report,
    reportGenerated: true
  };
}

// ESG 結果存儲節點
function resultsStorageNode(state) {
  console.log('💾 儲存分析結果...');

  // 模擬數據存儲
  const storageId = `esg-analysis-${Date.now()}`;

  return {
    storageId: storageId,
    stored: true,
    storedAt: new Date().toISOString()
  };
}

// 輔助函數
function calculateEnvironmentalScore(environmental) {
  let score = 100;

  // 碳排放評分 (佔 40%)
  if (environmental.emissions > 20000) score -= 30;
  else if (environmental.emissions > 10000) score -= 15;

  // 能源使用評分 (佔 30%)
  if (environmental.energyUse > 100000) score -= 25;
  else if (environmental.energyUse > 50000) score -= 10;

  // 水資源評分 (佔 20%)
  if (environmental.waterUse > 50000) score -= 15;
  else if (environmental.waterUse > 30000) score -= 5;

  // 廢棄物評分 (佔 10%)
  if (environmental.waste > 2000) score -= 8;
  else if (environmental.waste > 1000) score -= 2;

  return Math.max(0, Math.min(100, score));
}

function calculateSocialScore(social) {
  let score = 100;

  // 員工多元性評分 (佔 30%)
  if (social.femaleRatio < 0.3) score -= 20;
  else if (social.femaleRatio < 0.4) score -= 5;

  // 員工數量評分 (佔 20%)
  if (social.employees < 50) score -= 15;
  else if (social.employees < 100) score -= 5;

  // 訓練時數評分 (佔 25%)
  if (social.trainingHours < 10000) score -= 20;
  else if (social.trainingHours < 20000) score -= 5;

  // 社區投資評分 (佔 25%)
  if (social.communityInvestment < 50000) score -= 20;
  else if (social.communityInvestment < 100000) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function calculateGovernanceScore(governance) {
  let score = 100;

  // 獨立董事比例評分 (佔 40%)
  const independenceRatio = governance.independentDirectors / governance.boardSize;
  if (independenceRatio < 0.5) score -= 30;
  else if (independenceRatio < 0.7) score -= 10;

  // 執行長薪酬評分 (佔 30%)
  if (governance.executivePay > 10000000) score -= 25;
  else if (governance.executivePay > 5000000) score -= 5;

  // 政策數量評分 (佔 30%)
  if (governance.policiesCount < 5) score -= 20;
  else if (governance.policiesCount < 10) score -= 5;

  return Math.max(0, Math.min(100, score));
}

// 使用範例
async function runLangGraphESGAnalysis() {
  // 創建 LangGraph 工作流程
  const workflow = new LangGraph();

  // 添加節點
  workflow
    .addNode('start', () => ({ started: true }))
    .addNode('data_collection', dataCollectionNode)
    .addNode('data_validation', dataValidationNode)
    .addNode('metrics_calculation', metricsCalculationNode)
    .addNode('analysis_insights', analysisInsightsNode)
    .addNode('report_generation', reportGenerationNode)
    .addNode('results_storage', resultsStorageNode);

  // 定義工作流程邊
  workflow
    .addEdge('start', 'data_collection')
    .addEdge('data_collection', 'data_validation')
    .addEdge('data_validation', 'metrics_calculation', (result) => result.dataValid)
    .addEdge('data_validation', 'end', (result) => !result.dataValid) // 數據無效時結束
    .addEdge('metrics_calculation', 'analysis_insights')
    .addEdge('analysis_insights', 'report_generation')
    .addEdge('report_generation', 'results_storage')
    .addEdge('results_storage', 'end');

  // 執行工作流程
  try {
    console.log('🎯 開始 LangGraph ESG 分析工作流程...\n');

    const finalState = await workflow.execute();

    console.log('\n📋 最終結果：');
    console.log('================');

    if (finalState.report) {
      console.log('📊 ESG 評分：', finalState.report.scores);
      console.log('\n🔍 關鍵洞察：');
      finalState.report.keyInsights.forEach((insight, index) => {
        console.log(`${index + 1}. [${insight.category.toUpperCase()}] ${insight.message}`);
        console.log(`   建議：${insight.recommendations.join('；')}`);
      });

      console.log('\n💾 報告已儲存，ID：', finalState.storageId);
    }

    console.log('\n✅ LangGraph 工作流程執行完成！');

  } catch (error) {
    console.error('❌ 工作流程執行失敗：', error.message);
  }
}

// 導出類別和函數
export { LangGraph, runLangGraphESGAnalysis };

// 如果直接運行此文件，執行範例
if (import.meta.url === `file://${process.argv[1]}`) {
  runLangGraphESGAnalysis().catch(console.error);
}