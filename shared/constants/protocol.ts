/**
 * ESGGO 5T 協議常數定義
 *
 * 5T 協議又稱為「真善美信通」
 *
 * 英文命名（正確）：Truth, Goodness, Beauty, Trust, Transferful
 * 中文命名（正確）：真, 善, 美, 信, 通
 *
 * 對應關係（按技術編號 T1-T5）：
 * T1 - Truth (真)         - 可感知/具體化
 * T2 - Goodness (善)      - 可溯源/透明
 * T3 - Beauty (美)        - 可追蹤/可感知
 * T4 - Trust (信)         - 不可篡改/信賴
 * T5 - Transferful (通)   - 可追蹤/可傳遞
 */

export const FIVE_T_PROTOCOL = {
  T1: {
    code: 'T1' as const,
    en: 'Truth',
    zh: '真',
    color: '#06B6D4', // cyan-500
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    title: '真 (Truth)',
    shortDesc: '可感知/具體化',
    fullDesc:
      '將抽象的永續願景轉化為具體的指標成果與實作項目。確保「善向」不再是空談，而是可被觀察與衡量的實體影響。',
    techImpl: 'Bento Grid 視覺化 + Skeleton Loader',
  },
  T2: {
    code: 'T2' as const,
    en: 'Goodness',
    zh: '善',
    color: '#10B981', // emerald-500
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    title: '善 (Goodness)',
    shortDesc: '可溯源',
    fullDesc:
      '鏈式日誌必須包含原始資料來源 (source_origin) 備註。確保每一筆數據都能回溯至其產生的起點。',
    techImpl: 'evidence_id 外鍵 + source_origin 欄位',
  },
  T3: {
    code: 'T3' as const,
    en: 'Beauty',
    zh: '美',
    color: '#219EBC', // blue
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    title: '美 (Beauty)',
    shortDesc: '可追蹤',
    fullDesc: '利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。實現數據全生命週期的動態監控。',
    techImpl: 'audit_logs 表 + 生命週期 Hook',
  },
  T4: {
    code: 'T4' as const,
    en: 'Trust',
    zh: '信',
    color: '#FFB703', // amber
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    title: '信 (Trust)',
    shortDesc: '不可篡改',
    fullDesc:
      '數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。確保數據的終極真實性。（嚴禁使用 Immutable）',
    techImpl: 'hash_lock 欄位 + Object.freeze()',
  },
  T5: {
    code: 'T5' as const,
    en: 'Transferful',
    zh: '通',
    color: '#003262', // berkeley-blue
    bgColor: 'bg-[#003262]',
    textColor: 'text-[#003262]',
    borderColor: 'border-[#003262]',
    title: '通 (Transferful)',
    shortDesc: '可透明驗算',
    fullDesc:
      '算法公式公開化（如 [ISO-14064-1]），且必須通過「零幻覺驗證」。消除黑箱，確保計算邏輯的透明度與準確性。',
    techImpl: 'AI 合規引擎 + GRI 對齊檢查',
  },
} as const;

export type FiveTGateCode = keyof typeof FIVE_T_PROTOCOL;

export const FIVE_T_GATES = Object.values(FIVE_T_PROTOCOL);

// 4可1不可狀態機
export const FOUR_PLUS_ONE = {
  truth: { label: '可感知', question: '指標是否已具體化？' },
  goodness: { label: '可溯源', question: '來源是否已標註？' },
  beauty: { label: '可追蹤', question: '路徑是否已紀錄？' },
  trust: { label: '不可篡改', question: '雜湊鎖定是否已完成？' },
  transferful: { label: '可透明驗算', question: '公式是否已公開且通過驗證？' },
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
