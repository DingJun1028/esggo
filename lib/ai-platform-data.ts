export interface GeminiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'json' | 'analysis';
  model?: string;
}

export interface GenkitFlow {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  color: string;
  badge: string;
}

export interface BlueWorkspace {
  id: string;
  name: string;
  description: string;
  records: number;
  tasks: number;
  members: number;
  status: 'active' | 'archived' | 'paused';
  lastActivity: string;
  color: string;
  tags: string[];
}

export interface BlueRecord {
  id: string;
  title: string;
  workspaceId: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  tags: string[];
  createdAt: string;
  source: 'manual' | 'ai_generated';
  content?: string;
  aiSummary?: string;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  action: string;
  source: 'gemini' | 'genkit' | 'blue' | 'combo';
  status: 'success' | 'processing' | 'error';
  details: string;
}

export const genkitFlows: GenkitFlow[] = [
  {
    id: 'summarize',
    name: 'summarizeFlow',
    nameZh: '智能摘要',
    description: 'Summarize long text into concise key points',
    descriptionZh: '將長文本智能摘要為精簡要點',
    icon: '📝',
    inputLabel: '輸入文本',
    inputPlaceholder: '請輸入需要摘要的文本...',
    outputLabel: '摘要結果',
    color: '#003262',
    badge: 'NLP',
  },
  {
    id: 'translate',
    name: 'translateFlow',
    nameZh: '多語言翻譯',
    description: 'Translate text into any target language',
    descriptionZh: '將文本翻譯成任何目標語言',
    icon: '🌐',
    inputLabel: '原始文本',
    inputPlaceholder: '請輸入需要翻譯的文本...',
    outputLabel: '翻譯結果',
    color: '#FDB515',
    badge: 'Translation',
  },
  {
    id: 'sentiment',
    name: 'sentimentFlow',
    nameZh: '情感分析',
    description: 'Analyze emotional tone and sentiment score',
    descriptionZh: '分析文本情感傾向與評分',
    icon: '💡',
    inputLabel: '分析文本',
    inputPlaceholder: '請輸入需要分析情感的文本...',
    outputLabel: '分析結果',
    color: '#00B140',
    badge: 'Analytics',
  },
  {
    id: 'research',
    name: 'researchFlow',
    nameZh: '深度研究',
    description: 'Multi-step research flow with overview and conclusions',
    descriptionZh: '多步驟研究流程，輸出概覽與結論',
    icon: '🔬',
    inputLabel: '研究主題',
    inputPlaceholder: '請輸入研究主題...',
    outputLabel: '研究報告',
    color: '#C4820A',
    badge: 'Research',
  },
];

export const blueWorkspaces: BlueWorkspace[] = [
  {
    id: 'ws-esg-001',
    name: 'ESG 永續治理',
    description: '企業永續報告與 GRI 揭露管理',
    records: 48,
    tasks: 23,
    members: 8,
    status: 'active',
    lastActivity: '2 小時前',
    color: '#003262',
    tags: ['GRI', 'ESG', '治理'],
  },
  {
    id: 'ws-carbon-002',
    name: '碳排放盤查',
    description: '範疇一二三碳排放數據追蹤',
    records: 134,
    tasks: 41,
    members: 5,
    status: 'active',
    lastActivity: '30 分鐘前',
    color: '#00B140',
    tags: ['碳盤查', 'Scope1', 'ISO14064'],
  },
  {
    id: 'ws-supply-003',
    name: '供應鏈管理',
    description: '供應商 ESG 稽核與管理',
    records: 67,
    tasks: 18,
    members: 6,
    status: 'active',
    lastActivity: '1 天前',
    color: '#FDB515',
    tags: ['供應鏈', '稽核', 'GRI308'],
  },
  {
    id: 'ws-report-004',
    name: '永續報告書',
    description: '2024 永續報告書撰寫與審核',
    records: 29,
    tasks: 55,
    members: 12,
    status: 'active',
    lastActivity: '5 小時前',
    color: '#C4820A',
    tags: ['報告書', 'GRI', 'TCFD'],
  },
];

export const blueRecords: BlueRecord[] = [
  {
    id: 'rec-001',
    title: 'GRI 302-1 能源消耗數據填報',
    workspaceId: 'ws-esg-001',
    status: 'in_progress',
    priority: 'high',
    assignee: '林環安',
    tags: ['GRI302', '能源'],
    createdAt: '2025-05-01',
    source: 'ai_generated',
    aiSummary: 'AI 自動從 ERP 系統提取能源消耗數據並生成填報模板',
  },
  {
    id: 'rec-002',
    title: '利害關係人問卷分析報告',
    workspaceId: 'ws-esg-001',
    status: 'review',
    priority: 'medium',
    assignee: '陳永續',
    tags: ['利害關係人', 'GRI2'],
    createdAt: '2025-04-28',
    source: 'ai_generated',
    aiSummary: 'AI 情感分析完成 247 份問卷，識別 Top 5 重大性議題',
  },
  {
    id: 'rec-003',
    title: '範疇二排放計算驗算',
    workspaceId: 'ws-carbon-002',
    status: 'todo',
    priority: 'critical',
    assignee: '王碳管',
    tags: ['Scope2', '電力', 'tCO2e'],
    createdAt: '2025-05-03',
    source: 'manual',
  },
  {
    id: 'rec-004',
    title: '供應商 ESG 問卷回收統計',
    workspaceId: 'ws-supply-003',
    status: 'done',
    priority: 'medium',
    assignee: '李採購',
    tags: ['供應商', 'GRI308'],
    createdAt: '2025-04-15',
    source: 'ai_generated',
    aiSummary: 'AI 自動整理 89 家供應商回覆，計算加權 ESG 評分',
  },
];

export const integrationLogs: IntegrationLog[] = [
  {
    id: 'log-001',
    timestamp: '2025-05-07 14:32:18',
    action: 'AI 生成任務 → Blue.cc 記錄創建',
    source: 'combo',
    status: 'success',
    details: '「GRI 302-1 能源消耗」任務已自動創建至 ESG 永續治理工作空間',
  },
  {
    id: 'log-002',
    timestamp: '2025-05-07 13:15:44',
    action: 'Genkit 情感分析 → 利害關係人問卷',
    source: 'genkit',
    status: 'success',
    details: '247 份問卷情感分析完成，整體正向度 73%',
  },
  {
    id: 'log-003',
    timestamp: '2025-05-07 11:08:22',
    action: 'Gemini Vision → 憑證圖像識別',
    source: 'gemini',
    status: 'success',
    details: '台電帳單 PDF 識別完成，自動提取 5,847 kWh 用電數據',
  },
  {
    id: 'log-004',
    timestamp: '2025-05-07 09:45:33',
    action: 'Genkit 摘要 → 永續閱覽室歸檔',
    source: 'combo',
    status: 'success',
    details: 'IPCC AR6 報告 340 頁摘要完成，已歸檔至永續閱覽室',
  },
  {
    id: 'log-005',
    timestamp: '2025-05-06 16:22:11',
    action: 'Gemini Code → GHG 計算公式生成',
    source: 'gemini',
    status: 'success',
    details: 'Scope 3 Category 1 計算腳本自動生成，已附加 5T 完整性封印',
  },
];