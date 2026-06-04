"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const diff_engine_1 = require("./sonar/core/diff-engine");
(0, vitest_1.describe)('DiffEngine', () => {
    (0, vitest_1.describe)('compareLines', () => {
        (0, vitest_1.it)('detects added lines', () => {
            const result = diff_engine_1.DiffEngine.compareLines('foo\nbar', 'foo\nbar\nbaz');
            (0, vitest_1.expect)(result.added).toEqual(['baz']);
            (0, vitest_1.expect)(result.removed).toEqual([]);
            (0, vitest_1.expect)(result.changed).toBe(true);
            (0, vitest_1.expect)(result.count).toBe(1);
        });
        (0, vitest_1.it)('detects removed lines', () => {
            const result = diff_engine_1.DiffEngine.compareLines('foo\nbar\nbaz', 'foo\nbar');
            (0, vitest_1.expect)(result.removed).toEqual(['baz']);
            (0, vitest_1.expect)(result.added).toEqual([]);
            (0, vitest_1.expect)(result.changed).toBe(true);
        });
        (0, vitest_1.it)('returns no changes for identical text', () => {
            const result = diff_engine_1.DiffEngine.compareLines('hello\nworld', 'hello\nworld');
            (0, vitest_1.expect)(result.changed).toBe(false);
            (0, vitest_1.expect)(result.count).toBe(0);
            (0, vitest_1.expect)(result.added).toEqual([]);
            (0, vitest_1.expect)(result.removed).toEqual([]);
        });
        (0, vitest_1.it)('handles empty strings', () => {
            const result = diff_engine_1.DiffEngine.compareLines('', '');
            (0, vitest_1.expect)(result.changed).toBe(false);
            (0, vitest_1.expect)(result.count).toBe(0);
        });
        (0, vitest_1.it)('detects both added and removed lines', () => {
            const result = diff_engine_1.DiffEngine.compareLines('a\nb\nc', 'a\nd\nc');
            (0, vitest_1.expect)(result.added).toEqual(['d']);
            (0, vitest_1.expect)(result.removed).toEqual(['b']);
            (0, vitest_1.expect)(result.count).toBe(2);
        });
    });
    (0, vitest_1.describe)('compareJSON', () => {
        (0, vitest_1.it)('returns false for identical objects', () => {
            (0, vitest_1.expect)(diff_engine_1.DiffEngine.compareJSON({ a: 1 }, { a: 1 })).toBe(false);
        });
        (0, vitest_1.it)('returns true for different objects', () => {
            (0, vitest_1.expect)(diff_engine_1.DiffEngine.compareJSON({ a: 1 }, { a: 2 })).toBe(true);
        });
        (0, vitest_1.it)('handles nested objects', () => {
            (0, vitest_1.expect)(diff_engine_1.DiffEngine.compareJSON({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
            (0, vitest_1.expect)(diff_engine_1.DiffEngine.compareJSON({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
        });
    });
    (0, vitest_1.describe)('detectESGTags', () => {
        (0, vitest_1.it)('detects E tags from Chinese keywords', () => {
            const tags = diff_engine_1.DiffEngine.detectESGTags(['碳排放量增加']);
            (0, vitest_1.expect)(tags).toContain('E');
        });
        (0, vitest_1.it)('detects S tags from English keywords', () => {
            const tags = diff_engine_1.DiffEngine.detectESGTags(['improve safety standards']);
            (0, vitest_1.expect)(tags).toContain('S');
        });
        (0, vitest_1.it)('detects G tags', () => {
            const tags = diff_engine_1.DiffEngine.detectESGTags(['board governance risk']);
            (0, vitest_1.expect)(tags).toContain('G');
        });
        (0, vitest_1.it)('detects multiple categories', () => {
            const tags = diff_engine_1.DiffEngine.detectESGTags(['carbon emissions', 'human rights', 'board compliance']);
            (0, vitest_1.expect)(tags).toContain('E');
            (0, vitest_1.expect)(tags).toContain('S');
            (0, vitest_1.expect)(tags).toContain('G');
        });
        (0, vitest_1.it)('returns empty array for unrelated content', () => {
            const tags = diff_engine_1.DiffEngine.detectESGTags(['the weather is nice today']);
            (0, vitest_1.expect)(tags).toEqual([]);
        });
    });
});
//# sourceMappingURL=diff-engine.test.js.map