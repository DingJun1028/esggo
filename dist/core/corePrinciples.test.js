"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const CorePrinciples_1 = require("./CorePrinciples");
(0, vitest_1.describe)('CorePrinciples (OmniCore 創世綱領驗證)', () => {
    (0, vitest_1.test)('應該能正確取得原則列舉與描述', () => {
        (0, vitest_1.expect)(CorePrinciples_1.Principle.Truth).toBe('Truth');
        (0, vitest_1.expect)((0, CorePrinciples_1.getPrincipleDescription)(CorePrinciples_1.Principle.Truth)).toContain('確保每筆資料不可篡改');
        (0, vitest_1.expect)((0, CorePrinciples_1.getPrincipleDescription)(CorePrinciples_1.Principle.Trust)).toContain('週期性自動修復');
    });
    (0, vitest_1.test)('clampFactor 應能限制或校正比例因子於 0 到 1 之間', () => {
        (0, vitest_1.expect)((0, CorePrinciples_1.clampFactor)(0.5)).toBe(0.5);
        (0, vitest_1.expect)((0, CorePrinciples_1.clampFactor)(1.5)).toBeNull();
        (0, vitest_1.expect)((0, CorePrinciples_1.clampFactor)(-0.1)).toBeNull();
    });
    (0, vitest_1.test)('validateCorePresence 應能驗證核心必備屬性', () => {
        const validCore = { uuid: 'test-123', hash_lock: 'LOCK-test' };
        (0, vitest_1.expect)((0, CorePrinciples_1.validateCorePresence)(validCore)).toBe(true);
        (0, vitest_1.expect)((0, CorePrinciples_1.validateCorePresence)({})).toBe(false);
    });
});
//# sourceMappingURL=corePrinciples.test.js.map