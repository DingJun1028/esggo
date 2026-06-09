import { expect, test, describe } from 'vitest';
import { Principle, getPrincipleDescription, clampFactor, validateCorePresence } from './CorePrinciples';

describe('CorePrinciples (OmniCore 創世綱領驗證)', () => {
  test('應該能正確取得原則列舉與描述', () => {
    expect(Principle.Truth).toBe('Truth');
    expect(getPrincipleDescription(Principle.Truth)).toContain('確保每筆資料不可篡改');
    expect(getPrincipleDescription(Principle.Trust)).toContain('週期性自動修復');
  });

  test('clampFactor 應能限制或校正比例因子於 0 到 1 之間', () => {
    expect(clampFactor(0.5)).toBe(0.5);
    expect(clampFactor(1.5)).toBeNull();
    expect(clampFactor(-0.1)).toBeNull();
  });

  test('validateCorePresence 應能驗證核心必備屬性', () => {
    const validCore = { uuid: 'test-123', hash_lock: 'LOCK-test' };
    expect(validateCorePresence(validCore)).toBe(true);
    expect(validateCorePresence({})).toBe(false);
  });
});