/**
 * cli/oa-cli/src/omnitag.ts — §20 OmniTag 契約閘（oa-cli 自包含版）
 *
 * 對齊 src/lib/omnitag-contract.ts 與 src/lib/five-t-protocol.ts 的算法同構，
 * 但零外部依賴（僅 Node crypto），供 oa tag 子命令在 CLI 環境直接過閘。
 *
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */

import { createHash } from 'crypto';
import { mkdirSync, readFileSync, existsSync, appendFileSync } from 'fs';
import { dirname } from 'path';

// ── §20.2 六大維度 ──────────────────────────────────────────
export type OmnitagSecurity = 'public' | 'internal' | 'confidential' | 'restricted';
// §20.8 新增 eternal — 與 frozen/archived 不同，eternal 是終態且不看 security，一律不可變。
export type OmnitagLifecycle = 'draft' | 'active' | 'frozen' | 'archived' | 'eternal';
// §20.8 萬能實體三類別：萬能代理 / 萬能分身 / 萬能蜂群
export type OmnitagEntityClass = 'agent' | 'avatar' | 'swarm';
// §20.8 奧義對位 — 六式智能標籤（與 src/lib/omnitag-contract.ts 同構）
export type OmnitagArcana =
  | '熵減煉金'
  | '全知之眼'
  | '光之羽翼'
  | '神聖契約'
  | '記憶聖所'
  | '零度凍結';
export type OmnitagPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type OmnitagPlatform = 'esggo' | 'omni' | 'vps' | 'firebase';

export interface OmniTagSet {
  /** 萬能代理: agent:01~agent:30 */
  agent?: string;
  /** §20.8 萬能分身: avatar:<slug> */
  avatar?: string;
  /** §20.8 萬能蜂群: swarm:<slug> */
  swarm?: string;
  /** §20.8 實體類別；省略時由 resolveIdentity() 推導 */
  entityClass?: OmnitagEntityClass;
  /** §20.8 奧義對位（optional） */
  arcana?: OmnitagArcana;
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
// ── §20.8 三類實體身分別名 ──────────────────────────────────
const AVATAR_ID_RE = /^avatar:[a-z0-9][a-z0-9._-]*$/i;
const SWARM_ID_RE = /^swarm:[a-z0-9][a-z0-9._-]*$/i;

export const OMNITAG_ARCANA: readonly OmnitagArcana[] = [
  '熵減煉金',
  '全知之眼',
  '光之羽翼',
  '神聖契約',
  '記憶聖所',
  '零度凍結',
] as const;

export interface OmniIdentity {
  kind: OmnitagEntityClass;
  id: string;
}

/** §20.8 萬能代理/分身/蜂群 三擇一且僅一枚；格式錯誤與歧義皆回報具體原因 */
export function validateIdentity(tag: OmniTagSet): {
  identity: OmniIdentity | null;
  violations: string[];
} {
  const violations: string[] = [];
  const candidates: OmniIdentity[] = [];
  const check = (
    value: string | undefined,
    kind: OmnitagEntityClass,
    re: RegExp,
    humanRule: string,
  ) => {
    if (value === undefined) return;
    if (!re.test(value)) {
      violations.push(`Malformed [${kind}:*] id "${value}" — ${humanRule}`);
      return;
    }
    candidates.push({ kind, id: value });
  };
  check(tag.agent, 'agent', AGENT_ID_RE, 'must be agent:01~agent:30');
  check(tag.avatar, 'avatar', AVATAR_ID_RE, 'must be avatar:<slug>');
  check(tag.swarm, 'swarm', SWARM_ID_RE, 'must be swarm:<slug>');

  if (candidates.length === 0 && violations.length === 0) {
    violations.push(
      'Missing required identity: exactly one of [agent:*] (agent:01~agent:30), [avatar:*], [swarm:*]',
    );
    return { identity: null, violations };
  }
  if (candidates.length > 1) {
    violations.push(
      `Ambiguous identity: ${candidates.length} declared (${candidates
        .map((c) => `[${c.kind}:*]`)
        .join(', ')}) — exactly one is required`,
    );
    return { identity: null, violations };
  }
  return { identity: candidates[0] ?? null, violations };
}

export function resolveIdentity(tag: OmniTagSet): OmniIdentity | null {
  return validateIdentity(tag).identity;
}

/** §20.8 永恆封印判定 — eternal 一律不可變，不看 security */
export function isEternalSealed(tag: OmniTagSet | Record<string, unknown>): boolean {
  return (tag as Record<string, unknown>).lifecycle === 'eternal';
}

/** §20.8 永恆必須有可解析身分，拒絕幽靈紀錄 */
export function validateEternality(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  if (tag.lifecycle === 'eternal' && validateIdentity(tag).identity === null) {
    violations.push(
      '[lifecycle:eternal] requires a resolvable identity ([agent:*] | [avatar:*] | [swarm:*])',
    );
  }
  return { valid: violations.length === 0, violations };
}

/** §20.8 奧義標別驗證 — optional；宣告即須為六式之一 */
export function validateArcana(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  if (tag.arcana === undefined) return { valid: true, violations };
  if (!OMNITAG_ARCANA.includes(tag.arcana)) {
    violations.push(
      `Invalid [arcana:*] "${tag.arcana}" — must be one of ${OMNITAG_ARCANA.join(' / ')}`,
    );
  }
  return { valid: violations.length === 0, violations };
}

export function validateRequiredTriad(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  // §20.8：身分改為三類實體三擇一（萬能代理 / 萬能分身 / 萬能蜂群）
  violations.push(...validateIdentity(tag).violations);
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
  const isSealed =
    isEternalSealed(tag) || (tag.lifecycle === 'frozen' && tag.security === 'restricted');
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
    // §20.8 永恆持久 + 奧義對位
    all.push(...validateEternality(params.tag).violations);
    all.push(...validateArcana(params.tag).violations);
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
  const identity = resolveIdentity(params.tag);
  const hashLock = generateHashLock(
    `${identity?.kind ?? 'unknown'}:${identity?.id ?? 'unknown'}`,
    params.content ?? JSON.stringify(params.tag),
    sealedAt,
  );

  return { entityId: params.entityId, contract: check, route, hashLock, sealedAt };
}

// ── §20.6 OmniTag 契約持久化層（寫入即凍結）─────────────────
// 對齊 soul.md §5 Trustworthy：數據寫入後即刻 Hash Lock + 不可篡改。
// append-only JSONL 儲存，零外部依賴（僅 fs + crypto）。
// 凍結不可改（§20.5 規則 2 / H4）：lifecycle:frozen + restricted 實體拒絕覆寫。

export interface PersistedArtifact {
  entityId: string;
  /** §20.8 實體類別（萬能代理 / 萬能分身 / 萬能蜂群），落盤時固化 */
  entityClass: OmnitagEntityClass;
  tag: OmniTagSet;
  content?: string;
  hashLock: string;
  sealedAt: number;
  sourceOrigin: string;
}

export interface RegistryOptions {
  /** 持久化路徑；預設專案本地 .oa/omnitag-registry.jsonl */
  path?: string;
  /** 測試用：inMemory 模式不碰檔案系統 */
  inMemory?: boolean;
}

export class OmniTagRegistry {
  private _path: string;
  private _inMemory: boolean;
  private _mem: string[] = [];

  constructor(opts: RegistryOptions = {}) {
    this._inMemory = opts.inMemory ?? false;
    if (!this._inMemory) {
      const base = opts.path ?? '.oa/omnitag-registry.jsonl';
      this._path = base;
      // 確保目錄存在
      mkdirSync(dirname(this._path), { recursive: true });
    } else {
      this._path = ':memory:';
    }
  }

  /** 已存在的實體 IDs（用於凍結不可改檢查） */
  private _readLines(): string[] {
    if (this._inMemory) return this._mem;
    if (!existsSync(this._path)) return [];
    return readFileSync(this._path, 'utf8')
      .split('\n')
      .filter((l: string) => l.trim().length > 0);
  }

  private _appendLine(line: string): void {
    if (this._inMemory) {
      this._mem.push(line);
      return;
    }
    appendFileSync(this._path, line + '\n', 'utf8');
  }

  /**
   * 寫入即凍結：通過 emitArtifact 後將產物持久化。
   * @throws OmniTagContractViolation 契約不合規
   * @throws Error 實體已刻印（eternal 或 frozen+restricted）不可改
   */
  persistArtifact(params: {
    entityId: string;
    tag: OmniTagSet;
    content?: string;
  }): PersistedArtifact {
    // 1. 過閘
    const sealed = emitArtifact(params);

    // 2. 凍結不可改：若已存在已刻印實體（eternal 或 frozen+restricted），拒絕
    const existing = this.getArtifact(params.entityId);
    if (existing) {
      const reason = isEternalSealed(existing.tag)
        ? `eternal/${existing.tag.arcana ?? 'arcana'}`
        : existing.tag.lifecycle === 'frozen' && existing.tag.security === 'restricted'
          ? 'frozen+restricted'
          : null;
      if (reason) {
        throw new Error(
          `H4 frozen: entity ${params.entityId} is sealed (${reason}) — immutable`,
        );
      }
    }

    // 3. 寫入即凍結
    const record: PersistedArtifact = {
      entityId: sealed.entityId,
      entityClass: resolveIdentity(params.tag)?.kind ?? 'agent',
      tag: params.tag,
      content: params.content,
      hashLock: sealed.hashLock,
      sealedAt: sealed.sealedAt,
      sourceOrigin: resolveIdentity(params.tag)?.id ?? 'unknown',
    };
    this._appendLine(JSON.stringify(record));
    return record;
  }

  /** 讀取單一實體（若有） */
  getArtifact(entityId: string): PersistedArtifact | null {
    for (const line of this._readLines()) {
      try {
        const rec = JSON.parse(line) as PersistedArtifact;
        if (rec.entityId === entityId) return rec;
      } catch {
        // 跳過毀損行
      }
    }
    return null;
  }

  /** 列舉所有實體 */
  listArtifacts(): PersistedArtifact[] {
    const out: PersistedArtifact[] = [];
    for (const line of this._readLines()) {
      try {
        out.push(JSON.parse(line) as PersistedArtifact);
      } catch {
        // 跳過毀損行
      }
    }
    return out;
  }

  /**
   * 篡改驗證：重算 hashLock 比對，確認寫入後未被改動。
   * 對齊 §5 Trustworthy + §18 同構 Hash Lock。
   */
  verifyArtifact(entityId: string): { exists: boolean; tampered: boolean; record?: PersistedArtifact } {
    const rec = this.getArtifact(entityId);
    if (!rec) return { exists: false, tampered: false };

    // 向後相容：§20.8 之前的紀錄沒有 entityClass 欄位，Hash Lock 公式為舊版。
    // 對這類紀錄以舊公式重算，避免把「舊格式」誤判成「遭竄改」。
    const legacy = (rec as { entityClass?: OmnitagEntityClass }).entityClass === undefined;
    const expected = legacy
      ? generateHashLock(
          rec.tag.agent ?? 'unknown',
          rec.content ?? JSON.stringify(rec.tag),
          rec.sealedAt,
        )
      : generateHashLock(
          `${rec.entityClass}:${rec.tag.agent ?? rec.tag.avatar ?? rec.tag.swarm ?? 'unknown'}`,
          rec.content ?? JSON.stringify(rec.tag),
          rec.sealedAt,
        );
    const tampered = expected !== rec.hashLock;
    return { exists: true, tampered, record: rec };
  }
}
