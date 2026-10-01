/**
 * journey 產品功能終始矩陣 · 共用型別
 *
 * 與 src/matrix/d1.report.matrix.ts 的 DomainCell 同構（pillar/endState/startChain/probe），
 * 但獨立宣告：域層矩陣描述 ESGGO 主站，journey 矩陣描述產品 journey.ftgesggo.esggo.co，
 * 兩者 pillar 命名一致以便橫向對照，實際歸屬互不相干。
 *
 * source_origin: src/matrix/d1.report.matrix.ts
 */

/** 六柱定義（所有流共用，確保橫向可比） */
export const JOURNEY_PILLARS = [
  'memory',    // 記憶：不滅的結構
  'time',      // 時間：每日閉環
  'space',     // 空間：本機 / VPS 雙端
  'causality', // 因果：探針 → 證據
  'immortal',  // 不朽：定稿凍結
  'circular',  // 圓通：回饋上溯
] as const;
export type JourneyPillar = (typeof JOURNEY_PILLARS)[number];

export interface JourneyCell {
  pillar: JourneyPillar;
  /** 終：此格在終局世界的狀態（可驗證的斷言） */
  endState: string;
  /** 始：從今天到終局的最小可行起始動作 */
  startChain: string;
  /** 探針：可自動執行的驗證斷言（檔案存在性 / 契約測試） */
  probe: string;
}

/** 六流 + 平台層：產品功能域 */
export type JourneyDomainId = 'J0' | 'J1' | 'J2' | 'J3' | 'J4' | 'J5' | 'J6';

export interface JourneyDomain {
  id: JourneyDomainId;
  /** 對應 Philosophy.jsx STREAMS 的 id；J0 為平台層無對應 */
  streamId: string;
  name: string;
  nameEn: string;
  /** 產物形態（MECE 互斥性基準） */
  artifactForm: string;
  frozen: boolean;
  /** frozen=false 時必須給出理由（不得留空） */
  frozenReason: string;
  /** 該域 canonical 檔案路徑 */
  canonical: string;
  /** 官網文案對照（apps/ftg-tours-website） */
  sitePromise: string;
  cells: JourneyCell[];
}
