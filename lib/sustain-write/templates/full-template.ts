import type { ReportTemplate, TemplateSection } from './types';

const SECTIONS: TemplateSection[] = [
  // ─── Ch.01 永續治理與策略 ───
  {
    id: 'ch-01',
    title: '永續治理與策略',
    chapter: 1,
    wordCount: 2000,
    griAlignment: ['GRI 2-9', 'GRI 2-10', 'GRI 2-11', 'GRI 2-12', 'GRI 2-13', 'GRI 2-14', 'TCFD-G'],
    hasChart: true,
    chartType: 'bar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{board_size}}', '{{independent_directors}}', '{{chairman_name}}', '{{sustainability_committee}}', '{{esg_strategy}}'],
    content: `
<h2>第一章 永續治理與策略</h2>
<p>{{company_name}} 秉持「誠信經營、永續發展」之核心理念，將環境（E）、社會（S）與治理（G）三大面向全面融入企業營運策略之中。本公司董事會為永續治理之最高監督單位，下設永續發展委員會，由董事長親自擔任主任委員，定期向董事會報告執行成效。</p>

<p>在治理架構方面，本公司已建立完善的永續治理組織體系，包含永續發展委員會、風險管理委員會、薪酬委員會及審計委員會，各委員會依其職掌運作，確保企業永續策略之有效落實。董事會每季聽取永續發展委員會之執行報告，並針對重大議題進行審議與決策。</p>

<p>本公司之永續策略聚焦於五大主軸：一、深化氣候行動與淨零轉型；二、強化人力資本與員工福祉；三、推動供應鏈永續管理；四、落實社區參與及社會貢獻；五、提升資訊透明度與治理品質。透過此五大主軸之推動，本公司期望在創造經濟價值的同時，亦能為環境與社會帶來正面影響。</p>

<h3>1.1 董事會組成與效能</h3>
<p>本公司董事會由 {{board_size}} 位董事組成，其中獨立董事 {{independent_directors}} 位，獨立董事比例達 {{independent_ratio}}%。董事會成員具備多元之專業背景，涵蓋財務、法律、科技、環境永續等領域，確保決策之全面性與專業性。</p>

<h3>1.2 董事會效能評估</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">董事會效能評估指標</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Board Effectiveness Assessment</text>
  <!-- Y axis -->
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <!-- X axis -->
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Grid lines -->
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <!-- Y labels -->
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">25</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">50</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">75</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">100</text>
  <!-- Bars -->
  <rect x="80" y="95" width="50" height="155" fill="#3b82f6" rx="3"/>
  <rect x="150" y="80" width="50" height="170" fill="#10b981" rx="3"/>
  <rect x="220" y="70" width="50" height="180" fill="#f59e0b" rx="3"/>
  <rect x="290" y="85" width="50" height="165" fill="#8b5cf6" rx="3"/>
  <rect x="360" y="65" width="50" height="185" fill="#ef4444" rx="3"/>
  <rect x="420" y="90" width="50" height="160" fill="#06b6d4" rx="3"/>
  <!-- Bar labels -->
  <text x="105" y="265" text-anchor="middle" font-size="8" fill="#475569">出席率</text>
  <text x="175" y="265" text-anchor="middle" font-size="8" fill="#475569">專業性</text>
  <text x="245" y="265" text-anchor="middle" font-size="8" fill="#475569">多元性</text>
  <text x="315" y="265" text-anchor="middle" font-size="8" fill="#475569">獨立性</text>
  <text x="385" y="265" text-anchor="middle" font-size="8" fill="#475569">ESG認知</text>
  <text x="445" y="265" text-anchor="middle" font-size="8" fill="#475569">監督力</text>
  <!-- Value labels -->
  <text x="105" y="88" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">78%</text>
  <text x="175" y="73" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">85%</text>
  <text x="245" y="63" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">90%</text>
  <text x="315" y="78" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">83%</text>
  <text x="385" y="58" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">93%</text>
  <text x="445" y="83" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">80%</text>
</svg>
</div>

<h3>1.3 永續治理關鍵績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>董事會出席率</td><td>96.5%</td><td>94.2%</td><td>95.0%</td><td>101.6%</td></tr>
    <tr><td>獨立董事比例</td><td>45.5%</td><td>42.9%</td><td>40.0%</td><td>113.8%</td></tr>
    <tr><td>女性董事比例</td><td>27.3%</td><td>18.2%</td><td>25.0%</td><td>109.2%</td></tr>
    <tr><td>董事會評鑑完成率</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td></tr>
    <tr><td>永續議題董事訓練時數</td><td>12.5 hrs</td><td>10.2 hrs</td><td>12.0 hrs</td><td>104.2%</td></tr>
    <tr><td>ESG相關委員會會議次數</td><td>8次</td><td>6次</td><td>8次</td><td>100%</td></tr>
  </tbody>
</table>

<h3>1.4 永續發展策略藍圖</h3>
<p>本公司以「{{esg_strategy}}」為核心願景，制定短、中、長期永續發展目標。短期目標（{{report_year}}）聚焦於完善治理架構與資訊揭露；中期目標（{{mid_term_year}}）著重於價值鏈碳減排與循環經濟推動；長期目標（{{long_term_year}}）則致力於達成淨零排放與全面永續轉型。</p>

<p>為確保策略之有效執行，本公司將永續績效納入高階主管薪酬指標，佔比達 {{esg_pay_ratio}}%，以強化管理階層對永續發展之承諾與責任。同時，本公司亦積極參與國際永續倡議，包括聯合國全球盟約（UNGC）、科學基礎減量目標倡議（SBTi）等，展現與國際標準接軌之決心。</p>
`
  },

  // ─── Ch.02 氣候變遷與碳管理 ───
  {
    id: 'ch-02',
    title: '氣候變遷與碳管理',
    chapter: 2,
    wordCount: 2000,
    griAlignment: ['GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4', 'GRI 305-5', 'TCFD-M', 'TCFD-S'],
    hasChart: true,
    chartType: 'bar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{scope1_emissions}}', '{{scope2_emissions}}', '{{scope3_emissions}}', '{{carbon_reduction_target}}', '{{net_zero_year}}'],
    content: `
<h2>第二章 氣候變遷與碳管理</h2>
<p>{{company_name}} 深刻認知氣候變遷對企業營運與全球環境之深遠影響，積極響應《巴黎協定》之全球升溫控制目標，承諾於 {{net_zero_year}} 年前達成淨零排放。本公司依據 TCFD 架構進行氣候相關財務揭露，從治理、策略、風險管理、指標與目標四大面向，全面管理氣候相關風險與機會。</p>

<p>在碳管理方面，本公司已完成溫室氣體盤查，涵蓋範疇一（直接排放）、範疇二（間接能源排放）及範疇三（價值鏈排放），並通過第三方查證機構之 ISO 14064-1 溫室氣體盤查認證。透過完整之碳盤查基礎，本公司得以制定科學基礎減量目標（SBTi），確保減碳路徑與全球氣候目標一致。</p>

<h3>2.1 溫室氣體排放概況</h3>
<p>本公司 {{report_year}} 年度之溫室氣體總排放量為 {{total_emissions}} 噸 CO2e，其中範疇一排放量為 {{scope1_emissions}} 噸 CO2e，範疇二排放量為 {{scope2_emissions}} 噸 CO2e，範疇三排放量為 {{scope3_emissions}} 噸 CO2e。與基準年相比，碳排放強度已降低 {{intensity_reduction}}%。</p>

<h3>2.2 各範疇碳排放分析</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">溫室氣體排放（噸 CO2e）</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">GHG Emissions by Scope</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">50K</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">100K</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">150K</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">200K</text>
  <!-- Scope 1 -->
  <rect x="90" y="175" width="70" height="75" fill="#ef4444" rx="3"/>
  <text x="125" y="168" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">40K</text>
  <text x="125" y="268" text-anchor="middle" font-size="9" fill="#475569">範疇一</text>
  <!-- Scope 2 -->
  <rect x="200" y="125" width="70" height="125" fill="#f59e0b" rx="3"/>
  <text x="235" y="118" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">75K</text>
  <text x="235" y="268" text-anchor="middle" font-size="9" fill="#475569">範疇二</text>
  <!-- Scope 3 -->
  <rect x="310" y="75" width="70" height="175" fill="#3b82f6" rx="3"/>
  <text x="345" y="68" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">105K</text>
  <text x="345" y="268" text-anchor="middle" font-size="9" fill="#475569">範疇三</text>
  <!-- Total -->
  <rect x="410" y="100" width="55" height="150" fill="#10b981" rx="3" opacity="0.8"/>
  <text x="437" y="93" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">220K</text>
  <text x="437" y="268" text-anchor="middle" font-size="9" fill="#475569">總量</text>
</svg>
</div>

<h3>2.3 碳排放管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>範疇一排放（噸CO2e）</td><td>{{scope1_emissions}}</td><td>{{scope1_prev}}</td><td>{{scope1_target}}</td><td>{{scope1_rate}}</td></tr>
    <tr><td>範疇二排放（噸CO2e）</td><td>{{scope2_emissions}}</td><td>{{scope2_prev}}</td><td>{{scope2_target}}</td><td>{{scope2_rate}}</td></tr>
    <tr><td>範疇三排放（噸CO2e）</td><td>{{scope3_emissions}}</td><td>{{scope3_prev}}</td><td>{{scope3_target}}</td><td>{{scope3_rate}}</td></tr>
    <tr><td>碳排放強度（噸CO2e/營收億元）</td><td>{{carbon_intensity}}</td><td>{{carbon_intensity_prev}}</td><td>{{carbon_intensity_target}}</td><td>{{carbon_intensity_rate}}</td></tr>
    <tr><td>再生能源使用比例</td><td>{{renewable_ratio}}%</td><td>{{renewable_ratio_prev}}%</td><td>{{renewable_ratio_target}}%</td><td>{{renewable_ratio_rate}}</td></tr>
  </tbody>
</table>

<h3>2.4 氣候風險與機會管理</h3>
<p>本公司依據 TCFD 建議，進行情境分析與壓力測試，評估不同升溫情境（1.5°C、2°C、3°C）對企業營運之潛在影響。在轉型風險方面，本公司關注碳定價政策、技術轉型需求及市場偏好變化；在實體風險方面，則評估極端氣候事件對供應鏈、設施及營運之衝擊。</p>

<p>為把握氣候相關機會，本公司積極投入低碳技術研發、綠色產品開發及再生能源投資，預計 {{report_year}} 年度綠色營收佔比將達 {{green_revenue_ratio}}%。同時，本公司已設定 {{carbon_reduction_target}} 之中期減碳目標，並向 SBTi 提交承諾，展現淨零轉型之決心與行動力。</p>
`
  },

  // ─── Ch.03 能源管理 ───
  {
    id: 'ch-03',
    title: '能源管理',
    chapter: 3,
    wordCount: 2000,
    griAlignment: ['GRI 302-1', 'GRI 302-2', 'GRI 302-3', 'GRI 302-4', 'GRI 302-5', 'SASB IF-EU-140a.1'],
    hasChart: true,
    chartType: 'pie',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{total_energy}}', '{{renewable_energy}}', '{{energy_intensity}}', '{{energy_reduction}}'],
    content: `
<h2>第三章 能源管理</h2>
<p>{{company_name}} 將能源管理視為企業永續發展之核心議題之一，積極推動能源效率提升與再生能源轉型。本公司依據 ISO 50001 能源管理系統標準，建立完整之能源管理制度，涵蓋能源監測、目標設定、執行改善及績效評估等環節，確保能源使用效率之持續提升。</p>

<p>在能源結構方面，本公司持續提高再生能源使用比例，透過自建太陽能發電系統、簽訂再生能源購電契約（PPA）及購買再生能源憑證（REC）等多元方式，逐步降低對化石燃料之依賴。{{report_year}} 年度再生能源使用比例已達 {{renewable_ratio}}%，較前年提升 {{renewable_increase}} 個百分點。</p>

<h3>3.1 能源使用概況</h3>
<p>本公司 {{report_year}} 年度總能源消耗量為 {{total_energy}} 千兆焦耳（GJ），能源密集度為 {{energy_intensity}} GJ/營收億元。與基準年相比，能源密集度已降低 {{energy_reduction}}%，顯示能源效率改善措施之具體成效。</p>

<h3>3.2 能源結構分析</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">能源結構分佈</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Energy Mix Distribution</text>
  <!-- Pie chart centered at (200, 160) radius 90 -->
  <!-- Grid/市電 45% = 162 degrees -->
  <path d="M 200,160 L 200,70 A 90,90 0 0,1 278.1,226.3 Z" fill="#64748b" opacity="0.9"/>
  <!-- 太陽能 25% = 90 degrees -->
  <path d="M 200,160 L 278.1,226.3 A 90,90 0 0,1 200,250 Z" fill="#f59e0b" opacity="0.9"/>
  <!-- 風能 15% = 54 degrees -->
  <path d="M 200,160 L 200,250 A 90,90 0 0,1 147.3,226.3 Z" fill="#3b82f6" opacity="0.9"/>
  <!-- 天然氣 10% = 36 degrees -->
  <path d="M 200,160 L 147.3,226.3 A 90,90 0 0,1 123.8,187.3 Z" fill="#10b981" opacity="0.9"/>
  <!-- 其他 5% = 18 degrees -->
  <path d="M 200,160 L 123.8,187.3 A 90,90 0 0,1 200,70 Z" fill="#8b5cf6" opacity="0.9"/>
  <!-- Legend on right side -->
  <rect x="330" y="70" width="14" height="14" fill="#64748b" rx="2"/>
  <text x="350" y="81" font-size="11" fill="#1e293b">市電（電網）45%</text>
  <rect x="330" y="100" width="14" height="14" fill="#f59e0b" rx="2"/>
  <text x="350" y="111" font-size="11" fill="#1e293b">太陽能 25%</text>
  <rect x="330" y="130" width="14" height="14" fill="#3b82f6" rx="2"/>
  <text x="350" y="141" font-size="11" fill="#1e293b">風能 15%</text>
  <rect x="330" y="160" width="14" height="14" fill="#10b981" rx="2"/>
  <text x="350" y="171" font-size="11" fill="#1e293b">天然氣 10%</text>
  <rect x="330" y="190" width="14" height="14" fill="#8b5cf6" rx="2"/>
  <text x="350" y="201" font-size="11" fill="#1e293b">其他再生能源 5%</text>
  <!-- Center label -->
  <text x="200" y="155" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">總量</text>
  <text x="200" y="172" text-anchor="middle" font-size="10" fill="#475569">{{total_energy}} GJ</text>
</svg>
</div>

<h3>3.3 能源管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>總能源消耗（GJ）</td><td>{{total_energy}}</td><td>{{total_energy_prev}}</td><td>{{total_energy_target}}</td><td>{{total_energy_rate}}</td></tr>
    <tr><td>能源密集度（GJ/營收億元）</td><td>{{energy_intensity}}</td><td>{{energy_intensity_prev}}</td><td>{{energy_intensity_target}}</td><td>{{energy_intensity_rate}}</td></tr>
    <tr><td>再生能源比例</td><td>{{renewable_ratio}}%</td><td>{{renewable_ratio_prev}}%</td><td>{{renewable_ratio_target}}%</td><td>{{renewable_ratio_rate}}</td></tr>
    <tr><td>節電量（萬度）</td><td>{{electricity_saved}}</td><td>{{electricity_saved_prev}}</td><td>{{electricity_saved_target}}</td><td>{{electricity_saved_rate}}</td></tr>
    <tr><td>ISO 50001認證廠區數</td><td>{{iso50001_sites}}</td><td>{{iso50001_sites_prev}}</td><td>{{iso50001_sites_target}}</td><td>{{iso50001_sites_rate}}</td></tr>
  </tbody>
</table>

<h3>3.4 節能改善措施</h3>
<p>本公司持續推動各項節能改善措施，包括：一、更換高效率 LED 照明系統，節電率達 60% 以上；二、導入智慧能源管理系統，即時監測各廠區能源使用狀況；三、優化空調系統運轉效率，採用變頻技術降低能耗；四、推動餘熱回收計畫，將製程廢熱轉化為可用能源。{{report_year}} 年度共執行 {{energy_projects}} 項節能專案，累計節電 {{total_savings}} 萬度，相當於減少 {{co2_avoided}} 噸 CO2e 排放。</p>
`
  },

  // ─── Ch.04 水資源管理 ───
  {
    id: 'ch-04',
    title: '水資源管理',
    chapter: 4,
    wordCount: 2000,
    griAlignment: ['GRI 303-1', 'GRI 303-2', 'GRI 303-3', 'GRI 303-4', 'GRI 303-5', 'SASB IF-EU-140a.2'],
    hasChart: true,
    chartType: 'line',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{water_withdrawal}}', '{{water_recycled}}', '{{water_intensity}}', '{{water_stress_area}}'],
    content: `
<h2>第四章 水資源管理</h2>
<p>{{company_name}} 深知水資源為地球珍貴之有限資源，尤其在氣候變遷加劇之背景下，水資源管理已成為企業永續經營之關鍵議題。本公司依據 AWS（Alliance for Water Stewardship）國際水資源管理標準，建立完整之水資源管理制度，從用水監測、節水改善、回收再利用到水資源風險評估，全面管理水資源相關議題。</p>

<p>本公司主要用水來源為 {{water_source}}，{{report_year}} 年度總取水量為 {{water_withdrawal}} 立方公尺，用水密集度為 {{water_intensity}} 立方公尺/營收億元。在水資源壓力區域方面，本公司位於 {{water_stress_area}} 之廠區已實施強化水資源管理措施，包括提高回收率、減少取水量及開發替代水源等。</p>

<h3>4.1 水資源使用趨勢</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">水資源使用趨勢（萬立方公尺）</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Water Usage Trend</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">20</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">40</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">60</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">80</text>
  <!-- X labels -->
  <text x="90" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-3</text>
  <text x="170" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-2</text>
  <text x="250" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-1</text>
  <text x="330" y="268" text-anchor="middle" font-size="9" fill="#475569">{{report_year}}</text>
  <text x="410" y="268" text-anchor="middle" font-size="9" fill="#475569">目標</text>
  <!-- Withdrawal line (blue) -->
  <polyline points="90,100 170,115 250,130 330,145 410,140" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <circle cx="90" cy="100" r="4" fill="#3b82f6"/>
  <circle cx="170" cy="115" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="130" r="4" fill="#3b82f6"/>
  <circle cx="330" cy="145" r="4" fill="#3b82f6"/>
  <circle cx="410" cy="140" r="4" fill="#3b82f6" stroke="#3b82f6" stroke-width="1" fill-opacity="0.3"/>
  <!-- Recycled line (green) -->
  <polyline points="90,200 170,185 250,170 330,150 410,130" fill="none" stroke="#10b981" stroke-width="2.5"/>
  <circle cx="90" cy="200" r="4" fill="#10b981"/>
  <circle cx="170" cy="185" r="4" fill="#10b981"/>
  <circle cx="250" cy="170" r="4" fill="#10b981"/>
  <circle cx="330" cy="150" r="4" fill="#10b981"/>
  <circle cx="410" cy="130" r="4" fill="#10b981" stroke="#10b981" stroke-width="1" fill-opacity="0.3"/>
  <!-- Legend -->
  <line x1="130" y1="65" x2="155" y2="65" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="160" y="69" font-size="10" fill="#1e293b">總取水量</text>
  <line x1="250" y1="65" x2="275" y2="65" stroke="#10b981" stroke-width="2.5"/>
  <text x="280" y="69" font-size="10" fill="#1e293b">回收水量</text>
</svg>
</div>

<h3>4.2 水資源管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>總取水量（萬立方公尺）</td><td>{{water_withdrawal}}</td><td>{{water_withdrawal_prev}}</td><td>{{water_withdrawal_target}}</td><td>{{water_withdrawal_rate}}</td></tr>
    <tr><td>用水密集度（立方公尺/營收億元）</td><td>{{water_intensity}}</td><td>{{water_intensity_prev}}</td><td>{{water_intensity_target}}</td><td>{{water_intensity_rate}}</td></tr>
    <tr><td>水回收率</td><td>{{water_recycle_rate}}%</td><td>{{water_recycle_rate_prev}}%</td><td>{{water_recycle_rate_target}}%</td><td>{{water_recycle_rate_achieve}}</td></tr>
    <tr><td>廢水排放達標率</td><td>{{wastewater_compliance}}%</td><td>{{wastewater_compliance_prev}}%</td><td>100%</td><td>{{wastewater_compliance_rate}}</td></tr>
    <tr><td>水資源壓力區域廠區數</td><td>{{water_stress_sites}}</td><td>{{water_stress_sites_prev}}</td><td>{{water_stress_sites_target}}</td><td>{{water_stress_sites_rate}}</td></tr>
  </tbody>
</table>

<h3>4.3 水資源風險與因應</h3>
<p>本公司運用 WRI Aqueduct 水風險評估工具，評估各廠區所面臨之水資源風險等級。評估結果顯示，位於 {{water_stress_area}} 之廠區面臨高度至極高之水資源壓力，本公司已針對該等廠區制定強化管理計畫，包括提高水回收率至 {{recycle_target}}% 以上、導入雨水回收系統、開發再生水替代來源等。此外，本公司亦與當地社區及利害關係人合作，共同維護流域水資源之永續利用。</p>
`
  },

  // ─── Ch.05 廢棄物與循環經濟 ───
  {
    id: 'ch-05',
    title: '廢棄物與循環經濟',
    chapter: 5,
    wordCount: 2000,
    griAlignment: ['GRI 306-1', 'GRI 306-2', 'GRI 306-3', 'GRI 306-4', 'GRI 306-5', 'SASB IF-EU-510a.1'],
    hasChart: true,
    chartType: 'bar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{total_waste}}', '{{hazardous_waste}}', '{{recycling_rate}}', '{{zero_waste_target}}'],
    content: `
<h2>第五章 廢棄物與循環經濟</h2>
<p>{{company_name}} 秉持「源頭減量、循環再利用」之廢棄物管理原則，積極推動循環經濟模式，將傳統「線性經濟」轉型為「循環經濟」，最大化資源使用效率並最小化廢棄物產生。本公司已設定 {{zero_waste_target}} 年達成零廢棄填埋之中長期目標，並透過製程改善、材料替代及回收再利用等多元策略，持續降低廢棄物對環境之衝擊。</p>

<p>在廢棄物管理方面，本公司依據「減量（Reduce）、再利用（Reuse）、回收（Recover）、再生（Recycle）」之 4R 原則，建立完整之廢棄物管理體系。所有廢棄物均依其特性進行分類、貯存、清除及處理，並委託合格之廢棄物清除處理機構進行後續處置，確保廢棄物管理符合相關法規要求。</p>

<h3>5.1 廢棄物產出概況</h3>
<p>本公司 {{report_year}} 年度總廢棄物產出量為 {{total_waste}} 噸，其中一般廢棄物 {{general_waste}} 噸，有害廢棄物 {{hazardous_waste}} 噸。廢棄物回收再利用率達 {{recycling_rate}}%，較前年提升 {{recycling_increase}} 個百分點。</p>

<h3>5.2 廢棄物減量成效</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">廢棄物處理方式分佈（噸）</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Waste Treatment Distribution</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">200</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">400</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">600</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">800</text>
  <!-- Year Y-1 -->
  <rect x="80" y="170" width="40" height="80" fill="#10b981" rx="2"/>
  <rect x="125" y="190" width="40" height="60" fill="#3b82f6" rx="2"/>
  <rect x="170" y="210" width="40" height="40" fill="#f59e0b" rx="2"/>
  <rect x="215" y="230" width="40" height="20" fill="#ef4444" rx="2"/>
  <!-- Year {{report_year}} -->
  <rect x="275" y="130" width="40" height="120" fill="#10b981" rx="2"/>
  <rect x="320" y="170" width="40" height="80" fill="#3b82f6" rx="2"/>
  <rect x="365" y="200" width="40" height="50" fill="#f59e0b" rx="2"/>
  <rect x="410" y="235" width="40" height="15" fill="#ef4444" rx="2"/>
  <!-- Labels -->
  <text x="165" y="268" text-anchor="middle" font-size="9" fill="#475569">前年</text>
  <text x="360" y="268" text-anchor="middle" font-size="9" fill="#475569">{{report_year}}</text>
  <!-- Legend -->
  <rect x="70" y="65" width="12" height="12" fill="#10b981" rx="2"/>
  <text x="88" y="75" font-size="9" fill="#1e293b">回收再利用</text>
  <rect x="170" y="65" width="12" height="12" fill="#3b82f6" rx="2"/>
  <text x="188" y="75" font-size="9" fill="#1e293b">物理處理</text>
  <rect x="270" y="65" width="12" height="12" fill="#f59e0b" rx="2"/>
  <text x="288" y="75" font-size="9" fill="#1e293b">焚化</text>
  <rect x="350" y="65" width="12" height="12" fill="#ef4444" rx="2"/>
  <text x="368" y="75" font-size="9" fill="#1e293b">填埋</text>
</svg>
</div>

<h3>5.3 廢棄物管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>總廢棄物量（噸）</td><td>{{total_waste}}</td><td>{{total_waste_prev}}</td><td>{{total_waste_target}}</td><td>{{total_waste_rate}}</td></tr>
    <tr><td>有害廢棄物（噸）</td><td>{{hazardous_waste}}</td><td>{{hazardous_waste_prev}}</td><td>{{hazardous_waste_target}}</td><td>{{hazardous_waste_rate}}</td></tr>
    <tr><td>回收再利用率</td><td>{{recycling_rate}}%</td><td>{{recycling_rate_prev}}%</td><td>{{recycling_rate_target}}%</td><td>{{recycling_rate_achieve}}</td></tr>
    <tr><td>廢棄物密集度（噸/營收億元）</td><td>{{waste_intensity}}</td><td>{{waste_intensity_prev}}</td><td>{{waste_intensity_target}}</td><td>{{waste_intensity_rate}}</td></tr>
    <tr><td>零廢棄填埋達成率</td><td>{{zero_landfill_rate}}%</td><td>{{zero_landfill_rate_prev}}%</td><td>{{zero_landfill_target}}%</td><td>{{zero_landfill_achieve}}</td></tr>
  </tbody>
</table>

<h3>5.4 循環經濟推動</h3>
<p>本公司積極推動循環經濟，從產品設計階段即導入「為循環而設計（Design for Circularity）」之理念，採用易拆解、易回收之材料，延長產品生命週期。{{report_year}} 年度共推動 {{circular_projects}} 項循環經濟專案，包括：一、產品即服務（Product-as-a-Service）商業模式；二、副產物交換與工業共生計畫；三、包裝材料減量與再生材料使用；四、產品回收與再製造計畫。透過這些專案，本公司創造了 {{circular_revenue}} 億元之循環經濟效益。</p>
`
  },

  // ─── Ch.06 生物多樣性 ───
  {
    id: 'ch-06',
    title: '生物多樣性',
    chapter: 6,
    wordCount: 2000,
    griAlignment: ['GRI 304-1', 'GRI 304-2', 'GRI 304-3', 'GRI 304-4', 'GRI 304-5', 'TNFD'],
    hasChart: true,
    chartType: 'radar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{biodiversity_sites}}', '{{restoration_area}}', '{{species_protected}}', '{{tnfd_aligned}}'],
    content: `
<h2>第六章 生物多樣性</h2>
<p>{{company_name}} 認知生物多樣性為地球生態系統健康運作之基礎，企業營運對自然環境之影響不容忽視。本公司積極響應「昆明—蒙特婁全球生物多樣性框架」之目標，承諾對營運所在地之生物多樣性進行評估、保護與恢復。本公司已依據 TNFD（自然相關財務揭露工作小組）之建議架構，開始進行自然相關風險與機會之評估與揭露。</p>

<p>在生物多樣性管理方面，本公司採取「避免（Avoid）、最小化（Minimize）、恢復（Restore）、補償（Offset）」之緩解層級（Mitigation Hierarchy）原則，優先避免對生物多樣性造成負面影響，其次最小化不可避免之影響，再進行生態恢復，最後以生物多樣性補償措施彌補殘餘影響。</p>

<h3>6.1 生物多樣性影響評估</h3>
<p>本公司已完成所有營運據點之生物多樣性影響評估，識別出 {{biodiversity_sites}} 個位於或鄰近生物多樣性敏感區域之營運據點。針對該等據點，本公司已制定生物多樣性管理計畫，並定期監測生物多樣性指標之變化。</p>

<h3>6.2 生物多樣性影響面向</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">生物多樣性影響評估</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Biodiversity Impact Assessment</text>
  <!-- Radar center (250, 160), radius 90 -->
  <!-- Grid circles -->
  <circle cx="250" cy="160" r="18" fill="none" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="250" cy="160" r="36" fill="none" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="250" cy="160" r="54" fill="none" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="250" cy="160" r="72" fill="none" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="250" cy="160" r="90" fill="none" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Axes: 6 axes -->
  <line x1="250" y1="160" x2="250" y2="70" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="250" y1="160" x2="328" y2="115" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="250" y1="160" x2="328" y2="205" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="250" y1="160" x2="250" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="250" y1="160" x2="172" y2="205" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="250" y1="160" x2="172" y2="115" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Labels -->
  <text x="250" y="60" text-anchor="middle" font-size="9" fill="#475569">棲地保護</text>
  <text x="342" y="112" text-anchor="start" font-size="9" fill="#475569">物種多樣性</text>
  <text x="342" y="210" text-anchor="start" font-size="9" fill="#475569">水資源</text>
  <text x="250" y="265" text-anchor="middle" font-size="9" fill="#475569">土壤品質</text>
  <text x="158" y="210" text-anchor="end" font-size="9" fill="#475569">空氣品質</text>
  <text x="158" y="112" text-anchor="end" font-size="9" fill="#475569">生態恢復</text>
  <!-- Data polygon -->
  <polygon points="250,88 312,122 310,198 250,224 188,198 190,122" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
  <!-- Data points -->
  <circle cx="250" cy="88" r="4" fill="#3b82f6"/>
  <circle cx="312" cy="122" r="4" fill="#3b82f6"/>
  <circle cx="310" cy="198" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="224" r="4" fill="#3b82f6"/>
  <circle cx="188" cy="198" r="4" fill="#3b82f6"/>
  <circle cx="190" cy="122" r="4" fill="#3b82f6"/>
  <!-- Scale labels -->
  <text x="258" y="156" font-size="7" fill="#94a3b8">0</text>
  <text x="258" y="140" font-size="7" fill="#94a3b8">20</text>
  <text x="258" y="122" font-size="7" fill="#94a3b8">40</text>
  <text x="258" y="104" font-size="7" fill="#94a3b8">60</text>
  <text x="258" y="86" font-size="7" fill="#94a3b8">80</text>
</svg>
</div>

<h3>6.3 生物多樣性管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>生物多樣性敏感區域據點數</td><td>{{biodiversity_sites}}</td><td>{{biodiversity_sites_prev}}</td><td>{{biodiversity_sites_target}}</td><td>{{biodiversity_sites_rate}}</td></tr>
    <tr><td>生態恢復面積（公頃）</td><td>{{restoration_area}}</td><td>{{restoration_area_prev}}</td><td>{{restoration_area_target}}</td><td>{{restoration_area_rate}}</td></tr>
    <tr><td>受保護物種數</td><td>{{species_protected}}</td><td>{{species_protected_prev}}</td><td>{{species_protected_target}}</td><td>{{species_protected_rate}}</td></tr>
    <tr><td>生物多樣性管理計畫覆蓋率</td><td>{{bio_plan_coverage}}%</td><td>{{bio_plan_coverage_prev}}%</td><td>100%</td><td>{{bio_plan_coverage_rate}}</td></tr>
    <tr><td>TNFD對齊程度</td><td>{{tnfd_aligned}}%</td><td>{{tnfd_aligned_prev}}%</td><td>{{tnfd_aligned_target}}%</td><td>{{tnfd_aligned_rate}}</td></tr>
  </tbody>
</table>

<h3>6.4 自然為本解決方案</h3>
<p>本公司積極推動「自然為本解決方案（Nature-based Solutions, NbS）」，透過植樹造林、濕地恢復、生態廊道建置等措施，恢復並增強生態系統功能。{{report_year}} 年度共完成 {{nbs_projects}} 項 NbS 專案，累計植樹 {{trees_planted}} 棵，恢復生態面積 {{restoration_area}} 公頃。此外，本公司亦與 {{conservation_partners}} 個保育組織合作，共同推動生物多樣性保護工作。</p>
`
  },

  // ─── Ch.07 員工福祉與人力資本 ───
  {
    id: 'ch-07',
    title: '員工福祉與人力資本',
    chapter: 7,
    wordCount: 2000,
    griAlignment: ['GRI 401-1', 'GRI 401-2', 'GRI 401-3', 'GRI 402-1', 'GRI 403-6', 'SASB HN-AA-310a.1'],
    hasChart: true,
    chartType: 'line',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{total_employees}}', '{{turnover_rate}}', '{{training_hours}}', '{{wellness_budget}}'],
    content: `
<h2>第七章 員工福祉與人力資本</h2>
<p>{{company_name}} 視員工為企業最寶貴之資產，致力於打造一個安全、健康、多元且具成長性的工作環境。本公司依據國際勞工組織（ILO）核心公約及聯合國人權宣言之精神，制定完善之人力資源管理制度，涵蓋薪酬福利、職涯發展、健康促進及工作生活平衡等面向，確保每位員工均能獲得公平對待與充分發展之機會。</p>

<p>在人力資本發展方面，本公司持續投入員工培訓與發展資源，{{report_year}} 年度每人平均訓練時數為 {{training_hours}} 小時，訓練總費用達 {{training_budget}} 千元。本公司亦建立完整之職涯發展雙軌制度，提供管理職與專業職之多元升遷管道，協助員工實現個人職涯目標。</p>

<h3>7.1 人力結構與流動趨勢</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">員工結構與流動趨勢</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Headcount & Turnover Trend</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">2000</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">4000</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">6000</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">8000</text>
  <!-- X labels -->
  <text x="90" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-3</text>
  <text x="170" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-2</text>
  <text x="250" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-1</text>
  <text x="330" y="268" text-anchor="middle" font-size="9" fill="#475569">{{report_year}}</text>
  <text x="410" y="268" text-anchor="middle" font-size="9" fill="#475569">目標</text>
  <!-- Headcount line (blue) -->
  <polyline points="90,180 170,165 250,150 330,130 410,120" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <circle cx="90" cy="180" r="4" fill="#3b82f6"/>
  <circle cx="170" cy="165" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="150" r="4" fill="#3b82f6"/>
  <circle cx="330" cy="130" r="4" fill="#3b82f6"/>
  <circle cx="410" cy="120" r="4" fill="#3b82f6" stroke="#3b82f6" stroke-width="1" fill-opacity="0.3"/>
  <!-- Turnover line (red, secondary axis) -->
  <polyline points="90,220 170,210 250,200 330,190 410,180" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,3"/>
  <circle cx="90" cy="220" r="4" fill="#ef4444"/>
  <circle cx="170" cy="210" r="4" fill="#ef4444"/>
  <circle cx="250" cy="200" r="4" fill="#ef4444"/>
  <circle cx="330" cy="190" r="4" fill="#ef4444"/>
  <circle cx="410" cy="180" r="4" fill="#ef4444" stroke="#ef4444" stroke-width="1" fill-opacity="0.3"/>
  <!-- Legend -->
  <line x1="130" y1="65" x2="155" y2="65" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="160" y="69" font-size="10" fill="#1e293b">總人數</text>
  <line x1="250" y1="65" x2="275" y2="65" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,3"/>
  <text x="280" y="69" font-size="10" fill="#1e293b">離職率（%）</text>
</svg>
</div>

<h3>7.2 員工福祉管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>總員工人數</td><td>{{total_employees}}</td><td>{{total_employees_prev}}</td><td>{{total_employees_target}}</td><td>{{total_employees_rate}}</td></tr>
    <tr><td>自願離職率</td><td>{{turnover_rate}}%</td><td>{{turnover_rate_prev}}%</td><td>{{turnover_rate_target}}%</td><td>{{turnover_rate_achieve}}</td></tr>
    <tr><td>每人平均訓練時數</td><td>{{training_hours}} hrs</td><td>{{training_hours_prev}} hrs</td><td>{{training_hours_target}} hrs</td><td>{{training_hours_rate}}</td></tr>
    <tr><td>員工滿意度</td><td>{{satisfaction_score}}</td><td>{{satisfaction_score_prev}}</td><td>{{satisfaction_score_target}}</td><td>{{satisfaction_score_rate}}</td></tr>
    <tr><td>育嬰留停復職率</td><td>{{parental_return_rate}}%</td><td>{{parental_return_rate_prev}}%</td><td>{{parental_return_rate_target}}%</td><td>{{parental_return_rate_achieve}}</td></tr>
  </tbody>
</table>

<h3>7.3 員工健康與福祉計畫</h3>
<p>本公司推動全方位之員工健康促進計畫，包括：一、年度健康檢查，涵蓋一般健檢及特殊作業健康檢查；二、心理健康支持方案，提供員工心理諮詢服務及壓力管理課程；三、工作生活平衡措施，包含彈性工時、遠距辦公及家庭照顧假；四、健康促進活動，如運動社團、健康講座及戒菸戒酒計畫。{{report_year}} 年度員工健康促進預算為 {{wellness_budget}} 千元，參與率達 {{wellness_participation}}%。</p>
`
  },

  // ─── Ch.08 多元平等與包容 ───
  {
    id: 'ch-08',
    title: '多元平等與包容',
    chapter: 8,
    wordCount: 2000,
    griAlignment: ['GRI 405-1', 'GRI 405-2', 'GRI 406-1', 'GRI 2-22', 'SASB HN-AA-310a.2'],
    hasChart: true,
    chartType: 'bar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{female_ratio}}', '{{female_mgr_ratio}}', '{{pay_gap}}', '{{disability_employees}}'],
    content: `
<h2>第八章 多元平等與包容</h2>
<p>{{company_name}} 堅信多元平等與包容（Diversity, Equity & Inclusion, DEI）為企業創新與永續發展之重要驅動力。本公司致力於打造一個尊重差異、公平對待、包容多元的工作環境，讓不同性別、年齡、種族、宗教、身心狀態及性傾向之員工均能獲得平等之發展機會。本公司已制定多元平等與包容政策，並設立專責單位推動相關措施。</p>

<p>在性別平等方面，本公司積極提升女性員工比例及女性主管比例，{{report_year}} 年度女性員工佔比為 {{female_ratio}}%，女性主管佔比為 {{female_mgr_ratio}}%。本公司亦定期進行薪酬平等分析，確保同工同酬原則之落實，{{report_year}} 年度性別薪酬差距為 {{pay_gap}}%。</p>

<h3>8.1 多元平等指標</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">多元平等與包容指標（%）</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">DEI Metrics</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">25</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">50</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">75</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">100</text>
  <!-- Bars -->
  <rect x="75" y="140" width="55" height="110" fill="#ec4899" rx="3"/>
  <rect x="150" y="120" width="55" height="130" fill="#8b5cf6" rx="3"/>
  <rect x="225" y="100" width="55" height="150" fill="#3b82f6" rx="3"/>
  <rect x="300" y="130" width="55" height="120" fill="#10b981" rx="3"/>
  <rect x="375" y="110" width="55" height="140" fill="#f59e0b" rx="3"/>
  <!-- Labels -->
  <text x="102" y="268" text-anchor="middle" font-size="8" fill="#475569">女性員工</text>
  <text x="177" y="268" text-anchor="middle" font-size="8" fill="#475569">女性主管</text>
  <text x="252" y="268" text-anchor="middle" font-size="8" fill="#475569">育嬰復職</text>
  <text x="327" y="268" text-anchor="middle" font-size="8" fill="#475569">身障聘用</text>
  <text x="402" y="268" text-anchor="middle" font-size="8" fill="#475569">原民聘用</text>
  <!-- Values -->
  <text x="102" y="133" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">55%</text>
  <text x="177" y="113" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">65%</text>
  <text x="252" y="93" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">75%</text>
  <text x="327" y="123" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">60%</text>
  <text x="402" y="103" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e293b">70%</text>
</svg>
</div>

<h3>8.2 多元平等管理績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>女性員工比例</td><td>{{female_ratio}}%</td><td>{{female_ratio_prev}}%</td><td>{{female_ratio_target}}%</td><td>{{female_ratio_achieve}}</td></tr>
    <tr><td>女性主管比例</td><td>{{female_mgr_ratio}}%</td><td>{{female_mgr_ratio_prev}}%</td><td>{{female_mgr_ratio_target}}%</td><td>{{female_mgr_ratio_achieve}}</td></tr>
    <tr><td>性別薪酬差距</td><td>{{pay_gap}}%</td><td>{{pay_gap_prev}}%</td><td>{{pay_gap_target}}%</td><td>{{pay_gap_achieve}}</td></tr>
    <tr><td>身心障礙者聘用人數</td><td>{{disability_employees}}</td><td>{{disability_employees_prev}}</td><td>{{disability_employees_target}}</td><td>{{disability_employees_rate}}</td></tr>
    <tr><td>DEI訓練覆蓋率</td><td>{{dei_training_rate}}%</td><td>{{dei_training_rate_prev}}%</td><td>100%</td><td>{{dei_training_achieve}}</td></tr>
  </tbody>
</table>

<h3>8.3 包容性文化推動</h3>
<p>本公司積極推動包容性文化，透過多元管道促進員工之間的理解與尊重。{{report_year}} 年度共辦理 {{dei_events}} 場多元平等相關活動與訓練，涵蓋無意識偏見訓練、跨文化溝通、性別平等意識及身心障礙者友善職場等主題。本公司亦設立員工資源小組（Employee Resource Groups, ERGs），包括女性領導力網絡、多元文化社群及 LGBTQ+ 盟友團體等，為不同背景之員工提供交流與支持之平台。</p>
`
  },

  // ─── Ch.09 職業安全衛生 ───
  {
    id: 'ch-09',
    title: '職業安全衛生',
    chapter: 9,
    wordCount: 2000,
    griAlignment: ['GRI 403-1', 'GRI 403-2', 'GRI 403-3', 'GRI 403-4', 'GRI 403-5', 'GRI 403-9', 'GRI 403-10', 'SASB HN-AA-320a.1'],
    hasChart: true,
    chartType: 'line',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{ltir}}', '{{trir}}', '{{fatality_count}}', '{{safety_training_hours}}'],
    content: `
<h2>第九章 職業安全衛生</h2>
<p>{{company_name}} 將員工之安全與健康視為企業營運之最高優先事項，致力於達成零災害之目標。本公司依據 ISO 45001 職業安全衛生管理系統標準，建立完整之安全衛生管理制度，涵蓋風險評估、危害預防、緊急應變、健康管理及持續改善等環節。所有營運據點均已通過 ISO 45001 認證，展現本公司對職業安全衛生之堅定承諾。</p>

<p>在安全管理方面，本公司採取「預防為主、全員參與」之策略，透過系統性之風險辨識與管控措施，降低工作場所之安全危害。本公司亦鼓勵員工主動通報潛在危害與虛驚事件，建立正向之安全文化。{{report_year}} 年度失能傷害頻率（LTIR）為 {{ltir}}，較前年改善 {{ltir_improvement}}%。</p>

<h3>9.1 職業安全趨勢</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">職業安全指標趨勢</text>
  <text x="250" y="40" text-anchor="middle" font-size="10" fill="#64748b">Occupational Safety Metrics Trend</text>
  <line x1="50" y1="55" x2="50" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="250" x2="470" y2="250" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="50" y1="200" x2="470" y2="200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="150" x2="470" y2="150" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="55" x2="470" y2="55" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  <text x="42" y="254" text-anchor="end" font-size="9" fill="#64748b">0</text>
  <text x="42" y="204" text-anchor="end" font-size="9" fill="#64748b">1.0</text>
  <text x="42" y="154" text-anchor="end" font-size="9" fill="#64748b">2.0</text>
  <text x="42" y="104" text-anchor="end" font-size="9" fill="#64748b">3.0</text>
  <text x="42" y="59" text-anchor="end" font-size="9" fill="#64748b">4.0</text>
  <!-- X labels -->
  <text x="90" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-3</text>
  <text x="170" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-2</text>
  <text x="250" y="268" text-anchor="middle" font-size="9" fill="#475569">Y-1</text>
  <text x="330" y="268" text-anchor="middle" font-size="9" fill="#475569">{{report_year}}</text>
  <text x="410" y="268" text-anchor="middle" font-size="9" fill="#475569">目標</text>
  <!-- LTIR line (blue) -->
  <polyline points="90,100 170,120 250,140 330,160 410,175" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <circle cx="90" cy="100" r="4" fill="#3b82f6"/>
  <circle cx="170" cy="120" r="4" fill="#3b82f6"/>
  <circle cx="250" cy="140" r="4" fill="#3b82f6"/>
  <circle cx="330" cy="160" r="4" fill="#3b82f6"/>
  <circle cx="410" cy="175" r="4" fill="#3b82f6" stroke="#3b82f6" stroke-width="1" fill-opacity="0.3"/>
  <!-- TRIR line (orange) -->
  <polyline points="90,80 170,100 250,125 330,150 410,170" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
  <circle cx="90" cy="80" r="4" fill="#f59e0b"/>
  <circle cx="170" cy="100" r="4" fill="#f59e0b"/>
  <circle cx="250" cy="125" r="4" fill="#f59e0b"/>
  <circle cx="330" cy="150" r="4" fill="#f59e0b"/>
  <circle cx="410" cy="170" r="4" fill="#f59e0b" stroke="#f59e0b" stroke-width="1" fill-opacity="0.3"/>
  <!-- Legend -->
  <line x1="130" y1="65" x2="155" y2="65" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="160" y="69" font-size="10" fill="#1e293b">LTIR 失能傷害頻率</text>
  <line x1="280" y1="65" x2="305" y2="65" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="310" y="69" font-size="10" fill="#1e293b">TRIR 總傷害率</text>
</svg>
</div>

<h3>9.2 職業安全衛生績效</h3>
<table class="data-table">
  <thead>
    <tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
  </thead>
  <tbody>
    <tr><td>失能傷害頻率（LTIR）</td><td>{{ltir}}</td><td>{{ltir_prev}}</td><td>{{ltir_target}}</td><td>{{ltir_rate}}</td></tr>
    <tr><td>總傷害率（TRIR）</td><td>{{trir}}</td><td>{{trir_prev}}</td><td>{{trir_target}}</td><td>{{trir_rate}}</td></tr>
    <tr><td>職災死亡人數</td><td>{{fatality_count}}</td><td>{{fatality_count_prev}}</td><td>0</td><td>{{fatality_rate}}</td></tr>
    <tr><td>安全衛生訓練時數</td><td>{{safety_training_hours}} hrs</td><td>{{safety_training_hours_prev}} hrs</td><td>{{safety_training_hours_target}} hrs</td><td>{{safety_training_hours_rate}}</td></tr>
    <tr><td>ISO 45001認證覆蓋率</td><td>{{iso45001_coverage}}%</td><td>{{iso45001_coverage_prev}}%</td><td>100%</td><td>{{iso45001_coverage_rate}}</td></tr>
  </tbody>
</table>

<h3>9.3 安全管理強化措施</h3>
<p>本公司持續強化安全管理措施，包括：一、導入智慧安全監控系統，運用物聯網（IoT）技術即時監測高風險作業環境；二、推動行為安全觀察（BBS）計畫，透過同儕觀察與回饋提升安全意識；三、定期辦理緊急應變演練，提升員工應變能力；四、建立職災調查與根因分析機制，防止類似事件再次發生。{{report_year}} 年度共辦理 {{safety_drills}} 場緊急應變演練，參與人數達 {{drill_participants}} 人次。</p>
`
  },

  // ─── Ch.10 人權與供應鏈 ───
  {
    id: 'ch-10',
    title: '人權與供應鏈',
    chapter: 10,
    wordCount: 2000,
    griAlignment: ['GRI 412-1', 'GRI 412-2', 'GRI 412-3', 'GRI 414-1', 'GRI 414-2', 'UNGP', 'CSDDD'],
    hasChart: true,
    chartType: 'radar',
    placeholders: ['{{company_name}}', '{{report_year}}', '{{supplier_count}}', '{{supplier_audit_count}}', '{{human_rights_training}}', '{{modern_slavery_risk}}'],
    content: `
<h2>第十章 人權與供應鏈</h2>
<p>{{company_name}} 尊重並維護國際公認之人權標準，遵循聯合國工商企業與人權指導原則（UNGP）、國際勞工組織核心公約及聯合國全球盟約之精神，制定並落實人權政策與盡職調查程序。本公司承諾在自身營運及供應鏈中，防止人權侵害事件之發生，並對已發生之侵害事件提供有效之救濟措施。</p>

<p>在供應鏈管理方面，本公司要求所有供應商遵守行為準則，涵蓋勞工權益、環境保護、道德規範及管理系統等面向。{{report_year}} 年度共完成 {{supplier_audit_count}} 家供應商之社會責任稽核，稽核覆蓋率達 {{audit_coverage}}%。對於稽核發現之缺失，本公司要求供應商限期改善，並進行追蹤複查。</p>

<h3>10.1 人權風險評估</h3>
<p>本公司已進行全面之人權盡職調查，識別出以下高風險領域：一、供應鏈中之強迫勞動與童工風險；二、原住民權益與土地正義；三、隱私權與個人資料保護；四、結社自由與集體協商權。針對各風險領域，本公司已制定相應之預防與緩解措施。</p>

<h3>10.2 人權風險面向</h3>
<div class="chart-container">
<svg width="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="300" fill="#f8fafc" rx="8"/>
  <text x="250" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1