"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const diff_engine_1 = require("./diff-engine");
(0, vitest_1.describe)('StateDiffEngine - 狀態對比引擎', () => {
    const baseCard = {
        uuid: '11111111-2222-4333-8444-555555555555',
        name: 'Base Task',
        status: 'doing',
        attributes: ['A', 'B'],
        abilities: ['X', 'Y'],
        lastUpdated: 1000,
    };
    (0, vitest_1.test)('完全一致', () => {
        const snapshot = { ...baseCard };
        const result = diff_engine_1.StateDiffEngine.compare(baseCard, snapshot);
        (0, vitest_1.expect)(result.isAligned).toBe(true);
        (0, vitest_1.expect)(result.severity).toBe('NONE');
        (0, vitest_1.expect)(Object.keys(result.differences).length).toBe(0);
    });
    (0, vitest_1.test)('狀態 (Status) 差異 - CRITICAL', () => {
        const snapshot = { ...baseCard, status: 'done' };
        const result = diff_engine_1.StateDiffEngine.compare(baseCard, snapshot);
        (0, vitest_1.expect)(result.isAligned).toBe(false);
        (0, vitest_1.expect)(result.severity).toBe('CRITICAL');
        (0, vitest_1.expect)(result.differences.status.snapshot).toBe('done');
    });
    (0, vitest_1.test)('屬性 (Attributes/Abilities) 差異 - HIGH', () => {
        const snapshot = { ...baseCard, attributes: ['A'] };
        const result = diff_engine_1.StateDiffEngine.compare(baseCard, snapshot);
        (0, vitest_1.expect)(result.isAligned).toBe(false);
        (0, vitest_1.expect)(result.severity).toBe('HIGH');
        (0, vitest_1.expect)(result.differences.attributes.snapshot).toEqual(['A']);
    });
    (0, vitest_1.test)('名稱 (Name) 差異 - LOW', () => {
        const snapshot = { ...baseCard, name: 'Changed Task' };
        const result = diff_engine_1.StateDiffEngine.compare(baseCard, snapshot);
        (0, vitest_1.expect)(result.isAligned).toBe(false);
        (0, vitest_1.expect)(result.severity).toBe('LOW');
        (0, vitest_1.expect)(result.differences.name.snapshot).toBe('Changed Task');
    });
    (0, vitest_1.test)('多重差異 - 採用最高嚴重級別', () => {
        const snapshot = { ...baseCard, status: 'todo', name: 'Old Task' };
        const result = diff_engine_1.StateDiffEngine.compare(baseCard, snapshot);
        (0, vitest_1.expect)(result.isAligned).toBe(false);
        (0, vitest_1.expect)(result.severity).toBe('CRITICAL');
        (0, vitest_1.expect)(result.differences.status).toBeDefined();
        (0, vitest_1.expect)(result.differences.name).toBeDefined();
    });
});
//# sourceMappingURL=diff-engine.test.js.map