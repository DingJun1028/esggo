/**
 * D1 永續報告 · 域層終始矩陣 canonical
 * 產物形態：對外正式文件 → 需 Hash Lock 定稿（不可變事實）
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md（30 頁 + 107 API 實測歸屬）
 * 陣列歸屬以 soul.md 第四章 4.0 表為唯一真義
 */

/** 六柱定義（所有域共用，確保橫向可比） */
export const PILLARS = [
  'memory',    // 記憶：不滅的結構
  'time',      // 時間：每日閉環
  'space',     // 空間：本地 / 雲端雙端
  'causality', // 因果：探針 → 證據
  'immortal',  // 不朽：定稿凍結
  'circular',  // 圓通：回饋上溯
] as const;
export type Pillar = (typeof PILLARS)[number];

export interface DomainCell {
  pillar: Pillar;
  /** 終：此格在終局世界的狀態（可驗證的斷言） */
  endState: string;
  /** 始：從今天到終局的最小可行起始動作 */
  startChain: string;
  /** 探針：可自動執行的驗證命令或檔案檢查 */
  probe: string;
}

export const D1_REPORT: DomainCell[] = [
  {
    pillar: 'memory',
    endState: '所有對外報告以 report-assembly-v5 單一路徑產出，結構由 canon.d.ts 鎖定，無平行版型。',
    startChain: '盤點並凍結 /api/esg/* 與 /api/sustain-center/* 兩套前綴，指定 esg/* 為唯一報告入口。',
    probe: 'src/core/services/report-assembly-v5.ts 存在且被 /api/esg/report 引用',
  },
  {
    pillar: 'time',
    endState: '報告產出到定稿的每一階段有時間戳與狀態機（pending→draft→frozen），可回溯任一份報告的演化史。',
    startChain: '為 /api/sustain-write/v5/progress/[taskId] 的狀態機補上 frozen 終態與時間戳欄位。',
    probe: '/api/sustain-write/v5/progress/[taskId]/route.ts 含 frozen 狀態分支',
  },
  {
    pillar: 'space',
    endState: '本機實習生可產草稿，雲端助理可核定發布；兩端共用同一份 canonical，差異僅在權限。',
    startChain: '將 shared/types.ts 的報告型別匯出至 types/generated/，使本機與雲端消費同一份。',
    probe: 'node scripts/export-shared-types.js 後 types/generated/esggo-shared.d.ts 存在',
  },
  {
    pillar: 'causality',
    endState: '每個報告數字可回溯至證據檔（evidence/parse、pdf/parse），無孤證數字。',
    startChain: '報告 schema 加入 evidence[] 必填欄位，缺證據即拒收。',
    probe: 'grep -c "evidence" src/core/services/report-assembly-v5.ts > 0',
  },
  {
    pillar: 'immortal',
    endState: '定稿報告寫入即凍結：Hash Lock + Object.freeze，竄改即現形。',
    startChain: '報告發布路徑串接 /api/hashlock 與 /api/zkp，取得可攜式竄改證據。',
    probe: '/api/hashlock/route.ts 與 /api/zkp/route.ts 皆存在且 POST 皆回傳 hash',
  },
  {
    pillar: 'circular',
    endState: '發布後的外部回饋（surveys、village vote）回流成為下一版報告的素材，形成閉環。',
    startChain: '將 /api/surveys 回應欄位納入報告素材來源清單。',
    probe: 'grep -rn "surveys" src/core/services/report-assembly-v5.ts 有引用',
  },
];

export default D1_REPORT;
