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
// ─── SDK Client ─────────────────────────────────────────────────────
export class OmniTableClient {
    constructor(config) {
        this.token = config.token;
        this.baseUrl = (config.baseUrl || 'https://omni-table.ai').replace(/\/$/, '');
    }
    get headers() {
        return {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }
    async request(method, path, body, params) {
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
            throw new OmniTableError(`OmniTable API Error [${response.status}]: ${errorText}`, response.status);
        }
        return response.json();
    }
    // ── Spaces ───────────────────────────────────────────────────────
    async getSpaces() {
        const res = await this.request('GET', '/spaces');
        return res.data.spaces;
    }
    // ── Nodes ────────────────────────────────────────────────────────
    async getNodes(spaceId) {
        const res = await this.request('GET', `/spaces/${spaceId}/nodes`);
        return res.data.nodes;
    }
    async searchNodes(spaceId, keyword) {
        const res = await this.request('GET', `/spaces/${spaceId}/nodes`, undefined, { type: 'Datasheet', keyword });
        return res.data.nodes;
    }
    // ── Fields ───────────────────────────────────────────────────────
    async getFields(datasheetId) {
        const res = await this.request('GET', `/datasheets/${datasheetId}/fields`);
        return res.data.fields;
    }
    async createField(datasheetId, field) {
        const res = await this.request('POST', `/datasheets/${datasheetId}/fields`, field);
        return res.data;
    }
    async deleteField(datasheetId, fieldId) {
        await this.request('DELETE', `/datasheets/${datasheetId}/fields/${fieldId}`);
    }
    // ── Views ────────────────────────────────────────────────────────
    async getViews(datasheetId) {
        const res = await this.request('GET', `/datasheets/${datasheetId}/views`);
        return res.data.views;
    }
    // ── Records (CRUD) ───────────────────────────────────────────────
    async getRecords(datasheetId, params) {
        const queryParams = {};
        if (params?.viewId)
            queryParams.viewId = params.viewId;
        if (params?.pageNum)
            queryParams.pageNum = params.pageNum;
        if (params?.pageSize)
            queryParams.pageSize = params.pageSize;
        if (params?.maxRecords)
            queryParams.maxRecords = params.maxRecords;
        if (params?.fieldKey)
            queryParams.fieldKey = params.fieldKey;
        if (params?.filterByFormula)
            queryParams.filterByFormula = params.filterByFormula;
        if (params?.fields)
            queryParams['fields[]'] = params.fields.join(',');
        if (params?.recordIds)
            queryParams['recordIds[]'] = params.recordIds.join(',');
        if (params?.sort)
            queryParams.sort = JSON.stringify(params.sort);
        const res = await this.request('GET', `/datasheets/${datasheetId}/records`, undefined, queryParams);
        return res.data;
    }
    async createRecords(datasheetId, records, fieldKey = 'name') {
        const res = await this.request('POST', `/datasheets/${datasheetId}/records`, { records, fieldKey });
        return res.data.records;
    }
    async updateRecords(datasheetId, records, fieldKey = 'name') {
        const res = await this.request('PATCH', `/datasheets/${datasheetId}/records`, { records, fieldKey });
        return res.data.records;
    }
    async deleteRecords(datasheetId, recordIds) {
        const idsParam = recordIds.map((id) => `recordIds=${id}`).join('&');
        await this.request('DELETE', `/datasheets/${datasheetId}/records?${idsParam}`);
    }
    // ── Datasheets ──────────────────────────────────────────────────
    async createDatasheet(spaceId, payload) {
        const res = await this.request('POST', `/spaces/${spaceId}/datasheets`, payload);
        return res.data;
    }
    // ── Embed Links ─────────────────────────────────────────────────
    async getEmbedLinks(spaceId, nodeId) {
        const res = await this.request('GET', `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`);
        return res.data.linkList;
    }
    async createEmbedLink(spaceId, nodeId, payload) {
        const res = await this.request('POST', `/spaces/${spaceId}/nodes/${nodeId}/embedlinks`, { payload });
        return res.data;
    }
}
// ─── Error Class ──────────────────────────────────────────────────────
export class OmniTableError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'OmniTableError';
        this.statusCode = statusCode;
    }
}
// ─── Server-side Singleton ────────────────────────────────────────────
let _serverClient = null;
export function getOmniTableServerClient() {
    if (!_serverClient) {
        const token = process.env.OMNITABLE_API_KEY;
        if (!token) {
            throw new Error('[OmniTable] Missing OMNITABLE_API_KEY environment variable. ' +
                'Set it in .env to enable OmniTable integration.');
        }
        _serverClient = new OmniTableClient({ token });
    }
    return _serverClient;
}
//# sourceMappingURL=client.js.map