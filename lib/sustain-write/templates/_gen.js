const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'full-template.ts');

// We'll build the file content in parts
let parts = [];

parts.push(`// lib/sustain-write/templates/full-template.ts`);
parts.push(`// 全面合規永續報告範本 v2.0 — 24 段 × ~2,000+ 字`);
parts.push(`// 零算力範本：預寫完成，使用時只需複製 + 填充數據`);
parts.push(`// 含 SVG 圖表、資料表格、GRI/TCFD/SASB 對齊`);
parts.push(``);
parts.push(`import type { ReportTemplate, TemplateSection } from './types';`);
parts.push(``);
parts.push(`const SECTIONS: TemplateSection[] = [`);

// ---- Helper to escape backticks in content ----
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/ + 'g', '\\`').replace(/\$/g, '\\$');
}

// ---- Section content generators ----

const sections = [];

// ============ CH-01: 永續治理與策略 ============
sections.push({
  id: 'ch-01',
  title: 'Ch.1 永續治理與策略',
  chapter: 1,
  wordCount: 2100,
  griAlignment: ['GRI-2-9', 'GRI-2-10', 'GRI-2-11', 'GRI-2-22', 'GRI-2-23', 'GRI-3-3'],
  hasChart: true,
  chartType: 'bar',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{ceo_name}}', '{{board_size}}', '{{independent_directors}}'],
  content: `<h2>Ch.1 永續治理與策略</h2>

<h3>1.1 治理架構概述</h3>
<p>{{company_name}}（以下簡稱「本公司」）設立於 {{report_year}} 年，主要業務為 {{industry}} 相關領域。本公司深知企業永續發展對於長期價值創造與社會責任的重要性，因此建立了完整的永續治理架構，確保所有營運活動均符合環境、社會與治理（ESG）三大面向的國際準則要求。本公司董事會為永續治理的最高監督單位，下設永續發展委員會，由 {{ceo_name}} 擔任主任委員，負責制定永續策略方向、監督執行成效，並定期向董事會報告。董事會共 {{board_size}} 名董事，其中包含 {{independent_directors}} 名獨立董事，確保決策的多元性與獨立性。</p>

<p>本公司依據公司治理實務守則、證券交易法及相關法規，建立了完善的內部控制制度與風險管理機制。董事會每季召開一次會議，必要時得召開臨時會議，審議重大永續議題與策略方向。永續發展委員會下設環境永續組、社會責任組、公司治理組及創新發展組，各組依其職掌推動相關工作，並定期向委員會報告執行進度。</p>

<h3>1.2 組織架構圖</h3>
<p>以下呈現本公司永續治理之組織架構，從董事會到各執行層級，形成完整的永續管理體系：</p>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="150" y="10" width="200" height="40" rx="5" fill="#003262"/>
  <text x="250" y="35" text-anchor="middle" fill="white" font-size="13" font-weight="bold">董事會</text>
  <line x1="250" y1="50" x2="250" y2="70" stroke="#003262" stroke-width="2"/>
  <rect x="130" y="70" width="240" height="40" rx="5" fill="#FDB515"/>
  <text x="250" y="95" text-anchor="middle" fill="#003262" font-size="12" font-weight="bold">永續發展委員會</text>
  <line x1="250" y1="110" x2="250" y2="125" stroke="#003262" stroke-width="2"/>
  <line x1="80" y1="125" x2="420" y2="125" stroke="#003262" stroke-width="1.5"/>
  <line x1="80" y1="125" x2="80" y2="140" stroke="#003262" stroke-width="1.5"/>
  <line x1="195" y1="125" x2="195" y2="140" stroke="#003262" stroke-width="1.5"/>
  <line x1="305" y1="125" x2="305" y2="140" stroke="#003262" stroke-width="1.5"/>
  <line x1="420" y1="125" x2="420" y2="140" stroke="#003262" stroke-width="1.5"/>
  <rect x="30" y="140" width="110" height="35" rx="4" fill="#10B981"/>
  <text x="85" y="162" text-anchor="middle" fill="white" font-size="10" font-weight="bold">環境永續組</text>
  <rect x="145" y="140" width="110" height="35" rx="4" fill="#3B82F6"/>
  <text x="200" y="162" text-anchor="middle" fill="white" font-size="10" font-weight="bold">社會責任組</text>
  <rect x="260" y="140" width="100" height="35" rx="4" fill="#6366F1"/>
  <text x="310" y="162" text-anchor="middle" fill="white" font-size="10" font-weight="bold">公司治理組</text>
  <rect x="370" y="140" width="110" height="35" rx="4" fill="#EF4444"/>
  <text x="425" y="162" text-anchor="middle" fill="white" font-size="10" font-weight="bold">創新發展組</text>
  <line x1="85" y1="175" x2="85" y2="195" stroke="#10B981" stroke-width="1"/>
  <line x1="200" y1="175" x2="200" y2="195" stroke="#3B82F6" stroke-width="1"/>
  <line x1="310" y1="175" x2="310" y2="195" stroke="#6366F1" stroke-width="1"/>
  <line x1="425" y1="175" x2="425" y2="195" stroke="#EF4444" stroke-width="1"/>
  <rect x="30" y="195" width="110" height="30" rx="3" fill="#E5E7EB"/>
  <text x="85" y="214" text-anchor="middle" fill="#374151" font-size="8">碳管理/能源/水資源</text>
  <rect x="145" y="195" width="110" height="30" rx="3" fill="#E5E7EB"/>
  <text x="200" y="214" text-anchor="middle" fill="#374151" font-size="8">員工/社區/人權</text>
  <rect x="260" y="195" width="100" height="30" rx="3" fill="#E5E7EB"/>
  <text x="310" y="214" text-anchor="middle" fill="#374151" font-size="8">法遵/內控/揭露</text>
  <rect x="370" y="195" width="110" height="30" rx="3" fill="#E5E7EB"/>
  <text x="425" y="214" text-anchor="middle" fill="#374151" font-size="8">研發/數位/創新</text>
  <text x="250" y="260" text-anchor="middle" fill="#003262" font-size="12" font-weight="bold">圖 1.1 {{company_name}} 永續治理組織架構</text>
  <text x="250" y="280" text-anchor="middle" fill="#6B7280" font-size="9">資料來源：{{company_name}} 永續發展委員會 {{report_year}}</text>
</svg>

<h3>1.3 永續策略框架</h3>
<p>本公司的永續策略以「創造共享價值」為核心理念，結合聯合國永續發展目標（SDGs）與國際準則要求，制定了短、中、長期的永續發展路徑。策略框架涵蓋四大主軸：</p>
<ul>
<li><strong>環境守護（Planet）</strong>：碳中和路徑、能源轉型、循環經濟、生物多樣性保護</li>
<li><strong>社會共融（People）</strong>：員工福祉、多元包容、社區參與、人權盡職調查</li>
<li><strong>誠信治理（Integrity）</strong>：反貪腐、資訊安全、供應鏈管理、利害關係人溝通</li>
<li><strong>創新價值（Prosperity）</strong>：數位轉型、研發投入、客戶關係、長期價值創造</li>
</ul>

<h3>1.4 利害關係人溝通</h3>
<p>本公司透過多元管道與利害關係人進行溝通，每年進行重大主題分析，以識別對公司營運及利害關係人最關鍵的永續議題。溝通管道包括每年發行永續報告書（GRI Standards 架構）、每季舉辦法人說明會、利害關係人問卷調查、客戶滿意度調查、員工敬業度調查、供應商盡職調查與溝通，以及社區參與活動與公益捐贈。</p>

<table>
<thead>
<tr><th>利害關係人</th><th>關注議題</th><th>溝通管道</th><th>溝通頻率</th><th>回應方式</th></tr>
</thead>
<tbody>
<tr><td>股東/投資人</td><td>財務績效、ESG風險、氣候策略</td><td>股東會、法說會、ESG報告</td><td>每季/每年</td><td>資訊揭露、議案回覆</td></tr>
<tr><td>員工</td><td>薪酬福利、職涯發展、工作環境</td><td>內部網站、勞資會議、滿意度調查</td><td>每月/每年</td><td>政策調整、教育訓練</td></tr>
<tr><td>客戶</td><td>產品品質、資料隱私、綠色產品</td><td>客服中心、滿意度調查、官網</td><td>持續/每年</td><td>服務改善、產品創新</td></tr>
<tr><td>供應商</td><td>採購政策、ESG要求、合作關係</td><td>供應商大會、稽核、培訓</td><td>每季/每年</td><td>輔導改善、長期合作</td></tr>
<tr><td>社區/公益團體</td><td>環境影響、社區參與、公益捐贈</td><td>社區活動、公益平台、志工服務</td><td>每月/每年</td><td>資源投入、專案合作</td></tr>
<tr><td>主管機關</td><td>法規遵循、資訊揭露、永續作為</td><td>公文往來、申報系統、研討會</td><td>持續/每年</td><td>主動申報、參與政策</td></tr>
</tbody>
</table>

<h3>1.5 重大主題分析與優先順序</h3>
<p>透過系統性的重大主題分析流程，本公司識別出以下關鍵永續議題，並依影響程度與利害關係人關注度排序：</p>

<table>
<thead>
<tr><th>重大主題</th><th>影響程度</th><th>利害關係人關注度</th><th>優先順序</th><th>管理方針</th><th>對應SDGs</th></tr>
</thead>
<tbody>
<tr><td>氣候變遷與碳管理</td><td>極高</td><td>極高</td><td>P1-立即</td><td>科學基礎減量目標（SBTi）</td><td>SDG 7, 13</td></tr>
<tr><td>資訊安全與隱私保護</td><td>極高</td><td>高</td><td>P1-立即</td><td>ISO 27001 認證、零信任架構</td><td>SDG 9, 16</td></tr>
<tr><td>人才吸引與留任</td><td>高</td><td>高</td><td>P2-重要</td><td>薪酬福利與職涯發展計畫</td><td>SDG 4, 8</td></tr>
<tr><td>供應鏈永續管理</td><td>高</td><td>高</td><td>P2-重要</td><td>供應商行為準則、ESG評鑑</td><td>SDG 12, 17</td></tr>
<tr><td>產品責任與客戶服務</td><td>中</td><td>高</td><td>P3-關注</td><td>品質管理系統、客戶滿意度</td><td>SDG 3, 12</td></tr>
<tr><td>社區發展與社會貢獻</td><td>中</td><td>中</td><td>P3-關注</td><td>企業志工計畫、公益捐贈</td><td>SDG 1, 11</td></tr>
<tr><td>水資源管理</td><td>中</td><td>中</td><td>P3-關注</td><td>水資源效率提升、回收再利用</td><td>SDG 6</td></tr>
<tr><td>生物多樣性保護</td><td>中</td><td>中</td><td>P4-追蹤</td><td>生態保育計畫、棲地復育</td><td>SDG 14, 15</td></tr>
</tbody>
</table>

<h3>1.6 永續目標與績效追蹤</h3>
<p>本公司針對各重大主題設定量化目標，並定期追蹤達成情形。短期目標聚焦於法規遵循與基礎建設，中期目標著重於轉型與優化，長期目標則對齊國際淨零路徑與產業標竿。所有目標均納入高階主管績效考核，確保策略執行力。</p>

<h3>1.7 法規遵循與國際準則</h3>
<p>本公司嚴格遵守所有適用法規，包括公司法、證券交易法、個人資料保護法、環保法規（空污、水污、廢棄物）、勞動基準法與職業安全衛生法、反洗錢與反貪腐法規。在國際準則方面，本報告書依循 GRI Standards 2021 版本架構，並參考 TCFD 氣候相關財務揭露建議、SASB 行業特定準則，以及 IFRS S1/S2 永續揭露準則，確保資訊揭露的完整性與國際可比性。</p>

<h3>1.8 附註與補充資訊</h3>
<p>本章节所揭露之數據涵蓋 {{company_name}} 全球營運據點，報告期間為 {{report_year}} 年 1 月 1 日至 12 月 31 日。數據計算方法遵循國際準則與產業慣例，如有重大變更已於報告中註明。所有財務數據經會計師查核簽證，環境與社會數據經第三方確信機構有限確信。</p>`
});

// ============ CH-02: 氣候變遷與碳管理 ============
sections.push({
  id: 'ch-02',
  title: 'Ch.2 氣候變遷與碳管理',
  chapter: 2,
  wordCount: 2100,
  griAlignment: ['GRI-305-1', 'GRI-305-2', 'GRI-305-3', 'GRI-305-4', 'GRI-305-5', 'TCFD-Governance', 'TCFD-Strategy', 'TCFD-Risk', 'TCFD-Metrics'],
  hasChart: true,
  chartType: 'bar',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{base_year}}', '{{total_emissions_1}}', '{{total_emissions_2}}'],
  content: `<h2>Ch.2 氣候變遷與碳管理</h2>

<h3>2.1 氣候治理與策略</h3>
<p>{{company_name}} 深刻認知氣候變遷對全球經濟與企業營運的深遠影響，將氣候議題納入企業核心策略，並依循 TCFD（氣候相關財務揭露工作小組）架構進行全面性揭露。本公司董事會為氣候治理的最高監督單位，每季審議氣候相關風險與機會、減碳目標達成進度，以及氣候相關投資決策。</p>

<p>本公司已設定科學基礎減量目標（SBTi），承諾於 {{base_year}} 為基準年，2030 年前減少 50% 的溫室氣體排放，並於 2050 年達成淨零排放。短期目標方面，{{report_year}} 年預計較基準年減碳 25%，並持續提升再生能源使用比例至 40% 以上。</p>

<h3>2.2 溫室氣體排放趨勢</h3>
<p>以下圖表呈現本公司近三年溫室氣體排放情形（以二氧化碳當量計）：</p>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 2.1 溫室氣體排放趨勢（噸CO₂e）</text>
  <!-- Y axis -->
  <line x1="60" y1="45" x2="60" y2="230" stroke="#9CA3AF" stroke-width="1"/>
  <!-- X axis -->
  <line x1="60" y1="230" x2="470" y2="230" stroke="#9CA3AF" stroke-width="1"/>
  <!-- Y axis labels -->
  <text x="50" y="235" text-anchor="end" font-size="9" fill="#6B7280">0</text>
  <text x="50" y="190" text-anchor="end" font-size="9" fill="#6B7280">20,000</text>
  <text x="50" y="145" text-anchor="end" font-size="9" fill="#6B7280">40,000</text>
  <text x="50" y="100" text-anchor="end" font-size="9" fill="#6B7280">60,000</text>
  <text x="50" y="55" text-anchor="end" font-size="9" fill="#6B7280">80,000</text>
  <!-- Grid lines -->
  <line x1="60" y1="190" x2="470" y2="190" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="145" x2="470" y2="145" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="100" x2="470" y2="100" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="55" x2="470" y2="55" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Scope 1 bars -->
  <rect x="100" y="130" width="50" height="100" fill="#EF4444" rx="3"/>
  <text x="125" y="125" text-anchor="middle" font-size="9" fill="#374151">18,000</text>
  <rect x="210" y="145" width="50" height="85" fill="#EF4444" rx="3"/>
  <text x="235" y="140" text-anchor="middle" font-size="9" fill="#374151">15,300</text>
  <rect x="320" y="160" width="50" height="70" fill="#EF4444" rx="3"/>
  <text x="345" y="155" text-anchor="middle" font-size="9" fill="#374151">12,600</text>
  <!-- Scope 2 bars -->
  <rect x="155" y="100" width="50" height="130" fill="#3B82F6" rx="3"/>
  <text x="180" y="95" text-anchor="middle" font-size="9" fill="#374151">23,400</text>
  <rect x="265" y="115" width="50" height="115" fill="#3B82F6" rx="3"/>
  <text x="290" y="110" text-anchor="middle" font-size="9" fill="#374151">20,700</text>
  <rect x="375" y="135" width="50" height="95" fill="#3B82F6" rx="3"/>
  <text x="400" y="130" text-anchor="middle" font-size="9" fill="#374151">17,100</text>
  <!-- X axis labels -->
  <text x="155" y="250" text-anchor="middle" font-size="10" fill="#374151">2023年</text>
  <text x="290" y="250" text-anchor="middle" font-size="10" fill="#374151">2024年</text>
  <text x="400" y="250" text-anchor="middle" font-size="10" fill="#374151">2025年</text>
  <!-- Legend -->
  <rect x="130" y="265" width="15" height="10" fill="#EF4444" rx="2"/>
  <text x="150" y="274" font-size="9" fill="#374151">範疇一（直接排放）</text>
  <rect x="260" y="265" width="15" height="10" fill="#3B82F6" rx="2"/>
  <text x="280" y="274" font-size="9" fill="#374151">範疇二（間接能源排放）</text>
  <text x="250" y="295" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 溫室氣體盤查報告 {{report_year}}</text>
</svg>

<h3>2.3 碳排放明細與減量成效</h3>
<p>本公司依據 ISO 14064-1:2018 標準進行溫室氣體盤查，涵蓋範疇一（直接排放）、範疇二（間接能源排放）及範疇三（其他間接排放）。以下表格呈現各範疇排放明細：</p>

<table>
<thead>
<tr><th>排放範疇</th><th>排放來源</th><th>2025年（噸CO₂e）</th><th>2024年（噸CO₂e）</th><th>目標</th><th>達成率</th></tr>
</thead>
<tbody>
<tr><td>範疇一</td><td>固定燃燒、移動燃燒、逸散排放</td><td>12,600</td><td>15,300</td><td>12,000</td><td>95.2%</td></tr>
<tr><td>範疇二（地點基礎）</td><td>外購電力</td><td>17,100</td><td>20,700</td><td>16,000</td><td>94.1%</td></tr>
<tr><td>範疇二（市場基礎）</td><td>再生能源憑證、綠電採購</td><td>10,260</td><td>16,560</td><td>9,600</td><td>93.6%</td></tr>
<tr><td>範疇三</td><td>商務旅行、員工通勤、上下游運輸</td><td>8,450</td><td>9,200</td><td>8,000</td><td>94.7%</td></tr>
<tr><td><strong>合計（範疇一+二市場基礎+三）</strong></td><td>-</td><td><strong>31,310</strong></td><td><strong>41,060</strong></td><td><strong>29,600</strong></td><td><strong>94.5%</strong></td></tr>
</tbody>
</table>

<h3>2.4 碳管理行動方案</h3>
<p>為達成減碳目標，本公司已實施多項碳管理行動方案，包括：製程效率提升（導入智慧能源管理系統，節電率達 15%）、再生能源採購（簽訂企業購電合約 CPA，綠電占比提升至 35%）、運輸電氣化（公務車全面電動化，建置充電基礎設施）、以及供應鏈減碳合作（要求主要供應商設定減碳目標並定期回報）。</p>

<table>
<thead>
<tr><th>行動方案</th><th>投資金額（萬元）</th><th>年減碳量（噸CO₂e）</th><th>回收年限</th><th>優先順序</th></tr>
</thead>
<tbody>
<tr><td>智慧能源管理系統</td><td>2,500</td><td>3,200</td><td>3.5年</td><td>P1-立即執行</td></tr>
<tr><td>屋頂型太陽能建置</td><td>4,800</td><td>2,800</td><td>6.2年</td><td>P1-立即執行</td></tr>
<tr><td>綠電採購（CPA）</td><td>3,200</td><td>6,300</td><td>-</td><td>P1-立即執行</td></tr>
<tr><td>製程設備汰舊換新</td><td>6,000</td><td>4,500</td><td>5.8年</td><td>P2-重要</td></tr>
<tr><td>公務車電動化</td><td>1,800</td><td>850</td><td>4.1年</td><td>P2-重要</td></tr>
<tr><td>碳捕捉技術導入</td><td>8,500</td><td>5,200</td><td>8.5年</td><td>P3-中長期</td></tr>
</tbody>
</table>

<h3>2.5 氣候風險與機會評估</h3>
<p>依據 TCFD 架構，本公司已進行氣候情境分析，評估在 1.5°C、2°C 及 4°C 情境下之實體風險與轉型風險。實體風險包括極端天氣事件對供應鏈的衝擊、水資源短缺對生產的影響；轉型風險包括碳定價政策、技術變革、市場偏好轉變。機會方面，綠色產品市場擴張、能源效率提升節省成本、以及 ESG 融資優勢均為本公司帶來正面效益。</p>

<h3>2.6 附註</h3>
<p>本章节溫室氣體排放數據係依據 ISO 14064-1:2018 標準盤查，並經第三方查證機構（BSI/SGS）合理確信。全球暖化潛勢（GWP）採用 IPCC AR6 報告數值。範疇二採市場基礎計算，再生能源憑證來源為國家再生能源憑證中心。</p>`
});

// ============ CH-03: 能源管理 ============
sections.push({
  id: 'ch-03',
  title: 'Ch.3 能源管理',
  chapter: 3,
  wordCount: 2100,
  griAlignment: ['GRI-302-1', 'GRI-302-3', 'GRI-302-4', 'GRI-302-5', 'SASB-IF-EU-130a.1'],
  hasChart: true,
  chartType: 'pie',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{total_energy_gj}}', '{{renewable_pct}}'],
  content: `<h2>Ch.3 能源管理</h2>

<h3>3.1 能源管理政策與目標</h3>
<p>{{company_name}} 致力於提升能源效率與擴大再生能源使用，以降低營運過程中的碳排放與環境衝擊。本公司已建立能源管理制度並取得 ISO 50001 能源管理系統認證，透過系統化的能源審查、基線建立、績效指標設定與持續改善循環，確保能源使用效率的持續提升。</p>

<p>本公司設定之能源管理目標包括：{{report_year}} 年能源密集度較基準年降低 20%、再生能源使用比例達 40%、2030 年達成 100% 再生能源使用。為達成上述目標，本公司成立能源管理小組，由營運副總擔任召集人，統籌各廠區能源管理事務。</p>

<h3>3.2 能源組合分析</h3>
<p>以下圖表呈現 {{report_year}} 年本公司之能源使用組合：</p>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 3.1 能源使用組合（{{report_year}}年）</text>
  <!-- Pie chart: center (175,140), radius 80 -->
  <!-- Coal 15% = 54deg -->
  <path d="M175,60 A80,80 0 0,1 247,108 L175,140 Z" fill="#003262"/>
  <text x="230" y="85" font-size="9" fill="white" font-weight="bold">燃煤 15%</text>
  <!-- Natural Gas 25% = 90deg -->
  <path d="M247,108 A80,80 0 0,1 255,140 L175,140 Z" fill="#EF4444"/>
  <text x="265" y="130" font-size="9" fill="white" font-weight="bold">天然氣 25%</text>
  <!-- Grid Power 20% = 72deg -->
  <path d="M255,140 A80,80 0 0,1 201,208 L175,140 Z" fill="#FDB515"/>
  <text x="220" y="200" font-size="9" fill="#003262" font-weight="bold">市電 20%</text>
  <!-- Solar 22% = 79.2deg -->
  <path d="M201,208 A80,80 0 0,1 113,178 L175,140 Z" fill="#10B981"/>
  <text x="110" y="195" font-size="9" fill="white" font-weight="bold">太陽能 22%</text>
  <!-- Wind 18% = 64.8deg -->
  <path d="M113,178 A80,80 0 0,1 175,60 L175,140 Z" fill="#3B82F6"/>
  <text x="95" y="110" font-size="9" fill="white" font-weight="bold">風電 18%</text>
  <!-- Legend on right -->
  <rect x="310" y="60" width="15" height="10" fill="#003262" rx="2"/>
  <text x="330" y="69" font-size="9" fill="#374151">燃煤（15%）— 85,000 GJ</text>
  <rect x="310" y="80" width="15" height="10" fill="#EF4444" rx="2"/>
  <text x="330" y="89" font-size="9" fill="#374151">天然氣（25%）— 141,667 GJ</text>
  <rect x="310" y="100" width="15" height="10" fill="#FDB515" rx="2"/>
  <text x="330" y="109" font-size="9" fill="#374151">市電（20%）— 113,333 GJ</text>
  <rect x="310" y="120" width="15" height="10" fill="#10B981" rx="2"/>
  <text x="330" y="129" font-size="9" fill="#374151">太陽能（22%）— 124,667 GJ</text>
  <rect x="310" y="140" width="15" height="10" fill="#3B82F6" rx="2"/>
  <text x="330" y="149" font-size="9" fill="#374151">風電（18%）— 102,000 GJ</text>
  <text x="310" y="175" font-size="10" fill="#003262" font-weight="bold">總能源使用量</text>
  <text x="310" y="190" font-size="11" fill="#003262" font-weight="bold">566,667 GJ</text>
  <text x="310" y="210" font-size="9" fill="#10B981" font-weight="bold">再生能源佔比：40%</text>
  <text x="250" y="250" text-anchor="middle" fill="#003262" font-size="12" font-weight="bold">圖 3.2 再生能源使用趨勢</text>
  <text x="250" y="290" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 能源管理報告 {{report_year}}</text>
</svg>

<h3>3.3 再生能源使用趨勢</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 3.3 再生能源使用比例趨勢（%）</text>
  <line x1="60" y1="45" x2="60" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <text x="50" y="225" text-anchor="end" font-size="9" fill="#6B7280">0%</text>
  <text x="50" y="185" text-anchor="end" font-size="9" fill="#6B7280">20%</text>
  <text x="50" y="145" text-anchor="end" font-size="9" fill="#6B7280">40%</text>
  <text x="50" y="105" text-anchor="end" font-size="9" fill="#6B7280">60%</text>
  <text x="50" y="65" text-anchor="end" font-size="9" fill="#6B7280">80%</text>
  <line x1="60" y1="185" x2="460" y2="185" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="145" x2="460" y2="145" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="105" x2="460" y2="105" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="65" x2="460" y2="65" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Data points and line -->
  <polyline points="110,185 190,165 270,145 350,125 430,105" fill="none" stroke="#10B981" stroke-width="2.5"/>
  <circle cx="110" cy="185" r="5" fill="#10B981"/>
  <circle cx="190" cy="165" r="5" fill="#10B981"/>
  <circle cx="270" cy="145" r="5" fill="#10B981"/>
  <circle cx="350" cy="125" r="5" fill="#10B981"/>
  <circle cx="430" cy="105" r="5" fill="#10B981"/>
  <text x="110" y="200" text-anchor="middle" font-size="9" fill="#374151">20%</text>
  <text x="190" y="180" text-anchor="middle" font-size="9" fill="#374151">25%</text>
  <text x="270" y="160" text-anchor="middle" font-size="9" fill="#374151">30%</text>
  <text x="350" y="140" text-anchor="middle" font-size="9" fill="#374151">35%</text>
  <text x="430" y="120" text-anchor="middle" font-size="9" fill="#374151">40%</text>
  <text x="110" y="240" text-anchor="middle" font-size="9" fill="#374151">2021</text>
  <text x="190" y="240" text-anchor="middle" font-size="9" fill="#374151">2022</text>
  <text x="270" y="240" text-anchor="middle" font-size="9" fill="#374151">2023</text>
  <text x="350" y="240" text-anchor="middle" font-size="9" fill="#374151">2024</text>
  <text x="430" y="240" text-anchor="middle" font-size="9" fill="#374151">2025</text>
  <text x="250" y="270" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 能源管理報告 {{report_year}}</text>
</svg>

<h3>3.4 能源效率指標</h3>

<table>
<thead>
<tr><th>能源指標</th><th>2025年</th><th>2024年</th><th>目標</th><th>達成率</th><th>趨勢</th></tr>
</thead>
<tbody>
<tr><td>總能源使用量（GJ）</td><td>566,667</td><td>612,000</td><td>550,000</td><td>97.6%</td><td>↓ 改善</td></tr>
<tr><td>能源密集度（GJ/百萬元營收）</td><td>12.5</td><td>14.2</td><td>12.0</td><td>96.0%</td><td>↓ 改善</td></tr>
<tr><td>再生能源比例（%）</td><td>40%</td><td>35%</td><td>40%</td><td>100%</td><td>↑ 達標</td></tr>
<tr><td>外購綠電（MWh）</td><td>42,000</td><td>32,000</td><td>40,000</td><td>100%</td><td>↑ 超標</td></tr>
<tr><td>節能率（較基準年）</td><td>18%</td><td>12%</td><td>20%</td><td>90.0%</td><td>↑ 改善中</td></tr>
</tbody>
</table>

<h3>3.5 節能措施與投資</h3>

<table>
<thead>
<tr><th>節能措施</th><th>投資金額（萬元）</th><th>年節能量（GJ）</th><th>年減碳量（噸CO₂e）</th><th>回收年限</th></tr>
</thead>
<tbody>
<tr><td>LED照明全面汰換</td><td>800</td><td>8,500</td><td>1,200</td><td>2.1年</td></tr>
<tr><td>變頻空調系統更新</td><td>3,200</td><td>22,000</td><td>3,100</td><td>3.8年</td></tr>
<tr><td>製程廢熱回收系統</td><td>5,500</td><td>35,000</td><td>4,900</td><td>4.2年</td></tr>
<tr><td>智慧建築管理系統</td><td>2,800</td><td>15,000</td><td>2,100</td><td>3.5年</td></tr>
<tr><td>屋頂型太陽能（5MW）</td><td>4,800</td><td>28,000</td><td>2,800</td><td>6.2年</td></tr>
<tr><td>儲能系統（2MWh）</td><td>3,600</td><td>12,000</td><td>1,700</td><td>5.8年</td></tr>
</tbody>
</table>

<h3>3.6 附註</h3>
<p>本章节能源數據涵蓋 {{company_name}} 所有營運據點，能源轉換係數依據經濟部能源署公告數值。再生能源比例計算包含自發自用、綠電轉供及再生能源憑證。ISO 50001 證書有效期限至 2027 年 6 月。</p>`
});

// ============ CH-04: 水資源管理 ============
sections.push({
  id: 'ch-04',
  title: 'Ch.4 水資源管理',
  chapter: 4,
  wordCount: 2000,
  griAlignment: ['GRI-303-1', 'GRI-303-2', 'GRI-303-3', 'GRI-303-4', 'GRI-303-5', 'SASB-IF-EU-140a.1'],
  hasChart: true,
  chartType: 'line',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{water_total_kl}}', '{{recycle_rate}}'],
  content: `<h2>Ch.4 水資源管理</h2>

<h3>4.1 水資源管理政策</h3>
<p>{{company_name}} 認知水資源為珍貴的天然資源，尤其在氣候變遷加劇、極端旱澇頻傳的今日，負責任的水資源管理對企業永續經營至關重要。本公司已建立水資源管理政策，承諾持續提升用水效率、增加回收再利用比例、降低對當地水資源的壓力，並確保排放水質符合或優於法規標準。</p>

<p>本公司設定的水資源管理目標包括：{{report_year}} 年用水密集度較基準年降低 15%、水回收再利用率達 75%、2030 年達成零排放（ZLD）技術導入。所有廠區均進行水風險評估，採用 WRI Aqueduct 工具識別高水壓力區域，並制定對應的調適策略。</p>

<h3>4.2 用水量趨勢分析</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 4.1 用水量與回收再利用趨勢（千公升）</text>
  <line x1="60" y1="45" x2="60" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <text x="50" y="225" text-anchor="end" font-size="9" fill="#6B7280">0</text>
  <text x="50" y="180" text-anchor="end" font-size="9" fill="#6B7280">200</text>
  <text x="50" y="135" text-anchor="end" font-size="9" fill="#6B7280">400</text>
  <text x="50" y="90" text-anchor="end" font-size="9" fill="#6B7280">600</text>
  <text x="50" y="50" text-anchor="end" font-size="9" fill="#6B7280">800</text>
  <line x1="60" y1="180" x2="460" y2="180" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="135" x2="460" y2="135" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="90" x2="460" y2="90" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Total water use line -->
  <polyline points="110,120 190,130 270,125 350,115 430,105" fill="none" stroke="#3B82F6" stroke-width="2.5"/>
  <circle cx="110" cy="120" r="4" fill="#3B82F6"/>
  <circle cx="190" cy="130" r="4" fill="#3B82F6"/>
  <circle cx="270" cy="125" r="4" fill="#3B82F6"/>
  <circle cx="350" cy="115" r="4" fill="#3B82F6"/>
  <circle cx="430" cy="105" r="4" fill="#3B82F6"/>
  <!-- Recycled water line -->
  <polyline points="110,175 190,165 270,150 350,130 430,110" fill="none" stroke="#10B981" stroke-width="2.5"/>
  <circle cx="110" cy="175" r="4" fill="#10B981"/>
  <circle cx="190" cy="165" r="4" fill="#10B981"/>
  <circle cx="270" cy="150" r="4" fill="#10B981"/>
  <circle cx="350" cy="130" r="4" fill="#10B981"/>
  <circle cx="430" cy="110" r="4" fill="#10B981"/>
  <!-- Data labels -->
  <text x="110" y="115" text-anchor="middle" font-size="8" fill="#3B8262">520</text>
  <text x="190" y="125" text-anchor="middle" font-size="8" fill="#3B8262">480</text>
  <text x="270" y="120" text-anchor="middle" font-size="8" fill="#3B8262">500</text>
  <text x="350" y="110" text-anchor="middle" font-size="8" fill="#3B8262">540</text>
  <text x="430" y="100" text-anchor="middle" font-size="8" fill="#3B8262">580</text>
  <text x="110" y="240" text-anchor="middle" font-size="9" fill="#374151">2021</text>
  <text x="190" y="240" text-anchor="middle" font-size="9" fill="#374151">2022</text>
  <text x="270" y="240" text-anchor="middle" font-size="9" fill="#374151">2023</text>
  <text x="350" y="240" text-anchor="middle" font-size="9" fill="#374151">2024</text>
  <text x="430" y="240" text-anchor="middle" font-size="9" fill="#374151">2025</text>
  <rect x="130" y="255" width="15" height="10" fill="#3B82F6" rx="2"/>
  <text x="150" y="264" font-size="9" fill="#374151">總取水量（千公升）</text>
  <rect x="280" y="255" width="15" height="10" fill="#10B981" rx="2"/>
  <text x="300" y="264" font-size="9" fill="#374151">回收再利用量（千公升）</text>
  <text x="250" y="285" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 水資源管理報告 {{report_year}}</text>
</svg>

<h3>4.3 水資源指標</h3>

<table>
<thead>
<tr><th>水資源指標</th><th>2025年</th><th>2024年</th><th>目標</th><th>達成率</th></tr>
</thead>
<tbody>
<tr><td>總取水量（千公升）</td><td>580,000</td><td>620,000</td><td>550,000</td><td>94.8%</td></tr>
<tr><td>回收再利用量（千公升）</td><td>435,000</td><td>390,000</td><td>412,500</td><td>100%</td></tr>
<tr><td>水回收再利用率（%）</td><td>75%</td><td>63%</td><td>75%</td><td>100%</td></tr>
<tr><td>用水密集度（千公升/百萬元營收）</td><td>128</td><td>145</td><td>120</td><td>93.8%</td></tr>
<tr><td>排放水質合格率（%）</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td></tr>
<tr><td>高水壓力區域廠區用水占比</td><td>18%</td><td>22%</td><td>15%</td><td>83.3%</td></tr>
</tbody>
</table>

<h3>4.4 各廠區用水分布</h3>

<table>
<thead>
<tr><th>廠區</th><th>取水量（千公升）</th><th>回收量（千公升）</th><th>回收率</th><th>水壓力等級</th></tr>
</thead>
<tbody>
<tr><td>台灣總部廠區</td><td>220,000</td><td>187,000</td><td>85%</td><td>低</td></tr>
<tr><td>中國大陸廠區A</td><td>180,000</td><td>126,000</td><td>70%</td><td>高</td></tr>
<tr><td>中國大陸廠區B</td><td>120,000</td><td>84,000</td><td>70%</td><td>中</td></tr>
<tr><td>東南亞廠區</td><td>60,000</td><td>38,000</td><td>63%</td><td>中</td></tr>
</tbody>
</table>

<h3>4.5 水資源保護措施</h3>
<p>本公司已實施多項水資源保護措施，包括：雨水回收系統（年回收量約 15,000 千公升）、製程用水循環再利用系統（回收率達 85%）、排放水處理設施升級（排放水質 COD 低於 50 mg/L，優於法規標準 100 mg/L）、以及節水教育訓練（員工節水意識提升活動）。</p>

<h3>4.6 附註</h3>
<p>本章节水資源數據涵蓋 {{company_name}} 所有營運據點。水風險評估採用 WRI Aqueduct 3.0 工具。排放水質監測依放流水標準定期檢測，檢測報告可向主管機關申請調閱。</p>`
});

// ============ CH-05: 廢棄物與循環經濟 ============
sections.push({
  id: 'ch-05',
  title: 'Ch.5 廢棄物與循環經濟',
  chapter: 5,
  wordCount: 2000,
  griAlignment: ['GRI-306-1', 'GRI-306-2', 'GRI-306-3', 'GRI-306-4', 'GRI-306-5', 'SASB-IF-EU-150a.1'],
  hasChart: true,
  chartType: 'bar',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{waste_total_tons}}', '{{recycling_rate}}'],
  content: `<h2>Ch.5 廢棄物與循環經濟</h2>

<h3>5.1 廢棄物管理政策</h3>
<p>{{company_name}} 秉持「源頭減量、循環再生、零廢棄」的廢棄物管理理念，建立完善的廢棄物分類、回收與處理體系。本公司已制定廢棄物管理辦法，明確規範各類廢棄物的分類標準、貯存方式、清運流程及最終處置方式，並定期進行內部稽核與外部查證。</p>

<p>本公司設定的廢棄物管理目標包括：{{report_year}} 年廢棄物回收再利用率達 85%、有害廢棄物妥善處理率 100%、2030 年達成零掩埋（Zero Landfill）目標。為推動循環經濟，本公司積極投入產品生態設計、材料回收再利用技術研發，以及產業共生合作計畫。</p>

<h3>5.2 廢棄物回收率趨勢</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 5.1 廢棄物回收再利用率趨勢（%）</text>
  <line x1="60" y1="45" x2="60" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <text x="50" y="225" text-anchor="end" font-size="9" fill="#6B7280">0%</text>
  <text x="50" y="185" text-anchor="end" font-size="9" fill="#6B7280">50%</text>
  <text x="50" y="145" text-anchor="end" font-size="9" fill="#6B7280">70%</text>
  <text x="50" y="105" text-anchor="end" font-size="9" fill="#6B7280">80%</text>
  <text x="50" y="65" text-anchor="end" font-size="9" fill="#6B7280">90%</text>
  <line x1="60" y1="185" x2="460" y2="185" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="145" x2="460" y2="145" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="105" x2="460" y2="105" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="65" x2="460" y2="65" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Target line -->
  <line x1="60" y1="85" x2="460" y2="85" stroke="#EF4444" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="465" y="88" font-size="8" fill="#EF4444">目標85%</text>
  <!-- Bars -->
  <rect x="95" y="130" width="50" height="90" fill="#3B82F6" rx="3"/>
  <text x="120" y="125" text-anchor="middle" font-size="9" fill="#374151">68%</text>
  <rect x="175" y="110" width="50" height="110" fill="#3B82F6" rx="3"/>
  <text x="200" y="105" text-anchor="middle" font-size="9" fill="#374151">75%</text>
  <rect x="255" y="90" width="50" height="130" fill="#3B82F6" rx="3"/>
  <text x="280" y="85" text-anchor="middle" font-size="9" fill="#374151">80%</text>
  <rect x="335" y="75" width="50" height="145" fill="#10B981" rx="3"/>
  <text x="360" y="70" text-anchor="middle" font-size="9" fill="#374151">85%</text>
  <text x="120" y="240" text-anchor="middle" font-size="9" fill="#374151">2022</text>
  <text x="200" y="240" text-anchor="middle" font-size="9" fill="#374151">2023</text>
  <text x="280" y="240" text-anchor="middle" font-size="9" fill="#374151">2024</text>
  <text x="360" y="240" text-anchor="middle" font-size="9" fill="#374151">2025</text>
  <text x="250" y="270" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 廢棄物管理報告 {{report_year}}</text>
</svg>

<h3>5.3 廢棄物產出與處理</h3>

<table>
<thead>
<tr><th>廢棄物類別</th><th>2025年（噸）</th><th>2024年（噸）</th><th>目標</th><th>達成率</th></tr>
</thead>
<tbody>
<tr><td>一般事業廢棄物</td><td>2,850</td><td>3,200</td><td>2,700</td><td>94.7%</td></tr>
<tr><td>可回收再利用</td><td>2,422</td><td>2,400</td><td>2,295</td><td>100%</td></tr>
<tr><td>回收再利用率（%）</td><td>85%</td><td>75%</td><td>85%</td><td>100%</td></tr>
<tr><td>有害事業廢棄物</td><td>185</td><td>210</td><td>180</td><td>97.3%</td></tr>
<tr><td>有害廢棄物妥善處理率（%）</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td></tr>
<tr><td>廢棄物密集度（噸/百萬元營收）</td><td>0.63</td><td>0.76</td><td>0.60</td><td>95.2%</td></tr>
</tbody>
</table>

<h3>5.4 循環經濟推動計畫</h3>

<table>
<thead>
<tr><th>計畫名稱</th><th>投入金額（萬元）</th><th>年效益（萬元）</th><th>減廢量（噸/年）</th><th>狀態</th></tr>
</thead>
<tbody>
<tr><td>產品生態設計導入</td><td>1,500</td><td>2,800</td><td>450</td><td>執行中</td></tr>
<tr><td>包裝材料減量計畫</td><td>800</td><td>1,200</td><td>320</td><td>已完成</td></tr>
<tr><td>產業共生合作平台</td><td>2,200</td><td>3,500</td><td>680</td><td>執行中</td></tr>
<tr><td>材料回收技術研發</td><td>3,500</td><td>1,800</td><td>280</td><td>研發中</td></tr>
<tr><td>供應商包裝回收計畫</td><td>600</td><td>900</td><td>150</td><td>執行中</td></tr>
</tbody>
</table>

<h3>5.5 附註</h3>
<p>本章节廢棄物數據涵蓋 {{company_name}} 所有營運據點。有害事業廢棄物均委託合格清除處理機構處理，並依法進行網路申報。回收再利用率計算方式為（回收再利用量／總廢棄物產出量）× 100%。</p>`
});

// ============ CH-06: 生物多樣性 ============
sections.push({
  id: 'ch-06',
  title: 'Ch.6 生物多樣性與生態保護',
  chapter: 6,
  wordCount: 2000,
  griAlignment: ['GRI-304-1', 'GRI-304-2', 'GRI-304-3', 'GRI-304-4', 'SASB-IF-EU-160a.1', 'TNFD'],
  hasChart: true,
  chartType: 'radar',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{protected_area_ha}}', '{{species_count}}'],
  content: `<h2>Ch.6 生物多樣性與生態保護</h2>

<h3>6.1 生物多樣性政策與承諾</h3>
<p>{{company_name}} 認知生物多樣性是地球生態系統的基石，也是人類社會永續發展的基礎。本公司承諾在營運過程中，避免對生物多樣性造成不可逆的負面影響，並積極投入生態保育與棲地復育工作。本公司已制定生物多樣性政策，承諾不開發自然保護區、不破壞關鍵棲地、並對營運據點周邊的生態系統進行定期監測。</p>

<p>本公司參照 TNFD（自然相關財務揭露工作小組）架構，進行自然依賴性與影響評估，識別價值鏈中對自然資本的依賴程度，並制定對應的管理策略。同時，本公司積極參與國際生物多樣性保育倡議，支持在地社區的生態保育行動。</p>

<h3>6.2 物種影響評估雷達圖</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="20" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 6.1 生物多樣性影響評估雷達圖</text>
  <!-- Radar chart center (250,150), radius 90 -->
  <!-- Grid circles -->
  <circle cx="250" cy="150" r="18" fill="none" stroke="#E5E7EB" stroke-width="0.5"/>
  <circle cx="250" cy="150" r="36" fill="none" stroke="#E5E7EB" stroke-width="0.5"/>
  <circle cx="250" cy="150" r="54" fill="none" stroke="#E5E7EB" stroke-width="0.5"/>
  <circle cx="250" cy="150" r="72" fill="none" stroke="#E5E7EB" stroke-width="0.5"/>
  <circle cx="250" cy="150" r="90" fill="none" stroke="#D1D5DB" stroke-width="1"/>
  <!-- Axes: 6 dimensions -->
  <!-- Top: 棲地保護 -->
  <line x1="250" y1="150" x2="250" y2="60" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="250" y="52" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">棲地保護</text>
  <!--右上: 物種多樣性 -->
  <line x1="250" y1="150" x2="328" y2="105" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="340" y="100" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">物種多樣性</text>
  <!--右下: 水生態 -->
  <line x1="250" y1="150" x2="328" y2="195" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="340" y="205" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">水生態</text>
  <!-- Bottom: 土壤健康 -->
  <line x1="250" y1="150" x2="250" y2="240" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="250" y="255" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">土壤健康</text>
  <!--左下: 空氣品質 -->
  <line x1="250" y1="150" x2="172" y2="195" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="160" y="205" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">空氣品質</text>
  <!--左上: 生態廊道 -->
  <line x1="250" y1="150" x2="172" y2="105" stroke="#D1D5DB" stroke-width="0.5"/>
  <text x="155" y="100" text-anchor="middle" font-size="9" fill="#374151" font-weight="bold">生態廊道</text>
  <!-- 2024 data polygon -->
  <polygon points="250,80 310,115 300,185 250,210 190,185 195,115" fill="#3B82F6" fill-opacity="0.2" stroke="#3B82F6" stroke-width="1.5"/>
  <!-- 2025 data polygon -->
  <polygon points="250,72 320,108 315,180 250,200 180,180 185,108" fill="#10B981" fill-opacity="0.3" stroke="#10B981" stroke-width="1.5"/>
  <!-- Data points 2025 -->
  <circle cx="250" cy="72" r="3" fill="#10B981"/>
  <circle cx="320" cy="108" r="3" fill="#10B981"/>
  <circle cx="315" cy="180" r="3" fill="#10B981"/>
  <circle cx="250" cy="200" r="3" fill="#10B981"/>
  <circle cx="180" cy="180" r="3" fill="#10B981"/>
  <circle cx="185" cy="108" r="3" fill="#10B981"/>
  <!-- Legend -->
  <rect x="80" y="265" width="15" height="10" fill="#3B82F6" fill-opacity="0.4" stroke="#3B82F6" stroke-width="1"/>
  <text x="100" y="274" font-size="9" fill="#374151">2024年</text>
  <rect x="180" y="265" width="15" height="10" fill="#10B981" fill-opacity="0.4" stroke="#10B981" stroke-width="1"/>
  <text x="200" y="274" font-size="9" fill="#374151">2025年</text>
  <text x="250" y="292" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 生物多樣性評估報告 {{report_year}}</text>
</svg>

<h3>6.3 生物多樣性指標</h3>

<table>
<thead>
<tr><th>指標</th><th>2025年</th><th>2024年</th><th>目標</th><th>達成率</th></tr>
</thead>
<tbody>
<tr><td>受保護或復育面積（公頃）</td><td>120</td><td>95</td><td>120</td><td>100%</td></tr>
<tr><td>營運據點周邊物種調查種類數</td><td>285</td><td>260</td><td>280</td><td>100%</td></tr>
<tr><td>關鍵棲地影響評估完成率（%）</td><td>100%</td><td>85%</td><td>100%</td><td>100%</td></tr>
<tr><td>生態保育投入金額（萬元）</td><td>1,850</td><td>1,500</td><td>1,800</td><td>100%</td></tr>
<tr><td>棲地復育計畫數量</td><td>8</td><td>6</td><td>8</td><td>100%</td></tr>
</tbody>
</table>

<h3>6.4 生態保護行動</h3>

<table>
<thead>
<tr><th>行動計畫</th><th>執行期間</th><th>投入金額（萬元）</th><th>預期成效</th><th>狀態</th></tr>
</thead>
<tbody>
<tr><td>廠區周邊生態廊道建置</td><td>2023-2025</td><td>2,500</td><td>恢復生物遷徙通道</td><td>執行中</td></tr>
<tr><td>濕地復育計畫</td><td>2022-2026</td><td>3,200</td><td>復育濕地面積 50 公頃</td><td>執行中</td></tr>
<tr><td>瀕危物種保育合作</td><td>2021-2030</td><td>1,800</td><td>保護 5 種瀕危物種</td><td>持續進行</td></tr>
<tr><td>員工生態教育訓練</td><td>每年</td><td>300</td><td>每年 500 人次參與</td><td>持續進行</td></tr>
<tr><td>社區生態監測網絡</td><td>2024-2027</td><td>1,200</td><td>建立 10 個監測站</td><td>規劃中</td></tr>
</tbody>
</table>

<h3>6.5 附註</h3>
<p>本章节生物多樣性數據涵蓋 {{company_name}} 所有營運據點周邊環境。物種調查委託專業生態顧問公司辦理，調查方法遵循國際生物多樣性監測標準。棲地影響評估依據 IFC 績效標準第 6 條（生物多樣性保護）進行。</p>`
});

// ============ CH-07: 員工福祉 ============
sections.push({
  id: 'ch-07',
  title: 'Ch.7 員工福祉與人力資本',
  chapter: 7,
  wordCount: 2000,
  griAlignment: ['GRI-401-1', 'GRI-401-2', 'GRI-401-3', 'GRI-404-1', 'GRI-404-2', 'GRI-404-3', 'SASB-IF-EU-330a.1'],
  hasChart: true,
  chartType: 'line',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{total_employees}}', '{{turnover_rate}}'],
  content: `<h2>Ch.7 員工福祉與人力資本</h2>

<h3>7.1 人力資本策略</h3>
<p>{{company_name}} 視員工為企業最重要的資產，致力於打造一個安全、健康、多元、包容且充滿成長機會的工作環境。本公司的人力資本策略以「吸引人才、發展人才、留住人才」為三大主軸，透過具競爭力的薪酬福利、完善的職涯發展體系、以及積極的健康促進計畫，實現員工與企業的共同成長。</p>

<p>截至 {{report_year}} 年底，本公司全球員工人數達 {{total_employees}} 人，其中全職員工占比 95%，兼職及約聘員工占比 5%。本公司嚴格遵守勞動法規，禁止任何形式的強迫勞動與童工，並確保所有員工均享有平等的就業機會與發展空間。</p>

<h3>7.2 離職率與敬業度趨勢</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 7.1 員工離職率與敬業度趨勢</text>
  <line x1="60" y1="45" x2="60" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <text x="50" y="225" text-anchor="end" font-size="9" fill="#6B7280">0</text>
  <text x="50" y="180" text-anchor="end" font-size="9" fill="#6B7280">10</text>
  <text x="50" y="135" text-anchor="end" font-size="9" fill="#6B7280">30</text>
  <text x="50" y="90" text-anchor="end" font-size="9" fill="#6B7280">50</text>
  <text x="50" y="50" text-anchor="end" font-size="9" fill="#6B7280">70</text>
  <line x1="60" y1="180" x2="460" y2="180" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="135" x2="460" y2="135" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="90" x2="460" y2="90" stroke="#E5E7EB" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Turnover rate line -->
  <polyline points="110,155 190,145 270,130 350,115 430,105" fill="none" stroke="#EF4444" stroke-width="2.5"/>
  <circle cx="110" cy="155" r="4" fill="#EF4444"/>
  <circle cx="190" cy="145" r="4" fill="#EF4444"/>
  <circle cx="270" cy="130" r="4" fill="#EF4444"/>
  <circle cx="350" cy="115" r="4" fill="#EF4444"/>
  <circle cx="430" cy="105" r="4" fill="#EF4444"/>
  <!-- Engagement score line -->
  <polyline points="110,100 190,95 270,85 350,78 430=72" fill="none" stroke="#10B981" stroke-width="2.5"/>
  <circle cx="110" cy="100" r="4" fill="#10B981"/>
  <circle cx="190" cy="95" r="4" fill="#10B981"/>
  <circle cx="270" cy="85" r="4" fill="#10B981"/>
  <circle cx="350" cy="78" r="4" fill="#10B981"/>
  <circle cx="430" cy="72" r="4" fill="#10B981"/>
  <text x="110" y="240" text-anchor="middle" font-size="9" fill="#374151">2021</text>
  <text x="190" y="240" text-anchor="middle" font-size="9" fill="#374151">2022</text>
  <text x="270" y="240" text-anchor="middle" font-size="9" fill="#374151">2023</text>
  <text x="350" y="240" text-anchor="middle" font-size="9" fill="#374151">2024</text>
  <text x="430" y="240" text-anchor="middle" font-size="9" fill="#374151">2025</text>
  <rect x="130" y="255" width="15" height="10" fill="#EF4444" rx="2"/>
  <text x="150" y="264" font-size="9" fill="#374151">離職率（%）</text>
  <rect x="260" y="255" width="15" height="10" fill="#10B981" rx="2"/>
  <text x="280" y="264" font-size="9" fill="#374151">敬業度分數</text>
  <text x="250" y="285" text-anchor="middle" fill="#6B7280" font-size="8">資料來源：{{company_name}} 人力資源報告 {{report_year}}</text>
</svg>

<h3>7.3 人力資源指標</h3>

<table>
<thead>
<tr><th>指標</th><th>2025年</th><th>2024年</th><th>目標</th><th>達成率</th></tr>
</thead>
<tbody>
<tr><td>總員工人數</td><td>{{total_employees}}</td><td>12,500</td><td>-</td><td>-</td></tr>
<tr><td>自願離職率（%）</td><td>8.5%</td><td>10.2%</td><td>9.0%</td><td>100%</td></tr>
<tr><td>員工敬業度分數</td><td>72</td><td>68</td><td>75</td><td>96.0%</td></tr>
<tr><td>人均訓練時數（小時）</td><td>42</td><td>36</td><td>40</td><td>100%</td></tr>
<tr><td>女性主管比例（%）</td><td>32%</td><td>28%</td><td>30%</td><td>100%</td></tr>
<tr><td>育嬰留停復職率（%）</td><td>92%</td><td>88%</td><td>90%</td><td>100%</td></tr>
</tbody>
</table>

<h3>7.4 薪酬福利與健康促進</h3>

<table>
<thead>
<tr><th>福利項目</th><th>2025年投入（萬元）</th><th>覆蓋率</th><th>員工滿意度</th></tr>
</thead>
<tbody>
<tr><td>員工健康檢查</td><td>2,800</td><td>100%</td><td>92%</td></tr>
<tr><td>心理健康支持計畫</td><td>1,200</td><td>100%</td><td>88%</td></tr>
<tr><td>彈性工時與遠端工作</td><td>-</td><td>85%</td><td>95%</td></tr>
<tr><td>員工持股信託</td><td>5,500</td><td>90%</td><td>90%</td></tr>
<tr><td>子女教育補助</td><td>1,800</td><td>78%</td><td>85%</td></tr>
<tr><td>運動與休閒設施</td><td>3,200</td><td>100%</td><td>87%</td></tr>
</tbody>
</table>

<h3>7.5 附註</h3>
<p>本章节人力資源數據涵蓋 {{company_name}} 全球營運據點。離職率計算方式為自願離職人數除以平均員工人數。敬業度調查每年進行一次，採用蓋洛普 Q12 問卷。薪酬數據依當地法規與市場水準制定，確保同工同酬。</p>`
});

// ============ CH-08: 多元平等與包容 ============
sections.push({
  id: 'ch-08',
  title: 'Ch.8 多元平等與包容',
  chapter: 8,
  wordCount: 2000,
  griAlignment: ['GRI-405-1', 'GRI-405-2', 'GRI-406-1', 'SASB-IF-EU-330a.2', 'SASB-IF-EU-330a.3'],
  hasChart: true,
  chartType: 'bar',
  placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{female_ratio}}', '{{disability_hires}}'],
  content: `<h2>Ch.8 多元平等與包容</h2>

<h3>8.1 DEI 政策與承諾</h3>
<p>{{company_name}} 堅信多元、平等與包容（DEI）是企業創新與永續發展的關鍵驅動力。本公司已制定多元平等與包容政策，承諾在招聘、晉升、薪酬、訓練等所有人力資源管理中，不因性別、年齡、種族、宗教、身心障礙、性傾向等因素而有所歧視。本公司並設立多元共融委員會，由人力資源副總擔任主席，定期檢視 DEI 執行成效。</p>

<p>本公司設定的 DEI 目標包括：{{report_year}} 年女性主管比例達 30%、身心障礙者僱用率達 2%、員工 DEI 訓練覆蓋率 100%。本公司亦積極參與國際 DEI 倡議，包括聯合國全球契約、Women's Empowerment Principles（WEPs）等。</p>

<h3>8.2 多元化指標</h3>

<svg width="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="500" height="300" fill="#FAFAFA" rx="5"/>
  <text x="250" y="25" text-anchor="middle" fill="#003262" font-size="14" font-weight="bold">圖 8.1 員工多元化結構（{{report_year}}年）</text>
  <line x1="60" y1="45" x2="60" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <line x1="60" y1="220" x2="460" y2="220" stroke="#9CA3AF" stroke-width="1"/>
  <text x="50" y="225" text-anchor="end" font-size="9" fill="#6B7280">0%</text>
  <text x="50" y="185" text-anchor="end" font-size="9" fill="#6B7280">20%</text>
  <text x="50" y="145" text-anchor="end" font-size="9" fill="#6B72