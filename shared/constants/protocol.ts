/**
 * ESGGO 5T 協議常數定義
 *
 * 5T 協議又稱為「真善美信通」
 *
 * 對應關係（按技術編號 T1-T5）：
 * T1 - Tangible (美)       - 抽象數據轉化為具體治理指標
 * T2 - Traceable (真)      - 每筆數據與原始憑證精確關聯
 * T3 - Trackable (信)      - 完整編輯軌跡與生命週期追蹤
 * T4 - Transparent (善)    - 主動掃描綠漂風險，算法公開
 * T5 - Trustworthy (通)    - SHA-256 雜湊鎖定，不可篡改
 *
 * 注意：「真善美信通」是中文口訣，順序非 T1-T5 技術編號順序
 */

export const FIVE_T_PROTOCOL = {
  T1: {
    code: 'T1' as const,
    en: 'Tangible',
    zh: '美',
    color: '#06B6D4', // cyan-500
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    icon: '⬡', // 六邊形代表具體化
    title: '美 (Tangible)',
    shortDesc: '可感知/具體化',
    fullDesc:
      '將抽象的永續願景轉化為具體的指標成果與實作項目。確保「善向」不再是空談，而是可被觀察與衡量的實體影響。',
    techImpl: 'Bento Grid 視覺化 + Skeleton Loader',
    kpiExample: 'GRI 覆蓋率矩陣、KPI 卡片數據完整度',
  },
  T2: {
    code: 'T2' as const,
    en: 'Traceable',
    zh: '真',
    color: '#10B981', // emerald-500
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    icon: '◎', // 圓圈代表溯源
    title: '真 (Traceable)',
    shortDesc: '可溯源',
    fullDesc: '鏈式日誌必須包含原始資料來源備註。確保每一筆數據都能回溯至其產生的起點。',
    techImpl: 'evidence_id 外鍵 + source_origin 欄位',
    kpiExample: '數據溯源路徑圖、evidence_id 關聯',
  },
  T3: {
    code: 'T3' as const,
    en: 'Trackable',
    zh: '信',
    color: '#219EBC', // blue
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    icon: '◈', // 菱形代表追蹤
    title: '信 (Trackable)',
    shortDesc: '可追蹤',
    fullDesc: '利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。實現數據全生命週期的動態監控。',
    techImpl: 'audit_logs 表 + 生命週期 Hook',
    kpiExample: '合規事件時間軸、lifecycle hooks',
  },
  T4: {
    code: 'T4' as const,
    en: 'Transparent',
    zh: '善',
    color: '#FFB703', // amber
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    icon: '◉', // 靶心代表透明
    title: '善 (Transparent)',
    shortDesc: '可透明驗算',
    fullDesc: '算法公式公開化，且必須通過「零幻覺驗證」。消除黑箱，確保計算邏輯的透明度與準確性。',
    techImpl: 'AI 合規引擎 + GRI 對齊檢查',
    kpiExample: 'AI 協作透明度分數、推理日誌',
  },
  T5: {
    code: 'T5' as const,
    en: 'Trustworthy',
    zh: '通',
    color: '#003262', // berkeley-blue
    bgColor: 'bg-[#003262]',
    textColor: 'text-[#003262]',
    borderColor: 'border-[#003262]',
    icon: '✦', // 星形代表信賴
    title: '通 (Trustworthy)',
    shortDesc: '不可篡改',
    fullDesc:
      '數據寫入後即刻執行雜湊鎖定與 Object.freeze()。確保數據的終極真實性。（嚴禁使用 Immutable）',
    techImpl: 'hash_lock 欄位 + Object.freeze()',
    kpiExample: 'SHA-256 hash lock、ZKP verification badge',
  },
} as const;

export type FiveTGateCode = keyof typeof FIVE_T_PROTOCOL;

export const FIVE_T_GATES = Object.values(FIVE_T_PROTOCOL);

// 4可1不可狀態機
export const FOUR_PLUS_ONE = {
  tangible: { label: '可感知', question: '指標是否已具體化？' },
  traceable: { label: '可溯源', question: '來源是否已標註？' },
  trackable: { label: '可追蹤', question: '路徑是否已紀錄？' },
  transparent: { label: '可透明驗算', question: '公式是否已公開且通過驗證？' },
  trustworthy: { label: '不可篡改', question: '雜湊鎖定是否已完成？' },
} as const;

// 色彩系統
export const COLORS = {
  primary: '#003262', // Berkeley Blue
  accent: '#FDB515', // California Gold
  success: '#10B981', // Emerald
  warning: '#FFB703', // Amber
  error: '#EF4444', // Red
  info: '#06B6D4', // Cyan
  surface: '#F8FAFC', // Slate-50
  card: '#FFFFFF', // White
  text: '#0F172A', // Slate-900
  textMuted: '#64748B', // Slate-500
  border: 'rgba(0, 50, 98, 0.1)',
} as const;
