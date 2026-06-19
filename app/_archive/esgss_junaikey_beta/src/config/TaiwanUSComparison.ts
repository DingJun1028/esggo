/**
 * Taiwan-US Corporate ESG Comparison Visual Analysis Tool
 * =======================================================
 * Generates aesthetic comparison tables and insight analysis.
 */

import {
  US_TOP10_ESG_DATABASE,
  generateTaiwanUSComparison,
  generateFrameworkAdoptionComparison,
  generateReportQualityComparison,
} from './USTop10Database';
import { TAIWAN_TOP30_ESG_DATABASE } from './TaiwanTop30Database';

/**
 * Generates a comprehensive comparison report of Taiwan and US companies.
 */
export function generateTaiwanUSComparisonReport(): string {
  const report: string[] = [];

  report.push('# Taiwan vs. USA Top Corporate Sustainability Report Comparison Analysis');
  report.push('');
  report.push('> **Taiwan Companies**: TSMC (2330), Delta (2308), Foxconn (2317)');
  report.push('> **US Companies**: Apple, Microsoft, Amazon, Alphabet (Google), Tesla');
  report.push('> **Analysis Year**: 2023');
  report.push('> **Data Sources**: Corporate ESG Reports, CDP, DJSI, MSCI Public Information');
  report.push('');
  report.push('---');
  report.push('');

  // 1. Basic Corporate Information Comparison
  report.push('## 1. Corporate Scale and Industry Comparison');
  report.push('');
  report.push('| Country | Company | Industry | Market Cap (B NTD) | Employees | DJSI Score | MSCI Rating | CDP Climate |');
  report.push('|---------|---------|----------|--------------------|-----------|------------|-------------|-------------|');

  const twCompanies = TAIWAN_TOP30_ESG_DATABASE.slice(0, 3);
  twCompanies.forEach(c => {
    const latest = c.reports[0];
    const djsi = c.ratings.djsi?.[0]?.score || '-';
    const msci = c.ratings.msci?.[0]?.rating || '-';
    const cdp = c.ratings.cdp?.[0]?.rating || '-';
    report.push(
      `| 🇹🇼 | ${c.companyName.substring(0, 6)} | ${c.industry} | ${c.marketCap.toLocaleString()} | ${c.employees.toLocaleString()} | ${djsi} | ${msci} | ${cdp} |`
    );
  });

  const usCompanies = US_TOP10_ESG_DATABASE.slice(0, 5);
  usCompanies.forEach(c => {
    const latest = c.reports[0];
    const djsi = c.ratings.djsi?.[0]?.score || '-';
    const msci = c.ratings.msci?.[0]?.rating || '-';
    const cdp = c.ratings.cdp?.[0]?.rating || '-';
    report.push(
      `| 🇺🇸 | ${c.companyNameEn.split(' ')[0]} | ${c.industry} | ${c.marketCap.toLocaleString()} | ${c.employees.toLocaleString()} | ${djsi} | ${msci} | ${cdp} |`
    );
  });

  report.push('');
  report.push('### 💡 Scale Insights');
  report.push('- **Market Cap Gap**: Apple market cap is ~90T NTD, 4.5x larger than TSMC (~20T).');
  report.push('- **Employee Scale**: Amazon has 1.54M employees (world largest), TSMC has 73k.');
  report.push('- **Rating Level**: Taiwan DJSI average 86, US average 91 (leading by 5 points).');
  report.push('- **CDP Performance**: Top companies from both sides reach A-level, neck and neck.');
  report.push('');

  // 2. Environmental Performance Comparison
  report.push('## 2. Environmental Performance Comparison (E)');
  report.push('');
  report.push('### 2.1 Renewable Energy and Carbon Emissions');
  report.push('');
  report.push('| Company | Scope 1+2 Emissions<br>(10k tCO2e) | Renewable Energy<br>(%) | Net Zero Target | RE100 | SBTi |');
  report.push('|---------|--------------------------------|-----------------------|----------------|-------|------|');

  twCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const env = report0.kpis?.environment;
    const targets = report0.targets;
    const scope12 = env ? ((env.scope1Emissions || 0) + (env.scope2Emissions || 0)) / 10000 : 0;
    report.push(
      `| 🇹🇼 ${c.companyName.substring(0, 6)} | ${scope12.toFixed(1)} | ${env?.renewableEnergyPercentage?.toFixed(1) || '-'}% | ${targets.netZeroYear || '-'} | ${targets.re100Committed ? targets.re100TargetYear || 'Yes' : '✗'} | ${targets.sbtiApproved ? '✓' : '✗'} |`
    );
  });

  usCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const env = report0.kpis?.environment;
    const targets = report0.targets;
    const scope12 = env ? ((env.scope1Emissions || 0) + (env.scope2Emissions || 0)) / 10000 : 0;
    report.push(
      `| 🇺🇸 ${c.companyNameEn.split(' ')[0]} | ${scope12.toFixed(1)} | ${env?.renewableEnergyPercentage?.toFixed(1) || '-'}% | ${targets.netZeroYear || '-'} | ${targets.re100Committed ? (targets.re100TargetYear === 2018 || targets.re100TargetYear === 2017 ? 'Achieved' : targets.re100TargetYear) : '✗'} | ${targets.sbtiApproved ? '✓' : '✗'} |`
    );
  });

  report.push('');
  report.push('### 🌟 Environmental Highlights');
  report.push('');
  report.push('#### 🇺🇸 US Leading Advantages');
  report.push('- **100% Renewable Energy**: Apple (2018), Microsoft, Google (2017) achieved.');
  report.push('- **Extreme Net Zero**: Apple/Microsoft/Google all set 2030 full value chain net-zero.');
  report.push('- **Innovative Technologies**:');
  report.push('  - Apple: Carbon-free aluminium');
  report.push('  - Microsoft: Carbon negative + $1B Climate Innovation Fund');
  report.push('  - Google: 24/7 Carbon-free energy (highest standard)');
  report.push('');
  report.push('#### 🇹🇼 Taiwan Specialty Performance');
  report.push('- **Delta Leading Globally**: 2030 Net-Zero, 63% Renewable Energy, CDP 3A.');
  report.push('- **TSMC Steady Progress**: 25% Renewable Energy (2023), 2050 Net-Zero, SBTi Certified.');
  report.push('- **Foxconn Transformation**: 15.8% Renewable Energy, high supply chain complexity.');
  report.push('');

  // 3. Social Metrics Comparison
  report.push('## 3. Social Metrics Comparison (S)');
  report.push('');
  report.push(
    '| Company | Employees | Female Emp.<br>(%) | Female Mgr.<br>(%) | Training<br>(hrs/p) | LTIFR | Avg Salary<br>(10k NTD) |'
  );
  report.push(
    '|---------|-----------|------------------|------------------|-------------------|-------|----------------------|'
  );

  twCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const soc = report0.kpis?.social;
    report.push(
      `| 🇹🇼 ${c.companyName.substring(0, 6)} | ${soc?.totalEmployees?.toLocaleString() || '-'} | ${soc?.femaleEmployeeRate?.toFixed(1) || '-'}% | ${soc?.femaleManagerRate?.toFixed(1) || '-'}% | ${soc?.trainingHoursPerEmployee?.toFixed(1) || '-'} | ${soc?.ltifr?.toFixed(2) || '-'} | ${soc?.avgSalary ? (soc.avgSalary / 10).toFixed(0) : '-'} |`
    );
  });

  usCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const soc = report0.kpis?.social;
    const salaryNTD = soc?.avgSalary ? (soc.avgSalary * 30).toFixed(0) : '-'; // USD to NTD
    report.push(
      `| 🇺🇸 ${c.companyNameEn.split(' ')[0]} | ${soc?.totalEmployees?.toLocaleString() || '-'} | ${soc?.femaleEmployeeRate?.toFixed(1) || '-'}% | ${soc?.femaleManagerRate?.toFixed(1) || '-'}% | ${soc?.trainingHoursPerEmployee?.toFixed(1) || '-'} | ${soc?.ltifr?.toFixed(2) || '-'} | ${salaryNTD} |`
    );
  });

  report.push('');
  report.push('### 👥 Social Insights');
  report.push('- **Salary Gap**: Google average salary ~8.85M NTD, 3x Taiwan tech industry.');
  report.push('- **Female Ratio**: US tech average ~34%, Taiwan ~33%, very close.');
  report.push('- **Safety Performance**: TSMC LTIFR 0.08 (industry benchmark), Amazon 6.8 (logistics challenge).');
  report.push('- **Training Investment**: TSMC 68.5 hrs/person leads US average (40 hrs).');
  report.push('');

  // 4. Governance Structure Comparison
  report.push('## 4. Governance Structure Comparison (G)');
  report.push('');
  report.push(
    '| Company | Board<br>Seats | Indep. Dir.<br>(%) | Female Dir.<br>(%) | Ethics Training<br>(%) | Corruption | Cyber Invest<br>(B NTD) |'
  );
  report.push(
    '|---------|--------------|-------------------|------------------|---------------------|------------|----------------------|'
  );

  twCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const gov = report0.kpis?.governance;
    report.push(
      `| 🇹🇼 ${c.companyName.substring(0, 6)} | ${gov?.boardSize || '-'} | ${gov?.independentDirectorRate?.toFixed(1) || '-'}% | ${gov?.femaleDirectorRate?.toFixed(1) || '-'}% | ${gov?.ethicsTrainingRate || '-'}% | ${gov?.corruptionIncidents || 0} | ${gov?.cyberSecurityInvestment ? (gov.cyberSecurityInvestment / 100).toFixed(1) : '-'} |`
    );
  });

  usCompanies.forEach(c => {
    const report0 = c.reports?.[0];
    if (!report0) return;
    const gov = report0.kpis?.governance;
    const csInvestNTD = gov?.cyberSecurityInvestment
      ? ((gov.cyberSecurityInvestment * 30) / 100).toFixed(1)
      : '-';
    report.push(
      `| 🇺🇸 ${c.companyNameEn.split(' ')[0]} | ${gov?.boardSize || '-'} | ${gov?.independentDirectorRate?.toFixed(1) || '-'}% | ${gov?.femaleDirectorRate?.toFixed(1) || '-'}% | ${gov?.ethicsTrainingRate || '-'}% | ${gov?.corruptionIncidents || 0} | ${csInvestNTD} |`
    );
  });

  report.push('');
  report.push('### 🏛️ Governance Highlights');
  report.push('- **Independent Director Ratio**: Apple 87.5%, Microsoft 92.3% (US standards significantly higher).');
  report.push('- **Female Directors**: Microsoft 46.2% leads globally, Taiwan average 24.9% has room for improvement.');
  report.push('- **Cybersecurity Investment**: Microsoft ~150B NTD (highest in tech industry).');
  report.push('- **Zero Corruption**: Top companies from both sides achieved zero corruption incidents.');
  report.push('');

  // 5. Reporting Framework Adoption Comparison
  report.push('## 5. Reporting Framework Adoption Comparison');
  report.push('');

  const frameworkComparison = generateFrameworkAdoptionComparison();
  report.push('| Framework | Taiwan Adoption | US Adoption | Advantage |');
  report.push('|-----------|-----------------|-------------|-----------|');
  frameworkComparison.forEach(f => {
    const winner =
      f.taiwanAdoption > f.usAdoption ? '🇹🇼' : f.usAdoption > f.taiwanAdoption ? '🇺🇸' : '🤝';
    report.push(`| ${f.framework} | ${f.taiwanAdoption}% | ${f.usAdoption}% | ${winner} |`);
  });

  report.push('');
  report.push('### 📋 Framework Insights');
  report.push('- **GRI Standards**: Taiwan 100% adoption, US 60% (Apple/Amazon/Tesla not adopted).');
  report.push('- **SASB/TCFD**: Both sides 100% adoption, now global standard.');
  report.push('- **UN Global Compact**: Taiwan 100% signed, US only 40% (Microsoft/Google).');
  report.push('- **Reason for Difference**: Taiwan regulated heavily by TWSE, US companies have more flexibility.');
  report.push('');

  // 6. Report Quality Comparison
  report.push('## 6. Report Quality Comparison');
  report.push('');

  const qualityComparison = generateReportQualityComparison();
  report.push('| Evaluation Metric | Taiwan | US | Advantage |');
  report.push('|-------------------|--------|----|-----------|');
  qualityComparison.forEach(q => {
    const winnerSymbol = q.winner === 'TW' ? '🇹🇼' : q.winner === 'US' ? '🇺🇸' : '🤝';
    report.push(`| ${q.metric} | ${q.taiwan} | ${q.us} | ${winnerSymbol} |`);
  });

  report.push('');
  report.push('### 📊 Quality Analysis');
  report.push('- **Taiwan Advantages**:');
  report.push('  - Average length 300 pages vs US 138 pages (more detailed).');
  report.push('  - Number of frameworks 5.7 vs US 4.6 (more comprehensive).');
  report.push('  - Reasonable assurance 100% vs US 60% (more rigorous).');
  report.push('- **US Advantages**:');
  report.push('  - Avg release time 5.2 months vs Taiwan 7 months (more timely).');
  report.push('  - Innovation elements 2.4 vs Taiwan 2.0 (more innovative).');
  report.push('');

  // 7. Key Metadata Comparison Overview
  report.push('## 7. Key Performance Comparison Overview');
  report.push('');

  const crossComparison = generateTaiwanUSComparison();
  report.push('| Metric | Taiwan Avg | US Avg | Taiwan Leader | US Leader | Gap Analysis |');
  report.push('|--------|------------|--------|---------------|-----------|--------------|');

  crossComparison.forEach(c => {
    const twLeader = `${c.taiwanLeader.company}(${c.taiwanLeader.value})`;
    const usLeader = `${c.usLeader.company}(${c.usLeader.value})`;
    const gap =
      typeof c.taiwanAverage === 'number' && typeof c.usAverage === 'number'
        ? (c.usAverage - c.taiwanAverage).toFixed(1)
        : 'N/A';
    report.push(
      `| ${c.category} | ${c.taiwanAverage} | ${c.usAverage} | ${twLeader} | ${usLeader} | ${gap} |`
    );
  });

  report.push('');

  // 8. Comprehensive Insights
  report.push('## 8. Taiwan-US Corporate ESG Comprehensive Insights');
  report.push('');
  report.push('### 🌟 US Corporate Advantages');
  report.push('');
  report.push('1. **Ambitious Climate Action**');
  report.push('   - Apple/Microsoft/Google all committed to 2030 full value chain Net-Zero.');
  report.push('   - 100% Renewable Energy is now tech industry standard (3 achieved).');
  report.push('   - Microsoft proposed "Carbon Negative", surpassing Net-Zero.');
  report.push('');
  report.push('2. **Leading Innovative Practices**');
  report.push('   - Google: 24/7 Carbon-free energy, Planetary Computer.');
  report.push('   - Microsoft: Internal carbon tax, $1B Climate Innovation Fund.');
  report.push('   - Apple: Carbon-free aluminium, 200+ suppliers committed to RE100.');
  report.push('');
  report.push('3. **Governance Diversity**');
  report.push('   - Female directors average 38.7% vs Taiwan 24.9%.');
  report.push('   - Independent director ratio average 86% vs Taiwan 38%.');
  report.push('');
  report.push('### 🇹🇼 Taiwan Corporate Advantages');
  report.push('');
  report.push('1. **Report Completeness and Rigor**');
  report.push('   - Average length 300 pages (US 138 pages).');
  report.push('   - 100% Reasonable Assurance (US 60%).');
  report.push('   - More comprehensive framework adoption (GRI 100% vs US 60%).');
  report.push('');
  report.push('2. **Delta as an International Benchmark**');
  report.push('   - 2030 Net-Zero target (on par with Apple/Microsoft).');
  report.push('   - CDP 3A rating (globally rare).');
  report.push('   - 63% Renewable Energy (only second to Apple/Microsoft/Google).');
  report.push('   - DJSI 92 score exceeds Apple (91).');
  report.push('');
  report.push('3. **Investment in Talent Cultivation**');
  report.push('   - TSMC training 68.5 hrs/person (surpassing US average 40 hrs).');
  report.push('   - Safety performance LTIFR 0.08 (industry benchmark).');
  report.push('');
  report.push('### 🎯 Directions for Taiwan Companies');
  report.push('');
  report.push('1. **Accelerate Renewable Energy Transition**');
  report.push('   - Currently average 35%, need to move towards 100% target.');
  report.push('   - Learn from Apple model: lead 200+ suppliers to commit to RE100.');
  report.push('');
  report.push('2. **Enhance Climate Ambition**');
  report.push('   - Review Net-Zero target year (2043 → 2030-2035).');
  report.push('   - Increase SBTi certification ratio (67% → 100%).');
  report.push('');
  report.push('3. **Strengthen Governance Diversity**');
  report.push('   - Increase female director ratio (25% → 40%).');
  report.push('   - Increase independent director ratio (38% → 50%+).');
  report.push('');
  report.push('4. **Innovate Sustainable Technologies**');
  report.push('   - Invest in climate tech and green innovation.');
  report.push('   - Build sustainable ecosystems (e.g., Microsoft Climate Fund).');
  report.push('');

  // 9. Conclusion
  report.push('## 9. Conclusion and Recommendations');
  report.push('');
  report.push('### 📈 Overall Evaluation');
  report.push('');
  report.push('| Aspect | Taiwan | US | Comments |');
  report.push('|--------|--------|----|----------|');
  report.push('| Environmental | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | US leads, but Delta is world-class |');
  report.push('| Social | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Similar performance, each with safe advantages |');
  report.push('| Governance | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | US leads in diversity, Taiwan needs improvement |');
  report.push('| Report Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Taiwan is more detailed and rigorous |');
  report.push('| Innovation | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | US leads in innovation (Carbon Negative, 24/7 CFE) |');
  report.push('');
  report.push('### 💡 Recommendations for Taiwan Companies');
  report.push('');
  report.push('1. **Short-term (within 1 year)**');
  report.push('   - Set more aggressive renewable energy targets (100% by 2030).');
  report.push('   - 100% companies obtain SBTi certification.');
  report.push('   - Increase female director ratio to 30%+ .');
  report.push('');
  report.push('2. **Mid-term (within 3 years)**');
  report.push('   - Review Net-Zero target year, move towards 2030-2035.');
  report.push('   - Establish internal carbon pricing mechanisms.');
  report.push('   - Drive 100% renewable energy commitment in supply chain.');
  report.push('');
  report.push('3. **Long-term (within 5 years)**');
  report.push('   - Invest in climate tech and innovation funds.');
  report.push('   - Build 24/7 carbon-free energy systems.');
  report.push('   - Achieve carbon neutrality or carbon negative status.');
  report.push('');
  report.push('### 🌍 Global Perspective');
  report.push('');
  report.push('Top Taiwan and US companies each have unique strengths in ESG:');
  report.push('- **USA**: Climate ambition, innovative technology, and governance diversity leadership.');
  report.push('- **Taiwan**: Reporting rigor, framework completeness, and talent cultivation investment excellence.');
  report.push('- **Delta**: Reached international top tier: CDP 3A, 2030 Net-Zero, DJSI 92.');
  report.push('- **TSMC**: Steady progress, but needs to accelerate renewable energy transition.');
  report.push('');
  report.push(
    'Taiwan companies should learn from US companies\' **climate ambition and innovative practices**, while maintaining the **reporting quality and rigor** advantage, to march towards a sustainable future together! 🌱'
  );
  report.push('');
  report.push('---');
  report.push('');
  report.push('**Report Compiled by:** Sunshine ESG All In One');
  report.push('**Update Date:** January 2026');
  report.push('**Next Update:** July 2026 (After 2024 reports release)');

  return report.join('\n');
}
