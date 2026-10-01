/**
 * 域歸屬地圖（Route → Domain）· canonical
 * 30 頁 + 107 API 逐一歸屬；每個路由有且只有一個域（互斥），全部路由皆有域（窮盡）。
 * source_origin: 2026-10-01 find app src/app -name page.tsx / route.ts 實測
 */

import type { DomainId } from './index';

/** 路由可歸屬的域：5 大永續域 + 平台層 P0（導覽/登入/代理基礎設施，非永續產物） */
export type RouteDomain = DomainId | 'P0';

export interface RouteAssignment {
  route: string;      // e.g. '/api/esg/report' or '/wiki'
  kind: 'page' | 'api';
  domain: RouteDomain;
  file: string;       // repo-relative
  note?: string;
}

/** 頁面層（實測 30 頁：app 25 + src/app 5） */
export const PAGES: RouteAssignment[] = [
  // ── D1 永續報告 ──
  { route: '/omni/reports', kind: 'page', domain: 'D1', file: 'app/omni/reports/page.tsx' },
  { route: '/omni/reports/[reportId]/edit', kind: 'page', domain: 'D1', file: 'app/omni/reports/[reportId]/edit/page.tsx' },
  { route: '/sustain-write/v5', kind: 'page', domain: 'D1', file: 'app/sustain-write/v5/page.tsx', note: '與 c-version 同域雙版本 → 缺口 D7' },
  { route: '/sustain-write/c-version', kind: 'page', domain: 'D1', file: 'app/sustain-write/c-version/page.tsx', note: '與 v5 並存待收斂 → 缺口 D7' },

  // ── D2 商情中心 ──
  { route: '/sonnar', kind: 'page', domain: 'D2', file: 'app/sonnar/page.tsx' },

  // ── D3 ESG 戰情室 ──
  { route: '/omni-center', kind: 'page', domain: 'D3', file: 'app/omni-center/page.tsx', note: '與 /sustain-center 職責重疊 → 缺口 D3' },
  { route: '/sustain-center', kind: 'page', domain: 'D3', file: 'app/sustain-center/page.tsx' },

  // ── D4 永續閱覽室 ──
  { route: '/wiki', kind: 'page', domain: 'D4', file: 'app/wiki/page.tsx' },
  { route: '/wiki/[slug]', kind: 'page', domain: 'D4', file: 'app/wiki/[slug]/page.tsx' },
  { route: '/resources', kind: 'page', domain: 'D4', file: 'app/resources/page.tsx', note: '待轉為 /wiki 分類視圖 → 缺口 D4' },
  { route: '/learning-center', kind: 'page', domain: 'D4', file: 'app/learning-center/page.tsx', note: '待轉為 /wiki 分類視圖 → 缺口 D4' },

  // ── D5 每日 ESGGO ──
  { route: '/daily', kind: 'page', domain: 'D5', file: 'app/daily/page.tsx' },
  { route: '/village', kind: 'page', domain: 'D5', file: 'app/village/page.tsx', note: '歸屬決策：village = 每日社群觀察 → D5' },

  // ── 平台層（6 域之外；導覽與基礎設施）──
  { route: '/', kind: 'page', domain: 'P0', file: 'app/page.tsx' } as RouteAssignment,
  { route: '/admin', kind: 'page', domain: 'P0', file: 'app/admin/page.tsx' } as RouteAssignment,
  { route: '/login', kind: 'page', domain: 'P0', file: 'app/login/page.tsx' } as RouteAssignment,
  { route: '/profile', kind: 'page', domain: 'P0', file: 'app/profile/page.tsx' } as RouteAssignment,
  { route: '/export', kind: 'page', domain: 'P0', file: 'app/export/page.tsx' } as RouteAssignment,
  { route: '/emm', kind: 'page', domain: 'P0', file: 'app/emm/page.tsx' } as RouteAssignment,
  { route: '/omni-base', kind: 'page', domain: 'P0', file: 'app/omni-base/page.tsx' } as RouteAssignment,
  { route: '/omni-agent', kind: 'page', domain: 'P0', file: 'app/omni-agent/page.tsx' } as RouteAssignment,
  { route: '/omni-agent/console', kind: 'page', domain: 'P0', file: 'app/omni-agent/console/page.tsx' } as RouteAssignment,
  { route: '/omni-factory', kind: 'page', domain: 'P0', file: 'app/omni-factory/page.tsx' } as RouteAssignment,
  { route: '/omni-factory', kind: 'page', domain: 'P0', file: 'src/app/omni-factory/page.tsx', note: '被 app/ 遮蔽之死碼 → 缺口 D8' } as RouteAssignment,
  { route: '/omni-factory/[slug]', kind: 'page', domain: 'P0', file: 'app/omni-factory/[slug]/page.tsx' } as RouteAssignment,
  { route: '/omni-todo', kind: 'page', domain: 'P0', file: 'app/omni-todo/page.tsx' } as RouteAssignment,
  { route: '/design-system', kind: 'page', domain: 'P0', file: 'src/app/design-system/page.tsx' } as RouteAssignment,
  { route: '/demo/delegation', kind: 'page', domain: 'P0', file: 'src/app/demo/delegation/page.tsx' } as RouteAssignment,
  { route: '/demo/esg-analysis', kind: 'page', domain: 'P0', file: 'src/app/demo/esg-analysis/page.tsx' } as RouteAssignment,
  { route: '/delegation/events', kind: 'page', domain: 'P0', file: 'src/app/delegation/events/page.tsx' } as RouteAssignment,
];

/** API 層：依前綴分組歸屬（完整 107 路由見 docs/ESGGO-ROUTE-INVENTORY.md） */
export const API_PREFIX_RULES: { pattern: RegExp; domain: RouteDomain; note: string }[] = [
  // D1 永續報告
  { pattern: /^\/api\/esg\//, domain: 'D1', note: '報告組裝/評估/驗證' },
  { pattern: /^\/api\/esg-report$/, domain: 'D1', note: '報告生成 REST（src/app）' },
  { pattern: /^\/api\/sustain-write\//, domain: 'D1', note: '報告寫作 v5/c-version' },
  { pattern: /^\/api\/(evidence|evidence-upload|pdf\/parse)/, domain: 'D1', note: '證據解析' },
  { pattern: /^\/api\/(data\/export|library\/download)/, domain: 'D1', note: '報告輸出' },
  // D2 商情中心
  // 注意：目錄名是 sonnar（雙 n），非 sonar。寫成 sonar 會讓 8 條情報路由全部變孤兒。
  { pattern: /^\/api\/sonnar\//, domain: 'D2', note: '情報雷達/爬取/OCR/永續議題' },
  { pattern: /^\/api\/(esg-sonnar|zenrows\/fetch|reconnaissance\/gateway|local-ai\/chat)/, domain: 'D2', note: '外部情報閘' },
  { pattern: /^\/api\/(ai\/generate|ai\/status|notes)$/, domain: 'D2', note: '情報生成/狀態' },
  // D3 ESG 戰情室
  { pattern: /^\/api\/sustain-center\//, domain: 'D3', note: '戰情儀表' },
  { pattern: /^\/api\/(omni-center\/summary|omni-core\/status|omni-soul|omni-one|omni-todo|omni-user-registry|agnes|async|agentic-twin)/, domain: 'D3', note: '戰情聚合/身代理狀態' },
  { pattern: /^\/api\/(health|healthz|health-metrics|health\/metrics|verify-5t|hashlock|zkp)/, domain: 'D3', note: '5T 守門與健康（唯一一套）' },
  { pattern: /^\/api\/(emm\/metrics|emm\/metrics\/stream)$/, domain: 'D3', note: 'EMM 指標流' },
  { pattern: /^\/api\/awaken\//, domain: 'D3', note: '覺醒脈搏/儀式' },
  // D4 永續閱覽室
  { pattern: /^\/api\/(ai-notes|rag\/ingest|rag\/query|memory|tags\/)/, domain: 'D4', note: '知識/標籤/記憶' },
  { pattern: /^\/api\/(learning-center|admin\/learning-center|resources|admin\/resources|surveys|admin\/surveys|omni\/sync)/, domain: 'D4', note: '知識消費端' },
  // D5 每日 ESGGO
  { pattern: /^\/api\/daily-report/, domain: 'D5', note: '每日觀察' },
  { pattern: /^\/api\/village\//, domain: 'D5', note: '每日社群觀察' },
  { pattern: /^\/api\/user\//, domain: 'D5', note: '使用者每日行為' },
  { pattern: /^\/api\/cron$/, domain: 'D5', note: '每日排程' },
  // 平台層
  { pattern: /^\/api\/(omni\/plugins|omni-factory|omni-agent|omni-agent\/console|nexus|nexus\/agent|agent\/)/, domain: 'P0', note: '代理平台' },
  { pattern: /^\/api\/(delegation|admin\/surveys|admin\/resources|zkp)/, domain: 'P0', note: '委派/管理' },
];

/** 以規則解析單一路由的域；無規則命中 → null（守門須報孤兒） */
export function resolveApiDomain(route: string): { domain: RouteDomain; note: string } | null {
  for (const r of API_PREFIX_RULES) {
    if (r.pattern.test(route)) return { domain: r.domain, note: r.note };
  }
  return null;
}

export const ALL_ASSIGNMENTS: RouteAssignment[] = PAGES;
