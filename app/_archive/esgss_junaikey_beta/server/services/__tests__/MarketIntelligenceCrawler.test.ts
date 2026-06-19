
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// 1. Hoist mocks
const {
    mockSelect, mockInsert, mockUpsert, mockEq, mockOr, mockLimit, mockOrder, mockFrom,
    mockSupabase,
    mockGenerateContent, mockGetGenerativeModel,
    mockLaunch, mockNewPage, mockGoto, mockEvaluate, mockClose, mockBrowser, mockPage
} = vi.hoisted(() => {
    // Supabase
    const mockSelect = vi.fn();
    const mockInsert = vi.fn();
    const mockUpsert = vi.fn();
    const mockEq = vi.fn();
    const mockOr = vi.fn();
    const mockLimit = vi.fn();
    const mockOrder = vi.fn();
    const mockFrom = vi.fn();

    const mockSupabase = { from: mockFrom };

    mockFrom.mockReturnValue({ select: mockSelect, upsert: mockUpsert });
    mockSelect.mockReturnValue({ or: mockOr, order: mockOrder });
    mockOr.mockReturnValue({ limit: mockLimit });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockUpsert.mockReturnValue({ select: mockSelect }); // generic chain

    // Google AI
    const mockGenerateContent = vi.fn();
    const mockGetGenerativeModel = vi.fn();

    // Puppeteer
    const mockGoto = vi.fn();
    const mockEvaluate = vi.fn();
    const mockClose = vi.fn();
    const mockNewPage = vi.fn();
    const mockLaunch = vi.fn();

    const mockPage = {
        setUserAgent: vi.fn(),
        goto: mockGoto,
        evaluate: mockEvaluate
    };

    const mockBrowser = {
        newPage: mockNewPage,
        close: mockClose
    };

    mockLaunch.mockResolvedValue(mockBrowser);
    mockNewPage.mockResolvedValue(mockPage);

    return {
        mockSelect, mockInsert, mockUpsert, mockEq, mockOr, mockLimit, mockOrder, mockFrom,
        mockSupabase,
        mockGenerateContent, mockGetGenerativeModel,
        mockLaunch, mockNewPage, mockGoto, mockEvaluate, mockClose, mockBrowser, mockPage
    };
});

// 2. Mock Modules
vi.mock('axios');
vi.mock('turndown', () => {
    return {
        default: class {
            turndown = vi.fn().mockReturnValue('Markdown Content');
        }
    };
});

vi.mock('puppeteer', () => {
    return {
        default: {
            launch: mockLaunch
        }
    };
});

vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            getGenerativeModel = mockGetGenerativeModel;
        }
    };
});

vi.mock('../../src/config/supabase.js', () => ({
    supabase: mockSupabase
}));

vi.mock('../../src/config/index.js', () => ({
    default: {
        ai: {
            gemini: {
                apiKey: 'test-api-key',
                model: 'gemini-2.0-flash'
            }
        }
    }
}));

describe('MarketIntelligenceCrawler', () => {
    let crawler: any;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Setup AI mock
        mockGetGenerativeModel.mockReturnValue({
            generateContent: mockGenerateContent
        });
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify({
                    sentiment: 'Positive',
                    impact_score: 0.8,
                    confidence_score: 0.9,
                    summary_tc: 'AI Summary'
                })
            }
        });

        const module = await import('../MarketIntelligenceCrawler');
        crawler = module.marketIntelligenceCrawler;
    });

    it('should be defined', () => {
        expect(crawler).toBeDefined();
    });


    it('should search market using axios', async () => {
        (axios.post as any).mockResolvedValue({
            data: {
                organic: [
                    { title: 'Test News', link: 'https://example.com/news', snippet: 'Test snippet' }
                ]
            }
        });

        // Set API key to enable real search path (mocked axios)
        process.env.SERPER_API_KEY = 'test-key';

        const results = await crawler.searchMarket('ESG');

        expect(axios.post).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('Test News');
    });

    it('should extract content using puppeteer', async () => {
        mockEvaluate.mockReturnValueOnce('Extracted Web Content');

        const content = await crawler.extractContent('https://example.com');

        expect(mockLaunch).toHaveBeenCalled();
        expect(mockNewPage).toHaveBeenCalled();
        expect(mockGoto).toHaveBeenCalledWith('https://example.com', expect.anything());
        expect(content).toBe('Extracted Web Content');
        expect(mockClose).toHaveBeenCalled();
    });

    it('should analyze content and return metrics', async () => {
        const analysis = await crawler.analyzeContent('Some ESG content');

        expect(mockGetGenerativeModel).toHaveBeenCalled();
        expect(mockGenerateContent).toHaveBeenCalled();
        expect(analysis.sentiment).toBe('Positive');
        expect(analysis.impactScore).toBe(0.8);
    });

    it('should save articles to supabase', async () => {
        const articles = [
            {
                title: 'Test Article',
                url: 'https://example.com/article',
                snippet: 'Snippet',
                source: 'Test Source',
                authority_level: 1
            }
        ];

        // Mock source lookup
        mockLimit.mockResolvedValueOnce({ data: [{ source_id: 1 }], error: null });

        // Mock upsert
        mockUpsert.mockResolvedValueOnce({ error: null });

        await crawler.saveArticles(articles, 'Test Query');

        expect(mockFrom).toHaveBeenCalledWith('sustainability_sources');
        expect(mockFrom).toHaveBeenCalledWith('market_intelligence_items');
        expect(mockUpsert).toHaveBeenCalled();
    });
});
