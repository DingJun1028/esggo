const reportTemplates = {
  GRI: {
    id: 'GRI-2021', framework: 'GRI', name: 'GRI 永續報告書模板',
    nameEn: 'GRI Sustainability Report Template',
    description: '依循 GRI Standards 2021 編製的永續報告書',
    version: '2021', sections: ['GRI-1', 'GRI-2', 'GRI-300', 'GRI-400', 'GRI-200'],
  },
  TCFD: {
    id: 'TCFD-2021', framework: 'TCFD', name: 'TCFD 氣候相關財務揭露模板',
    nameEn: 'TCFD Climate-Related Financial Disclosures Template',
    description: '依循 TCFD Recommendations 2021 編製的氣候風險報告',
    version: '2021', sections: ['TCFD-Governance', 'TCFD-Strategy', 'TCFD-RiskManagement', 'TCFD-MetricsTargets'],
  },
  CSRD: {
    id: 'CSRD-2024', framework: 'CSRD', name: 'CSRD 歐盟永續報告模板',
    nameEn: 'CSRD EU Sustainability Reporting Template',
    description: '依循 CSRD ESRS 2024 編製的歐盟永續報告',
    version: '2024', sections: ['CSRD-General', 'CSRD-Environmental', 'CSRD-Social', 'CSRD-Governance'],
  },
  SDG: {
    id: 'SDG-MAPPING', framework: 'SDG', name: 'SDG 永續發展目標對應模板',
    nameEn: 'SDG Alignment Mapping Template',
    description: '對應聯合國 17 項永續發展目標的貢獻報告',
    version: '2015', sections: ['SDG-Overview', 'SDG-Details'],
  },
};

function generateReport(framework, companyData, year) {
  const template = reportTemplates[framework];
  if (!template) return null;
  const sections = [];
  if (framework === 'GRI') {
    sections.push({ id: 'GRI-1', title: '關於本報告', content: `## 關於本報告\n\n${companyData.name} 依據 GRI Standards 2021 編製本報告。\n\n- **報導期間**：${year}年1月1日至${year}年12月31日\n- **產業類別**：${companyData.industry}`, kpis: [] });
    sections.push({ id: 'GRI-300', title: 'GRI 300: 環境', content: `## GRI 300: 環境\n\n- **能源消耗**：${companyData.esgData?.energyConsumption || 'N/A'} MWh\n- **再生能源占比**：${companyData.esgData?.renewableEnergy || 'N/A'}%\n- **Scope 1 排放**：${companyData.esgData?.ghgScope1 || 'N/A'} tCO2e\n- **Scope 2 排放**：${companyData.esgData?.ghgScope2 || 'N/A'} tCO2e`, kpis: [{ name: '能源消耗', value: companyData.esgData?.energyConsumption || 'N/A', unit: 'MWh' }, { name: 'Scope 1', value: companyData.esgData?.ghgScope1 || 'N/A', unit: 'tCO2e' }] });
    sections.push({ id: 'GRI-400', title: 'GRI 400: 社會', content: `## GRI 400: 社會\n\n- **員工人數**：${companyData.employees || 'N/A'}\n- **離職率**：${companyData.esgData?.turnoverRate || 'N/A'}%`, kpis: [] });
  }
  if (framework === 'TCFD') {
    sections.push({ id: 'TCFD-Governance', title: '治理', content: `## 治理\n\n${companyData.name} 董事會監督氣候相關風險。`, kpis: [] });
    sections.push({ id: 'TCFD-Strategy', title: '策略', content: `## 策略\n\n### 氣候風險\n- 實體風險：極端氣候\n- 轉型風險：碳定價`, kpis: [] });
    sections.push({ id: 'TCFD-MetricsTargets', title: '指標與目標', content: `## 指標與目標\n\n- **總排放量**：${(companyData.esgData?.ghgScope1 || 0) + (companyData.esgData?.ghgScope2 || 0)} tCO2e`, kpis: [{ name: '總排放量', value: (companyData.esgData?.ghgScope1 || 0) + (companyData.esgData?.ghgScope2 || 0), unit: 'tCO2e' }] });
  }
  if (framework === 'CSRD') {
    sections.push({ id: 'CSRD-General', title: '一般要求', content: `## 一般要求\n\n依據 ESRS 2024 進行雙重重大性評估。`, kpis: [] });
    sections.push({ id: 'CSRD-Environmental', title: '環境議題', content: `## 環境議題\n\n- 氣候變遷 (E1)\n- 污染 (E2)\n- 水資源 (E3)`, kpis: [] });
  }
  if (framework === 'SDG') {
    sections.push({ id: 'SDG-Overview', title: 'SDG 對應總覽', content: `## SDG 對應總覽\n\n${companyData.name} 積極響應聯合國永續發展目標。`, kpis: [] });
  }
  return { id: `report-${framework}-${year}-${Date.now()}`, framework, title: `${companyData.name} ${year}年 ${template.name}`, generatedAt: new Date().toISOString(), year, sections, summary: `本報告依據 ${framework} 框架編製，涵蓋 ${sections.length} 個章節。` };
}

// ESG Report Routes
app.get('/esg-report/templates', (_req, res) => {
  res.json({ success: true, data: Object.values(reportTemplates) });
});

app.get('/esg-report/templates/:framework', (req, res) => {
  const t = reportTemplates[req.params.framework.toUpperCase()];
  if (!t) return res.status(404).json({ success: false, error: 'Template not found' });
  res.json({ success: true, data: t });
});

app.post('/esg-report/generate', (req, res) => {
  const { framework, companyData, year, sections } = req.body;
  if (!framework || !companyData) return res.status(400).json({ success: false, error: 'framework and companyData required' });
  const report = generateReport(framework.toUpperCase(), companyData, year || new Date().getFullYear());
  if (!report) return res.status(404).json({ success: false, error: 'Invalid framework' });
  if (sections && sections.length > 0) report.sections = report.sections.filter(s => sections.includes(s.id));
  res.json({ success: true, data: report });
});

app.post('/esg-report/export', (req, res) => {
  const { framework, companyData, year } = req.body;
  if (!framework || !companyData) return res.status(400).json({ success: false, error: 'framework and companyData required' });
  const report = generateReport(framework.toUpperCase(), companyData, year || new Date().getFullYear());
  if (!report) return res.status(404).json({ success: false, error: 'Invalid framework' });
  let md = `# ${report.title}\n\n**生成時間**：${report.generatedAt}\n**報告框架**：${report.framework}\n\n---\n\n`;
  for (const s of report.sections) {
    md += `${s.content}\n\n`;
    if (s.kpis?.length) { md += `### KPIs\n| 指標 | 數值 | 單位 |\n|------|------|------|\n`; for (const k of s.kpis) md += `| ${k.name} | ${k.value} | ${k.unit} |\n`; md += `\n`; }
  }
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${report.title}.md"`);
  res.send(md);
});

app.get('/esg-report/health', (_req, res) => {
  res.json({ service: 'ESG Report API', version: '1.0.0', frameworks: Object.keys(reportTemplates), status: 'healthy' });
});
