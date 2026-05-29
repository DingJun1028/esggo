import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ChapterEditor } from './ChapterEditor';
import { useSustainWriteStore } from '../store/useSustainWriteStore';

// 1. 模擬 Zustand Store，避免測試時引發真實的狀態改變或 API 呼叫
vi.mock('../store/useSustainWriteStore', () => ({
    useSustainWriteStore: vi.fn(),
}));

describe('ChapterEditor - AI Style Selection', () => {
    const mockExpandContentWithAI = vi.fn();
    const mockUpdateContent = vi.fn();
    const mockCommitHistory = vi.fn();
    const mockUndoContent = vi.fn();
    const mockRedoContent = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // 在每個測試前，設定 useSustainWriteStore 回傳我們準備好的 Mock 函式與狀態
        (useSustainWriteStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            generatedContent: {},
            isGeneratingAI: {},
            contentHistory: {},
            updateContent: mockUpdateContent,
            commitHistory: mockCommitHistory,
            undoContent: mockUndoContent,
            redoContent: mockRedoContent,
            expandContentWithAI: mockExpandContentWithAI,
        });
    });

    it('應該在切換擴寫風格後，傳遞正確的 Prompt 給 expandContentWithAI', async () => {
        // 初始化 userEvent
        const user = userEvent.setup();

        // 渲染元件
        render(
            <ChapterEditor
                chapterId="chap_test"
                chapterName="公司治理"
                chapterOrder={2}
                griRefs={['GRI 2-9']}
            />
        );

        // 2. 找到下拉選單 (select 在 testing-library 中的 role 為 combobox)
        const styleSelect = screen.getByRole('combobox');

        // 模擬使用者操作：展開選單並選擇「數據導向 (data_driven)」
        await user.selectOptions(styleSelect, 'data_driven');

        // 驗證 UI 的值確實改變了
        expect(styleSelect).toHaveValue('data_driven');

        // 3. 找到「AI 智能擴寫」的按鈕並點擊
        // (透過按鈕內的文字 Expert AI Expansion 來定位)
        const expandButton = screen.getByRole('button', { name: /Expert AI Expansion/i });
        await user.click(expandButton);

        // 4. 斷言：驗證 expandContentWithAI 接收到的參數是否完全正確
        expect(mockExpandContentWithAI).toHaveBeenCalledTimes(1);

        // 最重要的一步：驗證第 5 個參數 (Prompt 字串) 是否為 data_driven 的設定值
        const expectedPrompt = '請以數據導向為主，在擴寫時強調具體指標、成效與量化數據的邏輯分析。';
        expect(mockExpandContentWithAI).toHaveBeenCalledWith(
            'chap_test',
            '公司治理',
            2,
            ['GRI 2-9'],
            expectedPrompt
        );
    });
});