import { Packer } from 'docx';

// 1. 模擬 docx 套件，避免在測試環境中進行繁重的二進位運算
const mockBlob = { size: 1024, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
vi.mock('docx', () => ({
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
        toBlob: vi.fn().mockResolvedValue(mockBlob), // 預設回傳假 Blob
    },
}));

// 2. 模擬 Web Worker 的全域執行環境 (self)
const mockPostMessage = vi.fn();
(global as any).self = {
    onmessage: null,
    postMessage: mockPostMessage,
};

// 載入 Worker 腳本 (這會自動將處理函式綁定到 global.self.onmessage)
require('./exportDocx.worker.ts');

describe('exportDocx.worker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('應該成功處理文章資料並回傳 Blob (status: success)', async () => {
        // 準備模擬的輸入資料
        const mockEventData = {
            data: {
                chapters: [
                    { id: 'chap_1', title: '第一章：環境保護' },
                    { id: 'chap_2', title: '第二章：社會責任' }
                ],
                generatedContent: {
                    'chap_1': '## 減碳目標\n這是一段減碳計畫內容。\n### 執行方案\n具體作法...',
                    // chap_2 故意留空，測試 Fallback 字串邏輯
                }
            }
        };

        // 取得綁定在 self 上的處理函式並執行
        const workerHandler = (global as any).self.onmessage;
        expect(workerHandler).toBeDefined();

        await workerHandler(mockEventData as MessageEvent);

        // 斷言 1: 確保 Packer.toBlob 被呼叫 (代表有啟動文件打包)
        expect(Packer.toBlob).toHaveBeenCalledTimes(1);

        // 斷言 2: 確保 Worker 將成功狀態與 Blob 拋回主執行緒
        expect(mockPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPostMessage).toHaveBeenCalledWith({
            status: 'success',
            blob: mockBlob,
        });
    });

    it('當打包過程發生錯誤時，應該回傳錯誤訊息 (status: error)', async () => {
        // 模擬 Packer.toBlob 拋出錯誤
        const mockError = new Error('記憶體不足，打包失敗');
        (Packer.toBlob as jest.Mock).mockRejectedValueOnce(mockError);

        const mockEventData = {
            data: { chapters: [], generatedContent: {} }
        };

        await (global as any).self.onmessage(mockEventData as MessageEvent);

        expect(mockPostMessage).toHaveBeenCalledWith({
            status: 'error',
            error: '記憶體不足，打包失敗',
        });
    });
});