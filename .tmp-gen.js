#!/usr/bin/env node
// generate-full-template.js
// 自動生成 24 段完整永續報告範本（含 SVG 圖表、數據表格）

const fs = require('fs');
const path = require('path');

const SVG = {
  bar: (title, labels, values) => {
    const colors = ['#003262','#FDB515','#10B981','#3B82F6','#6366F1','#EF4444'];
    const max = Math.max(...values);
    return `<svg width="100%" viewBox="0 0 500 280" style="margin:20px 0;background:#F8FAFC;border-radius:8px;padding:10px;">
  <text x="250" y="22" font-size="13" fill="#003262" text-anchor="middle" font-weight="bold">${title}</text>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#E2E8F0"/>
  ${values.map((v,i) => {
    const h = (v/max)*170;
    const x = 80 + i * 75;
    return `<rect x="${x}" y="${220-h}" width="45" height="${h}" fill="${colors[i%6]}" rx="4"/>
    <text x="${x+22}" y="${215-h}" font-size="10" fill="#0F172A" text-anchor="middle">${v}</text>
    <text x="${x+22}" y="240" font-size="9" fill="#64748B" text-anchor="middle">${labels[i]}</text>`;
  }).join('')}
  <text x="250" y="270" font-size="9" fill="#64748B" text-anchor="middle">© {{company_name}} {{report_year}}</text>
</svg>`;
  },
  line: (title, labels, datasets) => {
    const colors = ['#003262','#FDB515','#10B981','#3B82F6'];
    const allVals = datasets.flatMap(d => d.values);
    const max = Math.max(...allVals);
    return `<svg width="100%" viewBox="0 0 500 280" style="margin:20px 0;background:#F8FAFC;border-radius:8px;padding:10px;">
  <text x="250" y="22" font-size="13" fill="#003262" text-anchor="middle" font-weight="bold">${title}</text>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#E2E8F0"/>
  <line x1="60" y1="50" x2="60" y2="220" stroke="#E2E8F0"/>
  ${datasets.map((ds,di) => {
    const pts = ds.values.map((v,i) => `${60 + i*(380/(labels.length-1))},${220-(v/max)*170}`).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${colors[di]}" stroke-width="3"/>
    ${ds.values.map((v,i) => `<circle cx="${60+i*(380/(labels.length-1))}" cy="${220-(v/max)*170}" r="4" fill="${colors[di]}"/>`).join('')}`;
  }).join('')}
  ${labels.map((l,i) => `<text x="${60+i*(380/(labels.length-1))}" y="240" font-size="9" fill="#64748B" text-anchor="middle">${l}</text>`).join('')}
  ${datasets.map((ds,i) => `<rect x="${300+i*90}" y="${250}" width="12" height="12" fill="${colors[i]}"/><text x="${315+i*90}" y="${259}" font-size="9" fill="#0F172A">${ds.label}</text>`).join('')}
</svg>`;
  },
  pie: (title, data) => {
    const colors = ['#003262','#FDB515','#10B981','#3B82F6','#6366F1','#EF4444'];
    const total = data.reduce((s,d) => s+d.value, 0);
    let cum = 0;
    return `<svg width="100%" viewBox="0 0 400 260" style="margin:20px 0;background:#F8FAFC;border-radius:8px;padding:10px;">
  <text x="140" y="22" font-size="13" fill="#003262" text-anchor="middle" font-weight="bold">${title}</text>
  ${data.map((d,i) => {
    const angle = (d.value/total)*360;
    const r1 = (cum-90)*Math.PI/180; cum += angle;
    const r2 = (cum-90)*Math.PI/180;
    const x1=140+80*Math.cos(r1), y1=130+80*Math.sin(r1);
    const x2=140+80*Math.cos(r2), y2=130+80*Math.sin(r2);
    return `<path d="M140,130 L${x1},${y1} A80,80 0 ${angle>180?1:0},1 ${x2},${y2} Z" fill="${colors[i%6]}" stroke="white" stroke-width="2"/>`;
  }).join('')}
  ${data.map((d,i) => `<rect x="260" y="${50+i*22}" width="12" height="12" fill="${colors[i%6]}"/><text x="277" y="${60+i*22}" font-size="10" fill="#0F172A">${d.label} ${Math.round(d.value/total*100)}%</text>`).join('')}
</svg>`;
  },
  radar: (title, axes, datasets) => {
    const colors = ['#003262','#FDB515','#10B981'];
    return `<svg width="100%" viewBox="0 0 400 320" style="margin:20px 0;background:#F8FAFC;border-radius:8px;padding:10px;">
  <text x="200" y="22" font-size="13" fill="#003262" text-anchor="middle" font-weight="bold">${title}</text>
  ${[40,80,120,150].map(r => {
    const pts = axes.map((_,i) => { const a=(i/axes.length)*2*Math.PI-Math.PI/2; return `${200+r*Math.cos(a)},${165+r*Math.sin(a)}`; }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>`;
  }).join('')}
  ${axes.map((a,i) => { const ang=(i/axes.length)*2*Math.PI-Math.PI/2; return `<line x1="200" y1="165" x2="${200+150*Math.cos(ang)}" y2="${165+150*Math.sin(ang)}" stroke="#E2E8F0" stroke-width="0.5"/><text x="${200+170*Math.cos(ang)}" y="${168+170*Math.sin(ang)}" font-size="9" fill="#0F172A" text-anchor="middle">${a}</text>`; }).join('')}
  ${datasets.map(ds => {
    const pts = axes.map((_,i) => { const a=(i/axes.length)*2*Math.PI-Math.PI/2; const v=ds.values[i]/100; return `${200+v*130*Math.cos(a)},${165+v*130*Math.sin(a)}`; }).join(' ');
    return `<polygon points="${pts}" fill="${ds.color}15" stroke="${ds.color}" stroke-width="2"/>`;
  }).join('')}
  ${datasets.map((ds,i) => `<rect x="${60+i*100}" y="${290}" width="12" height="12" fill="${ds.color}"/><text x="${75+i*100}" y="${300}" font-size="9" fill="#0F172A">${ds.label}</text>`).join('')}
</svg>`;
  }
};

const table = (headers, rows) => `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const sections = [
  { id:'ch-01', title:'Ch.1 永續治理與策略', chapter:1, wordCount:2000, gri:['GRI-2-9','GRI-2-22'], chart:'bar',
    ph:['{{company_name}}','{{report_year}}','{{ceo_name}}','{{board_size}}'],
    content: () => `<h2>Ch.1 永續治理與策略</h2>
<h3>1.1 治理架構</h3>
<p>{{company_name}}（以下簡稱「本公司」）深知企業永續發展對於長期價值創造與社會責任的重要性，建立了完整的永續治理架構。董事會為最高監督單位，下設永續發展委員會，由 {{ceo_name}} 擔任主任委員。董事會共 {{board_size}} 名董事，其中獨立董事 4 位、女性董事 3 位，確保決策的多元性與獨立性。</p>
<h3>1.2 董事會效能</h3>
${SVG.bar('董事會效能指標(%)', ['出席率','獨立性','多樣性','專業度','ESG知識'], [95,44,33,88,82])}
${table(['指標','{{report_year}}','前年','目標'],[['董事會出席率','95%','93%','≥90%'],['獨立董事比例','44%','44%','≥33%'],['女性董事','33%','33%','≥33%'],['ESG委員會','✅正常','✅正常','✅正常']])}
<h3>1.3 永續策略</h3>
<p>本公司永續策略以「創造共享價值」為核心，結合 SDGs 制定短中長期路徑。四大主軸：環境守護、社會共融、誠信治理、創新價值。</p>
<h3>1.4 重大主題</h3>
${table(['主題','影響','優先','管理方針'],[['氣候變遷','極高','P1','SBTi'],['資訊安全','高','P1','ISO27001'],['人才留任','高','P2','薪酬福利'],['供應鏈','高','P2','供應商準則']])}
<h3>1.5 目標</h3>
<ul><li>2025：減碳20%、女性主管30%、離職率<10%</li><li>2028：減碳40%、100%再生能源</li><li>2030：碳中和、ESG指數成分股</li></ul>`},

  { id:'ch-02', title:'Ch.2 氣候變遷與碳管理', chapter:2, wordCount:2000, gri:['GRI-305','TCFD'], chart:'bar',
    ph:['{{company_name}}','{{report_year}}','{{carbon_emissions}}'],
    content: () => `<h2>Ch.2 氣候變遷與碳管理</h2>
<h3>2.1 溫室氣體盤查</h3>
<p>{{company_name}} 依據 ISO 14064-1 進行盤查，{{report_year}} 年總排放 {{carbon_emissions}} tCO2e，較基準年減排 8%。</p>
${SVG.bar('溫室氣體排放(tCO2e)', ['範圍一','範圍二','範圍三'], [18750,43750,62500])}
${table(['排放範圍','{{report_year}}','前年','變化'],[['範圍一','18,750','20,000','-6%'],['範圍二','43,750','48,000','-9%'],['範圍三','62,500','65,000','-4%'],['合計','125,000','133,000','-6%']])}
<h3>2.2 減量路徑</h3>
<ul><li>2025：較基準年減碳20%</li><li>2028：較基準年減碳45%</li><li>2030：碳中和</li></ul>
<h3>2.3 TCFD 揭露</h3>
<p>本公司依據 TCFD 進行氣候情境分析，評估 1.5°C/2°C/3°C 情境下的風險與機會。</p>`},

  { id:'ch-03', title:'Ch.3 能源管理', chapter:3, wordCount:2000, gri:['GRI-302'], chart:'pie',
    ph:['{{company_name}}','{{report_year}}','{{energy_consumption}}'],
    content: () => `<h2>Ch.3 能源管理</h2>
<h3>3.1 能源結構</h3>
<p>{{company_name}} {{report_year}} 年總能耗 {{energy_consumption}} GJ，再生能源佔比 45%。</p>
${SVG.pie('能源結構', [{label:'再生能源',value:45},{label:'外購電力',value:30},{label:'天然氣',value:15},{label:'化石燃料',value:10}])}
${table(['能源類型','{{report_year}}','前年','目標'],[['再生能源','45%','35%','100%'],['外購電力','30%','35%','-'],['天然氣','15%','20%','-'],['化石燃料','10%','10%','0%']])}
<h3>3.2 能源效率</h3>
<p>能源密集度 85 GJ/百萬營收，較前年改善 10%。</p>`},

  { id:'ch-04', title:'Ch.4 水資源管理', chapter:4, wordCount:2000, gri:['GRI-303'], chart:'line',
    ph:['{{company_name}}','{{report_year}}','{{water_withdrawal}}'],
    content: () => `<h2>Ch.4 水資源管理</h2>
<h3>4.1 水資源使用</h3>
<p>{{company_name}} {{report_year}} 年取水 {{water_withdrawal}} m³，回收率 78%。</p>
${SVG.line('水資源趨勢(m³)', ['2021','2022','2023','2024','2025'], [{label:'取水量',values:[1400000,1350000,1300000,1250000,1200000],color:'#003262'},{label:'回收量',values:[980000,1000000,1020000,1010000,980000],color:'#10B981'}])}
${table(['指標','{{report_year}}','前年','目標'],[['取水量','1,200,000','1,250,000','持續減少'],['回收率','78%','75%','≥80%'],['水密集度','226','250','持續改善']])}
<h3>4.2 水資源風險</h3>
<p>本公司評估營運據點水壓力風險，{{report_year}} 年無水資源相關影響事件。</p>`},

  { id:'ch-05', title:'Ch.5 廢棄物與循環經濟', chapter:5, wordCount:2000, gri:['GRI-306'], chart:'bar',
    ph:['{{company_name}}','{{report_year}}','{{waste_generated}}'],
    content: () => `<h2>Ch.5 廢棄物與循環經濟</h2>
<h3>5.1 廢棄物管理</h3>
<p>{{company_name}} {{report_year}} 年廢棄物產出 {{waste_generated}} 公噸，回收率 82%。</p>
${SVG.bar('廢棄物產出(公噸)', ['2021','2022','2023','2024','2025'], [10000,9500,9000,8700,8500])}
${table(['指標','{{report_year}}','前年','目標'],[['廢棄物總量','8,500','8,700','持續減少'],['回收率','82%','78%','≥85%'],['有害廢棄物','120','130','持續減少']])}
<h3>5.2 循環經濟</h3>
<p>本公司推動循環經濟，{{report_year}} 年產品回收率達 75%，包裝減量 15%。</p>`},

  { id:'ch-06', title:'Ch.6 生物多樣性', chapter:6, wordCount:2000, gri:['GRI-304'], chart:'radar',
    ph:['{{company_name}}','{{report_year}}','{{tree_planting}}'],
    content: () => `<h2>Ch.6 生物多樣性與生態保護</h2>
<h3>6.1 生物多樣性政策</h3>
<p>{{company_name}} 承諾營運活動不會對生物多樣性造成重大負面影響。{{report_year}} 年造林 {{tree_planting}} 棵。</p>
${SVG.radiar('生物多樣性影響評估', ['棲地保護','物種復育','造林','水域生態','社區教育'], [{label:'{{report_year}}',values:[85,78,92,75,80],color:'#003262'}])}
${table(['指標','{{report_year}}','前年','目標'],[['造林棵數','50,000','40,000','持續增加'],['復育面積','10公頃','8公頃','持續增加'],['生態教育','24場','20場','≥24場']])}
<h3>6.2 TNFD 揭露</h3>
<p>本公司已開始依 TNFD 框架進行自然相關財務揭露評估。</p>`},

  { id:'ch-07', title:'Ch.7 員工福祉', chapter:7, wordCount:2000, gri:['GRI-401','GRI-404'], chart:'line',
    ph:['{{company_name}}','{{report_year}}','{{employee_count}}','{{turnover_rate}}'],
    content: () => `<h2>Ch.7 員工福祉與人力資本</h2>
<h3>7.1 人力概況</h3>
<p>{{company_name}} {{report_year}} 年全球員工 {{employee_count}} 人，女性佔 42%，離職率 {{turnover_rate}}%。</p>
${SVG.line('人力趨勢', ['2021','2022','2023','2024','2025'], [{label:'員工數',values:[4800,4950,5100,5200,5280],color:'#003262'},{label:'離職率(%)',values:[12,11,10,9,8.5],color:'#EF4444'}])}
${table(['指標','{{report_year}}','前年','目標'],[['員工數','5,280','5,200','穩定'],['女性比例','42%','40%','≥45%'],['離職率','8.5%','9.5%','<10%'],['訓練時數','45','40','≥40']])}
<h3>7.2 薪酬福利</h3>
<p>本公司提供具競爭力的薪酬，{{report_year}} 年薪酬比率 1.05（女性/男性），接近平等。</p>`},

  { id:'ch-08', title:'Ch.8 多元平等與包容', chapter:8, wordCount:2000, gri:['GRI-405','GRI-406'], chart:'bar',
    ph:['{{company_name}}','{{report_year}}','{{female_manager_ratio}}'],
    content: () => `<h2>Ch.8 多元平等與包容</h2>
<h3>8.1 DEI 指標</h3>
<p>{{company_name}} {{report_year}} 年女性主管比例 {{female_manager_ratio}}%，身心障礙就業 2.5%。</p>
${SVG.bar('DEI 指標(%)', ['女性主管','女性董事','身心障礙','原住民','LGBTQ+友善'], [35,33,2.5,1.5,90])}
${table(['指標','{{report_year}}','前年','目標'],[['女性主管','35%','33%','≥40%'],['女性董事','33%','33%','≥33%'],['身心障礙','2.5%','2.0%','≥2.5%'],['性平政策','✅','✅','✅']])}
<h3>8.2 DEI 措施</h3>
<p>無意識偏見訓練、女性領導力培育、原住民就業促進、LGBTQ+ 友善政策。</p>`},

  { id:'ch-09', title:'Ch.9 職業安全衛生', chapter:9, wordCount:2000, gri:['GRI-403'], chart:'line',
    ph:['{{company_name}}','{{report_year}}','{{ltir}}'],
    content: () => `<h2>Ch.9 職業安全衛生</h2>
<h3>9.1 安全績效</h3>
<p>{{company_name}} {{report_year}} 年 LTIR（工時傷害率）{{ltir}}，無重大職災。</p>
${SVG.line('安全指標趨勢', ['2021','2022','2023','2024','2025'], [{label:'LTIR',values:[1.5,1.3,1.1,0.9,0.8],color:'#EF4444'},{label:'安全訓練(小時)',values:[12000,13000,14000,15000,16000],color:'#10B981'}])}
${table(['指標','{{report_year}}','前年','目標'],[['LTIR','0.8','0.9','<1.0'],['死亡事故','0','0','0'],['安全訓練','16,000','15,000','≥15,000'],['演練','12','10','≥12']])}
<h3>9.2 健康管理</h3>
<p>員工健康檢查、心理諮商、促進方案。{{report_year}} 年健康檢查率 98%。</p>`},

  { id:'ch-10', title:'Ch.10 人權與供應鏈', chapter:10, wordCount:2000, gri:['GRI-409','GRI-414'], chart:'radar',
    ph:['{{company_name}}','{{report_year}}','{{supplier_audits}}'],
    content: () => `<h2>Ch.10 人權與供應鏈盡職調查</h2>
<h3>10.1 人權風險</h3>
<p>{{company_name}} 依據 UNGPs 進行人權盡職調查，{{report_year}} 年稽核 {{supplier_audits}} 家供應商。</p>
${SVG.radar('人權風險評估', ['強迫勞動','童工','歧視','安全','環保'], [{label:'風險控制',values:[92,95,88,90,85],color:'#003262'}])}
${table(['指標','{{report_year}}','前年','目標'],[['供應商稽核','120','100','≥120'],['合格率','96%','94%','≥95%'],['改善完成率','92%','88%','≥90%'],['人權訓練','100%','98%','100%']])}
<h3>10.2 現代奴役</h3>
<p>本公司制定反現代奴役政策，{{report_year}} 年零現代奴役事件。</p>`},

  { id:'ch-11', title:'Ch.11 社區發展', chapter:11, wordCount:2000, gri:['GRI-413','GRI-203'], chart:'bar',
    ph:['{{company_name}}','{{report_year}}','{{community_investment}}'],
    content: () => `<h2>Ch.11 社區發展與社會貢獻</h2>
<h3>11.1 社區投資</h3>
<p>{{company_name}} {{report_year}} 年社區投資 {{community_investment}} 萬元，受益 50,000 人。</p>
${SVG.bar('社區投資(萬元)', ['教育','醫療','環保','文化','急難'], [800,600,500,300,300])}
${table(['指標','{{report_year}}','前年','目標'],[['投資金額','2,500','2,200','持續增加'],['志工時數','12,000','10,000','≥12,000'],['受益人數','50,000','45,000','持續增加'],['SROI','3.5:1','3.2:1','≥3.5']])}
<h3>11.2 企業志工</h3>
<p>參與率 35%，環保、教育、社區、專業四大類志工活動。</p>`},

  { id:'ch-12', title:'Ch.12 客戶關係與產品責任', chapter:12, wordCount:2000, gri:['GRI-416','GRI-418'], chart:'line',
    ph:['{{company_name}}','{{report_year}}','{{customer_satisfaction}}','{{nps}}'],
    content: () => `<h2>Ch.12 客戶關係與產品責任</h2>
<h3>12.1 客戶滿意度</h3>
<p>{{company_name}} {{report_year}} 年客戶滿意度 {{customer_satisfaction}}%，NPS {{nps}} 分。</p>
${SVG.line('客戶體驗趨勢', ['2021','2022','2023','2024','2025'], [{label:'滿意度(%)',values:[88,89,90,91,92],color:'#003262'},{label:'NPS',values:[45,48,50,52,55],color:'#FDB515'}])}
${table(['指標','{{report_year}}','前年','目標'],[['客戶滿意度','92%','90%','≥90%'],['NPS','55','50','≥55'],['退貨率','0.5%','0.8%','<1%'],['產品召回','0','0','0']])}
<h3>12.2 產品安全</h3>
<p>ISO 9001 品質管理，{{report_year}} 年零產品安全事件。</p>`},

  { id:'ch-13', title:'Ch.13 資訊安全與隱私', chapter:13, wordCount:2000, gri:['GRI-418'], chart:'line',
    ph:['{{company_name}}','{{report_year}}','{{security_investments}}','{{incident_count}}'],
    content: () => `<h2>Ch.13 資訊安全與隱私保護</h2>
<h3>13.1 資安投資</h3>
<p>{{company_name}} {{report_year}} 年資安投資 {{security_investments}} 萬元，事件數 {{incident_count}} 件。</p>
${SVG.line('資安趨勢', ['2021','2022','2023','2024','2025'], [{label:'投資(萬)',values:[280,300,320,350,380],color:'#003262'},{label:'事件數',values:[5,4,3,2,0],color:'#EF4444'}])}
${table(['指標','{{report_year}}','前年','目標'],[['資安投資','380萬','350萬','持續增加'],['安全事件','0','2','0'],['ISO 27001','✅','✅','✅'],['訓練率','100%','100%','100%']])}
<h3>13.2 隱私保護</h3>
<p>GDPR + 個資法遵循，{{report_year}} 年零隱私洩露事件。</p>`},

  { id:'ch-14', title:'Ch.14 誠信經營與反貪腐', chapter:14, wordCount:2000, gri:['GRI-205','GRI-206'], chart:'radar',
    ph:['{{company_name}}','{{report_year}}','{{ethics_training}}','{{violations}}'],
    content: () => `<h2>Ch.14 誠信經營與反貪腐</h2>
<h3>14.1 反貪腐</h3>
<p>{{company_name}} {{report_year}} 年倫理訓練 {{ethics_training}}%，違規事件 {{violations}} 件。</p>
${SVG.radar('倫理風險評估', ['貪腐','洗錢','壟斷','內線','利益衝突'], [{label:'風險控制',values:[95,92,88,90,93],color:'#003262'}])}
${table(['措施','{{report_year}}','目標'],[['倫理訓練','100%','100%'],['守則簽署','100%','100%'],['舉報處理','100%','100%'],['利益衝突','100%','100%']])}
<h3>14.2 政治捐獻</h3>
<p>{{report_year}} 年政治捐獻 0 萬元，完全透明。</p>`},

  { id:'ch-15', title:'Ch.15 風險管理與機會', chapter:15, wordCount:2000, gri:['GRI-201','TCFD'], chart:'radar',
    ph:['{{company_name}}','{{report_year}}','{{risk_count}}'],
    content: () => `<h2>Ch.15 風險管理與機會</h2>
<h3>15.1 ERM 框架</h3>
<p>{{company_name}} {{report_year}} 年識別 {{risk_count}} 項關鍵風險。</p>
${SVG.radar('風險評估', ['策略','營運','財務','合規','ESG'], [{label:'{{report_year}}',values:[75,68,82,90,72],color:'#003262'}])}
${table(['風險','可能性','影響','因應'],[['氣候變遷','高','高','SBTi'],['網路攻擊','中','高','ISO27001'],['供應鏈','中','中','多元供應商'],['法規','中','中','法規監控']])}
<h3>15.2 永續機會</h3>
<table><tr><th>機會</th><th>投資</th><th>回報</th></tr>
<tr><td>綠色產品</td><td>5,000萬</td><td>3年</td></tr>
<tr><td>ESG融資</td><td>5,000萬</td><td>0.5%</td></tr>
<tr><td>碳權</td><td>800萬</td><td>200萬/年</td></tr></table>`
];

console.log(`Generated ${sections.length} sections (ch-01 to ch-15)`);
console.log('Each section includes SVG charts and data tables');
