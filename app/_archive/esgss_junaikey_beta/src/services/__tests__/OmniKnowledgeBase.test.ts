import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omniKnowledgeBase, KnowledgeCategory, OmniCrystalStatus } from '../OmniKnowledgeBase';

// Mock dependencies
vi.mock('@/omni/infrastructure/logging/OmniLogger', () => ({
    omniLogger: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
    },
    LogCategory: {
        SYSTEM: 'SYSTEM',
        DATA: 'DATA',
        SYNC: 'SYNC',
    },
}));

vi.mock('../OmniTableService', () => ({
    omniTableService: {
        configure: vi.fn(),
    },
}));

describe('OmniKnowledgeBase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create knowledge with OmniMemory and OmniCrystal defaults', async () => {
        const entry = await omniKnowledgeBase.createKnowledge({
            title: 'Test ESG Knowledge',
            content: 'This is a test content for 5T protocol.',
            category: KnowledgeCategory.ESG,
            authorId: 'test-user',
        });

        expect(entry.knowledge_id).toBeDefined();
        expect(entry.version).toBe(1);
        expect(entry.history).toHaveLength(0);
        expect(entry.crystal_status).toBe(OmniCrystalStatus.DRAFT);
        expect(entry.is_asset).toBe(false);
        expect(entry.hash_lock).toContain('SHA256-');
    });

    it('should create a snapshot in history when updating knowledge', async () => {
        const entry = await omniKnowledgeBase.createKnowledge({
            title: 'Versioned Knowledge',
            content: 'Initial content',
            category: KnowledgeCategory.TECHNICAL,
            authorId: 'test-user',
        });

        const updated = await omniKnowledgeBase.updateKnowledge(entry.knowledge_id, {
            content: 'Updated content',
        });

        expect(updated.version).toBe(2);
        expect(updated.history).toHaveLength(1);
        expect(updated.history[0].content).toBe('Initial content');
        expect(updated.crystal_status).toBe(OmniCrystalStatus.DRAFT);
    });

    it('should crystallize knowledge correctly', async () => {
        const entry = await omniKnowledgeBase.createKnowledge({
            title: 'Asset Knowledge',
            content: 'High quality data',
            category: KnowledgeCategory.BEST_PRACTICE,
            authorId: 'test-user',
        });

        const crystallized = await omniKnowledgeBase.crystallize(entry.knowledge_id);

        expect(crystallized.crystal_status).toBe(OmniCrystalStatus.CRYSTAL);
        expect(crystallized.is_asset).toBe(true);
        expect(crystallized.asset_value).toBeGreaterThan(0);
        expect(crystallized.verified_at).toBeDefined();
    });

    it('should add OmniTags correctly', async () => {
        const entry = await omniKnowledgeBase.createKnowledge({
            title: 'Tagged Knowledge',
            content: 'Content with tags',
            category: KnowledgeCategory.INSIGHT,
            authorId: 'test-user',
        });

        const tag = {
            id: 'tag-1',
            name: 'Environment',
            color: '#00FF00',
        };

        const updated = await omniKnowledgeBase.addOmniTag(entry.knowledge_id, tag);

        expect(updated.omni_tags).toHaveLength(1);
        expect(updated.omni_tags[0].name).toBe('Environment');
    });

    it('should fail crystallization if hash mismatch (5T Integrity)', async () => {
        const entry = await omniKnowledgeBase.createKnowledge({
            title: 'Tampered Knowledge',
            content: 'Original content',
            category: KnowledgeCategory.ESG,
            authorId: 'test-user',
        });

        // Simulating tampering by manually changing content in cache without updating hash_lock
        // (Note: In a real scenario, this would happen if external storage was tampered)
        // We have to reach into private cache for this test
        (omniKnowledgeBase as any).knowledgeCache.get(entry.knowledge_id).content = 'TAMPERED CONTENT';

        await expect(omniKnowledgeBase.crystallize(entry.knowledge_id))
            .rejects.toThrow('5T Integrity Check failed');
    });
});
