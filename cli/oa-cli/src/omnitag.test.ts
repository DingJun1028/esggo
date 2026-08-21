import { describe, it, expect } from 'vitest';
import {
  validateRequiredTriad,
  enforceFrozenLock,
  isBarrierInherited,
  squadOfAgent,
  routeOmniTag,
  generateHashLock,
  emitArtifact,
  OmniTagContractViolation,
} from './omnitag';

describe('§20.4/§20.5 OmniTag 契約閘 (oa-cli 自包含版)', () => {
  it('validateRequiredTriad passes compliant tag', () => {
    const r = validateRequiredTriad({ agent: 'agent:25', lifecycle: 'active', priority: 'p2' });
    expect(r.valid).toBe(true);
  });

  it('validateRequiredTriad fails on missing triad', () => {
    const r = validateRequiredTriad({ lifecycle: 'active' });
    expect(r.valid).toBe(false);
    expect(r.violations.some((v) => v.includes('agent'))).toBe(true);
  });

  it('enforceFrozenLock rejects frozen+restricted mutation', () => {
    const tag = { agent: 'agent:25', lifecycle: 'frozen', security: 'restricted', priority: 'p2' };
    expect(enforceFrozenLock(tag, true).valid).toBe(false);
    expect(enforceFrozenLock(tag, false).valid).toBe(true);
  });

  it('squadOfAgent maps 01-30 to five arrays', () => {
    expect(squadOfAgent('agent:03')).toBe('智庫聖所');
    expect(squadOfAgent('agent:09')).toBe('符文契約');
    expect(squadOfAgent('agent:15')).toBe('光之羽翼');
    expect(squadOfAgent('agent:21')).toBe('煉金熵減');
    expect(squadOfAgent('agent:27')).toBe('5T驗算');
  });

  it('routeOmniTag returns route + barrier flag', () => {
    const r = routeOmniTag({ agent: 'agent:25', squad: '5T驗算', bestPractice: '结界' });
    expect(r.target?.routeKey).toBe('audit-lock');
    expect(r.barrierInherited).toBe(true);
    expect(r.consistent).toBe(true);
  });

  it('generateHashLock is deterministic + matches TS FiveTHashLock algorithm', async () => {
    // 與 src/lib/five-t-protocol.ts FiveTHashLock.generate 同構: sha256(source|content|ts)
    const h1 = generateHashLock('agent:25', 'hello', 1760000000000);
    const h2 = generateHashLock('agent:25', 'hello', 1760000000000);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
    // 手算驗證同構
    const { createHash } = await import('crypto');
    const expected = createHash('sha256').update('agent:25|hello|1760000000000').digest('hex');
    expect(h1).toBe(expected);
  });

  it('emitArtifact seals compliant tag with hash', () => {
    const r = emitArtifact({
      entityId: 'x1',
      tag: { agent: 'agent:25', lifecycle: 'active', priority: 'p2', squad: '5T驗算' },
      content: '{"op":"seal"}',
    });
    expect(r.contract.valid).toBe(true);
    expect(r.hashLock).toMatch(/^[0-9a-f]{64}$/);
    expect(r.route.target?.routeKey).toBe('audit-lock');
  });

  it('emitArtifact throws on missing triad (rule 1)', () => {
    expect(() =>
      emitArtifact({ entityId: 'x2', tag: { lifecycle: 'active' } }),
    ).toThrow(OmniTagContractViolation);
  });
});
