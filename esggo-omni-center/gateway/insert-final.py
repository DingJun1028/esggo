with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'r') as f:
    content = f.read()

report_routes = """
// ═══════════════════════════════════════════════════════════════
// ESG Report Routes
// ═══════════════════════════════════════════════════════════════

const reportTemplates = {
  GRI: { id: 'GRI-2021', framework: 'GRI', name: 'GRI 永續報告書模板', nameEn: 'GRI Sustainability Report Template', description: '依循 GRI Standards 2021', version: '2021', sections: ['GRI-1', 'GRI-2', 'GRI-300', 'GRI-400', 'GRI-200'] },
  TCFD: { id: 'TCFD-2021', framework: 'TCFD', name: 'TCFD 氣候相關財務揭露模板', nameEn: 'TCFD Climate-Related Financial Disclosures', description: '依循 TCFD Recommendations 2021', version: '2021', sections: ['TCFD-Governance', 'TCFD-Strategy', 'TCFD-RiskManagement', 'TCFD-MetricsTargets'] },
  CSRD: { id: 'CSRD-2024', framework: 'CSRD', name: 'CSRD 歐盟永續報告模板', nameEn: 'CSRD EU Sustainability Reporting', description: '依循 CSRD ESRS 2024', version: '2024', sections: ['CSRD-General', 'CSRD-Environmental', 'CSRD-Social', 'CSRD-Governance'] },
  SDG: { id: 'SDG-MAPPING', framework: 'SDG', name: 'SDG 永續發展目標對應模板', nameEn: 'SDG Alignment Mapping', description: '對應聯合國 17 項 SDGs', version: '2015', sections: ['SDG-Overview', 'SDG-Details'] },
};

function generateReport(fw, cd, yr) {
  const t = reportTemplates[fw]; if (!t) return null;
  const s = [];
  if (fw === 'GRI') {
    s.push({ id: 'GRI-1', title: '關於本報告', content: '## 關於本報告\\n\\n' + cd.name + ' 依據 GRI Standards 2021 編製本報告。\\n\\n- 報導期間：' + yr + '年\\n- 產業類別：' + cd.industry, kpis: [] });
    s.push({ id: 'GRI-300', title: 'GRI 300: 環境', content: '## GRI 300: 環境\\n\\n- 能源消耗：' + (cd.esgData?.energyConsumption || 'N/A') + ' MWh\\n- 再生能源占比：' + (cd.esgData?.renewableEnergy || 'N/A') + '%\\n- Scope 1：' + (cd.esgData?.ghgScope1 || 'N/A') + ' tCO2e\\n- Scope 2：' + (cd.esgData?.ghgScope2 || 'N/A') + ' tCO2e', kpis: [{name:'能源消耗',value:cd.esgData?.energyConsumption||'N/A',unit:'MWh'},{name:'Scope 1',value:cd.esgData?.ghgScope1||'N/A',unit:'tCO2e'}] });
    s.push({ id: 'GRI-400', title: 'GRI 400: 社會', content: '## GRI 400: 社會\\n\\n- 員工人數：' + (cd.employees||'N/A') + '\\n- 離職率：' + (cd.esgData?.turnoverRate||'N/A') + '%', kpis: [] });
  }
  if (fw === 'TCFD') {
    s.push({ id: 'TCFD-Governance', title: '治理', content: '## 治理\\n\\n' + cd.name + ' 董事會監督氣候相關風險。', kpis: [] });
    s.push({ id: 'TCFD-Strategy', title: '策略', content: '## 策略\\n\\n### 氣候風險\\n- 實體風險：極端氣候\\n- 轉型風險：碳定價', kpis: [] });
    s.push({ id: 'TCFD-MetricsTargets', title: '指標與目標', content: '## 指標與目標\\n\\n- 總排放量：' + ((cd.esgData?.ghgScope1||0)+(cd.esgData?.ghgScope2||0)) + ' tCO2e', kpis: [{name:'總排放量',value:(cd.esgData?.ghgScope1||0)+(cd.esgData?.ghgScope2||0),unit:'tCO2e'}] });
  }
  if (fw === 'CSRD') {
    s.push({ id: 'CSRD-General', title: '一般要求', content: '## 一般要求\\n\\n依據 ESRS 2024 進行雙重重大性評估。', kpis: [] });
    s.push({ id: 'CSRD-Environmental', title: '環境議題', content: '## 環境議題\\n\\n- 氣候變遷 (E1)\\n- 污染 (E2)\\n- 水資源 (E3)', kpis: [] });
  }
  if (fw === 'SDG') {
    s.push({ id: 'SDG-Overview', title: 'SDG 對應總覽', content: '## SDG 對應總覽\\n\\n' + cd.name + ' 積極響應聯合國永續發展目標。', kpis: [] });
  }
  return { id: 'report-'+fw+'-'+yr+'-'+Date.now(), framework: fw, title: cd.name+' '+yr+'年 '+t.name, generatedAt: new Date().toISOString(), year: yr, sections: s, summary: '本報告依據 '+fw+' 框架編製，涵蓋 '+s.length+' 個章節。' };
}

app.get('/esg-report/templates', (_req, res) => { res.json({ success: true, data: Object.values(reportTemplates) }); });
app.get('/esg-report/templates/:fw', (req, res) => { const t = reportTemplates[req.params.fw.toUpperCase()]; if (!t) return res.status(404).json({success:false,error:'Not found'}); res.json({success:true,data:t}); });
app.post('/esg-report/generate', (req, res) => { const {framework:fw,companyData:cd,year:yr,sections:sec} = req.body; if (!fw||!cd) return res.status(400).json({success:false,error:'framework and companyData required'}); const r = generateReport(fw.toUpperCase(),cd,yr||new Date().getFullYear()); if (!r) return res.status(404).json({success:false,error:'Invalid framework'}); if (sec&&sec.length>0) r.sections=r.sections.filter(s=>sec.includes(s.id)); res.json({success:true,data:r}); });
app.post('/esg-report/export', (req, res) => { const {framework:fw,companyData:cd,year:yr} = req.body; if (!fw||!cd) return res.status(400).json({success:false,error:'required'}); const r = generateReport(fw.toUpperCase(),cd,yr||new Date().getFullYear()); if (!r) return res.status(404).json({success:false,error:'Invalid'}); let md = '# '+r.title+'\\n\\n**框架**：'+r.framework+'\\n\\n---\\n\\n'; for (const s of r.sections) { md += s.content+'\\n\\n'; if (s.kpis?.length) { md += '### KPIs\\n| 指標 | 數值 | 單位 |\\n|------|------|------|\\n'; for (const k of s.kpis) md += '| '+k.name+' | '+k.value+' | '+k.unit+' |\\n'; md += '\\n'; } } res.setHeader('Content-Type','text/markdown; charset=utf-8'); res.setHeader('Content-Disposition','attachment; filename="'+r.title+'.md"'); res.send(md); });
app.get('/esg-report/health', (_req, res) => { res.json({service:'ESG Report API',version:'1.0.0',frameworks:Object.keys(reportTemplates),status:'healthy'}); });
"""

# Insert after the health endpoint
lines = content.split('\n')
new_lines = []
inserted = False
for line in lines:
    new_lines.append(line)
    if "app.get('/health'" in line and not inserted:
        new_lines.append(report_routes)
        inserted = True

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'w') as f:
    f.write('\n'.join(new_lines))

print('Done')
