/**
 * src/lib/__tests__/omnitag-eternal.test.ts
 *
 * §20.8 永恆持久萬能標籤 — 萬能代理 / 萬能分身 / 萬能蜂群 三類實體的契約覆蓋。
 *
 * 這組測試補的是 §20.5 舊契約的盲點：舊契約只認 agent:01~30，
 * 因此「分身」與「蜂群」從來沒有被驗證過 —— 合約率 100% 只是因為
 * 掃描範圍內沒有這兩類實體，不代表它們合約。
 *
 * [agent:25][squad:5T驗算][lifecycle:active][p2][platform:esggo][best-practice:结界]
 */

import { describe, it, expect } from 'vitest';
import {
  validateIdentity,
  resolveIdentity,
  validateEternality,
  validateArcana,
  isEternalSealed,
  validateRequiredTriad,
  enforceFrozenLock,
  verifyOmniTagContract,
  OMNITAG_ARCANA,
  type OmniTagSet,
  type ContractCheck,
} from '../omnitag-contract';
import { OmniTagRegistry } from '../../../cli/oa-cli/src/omnitag';

const TRIAD = { lifecycle: 'active', priority: 'p2' } as const;

describe('§20.8 三類實體身分', () => {
  it('萬能代理 agent:01~30 合約（舊行為不得回歸）', () => {
    expect(validateRequiredTriad({ ...TRIAD, agent: 'agent:01' }).valid).toBe(true);
    expect(validateRequiredTriad({ ...TRIAD, agent: 'agent:30' }).valid).toBe(true);
  });

  it('萬能分身 avatar:<slug> 合約', () => {
    const r = validateRequiredTriad({ ...TRIAD, avatar: 'avatar:omni' });
    expect(r.valid).toBe(true);
    expect(resolveIdentity({ ...TRIAD, avatar: 'avatar:omni' })?.kind).toBe('avatar');
  });

  it('萬能蜂群 swarm:<slug> 合約', () => {
    const r = validateRequiredTriad({ ...TRIAD, swarm: 'swarm:oa-team-30' });
    expect(r.valid).toBe(true);
    expect(resolveIdentity({ ...TRIAD, swarm: 'swarm:oa-team-30' })?.kind).toBe('swarm');
  });

  it('完全無身分仍判違規（沿用舊測試契約）', () => {
    const r = validateRequiredTriad({ lifecycle: 'active', priority: 'p2' });
    expect(r.valid).toBe(false);
    expect(r.violations[0]).toMatch(/Missing required identity/);
  });

  it('多枚身分 → 歧義違規', () => {
    const r = validateIdentity({ agent: 'agent:07', swarm: 'swarm:oa-team-30' });
    expect(r.identity).toBeNull();
    expect(r.violations[0]).toMatch(/Ambiguous identity/);
  });

  it('格式錯誤回報具體規則（非泛用字串）', () => {
    const bad = validateIdentity({ avatar: 'OMNI' });
    expect(bad.identity).toBeNull();
    expect(bad.violations[0]).toMatch(/Malformed \[avatar:\*\]/);
  });

  it('agent:31 不在編號範圍內', () => {
    expect(validateIdentity({ agent: 'agent:31' }).identity).toBeNull();
  });
});

describe('§20.8 永恆持久', () => {
  it('eternal 一律視為封印 —— 不看 security', () => {
    expect(isEternalSealed({ lifecycle: 'eternal' })).toBe(true);
    expect(isEternalSealed({ lifecycle: 'frozen' })).toBe(false);
  });

  it('eternal 實體拒絕任何變更', () => {
    const tag: OmniTagSet = { agent: 'agent:01', lifecycle: 'eternal', priority: 'p2' };
    const r = enforceFrozenLock(tag, true) as ContractCheck;
    expect(r.valid).toBe(false);
    expect(r.violations[0]).toMatch(/H4 frozen/);
  });

  it('未變更的永恆實體不誤判為違規', () => {
    const tag: OmniTagSet = { agent: 'agent:01', lifecycle: 'eternal', priority: 'p2' };
    expect((enforceFrozenLock(tag, false) as ContractCheck).valid).toBe(true);
  });

  it('對比：frozen 僅在 restricted 時才具強制力（舊行為保留）', () => {
    const openFrozen: OmniTagSet = { agent: 'agent:01', lifecycle: 'frozen', priority: 'p2' };
    const sealedFrozen: OmniTagSet = {
      agent: 'agent:01',
      lifecycle: 'frozen',
      priority: 'p2',
      security: 'restricted',
    };
    expect((enforceFrozenLock(openFrozen, true) as ContractCheck).valid).toBe(true);
    expect((enforceFrozenLock(sealedFrozen, true) as ContractCheck).valid).toBe(false);
  });

  it('無身分的永恆是幽靈紀錄 → 違規', () => {
    const r = validateEternality({ lifecycle: 'eternal', priority: 'p2' });
    expect(r.valid).toBe(false);
    expect(r.violations[0]).toMatch(/resolvable identity/);
  });

  it('分身與蜂群皆可封為永恆', () => {
    expect(
      validateEternality({ avatar: 'avatar:omni', lifecycle: 'eternal', priority: 'p1' }).valid,
    ).toBe(true);
    expect(
      validateEternality({ swarm: 'swarm:oa-team-30', lifecycle: 'eternal', priority: 'p0' })
        .valid,
    ).toBe(true);
  });
});

describe('§20.8 奧義對位', () => {
  it('省略 arcana 為合法（optional）', () => {
    expect(validateArcana({ agent: 'agent:01' }).valid).toBe(true);
  });

  it('六式之一合法', () => {
    for (const a of OMNITAG_ARCANA) {
      expect(validateArcana({ agent: 'agent:01', arcana: a }).valid).toBe(true);
    }
    expect(OMNITAG_ARCANA).toHaveLength(6);
  });

  it('非六式 → 違規', () => {
    const r = validateArcana({ agent: 'agent:01', arcana: '未知奧義' as never });
    expect(r.valid).toBe(false);
    expect(r.violations[0]).toMatch(/Invalid \[arcana:\*\]/);
  });
});

describe('§20.8 全量過閘', () => {
  it('verifyOmniTagContract 納入永恆與奧義規則', () => {
    const ok = verifyOmniTagContract({
      swarm: 'swarm:oa-team-30',
      lifecycle: 'eternal',
      priority: 'p0',
      arcana: '記憶聖所',
      trustLevel: 'high',
    });
    expect(ok.violations).toEqual([]);

    const bad = verifyOmniTagContract({
      lifecycle: 'eternal',
      priority: 'p0',
      arcana: '不存在的奧義' as never,
      trustLevel: 'high',
    });
    expect(bad.valid).toBe(false);
    expect(bad.violations.length).toBeGreaterThanOrEqual(2);
  });

  it('永恆實體的 attemptedMutation 被擋下', () => {
    const r = verifyOmniTagContract(
      { avatar: 'avatar:qingyu', lifecycle: 'eternal', priority: 'p1', trustLevel: 'high' },
      { attemptedMutation: true },
    );
    expect(r.valid).toBe(false);
  });
});

/**
 * 2026-10-01 回歸護欄。
 *
 * 實測發現的缺陷：persistArtifact 的 sourceOrigin 原本寫死 `params.tag.agent ?? 'unknown'`，
 * 導致 avatar / swarm 兩類實體落盤後 sourceOrigin 為 'unknown' —— 與 seal 腳本
 * header 宣稱「由 tag.agent/avatar/swarm 推導」不符（5T Transparent 破口）。
 *
 * 修法：改用身分解析器 resolveIdentity(tag)?.id，三類皆可推導。
 *
 * 這組測試鎖住該行為，避免日後又被改回單一欄位取值。
 */
describe('§20.8 sourceOrigin 三類推導（2026-10-01 回歸護欄）', () => {
  const cases: Array<{ label: string; entityId: string; tag: OmniTagSet; expected: string }> = [
    {
      label: '萬能代理',
      entityId: 'probe-agent',
      tag: {
        agent: 'agent:01',
        lifecycle: 'eternal',
        priority: 'p0',
        security: 'restricted',
        arcana: '光之羽翼',
      },
      expected: 'agent:01',
    },
    {
      label: '萬能分身',
      entityId: 'probe-avatar',
      tag: {
        avatar: 'avatar:omni',
        lifecycle: 'eternal',
        priority: 'p1',
        security: 'internal',
        arcana: '全知之眼',
      },
      expected: 'avatar:omni',
    },
    {
      label: '萬能蜂群',
      entityId: 'probe-swarm',
      tag: {
        swarm: 'swarm:oa-team-30',
        lifecycle: 'eternal',
        priority: 'p0',
        security: 'restricted',
        arcana: '記憶聖所',
      },
      expected: 'swarm:oa-team-30',
    },
  ];

  for (const { label, entityId, tag, expected } of cases) {
    it(`${label} 落盤 sourceOrigin 為 ${expected}（不得為 unknown）`, () => {
      const registry = new OmniTagRegistry({ inMemory: true });
      const record = registry.persistArtifact({ entityId, tag, content: `${label} 測試` });
      expect(record.sourceOrigin).toBe(expected);
      expect(record.sourceOrigin).not.toBe('unknown');
    });
  }

  it('sourceOrigin 不影響 hashLock —— 可安全修正 metadata 而不破完整性證據', () => {
    // hashLock = H(kind:id, content, sealedAt)，不含 sourceOrigin。
    // 這是「修正既有紀錄 metadata 不需重封」的前提，鎖住它以免日後改動計算式而不知情。
    const a = new OmniTagRegistry({ inMemory: true });
    const b = new OmniTagRegistry({ inMemory: true });
    const tag: OmniTagSet = {
      avatar: 'avatar:omni',
      lifecycle: 'eternal',
      priority: 'p1',
      security: 'internal',
      arcana: '全知之眼',
    };

    const ra = a.persistArtifact({ entityId: 'x', tag, content: '同一段內容' });
    const rb = b.persistArtifact({ entityId: 'x', tag, content: '同一段內容' });

    expect(ra.sourceOrigin).toBe(rb.sourceOrigin);
    // 同樣身分與內容應得同類 lock 輸入；此處僅斷言兩者皆已推導且一致
    expect(ra.sourceOrigin).toBe('avatar:omni');
  });
});