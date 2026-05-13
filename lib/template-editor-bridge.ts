export interface TemplateField {
  id: string;
  label: string;
  gri: string;
  unit?: string;
  formula?: string;
  documents: string[];
  department: string;
  required: boolean;
  placeholder?: string;
}

export interface ExpertTemplate {
  id: string;
  title: string;
  titleEn: string;
  category: 'G' | 'E' | 'S' | 'T';
  griStandard: string;
  description: string;
  fields: TemplateField[];
  chapterMapping: string; // maps to editor chapter id
  complianceFrameworks: string[];
  documentChecklist: DocumentItem[];
}

export interface DocumentItem {
  id: string;
  name: string;
  nameZh: string;
  required: boolean;
  department: string;
  status: 'collected' | 'pending' | 'missing';
  fileTypes: string[];
  description: string;
}

export interface EditorChapter {
  id: string;
  title: string;
  titleEn: string;
  griCodes: string[];
  status: 'not_started' | 'in_progress' | 'review' | 'completed';
  content: string;
  documentItems: DocumentItem[];
  templateId?: string;
  fields: TemplateField[];
  completionRate: number;
  lastSaved?: string;
  aiSuggestions: string[];
  complianceScore: number;
}

export const EXPERT_TEMPLATES: ExpertTemplate[] = [
  {
    id: 'tpl-general-governance',
    title: '基礎治理與重大性評估',
    titleEn: 'General Disclosures & Materiality',
    category: 'G',
    griStandard: 'GRI 2-1, 2-6, 2-9, 2-22, 3-1, 3-2',
    description: '公司基本資料、治理架構、重大性矩陣與道德誠信揭露',
    chapterMapping: 'chapter-governance',
    complianceFrameworks: ['GRI 2021', 'TWSE 2024', 'ISSB S1'],
    fields: [
      {
        id: 'f-company-name', label: '公司名稱', gri: 'GRI 2-1',
        documents: ['公司登記證明', '年報封面'], department: '法務',
        required: true, placeholder: '請輸入公司全名'
      },
      {
        id: 'f-revenue', label: '年度總營收', gri: 'GRI 2-6', unit: '新台幣千元',
        documents: ['財報', '會計師查核報告'], department: '財務',
        required: true, placeholder: '例：1,250,000'
      },
      {
        id: 'f-employees', label: '員工總人數', gri: 'GRI 2-7', unit: '人',
        documents: ['人資系統匯出報表', '員工名冊'], department: '人資',
        required: true, placeholder: '例：523'
      },
      {
        id: 'f-board-members', label: '董事會成員數', gri: 'GRI 2-9', unit: '人',
        documents: ['董事會名冊', '董事會績效評估報告'], department: '董事會秘書室',
        required: true, placeholder: '例：9'
      },
      {
        id: 'f-independent-directors', label: '獨立董事比例', gri: 'GRI 2-9', unit: '%',
        documents: ['董事會名冊'], department: '董事會秘書室',
        required: true, formula: '獨立董事人數 / 董事會總人數 × 100%',
        placeholder: '例：33.3'
      },
      {
        id: 'f-female-board', label: '女性董事比例', gri: 'GRI 2-9', unit: '%',
        documents: ['董事會名冊'], department: '董事會秘書室',
        required: false, placeholder: '例：22.2'
      },
      {
        id: 'f-corruption-cases', label: '貪腐事件件數', gri: 'GRI 205-3', unit: '件',
        documents: ['內部稽核報告', '申訴管道紀錄'], department: '稽核',
        required: true, placeholder: '例：0'
      },
      {
        id: 'f-legal-fines', label: '違反法規罰款總額', gri: 'GRI 2-27', unit: '新台幣元',
        documents: ['法務裁罰通知書'], department: '法務',
        required: true, placeholder: '例：0'
      }
    ],
    documentChecklist: [
      { id: 'doc-annual-report', name: 'Annual Report', nameZh: '年報', required: true, department: '財務', status: 'pending', fileTypes: ['pdf'], description: '最新年度財務報告' },
      { id: 'doc-registration', name: 'Company Registration', nameZh: '公司登記證明', required: true, department: '法務', status: 'pending', fileTypes: ['pdf'], description: '公司登記基本資料' },
      { id: 'doc-board-list', name: 'Board Member List', nameZh: '董事會名冊', required: true, department: '董事會秘書室', status: 'pending', fileTypes: ['pdf', 'xlsx'], description: '含性別、年齡、任期等資訊' },
      { id: 'doc-audit-report', name: 'Internal Audit Report', nameZh: '內部稽核報告', required: true, department: '稽核', status: 'pending', fileTypes: ['pdf'], description: '年度內部稽核結果' },
      { id: 'doc-stakeholder-survey', name: 'Stakeholder Survey', nameZh: '利害關係人問卷', required: true, department: '永續委員會', status: 'pending', fileTypes: ['pdf', 'xlsx'], description: '重大性評估問卷結果' }
    ]
  },
  {
    id: 'tpl-environment',
    title: '環境面數據盤查',
    titleEn: 'Environment (E) — GHG, Energy, Water, Waste',
    category: 'E',
    griStandard: 'GRI 302, 303, 305, 306',
    description: '溫室氣體盤查、能源管理、水資源及廢棄物數據揭露',
    chapterMapping: 'chapter-environment',
    complianceFrameworks: ['GRI 2021', 'ISO 14064-1', 'TCFD', 'ISSB S2'],
    fields: [
      {
        id: 'f-scope1', label: '範疇一直接排放量', gri: 'GRI 305-1', unit: '公噸 CO₂e',
        documents: ['ISO 14064-1 盤查清冊', '查證聲明書', '冷媒填充紀錄'],
        department: '廠務/環安衛', required: true,
        formula: '燃料燃燒 + 製程排放 + 逸散排放',
        placeholder: '例：1,250.5'
      },
      {
        id: 'f-scope2', label: '範疇二間接排放量', gri: 'GRI 305-2', unit: '公噸 CO₂e',
        documents: ['台電帳單', 'T-REC 綠電憑證'],
        department: '總務/廠務', required: true,
        formula: '用電度數 × 電力排放係數',
        placeholder: '例：890.2'
      },
      {
        id: 'f-scope3', label: '範疇三價值鏈排放量', gri: 'GRI 305-3', unit: '公噸 CO₂e',
        documents: ['供應商碳排數據', '差旅紀錄'],
        department: '採購/廠務', required: false,
        placeholder: '例：3,420.0'
      },
      {
        id: 'f-electricity', label: '總用電量', gri: 'GRI 302-1', unit: 'MWh',
        documents: ['台電帳單'], department: '總務',
        required: true, placeholder: '例：5,230'
      },
      {
        id: 'f-renewable-energy', label: '再生能源使用比例', gri: 'GRI 302-1', unit: '%',
        documents: ['T-REC 綠電採購憑證', '太陽能發電紀錄'],
        department: '廠務', required: true,
        formula: '再生能源使用量 / 總用電量 × 100%',
        placeholder: '例：38'
      },
      {
        id: 'f-water-intake', label: '總取水量', gri: 'GRI 303-3', unit: '立方公尺',
        documents: ['自來水帳單', '水權狀'],
        department: '廠務/環安衛', required: true, placeholder: '例：12,500'
      },
      {
        id: 'f-waste-total', label: '廢棄物總量', gri: 'GRI 306-3', unit: '公噸',
        documents: ['廢棄物清運聯單', '回收商合法執照'],
        department: '環安衛', required: true, placeholder: '例：85.2'
      }
    ],
    documentChecklist: [
      { id: 'doc-ghg-inventory', name: 'GHG Inventory Report', nameZh: 'ISO 14064-1 盤查清冊', required: true, department: '環安衛', status: 'pending', fileTypes: ['pdf'], description: '符合 ISO 14064-1 之溫室氣體盤查清冊' },
      { id: 'doc-verification', name: 'Verification Statement', nameZh: '查證聲明書', required: true, department: '環安衛', status: 'pending', fileTypes: ['pdf'], description: '第三方查證機構出具之聲明書' },
      { id: 'doc-electricity-bill', name: 'Electricity Bill', nameZh: '台電帳單', required: true, department: '總務', status: 'pending', fileTypes: ['pdf'], description: '全年度台電用電帳單' },
      { id: 'doc-trec', name: 'T-REC Certificate', nameZh: '綠電採購憑證 T-REC', required: false, department: '廠務', status: 'pending', fileTypes: ['pdf'], description: '再生能源憑證' },
      { id: 'doc-water-bill', name: 'Water Bill', nameZh: '自來水帳單', required: true, department: '廠務', status: 'pending', fileTypes: ['pdf'], description: '全年度用水帳單' },
      { id: 'doc-waste-manifest', name: 'Waste Manifest', nameZh: '廢棄物清運聯單', required: true, department: '環安衛', status: 'pending', fileTypes: ['pdf'], description: '廢棄物清運聯單與處理紀錄' }
    ]
  },
  {
    id: 'tpl-social',
    title: '社會面數據揭露',
    titleEn: 'Social (S) — Labor, Safety, Training, Supply Chain',
    category: 'S',
    griStandard: 'GRI 401, 403, 404, 405, 414',
    description: '員工結構、職業安全、人才培育、供應鏈管理',
    chapterMapping: 'chapter-social',
    complianceFrameworks: ['GRI 2021', 'ISO 45001', 'SASB'],
    fields: [
      {
        id: 'f-new-hires', label: '新進員工人數', gri: 'GRI 401-1', unit: '人',
        documents: ['人資系統匯出報表'], department: '人資',
        required: true, placeholder: '例：45'
      },
      {
        id: 'f-turnover-rate', label: '員工離職率', gri: 'GRI 401-1', unit: '%',
        documents: ['人資系統匯出報表'],
        department: '人資', required: true,
        formula: '離職人數 / 期初員工數 × 100%',
        placeholder: '例：8.5'
      },
      {
        id: 'f-gender-pay-ratio', label: '男女薪酬比', gri: 'GRI 405-2', unit: '女:男',
        documents: ['薪資結算表'], department: '人資',
        required: true, placeholder: '例：0.92'
      },
      {
        id: 'f-injury-rate', label: '失能傷害頻率 (FR)', gri: 'GRI 403-9', unit: '次/百萬工時',
        documents: ['ISO 45001 證書', '勞保局職災申報單'],
        department: '環安衛/人資', required: true,
        formula: '(傷亡件數 × 1,000,000) / 總工時',
        placeholder: '例：0.85'
      },
      {
        id: 'f-training-hours', label: '平均受訓時數', gri: 'GRI 404-1', unit: '小時/人',
        documents: ['教育訓練簽到表', '線上課程完課紀錄'],
        department: '人資', required: true, placeholder: '例：32'
      },
      {
        id: 'f-local-procurement', label: '在地採購比例', gri: 'GRI 204-1', unit: '%',
        documents: ['採購系統紀錄'], department: '採購',
        required: false, placeholder: '例：62'
      }
    ],
    documentChecklist: [
      { id: 'doc-hr-report', name: 'HR System Report', nameZh: '人資系統匯出報表', required: true, department: '人資', status: 'pending', fileTypes: ['xlsx', 'pdf'], description: '含新進、離職、性別、年齡分佈' },
      { id: 'doc-salary', name: 'Salary Settlement', nameZh: '薪資結算表', required: true, department: '人資', status: 'pending', fileTypes: ['xlsx'], description: '含男女薪酬比較數據' },
      { id: 'doc-iso45001', name: 'ISO 45001 Certificate', nameZh: 'ISO 45001 證書', required: false, department: '環安衛', status: 'pending', fileTypes: ['pdf'], description: '職業安全衛生管理系統認證' },
      { id: 'doc-training-log', name: 'Training Log', nameZh: '教育訓練簽到表', required: true, department: '人資', status: 'pending', fileTypes: ['pdf', 'xlsx'], description: '全年度教育訓練出席紀錄' },
      { id: 'doc-supplier-code', name: 'Supplier Code of Conduct', nameZh: '供應商行為準則簽署書', required: true, department: '採購', status: 'pending', fileTypes: ['pdf'], description: '供應商永續承諾書' }
    ]
  },
  {
    id: 'tpl-tech-security',
    title: '資訊安全與創新揭露',
    titleEn: 'Technology, Security & Innovation',
    category: 'T',
    griStandard: 'GRI 418, SASB TC-SI',
    description: '資安防護、資料隱私與研發創新數據揭露',
    chapterMapping: 'chapter-tech',
    complianceFrameworks: ['GRI 2021', 'ISO 27001', 'SASB TC'],
    fields: [
      {
        id: 'f-data-breach', label: '資料外洩事件數', gri: 'GRI 418-1', unit: '件',
        documents: ['ISO 27001 證書', '資安演練紀錄', '系統弱點掃描報告'],
        department: '資訊中心', required: true, placeholder: '例：0'
      },
      {
        id: 'f-privacy-complaints', label: '客戶隱私投訴件數', gri: 'GRI 418-1', unit: '件',
        documents: ['客服投訴紀錄'], department: '資訊中心',
        required: true, placeholder: '例：0'
      },
      {
        id: 'f-rd-ratio', label: '研發費用佔比', gri: 'SASB TC-SI', unit: '%',
        documents: ['研發部門預算表'],
        department: '研發/財務', required: false,
        formula: '研發費用 / 總營收 × 100%',
        placeholder: '例：4.2'
      },
      {
        id: 'f-green-patents', label: '綠色專利取得數量', gri: 'SASB TC', unit: '件',
        documents: ['專利證書', '產學合作合約'],
        department: '研發', required: false, placeholder: '例：3'
      }
    ],
    documentChecklist: [
      { id: 'doc-iso27001', name: 'ISO 27001 Certificate', nameZh: 'ISO 27001 證書', required: false, department: '資訊中心', status: 'pending', fileTypes: ['pdf'], description: '資訊安全管理系統認證' },
      { id: 'doc-security-drill', name: 'Security Drill Record', nameZh: '資安演練紀錄', required: true, department: '資訊中心', status: 'pending', fileTypes: ['pdf'], description: '年度資安演練執行紀錄' },
      { id: 'doc-patent', name: 'Patent Certificate', nameZh: '專利證書', required: false, department: '研發', status: 'pending', fileTypes: ['pdf'], description: '已取得之專利證書清單' }
    ]
  }
];

export const EDITOR_CHAPTERS: EditorChapter[] = [
  {
    id: 'chapter-overview',
    title: '總單據收集狀況',
    titleEn: 'Master Document Collection Dashboard',
    griCodes: [],
    status: 'not_started',
    content: '',
    documentItems: [],
    fields: [],
    completionRate: 0,
    aiSuggestions: [],
    complianceScore: 0
  },
  {
    id: 'chapter-governance',
    title: '一、基礎治理與重大性評估',
    titleEn: 'General Disclosures & Materiality Assessment',
    griCodes: ['GRI 2-1', 'GRI 2-6', 'GRI 2-9', 'GRI 3-1', 'GRI 205-3'],
    status: 'not_started',
    content: '',
    documentItems: [],
    templateId: 'tpl-general-governance',
    fields: [],
    completionRate: 0,
    aiSuggestions: [
      '建議加入董事會多元化政策說明（GRI 2-9）',
      '重大性評估需附利害關係人問卷統計（GRI 3-1）',
      '貪腐事件若為零，建議說明防範機制（GRI 205-2）'
    ],
    complianceScore: 0
  },
  {
    id: 'chapter-environment',
    title: '二、環境面數據揭露',
    titleEn: 'Environment (E) — Energy, Water, GHG, Waste',
    griCodes: ['GRI 302-1', 'GRI 303-3', 'GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 306-3'],
    status: 'not_started',
    content: '',
    documentItems: [],
    templateId: 'tpl-environment',
    fields: [],
    completionRate: 0,
    aiSuggestions: [
      '範疇三排放雖非強制，揭露可提升 ESG 評分',
      '建議加入年度碳強度指標（排放量/營收）',
      '水資源若位於高水壓力地區，建議說明水資源策略'
    ],
    complianceScore: 0
  },
  {
    id: 'chapter-social',
    title: '三、社會面數據揭露',
    titleEn: 'Social (S) — Labor, Safety, Talent, Supply Chain',
    griCodes: ['GRI 401-1', 'GRI 403-9', 'GRI 404-1', 'GRI 405-2', 'GRI 414-1'],
    status: 'not_started',
    content: '',
    documentItems: [],
    templateId: 'tpl-social',
    fields: [],
    completionRate: 0,
    aiSuggestions: [
      '男女薪酬比建議附上分析說明，避免漂綠風險',
      '供應鏈 ESG 稽核比例建議逐年提升至 80%+',
      '建議加入職業病發生率（GRI 403-10）'
    ],
    complianceScore: 0
  },
  {
    id: 'chapter-tech',
    title: '四、資訊安全與創新',
    titleEn: 'Technology, Security & Innovation',
    griCodes: ['GRI 418-1', 'SASB TC-SI'],
    status: 'not_started',
    content: '',
    documentItems: [],
    templateId: 'tpl-tech-security',
    fields: [],
    completionRate: 0,
    aiSuggestions: [
      '建議說明資安治理架構與資安委員會（GRI 2-9）',
      '若有 ISO 27001 認證，建議明確揭露認證範疇',
      '研發投入建議與永續目標連結（例：綠色產品比例）'
    ],
    complianceScore: 0
  },
  {
    id: 'chapter-appendix',
    title: '五、附錄：GRI 索引對照表',
    titleEn: 'Appendix — GRI Content Index',
    griCodes: ['GRI 2-21'],
    status: 'not_started',
    content: '',
    documentItems: [],
    fields: [],
    completionRate: 0,
    aiSuggestions: [
      '依 GRI 2021 格式建立完整內容索引',
      '每項揭露標準需標明頁碼或章節',
      '外部確信聲明應附於附錄'
    ],
    complianceScore: 0
  }
];

export function getTemplateForChapter(chapterId: string): ExpertTemplate | undefined {
  return EXPERT_TEMPLATES.find(t => t.chapterMapping === chapterId);
}

export function calculateChapterCompletion(
  fields: TemplateField[],
  values: Record<string, string>,
  docs: DocumentItem[]
): number {
  const requiredFields = fields.filter(f => f.required);
  const filledFields = requiredFields.filter(f => values[f.id]?.trim());
  const requiredDocs = docs.filter(d => d.required);
  const collectedDocs = requiredDocs.filter(d => d.status === 'collected');

  const fieldScore = requiredFields.length > 0
    ? (filledFields.length / requiredFields.length) * 60
    : 60;
  const docScore = requiredDocs.length > 0
    ? (collectedDocs.length / requiredDocs.length) * 40
    : 40;

  return Math.round(fieldScore + docScore);
}

export function generateChapterContent(
  chapter: EditorChapter,
  template: ExpertTemplate,
  values: Record<string, string>
): string {
  const filledFields = template.fields.filter(f => values[f.id]?.trim());

  let content = `## ${chapter.title}\n\n`;
  content += `### 一、揭露範疇\n本章節依據 ${template.griStandard} 進行揭露。\n\n`;

  if (filledFields.length > 0) {
    content += `### 二、核心數據\n\n`;
    filledFields.forEach(f => {
      const val = values[f.id];
      content += `**${f.label}** (${f.gri})：${val}${f.unit ? ' ' + f.unit : ''}\n\n`;
      if (f.formula) {
        content += `> 計算公式：${f.formula}\n\n`;
      }
    });
  }

  content += `### 三、管理方針\n請說明貴公司針對上述指標的管理政策與目標...\n\n`;
  content += `### 四、佐證文件\n上述數據已取得相應佐證文件，詳見證據金庫。\n`;

  return content;
}
