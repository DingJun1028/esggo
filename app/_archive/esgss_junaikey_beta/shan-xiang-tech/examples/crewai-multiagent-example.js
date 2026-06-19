/**
 * 善向技術 - crewAI 多代理系統實作範例
 * 基於 "使用 crewAI 建構多 AI 智能體系統" 課程
 *
 * 此範例展示如何創建一個協作型多代理系統來處理 ESG 報告分析
 */

// 模擬 crewAI 的基本結構 (實際使用需要安裝 crewAI)
class CrewAI {
  constructor() {
    this.agents = [];
    this.tasks = [];
  }

  addAgent(agent) {
    this.agents.push(agent);
    return this;
  }

  addTask(task) {
    this.tasks.push(task);
    return this;
  }

  async execute() {
    console.log('🚀 啟動 crewAI 多代理系統...');

    const results = {};

    // 模擬代理執行順序
    for (const agent of this.agents) {
      console.log(`🤖 ${agent.name} 開始執行任務...`);
      const result = await agent.performTasks(this.tasks);
      results[agent.name] = result;
    }

    return results;
  }
}

// ESG 數據分析代理
class ESGDataAnalyst {
  constructor() {
    this.name = 'ESG 數據分析師';
    this.role = '分析 ESG 數據並提取關鍵指標';
    this.skills = ['數據分析', 'ESG 指標', '財務分析'];
  }

  async performTasks(tasks) {
    const results = [];

    for (const task of tasks) {
      if (task.type === 'data_analysis') {
        console.log(`📊 ${this.name} 正在分析數據...`);
        const analysis = await this.analyzeESGData(task.data);
        results.push(analysis);
      }
    }

    return results;
  }

  async analyzeESGData(data) {
    // 模擬 ESG 數據分析
    return {
      carbonFootprint: this.calculateCarbonFootprint(data),
      diversityScore: this.calculateDiversityScore(data),
      governanceRating: this.assessGovernance(data),
      recommendations: this.generateRecommendations(data),
    };
  }

  calculateCarbonFootprint(data) {
    // 簡化的碳足跡計算
    const emissions = data.emissions || 0;
    const revenue = data.revenue || 1;
    return {
      total: emissions,
      intensity: emissions / revenue,
      trend: 'decreasing',
      target2030: emissions * 0.5,
    };
  }

  calculateDiversityScore(data) {
    // 多樣性評分計算
    const femaleRatio = data.femaleEmployees / data.totalEmployees;
    const ethnicDiversity = data.ethnicGroups || 3;
    return {
      gender: femaleRatio,
      ethnicity: ethnicDiversity / 10,
      overall: (femaleRatio + ethnicDiversity / 10) / 2,
    };
  }

  assessGovernance(data) {
    // 治理評估
    const boardIndependence = data.boardIndependence || 0.7;
    const executivePay = data.executivePay || 5000000;
    const shareholderRights = data.shareholderRights || 0.8;

    return {
      boardIndependence,
      executiveCompensation: executivePay,
      shareholderRights,
      overall: (boardIndependence + shareholderRights) / 2,
    };
  }

  generateRecommendations(data) {
    const recommendations = [];

    if (data.emissions > 10000) {
      recommendations.push('建議投資再生能源項目以降低碳排放');
    }

    if (data.femaleEmployees / data.totalEmployees < 0.4) {
      recommendations.push('建議加強多元性招聘計劃');
    }

    if (data.boardIndependence < 0.7) {
      recommendations.push('建議增加獨立董事比例');
    }

    return recommendations;
  }
}

// ESG 報告撰寫代理
class ESGReportWriter {
  constructor() {
    this.name = 'ESG 報告撰寫員';
    this.role = '基於分析結果撰寫專業 ESG 報告';
    this.skills = ['報告撰寫', 'ESG 披露', '可持續發展報告'];
  }

  async performTasks(tasks) {
    const results = [];

    for (const task of tasks) {
      if (task.type === 'report_writing') {
        console.log(`📝 ${this.name} 正在撰寫報告...`);
        const report = await this.writeReport(task.analysis);
        results.push(report);
      }
    }

    return results;
  }

  async writeReport(analysis) {
    return {
      executiveSummary: this.createExecutiveSummary(analysis),
      environmentalSection: this.writeEnvironmentalSection(analysis),
      socialSection: this.writeSocialSection(analysis),
      governanceSection: this.writeGovernanceSection(analysis),
      recommendations: analysis.recommendations,
      generatedAt: new Date().toISOString(),
    };
  }

  createExecutiveSummary(analysis) {
    return `
ESG 表現總結：
- 碳足跡：${analysis.carbonFootprint.total} 噸 CO₂e
- 多樣性評分：${(analysis.diversityScore.overall * 100).toFixed(1)}%
- 治理評分：${(analysis.governanceRating.overall * 100).toFixed(1)}%

公司展現出對可持續發展的承諾，但仍有一些改進空間。
    `.trim();
  }

  writeEnvironmentalSection(analysis) {
    const cf = analysis.carbonFootprint;
    return `
環境表現：
- 總碳排放量：${cf.total} 噸 CO₂e
- 碳排放強度：${cf.intensity.toFixed(2)} 噸/百萬美元營收
- 趨勢：${cf.trend}
- 2030 年目標：${cf.target2030} 噸 CO₂e

公司正在朝向減碳目標邁進，但需要加速再生能源轉型。
    `.trim();
  }

  writeSocialSection(analysis) {
    const ds = analysis.diversityScore;
    return `
社會表現：
- 性別多樣性：${(ds.gender * 100).toFixed(1)}% 女性員工
- 族群多樣性：${(ds.ethnicity * 100).toFixed(1)}%
- 整體多樣性評分：${(ds.overall * 100).toFixed(1)}%

公司需要加強多元文化工作環境的建設。
    `.trim();
  }

  writeGovernanceSection(analysis) {
    const gr = analysis.governanceRating;
    return `
治理表現：
- 董事會獨立性：${(gr.boardIndependence * 100).toFixed(1)}%
- 股東權利：${(gr.shareholderRights * 100).toFixed(1)}%
- 整體治理評分：${(gr.overall * 100).toFixed(1)}%

公司治理結構基本完善，但可進一步優化。
    `.trim();
  }
}

// 使用範例
async function runESGAnalysis() {
  // 模擬 ESG 數據
  const esgData = {
    companyName: 'GreenTech Solutions Inc.',
    year: 2024,
    emissions: 12500,
    revenue: 50000000,
    femaleEmployees: 125,
    totalEmployees: 300,
    ethnicGroups: 5,
    boardIndependence: 0.75,
    executivePay: 4500000,
    shareholderRights: 0.85,
  };

  // 創建 crewAI 實例
  const crew = new CrewAI();

  // 添加代理
  const dataAnalyst = new ESGDataAnalyst();
  const reportWriter = new ESGReportWriter();

  crew.addAgent(dataAnalyst);
  crew.addAgent(reportWriter);

  // 定義任務
  const analysisTask = {
    type: 'data_analysis',
    data: esgData,
    priority: 'high',
  };

  const reportTask = {
    type: 'report_writing',
    priority: 'high',
  };

  crew.addTask(analysisTask);
  crew.addTask(reportTask);

  // 執行多代理協作
  try {
    console.log('🎯 開始 ESG 報告生成流程...\n');

    const results = await crew.execute();

    console.log('\n📋 最終結果：');
    console.log('================');

    if (results['ESG 數據分析師']) {
      console.log('數據分析結果：', results['ESG 數據分析師']);
    }

    if (results['ESG 報告撰寫員']) {
      console.log('\n完整 ESG 報告：');
      results['ESG 報告撰寫員'].forEach(report => {
        console.log(report.executiveSummary);
        console.log('\n環境部分：');
        console.log(report.environmentalSection);
        console.log('\n社會部分：');
        console.log(report.socialSection);
        console.log('\n治理部分：');
        console.log(report.governanceSection);
        console.log('\n建議：');
        report.recommendations.forEach(rec => console.log(`- ${rec}`));
      });
    }

    console.log('\n✅ ESG 分析完成！');
  } catch (error) {
    console.error('❌ 分析過程中發生錯誤：', error);
  }
}

// 導出類別供其他模組使用
export { CrewAI, ESGDataAnalyst, ESGReportWriter, runESGAnalysis };

// 如果直接運行此文件，執行範例
if (import.meta.url === `file://${process.argv[1]}`) {
  runESGAnalysis().catch(console.error);
}
