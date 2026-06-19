import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniTagSetImpl } from '../omniCore';
import { OmniTagType } from '../../types/omniCore';

describe('OmniCore System', () => {
    describe('OmniTagSet', () => {
        let tagSet: OmniTagSetImpl;

        beforeEach(() => {
            tagSet = new OmniTagSetImpl();
        });

        it('should add tags correctly', () => {
            const tag = {
                id: 'test-tag-1',
                type: OmniTagType.KNOWLEDGE,
                name: 'Test Tag',
                value: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            tagSet.add(tag);
            expect(tagSet.tags).toHaveLength(1);
            expect(tagSet.tags[0]).toEqual(tag);
        });

        it('should remove tags correctly', () => {
            const tag = {
                id: 'test-tag-1',
                type: OmniTagType.KNOWLEDGE,
                name: 'Test Tag',
                value: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            tagSet.add(tag);
            tagSet.remove(tag.id);
            expect(tagSet.tags).toHaveLength(0);
        });
    });
});
