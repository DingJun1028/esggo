import { describe, it, expect, beforeEach } from 'vitest';
import { TagManager, IndexManager, OmniTag, EventBus } from '../src/lib/omni-base/index';

describe('TagManager.verifyTagPair', () => {
  let indexManager: IndexManager;
  let tagManager: TagManager;
  let eventBus: EventBus;

  const createMockTag = (uuid: string, pairedWith: string | null, hash: string = 'hash'): OmniTag => {
    return {
      uuid,
      pairedWith,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lifecycle: 'paired',
      hash,
      salt: 'salt',
      commitment: 'commitment',
      entanglementType: 'data-flow',
      chapterId: 'chapter',
      griCode: 'gri',
      weight: { base: 1, dynamic: 1, lastUsed: Date.now(), usageCount: 0 },
      metadata: {},
    };
  };

  beforeEach(() => {
    eventBus = {
      publish: () => {},
      subscribe: () => {},
    } as any;
    tagManager = new TagManager(eventBus);
    indexManager = tagManager.getIndexManager();
  });

  it('should return valid true if both tags exist, are paired with each other, and have non-empty hashes', () => {
    const tagA = createMockTag('uuidA', 'uuidB');
    const tagB = createMockTag('uuidB', 'uuidA');
    indexManager.upsert(tagA);
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).not.toBeNull();
    expect(result?.valid).toBe(true);
    expect(result?.bondStrength).toBeGreaterThanOrEqual(0.7);
    expect(result?.bondStrength).toBeLessThanOrEqual(1.0);
    expect(result?.syncLatency).toBeGreaterThanOrEqual(5);
    expect(result?.syncLatency).toBeLessThanOrEqual(55);
  });

  it('should return null if tagA does not exist', () => {
    const tagB = createMockTag('uuidB', 'uuidA');
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).toBeNull();
  });

  it('should return null if tagB does not exist', () => {
    const tagA = createMockTag('uuidA', 'uuidB');
    indexManager.upsert(tagA);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).toBeNull();
  });

  it('should return null if tagA is not paired with tagB', () => {
    const tagA = createMockTag('uuidA', 'uuidC');
    const tagB = createMockTag('uuidB', 'uuidA');
    indexManager.upsert(tagA);
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).toBeNull();
  });

  it('should return null if tagB is not paired with tagA', () => {
    const tagA = createMockTag('uuidA', 'uuidB');
    const tagB = createMockTag('uuidB', 'uuidC');
    indexManager.upsert(tagA);
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).toBeNull();
  });

  it('should return valid false if tagA hash is empty', () => {
    const tagA = createMockTag('uuidA', 'uuidB', '');
    const tagB = createMockTag('uuidB', 'uuidA');
    indexManager.upsert(tagA);
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).not.toBeNull();
    expect(result?.valid).toBe(false);
  });

  it('should return valid false if tagB hash is empty', () => {
    const tagA = createMockTag('uuidA', 'uuidB');
    const tagB = createMockTag('uuidB', 'uuidA', '');
    indexManager.upsert(tagA);
    indexManager.upsert(tagB);

    const result = tagManager.verifyTagPair('uuidA', 'uuidB');

    expect(result).not.toBeNull();
    expect(result?.valid).toBe(false);
  });
});
