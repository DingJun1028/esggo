import axios from 'axios';
import { omniLogger, LogCategory } from './omniLogger';
import { OmniCoreVerifier } from './omni-verifier';

/**
 * 🛰️ OmniNcbService: NoCodeBackend Integration Wrapper
 * Responsibility: Handle direct server-side communication with NCB for Core Services.
 */
export class OmniNcbService {
    private static readonly CONFIG = {
        instance: process.env.NCB_INSTANCE || '54686_esg_go_ncb',
        token: process.env.NCB_API_TOKEN || '',
        // 全域串接：使用本機 Proxy 路由，確保 Session 與 RLS 生效
        apiUrl: '/api/ncb-auth',
    };

    private static getHeaders() {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Database-Instance': this.CONFIG.instance
        };
        if (this.CONFIG.token) {
            headers['Authorization'] = `Bearer ${this.CONFIG.token}`;
            headers['X-NCB-API-Token'] = this.CONFIG.token;
        }
        return headers;
    }

    /**
     * 💾 saveReport: Persist a sustainability report to NCB.
     */
    public static async saveReport(report: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `NCB: Saving report [${report.title}] to instance ${this.CONFIG.instance}`);

        try {
            const url = `${this.CONFIG.apiUrl}/create/sustainability_reports?Instance=${this.CONFIG.instance}`;
            const res = await axios.post(url, {
                title: report.title,
                company_name: report.company_name || 'InfoOne Corp',
                reporting_year: report.reporting_year || new Date().getFullYear(),
                status: report.status || 'draft',
                report_data: report.payload || {},
                compliance_score: report.complianceScore || 0,
                version: 1,
                published_at: new Date().toISOString()
            }, {
                headers: this.getHeaders()
            });

            return res.data;
        } catch (error) {
            console.error("NCB Save Error:", error);
            omniLogger.info(LogCategory.SYSTEM, `NCB: Failed to save report: ${error}`);
            return { error: true, message: error };
        }
    }

    /**
     * 🔐 anchorEvidence: Save verified evidence to the immutable Evidence Vault.
     */
    public static async anchorEvidence(evidence: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `NCB: Anchoring evidence to Evidence Vault [${evidence.hash_lock}]`);

        try {
            const url = `${this.CONFIG.apiUrl}/create/evidence_vault?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    timestamp: Date.now(),
                    formula: evidence.formula,
                    impact_metric: JSON.stringify(evidence.impact_metric || {}),
                    hash_lock: evidence.hash_lock,
                    source_origin: evidence.source_origin,
                    lifecycle_stage: 'verified'
                })
            });

            if (!res.ok) throw new Error(`NCB Error: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error("NCB Anchor Error:", error);
            omniLogger.info(LogCategory.SYSTEM, `NCB: Failed to anchor evidence: ${error}`);
            return { error: true, message: error };
        }
    }

    /**
     * 🔍 listReports: Fetch all reports for a user (or shared if policy allows).
     */
    public static async listReports(): Promise<any[]> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/sustainability_reports?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                headers: this.getHeaders()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return data.items || [];
        } catch {
            return [];
        }
    }
    /**
     * 📁 saveOmniDraft: Persist OmniUniverse state drafts to NCBDB.
     */
    public static async saveOmniDraft(draftData: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `NCB: Saving OmniDraft to instance ${this.CONFIG.instance}`);
        try {
            const url = `${this.CONFIG.apiUrl}/create/omni_drafts?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    timestamp: Date.now(),
                    data_payload: JSON.stringify(draftData),
                    status: 'draft'
                })
            });

            if (!res.ok) throw new Error(`NCB Error: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error("NCB Save Draft Error:", error);
            return { error: true, message: error };
        }
    }

    /**
     * 📥 fetchOmniDraft: Recover latest OmniUniverse state from NCBDB.
     */
    public static async fetchOmniDraft(): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/omni_drafts?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                headers: this.getHeaders()
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (data && data.items && data.items.length > 0) {
                // Return the most recent draft based on id or timestamp
                const latest = data.items[data.items.length - 1];
                if (latest && latest.data_payload) {
                    return JSON.parse(latest.data_payload);
                }
            }
            return null;
        } catch (error) {
            console.error("NCB Fetch Draft Error:", error);
            return null;
        }
    }

    /**
     * 🏭 Impact Village: Fetch supplier data from NCB.
     */
    public static async fetchSuppliers(): Promise<any[]> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/impact_suppliers?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                headers: this.getHeaders()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return data.items || [];
        } catch (error) {
            console.error("NCB Fetch Suppliers Error:", error);
            return [];
        }
    }

    /**
     * 🌱 Impact Village: Fetch impact metrics from NCB.
     */
    public static async fetchImpactMetrics(): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/impact_metrics?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                headers: this.getHeaders()
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.items?.[0] || null;
        } catch (error) {
            console.error("NCB Fetch Impact Metrics Error:", error);
            return null;
        }
    }

    /**
     * 👥 Impact Village: Fetch community posts from NCB.
     */
    public static async fetchCommunityPosts(): Promise<any[]> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/community_posts?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                headers: this.getHeaders()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return data.items || [];
        } catch (error) {
            console.error("NCB Fetch Community Posts Error:", error);
            return [];
        }
    }

    /**
     * 💾 Impact Village: Save a comment to NCB.
     * 實現評論同步到遠端資料夾（NCB 後端）
     */
    public static async saveComment(comment: {
        postId: string;
        author: string;
        content: string;
    }): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `NCB: Saving comment to post [${comment.postId}]`);

        try {
            // Input Validation
            if (!comment || typeof comment !== 'object') {
                throw new Error('NCB-VAL-ERR: Invalid comment object');
            }
            if (!comment.postId || typeof comment.postId !== 'string') {
                throw new Error('NCB-VAL-ERR: Post ID is required');
            }
            if (!comment.author || typeof comment.author !== 'string') {
                throw new Error('NCB-VAL-ERR: Author is required');
            }
            if (!comment.content || typeof comment.content !== 'string' || comment.content.trim() === '') {
                throw new Error('NCB-VAL-ERR: Comment content is required');
            }

            const url = `${this.CONFIG.apiUrl}/create/community_comments?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    post_id: comment.postId,
                    author: comment.author,
                    content: comment.content.trim(),
                    created_at: new Date().toISOString()
                })
            });

            if (!res.ok) throw new Error(`NCB Error: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error("NCB Save Comment Error:", error);
            omniLogger.info(LogCategory.SYSTEM, `NCB: Failed to save comment: ${error}`);
            return { error: true, message: error };
        }
    }

    /**
     * 💾 Impact Village: Save supplier data to NCB.
     * 包含 5T 驗證：Input Validation + Hash Lock + Object.freeze()
     */
    public static async saveSupplier(supplier: any): Promise<any> {
        try {
            // 1. Input Validation - 透明校驗
            if (!supplier || typeof supplier !== 'object') {
                throw new Error('AGC-VAL-ERR: Invalid supplier object');
            }
            if (!supplier.name || typeof supplier.name !== 'string' || supplier.name.trim() === '') {
                throw new Error('AGC-VAL-ERR: Supplier name is required');
            }
            const validRatings = ['A', 'B', 'C', 'D', 'E'];
            if (!validRatings.includes(supplier.esgRating)) {
                throw new Error('AGC-VAL-ERR: Invalid ESG rating (must be A-E)');
            }
            const validRiskLevels = ['low', 'medium', 'high', 'critical'];
            if (!validRiskLevels.includes(supplier.riskLevel)) {
                throw new Error('AGC-VAL-ERR: Invalid risk level');
            }

            // 2. 準備資料並產生指紋
            const rawData = {
                name: supplier.name,
                esg_rating: supplier.esgRating,
                risk_level: supplier.riskLevel,
                category: supplier.category || 'Other',
                location: supplier.location || 'Unknown',
                created_at: new Date().toISOString()
            };

            // 3. Hash Lock - 誠信鎖定
            const dataString = JSON.stringify(rawData);
            const hashLock = await this.generateHashLock(dataString);

            // 4. 核心禁區：Object.freeze()
            const lockedData = Object.freeze({
                ...rawData,
                hash: hashLock,
                protocol: '5T-2.0-STABLE'
            });

            // 5. 發送到 NCB
            const url = `${this.CONFIG.apiUrl}/create/impact_suppliers?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(lockedData)
            });
            if (!res.ok) throw new Error(`NCB Error: ${res.statusText}`);
            const result = await res.json();
            return Object.freeze(result);
        } catch (error) {
            console.error("NCB Save Supplier Error:", error);
            return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    /**
     * 🏭 Impact Village: Save impact metrics to NCB.
     * 包含 5T 驗證：Input Validation + Hash Lock + Object.freeze()
     */
    public static async saveImpactMetrics(metrics: any): Promise<any> {
        try {
            // 1. Input Validation - 透明校驗
            if (!metrics || typeof metrics !== 'object') {
                throw new Error('AGC-VAL-ERR: Invalid metrics object');
            }

            // 驗證數值範圍 (不可為負，符合物理律)
            if (metrics.sroi !== undefined && (typeof metrics.sroi !== 'number' || metrics.sroi < 0)) {
                throw new Error('AGC-VAL-ERR: SROI must be non-negative number');
            }
            if (metrics.carbonReduction !== undefined && (typeof metrics.carbonReduction !== 'number' || metrics.carbonReduction < 0)) {
                throw new Error('AGC-VAL-ERR: Carbon reduction must be non-negative');
            }
            if (metrics.waterSaved !== undefined && (typeof metrics.waterSaved !== 'number' || metrics.waterSaved < 0)) {
                throw new Error('AGC-VAL-ERR: Water saved must be non-negative');
            }
            if (metrics.communityBeneficiaries !== undefined && (typeof metrics.communityBeneficiaries !== 'number' || metrics.communityBeneficiaries < 0)) {
                throw new Error('AGC-VAL-ERR: Community beneficiaries must be non-negative');
            }
            if (metrics.jobsCreated !== undefined && (typeof metrics.jobsCreated !== 'number' || metrics.jobsCreated < 0)) {
                throw new Error('AGC-VAL-ERR: Jobs created must be non-negative');
            }

            // 2. 準備資料
            const rawData = {
                sroi: metrics.sroi || 0,
                carbon_reduction: metrics.carbonReduction || 0,
                water_saved: metrics.waterSaved || 0,
                community_beneficiaries: metrics.communityBeneficiaries || 0,
                jobs_created: metrics.jobsCreated || 0,
                recorded_at: new Date().toISOString()
            };

            // 3. Hash Lock - 誠信鎖定
            const dataString = JSON.stringify(rawData);
            const hashLock = await this.generateHashLock(dataString);

            // 4. 核心禁區：Object.freeze()
            const lockedData = Object.freeze({
                ...rawData,
                hash: hashLock,
                protocol: '5T-2.0-STABLE'
            });

            // 5. 發送到 NCB
            const url = `${this.CONFIG.apiUrl}/create/impact_metrics?Instance=${this.CONFIG.instance}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(lockedData)
            });
            if (!res.ok) throw new Error(`NCB Error: ${res.statusText}`);
            const result = await res.json();
            return Object.freeze(result);
        } catch (error) {
            console.error("NCB Save Impact Metrics Error:", error);
            return { error: true, message: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    /**
     * 🍃 Carbon: Save carbon record.
     */
    public static async saveCarbonRecord(record: { scope: number, value: number, description: string }): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/create/carbon_records?Instance=${this.CONFIG.instance}`;
            const res = await axios.post(url, {
                scope: record.scope,
                value: record.value,
                description: record.description,
                recorded_at: new Date().toISOString()
            }, {
                headers: this.getHeaders()
            });
            return res.data;
        } catch (error) {
            return { error: true, message: error };
        }
    }

    /**
     * 🍃 Carbon: List carbon records.
     */
    public static async listCarbonRecords(): Promise<any[]> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/carbon_records?Instance=${this.CONFIG.instance}`;
            const res = await axios.get(url, {
                headers: this.getHeaders()
            });
            return res.data.items || [];
        } catch {
            return [];
        }
    }

    /**
     * 🧪 Alchemy: Save or update progress.
     */
    public static async saveAlchemyProgress(progress: { user_id: string, level: number, points: number, rank: string }): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/upsert/alchemy_progress?Instance=${this.CONFIG.instance}`;
            const res = await axios.post(url, progress, {
                headers: this.getHeaders()
            });
            return res.data;
        } catch (error) {
            return { error: true, message: error };
        }
    }

    /**
     * 🧪 Alchemy: Get progress.
     */
    public static async getAlchemyProgress(userId: string): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/alchemy_progress?Instance=${this.CONFIG.instance}&user_id=${userId}`;
            const res = await axios.get(url, {
                headers: this.getHeaders()
            });
            return res.data.items?.[0] || null;
        } catch {
            return null;
        }
    }

    /**
     * 🏆 Impact Nexus: Save leaderboard score.
     */
    public static async saveGameScore(score: { player_name: string, score: number, wins: number }): Promise<any> {
        try {
            const url = `${this.CONFIG.apiUrl}/create/impact_nexus_leaderboard?Instance=${this.CONFIG.instance}`;
            const res = await axios.post(url, score, {
                headers: this.getHeaders()
            });
            return res.data;
        } catch (error) {
            return { error: true, message: error };
        }
    }

    /**
     * 🏆 Impact Nexus: List leaderboard.
     */
    public static async listLeaderboard(): Promise<any[]> {
        try {
            const url = `${this.CONFIG.apiUrl}/list/impact_nexus_leaderboard?Instance=${this.CONFIG.instance}`;
            const res = await axios.get(url, {
                headers: this.getHeaders()
            });
            return res.data.items || [];
        } catch {
            return [];
        }
    }

    /**
     * 🌌 ESG Atoms: Save Atom.
     * With 5T Anchoring: Persists to esg_atoms and anchors to evidence_vault.
     */
    public static async saveAtom(atom: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `NCB: Saving Atom [${atom.uuid}] with 5T Seal.`);

        // 分流到筆記專屬儲存 (Dispatch to note-specific storage)
        if (atom.intent?.includes('OmniSync_Ingest')) {
            return await this.saveNote(atom);
        }

        try {
            // 1. Save to esg_atoms
            const url = `${this.CONFIG.apiUrl}/create/esg_atoms?Instance=${this.CONFIG.instance}`;
            const res = await axios.post(url, {
                uuid: atom.uuid,
                payload: JSON.stringify(atom.payload || {}),
                hash_lock: atom.hash_lock || '',
                domain_ref: atom.domainRef || '',
                impact_metric: atom.impactMetric || '',
                created_at: new Date(atom.timestamp || Date.now()).toISOString()
            }, {
                headers: this.getHeaders()
            });

            // 2. [真善美聯動] Anchor to Evidence Vault if it's a 5T Seal
            if (atom.hash_lock && atom.evidence) {
                await this.anchorEvidence({
                    formula: atom.formula || '5T_MANIFEST_AUTO',
                    impact_metric: atom.payload,
                    hash_lock: atom.hash_lock,
                    source_origin: atom.sourceOrigin || 'OmniOne'
                });
            }

            return res.data;
        } catch (error) {
            console.error("NCB Atom Save Error:", error);
            return { error: true, message: error };
        }
    }

    /**
     * 📝 saveNote: 將筆記原子同步至 notes_atom 表
     */
    public static async saveNote(atom: any): Promise<boolean> {
        try {
            const response = await fetch(`${this.CONFIG.apiUrl}/create/notes_atom`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    uuid: atom.uuid,
                    title: atom.payload.title,
                    content: atom.payload.content,
                    tags: JSON.stringify(atom.tags || []),
                    hash_lock: atom.signature || atom.hash_lock,
                    impact_metric: atom.impactMetric,
                    source_origin: atom.sourceOrigin,
                }),
            });

            if (!response.ok) return false;
            return true;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `NCB Service: Error syncing note [${atom.uuid}]`, error);
            return false;
        }
    }

    /**
     * 📚 listNotes: 從 notes_atom 表召回筆記
     */
    public static async listNotes(): Promise<any[]> {
        try {
            const response = await fetch(`${this.CONFIG.apiUrl}/read/notes_atom`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) return [];
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, "NCB Service: Error listing notes", error);
            return [];
        }
    }

    /**
     * 🔐 Hash Lock 產生器 - 使用 SHA-256
     */
    private static async generateHashLock(data: string): Promise<string> {
        if (typeof window === 'undefined') {
            const crypto = await import('crypto');
            return crypto.createHash('sha256').update(data).digest('hex');
        }
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}

