export type ValidationStatus = 'pass' | 'fix' | 'block';

export interface ComponentCheck {
  id: string;
  label: string;
  required: boolean;
}

export interface ComponentSpec {
  name: string;
  category: 'base' | 'composite' | 'template';
  description: string;
  checks: ComponentCheck[];
  antiPatterns: string[];
}

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    name: 'Button',
    category: 'base',
    description: '操作元件，防止語意混亂，主/次/危險操作必須固定語意',
    checks: [
      { id: 'btn-1', label: '具備 primary / secondary / danger / ghost 語意分層', required: true },
      { id: 'btn-2', label: '同頁面主 CTA 最多一個', required: true },
      { id: 'btn-3', label: '具備 default / hover / focus / disabled / loading 狀態', required: true },
      { id: 'btn-4', label: 'loading 時自動 disabled', required: true },
      { id: 'btn-5', label: '不接受任意色彩 props', required: true },
      { id: 'btn-6', label: '手機版觸控目標 ≥ 44px', required: true },
      { id: 'btn-7', label: '危險操作與一般操作視覺差異明確', required: true },
    ],
    antiPatterns: ['新增 redPrimary/greenPrimary 等非語意 variant', '同頁出現兩顆相同 primary', '直接傳 hex color'],
  },
  {
    name: 'Input',
    category: 'base',
    description: '表單輸入核心，保證標籤/提示/錯誤/狀態一致',
    checks: [
      { id: 'inp-1', label: 'label 為必填，不可只靠 placeholder', required: true },
      { id: 'inp-2', label: '具備 focus / error / disabled / readonly 狀態', required: true },
      { id: 'inp-3', label: 'errorMessage 為受控欄位', required: true },
      { id: 'inp-4', label: 'helperText 與 errorMessage 不競爭同一位置', required: true },
      { id: 'inp-5', label: '欄位寬度符合資料型態', required: false },
    ],
    antiPatterns: ['只用 placeholder 取代 label', '錯誤訊息集中在頁首', 'readOnly 與 disabled 外觀相同'],
  },
  {
    name: 'Select',
    category: 'base',
    description: '下拉選擇元件，選項結構統一',
    checks: [
      { id: 'sel-1', label: 'options 結構統一 { label, value }', required: true },
      { id: 'sel-2', label: 'placeholder 與已選值可明確區分', required: true },
      { id: 'sel-3', label: '具備 disabled / error 狀態', required: true },
      { id: 'sel-4', label: '過長選項文字有截斷處理', required: false },
    ],
    antiPatterns: ['各頁自定 option key 名稱', 'placeholder 與已選值顏色相同'],
  },
  {
    name: 'Badge',
    category: 'base',
    description: '純狀態/標籤顯示，不自行理解業務狀態',
    checks: [
      { id: 'bdg-1', label: '只接受受控 tone，不接受任意顏色', required: true },
      { id: 'bdg-2', label: '業務狀態映射由 StatusBadge 負責', required: true },
      { id: 'bdg-3', label: '文字不可太小導致難讀', required: true },
    ],
    antiPatterns: ['傳入 hex color', '在 table cell 直接寫 span 做假 badge', '同狀態不同模組顏色不同'],
  },
  {
    name: 'Table',
    category: 'base',
    description: '關鍵基礎元件，合約/補助/執行項目/證據列表都需使用',
    checks: [
      { id: 'tbl-1', label: 'columns 結構統一，不可各模組各自定義', required: true },
      { id: 'tbl-2', label: '支援 empty state / loading / error', required: true },
      { id: 'tbl-3', label: '欄位按任務優先度排序', required: true },
      { id: 'tbl-4', label: '手機版改用替代呈現或橫向捲動', required: true },
      { id: 'tbl-5', label: '長文字截斷且可查看完整內容', required: false },
      { id: 'tbl-6', label: '批次選取不易誤觸', required: false },
    ],
    antiPatterns: ['每個模組複製貼上一份 table', '沒有 empty state', '手機版直接爆版'],
  },
  {
    name: 'Modal',
    category: 'base',
    description: '中斷式互動，確保一致的開關邏輯與危險確認',
    checks: [
      { id: 'mod-1', label: 'open 受控，onClose 必填', required: true },
      { id: 'mod-2', label: '支援 Esc / 點外部關閉', required: true },
      { id: 'mod-3', label: '危險操作有二次確認 footer', required: true },
      { id: 'mod-4', label: '不將長表單塞入 Modal', required: true },
      { id: 'mod-5', label: '標題清楚說明目的', required: true },
    ],
    antiPatterns: ['每頁各自實作 open/close 邏輯', '危險操作無確認', '長表單塞進 Modal'],
  },
  {
    name: 'Alert',
    category: 'base',
    description: '提示框，info/success/warning/danger 四種語意',
    checks: [
      { id: 'alt-1', label: '嚴格區分 info / success / warning / danger', required: true },
      { id: 'alt-2', label: '文字具體說明問題與下一步', required: true },
      { id: 'alt-3', label: '不取代正式欄位錯誤訊息', required: true },
      { id: 'alt-4', label: '不濫用 danger 造成警示疲乏', required: true },
    ],
    antiPatterns: ['只說「發生錯誤」不指出原因', '用 alert 取代欄位錯誤', 'warning 和 danger 顏色無差異'],
  },
  {
    name: 'StatusBadge',
    category: 'composite',
    description: '業務狀態唯一入口，所有模組共用，不允許各自實作',
    checks: [
      { id: 'sb-1', label: 'status 必須來自 shared-types RecordLifecycleStatus', required: true },
      { id: 'sb-2', label: '顯示邏輯由 STATUS_PRESENTATION_MAP 統一', required: true },
      { id: 'sb-3', label: '不允許各模組自行實作 ContractStatusBadge 等', required: true },
      { id: 'sb-4', label: '列表與詳情頁 label 一致', required: true },
    ],
    antiPatterns: ['ContractStatusBadge', 'GrantStatusPill', '手動寫顏色 className'],
  },
  {
    name: 'EmptyState',
    category: 'base',
    description: '空狀態提示，必須說明原因與下一步',
    checks: [
      { id: 'es-1', label: '說明目前為什麼沒有資料', required: true },
      { id: 'es-2', label: '提供下一步指引', required: true },
      { id: 'es-3', label: '篩選無結果時提供清除篩選方式', required: true },
      { id: 'es-4', label: '不只寫「無資料」', required: true },
    ],
    antiPatterns: ['空白頁面不做任何說明', '只寫「暫無資料」', '沒有 CTA'],
  },
  {
    name: 'Tabs',
    category: 'base',
    description: '分頁切換，命名直觀，數量受控',
    checks: [
      { id: 'tab-1', label: '分頁命名直觀，非技術命名', required: true },
      { id: 'tab-2', label: '數量不超過 6 個', required: true },
      { id: 'tab-3', label: '目前 active tab 清楚可見', required: true },
      { id: 'tab-4', label: '不把主要流程拆成過多 tab', required: true },
    ],
    antiPatterns: ['tab 超過 8 個', 'active 狀態不明顯', '主要任務分散在多個 tab'],
  },
];

export type PageTemplate = 'dashboard' | 'list' | 'detail' | 'form' | 'report';

export interface PageValidationItem {
  id: string;
  question: string;
  required: boolean;
  template: PageTemplate[];
}

export const PAGE_VALIDATION_ITEMS: PageValidationItem[] = [
  // Universal
  { id: 'u1', question: '這一頁的主任務是否單一且明確', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u2', question: '使用者是否能在 5 秒內理解頁面用途', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u3', question: '主資訊與次資訊是否層級清楚', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u4', question: '是否能快速找到下一步操作', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u5', question: '畫面是否隨資料量增加仍穩定不崩壞', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u6', question: '是否有初始載入狀態', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u7', question: '是否有空資料狀態', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u8', question: '是否有錯誤狀態', required: true, template: ['dashboard','list','detail','form','report'] },
  { id: 'u9', question: '是否有手機版檢查', required: true, template: ['dashboard','list','detail','form','report'] },
  // Dashboard
  { id: 'd1', question: '首屏能立即看出目前系統狀態', required: true, template: ['dashboard'] },
  { id: 'd2', question: '主指標只有一層核心焦點', required: true, template: ['dashboard'] },
  { id: 'd3', question: '警示資訊比一般資訊更醒目', required: true, template: ['dashboard'] },
  { id: 'd4', question: '指標數值有單位、時間範圍與變化基準', required: true, template: ['dashboard'] },
  { id: 'd5', question: '異常資料可以點進去追查', required: false, template: ['dashboard'] },
  // List
  { id: 'l1', question: '清單主要辨識欄位固定在前段', required: true, template: ['list'] },
  { id: 'l2', question: '狀態欄位易於掃描', required: true, template: ['list'] },
  { id: 'l3', question: '篩選器數量不壓縮主內容區', required: true, template: ['list'] },
  { id: 'l4', question: '每列操作一致', required: true, template: ['list'] },
  { id: 'l5', question: '能快速進入詳細頁，不多次繞路', required: true, template: ['list'] },
  // Detail
  { id: 'dt1', question: '進頁面就知道這是什麼對象', required: true, template: ['detail'] },
  { id: 'dt2', question: '對象狀態清楚且固定位置', required: true, template: ['detail'] },
  { id: 'dt3', question: '關鍵欄位優先露出，不埋在折疊區', required: true, template: ['detail'] },
  { id: 'dt4', question: '附件/證據/版本/審計有固定區域', required: true, template: ['detail'] },
  { id: 'dt5', question: '危險操作與一般操作分層', required: true, template: ['detail'] },
  // Form
  { id: 'f1', question: '表單目的寫清楚', required: true, template: ['form'] },
  { id: 'f2', question: '必填欄位明確標示', required: true, template: ['form'] },
  { id: 'f3', question: '欄位順序符合真實填寫流程', required: true, template: ['form'] },
  { id: 'f4', question: '驗證訊息貼近欄位且指出如何修正', required: true, template: ['form'] },
  { id: 'f5', question: '提交後有明確成功或失敗回饋', required: true, template: ['form'] },
  // Report
  { id: 'r1', question: '有明確版本與日期標示', required: true, template: ['report'] },
  { id: 'r2', question: '能快速看見核心摘要與重點指標', required: true, template: ['report'] },
  { id: 'r3', question: '圖表有標題/單位/資料來源', required: true, template: ['report'] },
  { id: 'r4', question: '匯出格式維持資訊秩序', required: true, template: ['report'] },
];

export const BLOCK_CONDITIONS: string[] = [
  '沒有 loading / error / empty 狀態',
  '沒有手機版檢查',
  '主 CTA 不明確',
  '同語意元件使用不同樣式',
  '關鍵狀態資訊位置不固定',
  '表單錯誤無法就地修正',
  '危險操作沒有足夠保護',
  '同模組命名混亂',
  '新頁面未套模板且無例外批准',
];