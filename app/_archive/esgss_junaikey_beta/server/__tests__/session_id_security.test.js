import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../services/redisService.js', () => ({
  default: {
    setSession: jest.fn().mockResolvedValue(true),
    getSession: jest.fn(),
  },
}));

jest.unstable_mockModule('../db/index.js', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
}));

// Dynamically import sessionService after mocks
const { sessionService } = await import('../services/sessionService.js');

describe('Session Security', () => {
  it('should generate a strong session ID using UUID', async () => {
    const agentData = { id: 'test-agent', name: 'Test Agent' };
    const overrides = {};
    const systemInstruction = 'test';

    const sessionId = await sessionService.createSession(agentData, overrides, systemInstruction);

    // Should look like session_<timestamp>_<uuid>
    // UUID v4 regex: [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}
    // We match the whole structure: session_TIMESTAMP_UUID
    const idRegex =
      /^session_\d+_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    expect(sessionId).toMatch(idRegex);
  });
});
