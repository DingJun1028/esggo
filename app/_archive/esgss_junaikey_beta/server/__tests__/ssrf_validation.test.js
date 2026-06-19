import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('jsdom', () => ({
  JSDOM: class {
    constructor() {
      this.window = { document: { body: {}, querySelector: () => ({ outerHTML: '<div></div>' }) } };
    }
  },
}));

vi.mock('turndown', () => ({
  default: class {
    turndown() { return 'mock markdown'; }
  },
}));

// Import the service
import { MCPService } from '../services/MCPService.js';
import axios from 'axios';

describe('MCPService SSRF Protection', () => {
  let service;

  beforeEach(() => {
    service = new MCPService();
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.get).mockResolvedValue({ data: '<html><body>Content</body></html>' });
  });

  it('should allow valid public HTTPS URLs and use secure agent', async () => {
    const url = 'https://google.com';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('success');
    // Expect maxRedirects: 0 to prevent redirect-based SSRF
    // AND expect custom agents for DNS protection
    expect(axios.get).toHaveBeenCalledWith(url, expect.objectContaining({
        maxRedirects: 0,
        httpAgent: expect.objectContaining({ options: expect.objectContaining({ lookup: expect.any(Function) }) }),
        httpsAgent: expect.objectContaining({ options: expect.objectContaining({ lookup: expect.any(Function) }) })
    }));
  });

  it('should BLOCK localhost', async () => {
    const url = 'http://localhost:3000/api/secrets';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('error');
    expect(result.message).toMatch(/Restricted|Blocked|Invalid/i);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should BLOCK private IP 127.0.0.1', async () => {
    const url = 'http://127.0.0.1/admin';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('error');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should BLOCK private IP 127.0.0.2 (loopback variant)', async () => {
    const url = 'http://127.0.0.2/admin';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('error');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should BLOCK AWS metadata service', async () => {
    const url = 'http://169.254.169.254/latest/meta-data/';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('error');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should BLOCK non-http protocols', async () => {
    const url = 'file:///etc/passwd';
    const result = await service.fetchAsMarkdown(url);

    expect(result.status).toBe('error');
    expect(axios.get).not.toHaveBeenCalled();
  });
});
