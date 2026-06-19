import { vi, describe, test, expect, beforeEach } from 'vitest';

// Hoist mocks to access them in tests
const { mockQuery, mockEmbedContent } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockEmbedContent: vi.fn()
}));

// Mock DB to prevent connection attempts
vi.mock('../db/index.js', () => ({
  query: mockQuery,
  transaction: vi.fn(),
  default: {
    query: mockQuery,
    transaction: vi.fn()
  }
}));

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          embedContent: mockEmbedContent
        };
      }
    }
  };
});

// Import the service AFTER mocking
import { RAGService } from '../services/rag.js';

describe('RAGService Performance', () => {
  let ragService;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
    ragService = new RAGService();

    mockEmbedContent.mockReset();
    mockEmbedContent.mockImplementation(async (text) => {
      // Simulate latency
      await new Promise(resolve => setTimeout(resolve, 10));
      return {
        embedding: { values: [0.1, 0.2, 0.3] }
      };
    });

    mockQuery.mockReset();
  });

  test('should cache embeddings for identical text', async () => {
    const text = 'This is a test query for embedding caching.';

    // First call
    await ragService.generateEmbedding(text);

    // Second call
    await ragService.generateEmbedding(text);

    // Expectation: embedContent should be called only once if cached
    expect(mockEmbedContent).toHaveBeenCalledTimes(1);
  });

  test('should call API for different texts', async () => {
    await ragService.generateEmbedding('text 1');
    await ragService.generateEmbedding('text 2');

    expect(mockEmbedContent).toHaveBeenCalledTimes(2);
  });

  test('should cache search results for identical queries', async () => {
    const kbId = 'test-kb';
    const queryText = 'caching test';

    // Mock DB response
    mockQuery.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 1, content: 'result', similarity: 0.9 }]
    });

    // First call
    await ragService.retrieveRelevant(kbId, queryText);

    // Second call
    await ragService.retrieveRelevant(kbId, queryText);

    // Expectation: DB query should be called only once if cached
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});
