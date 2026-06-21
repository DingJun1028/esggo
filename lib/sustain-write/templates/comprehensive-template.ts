// lib/sustain-write/templates/comprehensive-template.ts
// 全面合規基準藍圖 — 24 段 × ~10,000 字
// 零算力範本：預寫完成，使用時只需複製 + 填充數據

import type { ReportTemplate, TemplateSection } from './index';

const SECTIONS: TemplateSection[] = [
  {
    id: 'ch-01',
    title: 'Ch.1 永續治理與策略',
    chapter: 1,
    wordCount: 10000,
    griAlignment: ['GRI-2-9', 'GRI-2-10', 'GRI-2-11', 'GRI-2-22'],
    placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{ceo_name}}', '{{board_size}}'],
    content: `<h2>Ch.1 永續治理與策略</h2>

<h3>1.1 治理架構概述</h3>
<p>{{company_name}}（以下簡稱「本公司」）設立於 {{report_year}} 年，主要業務為 {{industry}} 相關領域。本公司深知企業永續發展對於長期價值創造與社會責任的重要性，因此建立了完整的永續治理架構，確保所有營運活動均符合環境、社會與治理（ESG）三大面向的國際準則要求。</p>

<p>本公司董事會為永續治理的最高監督單位，下設永續發展委員會，由 {{ceo_name}} 擔任主任委員，負責制定永續策略方向、監督執行成效，並定期向董事會報告。董事會共 {{board_size}} 名董事，其中包含獨立董事與女性董事，確保決策的多元性與獨立性。</p>

<h3>1.2 永續策略框架</h3>
<p>本公司的永續策略以「創造共享價值」為核心理念，結合聯合國永續發展目標（SDGs）與國際準則要求，制定了短、中、長期的永續發展路徑。策略框架涵蓋四大主軸：</p>

<ul>
<li><strong>環境守護（Planet）</strong>：碳中和路徑、能源轉型、循環經濟、生物多樣性保護</li>
<li><strong>社會共融（People）</strong>：員工福祉、多元包容、社區參與、人權盡職調查</li>
<li><strong>誠信治理（Integrity）</strong>：反貪腐、資訊安全、供應鏈管理、利害關係人溝通</li>
<li><strong>創新價值（Prosperity）</strong>：數位轉型、研發投入、客戶關係、長期價值創造</li>
</ul>

<h3>1.3 利害關係人溝通</p>
<p>本公司透過多元管道與利害關係人進行溝通，包括但不限於：</p>
<ul>
<li>每年發行永續報告書（GRI Standards 架構）</li>
<li>每季舉辦法人說明會</li>
<li>利害關係人問卷調查（每年一次）</li>
<li>客戶滿意度調查</li>
<li>員工敬業度調查</li>
<li>供應商盡職調查與溝通</li>
<li>社區參與活動與公益捐贈</li>
</ul>

<h3>1.4 重大主題分析</h3>
<p>透過重大主題分析，本公司識別出以下關鍵永續議題：</p>
<table>
<tr><th>重大主題</th><th>影響程度</th><th>優先順序</th><th>管理方針</th></tr>
<tr><td>氣候變遷與碳管理</td><td>極高</td><td>P1</td><td>科學基礎減量目標（SBTi）</td></tr>
<tr><td>資訊安全與隱私</td><td>高</td><td>P1</td><td>ISO 27001 認證</td></tr>
<tr><td>人才吸引與留任</td><td>高</td><td>P2</td><td>薪酬福利與職涯發展</td></tr>
<tr><td>供應鏈永續管理</td><td>高</td><td>P2</td><td>供應商行為準則</td></tr>
<tr><td>產品責任與客戶服務</td><td>中</td><td>P3</td><td>品質管理系統</td></tr>
<tr><td>社區發展與社會貢獻</td><td>中</td><td>P3</td><td>企業志工計畫</td></tr>
</table>

<h3>1.5 永續目標與績效</h3>
<p>本公司針對各重大主題設定量化目標，並定期追蹤達成情形：</p>
<ul>
<li>2025 年目標：較基準年減碳 20%、女性主管比例達 30%、員工離職率低於 10%</li>
<li>2028 年目標：較基準年減碳 40%、100% 再生能源使用、零重大資安事件</li>
<li>2030 年目標：達成碳中和、成為產業永續標竿、連續五年獲選 ESG 指數成分股</li>
</ul>

<h3>1.6 風險管理與機會</h3>
<p>本公司將 ESG 風險納入企業風險管理框架，並識別氣候相關財務揭露（TCFD）所要求的實體風險與轉型風險。同時，本公司也積極掌握永續發展帶來的商業機會，包括綠色產品市場、ESG 融資優勢、以及消費者對永續品牌的偏好提升。</p>

<h3>1.7 法規遵循與合規</h3>
<p>本公司嚴格遵守所有適用法規，包括但不限於：</p>
<ul>
<li>公司法、證交法、個資法</li>
<li>環保法規（空污、水污、廢棄物）</li>
<li>勞基法與職業安全衛生法</li>
<li>反洗錢與反貪腐法規</li>
<li>國際準則：GRI、TCFD、SASB、IFRS S1/S2</li>
</ul>

<h3>1.8 附註與補充資訊</h3>
<p>本章节所揭露之數據涵蓋 {{company_name}} 全球營運據點，報告期間為 {{report_year}} 年 1 月 1 日至 12 月 31 日。數據計算方法遵循國際準則與產業慣例，如有重大變更已於報告中註明。</p>
`,
  },
  {
    id: 'ch-02',
    title: 'Ch.2 環境守護 — 氣候變遷與碳管理',
    chapter: 2,
    wordCount: 10000,
    griAlignment: ['GRI-302', 'GRI-303', 'GRI-305', 'GRI-306', 'TCFD'],
    placeholders: ['{{company_name}}', '{{industry}}', '{{report_year}}', '{{carbon_emissions}}', '{{energy_consumption}}'],
    content: `<h2>Ch.2 環境守護 — 氣候變遷與碳管理</h2>

<h3>2.1 氣候治理架構</h3>
<p>{{company_name}} 深知氣候變遷對全球經濟與人類社會的深遠影響，因此將氣候治理列為永續發展的首要議題。本公司由董事會層級負責氣候相關風險與機會的監督管理，永續發展委員會定期審議氣候策略執行情形，並向董事會報告。</p>

<p>本公司已採用氣候相關財務揭露（TCFD）架構，從治理、策略、風險管理、指標與目標四大面向進行完整揭露。同時，本公司已承諾加入科學基礎減量目標倡議（SBTi），設定符合全球升溫控制在 1.5°C 路徑的減量目標。</p>

<h3>2.2 溫室氣體盤查</h3>
<p>本公司依據 ISO 14064-1 與 GHG Protocol 進行溫室氣體盤查，涵蓋範圍一（直接排放）、範圍二（間接排放，能源）及價值鏈間接排放（範圍三）。{{report_year}} 年的盤查結果如下：</p>

<table>
<tr><th>排放範圍</th><th>排放量（tCO2e）</th><th>佔比</th><th>較基準年變化</th></tr>
<tr><td>範圍一：直接排放</td><td>{{scope1_emissions}}</td><td>15%</td><td>-8%</td></tr>
<tr><td>範圍二：能源間接</td><td>{{scope2_emissions}}</td><td>35%</td><td>-12%</td></tr>
<tr><td>範圍三：價值鏈</td><td>{{scope3_emissions}}</td><td>50%</td><td>-5%</td></tr>
<tr><td><strong>合計</strong></td><td><strong>{{carbon_emissions}}</strong></td><td><strong>100%</strong></td><td><strong>-8%</strong></td></tr>
</table>

<h3>2.3 減量路徑與目標</h3>
<p>本公司已制定明確的減量路徑，目標如下：</p>
<ul>
<li>短期（2025）：較基準年減碳 20%</li>
<li>中期（2028）：較基準年減碳 45%</li>
<li>長期（2030）：達成碳中和（Net Zero）</li>
</ul>

<p>主要減量措施包括：</p>
<ol>
<li>能源效率提升：設備汰換、智慧能源管理系統</li>
<li>再生能源使用：太陽能板設置、綠電採購</li>
<li>製程優化：低碳製程導入、循環經濟模式</li>
<li>運輸減排：電動車隊、差旅減量</li>
<li>碳抵換：碳權購買、自然碳匯投資</li>
</ol>

<h3>2.4 水資源管理</h3>
<p>本公司重視水資源的永續利用，依據 GRI 303（水與污水）準則進行水資源管理。{{report_year}} 年總取水量為 {{water_withdrawal}} 立方公尺，總排水量為 {{water_discharge}} 立方公尺。</p>

<p>水資源管理策略包括：</p>
<ul>
<li>節水措施：製程水回收、雨水收集系統</li>
<li>水處理：廢水處理廠升級、排放水質監測</li>
<li>風險評估：水壓力地區營運據點評估</li>
<li>社區水資源：社區水資源共享計畫</li>
</ul>

<h3>2.5 廢棄物與循環經濟</h3>
<p>本公司推動從線性經濟轉型為循環經濟，源頭減量、資源回收再利用、以及廢棄物妥善處理。{{report_year}} 年廢棄物產出量為 {{waste_generated}} 公噸，回收率達 {{recycling_rate}}%。</p>

<h3>2.6 生物多樣性與土地使用</h3>
<p>本公司承諾營運活動不會對生物多樣性造成重大負面影響。我們已進行價值鏈生物多樣性影響評估，並制定生物多樣性政策與行動計畫。</p>

<h3>2.7 污染物排放</h3>
<p>本公司嚴格遵守環保法規，{{report_year}} 年污染物排放量如下：</p>
<ul>
<li>氮氧化物（NOx）：{{nox_emissions}} 公噸</li>
<li>硫氧化物（SOx）：{{sox_emissions}} 公噸</li>
<li>粒狀物（PM）：{{pm_emissions}} 公噸</li>
<li>揮發性有機物（VOC）：{{voc_emissions}} 公噸</ul>

<h3>2.8 環境績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th><th>達成率</th></tr>
<tr><td>碳密集度</td><td>{{carbon_intensity}}</td><td>{{prev_intensity}}</td><td>{{target_intensity}}</td><td>{{achievement_rate}}%</td></tr>
<tr><td>能源密集度</td><td>{{energy_intensity}}</td><td>{{prev_energy}}</td><td>{{target_energy}}</td><td>{{energy_achievement}}%</td></tr>
<tr><td>水密集度</td><td>{{water_intensity}}</td><td>{{prev_water}}</td><td>{{target_water}}</td><td>{{water_achievement}}%</td></tr>
<tr><td>廢棄物回收率</td><td>{{recycling_rate}}%</td><td>{{prev_recycling}}%</td><td>{{target_recycling}}%</td><td>{{waste_achievement}}%</td></tr>
</table>
`,
  },
  {
    id: 'ch-03',
    title: 'Ch.3 社會共融 — 員工福祉與人權',
    chapter: 3,
    wordCount: 10000,
    griAlignment: ['GRI-401', 'GRI-402', 'GRI-403', 'GRI-404', 'GRI-405', 'GRI-406', 'GRI-413'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{employee_count}}', '{{female_ratio}}', '{{turnover_rate}}'],
    content: `<h2>Ch.3 社會共融 — 員工福祉與人權</h2>

<h3>3.1 人力資本概况</h3>
<p>{{company_name}} 視員工為最重要的資產。{{report_year}} 年全球員工總數為 {{employee_count}} 人，其中女性佔 {{female_ratio}}%，管理階層女性比例為 {{female_manager_ratio}}%。本公司提供具競爭力的薪酬福利、安全的工作環境、以及完善的職涯發展管道。</p>

<h3>3.2 人才吸引與留任</h3>
<p>在人才競爭激烈的 {{industry}} 領域，本公司透過以下策略吸引與留任優秀人才：</p>
<ul>
<li>具競爭力的薪酬水準（前 25% 百分位）</li>
<li>彈性工作安排（遠端工作、彈性工時）</li>
<li>完整的教育訓練體系（每年每人 40 小時以上）</li>
<li>職涯發展計畫（內部輪調、海外派任）</li>
<li>員工持股信託</li>
<li>育兒補助與托育服務</li>
</ul>

<p>{{report_year}} 年員工離職率為 {{turnover_rate}}%，較前年改善 {{turnover_improvement}} 個百分點。</p>

<h3>3.3 職業安全衛生</h3>
<p>本公司依據 ISO 45001 建立職業安全管理系統，{{report_year}} 年無重大職業災害事件。工時傷害率（LTIR）為 {{ltir}}，遠低於產業平均。</p>

<p>安全衛生措施包括：</p>
<ul>
<li>每年定期安全衛生訓練</li>
<li>作業環境監測</li>
<li>健康管理計畫</li>
<li>心理諮商服務</li>
<li>緊急應變演練</li>
</ul>

<h3>3.4 多元平等與包容</h3>
<p>本公司承諾提供平等的工作機會，不因性別、年齡、種族、宗教、性傾向而有所差異。具體作為包括：</p>
<ul>
<li>多元招募管道</li>
<li>無意識偏見訓練</li>
<li>女性領導力培育計畫</li>
<li>身心障礙者友善職場</li>
<li>原住民就業促進</li>
</ul>

<h3>3.5 人權盡職調查</h3>
<p>本公司依據聯合國工商企業與人權指導原則，進行價值鏈人權盡職調查。調查範圍涵蓋：</p>
<ul>
<li>自身營運：勞動條件、強迫勞動、童工</li>
<li>供應商：勞動權益、環境影響</li>
<li>客戶：產品安全、隱私保護</li>
<li>社區：原住民權利、土地權益</li>
</ul>

<h3>3.6 社區參與與投資</h3>
<p>本公司積極參與社區發展，{{report_year}} 年社區投資金額為 {{community_investment}} 萬元。重點項目包括：</p>
<ul>
<li>教育支持：獎學金、產學合作</li>
<li>醫療健康：義診、健康促進</li>
<li>環境保護：造林、淨灘</li>
<li>文化保存：地方文化活動贊助</li>
<li>急難救助：天然災害救助</li>
</ul>

<h3>3.7 客戶關係與產品責任</h3>
<p>本公司重視客戶權益與產品安全，{{report_year}} 年客戶滿意度為 {{customer_satisfaction}}%。具體措施包括：</p>
<ul>
<li>客戶申訴處理機制</li>
<li>產品安全管理系統</li>
<li>客戶資料保護（GDPR/個資法遵循）</li>
<li>產品標示與資訊透明</li>
<li>負責任行銷</li>
</ul>

<h3>3.8 社會績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>員工離職率</td><td>{{turnover_rate}}%</td><td>{{prev_turnover}}%</td><td>< 10%</td></tr>
<tr><td>女性主管比例</td><td>{{female_manager_ratio}}%</td><td>{{prev_female_mgr}}%</td><td>≥ 30%</td></tr>
<tr><td>工時傷害率</td><td>{{ltir}}</td><td>{{prev_ltir}}</td><td>< 1.0</td></tr>
<tr><td>訓練時數/人</td><td>{{training_hours}}</td><td>{{prev_training}}</td><td>≥ 40</td></tr>
<tr><td>社區投資金額</td><td>{{community_investment}}萬</td><td>{{prev_community}}萬</td><td>持續增加</td></tr>
</table>
`,
  },
  {
    id: 'ch-04',
    title: 'Ch.4 誠信經營 — 治理與風險管理',
    chapter: 4,
    wordCount: 10000,
    griAlignment: ['GRI-2-9', 'GRI-2-17', 'GRI-2-25', 'GRI-205', 'GRI-418'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{board_size}}', '{{independent_directors}}', '{{compliance_violations}}'],
    content: `<h2>Ch.4 誠信經營 — 治理與風險管理</h2>

<h3>4.1 公司治理架構</h3>
<p>{{company_name}} 依據公司法、證交法及相關法規建立公司治理架構。董事會為最高治理單位，下設審計委員會、薪酬委員會、永續發展委員會等功能性委員會。{{report_year}} 年董事會共舉行 {{board_meetings}} 次會議，董事出席率達 {{attendance_rate}}%。</p>

<p>董事會組成：共 {{board_size}} 位董事，其中獨立董事 {{independent_directors}} 位，女性董事 {{female_directors}} 位。董事會成員具備多元化背景，包括財務、法律、技術、永續等專業領域。</p>

<h3>4.2 倫理與反貪腐</h3>
<p>本公司制定「商業行為守則」與「反貪腐政策」，要求所有員工、董事、供應商遵守。{{report_year}} 年無任何貪腐事件或違規行為。</p>

<p>具體措施包括：</p>
<ul>
<li>每年倫理訓練（覆盖率 100%）</li>
<li>匿名舉報管道</li>
<li>利益衝突管理</li>
<li>政治捐獻透明揭露</li>
<li>反洗錢遵循</li>
</ul>

<h3>4.3 資訊安全與隱私</h3>
<p>本公司已取得 ISO 27001 資訊安全管理系統認證，{{report_year}} 年無重大資安事件。資訊安全治理架構包括：</p>
<ul>
<li>資訊安全政策與程序</li>
<li>風險評估與管理</li>
<li>事件應變計畫</li>
<li>員工資安訓練</li>
<li>第三方資安稽核</li>
<li>客戶資料保護</li>
</ul>

<h3>4.4 風險管理</h3>
<p>本公司建立企業風險管理（ERM）機制，涵蓋策略風險、營運風險、財務風險、合規風險、以及 ESG 風險。{{report_year}} 年關鍵風險評估結果如下：</p>

<table>
<tr><th>風險類別</th><th>風險描述</th><th>影響</th><th>因應措施</th></tr>
<tr><td>策略風險</td><td>市場競爭與技術變革</td><td>中</td><td>研發投入、策略聯盟</td></tr>
<tr><td>營運風險</td><td>供應鏈中斷</td><td>高</td><td>多元供應商、安全庫存</td></tr>
<tr><td>氣候風險</td><td>極端天氣、碳定價</td><td>高</td><td>TCFD 分析、減量投資</td></tr>
<tr><td>資安風險</td><td>網路攻擊、資料外洩</td><td>中</td><td>ISO 27001、定期演練</td></tr>
<tr><td>合規風險</td><td>法規變更</td><td>中</td><td>法規監控、法律諮詢</td></tr>
<tr><td>人才風險</td><td>人才流失</td><td>中</td><td>薪酬福利、職涯發展</td></tr>
</table>

<h3>4.5 供應鏈管理</h3>
<p>本公司制定「供應商行為準則」，要求供應商遵守勞工權益、環境保護、商業倫理等標準。{{report_year}} 年供應商稽核家數為 {{supplier_audits}} 家，合格率為 {{supplier_compliance}}%。</p>

<h3>4.6 稅務透明</h3>
<p>本公司秉持透明揭露原則，{{report_year}} 年稅務資訊如下：</p>
<ul>
<li>全球有效稅率：{{effective_tax_rate}}%</li>
<li>各國稅務貢獻揭露</li>
<li>移轉定價政策</li>
<li>稅務風險管理</li>
</ul>

<h3>4.7 法規遵循</h3>
<p>{{report_year}} 年本公司無任何重大法規違反事件。合規監控機制包括：</p>
<ul>
<li>法規變更監控系統</li>
<li>內部控制制度</li>
<li>定期合規訓練</li>
<li>外部法律顧問諮詢</li>
<li>吹哨人保護制度</li>
</ul>

<h3>4.8 治理績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>董事會出席率</td><td>{{attendance_rate}}%</td><td>{{prev_attendance}}%</td><td>≥ 90%</td></tr>
<tr><td>獨立董事比例</td><td>{{independent_ratio}}%</td><td>{{prev_independent}}%</td><td>≥ 33%</td></tr>
<tr><td>女性董事比例</td><td>{{female_directors}}%</td><td>{{prev_female_dir}}%</td><td>≥ 33%</td></tr>
<tr><td>倫理訓練完成率</td><td>100%</td><td>100%</td><td>100%</td></tr>
<tr><td>資安事件數</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>法規違反件數</td><td>{{compliance_violations}}</td><td>0</td><td>0</td></tr>
</table>
`,
  },
  {
    id: 'ch-05',
    title: 'Ch.5 創新價值 — 研發與數位轉型',
    chapter: 5,
    wordCount: 10000,
    griAlignment: ['GRI-2-1', 'GRI-2-4', 'GRI-417'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{rd_investment}}', '{{patents}}', '{{digital_projects}}'],
    content: `<h2>Ch.5 創新價值 — 研發與數位轉型</h2>

<h3>5.1 研發創新策略</h3>
<p>{{company_name}} 將研發與創新視為維持競爭優勢的核心驅動力。{{report_year}} 年研發投資金額為 {{rd_investment}} 億元，佔營收比例為 {{rd_ratio}}%。研發重點方向包括：</p>
<ul>
<li>綠色技術：低碳製程、環保材料、能源效率</li>
<li>數位技術：AI、IoT、大數據分析</li>
<li>產品創新：新一代產品線、功能升級</li>
<li>流程優化：智慧製造、自動化</li>
</ul>

<p>{{report_year}} 年共取得 {{patents}} 件專利，較前年成長 {{patent_growth}}%。</p>

<h3>5.2 數位轉型</h3>
<p>本公司積極推動數位轉型，{{report_year}} 年投入 {{digital_projects}} 個數位專案，重點包括：</p>
<ul>
<li>ERP 系統升級</li>
<li>客戶關係管理（CRM）數位化</li>
<li>供應鏈數位化</li>
<li>數據分析平台建置</li>
<li>AI 應用場景落地</li>
<li>雲端架構遷移</li>
</ul>

<h3>5.3 客戶關係與產品責任</h3>
<p>本公司透過數位工具提升客戶體驗，{{report_year}} 年客戶回購率達 {{repurchase_rate}}%。產品安全與品質管理包括：</p>
<ul>
<li>產品安全測試與認證</li>
<li>客戶回饋機制</li>
<li>產品生命週期評估</li>
<li>負責任產品標示</li>
<li>售後服務品質</li>
</ul>

<h3>5.4 智財權保護</h3>
<p>本公司重視智慧財產權管理，{{report_year}} 年智財權相關措施包括：</p>
<ul>
<li>專利佈局策略</li>
<li>營業秘密保護</li>
<li>著作權管理</li>
<li>智財權教育訓練</li>
</ul>

<h3>5.5 創新績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>研發投資佔營收</td><td>{{rd_ratio}}%</td><td>{{prev_rd_ratio}}%</td><td>≥ 5%</td></tr>
<tr><td>專利取得數</td><td>{{patents}}</td><td>{{prev_patents}}</td><td>持續增加</td></tr>
<tr><td>數位專案數</td><td>{{digital_projects}}</td><td>{{prev_digital}}</td><td>持續增加</td></tr>
<tr><td>客戶回購率</td><td>{{repurchase_rate}}%</td><td>{{prev_repurchase}}%</td><td>≥ 60%</td></tr>
<tr><td>新產品營收佔比</td><td>{{new_product_ratio}}%</td><td>{{prev_new_product}}%</td><td>≥ 20%</td></tr>
</table>
`,
  },
  {
    id: 'ch-06',
    title: 'Ch.6 價值鏈管理 — 供應商與夥伴關係',
    chapter: 6,
    wordCount: 10000,
    griAlignment: ['GRI-2-6', 'GRI-204', 'GRI-308', 'GRI-414'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{supplier_count}}', '{{supplier_audits}}', '{{local_sourcing_ratio}}'],
    content: `<h2>Ch.6 價值鏈管理 — 供應商與夥伴關係</h2>

<h3>6.1 供應鏈概況</h3>
<p>{{company_name}} 的價值鏈涵蓋原材料採購、生產製造、物流配送、銷售服務等環節。{{report_year}} 年共與 {{supplier_count}} 家供應商合作，其中 {{local_sourcing_ratio}}% 為本地採購。</p>

<h3>6.2 供應商管理機制</h3>
<p>本公司建立完整的供應商管理機制，包括：</p>
<ul>
<li>供應商准入評估（ESG 標準）</li>
<li>定期稽核與評核</li>
<li>供應商行為準則簽署</li>
<li>供應商教育訓練</li>
<li>供應商績效回饋</li>
<li>供應商申訴管道</li>
</ul>

<p>{{report_year}} 年供應商稽核家數為 {{supplier_audits}} 家，合格率為 {{supplier_compliance}}%。</p>

<h3>6.3 永續供應鏈</h3>
<p>本公司推動供應鏈永續作為，包括：</p>
<ul>
<li>綠色採購政策</li>
<li>供應商碳盤查要求</li>
<li>供應商多樣性計畫</li>
<li>在地採購優先</li>
<li>供應商能力建構</li>
<li>負責任礦產採購</li>
</ul>

<h3>6.4 客戶關係管理</h3>
<p>本公司透過完善的客戶關係管理機制，確保產品與服務品質。{{report_year}} 年客戶服務指標如下：</p>
<ul>
<li>客戶滿意度：{{customer_satisfaction}}%</li>
<li>客戶抱怨處理率：100%</li>
<li>客戶抱怨回應時間：24 小時內</li>
<li>客戶回訪率：{{followup_rate}}%</li>
<li>客戶推薦度（NPS）：{{nps_score}}</li>
</ul>

<h3>6.5 物流與配送</h3>
<p>本公司持續優化物流配送效率，減少碳足跡：</p>
<ul>
<li>路線優化系統</li>
<li>車隊效率提升</li>
<li>包裝減量</li>
<li>綠色物流夥伴</li>
<li>逆物流回收</li>
</ul>

<h3>6.6 價值鏈績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>供應商稽核合格率</td><td>{{supplier_compliance}}%</td><td>{{prev_compliance}}%</td><td>≥ 95%</td></tr>
<tr><td>本地採購比例</td><td>{{local_sourcing_ratio}}%</td><td>{{prev_local}}%</td><td>持續提升</td></tr>
<tr><td>客戶滿意度</td><td>{{customer_satisfaction}}%</td><td>{{prev_satisfaction}}%</td><td>≥ 90%</td></tr>
<tr><td>NPS 分數</td><td>{{nps_score}}</td><td>{{prev_nps}}</td><td>≥ 50</td></tr>
<tr><td>供應商多樣性</td><td>{{supplier_diversity}}%</td><td>{{prev_diversity}}%</td><td>持續提升</td></tr>
</table>
`,
  },
  {
    id: 'ch-07',
    title: 'Ch.7 社區發展與社會貢獻',
    chapter: 7,
    wordCount: 10000,
    griAlignment: ['GRI-2-1', 'GRI-413', 'GRI-203'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{community_investment}}', '{{volunteer_hours}}', '{{beneficiaries}}'],
    content: `<h2>Ch.7 社區發展與社會貢獻</h2>

<h3>7.1 社區投資策略</h3>
<p>{{company_name}} 將社區發展視為企業社會責任的重要一環。{{report_year}} 年社區投資金額為 {{community_investment}} 萬元，重點項目包括：</p>
<ul>
<li>教育支持：獎學金、產學合作、職業訓練</li>
<li>醫療健康：義診、健康篩檢、長照服務</li>
<li>環境保護：造林、淨灘、生態復育</li>
<li>文化保存：地方文化活動、文資保存</li>
<li>急難救助：天然災害救助、弱勢扶助</li>
<li>社區營造：社區發展協會支持</li>
</ul>

<h3>7.2 企業志工</h3>
<p>本公司鼓勵員工參與志工服務，{{report_year}} 年志工服務時數達 {{volunteer_hours}} 小時，參與員工佔比為 {{volunteer_participation}}%。志工活動包括：</p>
<ul>
<li>環保志工：淨灘、造林、資源回收</li>
<li>教育志工：課業輔導、閱讀陪伴</li>
<li>社區志工：社區服務、長者關懷</li>
<li>專業志工：義診、法律諮詢</li>
</ul>

<h3>7.3 社會影響評估</h3>
<p>本公司對社區投資項目進行社會影響評估，{{report_year}} 年受益人數約 {{beneficiaries}} 人。主要成果包括：</p>
<ul>
<li>教育受益：{{education_beneficiaries}} 人</li>
<li>健康受益：{{health_beneficiaries}} 人</li>
<li>環保受益：{{env_beneficiaries}} 人</li>
<li>經濟受益：{{economic_beneficiaries}} 人</li>
</ul>

<h3>7.4 原住民與弱勢關懷</h3>
<p>本公司重視原住民與弱勢族群權益，{{report_year}} 年相關作為包括：</p>
<ul>
<li>原住民就業機會創造</li>
<li>原住民文化保存支持</li>
<li>弱勢家庭扶助</li>
<li>身心障礙者支持</li>
<li>偏鄉醫療服務</li>
</ul>

<h3>7.5 社會績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>社區投資金額</td><td>{{community_investment}}萬</td><td>{{prev_community}}萬</td><td>持續增加</td></tr>
<tr><td>志工服務時數</td><td>{{volunteer_hours}}</td><td>{{prev_volunteer}}</td><td>持續增加</td></tr>
<tr><td>志工參與率</td><td>{{volunteer_participation}}%</td><td>{{prev_participation}}%</td><td>≥ 30%</td></tr>
<tr><td>受益人數</td><td>{{beneficiaries}}</td><td>{{prev_beneficiaries}}</td><td>持續增加</td></tr>
<tr><td>社會投資回報率</td><td>{{sroi}}x</td><td>{{prev_sroi}}x</td><td>≥ 3x</td></tr>
</table>
`,
  },
  {
    id: 'ch-08',
    title: 'Ch.8 水資源與廢棄物管理',
    chapter: 8,
    wordCount: 10000,
    griAlignment: ['GRI-303', 'GRI-306', 'GRI-304'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{water_withdrawal}}', '{{waste_generated}}', '{{recycling_rate}}'],
    content: `<h2>Ch.8 水資源與廢棄物管理</h2>

<h3>8.1 水資源管理策略</h3>
<p>{{company_name}} 將水資源視為關鍵環境議題，依據 GRI 303 準則進行完整管理。{{report_year}} 年總取水量為 {{water_withdrawal}} 立方公尺，總排水量為 {{water_discharge}} 立方公尺。</p>

<p>水資源管理策略包括：</p>
<ul>
<li>源頭減量：製程水回收、雨水收集</li>
<li>效率提升：水效率改善、漏水檢測</li>
<li>水質管理：廢水處理、排放監測</li>
<li>風險管理：水壓力地區評估</li>
<li>生態保育：水域生態復育</li>
</ul>

<h3>8.2 水資源績效</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>總取水量</td><td>{{water_withdrawal}} m³</td><td>{{prev_withdrawal}} m³</td><td>持續減少</td></tr>
<tr><td>總排水量</td><td>{{water_discharge}} m³</td><td>{{prev_discharge}} m³</td><td>持續減少</td></tr>
<tr><td>水密集度</td><td>{{water_intensity}}</td><td>{{prev_water_intensity}}</td><td>持續改善</td></tr>
<tr><td>回收水比例</td><td>{{water_recycling}}%</td><td>{{prev_water_recycling}}%</td><td>≥ 80%</td></tr>
<tr><td>排放合格率</td><td>100%</td><td>100%</td><td>100%</td></tr>
</table>

<h3>8.3 廢棄物管理</h3>
<p>本公司推動廢棄物減量與循環經濟，{{report_year}} 年廢棄物總產出量為 {{waste_generated}} 公噸，回收率達 {{recycling_rate}}%。</p>

<p>廢棄物管理策略包括：</p>
<ul>
<li>源頭減量：包裝減量、材料優化</li>
<li>資源回收：分類回收、再利用</li>
<li>廢棄物處理：合法清運、最終處置</li>
<li>循環經濟：產品即服務、材料循環</li>
<li>供應商包裝回收</li>
</ul>

<h3>8.4 有害物質管理</h3>
<p>本公司嚴格管理有害物質使用與排放：</p>
<ul>
<li>有害物質清單管理</li>
<li>替代品研發</li>
<li>作業環境監測</li>
<li>員工健康保護</li>
<li>法規遵循</li>
</ul>

<h3>8.5 環境績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>廢棄物總量</td><td>{{waste_generated}} 公噸</td><td>{{prev_waste}} 公噸</td><td>持續減少</td></tr>
<tr><td>回收率</td><td>{{recycling_rate}}%</td><td>{{prev_recycling}}%</td><td>≥ 85%</td></tr>
<tr><td>有害廢棄物</td><td>{{hazardous_waste}} 公噸</td><td>{{prev_hazardous}}</td><td>持續減少</td></tr>
<tr><td>廚餘回收率</td><td>{{food_waste_recycling}}%</td><td>{{prev_food_waste}}%</td><td>≥ 90%</td></tr>
<tr><td>紙類回收率</td><td>{{paper_recycling}}%</td><td>{{prev_paper}}%</td><td>≥ 95%</td></tr>
</table>
`,
  },
  {
    id: 'ch-09',
    title: 'Ch.9 生物多樣性與土地使用',
    chapter: 9,
    wordCount: 10000,
    griAlignment: ['GRI-304', 'GRI-101'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{land_use}}', '{{protected_area}}', '{{biodiversity_projects}}'],
    content: `<h2>Ch.9 生物多樣性與土地使用</h2>

<h3>9.1 生物多樣性政策</h3>
<p>{{company_name}} 承諾營運活動不會對生物多樣性造成重大負面影響。本公司已制定生物多樣性政策，並依據 TNFD（自然相關財務揭露）框架進行評估。</p>

<p>生物多樣性政策核心原則：</p>
<ul>
<li>避免在保護區進行開發</li>
<li>減少價值鏈對自然的影響</li>
<li>投資自然復育與保育</li>
<li>支持生物多樣性研究</li>
<li>價值鏈生物多樣性評估</li>
</ul>

<h3>9.2 土地使用管理</h3>
<p>{{report_year}} 年本公司營運據點土地使用情形如下：</p>
<ul>
<li>總用地面積：{{land_use}} 公頃</li>
<li>已開發面積：{{developed_area}} 公頃</li>
<li>綠化面積：{{green_area}} 公頃</li>
<li>保護區面積：{{protected_area}} 公頃</li>
<li>生態復育面積：{{restoration_area}} 公頃</li>
</ul>

<h3>9.3 生物多樣性行動</h3>
<p>{{report_year}} 年生物多樣性相關行動包括：</p>
<ul>
<li>造林計畫：{{tree_planting}} 棵樹</li>
<li>生態復育：{{restoration_area}} 公頃</li>
<li>野生動物保護：{{wildlife_projects}} 專案</li>
<li>水域生態保育：{{water_projects}} 專案</li>
<li>社區生態教育：{{eco_education}} 場次</li>
</ul>

<h3>9.4 價值鏈自然影響</h3>
<p>本公司評估價值鏈對自然的影響，包括：</p>
<ul>
<li>原材料來源追溯</li>
<li>供應商環境影響評估</li>
<li>產品生命週期評估</li>
<li>包裝材料減量</li>
<li>物流路線優化</li>
</ul>

<h3>9.5 生物多樣性績效指標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>造林棵數</td><td>{{tree_planting}}</td><td>{{prev_trees}}</td><td>持續增加</td></tr>
<tr><td>生態復育面積</td><td>{{restoration_area}} 公頃</td><td>{{prev_restoration}}</td><td>持續增加</td></tr>
<tr><td>綠化面積</td><td>{{green_area}} 公頃</td><td>{{prev_green}}</td><td>持續增加</td></tr>
<tr><td>保護區面積</td><td>{{protected_area}} 公頃</td><td>{{prev_protected}}</td><td>持續增加</td></tr>
<tr><td>生態教育場次</td><td>{{eco_education}}</td><td>{{prev_education}}</td><td>持續增加</td></tr>
</table>
`,
  },
  {
    id: 'ch-10',
    title: 'Ch.10 氣候變遷與TCFD揭露',
    chapter: 10,
    wordCount: 10000,
    griAlignment: ['TCFD', 'GRI-201', 'GRI-302', 'GRI-305'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{tcfd_scenarios}}', '{{carbon_price}}', '{{climate_investment}}'],
    content: `<h2>Ch.10 氣候變遷與 TCFD 揭露</h2>

<h3>10.1 TCFD 治理</h3>
<p>{{company_name}} 依據 TCFD（氣候相關財務揭露）建議，從治理、策略、風險管理、指標與目標四大面向進行完整揭露。董事會負責監督氣候相關風險與機會，永續發展委員會負責制定與執行氣候策略。</p>

<h3>10.2 氣候情境分析</h3>
<p>本公司進行氣候情境分析，評估不同升溫情境下的風險與機會：</p>
<ul>
<li><strong>1.5°C 情境（有序轉型）</strong>：低碳技術投資、能源效率提升</li>
<li><strong>2°C 情境（全球行動）</strong>：政策變革、市場轉型</li>
<li><strong>3°C 情境（轉型失敗）</strong>：極端天氣、實體風險增加</li>
</ul>

<p>情境分析假設：</p>
<ul>
<li>碳定價：{{carbon_price}} USD/tCO2e</li>
<li>再生能源佔比：{{renewable_ratio}}%</li>
<li>技術成本下降：{{tech_cost_reduction}}%</li>
<li>政策嚴格程度：{{policy_stringency}}</li>
</ul>

<h3>10.3 氣候風險評估</h3>
<table>
<tr><th>風險類型</th><th>風險描述</th><th>時間範圍</th><th>財務影響</th></tr>
<tr><td>實體風險（急性）</td><td>極端天氣事件</td><td>短期</td><td>{{acute_risk_impact}}</td></tr>
<tr><td>實體風險（慢性）</td><td>海平面上升、熱浪</td><td>長期</td><td>{{chronic_risk_impact}}</td></tr>
<tr><td>轉型風險（政策）</td><td>碳稅、排放限制</td><td>中期</td><td>{{policy_risk_impact}}</td></tr>
<tr><td>轉型風險（技術）</td><td>低碳技術替代</td><td>中期</td><td>{{tech_risk_impact}}</td></tr>
<tr><td>轉型風險（市場）</td><td>消費者偏好改變</td><td>中期</td><td>{{market_risk_impact}}</td></tr>
<tr><td>轉型風險（商譽）</td><td>環保爭議</td><td>短期</td><td>{{reputation_risk_impact}}</td></tr>
</table>

<h3>10.4 氣候機會</h3>
<p>本公司識別以下氣候相關機會：</p>
<ul>
<li>綠色產品市場成長</li>
<li>低碳技術優勢</li>
<li>ESG 融資優惠</li>
<li>碳權交易收入</li>
<li>能源成本節省</li>
<li>品牌價值提升</li>
</ul>

<h3>10.5 氣候投資</h3>
<p>{{report_year}} 年氣候相關投資金額為 {{climate_investment}} 億元，包括：</p>
<ul>
<li>再生能源投資：{{renewable_investment}} 億元</li>
<li>能源效率改善：{{efficiency_investment}} 億元</li>
<li>低碳技術研發：{{tech_investment}} 億元</li>
<li>碳抵換投資：{{offset_investment}} 億元</li>
<li>氣候調適投資：{{adaptation_investment}} 億元</li>
</ul>

<h3>10.6 TCFD 指標與目標</h3>
<table>
<tr><th>指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td>溫室氣體排放</td><td>{{carbon_emissions}} tCO2e</td><td>{{prev_emissions}}</td><td>-45%</td></tr>
<tr><td>碳密集度</td><td>{{carbon_intensity}}</td><td>{{prev_intensity}}</td><td>-50%</td></tr>
<tr><td>再生能源佔比</td><td>{{renewable_ratio}}%</td><td>{{prev_renewable}}%</td><td>100%</td></tr>
<tr><td>氣候投資</td><td>{{climate_investment}} 億</td><td>{{prev_climate}}</td><td>持續增加</td></tr>
<tr><td>內部碳定價</td><td>{{internal_carbon_price}} USD</td><td>{{prev_internal_cp}}</td><td>持續增加</td></tr>
</table>
`,
  },
  {
    id: 'ch-11',
    title: 'Ch.11 附錄 — GRI 準則索引與數據摘要',
    chapter: 11,
    wordCount: 10000,
    griAlignment: ['GRI-1', 'GRI-2', 'GRI-3'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{reporting_period}}', '{{auditor}}'],
    content: `<h2>Ch.11 附錄 — GRI 準則索引與數據摘要</h2>

<h3>11.1 GRI 準則索引</h3>
<p>本報告書依據 GRI Standards 2021 編製，以下為各準則揭露索引：</p>

<table>
<tr><th>準則編號</th><th>準則名稱</th><th>揭露位置</th><th>遵循情形</th></tr>
<tr><td>GRI-2</td><td>一般揭露</td><td>Ch.1, Ch.4</td><td>完全遵循</td></tr>
<tr><td>GRI-3</td><td>重大主題</td><td>Ch.1</td><td>完全遵循</td></tr>
<tr><td>GRI-201</td><td>經濟績效</td><td>Ch.5</td><td>完全遵循</td></tr>
<tr><td>GRI-203</td><td>間接經濟影響</td><td>Ch.7</td><td>完全遵循</td></tr>
<tr><td>GRI-204</td><td>實務做法</td><td>Ch.6</td><td>完全遵循</td></tr>
<tr><td>GRI-205</td><td>反貪腐</td><td>Ch.4</td><td>完全遵循</td></tr>
<tr><td>GRI-302</td><td>能源</td><td>Ch.2, Ch.10</td><td>完全遵循</td></tr>
<tr><td>GRI-303</td><td>水與污水</td><td>Ch.8</td><td>完全遵循</td></tr>
<tr><td>GRI-304</td><td>生物多樣性</td><td>Ch.9</td><td>完全遵循</td></tr>
<tr><td>GRI-305</td><td>排放</td><td>Ch.2, Ch.10</td><td>完全遵循</td></tr>
<tr><td>GRI-306</td><td>廢棄物</td><td>Ch.8</td><td>完全遵循</td></tr>
<tr><td>GRI-401</td><td>僱用</td><td>Ch.3</td><td>完全遵循</td></tr>
<tr><td>GRI-403</td><td>職業安全衛生</td><td>Ch.3</td><td>完全遵循</td></tr>
<tr><td>GRI-404</td><td>訓練與教育</td><td>Ch.3</td><td>完全遵循</td></tr>
<tr><td>GRI-405</td><td>多元平等</td><td>Ch.3</td><td>完全遵循</td></tr>
<tr><td>GRI-413</td><td>當地社區</td><td>Ch.7</td><td>完全遵循</td></tr>
<tr><td>GRI-414</td><td>供應商社會評估</td><td>Ch.6</td><td>完全遵循</td></tr>
<tr><td>GRI-418</td><td>客戶隱私</td><td>Ch.3</td><td>完全遵循</td></tr>
</table>

<h3>11.2 關鍵數據摘要</h3>
<table>
<tr><th>面向</th><th>關鍵指標</th><th>{{report_year}}</th><th>前年</th><th>目標</th></tr>
<tr><td rowspan="3">環境</td><td>碳排放</td><td>{{carbon_emissions}} tCO2e</td><td>{{prev_emissions}}</td><td>-45%</td></tr>
<tr><td>能源消耗</td><td>{{energy_consumption}} GJ</td><td>{{prev_energy}}</td><td>-30%</td></tr>
<tr><td>水消耗</td><td>{{water_withdrawal}} m³</td><td>{{prev_water}}</td><td>-20%</td></tr>
<tr><td rowspan="3">社會</td><td>員工數</td><td>{{employee_count}}</td><td>{{prev_employees}}</td><td>穩定</td></tr>
<tr><td>女性比例</td><td>{{female_ratio}}%</td><td>{{prev_female}}%</td><td>≥ 30%</td></tr>
<tr><td>離職率</td><td>{{turnover_rate}}%</td><td>{{prev_turnover}}%</td><td>< 10%</td></tr>
<tr><td rowspan="3">治理</td><td>董事會出席率</td><td>{{attendance_rate}}%</td><td>{{prev_attendance}}%</td><td>≥ 90%</td></tr>
<tr><td>法規違反</td><td>{{compliance_violations}} 件</td><td>0</td><td>0</td></tr>
<tr><td>貪腐事件</td><td>0 件</td><td>0</td><td>0</td></tr>
</table>

<h3>11.3 報導邊界與期間</h3>
<p>本報告期間為 {{reporting_period}}，報導範圍涵蓋 {{company_name}} 全球營運據點。數據計算方法遵循 GRI 準則與產業慣例。</p>

<h3>11.4 保證與驗證</h3>
<p>本報告已經由 {{auditor}} 進行有限確信，確信報告書符合 GRI Standards 與 IFRS S1/S2 要求。</p>

<h3>11.5 聯絡資訊</h3>
<p>如有任何疑問，請聯絡：</p>
<ul>
<li>永續發展委員會：sustainability@{{company_name}}.com</li>
<li>投資人關係：ir@{{company_name}}.com</li>
<li>客戶服務：service@{{company_name}}.com</li>
</ul>
`,
  },
  {
    id: 'ch-12',
    title: 'Ch.12 IFRS S1/S2 永續揭露索引',
    chapter: 12,
    wordCount: 10000,
    griAlignment: ['IFRS-S1', 'IFRS-S2', 'ISSB'],
    placeholders: ['{{company_name}}', '{{report_year}}', '{{sasb_code}}', '{{industry_metrics}}'],
    content: `<h2>Ch.12 IFRS S1/S2 永續揭露索引</h2>

<h3>12.1 IFRS S1 一般要求</h3>
<p>{{company_name}} 已依據 IFRS S1（永續相關財務資訊揭露）準則，於財務報告中揭露永續相關重大資訊。揭露範圍包括：</p>
<ul>
<li>治理：永續治理架構與流程</li>
<li>策略：永續策略與商業模式</li>
<li>風險管理：永續風險與機會評估</li>
<li>指標與目標：永續績效衡量</li>
</ul>

<h3>12.2 IFRS S2 氣候相關揭露</h3>
<p>本公司依據 IFRS S2 準則揭露氣候相關資訊：</p>
<ul>
<li>氣候治理：董事會與管理層責任</li>
<li>氣候策略：情境分析與韌性評估</li>
<li>氣候風險：實體風險與轉型風險</li>
<li>氣候指標：碳排放、能源、水資源</li>
</ul>

<h3>12.3 SASB 行業準則索引</h3>
<p>本公司依據 SASB 行業準則（{{sasb_code}}）進行行業特定揭露：</p>
<table>
<tr><th>SASB 指標</th><th>說明</th><th>{{report_year}}</th></tr>
<tr><td>{{sasb_code}}-FN-001</td><td>能源管理</td><td>{{energy_consumption}} GJ</td></tr>
<tr><td>{{sasb_code}}-FN-002</td><td>水資源管理</td><td>{{water_withdrawal}} m³</td></tr>
<tr><td>{{sasb_code}}-FN-003</td><td>廢棄物管理</td><td>{{waste_generated}} 公噸</td></tr>
<tr><td>{{sasb_code}}-FN-004</td><td>員工安全</td><td>{{ltir}}</td></tr>
<tr><td>{{sasb_code}}-FN-005</td><td>多元平等</td><td>{{female_ratio}}%</td></tr>
<tr><td>{{sasb_code}}-FN-006</td><td>客戶滿意度</td><td>{{customer_satisfaction}}%</td></tr>
<tr><td>{{sasb_code}}-FN-007</td><td>供應鏈管理</td><td>{{supplier_compliance}}%</td></tr>
<tr><td>{{sasb_code}}-FN-008</td><td>反貪腐</td><td>0 事件</td></tr>
</table>

<h3>12.4 產業特定指標</h3>
<p>針對 {{industry}} 產業特性，本公司揭露以下產業特定指標：</p>
<ul>
<li>產品生命週期評估</li>
<li>供應鏈足跡</li>
<li>負責任採購比例</li>
<li>綠色產品營收佔比</li>
<li>循環經濟指標</li>
<li>數位化成熟度</li>
</ul>

<h3>12.5 永續報告書保證</h3>
<p>本報告書已經由 {{auditor}} 進行：</p>
<ul>
<li>有限確信（GRI Standards）</li>
<li>合理確信（IFRS S1/S2）</li>
<li>產業數據驗證</li>
<li>內部控制評估</li>
</ul>

<h3>12.6 法規遵循聲明</h3>
<p>本公司確認本報告書符合以下法規與準則要求：</p>
<ul>
<li>IFRS S1（永續相關財務資訊揭露）</li>
<li>IFRS S2（氣候相關揭露）</li>
<li>GRI Standards 2021</li>
<li>SASB 行業準則</li>
<li>TCFD 建議</li>
<li>歐盟 CSRD（如適用）</li>
<li>台灣永續報告書作業辦法</li>
</ul>
`,
  },
];

export const comprehensiveTemplate: ReportTemplate = {
  id: 'TPL-COMP-01',
  name: '全面合規基準藍圖',
  theme: 'comprehensive',
  industry: ['製造業', '科技業', '服務業', '金控業', '能源業'],
  totalSections: 12,
  estimatedWords: 120000,
  sections: SECTIONS,
};
