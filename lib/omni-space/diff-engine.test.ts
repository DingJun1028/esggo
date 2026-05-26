import { expect, test, describe } from 'vitest';
import { StateDiffEngine } from './diff-engine';
import { OmniCard } from '../../types/omni-card';

describe('StateDiffEngine - 狀態對比引擎', () => {
  const baseCard: OmniCard = {
    uuid: '11111111-2222-4333-8444-555555555555',
    name: 'Base Task',
    status: 'doing',
    attributes: ['A', 'B'],
    abilities: ['X', 'Y'],
    lastUpdated: 1000,
  };

  test('完全一致', () => {
    const snapshot = { ...baseCard };
    const result = StateDiffEngine.compare(baseCard, snapshot);
    expect(result.isAligned).toBe(true);
    expect(result.severity).toBe('NONE');
    expect(Object.keys(result.differences).length).toBe(0);
  });

  test('狀態 (Status) 差異 - CRITICAL', () => {
    const snapshot = { ...baseCard, status: 'done' as const };
    const result = StateDiffEngine.compare(baseCard, snapshot);
    expect(result.isAligned).toBe(false);
    expect(result.severity).toBe('CRITICAL');
    expect(result.differences.status.snapshot).toBe('done');
  });

  test('屬性 (Attributes/Abilities) 差異 - HIGH', () => {
    const snapshot = { ...baseCard, attributes: ['A'] };
    const result = StateDiffEngine.compare(baseCard, snapshot);
    expect(result.isAligned).toBe(false);
    expect(result.severity).toBe('HIGH');
    expect(result.differences.attributes.snapshot).toEqual(['A']);
  });

  test('名稱 (Name) 差異 - LOW', () => {
    const snapshot = { ...baseCard, name: 'Changed Task' };
    const result = StateDiffEngine.compare(baseCard, snapshot);
    expect(result.isAligned).toBe(false);
    expect(result.severity).toBe('LOW');
    expect(result.differences.name.snapshot).toBe('Changed Task');
  });

  test('多重差異 - 採用最高嚴重級別', () => {
    const snapshot = { ...baseCard, status: 'todo' as const, name: 'Old Task' };
    const result = StateDiffEngine.compare(baseCard, snapshot);
    expect(result.isAligned).toBe(false);
    expect(result.severity).toBe('CRITICAL');
    expect(result.differences.status).toBeDefined();
    expect(result.differences.name).toBeDefined();
  });
});
