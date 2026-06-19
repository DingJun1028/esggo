
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Hoist all mock functions/objects
const {
    mockSelect, mockInsert, mockEq, mockOrder, mockLimit, mockMaybeSingle, mockFrom,
    mockSupabase,
    mockGenerateContent, mockGetGenerativeModel,
    mockDispatchIncidentAlert,
    mockLogHeartbeat
} = vi.hoisted(() => {
    const mockSelect = vi.fn();
    const mockInsert = vi.fn();
    const mockEq = vi.fn();
    const mockOrder = vi.fn();
    const mockLimit = vi.fn();
    const mockMaybeSingle = vi.fn();
    const mockFrom = vi.fn();

    const mockSupabase = { from: mockFrom };

    /* Chain setup */
    mockFrom.mockReturnValue({ select: mockSelect, insert: mockInsert });
    mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder, limit: mockLimit, maybeSingle: mockMaybeSingle });
    mockEq.mockReturnValue({ order: mockOrder, maybeSingle: mockMaybeSingle });
    mockOrder.mockReturnValue({ limit: mockLimit });

    /* Google AI Mocks */
    const mockGenerateContent = vi.fn();
    const mockGetGenerativeModel = vi.fn();

    /* Service Mocks */
    const mockDispatchIncidentAlert = vi.fn();
    const mockLogHeartbeat = vi.fn();

    return {
        mockSelect, mockInsert, mockEq, mockOrder, mockLimit, mockMaybeSingle, mockFrom,
        mockSupabase,
        mockGenerateContent, mockGetGenerativeModel,
        mockDispatchIncidentAlert,
        mockLogHeartbeat
    };
});

// 2. Mock Modules
vi.mock('../../src/config/supabase.js', () => ({
    supabase: mockSupabase
}));

vi.mock('../IntelligenceDispatchService.js', () => ({
    default: {
        dispatchIncidentAlert: mockDispatchIncidentAlert
    }
}));

vi.mock('../../src/services/SystemHealthService.js', () => ({
    default: {
        logHeartbeat: mockLogHeartbeat // Use hoisted mock
    }
}));



// Fix for GoogleGenerativeAI mock implementation
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel = mockGetGenerativeModel;
        }
    };
});

describe('ComplianceMonitorService', () => {
    let service: any;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Setup default behaviors for hoisted mocks
        mockGetGenerativeModel.mockReturnValue({
            generateContent: mockGenerateContent
        });
        mockGenerateContent.mockResolvedValue({
            response: { text: () => "AI Analysis: Validated." }
        });

        // Dynamic import
        const module = await import('../ComplianceMonitorService');
        service = module.default;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should scan for risks', async () => {
        const mockRisks = [
            { id: 'item-1', title: 'Test Risk', impact_score: 90, sustainability_sources: { authority: 3 } }
        ];

        mockLimit.mockResolvedValueOnce({ data: mockRisks, error: null });
        mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
        mockInsert.mockResolvedValueOnce({ error: null });

        await service.scanForRisks();

        expect(mockFrom).toHaveBeenCalledWith('market_intelligence_items');
        expect(mockFrom).toHaveBeenCalledWith('esg_incidents');
        expect(mockInsert).toHaveBeenCalled();
    });
});
