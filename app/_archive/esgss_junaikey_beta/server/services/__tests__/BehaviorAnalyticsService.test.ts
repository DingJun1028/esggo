import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BehaviorAnalyticsService } from '../BehaviorAnalyticsService';
import { supabase } from '../../db/supabaseClient';
import omniLogger from '../../utils/omniLogger';

// Mock Supabase
vi.mock('../../db/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            upsert: vi.fn().mockResolvedValue({ error: null }),
            insert: vi.fn().mockResolvedValue({ error: null }),
        })),
    },
}));

// Mock Logger
vi.mock('../../utils/omniLogger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
    LogCategory: {
        SYSTEM: 'SYSTEM',
        DATA: 'DATA',
    },
}));

describe('BehaviorAnalyticsService', () => {
    const mockUserId = 'test-user-uuid';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should correctly analyze user habits and generate tags', async () => {
        const mockEvents = [
            { event_type: 'view_assessment', page_url: '/report', created_at: '2026-02-12T08:00:00Z' }, // 08:00 UTC -> EarlyBird
            { event_type: 'click_button', page_url: '/home', created_at: '2026-02-12T06:00:00Z' },  // 06:00 UTC -> EarlyBird
        ];

        // Refined Mock Strategy for Chained Calls
        const selectMock = vi.fn().mockReturnThis();
        const eqMock = vi.fn().mockReturnThis();
        const orderMock = vi.fn().mockReturnThis();
        const limitMock = vi.fn().mockResolvedValue({ data: mockEvents, error: null });

        vi.mocked(supabase.from).mockReturnValue({
            select: selectMock,
            eq: eqMock,
            order: orderMock,
            limit: limitMock,
            upsert: vi.fn().mockResolvedValue({ error: null }),
        } as any);

        const result = await BehaviorAnalyticsService.analyzeUserHabits(mockUserId);

        expect(result).not.toBeNull();
        expect(result.habitTags).toContain('ESG_Learner');
        expect(result.habitTags).toContain('EarlyBird');
        expect(supabase.from).toHaveBeenCalledWith('behavioral_events');
        expect(supabase.from).toHaveBeenCalledWith('user_habit_stats');
    });

    it('should return null if no events found', async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        } as any);

        const result = await BehaviorAnalyticsService.analyzeUserHabits(mockUserId);
        expect(result).toBeNull();
    });

    it('should summarize global trends correctly', async () => {
        const mockGlobalEvents = [
            { event_type: 'login' },
            { event_type: 'login' },
            { event_type: 'logout' },
        ];

        const gteMock = vi.fn().mockResolvedValue({ data: mockGlobalEvents, error: null });
        const insertMock = vi.fn().mockResolvedValue({ error: null });

        vi.mocked(supabase.from).mockImplementation((table: string) => {
            if (table === 'behavioral_events') {
                return { select: vi.fn().mockReturnThis(), gte: gteMock } as any;
            }
            if (table === 'big_data_summary') {
                return { insert: insertMock } as any;
            }
            return {} as any;
        });

        await BehaviorAnalyticsService.summarizeGlobalTrends();

        expect(supabase.from).toHaveBeenCalledWith('behavioral_events');
        expect(supabase.from).toHaveBeenCalledWith('big_data_summary');
        expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
            summary_data: { login: 2, logout: 1 }
        }));
    });
});
