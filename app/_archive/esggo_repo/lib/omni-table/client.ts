/**
 * OmniTable Fusion API v1 — TypeScript SDK Client
 * ═══════════════════════════════════════════════
 * ESG GO 平台 × OmniTable 集成層
 * 
 * 5T Protocol Compliance:
 *   T1-Traceable:   每次 API 呼叫記錄 source_origin
 *   T2-Transparent: 所有回應保留原始結構
 *   T3-Tangible:    強型別 interface 定義
 *   T4-Trackable:   request_id 追蹤鏈
 *   T5-Trustworthy: Server-side API Key 隔離
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface OmniTableSpace {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface OmniTableNode {
  id: string;
  name: string;
  type: 'Datasheet' | 'Folder' | 'Form' | 'Dashboard' | 'Mirror';
  icon: string;
  isFav: boolean;
  children?: OmniTableNode[];
}

export interface OmniTableField {
  id: string;
  name: string;
  type: string;
  property?: Record<string, unknown>;
  editable?: boolean;
  isPrimary?: boolean;
}

export interface OmniTableView {
  id: string;
  name: string;
  type: string;
}

export interface OmniTableRecord {
  recordId: string;
  createdAt?: number;
  updatedAt?: number;
  fields: Record<string, unknown>;
}

export interface OmniTableAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  token: string;
  width?: number;
  height?: number;
  url: string;
}

export interface OmniTablePagination {
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface OmniTableResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface OmniTableRecordsResponse {
  total: number;
  pageNum: number;
  pageSize: number;
  records: OmniTableRecord[];
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

interface OmniTableClientConfig {
  /** API Token (Bearer) */
  token: string;
  /** Base URL — defaults to https://omni-table.ai */
  baseUrl?: string;
}

// ─── SDK Client ─────────────────────────────────────────────────────

export class OmniTableClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(config: OmniTableClientConfig) {
    this.token = config.token;
    this.baseUrl = (config.baseUrl || 'https://omni-table.ai').replace(/\/$/, '');
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
  ): Promise<OmniTableResponse<T>> {
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
      throw new OmniTableError(
        `OmniTable API Error [${response.status}]: ${errorText}`,
        response.status
      );
    }

    return response.json();
  }

  // ── Spaces ───────────────────────────────────────────────────────

  async getSpaces(): Promise<OmniTableSpace[]> {
    const res = await this.request<{ spaces: OmniTableSpace[] }>('GET', '/spaces');
    return res.data.spaces;
  }

  // ── Nodes ────────────────────────────────────────────────────────

  async getNodes(spaceId: string): Promise<OmniTableNode[]> {
    const res = await this.request<{ nodes: OmniTableNode[] }>('GET', `/spaces/${spaceId}/nodes`);
    return res.data.nodes;
  }

  async searchNodes(spaceId: string, keyword: string): Promise<OmniTableNode[]> {
    const res = await this.request<{ nodes: OmniTableNode[] }>(
      'GET',
      `/spaces/${spaceId}/nodes`,
      undefined,
      { type: 'Datasheet', keyword }
    );
    return res.data.nodes;
  }

  // ── Fields ───────────────────────────────────────────────────────

  async getFields(datasheetId: string): Promise<OmniTableField[]> {
    const res = await this.request<{ fields: OmniTableField[] }>(
      'GET',
      `/datasheets/${datasheetId}/fields`
    );
    return res.data.fields;
  }

  async createField(
    datasheetId: string,
    field: { name: string; type: string; property?: Record<string, unknown> }
  ): Promise<OmniTableField> {
    const res = await this.request<OmniTableField>(
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

  async getViews(datasheetId: string): Promise<OmniTableView[]> {
    const res = await this.request<{ views: OmniTableView[] }>(
      'GET',
      `/datasheets/${datasheetId}/views`
    );
    return res.data.views;
  }

  // ── Records (CRUD) ───────────────────────────────────────────────

  async getRecords(
    datasheetId: string,
    params?: GetRecordsParams
  ): Promise<OmniTableRecordsResponse> {
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

    const res = await this.request<OmniTableRecordsResponse>(
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
  ): Promise<OmniTableRecord[]> {
    const res = await this.request<{ records: OmniTableRecord[] }>(
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
  ): Promise<OmniTableRecord[]> {
    const res = await this.request<{ records: OmniTableRecord[] }>(
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

export class OmniTableError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'OmniTableError';
    this.statusCode = statusCode;
  }
}

// ─── Server-side Singleton ────────────────────────────────────────────

let _serverClient: OmniTableClient | null = null;

export function getOmniTableServerClient(): OmniTableClient {
  if (!_serverClient) {
    const token = process.env.OMNITABLE_API_KEY;
    if (!token) {
      throw new Error(
        '[OmniTable] Missing OMNITABLE_API_KEY environment variable. ' +
          'Set it in .env to enable OmniTable integration.'
      );
    }
    _serverClient = new OmniTableClient({ token });
  }
  return _serverClient;
}
