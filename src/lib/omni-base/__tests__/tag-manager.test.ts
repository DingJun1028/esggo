import { describe, it, expect, beforeEach } from 'vitest';
import { TagManager, createEventBus, EventBus } from '../index';

describe('TagManager - verifyTagPair', () => {
  let eventBus: EventBus;
  let tagManager: TagManager;

  beforeEach(() => {
    eventBus = createEventBus();
    tagManager = new TagManager(eventBus);
  });

  it('should return null when neither tag exists', () => {
    const result = tagManager.verifyTagPair('non-existent-1', 'non-existent-2');
    expect(result).toBeNull();
  });

  it('should return null when only one tag exists', () => {
    const tagA = tagManager.createTag('chapter-1', 'GRI-123');
    const result = tagManager.verifyTagPair(tagA.uuid, 'non-existent-2');
    expect(result).toBeNull();
  });

  it('should return null when tags are not paired with each other', () => {
    const tagA = tagManager.createTag('chapter-1', 'GRI-123');
    const tagB = tagManager.createTag('chapter-2', 'GRI-456');
    // They are not paired
    const result = tagManager.verifyTagPair(tagA.uuid, tagB.uuid);
    expect(result).toBeNull();
  });

  it('should return null when tagA is paired with someone else', () => {
    const tagA = tagManager.createTag('chapter-1', 'GRI-123');
    const tagB = tagManager.createTag('chapter-2', 'GRI-456');
    const tagC = tagManager.createTag('chapter-3', 'GRI-789');

    // Pair A with C instead of B
    tagManager.pairTags(tagA.uuid, tagC.uuid);

    const result = tagManager.verifyTagPair(tagA.uuid, tagB.uuid);
    expect(result).toBeNull();
  });

  it('should return valid result when tags are correctly paired', () => {
    const tagA = tagManager.createTag('chapter-1', 'GRI-123');
    const tagB = tagManager.createTag('chapter-2', 'GRI-456');

    tagManager.pairTags(tagA.uuid, tagB.uuid);

    const result = tagManager.verifyTagPair(tagA.uuid, tagB.uuid);

    expect(result).not.toBeNull();
    expect(result?.valid).toBe(true);
    expect(typeof result?.bondStrength).toBe('number');
    expect(typeof result?.syncLatency).toBe('number');
    // Verify properties match logic
    expect(result!.bondStrength).toBeGreaterThanOrEqual(0.7);
    expect(result!.bondStrength).toBeLessThanOrEqual(1.0);
    expect(result!.syncLatency).toBeGreaterThanOrEqual(5);
    expect(result!.syncLatency).toBeLessThanOrEqual(55);
  });
});
