
import { useSustainWriteStore } from './store/useSustainWriteStore';
import { loadSustainWriteSections, saveSustainWriteSection } from './lib/dataconnect-memory';

vi.mock('./lib/dataconnect-memory', () => ({
    loadSustainWriteSections: vi.fn().mockResolvedValue([]),
    saveSustainWriteSection: vi.fn().mockResolvedValue(true),
}));

describe('useSustainWriteStore - Undo & Redo', () => {
    const initialState = useSustainWriteStore.getState();

    beforeEach(() => {
        jest.clearAllMocks();
        // 確保每個測試開始前，Zustand Store 都是最乾淨的初始狀態
        useSustainWriteStore.setState(initialState, true);
        Storage.prototype.setItem = vi.fn();
        Storage.prototype.removeItem = vi.fn();
    });

    it('應該能正確執行復原 (undo) 與重做 (redo) 機制', () => {
        const store = useSustainWriteStore.getState();
        const chapterId = 'chap_undo_test';

        // 1. 編輯並提交歷史 (草稿 1)
        store.updateContent(chapterId, '草稿 1', '測試章節', 1, []);
        useSustainWriteStore.getState().commitHistory(chapterId);

        // 2. 編輯並提交歷史 (草稿 2)
        useSustainWriteStore.getState().updateContent(chapterId, '草稿 2', '測試章節', 1, []);
        useSustainWriteStore.getState().commitHistory(chapterId);

        // 3. 編輯到一半，尚未提交 (草稿 3)
        useSustainWriteStore.getState().updateContent(chapterId, '草稿 3', '測試章節', 1, []);

        // 確認初始堆疊狀態
        let state = useSustainWriteStore.getState();
        expect(state.generatedContent[chapterId]).toBe('草稿 3');
        expect(state.contentHistory[chapterId].past).toEqual(['草稿 1', '草稿 2']);
        expect(state.contentHistory[chapterId].future).toEqual([]);

        // 4. 第一次復原 (Undo) -> 預期回到「草稿 2」
        useSustainWriteStore.getState().undoContent(chapterId, '測試章節', 1, []);
        state = useSustainWriteStore.getState();
        expect(state.generatedContent[chapterId]).toBe('草稿 2');
        expect(state.contentHistory[chapterId].past).toEqual(['草稿 1']);
        expect(state.contentHistory[chapterId].future).toEqual(['草稿 3']);

        // 5. 第二次復原 (Undo) -> 預期回到「草稿 1」
        useSustainWriteStore.getState().undoContent(chapterId, '測試章節', 1, []);
        state = useSustainWriteStore.getState();
        expect(state.generatedContent[chapterId]).toBe('草稿 1');
        expect(state.contentHistory[chapterId].past).toEqual([]);
        expect(state.contentHistory[chapterId].future).toEqual(['草稿 2', '草稿 3']);

        // 6. 重做 (Redo) -> 預期回到「草稿 2」
        useSustainWriteStore.getState().redoContent(chapterId, '測試章節', 1, []);
        state = useSustainWriteStore.getState();
        expect(state.generatedContent[chapterId]).toBe('草稿 2');
        expect(state.contentHistory[chapterId].past).toEqual(['草稿 1']);
        expect(state.contentHistory[chapterId].future).toEqual(['草稿 3']);

        // 7. 分支未來：在復原狀態下準備輸入新內容前 (onFocus)，先紀錄當前狀態
        useSustainWriteStore.getState().commitHistory(chapterId); // 紀錄「草稿 2」

        // 輸入新內容並紀錄 (onBlur)
        useSustainWriteStore.getState().updateContent(chapterId, '全新分支內容', '測試章節', 1, []);
        useSustainWriteStore.getState().commitHistory(chapterId); // 紀錄「全新分支內容」

        state = useSustainWriteStore.getState();
        expect(state.contentHistory[chapterId].past).toEqual(['草稿 1', '草稿 2', '全新分支內容']);
        expect(state.contentHistory[chapterId].future).toEqual([]); // 原本的「草稿 3」被清除了
    });
});
