import { describe, it, expect } from 'vitest';
import {
  FiveTOmniTagGate,
  OmniTagContractViolation,
  FiveTTrackable,
} from '../five-t-protocol';
import type { OmniTagSet } from '../omnitag-contract';

const compliant: OmniTagSet = {
  agent: 'agent:25',
  squad: '5T驗算',
  lifecycle: 'active',
  priority: 'p2',
  platform: 'esggo',
  bestPractice: '结界',
};

describe('§20.5 FiveTOmniTagGate 接線 (5T 驗算陣列 25-30)', () => {
  it('emitArtifact passes compliant tag and records lifecycle event', () => {
    const r = FiveTOmniTagGate.emitArtifact({
      entityId: 'artifact:001',
      tag: compliant,
    });
    expect(r.contract.valid).toBe(true);
    const life = FiveTTrackable.getLifecycle('artifact:001');
    expect(life.some((e) => e.event === 'omnitag:sealed')).toBe(true);
  });

  it('emitArtifact throws on missing required triad (rule 1)', () => {
    const bad: OmniTagSet = { lifecycle: 'active', priority: 'p2' };
    expect(() =>
      FiveTOmniTagGate.emitArtifact({ entityId: 'x', tag: bad }),
    ).toThrow(OmniTagContractViolation);
  });

  it('mutateArtifact rejects frozen+restricted (rule 2 / H4)', () => {
    const sealed: OmniTagSet = {
      ...compliant,
      lifecycle: 'frozen',
      security: 'restricted',
    };
    expect(() => FiveTOmniTagGate.mutateArtifact('y', sealed)).toThrow(
      OmniTagContractViolation,
    );
  });

  it('mutateArtifact allows mutation on non-sealed tag', () => {
    expect(() =>
      FiveTOmniTagGate.mutateArtifact('z', compliant),
    ).not.toThrow();
  });

  it('violation exposes structured violations list', () => {
    try {
      FiveTOmniTagGate.emitArtifact({
        entityId: 'bad',
        tag: { lifecycle: 'active' } as OmniTagSet,
      });
      expect.unreachable('should have thrown');
    } catch (e) {
      const v = e as OmniTagContractViolation;
      expect(v.check.violations.length).toBeGreaterThan(0);
      expect(v.check.violations.some((x) => x.includes('agent'))).toBe(true);
    }
  });

  it('emitArtifact attaches §20.4 auto-route for each squad', () => {
    const cases: Array<[string, string]> = [
      ['agent:03', 'memory-recall'],
      ['agent:09', 'typescript-contract'],
      ['agent:15', 'auto-deploy'],
      ['agent:21', 'entropy-forge'],
      ['agent:27', 'audit-lock'],
    ];
    for (const [agent, routeKey] of cases) {
      const r = FiveTOmniTagGate.emitArtifact({
        entityId: `art:${agent}`,
        tag: { agent, lifecycle: 'active', priority: 'p2', squad: undefined } as OmniTagSet,
      });
      expect(r.route.target?.routeKey).toBe(routeKey);
      expect(r.route.consistent).toBe(true);
    }
  });

  it('emitArtifact records route-warn when agent/squad mismatch', () => {
    const r = FiveTOmniTagGate.emitArtifact({
      entityId: 'mismatch:01',
      tag: { agent: 'agent:03', squad: '5T驗算', lifecycle: 'active', priority: 'p2' } as OmniTagSet,
    });
    expect(r.route.consistent).toBe(false);
    const life = FiveTTrackable.getLifecycle('mismatch:01');
    expect(life.some((e) => e.event === 'omnitag:route-warn')).toBe(true);
  });

  it('barrier inheritance flag propagates on emit', () => {
    const r = FiveTOmniTagGate.emitArtifact({
      entityId: 'barrier:01',
      tag: { agent: 'agent:25', lifecycle: 'active', priority: 'p2', bestPractice: '结界' } as OmniTagSet,
    });
    expect(r.route.barrierInherited).toBe(true);
  });
});
