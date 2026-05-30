import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SupabaseOmniRealtimeService } from './SupabaseOmniRealtimeService';
import { supabase } from '../supabase';

// 1. 模擬外部依賴：Supabase Client
vi.mock('../supabase', () => ({
    supabase: {
        channel: vi.fn(),
    },
}));

describe('SupabaseOmniRealtimeService', () => {
    let service: SupabaseOmniRealtimeService;
    let mockCallbacks: any;
    let mockChannel: any;
    let originalFetch: typeof global.fetch;

    // 用來捕捉在 .on() 中註冊的回呼函式，以便在測試中手動觸發
    let capturedBroadcastCb: Function | null = null;
    let capturedPresenceSyncCb: Function | null = null;
    let originalSupabaseUrl: string | undefined;
    let originalSupabaseKey: string | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        capturedBroadcastCb = null;
        capturedPresenceSyncCb = null;

        originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        originalSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-key';

        // 模擬 global.fetch
        originalFetch = global.fetch;
        global.fetch = vi.fn().mockResolvedValue({ ok: true }) as any;

        // 模擬 global.crypto.randomUUID
        if (!global.crypto) (global as any).crypto = {};
        global.crypto.randomUUID = vi.fn().mockReturnValue('mock-uuid-1234') as any;

        // 建立可以支援鏈式呼叫 (Chaining) 的 Mock Channel
        mockChannel = {
            on: vi.fn().mockImplementation((event_type, filter, cb) => {
                if (event_type === 'broadcast' && filter.event === 'omni_event') {
                    capturedBroadcastCb = cb;
                }
                if (event_type === 'presence' && filter.event === 'sync') {
                    capturedPresenceSyncCb = cb;
                }
                return mockChannel; // 支援 .on().on() 鏈式呼叫
            }),
            subscribe: vi.fn().mockImplementation((cb: Function) => cb('SUBSCRIBED')),
            unsubscribe: vi.fn(),
            track: vi.fn().mockResolvedValue(true),
            send: vi.fn().mockResolvedValue(true),
            presenceState: vi.fn().mockReturnValue({
                someKey: [{ user_id: 'user_123' }]
            }),
        };

        (supabase.channel as any).mockReturnValue(mockChannel);

        // 模擬 UI 傳進來的 Callbacks
        mockCallbacks = {
            onPresenceSync: vi.fn(),
            onEventReceived: vi.fn(),
            onStatusChange: vi.fn(),
        };

        service = new SupabaseOmniRealtimeService();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
        process.env.SUPABASE_SERVICE_ROLE_KEY = originalSupabaseKey;
    });

    it('應該能正確連線至頻道，並在 SUBSCRIBED 狀態下觸發狀態更新與追蹤', async () => {
        const mockUser = { uid: 'u1', email: 'test@esggo.com' };
        service.connect(mockUser, mockCallbacks);

        // 斷言 1: 確保連接了正確的房間名稱
        expect(supabase.channel).toHaveBeenCalledWith('omni-resonance-room');

        // 斷言 2: 確保四個核心事件 (sync, join, leave, broadcast) 都有被註冊
        expect(mockChannel.on).toHaveBeenCalledTimes(4);
        expect(mockChannel.subscribe).toHaveBeenCalledTimes(1);

        // 斷言 3: UI Callback 應該收到上線通知
        expect(mockCallbacks.onStatusChange).toHaveBeenCalledWith(true);

        // 斷言 4: 使用者資訊應該被正確推播至 Presence 系統
        expect(mockChannel.track).toHaveBeenCalledWith(expect.objectContaining({
            user_id: 'u1',
            email: 'test@esggo.com'
        }));
    });

    it('接收到廣播事件 (broadcast) 時，應該正確轉發給 UI', () => {
        service.connect(null, mockCallbacks);

        expect(capturedBroadcastCb).toBeDefined();

        // 模擬從 Supabase 伺服器推播下來的 Payload
        const incomingPayload = { payload: { id: 'msg_1', type: 'TRACE', payload: 'test' } };
        capturedBroadcastCb!(incomingPayload);

        // 確保 UI 的 onEventReceived 有拿到內層的 payload
        expect(mockCallbacks.onEventReceived).toHaveBeenCalledWith(incomingPayload.payload);
    });

    it('執行 disconnect 時應該釋放頻道訂閱', () => {
        service.connect(null, mockCallbacks);
        service.disconnect();

        expect(mockChannel.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('發送事件 (emitEvent) 時應該廣播至頻道，並非同步寫入遙測 API', async () => {
        service.connect(null, mockCallbacks);

        const testEvent = { type: 'COMPUTE' as const, payload: '計算完成' };
        const mockUser = { email: 'commander@esggo.com' };

        const result = await service.emitEvent(testEvent, mockUser);

        // 斷言 1: 服務內部會自動補齊 ID 與時間戳
        expect(result.id).toBe('mock-uuid-1234');
        expect(result.type).toBe('COMPUTE');
        expect(result.user_email).toBe('commander@esggo.com');

        // 斷言 2: 應該透過 Supabase Channel 發送
        expect(mockChannel.send).toHaveBeenCalledWith({
            type: 'broadcast',
            event: 'omni_event',
            payload: result
        });

        // 斷言 3: 應該透過 Fetch 非同步發送至後端遙測 API
        expect(global.fetch).toHaveBeenCalledWith('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        });
    });
});