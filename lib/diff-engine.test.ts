import { describe, it, expect } from 'vitest';
import { DiffEngine } from './sonar/core/diff-engine';

describe('DiffEngine', () => {
  describe('compareLines', () => {
    it('detects added lines', () => {
      const result = DiffEngine.compareLines('foo\nbar', 'foo\nbar\nbaz');
      expect(result.added).toEqual(['baz']);
      expect(result.removed).toEqual([]);
      expect(result.changed).toBe(true);
      expect(result.count).toBe(1);
    });

    it('detects removed lines', () => {
      const result = DiffEngine.compareLines('foo\nbar\nbaz', 'foo\nbar');
      expect(result.removed).toEqual(['baz']);
      expect(result.added).toEqual([]);
      expect(result.changed).toBe(true);
    });

    it('returns no changes for identical text', () => {
      const result = DiffEngine.compareLines('hello\nworld', 'hello\nworld');
      expect(result.changed).toBe(false);
      expect(result.count).toBe(0);
      expect(result.added).toEqual([]);
      expect(result.removed).toEqual([]);
    });

    it('handles empty strings', () => {
      const result = DiffEngine.compareLines('', '');
      expect(result.changed).toBe(false);
      expect(result.count).toBe(0);
    });

    it('detects both added and removed lines', () => {
      const result = DiffEngine.compareLines('a\nb\nc', 'a\nd\nc');
      expect(result.added).toEqual(['d']);
      expect(result.removed).toEqual(['b']);
      expect(result.count).toBe(2);
    });
  });

  describe('compareJSON', () => {
    it('returns false for identical objects', () => {
      expect(DiffEngine.compareJSON({ a: 1 }, { a: 1 })).toBe(false);
    });

    it('returns true for different objects', () => {
      expect(DiffEngine.compareJSON({ a: 1 }, { a: 2 })).toBe(true);
    });

    it('handles nested objects', () => {
      expect(DiffEngine.compareJSON({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
      expect(DiffEngine.compareJSON({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
    });
  });

  describe('detectESGTags', () => {
    it('detects E tags from Chinese keywords', () => {
      const tags = (DiffEngine as any).detectESGTags(['碳排放量增加']);
      expect(tags).toContain('E');
    });

    it('detects S tags from English keywords', () => {
      const tags = (DiffEngine as any).detectESGTags(['improve safety standards']);
      expect(tags).toContain('S');
    });

    it('detects G tags', () => {
      const tags = (DiffEngine as any).detectESGTags(['board governance risk']);
      expect(tags).toContain('G');
    });

    it('detects multiple categories', () => {
      const tags = (DiffEngine as any).detectESGTags(['carbon emissions', 'human rights', 'board compliance']);
      expect(tags).toContain('E');
      expect(tags).toContain('S');
      expect(tags).toContain('G');
    });

    it('returns empty array for unrelated content', () => {
      const tags = (DiffEngine as any).detectESGTags(['the weather is nice today']);
      expect(tags).toEqual([]);
    });
  });
});
