import { vi, describe, it, expect, beforeEach } from 'vitest';

// 1. 模擬 docx 套件
vi.mock('docx', () => {
    return {
        Document: vi.fn(),
        Paragraph: vi.fn(),
        TextRun: vi.fn(),
        HeadingLevel: {
            TITLE: 'Title',
            HEADING_1: 'Heading1',
            HEADING_2: 'Heading2',
            HEADING_3: 'Heading3',
        },
        Packer: {
            toBlob: vi.fn().mockResolvedValue(new Blob(['mock blob'], { type: 'application/pdf' })),
        },
    };
});

// We need to import Packer after vi.mock to get the mocked version
import { Packer } from 'docx';

// 2. 模擬 Web Worker 的全域執行環境 (self)
const mockPostMessage = vi.fn();
(global as any).self = {
    onmessage: null,
    postMessage: mockPostMessage,
};

// 載入 Worker 腳本
await import('./exportDocx.worker.ts');

describe('exportDocx.worker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('應該成功處理文章資料並回傳 Blob (status: success)', async () => {
        const mockEventData = {
            data: {
                chapters: [
                    { id: 'chap_1', title: '第一章：環境保護' },
                ],
                generatedContent: {
                    'chap_1': '## 減碳目標\n內容',
                }
            }
        };

        const workerHandler = (global as any).self.onmessage;
        expect(workerHandler).toBeDefined();

        await workerHandler(mockEventData as MessageEvent);

        expect(Packer.toBlob).toHaveBeenCalledTimes(1);
        expect(mockPostMessage).toHaveBeenLastCalledWith(expect.objectContaining({
            status: 'success',
        }));
    });

    it('當打包過程發生錯誤時，應該回傳錯誤訊息 (status: error)', async () => {
        const mockError = new Error('打包失敗');
        (Packer.toBlob as any).mockRejectedValueOnce(mockError);

        const mockEventData = {
            data: { chapters: [], generatedContent: {} }
        };

        await (global as any).self.onmessage(mockEventData as MessageEvent);

        expect(mockPostMessage).toHaveBeenCalledWith({
            status: 'error',
            error: '打包失敗',
        });
    });
});
