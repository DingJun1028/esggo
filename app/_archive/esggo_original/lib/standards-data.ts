/**
 * ESG GO | 永續規範書資料庫
 * GRI · SASB · TCFD · ISSB · ISO · 金管會
 */

export interface Standard {
  id: string;
  code: string;
  name: string;
  nameZh: string;
  category: 'GRI' | 'SASB' | 'TCFD' | 'ISSB' | 'ISO' | 'TW_REG' | 'EU_REG';
  version: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'superseded';
  summary: string;
  keyRequirements: string[];
  disclosureItems: DisclosureItem[];
  relatedStandards: string[];
  officialUrl: string;
  mandatory: boolean;
  applicableTo: string[];
}

export interface DisclosureItem {
  code: string;
  title: string;
  titleZh: string;
  type: 'quantitative' | 'qualitative' | 'both';
  required: boolean;
  guidance: string;
  dataPoints: string[];
  evidenceRequired: string[];
  formula?: string;
  unit?: string;
}

export interface ComplianceChecklist {
  standardId: string;
  sections: ChecklistSection[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  requirement: string;
  guidance: string;
  status: 'pending' | 'in_progress' | 'completed' | 'na';
  evidence?: string;
  dueDate?: string;
}

export const STANDARDS: Standard[] = [
  // ── GRI Standards ──────────────────────────────────────────────────────
  {
    id: 'gri-2021',
    code: 'GRI 2021',
    name: 'GRI Universal Standards 2021',
    nameZh: 'GRI 2021 通用準則',
    category: 'GRI',
    version: '2021',
    effectiveDate: '2023-01-01',
    status: 'active',
    summary: 'GRI 通用準則為所有組織提供關於一般揭露（組織資訊、活動、治理等）的基礎框架，是 GRI 標準的核心基礎。',
    keyRequirements: [
      'GRI 2-1 組織詳情：揭露組織名稱、所有權、法律型態及所在地',
      'GRI 2-2 永續報告書涵蓋的實體：界定報告邊界',
      'GRI 2-9 治理結構與組成：說明最高治理機構',
      'GRI 2-22 永續發展策略聲明：由高層管理人員簽署',
      'GRI 2-29 利害關係人議合方式：說明識別與選擇過程',
      'GRI 3-1 重大性評估過程：描述識別重大議題的過程',
    ],
    disclosureItems: [
      {
        code: 'GRI 2-1',
        title: 'Organizational details',
        titleZh: '組織詳情',
        type: 'qualitative',
        required: true,
        guidance: '揭露組織的法定名稱、所有權性質、總部所在地、國家/地區及報告期間',
        dataPoints: ['法定名稱', '所有權性質', '法律型態', '總部所在地'],
        evidenceRequired: ['公司登記證明', '年報封面頁'],
      },
      {
        code: 'GRI 2-7',
        title: 'Employees',
        titleZh: '員工',
        type: 'quantitative',
        required: true,
        guidance: '按性別、雇傭合約類型及地區揭露員工人數',
        dataPoints: ['全職員工數', '兼職員工數', '男性員工數', '女性員工數'],
        evidenceRequired: ['人資系統報表', '薪資冊'],
        formula: '員工總數 = 全職人數 + 兼職人數',
        unit: '人',
      },
      {
        code: 'GRI 2-9',
        title: 'Governance structure and composition',
        titleZh: '治理結構與組成',
        type: 'both',
        required: true,
        guidance: '揭露最高治理機構的組成，包括執行與非執行成員',
        dataPoints: ['董事會人數', '獨立董事比例', '女性董事比例', '平均年齡'],
        evidenceRequired: ['董事會名冊', '公司章程'],
      },
    ],
    relatedStandards: ['gri-305', 'gri-302', 'tcfd'],
    officialUrl: 'https://www.globalreporting.org/standards/',
    mandatory: false,
    applicableTo: ['上市公司', '中小企業', '非政府組織'],
  },
  {
    id: 'gri-305',
    code: 'GRI 305',
    name: 'GRI 305: Emissions 2016',
    nameZh: 'GRI 305 排放標準',
    category: 'GRI',
    version: '2016',
    effectiveDate: '2016-07-01',
    status: 'active',
    summary: '規範組織對溫室氣體排放的揭露要求，涵蓋直接排放（範疇一）、能源間接排放（範疇二）及其他間接排放（範疇三）。',
    keyRequirements: [
      'GRI 305-1 直接（範疇一）溫室氣體排放',
      'GRI 305-2 能源間接（範疇二）溫室氣體排放',
      'GRI 305-3 其他間接（範疇三）溫室氣體排放',
      'GRI 305-4 溫室氣體排放密度',
      'GRI 305-5 溫室氣體排放減量',
    ],
    disclosureItems: [
      {
        code: 'GRI 305-1',
        title: 'Direct (Scope 1) GHG emissions',
        titleZh: '直接（範疇一）溫室氣體排放',
        type: 'quantitative',
        required: true,
        guidance: '揭露組織所有直接來源的溫室氣體排放總量，以公噸二氧化碳當量表示',
        dataPoints: ['CO₂排放量', 'CH₄排放量', 'N₂O排放量', '合計tCO₂e'],
        evidenceRequired: ['ISO 14064-1 盤查清冊', '燃料使用紀錄', '冷媒填充紀錄'],
        formula: '範疇一排放量 = Σ(活動數據 × 排放係數) (單位：tCO₂e)',
        unit: 'tCO₂e',
      },
      {
        code: 'GRI 305-2',
        title: 'Energy indirect (Scope 2) GHG emissions',
        titleZh: '能源間接（範疇二）溫室氣體排放',
        type: 'quantitative',
        required: true,
        guidance: '揭露組織外購電力、熱力、蒸汽或冷氣產生的間接排放',
        dataPoints: ['外購電力排放', '外購熱力排放'],
        evidenceRequired: ['台電帳單', '電力採購合約', 'T-REC 憑證'],
        formula: '範疇二排放量 = 用電度數 × 電力排放係數 (tCO₂e/kWh)',
        unit: 'tCO₂e',
      },
      {
        code: 'GRI 305-4',
        title: 'GHG emissions intensity',
        titleZh: '溫室氣體排放密度',
        type: 'quantitative',
        required: false,
        guidance: '揭露組織選擇的排放密度指標，以標準化計算排放效率',
        dataPoints: ['排放密度比率', '選用基準值'],
        evidenceRequired: ['範疇一二盤查報告', '營業額或產量紀錄'],
        formula: '排放密度 = 總排放量 / 選定分母（如營收、產量）',
        unit: 'tCO₂e/百萬元',
      },
    ],
    relatedStandards: ['gri-302', 'tcfd', 'iso-14064'],
    officialUrl: 'https://www.globalreporting.org/standards/media/1012/gri-305-emissions-2016.pdf',
    mandatory: false,
    applicableTo: ['上市公司', '製造業', '服務業'],
  },
  {
    id: 'gri-302',
    code: 'GRI 302',
    name: 'GRI 302: Energy 2016',
    nameZh: 'GRI 302 能源標準',
    category: 'GRI',
    version: '2016',
    effectiveDate: '2016-07-01',
    status: 'active',
    summary: '規範組織對能源消耗、能源強度及再生能源使用情況的揭露要求。',
    keyRequirements: [
      'GRI 302-1 組織內部能源消耗',
      'GRI 302-2 組織外部能源消耗',
      'GRI 302-3 能源密度',
      'GRI 302-4 能源消耗減量',
      'GRI 302-5 產品與服務的能源需求減量',
    ],
    disclosureItems: [
      {
        code: 'GRI 302-1',
        title: 'Energy consumption within the organization',
        titleZh: '組織內部能源消耗',
        type: 'quantitative',
        required: true,
        guidance: '揭露組織消耗的燃料總量（可再生與不可再生）及電力消耗量',
        dataPoints: ['非再生燃料消耗(GJ)', '再生燃料消耗(GJ)', '電力消耗(GJ)', '蒸汽消耗(GJ)', '總能源消耗(GJ)'],
        evidenceRequired: ['台電帳單', '燃料採購發票', '天然氣帳單'],
        formula: '總能源消耗(GJ) = 燃料能源 + 外購電力(kWh × 0.0036)',
        unit: 'GJ',
      },
    ],
    relatedStandards: ['gri-305', 'tcfd'],
    officialUrl: 'https://www.globalreporting.org/standards/media/1009/gri-302-energy-2016.pdf',
    mandatory: false,
    applicableTo: ['上市公司', '製造業', '資訊業'],
  },
  // ── TCFD ──────────────────────────────────────────────────────────────
  {
    id: 'tcfd',
    code: 'TCFD',
    name: 'Task Force on Climate-related Financial Disclosures',
    nameZh: '氣候相關財務揭露工作小組建議書',
    category: 'TCFD',
    version: '2023',
    effectiveDate: '2017-06-29',
    status: 'active',
    summary: 'TCFD 建議企業依據「治理」、「策略」、「風險管理」及「指標與目標」四大支柱揭露氣候相關財務風險與機會。',
    keyRequirements: [
      '治理：董事會對氣候相關風險和機會的監督',
      '策略：氣候相關風險和機會對業務的實際和潛在影響',
      '風險管理：識別、評估和管理氣候相關風險的過程',
      '指標與目標：評估和管理氣候相關風險和機會的指標與目標',
      '情境分析：評估在不同氣候情境下（1.5°C、2°C、4°C）的財務影響',
    ],
    disclosureItems: [
      {
        code: 'TCFD-G1',
        title: 'Board oversight of climate risks',
        titleZh: '董事會對氣候風險的監督',
        type: 'qualitative',
        required: true,
        guidance: '描述董事會對氣候相關風險和機會的監督情況',
        dataPoints: ['董事會審議頻率', '負責委員會名稱', '氣候議題融入程度'],
        evidenceRequired: ['董事會議事錄', '永續委員會報告'],
      },
      {
        code: 'TCFD-S2',
        title: 'Climate scenario analysis',
        titleZh: '氣候情境分析',
        type: 'both',
        required: true,
        guidance: '揭露組織在不同氣候情境下的韌性評估，包含 1.5°C 及 4°C 升溫情境',
        dataPoints: ['實體風險評估', '轉型風險評估', '財務影響金額'],
        evidenceRequired: ['氣候情境分析報告', '財務試算模型'],
        formula: '氣候VaR = 財務影響金額 × 情境概率',
        unit: 'NTD 百萬元',
      },
    ],
    relatedStandards: ['issb-s2', 'gri-305'],
    officialUrl: 'https://www.fsb-tcfd.org/',
    mandatory: true,
    applicableTo: ['金融機構', '上市公司', '大型企業'],
  },
  // ── ISSB ──────────────────────────────────────────────────────────────
  {
    id: 'issb-s1',
    code: 'ISSB S1',
    name: 'IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information',
    nameZh: 'IFRS S1 永續相關財務資訊揭露之一般規定',
    category: 'ISSB',
    version: '2023',
    effectiveDate: '2024-01-01',
    status: 'active',
    summary: 'IFRS S1 規定企業應揭露對其在短、中、長期產生重大影響之永續相關風險和機會的相關資訊。',
    keyRequirements: [
      '揭露對企業在短、中、長期價值創造具有重大性的永續相關風險和機會',
      '採用 TCFD 四支柱框架：治理、策略、風險管理、指標與目標',
      '揭露重要假設與估計的不確定性資訊',
      '比較期間資訊的揭露',
    ],
    disclosureItems: [
      {
        code: 'S1-16',
        title: 'Sustainability-related risks and opportunities',
        titleZh: '永續相關風險與機會',
        type: 'both',
        required: true,
        guidance: '識別並揭露對企業具有重大財務影響的永續相關風險和機會',
        dataPoints: ['風險類型', '時間範圍', '財務影響', '因應措施'],
        evidenceRequired: ['風險評估報告', '董事會審議紀錄'],
      },
    ],
    relatedStandards: ['issb-s2', 'tcfd'],
    officialUrl: 'https://www.ifrs.org/issued-standards/ifrs-sustainability-disclosure-standards/',
    mandatory: true,
    applicableTo: ['上市公司', '大型金融機構'],
  },
  {
    id: 'issb-s2',
    code: 'ISSB S2',
    name: 'IFRS S2 Climate-related Disclosures',
    nameZh: 'IFRS S2 氣候相關揭露',
    category: 'ISSB',
    version: '2023',
    effectiveDate: '2024-01-01',
    status: 'active',
    summary: 'IFRS S2 專注於氣候相關風險和機會的揭露，建立在 TCFD 框架之上，並要求額外的量化指標揭露。',
    keyRequirements: [
      '氣候相關風險和機會的識別與評估',
      'Scope 1、2、3 溫室氣體排放量揭露（碳強度指標）',
      '氣候情境分析（包含 1.5°C 路徑）',
      '過渡計畫及相關目標',
      '氣候相關機會及其財務效益',
    ],
    disclosureItems: [
      {
        code: 'S2-29',
        title: 'GHG emissions - Scope 1, 2, 3',
        titleZh: 'GHG 排放 — 範疇一、二、三',
        type: 'quantitative',
        required: true,
        guidance: '揭露組織絕對溫室氣體排放量及排放強度',
        dataPoints: ['範疇一排放(tCO₂e)', '範疇二排放(tCO₂e)', '範疇三排放(tCO₂e)', '排放強度'],
        evidenceRequired: ['GHG 盤查報告', '第三方查證聲明'],
        formula: '碳強度 = 總排放量(tCO₂e) / 營收(百萬元)',
        unit: 'tCO₂e',
      },
    ],
    relatedStandards: ['issb-s1', 'tcfd', 'gri-305'],
    officialUrl: 'https://www.ifrs.org/issued-standards/ifrs-sustainability-disclosure-standards/ifrs-s2-climate-related-disclosures/',
    mandatory: true,
    applicableTo: ['上市公司', '大型企業'],
  },
  // ── ISO Standards ──────────────────────────────────────────────────────
  {
    id: 'iso-14064',
    code: 'ISO 14064-1',
    name: 'ISO 14064-1:2018 Greenhouse gases — Specification with guidance for quantification and reporting',
    nameZh: 'ISO 14064-1:2018 溫室氣體盤查標準',
    category: 'ISO',
    version: '2018',
    effectiveDate: '2018-12-01',
    status: 'active',
    summary: '提供組織層級溫室氣體排放和移除的量化及報告規範，是溫室氣體盤查最重要的國際標準。',
    keyRequirements: [
      '界定組織邊界（股權或財務控制法、營運控制法）',
      '識別並量化所有溫室氣體排放源',
      '選擇並記錄量化方法',
      '確保數據品質管理',
      '第三方查證（自願或強制）',
    ],
    disclosureItems: [
      {
        code: 'ISO14064-6.3',
        title: 'GHG inventory boundary',
        titleZh: 'GHG 盤查邊界設定',
        type: 'qualitative',
        required: true,
        guidance: '組織應界定並記錄 GHG 盤查的組織邊界及業務邊界',
        dataPoints: ['合併法選擇', '業務邊界範圍', '排除說明'],
        evidenceRequired: ['組織架構圖', '子公司清單'],
      },
    ],
    relatedStandards: ['gri-305', 'tcfd', 'issb-s2'],
    officialUrl: 'https://www.iso.org/standard/66453.html',
    mandatory: false,
    applicableTo: ['所有組織'],
  },
  {
    id: 'iso-14001',
    code: 'ISO 14001',
    name: 'ISO 14001:2015 Environmental management systems',
    nameZh: 'ISO 14001:2015 環境管理系統',
    category: 'ISO',
    version: '2015',
    effectiveDate: '2015-09-15',
    status: 'active',
    summary: 'ISO 14001 規定環境管理系統的要求，協助組織提升環境績效、履行合規義務及達成環境目標。',
    keyRequirements: [
      '了解組織及其背景（內外部議題）',
      '利害關係人需求評估',
      '環境考量面識別與影響評估',
      '環境目標設定與行動計畫',
      '運作管制與緊急準備',
    ],
    disclosureItems: [
      {
        code: 'ISO14001-6.1.2',
        title: 'Environmental aspects',
        titleZh: '環境考量面',
        type: 'both',
        required: true,
        guidance: '識別並評估在正常、異常及緊急狀況下的環境考量面及其重大性',
        dataPoints: ['考量面清單', '重大性評分', '改善計畫'],
        evidenceRequired: ['環境考量面清單', '衝擊評估表'],
      },
    ],
    relatedStandards: ['iso-14064', 'gri-305'],
    officialUrl: 'https://www.iso.org/iso-14001-environmental-management.html',
    mandatory: false,
    applicableTo: ['製造業', '服務業', '政府機關'],
  },
  // ── Taiwan Regulations ─────────────────────────────────────────────────
  {
    id: 'tw-fsc-2023',
    code: '金管會 2023',
    name: 'FSC Sustainable Development Roadmap for Listed Companies',
    nameZh: '金管會上市（櫃）公司永續發展路徑圖',
    category: 'TW_REG',
    version: '2023',
    effectiveDate: '2023-01-01',
    status: 'active',
    summary: '金管會規定台灣上市上櫃公司分階段提升 ESG 揭露標準，要求依 GRI 準則編製永續報告書，並逐步導入 IFRS S1/S2。',
    keyRequirements: [
      '2023年：資本額100億以上上市公司強制申報永續報告書',
      '2025年：所有上市上櫃公司強制申報',
      '2026年：溫室氣體盤查須經第三方確信',
      '2027年：導入 IFRS S1/S2 雙軌揭露',
      'SASB 自願揭露：鼓勵企業依產業別採用 SASB 指標',
    ],
    disclosureItems: [
      {
        code: 'FSC-ESG-1',
        title: 'Mandatory ESG Report',
        titleZh: '永續報告書強制申報',
        type: 'both',
        required: true,
        guidance: '依金管會規定格式及時程編製並申報永續報告書',
        dataPoints: ['申報時間', '揭露範圍', '查證狀態'],
        evidenceRequired: ['永續報告書', '查證聲明書'],
      },
    ],
    relatedStandards: ['gri-2021', 'tcfd', 'issb-s1'],
    officialUrl: 'https://www.fsc.gov.tw',
    mandatory: true,
    applicableTo: ['台灣上市公司', '台灣上櫃公司'],
  },
  // ── EU Regulations ─────────────────────────────────────────────────────
  {
    id: 'eu-csrd',
    code: 'CSRD/ESRS',
    name: 'Corporate Sustainability Reporting Directive / European Sustainability Reporting Standards',
    nameZh: '歐盟企業永續報告指令 / 歐洲永續報告準則',
    category: 'EU_REG',
    version: '2023',
    effectiveDate: '2024-01-01',
    status: 'active',
    summary: 'CSRD 是歐盟最新的永續報告法規，要求企業依 ESRS 揭露 ESG 資訊，引入「雙重重大性」原則，影響在歐洲營運的台灣供應商。',
    keyRequirements: [
      '雙重重大性評估（影響重大性 + 財務重大性）',
      'ESRS E1：氣候變遷',
      'ESRS E2-E5：污染、水與海洋資源、生物多樣性、循環經濟',
      'ESRS S1-S4：自身員工、價值鏈工作者、受影響社區、消費者',
      'ESRS G1：商業行為（反腐敗、政治參與）',
    ],
    disclosureItems: [
      {
        code: 'ESRS-E1',
        title: 'Climate change',
        titleZh: 'ESRS E1 氣候變遷',
        type: 'both',
        required: true,
        guidance: '揭露組織在氣候相關轉型計畫、GHG 排放、能源及實體風險等方面的資訊',
        dataPoints: ['過渡計畫', 'GHG排放目標', '再生能源比例', '氣候風險暴露'],
        evidenceRequired: ['氣候相關分析報告', 'GHG盤查報告'],
      },
    ],
    relatedStandards: ['tcfd', 'issb-s2', 'gri-305'],
    officialUrl: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
    mandatory: true,
    applicableTo: ['歐盟大型企業', '台灣供應鏈廠商（歐盟客戶要求）'],
  },
  {
    id: 'eu-cbam',
    code: 'CBAM',
    name: 'Carbon Border Adjustment Mechanism',
    nameZh: '歐盟碳邊境調整機制',
    category: 'EU_REG',
    version: '2023',
    effectiveDate: '2023-10-01',
    status: 'active',
    summary: 'CBAM 對進入歐盟的高碳商品（鋼鐵、鋁、水泥、化肥、電力、氫氣）課徵碳關稅，台灣出口商須建立碳足跡追蹤與申報機制。',
    keyRequirements: [
      '申報期間：2023-2025年（過渡期，僅申報不繳費）',
      '正式實施：2026年起開始購買 CBAM 憑證',
      '申報內容：商品的直接與間接排放量',
      '產品範圍：鋼鐵、鋁、水泥、化肥、電力、氫氣',
      '依歐盟 ETS 碳價計算 CBAM 費用',
    ],
    disclosureItems: [
      {
        code: 'CBAM-REP',
        title: 'CBAM Quarterly Report',
        titleZh: 'CBAM 季報申報',
        type: 'quantitative',
        required: true,
        guidance: '每季向歐盟海關申報進口商品的碳排放量及在原產國支付的碳價',
        dataPoints: ['商品碳足跡(tCO₂e/噸)', '年度出口量', '原產地碳價', '應繳CBAM費用'],
        evidenceRequired: ['碳足跡計算報告', '原產地碳稅證明'],
        formula: 'CBAM費用 = (產品碳足跡 - 已支付碳價) × 歐盟ETS碳價',
        unit: '歐元',
      },
    ],
    relatedStandards: ['eu-csrd', 'gri-305', 'iso-14064'],
    officialUrl: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
    mandatory: true,
    applicableTo: ['鋼鐵出口商', '鋁業出口商', '化工出口商'],
  },
  // ── SASB ──────────────────────────────────────────────────────────────
  {
    id: 'sasb-tech',
    code: 'SASB TC-SI',
    name: 'SASB Technology & Communications — Software & IT Services',
    nameZh: 'SASB 科技業軟體與資訊服務標準',
    category: 'SASB',
    version: '2023',
    effectiveDate: '2018-10-04',
    status: 'active',
    summary: '針對軟體與 IT 服務產業的永續會計標準，重點揭露能源管理、資安隱私、勞工實踐及創新管理等議題。',
    keyRequirements: [
      'TC-SI-130a: 環境足跡 — 能源管理',
      'TC-SI-220a: 社會資本 — 資料安全',
      'TC-SI-230a: 社會資本 — 客戶隱私',
      'TC-SI-330a: 人力資本 — 員工多元與融合',
      'TC-SI-520a: 商業模式與創新 — 智慧財產保護',
    ],
    disclosureItems: [
      {
        code: 'TC-SI-130a.1',
        title: 'Total energy consumed',
        titleZh: '總能源消耗量',
        type: 'quantitative',
        required: true,
        guidance: '揭露總能源消耗量及來自再生能源的比例',
        dataPoints: ['總能源消耗(GJ)', '再生能源佔比(%)'],
        evidenceRequired: ['能源帳單', '綠電採購憑證'],
        formula: '再生能源佔比 = 再生能源消耗量 / 總能源消耗量 × 100%',
        unit: 'GJ',
      },
    ],
    relatedStandards: ['gri-302', 'gri-305', 'issb-s2'],
    officialUrl: 'https://sasb.org/standards/technology-communications/',
    mandatory: false,
    applicableTo: ['軟體公司', 'IT服務業', '半導體業'],
  },
];

export const STANDARD_CATEGORIES = [
  { id: 'all', label: '全部規範', count: STANDARDS.length },
  { id: 'GRI', label: 'GRI 準則', count: STANDARDS.filter(s => s.category === 'GRI').length },
  { id: 'TCFD', label: 'TCFD', count: STANDARDS.filter(s => s.category === 'TCFD').length },
  { id: 'ISSB', label: 'ISSB/IFRS S', count: STANDARDS.filter(s => s.category === 'ISSB').length },
  { id: 'ISO', label: 'ISO 標準', count: STANDARDS.filter(s => s.category === 'ISO').length },
  { id: 'TW_REG', label: '台灣法規', count: STANDARDS.filter(s => s.category === 'TW_REG').length },
  { id: 'EU_REG', label: '歐盟法規', count: STANDARDS.filter(s => s.category === 'EU_REG').length },
  { id: 'SASB', label: 'SASB', count: STANDARDS.filter(s => s.category === 'SASB').length },
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GRI:    { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  TCFD:   { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
  ISSB:   { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
  ISO:    { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  TW_REG: { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' },
  EU_REG: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  SASB:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
};

export const COMPLIANCE_TIMELINE = [
  { year: 2023, event: '金管會：資本額100億以上上市公司強制申報永續報告書', category: 'TW_REG', urgent: false },
  { year: 2023, event: 'CBAM 過渡期開始：進口商開始申報（不繳費）', category: 'EU_REG', urgent: false },
  { year: 2024, event: 'IFRS S1/S2 正式生效', category: 'ISSB', urgent: false },
  { year: 2025, event: '金管會：所有上市上櫃公司強制申報永續報告書', category: 'TW_REG', urgent: true },
  { year: 2026, event: '金管會：GHG 盤查須第三方確信 (T3+)', category: 'TW_REG', urgent: true },
  { year: 2026, event: 'CBAM 正式課徵：開始購買 CBAM 憑證', category: 'EU_REG', urgent: true },
  { year: 2027, event: '金管會：導入 IFRS S1/S2 雙軌揭露', category: 'TW_REG', urgent: false },
  { year: 2028, event: 'CSRD：中小型企業逐步納入適用範圍', category: 'EU_REG', urgent: false },
];