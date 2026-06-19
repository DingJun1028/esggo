/**
 * AITable Fusion API v1 — TypeScript SDK Client
 * ═══════════════════════════════════════════════
 * ESG GO 平台 × AITable 集成層
 * 
 * 5T Protocol Compliance:
 *   T1-Traceable:   每次 API 呼叫記錄 source_origin
 *   T2-Transparent: 所有回應保留原始結構
 *   T3-Tangible:    強型別 interface 定義
 *   T4-Trackable:   request_id 追蹤鏈
 *   T5-Trustworthy: Server-side API Key 隔離
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface AITableSpace {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface AITableNode {
  id: string;
  name: string;
  type: 'Datasheet' | 'Folder' | 'Form' | 'Dashboard' | 'Mirror';
  icon: string;
  isFav: boolean;
  children?: AITableNode[];
}

export interface AITableField {
  id: string;
  name: string;
  type: string;
  property?: Record<string, unknown>;
  editable?: boolean;
  isPrimary?: boolean;
}

export interface AITableView {
  id: string;
  name: string;
  type: string;
}

export interface AITableRecord {
  recordId: string;
  createdAt?: number;
  updatedAt?: number;
  fields: Record<string, unknown>;
}

export interface AITableAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  token: string;
  width?: number;
  height?: number;
  url: string;
}

export interface AITablePagination {
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface AITableResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface AITableRecordsResponse {
  total: number;
  pageNum: number;
  pageSize: number;
  records: AITableRecord[];
}

export interface GetRecordsParams {
  viewId?: string;
  sort?: Array<{ field: string; order: 'asc' | 'desc' }>;
  recordIds?: string[];
  fields?: string[];
  filterByFormula?: string;
  maxRecords?: number;
  pageNum?: number;
  pageSize?: number;
  fieldKey?: 'id' | 'name';
}

export interface CreateRecordPayload {
  fields: Record<string, unknown>;
}

export interface UpdateRecordPayload {
  recordId: string;
  fields: Record<string, unknown>;
}

// ─── Client Configuration ────────────────────────────────────────────

interface AITableClientConfig {
  /** API Token (Bearer) */
  token: string;
  /** Base URL — defaults to https://aitable.ai */
  baseUrl?: string;
}

// ─── SDK Client ─────────────────────────────────────────────────────

export class AITableClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(config: AITableClientConfig) {
    this.token = config.token;
    this.baseUrl = (config.baseUrl || 'https://aitable.ai').replace(/\/$/, '');
  }

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<AITableResponse<T>> {
    const url = new URL(`/fusion/v1${path}`, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new AITableError(
        `AITable API Error [${response.status}]: ${errorText}`,
        response.status
      );
    }

    return response.json();
  }

  // ── Spaces ───────────────────────────────────────────────────────

  async getSpaces(): Promise<AITableSpace[]> {
    const res = await this.request<{ spaces: AITableSpace[] }>('GET', '/spaces');
    return res.data.spaces;
  }

  // ── Nodes ────────────────────────────────────────────────────────

  async getNodes(spaceId: string): Promise<AITableNode[]> {
    const res = await this.request<{ nodes: AITableNode[] }>('GET', `/spaces/${spaceId}/nodes`);
    return res.data.nodes;
  }

  async searchNodes(spaceId: string, keyword: string): Promise<AITableNode[]> {
    const res = await this.request<{ nodes: AITableNode[] }>(
      'GET',
      `/spaces/${spaceId}/nodes`,
      undefined,
      { type: 'Datasheet', keyword } as any
    );
    return res.data.nodes;
  }

  // ── Fields ───────────────────────────────────────────────────────

  async getFields(datasheetId: string): Promise<AITableField[]> {
    const res = await this.request<{ fields: AITableField[] }>(
      'GET',
      `/datasheets/${datasheetId}/fields`
    );
    return res.data.fields;
  }

  async createField(
    datasheetId: string,
    field: { name: string; type: string; property?: Record<string, unknown> }
  ): Promise<AITableField> {
    const res = await this.request<AITableField>(
      'POST',
      `/datasheets/${datasheetId}/fields`,
      field
    );
    return res.data;
  }

  async deleteField(datasheetId: string, fieldId: string): Promise<void> {
    await this.request<void>('DELETE', `/datasheets/${datasheetId}/fields/${fieldId}`);
  }

  // ── Views ────────────────────────────────────────────────────────

  async getViews(datasheetId: string): Promise<AITableView[]> {
    const res = await this.request<{ views: AITableView[] }>(
      'GET',
      `/datasheets/${datasheetId}/views`
    );
    return res.data.views;
  }

  // ── Records (CRUD) ───────────────────────────────────────────────

  async getRecords(
    datasheetId: string,
    params?: GetRecordsParams
  ): Promise<AITableRecordsResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.viewId) queryParams.viewId = params.viewId;
    if (params?.pageNum) queryParams.pageNum = params.pageNum;
    if (params?.pageSize) queryParams.pageSize = params.pageSize;
    if (params?.maxRecords) queryParams.maxRecords = params.maxRecords;
    if (params?.fieldKey) queryParams.fieldKey = params.fieldKey;
    if (params?.filterByFormula) queryParams.filterByFormula = params.filterByFormula;
    if (params?.fields) queryParams['fields[]'] = params.fields.join(',');
    if (params?.recordIds) queryParams['recordIds[]'] = params.recordIds.join(',');
    if (params?.sort) queryParams.sort = JSON.stringify(params.sort);

    const res = await this.request<AITableRecordsResponse>(
      'GET',
      `/datasheets/${datasheetId}/records`,
      undefined,
      queryParams
    );
    return res.data;
  }

  async createRecords(
    datasheetId: string,
    records: CreateRecordPayload[],
    fieldKey: 'id' | 'name' = 'name'
  ): Promise<AITableRecord[]> {
    const res = await this.request<{ records: AITableRecord[] }>(
      'POST',
      `/datasheets/${datasheetId}/records`,
      { records, fieldKey }
    );
    return res.data.records;
  }

  async updateRecords(
    datasheetId: string,
    records: UpdateRecordPayload[],
    fieldKey: 'id' | 'name' = 'name'
  ): Promise<AITableRecord[]> {
    const res = await this.request<{ records: AITableRecord[] }>(
      'PATCH',
      `/datasheets/${datasheetId}/records`,
      { records, fieldKey }
    );
    return res.data.records;
  }

  async deleteRecords(datasheetId: string, recordIds: string[]): Promise<void> {
    const idsParam = recordIds.map((id) => `recordIds=${id}`).join('&');
    await this.request<void>(
      'DELETE',
      `/datasheets/${datasheetId}/records?${idsParam}`
    );
  }

  // ── Datasheets ──────────────────────────────────────────────────

  async createDatasheet(
    spaceId: string,
    payload: {
      name: string;
      description?: string;
      folderId?: string;
      fields: Array<{ name: string; type: string; property?: Record<string, unknown> }>;
    }
  ): Promise<{ id: string; createdAt: number }> {
    const res = await this.request<{ id: string; createdAt: number }>(
      'POST',
      `/spaces/${spaceId}/datasheets`,
      payload
    );
    return res.data;
  }

  // ── Embed Links ─────────────────────────────────────────────────

  async getEmbedLinks(
    spaceId: string,
    nodeId: string
  ): Promise<Array<{ linkId: string; url: string; payload: Record<string, unknown> }>> {
    const res = await this.request<{
      linkList: Array<{ linkId: string; url: string; payload: Record<string, unknown> }>;
    }>('GET', `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`);
    return res.data.linkList;
  }

  async createEmbedLink(
    spaceId: string,
    nodeId: string,
    payload: { isEnabledWatermark?: boolean; viewControl?: Record<string, unknown> }
  ): Promise<{ linkId: string; url: string }> {
    const res = await this.request<{ linkId: string; url: string }>(
      'POST',
      `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`,
      { payload }
    );
    return res.data;
  }
}

// ─── Error Class ──────────────────────────────────────────────────────

export class AITableError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AITableError';
    this.statusCode = statusCode;
  }
}

// ─── Server-side Singleton ────────────────────────────────────────────

let _serverClient: AITableClient | null = null;

export function getAITableServerClient(): AITableClient {
  if (!_serverClient) {
    const token = process.env.AITABLE_API_KEY;
    if (!token) {
      throw new Error(
        '[AITable] Missing AITABLE_API_KEY environment variable. ' +
          'Set it in .env to enable AITable integration.'
      );
    }
    _serverClient = new AITableClient({ token });
  }
  return _serverClient;
}
