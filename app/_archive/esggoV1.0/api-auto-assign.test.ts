import { POST } from './app/api/squad/auto-assign/route';
import { squadAutoAssignFlow } from './lib/genkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 模擬 (Mock) genkit 服務
vi.mock('./lib/genkit', () => ({
    squadAutoAssignFlow: vi.fn()
}));

// 模擬 (Mock) next/server
vi.mock('next/server', () => ({
    NextResponse: {
        json: (data: any, init?: any) => ({
            status: init?.status || 200,
            json: async () => data
        })
    }
}));

describe('POST /api/squad/auto-assign 後端 API 測試', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('當提供正確的任務與成員資料時，應回傳成功的 JSON 格式與 AI 指派結果', async () => {
        // 1. 準備模擬的 AI 回傳結果
        const mockResult = {
            assignedMemberId: 'u-001',
            confidenceScore: 85,
            reason: '該成員具備相符的專業技能。'
        };

        (squadAutoAssignFlow as any).mockResolvedValue(mockResult);

        // 2. 建立模擬的 HTTP Request
        const mockRequest = new Request('http://localhost/api/squad/auto-assign', {
            method: 'POST',
            body: JSON.stringify({
                task: { title: '測試任務', description: '測試描述' },
                members: [{ id: 'u-001', name: 'Alice', isActive: true }]
            })
        });

        // 3. 執行 API
        const response = await POST(mockRequest);
        const json = await response.json();

        // 4. 斷言檢查 Response 格式
        expect(response.status).toBe(200);
        expect(json).toEqual({
            success: true,
            assignment: mockResult
        });
    });

    it('當 AI 邏輯發生錯誤時，應捕捉錯誤並回傳 500 狀態碼', async () => {
        (squadAutoAssignFlow as any).mockRejectedValue(new Error('AI Service Offline'));

        const mockRequest = new Request('http://localhost/api/squad/auto-assign', {
            method: 'POST',
            body: JSON.stringify({ task: {}, members: [] }) // 傳送資料以通過 JSON 解析
        });

        const response = await POST(mockRequest);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.success).toBe(false);
        expect(json.error).toBe('AI Service Offline');
    });
});