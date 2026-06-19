import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSustainWriteStore } from './store/useSustainWriteStore';
import { loadSustainWriteSections, saveSustainWriteSection } from './lib/dataconnect-memory';

vi.mock('./lib/dataconnect-memory', () => ({
    loadSustainWriteSections: vi.fn().mockResolvedValue([]),
    saveSustainWriteSection: vi.fn().mockResolvedValue(true),
}));

vi.mock('crypto', async () => {
    const actual = await vi.importActual('crypto');
    return {
        ...actual,
        createHash: () => ({
            update: () => ({
                digest: () => 'mocked-hash-1234567890abcdef'
            })
        }),
        randomBytes: () => ({
            toString: () => 'mocked-random-bytes'
        })
    };
});

describe('useSustainWriteStore - Undo & Redo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Storage.prototype.setItem = vi.fn();
        Storage.prototype.removeItem = vi.fn();
    });

    it('應該能正確執行復原 (undo) 與重做 (redo) 機制', () => {
        const chapterId = 'chap_undo_test';

        useSustainWriteStore.setState({
            companyId: 'default',
            sections: {},
            fieldValues: {},
            notes: {},
            docStates: {},
            chapterStatuses: {},
            generatedContent: { [chapterId]: '草稿 3' },
            loading: false,
            syncError: false,
            lastSaved: null,
            contentHistory: { [chapterId]: { past: ['草稿 1', '草稿 2'], future: [] } },
            isGeneratingAI: {},
            ragContexts: {},
            zkpStatus: {},
            autoSavePending: false,
        });

        let state = useSustainWriteStore.getState();
        expect(state.generatedContent[chapterId]).toBe('草稿 3');
        expect(state.contentHistory[chapterId].past).toEqual(['草稿 1', '草稿 2']);

        useSustainWriteStore.getState().undoContent(chapterId, '測試章節', 1, []);
        state = useSustainWriteStore.getState();
        expect(state.contentHistory[chapterId].future).toContain('草稿 3');
    });
});

describe('useSustainWriteStore - Utilities', () => {
    it('getWordCount 應該正確計算字數', () => {
        const chapterId = 'test-chapter';
        const content = '這是一個測試內容，用於計算字數。';
        
        useSustainWriteStore.setState({
            generatedContent: { [chapterId]: content }
        });
        
        const count = useSustainWriteStore.getState().getWordCount(chapterId);
        expect(count).toBeGreaterThan(0);
    });
});
