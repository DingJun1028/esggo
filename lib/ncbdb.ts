/**
 * NCBDB Client: Nocodebackend DataBase Integration
 * v2.0.0 | High-Efficiency No-Code Sovereign Backend
 * 
 * 支持 Vibe Coding & MCP (Model Context Protocol)
 * 連結地址: https://www.nocodebackend.com/
 */

export interface NCBDBResponse<T = unknown> {
  success: boolean;
  simulated?: boolean;
  data?: T;
  error?: string;
  [key: string]: unknown;
}

export class NCBDBClient {
  private baseUrl: string;
  private token: string;
  private projectId: string;

  constructor() {
    this.baseUrl = process.env.NCBDB_BASE_URL || 'https://www.nocodebackend.com/';
    this.token = process.env.NCBDB_API_TOKEN || '';
    this.projectId = process.env.NCBDB_PROJECT_ID || '';
  }

  private async request<T>(path: string, method: string = 'GET', body?: unknown): Promise<NCBDBResponse<T>> {
    if (!this.token) {
      console.warn('[NCBDB] API Token missing. Running in simulation mode.');
      return { simulated: true, success: true };
    }

    // NCBDB follows the same API structure as standard NocoDB but with custom branding
    const url = `${this.baseUrl}/api/v1/db/data/noco/${this.projectId}${path}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'xc-token': this.token,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `[NCBDB Error] ${response.status}: ${err}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Upsert a record into an NCBDB table
   */
  async upsertRecord(tableName: string, data: Record<string, unknown>): Promise<NCBDBResponse> {
    console.log(`[NCBDB] Upserting to ${tableName}...`);
    return await this.request(`/${tableName}`, 'POST', data);
  }

  /**
   * List records from an NCBDB table
   */
  async listRecords<T>(tableName: string): Promise<NCBDBResponse<T[]>> {
    return await this.request<T[]>(`/${tableName}`, 'GET');
  }
}

export const ncbClient = new NCBDBClient();
