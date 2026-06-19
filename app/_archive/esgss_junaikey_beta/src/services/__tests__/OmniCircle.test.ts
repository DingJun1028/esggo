import { describe, it, expect, vi, beforeEach } from 'vitest';
import { omniCircle } from '../../core/OmniCircle';
import { KnowledgeCategory } from '../OmniKnowledgeBase';

// Mock dependencies
vi.mock('../OmniKnowledgeBase', () => ({
    omniKnowledgeBase: {
        createKnowledge: vi.fn().mockImplementation(async (data) => ({
            knowledge_id: 'test_kb_123',
            ...data
        })),
        crystallize: vi.fn().mockImplementation(async (id) => ({
            knowledge_id: id,
            asset_value: 1000,
            crystal_status: 'crystal'
        }))
    },
    KnowledgeCategory: {
        ESG: 'ESG',
        TECHNICAL: 'technical',
        INVESTIGATION: 'investigation',
        INSIGHT: 'insight',
        PATTERN: 'pattern',
        SOLUTION: 'solution',
        BEST_PRACTICE: 'best_practice',
    }
}));

vi.mock('../../omni/infrastructure/logging/OmniLogger', () => ({
    omniLogger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn()
    },
    LogCategory: {
        BUSINESS: 'BUSINESS',
        DATA: 'DATA',
        SYSTEM: 'SYSTEM',
        INTEGRATION: 'INTEGRATION',
        SYNC: 'SYNC'
    }
}));

const mockSaveNote = vi.fn();
vi.mock('../../store/useNoteSystem', () => ({
    useNoteSystem: {
        getState: () => ({
            saveNote: mockSaveNote
        })
    }
}));

vi.mock('../OmniSyncService', () => ({
    omniSyncService: {
        syncEntity: vi.fn().mockResolvedValue({ success: true })
    }
}));

vi.mock('../../omni/core/OmniI18nEngine.js', () => ({
    OmniI18nEngine: {
        formatLabel: vi.fn().mockImplementation((term) => term)
    }
}));

describe('OmniCircle Orchestration with Multi-Platform Mapping Matrix', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should coordinate multi-platform mapping matrix (OmniSpace, OmniTable, OmniNote)', async () => {
        const { omniSyncService } = await import('../OmniSyncService');

        const dna = await omniCircle.orchestrateSentience({
            intent: 'INSIGHT',
            domain: 'SENTIENCE',
            narrative: 'Testing mapping matrix',
            resonance: 95,
            markers: ['MATRIX_TEST']
        });

        // 1. Verify OmniSpace sync
        expect(omniSyncService.syncEntity).toHaveBeenCalledWith(
            'omni_space',
            'insight',
            expect.any(String),
            'bidirectional',
            expect.objectContaining({ label: 'INSIGHT' })
        );

        // 2. Verify OmniTable sync
        expect(omniSyncService.syncEntity).toHaveBeenCalledWith(
            'omni_table',
            'knowledge_asset',
            expect.any(String),
            'bidirectional',
            expect.objectContaining({ tags: expect.arrayContaining(['MATRIX_TEST']) })
        );

        // 3. Verify OmniNote sync
        expect(mockSaveNote).toHaveBeenCalledWith(
            expect.stringContaining('omni_note_'),
            'Testing mapping matrix',
            expect.objectContaining({ isKnowledgeAsset: true })
        );

        expect(dna.uuid).toBeDefined();
    });

    it('should handle ESG domain labeling across all targets', async () => {
        const dna = await omniCircle.orchestrateSentience({
            intent: 'RESILIENCE',
            domain: 'ENVIRONMENT',
            narrative: 'ESG matrix test',
            resonance: 85,
            markers: ['ESG_TEST']
        });

        expect(dna.payload.tangibleLabel).toBe('ENVIRONMENT');

        // Ensure OmniTable sync used the correct metadata
        const { omniSyncService } = await import('../OmniSyncService');
        expect(omniSyncService.syncEntity).toHaveBeenCalledWith(
            'omni_table',
            'knowledge_asset',
            expect.any(String),
            'bidirectional',
            expect.objectContaining({ category: KnowledgeCategory.ESG })
        );
    });
});
