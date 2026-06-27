/**
 * AGNES API Backend Client (Mock)
 * This is a server-side client for interacting with the AGNES API.
 */

export interface AgnesResponse {
  success: boolean;
  data: any;
  error?: string;
  metadata: {
    timestamp: number;
    provider: string;
  };
}

export class AgnesClient {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_AGNES_API_KEY || 'default_key';
    this.apiSecret = apiSecret || process.env.AGNES_API_SECRET || 'default_secret';
  }

  /**
   * Mock method to process a request via AGNES
   */
  async processRequest(input: string, context?: any): Promise<AgnesResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock logic: generate a response based on input
    const mockOutput = `[AGNES_API] Processed: "${input}". 系統狀態已同步。`;

    return {
      success: true,
      data: {
        output: mockOutput,
        confidence: 0.95,
      },
      metadata: {
        timestamp: Date.now(),
        provider: 'AGNES',
      },
    };
  }

  /**
   * Mock method to get metrics
   */
  async getMetrics(): Promise<AgnesResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        activeNodes: 12,
        throughput: '14.2 req/s',
      },
      metadata: {
        timestamp: Date.now(),
        provider: 'AGNES',
      },
    };
  }
}

// Singleton instance for server-side usage
export const agnesApi = new AgnesClient();
