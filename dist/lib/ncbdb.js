/**
 * NCBDB Client: Nocodebackend DataBase Integration
 * v2.0.0 | High-Efficiency No-Code Sovereign Backend
 *
 * 支持 Vibe Coding & MCP (Model Context Protocol)
 * 連結地址: https://www.nocodebackend.com/
 */
export class NCBDBClient {
    constructor() {
        this.baseUrl = process.env.NCBDB_BASE_URL || 'https://www.nocodebackend.com/';
        this.token = process.env.NCBDB_API_TOKEN || '';
        this.projectId = process.env.NCBDB_PROJECT_ID || '';
    }
    async request(path, method = 'GET', body) {
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
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            return { success: false, error: errorMessage };
        }
    }
    /**
     * Upsert a record into an NCBDB table
     */
    async upsertRecord(tableName, data) {
        console.log(`[NCBDB] Upserting to ${tableName}...`);
        return await this.request(`/${tableName}`, 'POST', data);
    }
    /**
     * List records from an NCBDB table
     */
    async listRecords(tableName) {
        return await this.request(`/${tableName}`, 'GET');
    }
}
export const ncbClient = new NCBDBClient();
//# sourceMappingURL=ncbdb.js.map