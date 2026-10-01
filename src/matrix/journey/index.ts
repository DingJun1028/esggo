/**
 * journey 產品功能終始矩陣 · 註冊表
 *
 * 產品：journey.ftgesggo.esggo.co（FTG 永續旅程 App）
 * 架構：7 域 × 6 柱 = 42 格。每格須同時具備 endState / startChain / probe，
 * 缺一即為敘事值，不算通過（scripts/verify-journey-matrix.mjs 守門）。
 *
 * 與 src/matrix/（ESGGO 主站域層矩陣）的關係：pillar 命名一致以便橫向對照，
 * 但歸屬對象不同 —— 主站矩陣管 30 頁 + 107 API，本矩陣管 journey App 的
 * 11 頁 + 42 API + 19 表。兩者各自獨立守門，互不影響。
 *
 * source_origin: apps/ftg-journey-server/server.js + apps/ftg-journey-web/src 實掃（2026-10-01）
 * co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30), 萬能文案蜂(15)]
 */

import J0_PLATFORM from './j0.platform.matrix';
import J1_FOUNDATION from './j1.foundation.matrix';
import J2_AWARENESS from './j2.awareness.matrix';
import J3_COHESION from './j3.cohesion.matrix';
import J4_RESTORATION from './j4.restoration.matrix';
import J5_MUTUALITY from './j5.mutuality.matrix';
import J6_MEMORIAL from './j6.memorial.matrix';
import { JOURNEY_PILLARS, type JourneyPillar, type JourneyCell, type JourneyDomain } from './types';

export { JOURNEY_PILLARS };
export type { JourneyPillar, JourneyCell, JourneyDomain, JourneyDomainId } from './types';

export const JOURNEY_DOMAINS: JourneyDomain[] = [
  {
    id: 'J0',
    streamId: 'platform',
    name: '平台層',
    nameEn: 'Platform',
    artifactForm: '身分驗證與基礎設施',
    frozen: false,
    frozenReason: '平台層非永續產物；設定與憑證由環境變數承載，本就不應凍結於規格書。',
    canonical: 'src/matrix/journey/j0.platform.matrix.ts',
    sitePromise: '（無官網對應 — 網站不會描述登入機制）',
    cells: J0_PLATFORM,
  },
  {
    id: 'J1',
    streamId: 'foundation',
    name: '基礎流',
    nameEn: 'Foundation',
    artifactForm: '行程主體資料',
    frozen: false,
    frozenReason: '旅程為進行中資料，prep/schedule/checkin 會持續更新；僅在 stage=completed 後才進入凍結流程（見 J1/immortal 格）。',
    canonical: 'src/matrix/journey/j1.foundation.matrix.ts',
    sitePromise: '將傳統員工旅遊升級為結合自然健走、地方文化、永續學習與團隊互動',
    cells: J1_FOUNDATION,
  },
  {
    id: 'J2',
    streamId: 'awareness',
    name: '覺曉流',
    nameEn: 'Awareness',
    artifactForm: '現場任務紀錄',
    frozen: false,
    frozenReason: '任務為 append-only 原始紀錄（未完成者可補登）；凍結對原始紀錄無意義，凍結的是其匯總後的對外報告（見 J6）。',
    canonical: 'src/matrix/journey/j2.awareness.matrix.ts',
    sitePromise: '讓 ESG 不只是報告文字，而是員工可以親身參與的一日戶外永續團隊行動',
    cells: J2_AWARENESS,
  },
  {
    id: 'J3',
    streamId: 'cohesion',
    name: '凝聚流',
    nameEn: 'Cohesion',
    artifactForm: '主管共識紀錄',
    frozen: false,
    frozenReason: '共識紀錄於工作坊中逐條修訂；僅定稿的 Roadmap 才凍結（見 J3/immortal 格）。',
    canonical: 'src/matrix/journey/j3.cohesion.matrix.ts',
    sitePromise: '在自然場域中重新對齊使命、文化與永續轉型方向',
    cells: J3_COHESION,
  },
  {
    id: 'J4',
    streamId: 'restoration',
    name: '復元流',
    nameEn: 'Restoration',
    artifactForm: '身心狀態量測與追蹤',
    frozen: false,
    frozenReason: '診斷與追蹤為週期性量測（Journey 前/中/後），資料隨時間累積；不需凍結，但需授權保護（見 J4/immortal 格）。',
    canonical: 'src/matrix/journey/j4.restoration.matrix.ts',
    sitePromise: '協助員工從高壓工作中恢復能量，團隊在自然場域重新連結',
    cells: J4_RESTORATION,
  },
  {
    id: 'J5',
    streamId: 'mutuality',
    name: '共好流',
    nameEn: 'Mutuality',
    artifactForm: '家庭共學紀錄',
    frozen: false,
    frozenReason: '家庭紀錄隨旅程進行追加（含兒童影像屬敏感資料）；凍結需求以「下架需留紀錄」達成，非整體凍結。',
    canonical: 'src/matrix/journey/j5.mutuality.matrix.ts',
    sitePromise: '以自然教育、親子共學、無痕戶外與地方體驗，打造員工與家庭共同參與',
    cells: J5_MUTUALITY,
  },
  {
    id: 'J6',
    streamId: 'memorial',
    name: '留念流',
    nameEn: 'Memorial',
    artifactForm: '對外影響報告',
    frozen: true,
    frozenReason: '',
    canonical: 'src/matrix/journey/j6.memorial.matrix.ts',
    sitePromise: '把活動成果整理成 HR、ESG、品牌部皆可用的成果素材',
    cells: J6_MEMORIAL,
  },
];

/** 42 格扁平視圖，供守門與報告使用 */
export const JOURNEY_MATRIX: {
  domain: string; domainName: string; pillar: JourneyPillar; cell: JourneyCell;
}[] = JOURNEY_DOMAINS.flatMap((d) =>
  d.cells.map((c) => ({ domain: d.id, domainName: d.name, pillar: c.pillar, cell: c })),
);

export default JOURNEY_DOMAINS;
