/**
 * 🏛️ NCB Service Client — ESG GO Omni Layer
 * Instance: 54686_esg_go_ncb
 *
 * 這是前端 (Client Component) 呼叫 NCB 數據的標準介面。
 * 所有請求均通過 /api/data 或 /api/public-data 的 Next.js 代理路由。
 * 禁止在 Client 端直接呼叫 ncb.nocodebackend.com
 */

// ──────────────────────────────────────────────────────────
// 資料表類型定義 (與 54686_esg_go_ncb Schema 對應)
// ──────────────────────────────────────────────────────────

export interface ServiceModule {
    id: number;
    module_uuid: string; // e.g. "mod-omni-hub-0000"
    domain: "Hub" | "Core" | "Adv" | "Comm" | "Data" | "Infra";
    module_name: string;
    module_name_zh: string;
    route_path: string;
    description?: string;
    icon_name?: string;
    is_active: boolean;
    sort_order: number;
    permission_level: "public" | "user" | "admin" | "superadmin";
    parent_uuid?: string;
    metadata?: string; // JSON string
}

export interface EsgMetric {
    id: number;
    metric_code: string; // e.g. "E_GHG_S1"
    category: "E" | "S" | "G" | "Agent";
    sub_category?: string;
    metric_name: string;
    framework?: string; // e.g. "GRI 305-1 / IFRS S2"
    unit?: string;
    value?: number;
    target_value?: number;
    baseline_year?: number;
    reporting_year: number;
    scope: "Scope1" | "Scope2" | "Scope3" | "N/A";
    data_quality_score: number;
    source_origin?: string;
    evidence_id?: number;
    report_id?: number;
    notes?: string;
    lifecycle_stage: "DRAFT" | "VALIDATED" | "LOCKED" | "ARCHIVED";
    hash_lock: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SustainabilityReport {
    id: number;
    title: string;
    company_name: string;
    reporting_year?: number;
    status?: string;
    report_data?: string; // JSON string
    compliance_score?: number;
    version?: number;
    published_at?: string;
    user_id?: string;
}

export interface EvidenceVault {
    id: number;
    timestamp?: number;
    formula?: string;
    impact_metric?: string;
    hash_lock: string;
    source_origin?: string;
    lifecycle_stage?: string;
    metadata?: string;
    user_id?: string;
}

export interface MaterialityMatrix {
    id: number;
    topic_name: string;
    topic_code?: string;
    gri_standard?: string;
    sdg_mapping?: string;
    financial_impact_score: number;
    impact_score: number;
    stakeholder_concern_score: number;
    is_material: boolean;
    reporting_year: number;
    category: "E" | "S" | "G" | "Economic";
    notes?: string;
}

export interface Stakeholder {
    id: number;
    name: string;
    type: "Employee" | "Investor" | "Customer" | "Supplier" | "Community" | "Regulator" | "Media" | "NGO" | "Other";
    engagement_method?: string;
    frequency?: string;
    key_concerns?: string;
    sentiment?: "Positive" | "Neutral" | "Negative" | "Mixed";
    response_rate?: number;
    reporting_year: number;
}

export interface SupplyChainData {
    id: number;
    supplier_name: string;
    supplier_code?: string;
    country?: string;
    tier: "Tier1" | "Tier2" | "Tier3";
    category?: string;
    esg_score: number;
    human_rights_risk: "Low" | "Medium" | "High" | "Critical";
    environmental_risk: "Low" | "Medium" | "High" | "Critical";
    local_purchase_ratio?: number;
    spend_amount?: number;
    currency: string;
    conflict_minerals_checked: boolean;
    last_audit_date?: string;
    reporting_year: number;
}

export interface OmniCard {
    id: number;
    card_id: string;
    card_name: string;
    card_name_zh?: string;
    card_type: string;
    rarity: string;
    esg_dimension: "E" | "S" | "G" | "Agent";
    sub_category?: string;
    power_score: number;
    description?: string;
    effect_text?: string;
    lore_text?: string;
    framework_ref?: string;
    sdg_tags?: string;
    illustration_prompt?: string;
    image_url?: string;
    color_theme?: string;
    is_active: boolean;
}

export interface OmniDeck {
    id: number;
    deck_id: string;
    deck_name: string;
    deck_name_zh?: string;
    deck_type: string;
    card_ids: string; // JSON string array
    description?: string;
    is_public: boolean;
}

// ──────────────────────────────────────────────────────────
// API 回應類型
// ──────────────────────────────────────────────────────────

export interface NcbListResponse<T> {
    data: T[];
    total?: number;
    page?: number;
}

export interface NcbCreateResponse<T> {
    data: T;
    id: number;
}

// ──────────────────────────────────────────────────────────
// NCB Client 工廠函式
// ──────────────────────────────────────────────────────────

const API_BASE = "/api/data";
const PUBLIC_API_BASE = "/api/public-data";

/**
 * In-flight GET request deduplication map.
 * Parallel calls to the same path share one network request.
 */
const inflight = new Map<string, Promise<unknown>>();

async function ncbFetch<T>(
    path: string,
    options?: any
): Promise<{ data: T | null; error: string | null }> {
    const { retries = 2, ...fetchOptions } = options ?? {};
    const signal = fetchOptions.signal;
    const isReadMethod = !fetchOptions.method || fetchOptions.method === 'GET';
    const key = `${API_BASE}/${path}`;

    // Deduplicate concurrent identical GET requests
    if (isReadMethod && inflight.has(key)) {
        return inflight.get(key) as Promise<{ data: T | null; error: string | null }>;
    }

    const execute = async (): Promise<{ data: T | null; error: string | null }> => {
        let lastError: any;
        for (let attempt = 0; attempt <= retries; attempt++) {
            if (attempt > 0) {
                await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt - 1)));
            }
            try {
                const res = await fetch(key, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    ...fetchOptions,
                    signal,
                });
                if (!res.ok) {
                    const errText = await res.text();
                    const errMsg = `NCB Error [${res.status}]: ${errText}`;
                    if (res.status >= 400 && res.status < 500) {
                        return { data: null, error: errMsg };
                    }
                    lastError = errMsg;
                    continue;
                }
                const json = await res.json();
                return { data: json.data !== undefined ? json.data : json, error: null };
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') throw err;
                lastError = err instanceof Error ? err.message : String(err);
            }
        }
        return { data: null, error: lastError || "Unknown error" };
    };

    const promise = execute().finally(() => {
        if (isReadMethod) inflight.delete(key);
    });

    if (isReadMethod) inflight.set(key, promise);
    return promise;
}


// ──────────────────────────────────────────────────────────
// Service Module API
// ──────────────────────────────────────────────────────────

export const serviceModulesApi = {
    /** 取得所有啟用的模組（依 sort_order 排序） */
    list: (options?: RequestInit) =>
        ncbFetch<NcbListResponse<ServiceModule>>(
            "list/service_modules?sort=sort_order&order=asc&filter=is_active:true",
            options
        ),

    /** 依 domain 篩選模組 */
    listByDomain: (domain: ServiceModule["domain"], options?: RequestInit) =>
        ncbFetch<NcbListResponse<ServiceModule>>(
            `list/service_modules?filter=domain:${domain}`,
            options
        ),

    /** 依 UUID 查詢模組 */
    getByUuid: (uuid: string, options?: RequestInit) =>
        ncbFetch<ServiceModule>(`get/service_modules?filter=module_uuid:${uuid}`, options),
};

// ──────────────────────────────────────────────────────────
// ESG Metrics API
// ──────────────────────────────────────────────────────────

export const esgMetricsApi = {
    /** 取得指定年份的所有 KPI */
    listByYear: (year: number, options?: RequestInit) =>
        ncbFetch<NcbListResponse<EsgMetric>>(
            `list/esg_metrics?filter=reporting_year:${year}`,
            options
        ),

    /** 依類別取得 KPI (E/S/G/Agent) */
    listByCategory: (category: "E" | "S" | "G" | "Agent", year?: number) =>
        ncbFetch<NcbListResponse<EsgMetric>>(
            `list/esg_metrics?filter=category:${category}${year ? `&filter=reporting_year:${year}` : ""}`
        ),

    /** 更新 KPI 數值 */
    updateValue: (id: number, value: number, notes?: string) =>
        ncbFetch<NcbCreateResponse<EsgMetric>>(`update/esg_metrics/${id}`, {
            method: "PUT",
            body: JSON.stringify({ value, notes }),
        }),
};

// ──────────────────────────────────────────────────────────
// Sustainability Reports API
// ──────────────────────────────────────────────────────────

export const reportsApi = {
    /** 列出我的所有報告 */
    list: (options?: RequestInit) =>
        ncbFetch<NcbListResponse<SustainabilityReport>>("list/sustainability_reports", options),

    /** 建立新報告 */
    create: (data: Omit<SustainabilityReport, "id" | "user_id">, options?: RequestInit) =>
        ncbFetch<NcbCreateResponse<SustainabilityReport>>(
            "create/sustainability_reports",
            { method: "POST", body: JSON.stringify(data), ...options }
        ),

    /** 取得單筆報告 */
    get: (id: number) =>
        ncbFetch<SustainabilityReport>(`get/sustainability_reports/${id}`),
};

// ──────────────────────────────────────────────────────────
// Evidence Vault API (公開可讀，需 shared_read + public_scoped_read)
// ──────────────────────────────────────────────────────────

export const evidenceVaultApi = {
    /** 列出我的證據（需登入） */
    list: () =>
        ncbFetch<NcbListResponse<EvidenceVault>>("list/evidence_vault"),

    /** 公開查詢（不需登入，查詢特定 owner 的公開證據） */
    publicList: (ownerId: string) =>
        fetch(`${PUBLIC_API_BASE}/list/evidence_vault?owner_id=${ownerId}`, {
            headers: { "Content-Type": "application/json" },
        }).then((r) => r.json()) as Promise<NcbListResponse<EvidenceVault>>,
};

// ──────────────────────────────────────────────────────────
// User Profile API (userdb)
// ──────────────────────────────────────────────────────────

export interface UserProfile {
    id: number;
    wallet_address?: string;
    display_name?: string;
    avatar_url?: string;
    email?: string;
    role?: string;
    status?: string;
    user_id?: string;
    unlocked_cards?: string; // JSON string array of card IDs
}

export const userProfilesApi = {
    /** 取得當前登入使用者的 Profile */
    async getCurrentProfile(userId: string): Promise<NcbListResponse<UserProfile>> {
        const query = new URLSearchParams({
            q: JSON.stringify({ user_id: { $eq: userId } }),
            limit: "1"
        });
        const res = await fetch(`${PUBLIC_API_BASE}/list/user_profiles?${query.toString()}`, {
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
    },

    /** 更新目前登入使用者的 Profile（例如解鎖新卡片） */
    async updateProfile(id: number, data: Partial<UserProfile>): Promise<NcbCreateResponse<UserProfile>> {
        const res = await fetch(`${PUBLIC_API_BASE}/update/user_profiles/${id}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update user profile");
        return res.json();
    }
};

// ──────────────────────────────────────────────────────────
// RAG & Gnosis API (userdb)
// ──────────────────────────────────────────────────────────

export interface KnowledgeChunk {
    id: number;
    atom_uuid: string;
    content: string;
    vector_id?: string; // Reference to external vector store ID if needed
    embedding?: string; // Store pseudo-vector or small embeddings as string
    metadata?: string;
    source_origin?: string;
    user_id?: string;
}

export interface RagSession {
    id: number;
    session_uuid: string;
    title?: string;
    context_summary?: string;
    last_query?: string;
    last_response?: string;
    metadata?: string;
    user_id?: string;
}

export interface DigitalTwin {
    id: number;
    twin_uuid: string;
    nickname: string;
    avatar_type: 'SOVEREIGN' | 'SENTIENT' | 'OMNI';
    level: number;
    exp: number;
    rank: string;
    virtues: string; // JSON string of IVirtueFingerprint
    nature_law: string;
    closing_law: string;
    metadata?: string; // Additional AI personality / RAG settings
    user_id?: string;
}

export const userTwinsApi = {
    /** 取得使用者的數位分身 */
    getByUserId: async (userId: string): Promise<NcbListResponse<DigitalTwin>> => {
        const query = new URLSearchParams({
            q: JSON.stringify({ user_id: { $eq: userId } }),
            limit: "1"
        });
        const res = await fetch(`${PUBLIC_API_BASE}/list/digital_twins?${query.toString()}`, {
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Failed to fetch digital twin");
        return res.json();
    },

    /** 建立或更新數位分身 */
    upsert: async (data: Partial<DigitalTwin>): Promise<NcbCreateResponse<DigitalTwin>> => {
        const path = data.id ? `update/digital_twins/${data.id}` : "create/digital_twins";
        const res = await fetch(`${PUBLIC_API_BASE}/${path}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to upsert digital twin");
        return res.json();
    }
};

export const gnosisRAGApi = {
    /** 搜尋相關知識切片 */
    searchChunks: (query: string, limit: number = 5) =>
        ncbFetch<NcbListResponse<KnowledgeChunk>>(`list/knowledge_chunks?limit=${limit}&q=${JSON.stringify({ content: { $like: `%${query}%` } })}`),

    /** 建立知識切片 */
    ingrainChunk: (data: Omit<KnowledgeChunk, "id">) =>
        ncbFetch<NcbCreateResponse<KnowledgeChunk>>("create/knowledge_chunks", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    /** 建立或取得 RAG Session */
    getOrCreateSession: (uuid: string, title?: string) =>
        ncbFetch<NcbCreateResponse<RagSession>>("create/rag_sessions", {
            method: "POST",
            body: JSON.stringify({ session_uuid: uuid, title }),
        }),
};

// ──────────────────────────────────────────────────────────
// Omni Cards & Decks API (Prototype Integration)
// ──────────────────────────────────────────────────────────

export const omniCardsApi = {
    /** 取得所有原型卡牌 (分頁) */
    list: (page: number = 1, limit: number = 20) =>
        ncbFetch<NcbListResponse<OmniCard>>(`list/omni_cards?page=${page}&limit=${limit}&sort=sort_order&order=asc`),

    /** 依維度搜尋卡牌 */
    listByDimension: (dimension: "E" | "S" | "G") =>
        ncbFetch<NcbListResponse<OmniCard>>(`list/omni_cards?filter=esg_dimension:${dimension}`),

    /** 依 ID 取得卡牌 */
    get: (cardId: string) =>
        ncbFetch<OmniCard>(`get/omni_cards?filter=card_id:${cardId}`),
};

export const omniDecksApi = {
    /** 取得系統預設牌組 */
    listSystemDecks: () =>
        ncbFetch<NcbListResponse<OmniDeck>>("list/omni_card_decks?filter=deck_type:System"),

    /** 取得單一牌組詳情 */
    get: (deckId: string) =>
        ncbFetch<OmniDeck>(`get/omni_card_decks?filter=deck_id:${deckId}`),
};
