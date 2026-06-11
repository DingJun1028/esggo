export type AuditStatus = 'pass' | 'warn' | 'fail' | 'skip';
export type AuditCategory =
  | 'visual'
  | 'interaction'
  | 'structure'
  | 'engineering'
  | 'accessibility'
  | 'rwd';

export interface AuditRule {
  id: string;
  category: AuditCategory;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  checkFn?: () => AuditStatus;
}

export interface AuditResult {
  ruleId: string;
  status: AuditStatus;
  message?: string;
  timestamp: string;
}

export interface PageAudit {
  pageId: string;
  pageName: string;
  pagePath: string;
  results: AuditResult[];
  score: number;
  lastAuditAt: string;
}

export const AUDIT_RULES: AuditRule[] = [
  // Visual Rules
  {
    id: 'V001',
    category: 'visual',
    title: '視覺層級清晰',
    description: '頁面必須有清楚的 H1 > H2 > Body 層級，不可全部同級',
    priority: 'critical',
  },
  {
    id: 'V002',
    category: 'visual',
    title: '色彩語意一致',
    description: '相同狀態不可使用不同顏色，error=紅、success=綠、warning=琥珀',
    priority: 'high',
  },
  {
    id: 'V003',
    category: 'visual',
    title: '間距一致性',
    description: '卡片、列表、表單的 padding 必須使用 token，不可硬編',
    priority: 'high',
  },
  {
    id: 'V004',
    category: 'visual',
    title: '字體規則遵循',
    description: '只使用 Inter / Noto Sans TC，不可引入其他字體',
    priority: 'medium',
  },
  {
    id: 'V005',
    category: 'visual',
    title: '品牌色正確使用',
    description: 'Berkeley Blue (#003262) 與 Gold (#FDB515) 必須用在正確語意位置',
    priority: 'high',
  },
  // Interaction Rules
  {
    id: 'I001',
    category: 'interaction',
    title: '按鈕狀態完整',
    description: 'Button 必須有 default / hover / focus / disabled / loading 五態',
    priority: 'critical',
  },
  {
    id: 'I002',
    category: 'interaction',
    title: '表單驗證即時',
    description: '必填欄位必須有 error 狀態，不可等到提交後才顯示',
    priority: 'critical',
  },
  {
    id: 'I003',
    category: 'interaction',
    title: '載入狀態明確',
    description: '所有非同步操作必須有 loading skeleton 或 spinner',
    priority: 'high',
  },
  {
    id: 'I004',
    category: 'interaction',
    title: '空狀態處理',
    description: '列表頁在無資料時必須有 empty state 元件，不可顯示空白',
    priority: 'high',
  },
  {
    id: 'I005',
    category: 'interaction',
    title: '成功回饋清楚',
    description: '操作成功後必須有 toast 或狀態變更，不可靜默完成',
    priority: 'high',
  },
  {
    id: 'I006',
    category: 'interaction',
    title: '錯誤可恢復',
    description: 'API 錯誤必須提供重試機制，不可讓使用者只能重刷頁面',
    priority: 'critical',
  },
  // Structure Rules
  {
    id: 'S001',
    category: 'structure',
    title: '每頁主任務明確',
    description: '每個頁面只能有一個核心 CTA，不可同時有多個競爭性按鈕',
    priority: 'critical',
  },
  {
    id: 'S002',
    category: 'structure',
    title: '麵包屑導航',
    description: '第二層以上頁面必須有麵包屑或返回按鈕',
    priority: 'high',
  },
  {
    id: 'S003',
    category: 'structure',
    title: '頁面標題清楚',
    description: '每頁必須有清晰的 H1 標題，讓使用者知道所在位置',
    priority: 'critical',
  },
  {
    id: 'S004',
    category: 'structure',
    title: '資訊分組合理',
    description: '相關欄位必須分組，不可將所有欄位塞進一個無結構的表單',
    priority: 'high',
  },
  {
    id: 'S005',
    category: 'structure',
    title: '模板一致性',
    description: '相同類型頁面必須套用相同模板（清單/詳情/表單/報表）',
    priority: 'critical',
  },
  // Engineering Rules
  {
    id: 'E001',
    category: 'engineering',
    title: '使用共用元件',
    description: '禁止頁面自行定義長期使用的樣式，必須使用 BrandComponent',
    priority: 'critical',
  },
  {
    id: 'E002',
    category: 'engineering',
    title: '無硬編顏色',
    description: '所有顏色值必須來自 design tokens，不可在 JSX 中直接寫色碼',
    priority: 'high',
  },
  {
    id: 'E003',
    category: 'engineering',
    title: 'TypeScript 型別完整',
    description: '所有 props 與 API 回應必須有完整 TypeScript 型別定義',
    priority: 'high',
  },
  {
    id: 'E004',
    category: 'engineering',
    title: 'Suspense 邊界',
    description: '所有使用 useSearchParams/usePathname 的元件必須包 Suspense',
    priority: 'critical',
  },
  // Accessibility Rules
  {
    id: 'A001',
    category: 'accessibility',
    title: 'ARIA 標籤',
    description: '按鈕、連結、表單必須有 aria-label 或可讀文字',
    priority: 'high',
  },
  {
    id: 'A002',
    category: 'accessibility',
    title: '色彩對比度',
    description: '文字顏色對背景的對比度必須符合 WCAG AA (4.5:1)',
    priority: 'high',
  },
  {
    id: 'A003',
    category: 'accessibility',
    title: 'Focus 可見',
    description: '鍵盤 focus 狀態必須可見，不可使用 outline: none',
    priority: 'medium',
  },
  // RWD Rules
  {
    id: 'R001',
    category: 'rwd',
    title: '手機版可讀',
    description: '320px 至 767px 寬度下所有文字必須可讀，不可溢出',
    priority: 'critical',
  },
  {
    id: 'R002',
    category: 'rwd',
    title: '表格手機處理',
    description: '表格在手機版必須可橫向捲動或轉為卡片式呈現',
    priority: 'high',
  },
  {
    id: 'R003',
    category: 'rwd',
    title: '主要 CTA 手機可見',
    description: '主要操作按鈕在手機版不可被遮擋或消失',
    priority: 'critical',
  },
  {
    id: 'R004',
    category: 'rwd',
    title: '觸控目標尺寸',
    description: '所有可點擊元素在手機版最小尺寸必須達到 44×44px',
    priority: 'high',
  },
  {
    id: 'R005',
    category: 'rwd',
    title: '斷點切換不失真',
    description: '欄位排列在斷點切換時必須維持閱讀順序，不可跳動錯亂',
    priority: 'high',
  },
];

export const PAGE_REGISTRY: Array<{
  id: string;
  name: string;
  path: string;
  template: 'dashboard' | 'list' | 'detail' | 'form' | 'report';
  module: string;
  priority: 'core' | 'high' | 'medium';
}> = [
  { id: 'p001', name: '控制台', path: '/', template: 'dashboard', module: 'CORE', priority: 'core' },
  { id: 'p002', name: '永續撰寫', path: '/editor', template: 'form', module: 'CORE', priority: 'core' },
  { id: 'p003', name: '數位分身', path: '/digital-twin', template: 'detail', module: 'CORE', priority: 'core' },
  { id: 'p004', name: '企業健檢', path: '/health-check', template: 'form', module: 'CORE', priority: 'core' },
  { id: 'p005', name: '商情中心', path: '/intelligence', template: 'list', module: 'CORE', priority: 'core' },
  { id: 'p006', name: '環境指揮', path: '/environmental', template: 'dashboard', module: 'ESG', priority: 'core' },
  { id: 'p007', name: '社會影響', path: '/social', template: 'dashboard', module: 'ESG', priority: 'core' },
  { id: 'p008', name: '公司治理', path: '/governance', template: 'dashboard', module: 'ESG', priority: 'core' },
  { id: 'p009', name: '重大性矩陣', path: '/materiality', template: 'form', module: 'GOVERNANCE', priority: 'high' },
  { id: 'p010', name: '審計日誌', path: '/audit-log', template: 'list', module: 'GOVERNANCE', priority: 'high' },
  { id: 'p011', name: '證據金庫', path: '/vault', template: 'list', module: 'GOVERNANCE', priority: 'high' },
  { id: 'p012', name: '淨零路線圖', path: '/roadmap', template: 'dashboard', module: 'INSIGHTS', priority: 'high' },
  { id: 'p013', name: 'VerifyLink', path: '/audit-verify', template: 'form', module: 'INSIGHTS', priority: 'high' },
  { id: 'p014', name: '報告發布', path: '/publish', template: 'form', module: 'INSIGHTS', priority: 'high' },
  { id: 'p015', name: '永續閱覽室', path: '/reading-room', template: 'list', module: 'INSIGHTS', priority: 'medium' },
  { id: 'p016', name: '永續學院', path: '/academy', template: 'list', module: 'ACADEMY', priority: 'high' },
  { id: 'p017', name: '顧問服務', path: '/advisors', template: 'list', module: 'ACADEMY', priority: 'medium' },
  { id: 'p018', name: '任務中心', path: '/tasks', template: 'list', module: 'SYSTEM', priority: 'high' },
  { id: 'p019', name: '供應鏈透明', path: '/supply-chain', template: 'list', module: 'INSIGHTS', priority: 'medium' },
  { id: 'p020', name: '企業管理', path: '/profile', template: 'form', module: 'SYSTEM', priority: 'high' },
];

export function calculateAuditScore(results: AuditResult[]): number {
  if (results.length === 0) return 0;
  const weights = { pass: 1, warn: 0.5, fail: 0, skip: 0.7 };
  const total = results.reduce((sum, r) => sum + weights[r.status], 0);
  return Math.round((total / results.length) * 100);
}

export function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#FDB515';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return '優秀';
  if (score >= 70) return '良好';
  if (score >= 50) return '需改善';
  return '不符規範';
}

export function groupRulesByCategory(rules: AuditRule[]) {
  return rules.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<AuditCategory, AuditRule[]>);
}