/**
 * Taiwan Top 30 ESG Visualization & Analysis Tools
 * ================================================
 * Generates precise analysis tables and visual charts.
 */

import {
  TAIWAN_TOP30_ESG_DATABASE,
  CompanyESGProfile,
  AnnualESGReport,
} from './TaiwanTop30Database';

/**
 * Summary Table: 5-Year Framework Evolution
 */
export function generateFrameworkEvolutionTable(): {
  markdown: string;
  data: any[][];
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3); // 台積電、台達電、鴻海

  const headers = [
    'Company',
    'Year',
    'GRI',
    'SASB',
    'TCFD',
    'SDGs',
    'IFRS S1/S2',
    'Assurance Level',
    'SBTi',
    'Net Zero Target',
  ];
  const rows: any[][] = [];

  companies.forEach(company => {
    company.reports.forEach(report => {
      rows.push([
        company.companyName.substring(0, 6), // 簡稱
        report.year,
        report.frameworks.gri ? `✓ ${report.frameworks.griVersion || ''}` : '✗',
        report.frameworks.sasb ? '✓' : '✗',
        report.frameworks.tcfd ? '✓' : '✗',
        report.frameworks.sdgs ? '✓' : '✗',
        report.frameworks.ifrs_s1_s2 ? '✓' : 'Est. 2025',
        report.assurance.level || '-',
        report.targets.sbtiApproved ? '✓' : report.targets.sbti ? 'In Progress' : '✗',
        report.targets.netZeroYear || '-',
      ]);
    });
  });

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown, data: [headers, ...rows] };
}

/**
 * Environmental Performance 5-Year Trend Comparison
 */
export function generateEnvironmentalTrendsTable(): {
  markdown: string;
  insights: string[];
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);

  const headers = [
    'Company',
    'Year',
    'Scope 1+2<br>Emissions(10k tCO2e)',
    'Emission<br>Intensity',
    'Renewable Energy<br>(%)',
    'Water<br>Recycling(%)',
    'Waste<br>Recycling(%)',
    'Env.<br>Investment(100M)',
  ];

  const rows: any[][] = [];
  const insights: string[] = [];

  companies.forEach(company => {
    company.reports.forEach(report => {
      const env = report.kpis.environment;
      const totalScope12 = ((env.scope1Emissions || 0) + (env.scope2Emissions || 0)) / 10000;

      rows.push([
        company.companyName.substring(0, 6),
        report.year,
        totalScope12.toFixed(1),
        env.emissionsIntensity?.toFixed(1) || '-',
        env.renewableEnergyPercentage?.toFixed(1) || '-',
        env.waterRecyclingRate?.toFixed(1) || '-',
        env.wasteRecyclingRate?.toFixed(1) || '-',
        (env.environmentalInvestment || 0) / 100,
      ]);
    });

    // Generate Insights
    const latestReport = company.reports[0];
    if (!latestReport) return;

    const env = latestReport.kpis.environment;

    if (env.renewableEnergyPercentage && env.renewableEnergyPercentage > 50) {
      insights.push(
        `${company.companyName.substring(0, 6)}: RE usage at ${env.renewableEnergyPercentage}%, industry leader`
      );
    }

    if (latestReport?.targets?.netZeroYear && latestReport.targets.netZeroYear <= 2030) {
      insights.push(
        `${company.companyName.substring(0, 6)}: Ambitious Net Zero target set for ${latestReport.targets.netZeroYear}`
      );
    }

    if (env.wasteRecyclingRate && env.wasteRecyclingRate > 90) {
      insights.push(
        `${company.companyName.substring(0, 6)}: Waste recycling at ${env.wasteRecyclingRate}%, circular economy model`
      );
    }
  });

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown, insights };
}

/**
 * Social Metrics Comparison
 */
export function generateSocialMetricsTable(): {
  markdown: string;
  bestPractices: { company: string; metric: string; value: any; reason: string }[];
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);

  const headers = [
    'Company',
    'Year',
    'Employees',
    'Female<br>Emp(%)',
    'Female<br>Mgr(%)',
    'Training<br>(hrs/p)',
    'LTIFR',
    'Avg<br>Salary(10k)',
    'Supplier<br>Audit',
  ];

  const rows: any[][] = [];
  const bestPractices: any[] = [];

  companies.forEach(company => {
    company.reports.forEach(report => {
      const soc = report.kpis.social;

      rows.push([
        company.companyName.substring(0, 6),
        report.year,
        soc.totalEmployees?.toLocaleString() || '-',
        soc.femaleEmployeeRate?.toFixed(1) || '-',
        soc.femaleManagerRate?.toFixed(1) || '-',
        soc.trainingHoursPerEmployee?.toFixed(1) || '-',
        soc.ltifr?.toFixed(2) || '-',
        soc.avgSalary ? (soc.avgSalary / 10).toFixed(0) : '-',
        soc.supplierESGAudits || '-',
      ]);
    });
  });

  // 識別最佳實踐
  const latestReports = companies.map(c => c.reports[0]);

  // 找出最高女性主管比例
  const maxFemaleManager = latestReports.reduce(
    (max, r) => {
      const rate = r?.kpis.social.femaleManagerRate || 0;
      return rate > max.rate ? { company: companies.find(c => c.reports.includes(r!))!, rate } : max;
    },
    { company: companies[0], rate: 0 } as { company: CompanyESGProfile; rate: number }
  );

  if (maxFemaleManager.company && maxFemaleManager.rate > 20) {
    bestPractices.push({
      company: maxFemaleManager.company.companyName.substring(0, 6),
      metric: 'Female Manager Ratio',
      value: `${maxFemaleManager.rate.toFixed(1)}%`,
      reason: 'Industry leader, demonstrating gender equality commitment',
    });
  }

  // 找出最高訓練時數
  const maxTraining = latestReports.reduce(
    (max, r) => {
      const hours = r?.kpis.social.trainingHoursPerEmployee || 0;
      return hours > max.hours
        ? { company: companies.find(c => c.reports.includes(r!))!, hours }
        : max;
    },
    { company: companies[0], hours: 0 } as { company: CompanyESGProfile; hours: number }
  );

  if (maxTraining.company && maxTraining.hours > 60) {
    bestPractices.push({
      company: maxTraining.company.companyName.substring(0, 6),
      metric: 'Employee Training Hours',
      value: `${maxTraining.hours.toFixed(1)} hrs/p`,
      reason: 'Emphasis on talent development and skill enhancement',
    });
  }

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown, bestPractices };
}

/**
 * Governance and Certification Achievement Comparison
 */
export function generateGovernanceAndCertificationsTable(): {
  markdown: string;
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);

  const headers = [
    'Company',
    'Board<br>Size',
    'Indep.<br>Ratio(%)',
    'Female<br>Board(%)',
    'DJSI<br>Score',
    'MSCI<br>Rating',
    'CDP<br>Climate',
    'Key<br>Awards',
  ];

  const rows: any[][] = [];

  companies.forEach(company => {
    const latestReport = company.reports[0];
    if (!latestReport) return;
    const gov = latestReport.kpis.governance;

    // 取得最新評級
    const latestDJSI = company.ratings.djsi?.[0];
    const latestMSCI = company.ratings.msci?.[0];
    const latestCDP = company.ratings.cdp?.[0];

    const topAwards = (company.awards || [])
      .slice(0, 2)
      .map(a => a.awardName.substring(0, 15))
      .join(', ');

    rows.push([
      company.companyName.substring(0, 6),
      gov.boardSize || '-',
      gov.independentDirectorRate?.toFixed(1) || '-',
      gov.femaleDirectorRate?.toFixed(1) || '-',
      latestDJSI ? `${latestDJSI.score}` : '-',
      latestMSCI?.rating || '-',
      latestCDP?.rating || '-',
      topAwards || '-',
    ]);
  });

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown };
}

/**
 * Climate Action Ambition Comparison
 */
export function generateClimateAmbitionComparison(): {
  markdown: string;
  ranking: { company: string; score: number; highlights: string[] }[];
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);

  const headers = [
    'Company',
    'Net Zero Target',
    'RE100',
    'SBTi',
    'Scope 3<br>Disclosure',
    'CDP<br>Rating',
    'Reduction<br>Result(%)',
    'Ambition<br>Score',
  ];

  const rows: any[][] = [];
  const ranking: any[] = [];

  companies.forEach(company => {
    const latestReport = company.reports[0];
    if (!latestReport) return;
    const targets = latestReport.targets;
    const env = latestReport.kpis.environment;
    const cdp = company.ratings.cdp?.[0];

    // 計算雄心評分（0-100）
    let score = 0;
    const highlights: string[] = [];

    // 淨零目標（0-30分）
    if (targets.netZeroYear) {
      if (targets.netZeroYear <= 2030) {
        score += 30;
        highlights.push('2030淨零承諾');
      } else if (targets.netZeroYear <= 2040) {
        score += 20;
      } else if (targets.netZeroYear <= 2050) {
        score += 10;
      }
    }

    // RE100承諾（0-20分）
    if (targets.re100Committed) {
      score += 10;
      if (targets.re100TargetYear && targets.re100TargetYear <= 2030) {
        score += 10;
        highlights.push('2030 RE100');
      }
    }

    // SBTi認證（0-20分）
    if (targets.sbtiApproved) {
      score += 20;
      highlights.push('SBTi認證');
    } else if (targets.sbti) {
      score += 10;
    }

    // Scope 3揭露（0-15分）
    if (env.scope3Emissions && env.scope3Emissions > 0) {
      score += 15;
      highlights.push('Scope 3揭露');
    }

    // CDP評級（0-15分）
    if (cdp) {
      if (cdp.rating === 'A') score += 15;
      else if (cdp.rating === 'A-') score += 12;
      else if (cdp.rating === 'B') score += 9;
    }

    ranking.push({
      company: company.companyName.substring(0, 6),
      score,
      highlights,
    });

    rows.push([
      company.companyName.substring(0, 6),
      targets.netZeroYear || 'Not Committed',
      targets.re100Committed ? targets.re100TargetYear || 'Yes' : '✗',
      targets.sbtiApproved ? '✓' : targets.sbti ? 'In Progress' : '✗',
      env.scope3Emissions ? '✓' : '✗',
      cdp?.rating || '-',
      env.emissionsReduction?.toFixed(1) || '-',
      `${score}/100`,
    ]);
  });

  // 排序
  ranking.sort((a, b) => b.score - a.score);

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown, ranking };
}

/**
 * Report Quality & Innovation Assessment
 */
export function generateReportQualityAssessment(): {
  markdown: string;
  innovationLeaders: { company: string; innovations: string[] }[];
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);

  const headers = [
    'Company',
    'Year',
    'Pages',
    'English Ver',
    'Frameworks',
    'Assurance<br>Scope',
    'Innovation<br>Elements',
    'Quality<br>Rating',
  ];

  const rows: any[][] = [];
  const innovationLeaders: any[] = [];

  companies.forEach(company => {
    company.reports.forEach(report => {
      // 計算框架數量
      const frameworkCount = Object.values(report.frameworks).filter(Boolean).length;

      // 計算品質評級
      let qualityScore = 0;
      if (report.totalPages > 200) qualityScore += 2;
      if (report.hasEnglishVersion) qualityScore += 2;
      if (frameworkCount >= 5) qualityScore += 2;
      if (report.assurance.hasAssurance) qualityScore += 2;
      if (report.assurance.level === 'Reasonable') qualityScore += 2;

      const qualityGrade =
        qualityScore >= 9 ? 'A+' : qualityScore >= 7 ? 'A' : qualityScore >= 5 ? 'B+' : 'B';

      rows.push([
        company.companyName.substring(0, 6),
        report.year,
        report.totalPages,
        report.hasEnglishVersion ? '✓' : '✗',
        frameworkCount,
        report.assurance.scope?.length || 0,
        report.innovativeElements?.length || 0,
        qualityGrade,
      ]);
    });

    // Collect Innovation Leaders
    const latestReport = company.reports[0];
    if (latestReport?.innovativeElements && latestReport.innovativeElements.length > 0) {
      innovationLeaders.push({
        company: company.companyName.substring(0, 6),
        innovations: latestReport.innovativeElements,
      });
    }
  });

  const markdown = generateMarkdownTable(headers, rows);

  return { markdown, innovationLeaders };
}

/**
 * Executive ESG Dashboard
 */
export function generateExecutiveDashboard(): {
  summary: {
    company: string;
    overallRating: 'Leading' | 'Advanced' | 'Developing';
    eScore: number;
    sScore: number;
    gScore: number;
    keyStrengths: string[];
    improvementAreas: string[];
  }[];
  mermaidChart: string;
} {
  const companies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);
  const summary: any[] = [];

  companies.forEach(company => {
    const latestReport = company.reports[0];
    if (!latestReport) return;

    // Calculate E, S, G scores (0-100)
    let eScore = 0;
    let sScore = 0;
    let gScore = 0;

    // E Score calculation
    const env = latestReport.kpis.environment;
    if (env.renewableEnergyPercentage) eScore += Math.min(env.renewableEnergyPercentage, 100) * 0.3;
    if (env.emissionsReduction) eScore += Math.min((env.emissionsReduction / 50) * 100, 100) * 0.3;
    if (env.wasteRecyclingRate) eScore += env.wasteRecyclingRate * 0.2;
    if (env.waterRecyclingRate) eScore += env.waterRecyclingRate * 0.2;

    // S Score calculation
    const soc = latestReport.kpis.social;
    if (soc.femaleManagerRate) sScore += Math.min((soc.femaleManagerRate / 30) * 100, 100) * 0.25;
    if (soc.trainingHoursPerEmployee)
      sScore += Math.min((soc.trainingHoursPerEmployee / 80) * 100, 100) * 0.25;
    if (soc.ltifr !== undefined) sScore += Math.max(100 - soc.ltifr * 500, 0) * 0.25;
    if (soc.zeroFatalities) sScore += 25;

    // G Score calculation
    const gov = latestReport.kpis.governance;
    if (gov.independentDirectorRate)
      gScore += Math.min((gov.independentDirectorRate / 40) * 100, 100) * 0.3;
    if (gov.femaleDirectorRate) gScore += Math.min((gov.femaleDirectorRate / 30) * 100, 100) * 0.2;
    if (gov.ethicsTrainingRate) gScore += gov.ethicsTrainingRate * 0.3;
    if (gov.corruptionIncidents === 0) gScore += 20;

    // 綜合評級
    const avgScore = (eScore + sScore + gScore) / 3;
    const overallRating = avgScore >= 80 ? 'Leading' : avgScore >= 60 ? 'Advanced' : 'Developing';

    // 識別優勢與改進領域
    const keyStrengths: string[] = [];
    const improvementAreas: string[] = [];

    if (eScore > 80) keyStrengths.push('Environmental Management');
    if (sScore > 80) keyStrengths.push('Social Responsibility');
    if (gScore > 80) keyStrengths.push('Corporate Governance');

    if (eScore < 60) improvementAreas.push('Environmental Performance');
    if (sScore < 60) improvementAreas.push('Social Metrics');
    if (gScore < 60) improvementAreas.push('Governance Structure');

    // CDP A additional points
    if (company.ratings.cdp?.[0]?.rating === 'A') keyStrengths.push('CDP Leadership');

    // SBTi additional points
    if (latestReport?.targets?.sbtiApproved) keyStrengths.push('SBTi Targets');

    summary.push({
      company: company.companyName.substring(0, 6),
      overallRating,
      eScore: Math.round(eScore),
      sScore: Math.round(sScore),
      gScore: Math.round(gScore),
      keyStrengths,
      improvementAreas,
    });
  });

  // Generate Mermaid Radar Chart
  const mermaidChart = `
graph TB
    subgraph "Taiwan Top 3 ESG Score"
    A["TSMC<br/>E:${summary[0].eScore} S:${summary[0].sScore} G:${summary[0].gScore}"]
    B["Delta<br/>E:${summary[1].eScore} S:${summary[1].sScore} G:${summary[1].gScore}"]
    C["Foxconn<br/>E:${summary[2].eScore} S:${summary[2].sScore} G:${summary[2].gScore}"]
    end
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style B fill:#2196F3,stroke:#1565C0,color:#fff
    style C fill:#FF9800,stroke:#E65100,color:#fff
`;

  return { summary, mermaidChart };
}

/**
 * Helper: Generate Markdown Table
 */
function generateMarkdownTable(headers: string[], rows: any[][]): string {
  const headerRow = '| ' + headers.join(' | ') + ' |';
  const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const dataRows = rows.map(row => '| ' + row.join(' | ') + ' |').join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

/**
 * Generate Comprehensive Analysis Report
 */
export function generateComprehensiveAnalysisReport(): string {
  const report: string[] = [];

  report.push('# Taiwan Top 30 ESG 5-Year Trend Analysis');
  report.push('');
  report.push('> **Analyzed Companies**: TSMC (2330), Delta (2308), Foxconn (2317)');
  report.push('> **Period**: 2019-2023 (5 Years)');
  report.push('> **Data Sources**: Corporate Sustainability Reports, CDP, DJSI, MSCI, etc.');
  report.push('');

  // 1. Framework Evolution
  report.push('## 1. Reporting Framework Evolution');
  report.push('');
  const { markdown: frameworkTable } = generateFrameworkEvolutionTable();
  report.push(frameworkTable);
  report.push('');
  report.push('### 📊 Key Findings');
  report.push('- ✅ All three companies have 100% adopted GRI 2021 standards');
  report.push('- ✅ TCFD climate disclosure has become standard');
  report.push('- ⚠️ IFRS S1/S2 to be phased in starting 2025');
  report.push('- 🏆 TSMC and Delta have obtained SBTi certification');
  report.push('');

  // 2. Environmental Performance
  report.push('## 2. Environmental Performance Comparison');
  report.push('');
  const { markdown: envTable, insights } = generateEnvironmentalTrendsTable();
  report.push(envTable);
  report.push('');
  report.push('### 🌱 Performance Highlights');
  insights.forEach(insight => report.push(`- ${insight}`));
  report.push('');

  // 3. Social Metrics
  report.push('## 3. Social Metrics Comparison');
  report.push('');
  const { markdown: socialTable, bestPractices } = generateSocialMetricsTable();
  report.push(socialTable);
  report.push('');
  report.push('### 🏅 Best Practices');
  bestPractices.forEach(bp => {
    report.push(`- **${bp.company}** ${bp.metric}: ${bp.value} - ${bp.reason}`);
  });
  report.push('');

  // 4. Governance & Certifications
  report.push('## 4. Governance & International Certifications');
  report.push('');
  const { markdown: govTable } = generateGovernanceAndCertificationsTable();
  report.push(govTable);
  report.push('');

  // 5. Climate Ambition
  report.push('## 5. Climate Action Ambition Ranking');
  report.push('');
  const { markdown: climateTable, ranking } = generateClimateAmbitionComparison();
  report.push(climateTable);
  report.push('');
  report.push('### 🎯 Ambition Ranking');
  ranking.forEach((r, i) => {
    report.push(`${i + 1}. **${r.company}** - ${r.score}/100 pts`);
    r.highlights.forEach((h: string) => report.push(`   - ${h}`));
  });
  report.push('');

  // 6. Report Quality
  report.push('## 6. Report Quality & Innovation');
  report.push('');
  const { markdown: qualityTable, innovationLeaders } = generateReportQualityAssessment();
  report.push(qualityTable);
  report.push('');
  report.push('### 💡 Innovation Leaders');
  innovationLeaders.forEach(leader => {
    report.push(`- **${leader.company}**: ${leader.innovations.join(', ')}`);
  });
  report.push('');

  // 7. Executive Dashboard
  report.push('## 7. ESG Executive Dashboard');
  report.push('');
  const { summary, mermaidChart } = generateExecutiveDashboard();
  report.push('```mermaid');
  report.push(mermaidChart);
  report.push('```');
  report.push('');
  report.push('| Company | Rating | E Score | S Score | G Score | Key Strengths | Improvements |');
  report.push('|---------|--------|---------|---------|---------|---------------|--------------|');
  summary.forEach(s => {
    report.push(
      `| ${s.company} | ${s.overallRating} | ${s.eScore} | ${s.sScore} | ${s.gScore} | ${s.keyStrengths.join(', ')} | ${s.improvementAreas.join(', ') || 'Continuous improvement'} |`
    );
  });
  report.push('');

  // 8. Conclusions & Recommendations
  report.push('## 8. Conclusions & Recommendations');
  report.push('');
  report.push('### 🎯 Industry Benchmarks');
  report.push('');
  report.push('1. **TSMC**: Comprehensive ESG Leader');
  report.push('   - Global #1 in DJSI Semiconductor Industry');
  report.push('   - CDP Climate Change A Rating');
  report.push('   - 2050 Net Zero + SBTi Certified');
  report.push('   - RE100 Commitment (100% renewable by 2050)');
  report.push('');
  report.push('2. **Delta Electronics**: Climate Action Pioneer');
  report.push('   - 2030 Net Zero Target (Most aggressive worldwide)');
  report.push('   - Triple A Ratings in CDP (Climate, Water, Supply Chain)');
  report.push('   - 63% RE usage (High in industry)');
  report.push('   - Global #1 in DJSI Electronic Equipment for 13 years');
  report.push('');
  report.push('3. **Foxconn**: Supply Chain Transformation');
  report.push('   - World largest electronics manufacturing service');
  report.push('   - Driving MIH EV Alliance');
  report.push('   - Circular economy business model innovation');
  report.push('   - Supply chain ESG management (1250 audits)');
  report.push('');
  report.push('### 💡 Insights for Other Enterprises');
  report.push('');
  report.push('1. **Framework Integration**: GRI + SASB + TCFD is baseline; IFRS S1/S2 is the new standard');
  report.push('2. **Climate Ambition**: Set SBTi targets, commit to RE100, disclose Scope 3');
  report.push('3. **Third-party Assurance**: Reasonable assurance level is becoming the leader standard');
  report.push('4. **Innovation Elevates Engagement**: AR/VR and interactive web versions improve UX');
  report.push('5. **International Ratings**: DJSI, CDP A, MSCI AAA bolster global competitiveness');
  report.push('');

  return report.join('\n');
}
