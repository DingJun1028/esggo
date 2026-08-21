/**
 * cli/oa-cli/src/omnitag.ts — §20 OmniTag 契約閘（oa-cli 自包含版）
 *
 * 對齊 src/lib/omnitag-contract.ts 與 src/lib/five-t-protocol.ts 的算法同構，
 * 但零外部依賴（僅 Node crypto），供 oa tag 子命令在 CLI 環境直接過閘。
 *
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */

import { createHash } from 'crypto';

// ── §20.2 六大維度 ──────────────────────────────────────────
export type OmnitagSecurity = 'public' | 'internal' | 'confidential' | 'restricted';
export type OmnitagLifecycle = 'draft' | 'active' | 'frozen' | 'archived';
export type OmnitagPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type OmnitagPlatform = 'esggo' | 'omni' | 'vps' | 'firebase';

export interface OmniTagSet {
  agent?: string;
  squad?: string;
  security?: OmnitagSecurity;
  lifecycle?: OmnitagLifecycle;
  priority?: OmnitagPriority;
  platform?: OmnitagPlatform;
  bestPractice?: 'awakened' | '结界';
}

export interface ContractCheck {
  valid: boolean;
  violations: string[];
}

// ── §20.5 規則 1：必備三枚 ──────────────────────────────────
const AGENT_ID_RE = /^agent:(0?[1-9]|[12][0-9]|30)$/;

export function validateRequiredTriad(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  if (!tag.agent || !AGENT_ID_RE.test(tag.agent)) {
    violations.push('Missing required [agent:*] (agent:01~agent:30)');
  }
  if (!tag.lifecycle) {
    violations.push('Missing required [lifecycle:*] (draft/active/frozen/archived)');
  }
  if (!tag.priority) {
    violations.push('Missing required [p*] (p0/p1/p2/p3)');
  }
  return { valid: violations.length === 0, violations };
}

// ── §20.5 規則 2：凍結不可改 ───────────────────────────────
export function enforceFrozenLock(tag: OmniTagSet, attemptedMutation: boolean): ContractCheck {
  const violations: string[] = [];
  const isSealed = tag.lifecycle === 'frozen' && tag.security === 'restricted';
  if (isSealed && attemptedMutation) {
    violations.push('H4 frozen: lifecycle:frozen + restricted artifact is immutable');
  }
  return { valid: violations.length === 0, violations };
}

// ── §20.5 規則 3：結界自動繼承 ─────────────────────────────
export function isBarrierInherited(tag: OmniTagSet): boolean {
  return tag.bestPractice === '结界';
}

// ── §20.4 自動路由 ─────────────────────────────────────────
export type SquadName = '智庫聖所' | '符文契約' | '光之羽翼' | '煉金熵減' | '5T驗算';

export interface RouteTarget {
  squad: SquadName;
  action: string;
  routeKey: string;
}

export function squadOfAgent(agent: string): SquadName | null {
  const m = agent.match(/^agent:0*(\d{1,2})$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n < 1 || n > 30) return null;
  if (n <= 6) return '智庫聖所';
  if (n <= 12) return '符文契約';
  if (n <= 18) return '光之羽翼';
  if (n <= 24) return '煉金熵減';
  return '5T驗算';
}

const ROUTE_TABLE: Record<SquadName, RouteTarget> = {
  智庫聖所: { squad: '智庫聖所', action: '永憶聖所 / 記憶召回', routeKey: 'memory-recall' },
  符文契約: { squad: '符文契約', action: 'API / TypeScript / 型別安全', routeKey: 'typescript-contract' },
  光之羽翼: { squad: '光之羽翼', action: '部署 / cron / 自動化代行', routeKey: 'auto-deploy' },
  煉金熵減: { squad: '煉金熵減', action: '重構 / lint / 熵減煉金', routeKey: 'entropy-forge' },
  '5T驗算': { squad: '5T驗算', action: 'ISO / Hash Lock / 稽核', routeKey: 'audit-lock' },
};

export function routeOmniTag(tag: OmniTagSet): {
  target: RouteTarget | null;
  barrierInherited: boolean;
  consistent: boolean;
} {
  const barrierInherited = isBarrierInherited(tag);
  const byAgent = tag.agent ? squadOfAgent(tag.agent) : null;
  const bySquad = (tag.squad as SquadName) ?? null;
  const resolved = byAgent ?? bySquad;
  const target = resolved ? ROUTE_TABLE[resolved] : null;
  const consistent = byAgent == null || bySquad == null || byAgent === bySquad;
  return { target, barrierInherited, consistent };
}

// ── §18 Hash Lock（對齊 FiveTHashLock.generate 同構）─────────
export function generateHashLock(source: string, content: string, timestamp: number): string {
  const payload = `${source}|${content}|${timestamp}`;
  return createHash('sha256').update(payload).digest('hex');
}

// ── 全量契約校驗 + 過閘 ─────────────────────────────────────
export class OmniTagContractViolation extends Error {
  constructor(public readonly check: ContractCheck) {
    super(`§20.5 OmniTag 契約違規: ${check.violations.join('; ')}`);
    this.name = 'OmniTagContractViolation';
  }
}

export interface SealResult {
  entityId: string;
  contract: ContractCheck;
  route: ReturnType<typeof routeOmniTag>;
  hashLock: string;
  sealedAt: number;
}

export function emitArtifact(params: {
  entityId: string;
  tag: OmniTagSet;
  content?: string;
  attemptedMutation?: boolean;
}): SealResult {
  const check = (() => {
    const all: string[] = [];
    all.push(...validateRequiredTriad(params.tag).violations);
    if (params.attemptedMutation) {
      all.push(...enforceFrozenLock(params.tag, true).violations);
    }
    return { valid: all.length === 0, violations: all };
  })();

  if (!check.valid) {
    throw new OmniTagContractViolation(check);
  }

  const route = routeOmniTag(params.tag);
  const sealedAt = Date.now();
  const hashLock = generateHashLock(
    params.tag.agent ?? 'unknown',
    params.content ?? JSON.stringify(params.tag),
    sealedAt,
  );

  return { entityId: params.entityId, contract: check, route, hashLock, sealedAt };
}
