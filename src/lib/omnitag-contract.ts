/**
 * src/lib/omnitag-contract.ts — §20 OmniTag 萬能標籤契約自動校驗
 *
 * 承接 soul.md §20.2 六大維度與 §20.5 驗證規則。
 * 本模組為純函式、零外部依賴，供 5T 驗算陣列 (25-30) 在產物誕生時
 * 自動稽核「必備三枚」與凍結不可改等契約，對齊 §20.5 規則 1-5。
 *
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */

// ── §20.2 六大維度定義 ──────────────────────────────────
import { type TrustLevel } from './omni-core/types';
export type OmnitagSecurity = 'public' | 'internal' | 'confidential' | 'restricted';
/**
 * §20.8 永恆持久生命週期 — 與 frozen/archived 不同，eternal 是**終態**：
 * 實體一旦刻印為永恆，既不可變更亦不可退役，只可被更上位的刻印取代。
 * frozen 需要 security:restricted 才具強制力；eternal 不看 security，一律不可變。
 */
export type OmnitagLifecycle = 'draft' | 'active' | 'frozen' | 'archived' | 'eternal';
/**
 * §20.8 萬能實體三類別 — 萬能代理 / 萬能分身 / 萬能蜂群。
 * 契約過去只認 agent 一類，導致分身與蜂群無法掛標籤（實測：合約率雖 100%，
 * 但那是因為分身/蜂群根本沒被納入掃描）。
 */
export type OmnitagEntityClass = 'agent' | 'avatar' | 'swarm';
/**
 * §20.8 奧義對位 — 六式智能標籤（wiki/jun-ai-key-architecture.md §六式詳解）。
 */
export type OmnitagArcana =
  | '熵減煉金'   // 壹式 本質提純
  | '全知之眼'   // 貳式 聖典共鳴
  | '光之羽翼'   // 參式 代理織網
  | '神聖契約'   // 肆式 神跡顯現
  | '記憶聖所'   // 伍式 因果刻印
  | '零度凍結';  // 陸式 神聖裁決
export type OmnitagPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type OmnitagPlatform = 'esggo' | 'omni' | 'vps' | 'firebase';

export interface OmniTagSet {
  /** 萬能代理歸屬: agent:01 ~ agent:30 */
  agent?: string;
  /** §20.8 萬能分身歸屬: avatar:<slug>（例 avatar:omni / avatar:qingyu） */
  avatar?: string;
  /** §20.8 萬能蜂群歸屬: swarm:<slug>（例 swarm:oa-team-30） */
  swarm?: string;
  /** §20.8 實體類別；省略時由 resolveIdentity() 從身分別名推導 */
  entityClass?: OmnitagEntityClass;
  /** §20.8 奧義對位：此實體服務於六式中的哪一式（optional） */
  arcana?: OmnitagArcana;
  /** §20.7 信任標別 (optional — 由獨立 validateTrustLevel 校驗) */
  trustLevel?: TrustLevel;
  /** 陣列歸屬: 智庫聖所 / 符文契約 / 光之羽翼 / 煉金熵減 / 5T驗算 */
  squad?: string;
  /** 安全分級 */
  security?: OmnitagSecurity;
  /** 生命週期 */
  lifecycle?: OmnitagLifecycle;
  /** 品質分級 */
  priority?: OmnitagPriority;
  /** 平台環境 */
  platform?: OmnitagPlatform;
  /** 結界繼承 */
  bestPractice?: 'awakened' | '结界';
}

export interface ContractCheck {
  valid: boolean;
  violations: string[];
}

const AGENT_ID_RE = /^agent:(0?[1-9]|[12][0-9]|30)$/;
/** §20.8 萬能分身別名（slug 允許小寫字母/數字/._-） */
const AVATAR_ID_RE = /^avatar:[a-z0-9][a-z0-9._-]*$/i;
/** §20.8 萬能蜂群別名 */
const SWARM_ID_RE = /^swarm:[a-z0-9][a-z0-9._-]*$/i;

export interface OmniIdentity {
  kind: OmnitagEntityClass;
  id: string;
}

/**
 * §20.8 三類實體身分校驗 — 萬能代理 / 萬能分身 / 萬能蜂群 **三擇一且僅一枚**。
 * 契約過去硬性要求 agent:01~30，導致分身與蜂群無法合約；
 * 本函式保留「完全無身分 → 違規」（舊測試 omnitag-contract.test.ts:83 依賴此行為），
 * 同時新增「多於一枚 → 歧義違規」與「格式錯誤 → 明確報錯」。
 */
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
      violations.push(`Malformed [${kind}:*] id \"${value}\" — ${humanRule}`);
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

/** §20.8 便利取用：僅回傳合法身分（無則 null） */
export function resolveIdentity(tag: OmniTagSet): OmniIdentity | null {
  return validateIdentity(tag).identity;
}

/**
 * §20.5 規則 1 — 必備三枚自動校驗
 * 每筆產物至少 agent:* + lifecycle:* + p* 三枚，缺一即不合約。
 * (§20.7 註：trustLevel 為 optional，由獨立 validateTrustLevel 校驗)
 */
export function validateRequiredTriad(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];

  // §20.8：身分改為三類實體三擇一（萬能代理 / 萬能分身 / 萬能蜂群）
  violations.push(...validateIdentity(tag).violations);
  // trustLevel is OPTIONAL (§20.7) — validated separately by validateTrustLevel()
  if (!tag.lifecycle) {
    violations.push('Missing required [lifecycle:*] (draft/active/frozen/archived)');
  }
  if (!tag.priority) {
    violations.push('Missing required [p*] (p0/p1/p2/p3)');
  }

  return { valid: violations.length === 0, violations };
}

/**
 * §20.5 規則 6 — 信任標別驗證
 * 檢查 trustLevel 是否為合法 TrustLevel 值。
 */
export function validateTrustLevel(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  if (!tag.trustLevel) {
    violations.push('Missing required [trustLevel:*] (low/medium/high/critical/authenticated)');
  } else if (!['low', 'medium', 'high', 'critical', 'authenticated'].includes(tag.trustLevel)) {
    violations.push(`Invalid trustLevel "${tag.trustLevel}" — must be one of low/medium/high/critical/authenticated`);
  }
  return { valid: violations.length === 0, violations };
}

/** §20.8 六式奧義合法值（wiki/jun-ai-key-architecture.md §六式詳解） */
export const OMNITAG_ARCANA: readonly OmnitagArcana[] = [
  '熵減煉金',
  '全知之眼',
  '光之羽翼',
  '神聖契約',
  '記憶聖所',
  '零度凍結',
] as const;

/**
 * §20.8 奧義標別驗證 — optional；一旦宣告即必須是六式之一。
 */
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

/**
 * §20.8 永恆封印判定。
 * 與 frozen 的關鍵差異：frozen 需搭配 security:restricted 才具強制力；
 * eternal 一律不可變 —— 永恆刻印是「不可篡改」的最終態（對齊 §5 Trustworthy）。
 */
export function isEternalSealed(tag: OmniTagSet | Record<string, unknown>): boolean {
  return (tag as Record<string, unknown>).lifecycle === 'eternal';
}

/**
 * §20.8 永恆持久契約 — 宣告 eternal 者必須具備可解析身分。
 * 沒有身分的「永恆」是幽靈紀錄，契約不接受。
 */
export function validateEternality(tag: OmniTagSet): ContractCheck {
  const violations: string[] = [];
  if (tag.lifecycle === 'eternal' && validateIdentity(tag).identity === null) {
    violations.push(
      '[lifecycle:eternal] requires a resolvable identity ([agent:*] | [avatar:*] | [swarm:*])',
    );
  }
  return { valid: violations.length === 0, violations };
}

/**
 * §20.5 規則 2 — 凍結不可改
 * 雙介面：
 *   - 舊契約 enforceFrozenLock(tag, attemptedMutation: boolean): ContractCheck
 *   - 新契約 enforceFrozenLock(tag, nextPatch: object): { blocked, violations }
 * lifecycle:frozen + restricted 即為 H4 不可變；只有 attemptedMutation=true 時才算違反。
 */
export function enforceFrozenLock(
  tag: OmniTagSet | Record<string, unknown>,
  second: boolean | Record<string, unknown>,
): ContractCheck | { blocked: boolean; violations: string[] } {
  const violations: string[] = [];
  const isSealed =
    isEternalSealed(tag) ||
    ((tag as Record<string, unknown>).lifecycle === 'frozen' &&
      (tag as Record<string, unknown>).security === 'restricted');
  if (typeof second === 'boolean') {
    // 舊契約
    if (isSealed && second) {
      violations.push('H4 frozen: lifecycle:frozen + restricted artifact is immutable');
    }
    return { valid: violations.length === 0, violations };
  }
  // 新契約（§20.7 測試）：tag 自身 frozen 即視為不可變
  const tagIsFrozen =
    (tag as Record<string, unknown>).lifecycle === 'frozen' || isEternalSealed(tag);
  if (tagIsFrozen) {
    violations.push('H4 frozen: lifecycle:frozen artifact is immutable — cannot modify');
  }
  return { blocked: tagIsFrozen, violations };
}

/**
 * §20.5 規則 3 — 結界自動繼承
 * 標記 best-practice:结界 後，全部子代理自動 inheriting。
 * 回傳該標籤組是否處於結界繼承態。
 */
export function isBarrierInherited(tag: OmniTagSet): boolean {
  return tag.bestPractice === '结界';
}

/**
 * §20.5 規則 4 — 熵減連動
 * p0 任務完成後，熵值必須下降。此處做靜態契約檢查：
 * 若 priority=p0 且聲稱已完成 (completed=true)，必須附 entropyAfter < entropyBefore。
 */
export function validateEntropyReduction(
  tag: OmniTagSet,
  opts: { completed: boolean; entropyBefore: number; entropyAfter: number },
): ContractCheck {
  const violations: string[] = [];
  if (tag.priority === 'p0' && opts.completed) {
    if (!(opts.entropyAfter < opts.entropyBefore)) {
      violations.push('p0 completed but entropy did not decrease (< 0.1 target)');
    }
  }
  return { valid: violations.length === 0, violations };
}

/**
 * §20.5 規則 5 — 稽核抽驗聚合
 * 對一組標籤做合約率稽核，目標 100%。
 */
export function auditContractRate(tags: OmniTagSet[]): {
  total: number;
  compliant: number;
  rate: number;
} {
  const compliant = tags.filter(
    (t) => validateRequiredTriad(t).valid && validateTrustLevel(t).valid,
  ).length;
  const total = tags.length;
  const rate = total === 0 ? 1 : compliant / total;
  return { total, compliant, rate };
}

/**
 * 全量契約校驗（§20.5 規則 1-5 彙整）。
 * 供 5T 驗算陣列在產物誕生/變更時呼叫。
 */
export function verifyOmniTagContract(
  tag: OmniTagSet,
  ctx?: {
    attemptedMutation?: boolean;
    completed?: boolean;
    entropyBefore?: number;
    entropyAfter?: number;
  },
): ContractCheck {
  const allViolations: string[] = [];

  allViolations.push(...validateRequiredTriad(tag).violations);
  allViolations.push(...validateTrustLevel(tag).violations);
  // §20.8 永恆持久與奧義對位
  allViolations.push(...validateEternality(tag).violations);
  allViolations.push(...validateArcana(tag).violations);
  if (ctx?.attemptedMutation) {
    allViolations.push(...enforceFrozenLock(tag, true).violations);
  }
  if (ctx?.completed && ctx.entropyBefore != null && ctx.entropyAfter != null) {
    allViolations.push(
      ...validateEntropyReduction(tag, {
        completed: ctx.completed,
        entropyBefore: ctx.entropyBefore,
        entropyAfter: ctx.entropyAfter,
      }).violations,
    );
  }

  return { valid: allViolations.length === 0, violations: allViolations };
}

// ── §20.4 自動路由（Auto-Routing） ──────────────────────────
// 將 agent 編號 + squad 對齊五大陣列，路由至對應治理動作。
// 對齊 §20.4 路由表與 §6.2 預設即合規。

export type SquadName =
  | '智庫聖所'
  | '符文契約'
  | '光之羽翼'
  | '煉金熵減'
  | '5T驗算';

export interface RouteTarget {
  squad: SquadName;
  /** 治理動作描述 */
  action: string;
  /** 路由鍵（用於 Trackable 維度追蹤） */
  routeKey: string;
}

/** agent:01~30 → 所屬陣列 */
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

/**
 * §20.4 自動路由解析。
 * 優先以 agent 編號決定陣列；若 agent 缺漏則退用 squad 字面值。
 * best-practice:结界 標記時，繼承旗標全體擴散。
 */
export function routeOmniTag(tag: OmniTagSet): {
  target: RouteTarget | null;
  barrierInherited: boolean;
  /** 路由是否與標籤自述 squad 一致 */
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
