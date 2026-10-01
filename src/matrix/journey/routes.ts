/**
 * journey 產品功能矩陣 · 產物歸屬地圖（Page / API / Table → Stream）canonical
 *
 * MECE 基準：依「產物形態」歸屬（同一份資料只屬一域），不依頁面位置或功能名稱。
 * 每個產物有且只有一個歸屬（互斥），全部產物皆有歸屬（窮盡）。
 *
 * source_origin: 2026-10-01 實掃
 *   - 前端路由：apps/ftg-journey-web/src/App.jsx 的 <Route path=...>（11 條，含 *）
 *   - 後端 API：apps/ftg-journey-server/server.js 的 app.(get|post|put|delete)('...')（42 條）
 *   - 資料表：server.js 的 CREATE TABLE（19 張，含 contacts）
 * co_authors: [萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]
 */

import type { JourneyDomainId } from './types';

export type ProductKind = 'page' | 'api' | 'table';

export interface ProductAssignment {
  /** 產品路徑（page: '/journey/:id'；api: 'GET /api/journeys/:id'；table: 'impact'） */
  product: string;
  kind: ProductKind;
  domain: JourneyDomainId;
  /** 來源檔案（repo-relative） */
  file: string;
  /** 已登記缺口 */
  note?: string;
}

/** 前端頁面層：11 條路由（App.jsx 實掃） */
export const JOURNEY_PAGES: ProductAssignment[] = [
  { product: '/login', kind: 'page', domain: 'J0', file: 'apps/ftg-journey-web/src/pages/LoginPage.jsx' },
  { product: '*', kind: 'page', domain: 'J0', file: 'apps/ftg-journey-web/src/App.jsx', note: 'catch-all 重導至 /（未知路徑靜默導回首頁）→ 缺口 JG1' },

  { product: '/', kind: 'page', domain: 'J1', file: 'apps/ftg-journey-web/src/pages/Dashboard.jsx' },
  { product: '/journey/:id', kind: 'page', domain: 'J1', file: 'apps/ftg-journey-web/src/pages/JourneyDetail.jsx' },

  { product: '/journey/:id/impact-note', kind: 'page', domain: 'J6', file: 'apps/ftg-journey-web/src/pages/ImpactNotePage.jsx' },

  { product: '/journey/:id/executive', kind: 'page', domain: 'J3', file: 'apps/ftg-journey-web/src/features/Executive.jsx' },
  { product: '/journey/:id/wellbeing', kind: 'page', domain: 'J4', file: 'apps/ftg-journey-web/src/features/Wellbeing.jsx' },
  { product: '/journey/:id/family-day', kind: 'page', domain: 'J5', file: 'apps/ftg-journey-web/src/features/FamilyDay.jsx' },

  { product: '/philosophy', kind: 'page', domain: 'J0', file: 'apps/ftg-journey-web/src/features/Philosophy.jsx', note: '六流說明頁，屬產品方法論導覽而非單一流產物 → 歸平台層' },
  { product: '/family-day (無 id)', kind: 'page', domain: 'J5', file: 'apps/ftg-journey-web/src/App.jsx', note: '此路由不傳 journeyId，FamilyDay 因此無資料 → 缺口 JG2' },
  { product: '/wellbeing (無 id)', kind: 'page', domain: 'J4', file: 'apps/ftg-journey-web/src/App.jsx', note: '此路由不傳 journeyId，Wellbeing 因此無資料 → 缺口 JG2' },
];

/** API 層：42 條端點（server.js 實掃） */
export const JOURNEY_APIS: ProductAssignment[] = [
  // ── J0 平台層：認證 / 上傳 / 健康 / 聯絡表單（6 條）──
  { product: 'GET /health', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/auth/google', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/me', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/refresh', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/upload', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js', note: '檔案上傳為通用基礎設施；實際消費端在 J5（家庭照片）→ 缺口 JG3 候選' },

  // ── J1 基礎流：旅程 CRUD / 成員 / 準備 / 行程 / 筆記 / 簽到（15 條）──
  { product: 'GET /api/journeys', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'PUT /api/journeys/:id', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'DELETE /api/journeys/:id', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/members', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js', note: 'P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5' },
  { product: 'POST /api/journeys/:id/members', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js', note: 'P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5' },
  { product: 'PUT /api/journeys/:id/members/:email', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js', note: 'P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5' },
  { product: 'DELETE /api/journeys/:id/members/:email', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js', note: 'P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5' },
  { product: 'GET /api/journeys/:id/prep', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/prep', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/schedule', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/schedule', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/notes', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js', note: 'notes 同時被 Impact Note 消費（跨域讀取），歸屬以「寫入來源」為準' },
  { product: 'POST /api/journeys/:id/notes', kind: 'api', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },

  // ── J2 覺曉流：ESG 任務 / 簽到 / 勳章（6 條）──
  { product: 'POST /api/journeys/:id/checkin', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/checkins', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/esg-tasks', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/esg-tasks', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/badges', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js', note: 'P5 實測：前端只呼叫 /api/me/badges，本端點（全部勳章目錄）無人消費 → 缺口 JG6' },
  { product: 'GET /api/me/badges', kind: 'api', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },

  // ── J3 凝聚流：主管共識營（2 條）──
  { product: 'GET /api/journeys/:id/executive/:toolType', kind: 'api', domain: 'J3', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/executive/:toolType', kind: 'api', domain: 'J3', file: 'apps/ftg-journey-server/server.js' },

  // ── J4 復元流：診斷 / 後續追蹤（4 條）──
  { product: 'GET /api/journeys/:id/wellbeing/diagnosis', kind: 'api', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/wellbeing/diagnosis', kind: 'api', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/wellbeing/followup', kind: 'api', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/wellbeing/followup', kind: 'api', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },

  // ── J5 共好流：家庭任務 / 觀察 / 照片（6 條）──
  { product: 'GET /api/journeys/:id/family-tasks', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/family-tasks', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/family-observations', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/family-observations', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/photos', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/photos', kind: 'api', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },

  // ── J6 留念流：影響數據 / 摘要（3 條）──
  { product: 'GET /api/journeys/:id/impact', kind: 'api', domain: 'J6', file: 'apps/ftg-journey-server/server.js' },
  { product: 'POST /api/journeys/:id/impact', kind: 'api', domain: 'J6', file: 'apps/ftg-journey-server/server.js' },
  { product: 'GET /api/journeys/:id/summary', kind: 'api', domain: 'J6', file: 'apps/ftg-journey-server/server.js' },

  // ── 未歸類（實測發現）──
  { product: 'POST /api/contact', kind: 'api', domain: 'J0', file: 'apps/ftg-journey-server/server.js', note: '官網聯絡表單（無前端呼叫者）→ 缺口 JG4' },
];

/** 資料表層：18 張表（server.js CREATE TABLE 實掃；contacts 由 /api/contact 端點延遲建立） */
export const JOURNEY_TABLES: ProductAssignment[] = [
  { product: 'users', kind: 'table', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },
  { product: 'contacts', kind: 'table', domain: 'J0', file: 'apps/ftg-journey-server/server.js' },

  { product: 'journeys', kind: 'table', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'journeys_members', kind: 'table', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'prep_items', kind: 'table', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'schedule', kind: 'table', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },
  { product: 'notes', kind: 'table', domain: 'J1', file: 'apps/ftg-journey-server/server.js' },

  { product: 'esg_task_logs', kind: 'table', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'checkins', kind: 'table', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'badges', kind: 'table', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },
  { product: 'user_badges', kind: 'table', domain: 'J2', file: 'apps/ftg-journey-server/server.js' },

  { product: 'executive_tools', kind: 'table', domain: 'J3', file: 'apps/ftg-journey-server/server.js' },

  { product: 'wellbeing_diagnosis', kind: 'table', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },
  { product: 'follow_up_entries', kind: 'table', domain: 'J4', file: 'apps/ftg-journey-server/server.js' },

  { product: 'family_tasks', kind: 'table', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'family_observations', kind: 'table', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },
  { product: 'photos', kind: 'table', domain: 'J5', file: 'apps/ftg-journey-server/server.js' },

  { product: 'impact', kind: 'table', domain: 'J6', file: 'apps/ftg-journey-server/server.js' },
];

export const ALL_JOURNEY_ASSIGNMENTS: ProductAssignment[] = [
  ...JOURNEY_PAGES,
  ...JOURNEY_APIS,
  ...JOURNEY_TABLES,
];
